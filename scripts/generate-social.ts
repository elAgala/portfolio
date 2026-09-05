import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { profile } from '../data/profile.ts'

const run = promisify(execFile)

async function main() {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-social-'))
  try {
    const assets = {
      font: ['public/portfolio/fonts/archivo-latin.woff2', 'font/woff2'],
      mono: ['public/portfolio/fonts/jetbrains-mono-latin.woff2', 'font/woff2'],
      portrait: ['public/portfolio/images/julian-benitez.png', 'image/png'],
      logo: ['public/portfolio/images/agala-logo.png', 'image/png'],
    } satisfies Record<string, [string, string]>
    let html = await readFile('scripts/social-card.html', 'utf8')
    for (const [key, [path, mime]] of Object.entries(assets)) {
      const data = await readFile(path)
      html = html.replaceAll(`{{${key}}}`, `data:${mime};base64,${data.toString('base64')}`)
    }
    html = html.replaceAll('{{website}}', profile.website)
    const source = join(directory, 'social-card.html')
    await writeFile(source, html)
    const output = resolve('public/og-image.png')
    await run(process.env.CHROME_PATH || 'google-chrome', [
      '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1', '--window-size=1200,630',
      '--virtual-time-budget=2000', `--user-data-dir=${join(directory, 'chrome')}`,
      `--screenshot=${output}`, pathToFileURL(source).href,
    ], { timeout: 30_000 })
    console.log(`Social preview written to ${output}`)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
