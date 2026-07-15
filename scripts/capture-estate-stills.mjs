import { spawn, spawnSync } from 'node:child_process'
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const baseUrl = process.argv[2] || 'http://127.0.0.1:43177'
const debugPort = Number(process.argv[3] || 43178)
const qaMode = process.argv.includes('--qa')
const auditMode = process.argv.includes('--audit')
const quickMode = process.argv.includes('--quick')
const outputDirectory = qaMode ? join(process.cwd(), '.visual-regression') : join(process.cwd(), 'public', 'stills')
const temporaryDirectory = join(process.cwd(), '.tmp-estate-stills')
const chapters = ['hero', 'agala-ui', 'agala-deploy', 'agala-ai', 'profile', 'contact']
const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
]

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

async function waitForDebugger() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`)
      const targets = await response.json()
      const page = targets.find(target => target.type === 'page')
      if (page?.webSocketDebuggerUrl)
        return page.webSocketDebuggerUrl
    }
    catch {
      // Chrome may need a few polling intervals before exposing the endpoint.
    }
    await sleep(250)
  }
  throw new Error('Chrome DevTools endpoint did not become ready')
}

function createProtocol(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl)
  const pending = new Map()
  let requestId = 0

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (!message.id)
      return
    const request = pending.get(message.id)
    if (!request)
      return
    pending.delete(message.id)
    if (message.error)
      request.reject(new Error(message.error.message))
    else
      request.resolve(message.result)
  })

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  return {
    ready,
    close: () => socket.close(),
    send(method, params = {}) {
      requestId += 1
      const id = requestId
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject })
        socket.send(JSON.stringify({ id, method, params }))
      })
    },
  }
}

async function main() {
  await mkdir(outputDirectory, { recursive: true })
  await mkdir(temporaryDirectory, { recursive: true })

  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-background-networking',
    '--hide-scrollbars',
    '--window-size=1280,800',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${debugPort}`,
    qaMode || auditMode ? `${baseUrl}/?quality=high#capture` : `${baseUrl}/?capture=scene&quality=high#capture`,
  ], { stdio: 'ignore' })

  try {
    const protocol = createProtocol(await waitForDebugger())
    await protocol.ready
    await protocol.send('Page.enable')
    await protocol.send('Runtime.enable')
    await protocol.send('Accessibility.enable')
    await sleep(5200)

    if (auditMode) {
      const auditAccessibilityTree = async (label) => {
        const accessibility = await protocol.send('Accessibility.getFullAXTree')
        const visibleNodes = accessibility.nodes.filter(node => !node.ignored)
        const interactiveRoles = new Set(['button', 'link'])
        const unnamedInteractive = visibleNodes.filter(node => interactiveRoles.has(node.role?.value) && !node.name?.value?.trim())
        const roles = new Set(visibleNodes.map(node => node.role?.value))
        if (unnamedInteractive.length)
          throw new Error(`${label}: unnamed interactive controls: ${unnamedInteractive.length}`)
        for (const landmark of ['main', 'navigation', 'banner', 'contentinfo']) {
          if (!roles.has(landmark))
            throw new Error(`${label}: missing accessibility landmark: ${landmark}`)
        }
        console.log(`${label}: ${visibleNodes.length} accessible nodes, no unnamed links or buttons, required landmarks present.`)
      }

      await auditAccessibilityTree('High tier')
      await protocol.send('Page.navigate', { url: `${baseUrl}/?quality=balanced#capture` })
      await sleep(4200)
      await auditAccessibilityTree('Balanced tier')
      await protocol.send('Emulation.setEmulatedMedia', {
        media: 'screen',
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      })
      await protocol.send('Page.navigate', { url: `${baseUrl}/#capture` })
      await sleep(3200)
      await auditAccessibilityTree('Static / reduced-motion tier')
      protocol.close()
      return
    }

    const captureChapter = async (chapter, filename) => {
      const target = chapter === 'hero' ? 'top' : chapter
      await protocol.send('Runtime.evaluate', {
        expression: chapter === 'hero'
          ? 'window.scrollTo({ top: 0 }); window.dispatchEvent(new Event(\'scroll\'));'
          : `document.getElementById(${JSON.stringify(target)})?.scrollIntoView({ block: 'center' }); window.dispatchEvent(new Event('scroll'));`,
      })
      await sleep(1800)
      const screenshot = await protocol.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
      const pngPath = join(temporaryDirectory, filename)
      await writeFile(pngPath, Buffer.from(screenshot.data, 'base64'))
      return pngPath
    }

    if (qaMode) {
      const activeViewports = quickMode ? viewports.filter(viewport => viewport.width === 320 || viewport.width === 1440) : viewports
      const activeChapters = quickMode ? chapters.filter(chapter => ['hero', 'agala-ui', 'profile', 'contact'].includes(chapter)) : chapters
      for (const viewport of activeViewports) {
        await protocol.send('Emulation.setDeviceMetricsOverride', {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1,
          mobile: viewport.width < 768,
        })
        await protocol.send('Runtime.evaluate', { expression: 'window.dispatchEvent(new Event(\'resize\'))' })
        await sleep(500)
        const overflow = await protocol.send('Runtime.evaluate', {
          expression: '({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth })',
          returnByValue: true,
        })
        const widths = overflow.result.value
        if (widths.document > widths.viewport || widths.body > widths.viewport)
          throw new Error(`Horizontal overflow at ${viewport.width}px: ${JSON.stringify(widths)}`)
        for (const chapter of activeChapters) {
          const filename = `${viewport.width}-${chapter}.png`
          const pngPath = await captureChapter(chapter, filename)
          const finalPath = join(outputDirectory, filename)
          await copyFile(pngPath, finalPath)
          console.log(`Captured ${finalPath}`)
        }
      }
    }
    else {
      for (const chapter of chapters) {
        const pngPath = await captureChapter(chapter, `${chapter}.png`)
        const avifPath = join(outputDirectory, `estate-${chapter}.avif`)
        const conversion = spawnSync('magick', [pngPath, '-modulate', '112,104,100', '-quality', '54', avifPath], { stdio: 'inherit' })
        if (conversion.status !== 0)
          throw new Error(`Image conversion failed for ${chapter}`)
        console.log(`Captured ${avifPath}`)
      }
    }

    protocol.close()
  }
  finally {
    chrome.kill('SIGTERM')
    await rm(temporaryDirectory, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
