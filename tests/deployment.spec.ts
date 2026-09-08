import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('portfolio release boundary', () => {
  it('publishes on master without an implicit SSH deployment', () => {
    const workflow = readFileSync(resolve('.woodpecker/deploy.yml'), 'utf8')

    expect(workflow).toContain('name: build-portfolio')
    expect(workflow).not.toContain('name: deploy-portfolio')
    expect(workflow).not.toContain('SSH_DEPLOY_KEY')
    expect(workflow).not.toContain('ANSIBLE_PLAYBOOK')
  })

  it('exposes the immutable source revision through health', () => {
    const dockerfile = readFileSync(resolve('Dockerfile'), 'utf8')
    const caddyfile = readFileSync(resolve('deploy/Caddyfile'), 'utf8')

    expect(dockerfile).toContain('VCS_REF=${VCS_REF}')
    expect(caddyfile).toContain('header X-Agala-Revision "{env.VCS_REF}"')
  })
})
