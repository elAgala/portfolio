import { existsSync, chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
    const runner = 'ghcr.io/agala-labs/ansible-runner@sha256:e6ac4030f113aa62d6f5ca26fb487305363db81192a8d8275416eacb01349e38'

    expect(workflow).toContain('event: deployment')
    expect(workflow).toContain('branch: master')
    expect(workflow).toContain('CI_PIPELINE_DEPLOY_TARGET == "portfolio_production"')
    expect(workflow).toContain(`image: ${resolver}`)
    expect(workflow).toContain('echo $CI_SCRIPT | base64 -d | /busybox/sh -e')
    expect(workflow).toContain('commands:\n      - /busybox/sh deploy/resolve-release-image.sh')
    expect(workflow).toContain(`image: ${runner}`)
    expect(workflow).toContain('RELEASE_SERVICE: portfolio-site')
    expect(workflow).toContain('RELEASE_IMAGE_FILE: .release/image.txt')
    expect(workflow).toContain('RELEASE_SOURCE_SHA: 92b05177c2b67047e043ae1855d21b3ae86dc014')
    expect(workflow).toContain('RELEASE_APPROVED_ARTIFACT: "true"')
    expect(workflow).toContain('from_secret: portfolio_registry_username')
    expect(workflow).toContain('from_secret: portfolio_registry_password')
    expect(workflow).toContain('partial: false')
    expect(workflow).toContain('RELEASE_IAC_REVISION: 556584e88f9b44d9ced5e2ffb9d154e2341f4c6d')
    expect(workflow).toContain('K3S_RELEASE_KUBECONFIG_B64:')
    expect(workflow).toContain('from_secret: k3s_release_kubeconfig_b64')
    expect(workflow).toContain('from_secret: platform_git_release_token')
    expect(workflow).toContain('protected force-with-lease fails closed')
    expect(workflow).not.toContain('concurrency:')
    expect(workflow).not.toContain('volumes:')
    expect(workflow).not.toContain('/etc/agala/woodpecker/release-kubeconfig')
    expect(workflow).not.toContain('KUBECONFIG:')
    expect(workflow).not.toContain('RELEASE_IMAGE:')
    expect(workflow).not.toContain('INFISICAL_CLIENT_ID')
    expect(workflow).not.toContain('INFISICAL_CLIENT_SECRET')
    expect(workflow).not.toContain('latest')
  })

  it('pins the existing approved artifact independently of the workflow revision', () => {
    const artifact = JSON.parse(readFileSync(resolve('deploy/release-artifact.json'), 'utf8'))
    const workflow = readFileSync(resolve('.woodpecker/release.yml'), 'utf8')
    expect(artifact.service).toBe('portfolio-site')
    expect(artifact.sourceSha).toBe('92b05177c2b67047e043ae1855d21b3ae86dc014')
    expect(artifact.image).toBe('ghcr.io/elagala/portfolio@sha256:2b4035d58cf6feea7a68f904d7bdbb0197234742bcbc1ee9a94ab8e8361f9e54')
    expect(workflow).toContain(`RELEASE_SOURCE_SHA: ${artifact.sourceSha}`)
    expect(workflow).toContain(`RELEASE_EXPECTED_DIGEST: ${artifact.image.split('@')[1]}`)
  })

  it('bakes health provenance into a non-root Nginx image', () => {
    const dockerfile = readFileSync(resolve('Dockerfile'), 'utf8')
    const config = readFileSync(resolve('deploy/nginx.conf'), 'utf8')
    expect(dockerfile).toMatch(/FROM nginxinc\/nginx-unprivileged:stable-alpine@sha256:[0-9a-f]{64}/)
    expect(dockerfile).toContain('USER 10001:10001')
    expect(dockerfile).toContain('ENTRYPOINT ["nginx"]')
    expect(dockerfile).toContain('s/__VCS_REF__/$VCS_REF/g')
    expect(config).toContain('add_header X-Agala-Revision "__VCS_REF__" always;')
    expect(config).toContain('listen 8080;')
    expect(existsSync(resolve('deploy/Caddyfile'))).toBe(false)
  })

  it('resolves the approved source using private registry auth and verifies the digest', () => {
    const directory = mkdtempSync(resolve(tmpdir(), 'portfolio-release-'))
    const crane = resolve(directory, 'crane')
    const record = resolve(directory, 'image.txt')
    const revision = 'a'.repeat(40)
    writeFileSync(crane, `#!/bin/sh
case "$1" in
  auth) cat >/dev/null; printf '%s\\n' "$DOCKER_CONFIG" > "$MOCK_CONFIG_PATH" ;;
  digest) printf 'sha256:%s\\n' "${'b'.repeat(64)}" ;;
  config) printf '{"config":{"Labels":{"org.opencontainers.image.revision":"%s"}}}\\n' "\${MOCK_REVISION:-$RELEASE_SOURCE_SHA}" ;;
  *) exit 2 ;;
esac
`)
    chmodSync(crane, 0o700)

    try {
      const result = spawnSync('sh', ['deploy/resolve-release-image.sh'], {
        cwd: resolve('.'),
        env: {
          ...process.env,
          CI_COMMIT_SHA: 'd'.repeat(40),
          RELEASE_SOURCE_SHA: revision,
          RELEASE_EXPECTED_DIGEST: `sha256:${'b'.repeat(64)}`,
          REGISTRY_USERNAME: 'test',
          REGISTRY_PASSWORD: 'test-only-not-a-real-token',
          MOCK_CONFIG_PATH: resolve(directory, 'config-path'),
          CRANE_BIN: crane,
          RELEASE_IMAGE_FILE: record,
        },
        encoding: 'utf8',
      })

      expect(result.status, result.stderr).toBe(0)
      expect(readFileSync(record, 'utf8')).toBe(`ghcr.io/elagala/portfolio@sha256:${'b'.repeat(64)}\n`)
      expect(existsSync(readFileSync(resolve(directory, 'config-path'), 'utf8').trim())).toBe(false)
      expect(result.stdout + result.stderr).not.toContain('test-only-not-a-real-token')
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it('rejects a digest whose image revision differs from the approved source', () => {
    const directory = mkdtempSync(resolve(tmpdir(), 'portfolio-release-mismatch-'))
    const crane = resolve(directory, 'crane')
    writeFileSync(crane, `#!/bin/sh
case "$1" in
  auth) cat >/dev/null; printf '%s\\n' "$DOCKER_CONFIG" > "$MOCK_CONFIG_PATH" ;;
  digest) printf 'sha256:%s\\n' "${'b'.repeat(64)}" ;;
  config) printf '{"config":{"Labels":{"org.opencontainers.image.revision":"%s"}}}\\n' "${'c'.repeat(40)}" ;;
esac
`)
    chmodSync(crane, 0o700)

    try {
      const result = spawnSync('sh', ['deploy/resolve-release-image.sh'], {
        cwd: resolve('.'),
        env: {...process.env, RELEASE_SOURCE_SHA: 'a'.repeat(40), RELEASE_EXPECTED_DIGEST: `sha256:${'b'.repeat(64)}`, REGISTRY_USERNAME: 'test', REGISTRY_PASSWORD: 'test-only', MOCK_CONFIG_PATH: resolve(directory, 'config-path'), CRANE_BIN: crane},
        encoding: 'utf8',
      })

      expect(result.status).toBe(1)
      expect(result.stderr).toContain('image revision label does not match')
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
  it.each(['wrong-digest', 'login-failure'])('rejects %s and removes temporary credentials', (failure) => {
    const directory = mkdtempSync(resolve(tmpdir(), 'portfolio-release-rejected-'))
    const crane = resolve(directory, 'crane')
    const record = resolve(directory, 'image.txt')
    const configPath = resolve(directory, 'config-path')
    writeFileSync(crane, `#!/bin/sh
case "$1" in
  auth)
    cat >/dev/null
    printf '%s\\n' "$DOCKER_CONFIG" > "$MOCK_CONFIG_PATH"
    printf '{}' > "$DOCKER_CONFIG/config.json"
    [ "$MOCK_FAILURE" != login-failure ] ;;
  digest) printf 'sha256:%s\\n' "${'c'.repeat(64)}" ;;
  *) exit 9 ;;
esac
`)
    chmodSync(crane, 0o700)
    try {
      const result = spawnSync('sh', ['deploy/resolve-release-image.sh'], {
        cwd: resolve('.'),
        env: {
          ...process.env,
          RELEASE_SOURCE_SHA: 'a'.repeat(40),
          RELEASE_EXPECTED_DIGEST: `sha256:${'b'.repeat(64)}`,
          REGISTRY_USERNAME: 'test',
          REGISTRY_PASSWORD: 'test-only-not-a-real-token',
          MOCK_CONFIG_PATH: configPath,
          MOCK_FAILURE: failure,
          CRANE_BIN: crane,
          RELEASE_IMAGE_FILE: record,
        },
        encoding: 'utf8',
      })
      expect(result.status).not.toBe(0)
      expect(existsSync(record)).toBe(false)
      expect(existsSync(readFileSync(configPath, 'utf8').trim())).toBe(false)
      expect(result.stdout + result.stderr).not.toContain('test-only-not-a-real-token')
      if (failure === 'wrong-digest') expect(result.stderr).toContain('resolved digest differs')
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

})
