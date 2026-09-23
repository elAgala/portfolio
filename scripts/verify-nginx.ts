import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

// Local fixture by default; after CI publishes, verify the exact released image:
// RELEASE_RUNTIME_IMAGE=ghcr.io/elagala/portfolio@sha256:... RELEASE_RUNTIME_SHA=... npm run runtime:verify
const publishedImage = process.env.RELEASE_RUNTIME_IMAGE
const revision = process.env.RELEASE_RUNTIME_SHA || 'a'.repeat(40)
assert.match(revision, /^[0-9a-f]{40}$/)
if (publishedImage) {
  assert.match(publishedImage, /^ghcr\.io\/elagala\/portfolio@sha256:[0-9a-f]{64}$/)
  assert.ok(process.env.RELEASE_RUNTIME_SHA, 'Published-image checks require its source SHA')
}
const dockerfile = readFileSync(resolve('Dockerfile'), 'utf8')
const base = dockerfile.match(/^FROM (nginxinc\/nginx-unprivileged:[^\s]+@sha256:[0-9a-f]{64})$/m)?.[1]
assert.ok(base, 'Nginx base must be digest-pinned')
const directory = mkdtempSync(resolve(tmpdir(), 'portfolio-nginx-'))
const name = `portfolio-nginx-check-${process.pid}`
const docker = (...args: string[]) => execFileSync('docker', args, { encoding: 'utf8', timeout: 120_000 })
let started = false
try {
  const fixtureArgs: string[] = []
  if (!publishedImage) {
    const config = readFileSync(resolve('deploy/nginx.conf'), 'utf8').replaceAll('__VCS_REF__', revision)
    writeFileSync(resolve(directory, 'nginx.conf'), config, { mode: 0o644 })
    fixtureArgs.push('--mount', `type=bind,src=${resolve(directory, 'nginx.conf')},dst=/etc/nginx/nginx.conf,readonly`,
      '--mount', `type=bind,src=${resolve('.output/public')},dst=/srv,readonly`, '--entrypoint', 'nginx')
  }
  docker('run', '-d', '--name', name, '--network', 'none', '--read-only', '--user', '10001:10001',
    '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges', '--memory', '128m', '--cpus', '0.25',
    '--tmpfs', '/tmp:rw,noexec,nosuid,size=134217728,uid=10001,gid=10001,mode=1770',
    ...fixtureArgs, publishedImage || base, '-g', 'daemon off;')
  started = true
  docker('exec', name, 'nginx', '-t')
  const get = (path: string) => docker('exec', name, 'sh', '-c',
    'wget -S -O - "$1" 2>&1', 'probe', `http://127.0.0.1:8080${path}`)
  let health = ''
  for (let attempt = 0; attempt < 20; attempt++) {
    try {
      health = get('/healthz')
      break
    }
    catch (error) {
      if (attempt === 19) throw error
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  assert.match(health, /HTTP\/1\.1 200/)
  assert.ok(health.includes(`X-Agala-Revision: ${revision}`))
  for (const path of ['/', '/resume', '/resume/', '/a/deep/link']) {
    const page = get(path)
    assert.doesNotMatch(page, /Location: https?:/i, 'Redirects must retain the public origin')
    assert.match(page, /Content-Type: text\/html/)
    assert.match(page, /Cache-Control: public, max-age=0, must-revalidate/)
    assert.match(page, /<!doctype html>/i)
  }
  // Inspect the tested image's own files, including when a newer local build exists.
  const files = docker('exec', name, 'find', '/srv', '-type', 'f').trim().split('\n')
  for (const [extension, mime] of [['.js', 'application/javascript'], ['.css', 'text/css'], ['.pdf', 'application/pdf']] as const) {
    const file = files.find(file => file.endsWith(extension))
    assert.ok(file, `Missing ${extension} artifact`)
    const response = get(file.slice('/srv'.length))
    assert.ok(response.includes(`Content-Type: ${mime}`), `Wrong MIME type for ${file}`)
    if (file.startsWith('/srv/_nuxt/')) assert.match(response, /max-age=31536000, immutable/)
  }
  for (const path of ['/portfolio/images/julian-benitez.webp', '/portfolio/images/agala-logo.webp', '/portfolio/fonts/archivo-latin.woff2']) {
    const response = get(path)
    assert.match(response, /Cache-Control: public, max-age=3600, stale-while-revalidate=86400/)
  }
  const missing = docker('exec', name, 'sh', '-c', 'wget -S -O /dev/null http://127.0.0.1:8080/_nuxt/missing.js 2>&1 || true')
  assert.match(missing, /404 Not Found/)
  const compressed = docker('exec', name, 'sh', '-c', 'wget -S --header="Accept-Encoding: gzip" -O /dev/null http://127.0.0.1:8080/ 2>&1')
  assert.match(compressed, /Content-Encoding: gzip/)
  console.log(`Nginx runtime checks passed (${publishedImage ? 'published exact image' : 'base-image fixture with generated site'}): health/revision, pages, fallback, assets, PDF, caching, gzip, restricted security.`)
}
finally {
  if (started) docker('rm', '-f', name)
  rmSync(directory, { recursive: true, force: true })
}
