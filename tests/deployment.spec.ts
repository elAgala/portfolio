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

  it('releases only the selected Portfolio commit with pinned executors', () => {
    const workflow = readFileSync(resolve('.woodpecker/release.yml'), 'utf8')
    const resolver = 'gcr.io/go-containerregistry/crane/debug@sha256:54b27703e6c602fbd6f95712910e9c8d45d4361a59274bde38aeec943734e424'
    const runner = 'ghcr.io/agala-labs/ansible-runner@sha256:ebe67efc85f6126bfb4d623b94cbba68fcd94a145819bf36312dea0ec4c03cb2'

    expect(workflow).toContain('event: push')
    expect(workflow).toContain('branch: master')
    expect(workflow).toContain('depends_on:\n  - deploy')
    expect(workflow).not.toContain('CI_PIPELINE_DEPLOY_TARGET')
    expect(workflow).toContain(`image: ${resolver}`)
    expect(workflow).toContain('echo $CI_SCRIPT | base64 -d | /busybox/sh -e')
    expect(workflow).toContain('commands:\n      - /busybox/sh deploy/resolve-release-image.sh')
    expect(workflow).toContain(`image: ${runner}`)
    expect(workflow).toContain('RELEASE_SERVICE: portfolio-site')
    expect(workflow).toContain('RELEASE_IMAGE_FILE: .release/image.txt')
    expect(workflow.match(/RELEASE_SOURCE_SHA: \$\{CI_COMMIT_SHA\}/g)).toHaveLength(2)
    expect(workflow).toContain('from_secret: portfolio_registry_username')
    expect(workflow).toContain('from_secret: portfolio_registry_password')
    expect(workflow).toContain('RELEASE_ENVIRONMENT: production')
    expect(workflow).not.toContain('K3S_RELEASE_KUBECONFIG_B64:')
    expect(workflow).not.toContain('from_secret: k3s_release_kubeconfig_b64')
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

  it('resolves the push commit using private registry auth', () => {
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
          RELEASE_SOURCE_SHA: revision,
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

  it('rejects an image whose revision differs from the push commit', () => {
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
        env: { ...process.env, RELEASE_SOURCE_SHA: 'a'.repeat(40), REGISTRY_USERNAME: 'test', REGISTRY_PASSWORD: 'test-only', MOCK_CONFIG_PATH: resolve(directory, 'config-path'), CRANE_BIN: crane },
        encoding: 'utf8',
      })

      expect(result.status).toBe(1)
      expect(result.stderr).toContain('image revision label does not match')
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })

  it.each(['malformed-digest', 'login-failure'])('rejects %s and removes temporary credentials', (failure) => {
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
  digest) printf 'sha256:short\\n' ;;
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
      if (failure === 'malformed-digest') expect(result.stderr).toContain('registry did not return an exact sha256 image digest')
    }
    finally {
      rmSync(directory, { recursive: true, force: true })
    }
  })
})
