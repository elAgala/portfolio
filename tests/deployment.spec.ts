import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

describe('portfolio release boundary', () => {
  it('publishes on master without an implicit SSH deployment', () => {
    const workflow = readFileSync(resolve('.woodpecker/deploy.yml'), 'utf8')

    expect(workflow).toContain('name: build-portfolio')
    expect(workflow).not.toContain('name: deploy-portfolio')
    expect(workflow).not.toContain('SSH_DEPLOY_KEY')
    expect(workflow).not.toContain('ANSIBLE_PLAYBOOK')
  })

  it('releases only an approved Portfolio deployment with pinned executors', () => {
    const workflow = readFileSync(resolve('.woodpecker/release.yml'), 'utf8')
    const resolver = 'gcr.io/go-containerregistry/crane/debug@sha256:54b27703e6c602fbd6f95712910e9c8d45d4361a59274bde38aeec943734e424'
    const runner = 'ghcr.io/agala-labs/ansible-runner@sha256:ecd7fd6d6a1d33a93f593f16b074341e94f2321f80d2e492577ed5b7cf23ed45'

    expect(workflow).toContain('event: deployment')
    expect(workflow).toContain('branch: master')
    expect(workflow).toContain('CI_PIPELINE_DEPLOY_TARGET == "portfolio_production"')
    expect(workflow).toContain(`image: ${resolver}`)
    expect(workflow).toContain('echo $CI_SCRIPT | base64 -d | /busybox/sh -e')
    expect(workflow).toContain('commands:\n      - /busybox/sh deploy/resolve-release-image.sh')
    expect(workflow).toContain(`image: ${runner}`)
    expect(workflow).toContain('RELEASE_SERVICE: portfolio-site')
    expect(workflow).toContain('RELEASE_IMAGE_FILE: .release/image.txt')
    expect(workflow).toContain('RELEASE_SOURCE_SHA: ${CI_COMMIT_SHA}')
    expect(workflow).toContain('RELEASE_IAC_REVISION: e268853184fa83ca9ddd88f3bd74dbf78fff43ad')
    expect(workflow).toContain('from_secret: platform_git_release_token')
    expect(workflow).toContain('/etc/agala/woodpecker/release-kubeconfig:/run/secrets/release-kubeconfig:ro')
    expect(workflow).toContain('protected force-with-lease fails closed')
    expect(workflow).not.toContain('concurrency:')
    expect(workflow).not.toContain('RELEASE_IMAGE:')
    expect(workflow).not.toContain('latest')
  })

  it('exposes the immutable source revision through health', () => {
    const dockerfile = readFileSync(resolve('Dockerfile'), 'utf8')
    const caddyfile = readFileSync(resolve('deploy/Caddyfile'), 'utf8')

    expect(dockerfile).toContain('VCS_REF=${VCS_REF}')
    expect(caddyfile).toContain('header X-Agala-Revision "{env.VCS_REF}"')
  })

  it('resolves the deployment commit to a verified digest record', () => {
    const directory = mkdtempSync(resolve(tmpdir(), 'portfolio-release-'))
    const crane = resolve(directory, 'crane')
    const record = resolve(directory, 'image.txt')
    const revision = 'a'.repeat(40)
    writeFileSync(crane, `#!/bin/sh
case "$1" in
  digest) printf 'sha256:%s\\n' "${'b'.repeat(64)}" ;;
  config) printf '{"config":{"Labels":{"org.opencontainers.image.revision":"%s"}}}\\n' "\${MOCK_REVISION:-$CI_COMMIT_SHA}" ;;
  *) exit 2 ;;
esac
`)
    chmodSync(crane, 0o700)

    try {
      const result = spawnSync('sh', ['deploy/resolve-release-image.sh'], {
        cwd: resolve('.'),
        env: {
          ...process.env,
          CI_COMMIT_SHA: revision,
          CRANE_BIN: crane,
          RELEASE_IMAGE_FILE: record,
        },
        encoding: 'utf8',
      })

      expect(result.status, result.stderr).toBe(0)
      expect(readFileSync(record, 'utf8')).toBe(`ghcr.io/elagala/portfolio@sha256:${'b'.repeat(64)}\n`)
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('rejects a digest whose image revision differs from the deployment commit', () => {
    const directory = mkdtempSync(resolve(tmpdir(), 'portfolio-release-mismatch-'))
    const crane = resolve(directory, 'crane')
    writeFileSync(crane, `#!/bin/sh
case "$1" in
  digest) printf 'sha256:%s\\n' "${'b'.repeat(64)}" ;;
  config) printf '{"config":{"Labels":{"org.opencontainers.image.revision":"%s"}}}\\n' "${'c'.repeat(40)}" ;;
esac
`)
    chmodSync(crane, 0o700)

    try {
      const result = spawnSync('sh', ['deploy/resolve-release-image.sh'], {
        cwd: resolve('.'),
        env: {...process.env, CI_COMMIT_SHA: 'a'.repeat(40), CRANE_BIN: crane},
        encoding: 'utf8',
      })

      expect(result.status).toBe(1)
      expect(result.stderr).toContain('image revision label does not match')
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
