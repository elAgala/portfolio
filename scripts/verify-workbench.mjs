import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const baseUrl = process.argv[2] || 'http://127.0.0.1:43177'
const debugPort = Number(process.argv[3] || 43178)
const auditMode = process.argv.includes('--audit')
const outputDirectory = join(process.cwd(), '.visual-regression')
const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
]
const sections = ['top', 'operator-desk', 'experience', 'agala-setup', 'profile', 'contact']

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

async function evaluate(protocol, expression) {
  const result = await protocol.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (result.exceptionDetails)
    throw new Error(result.exceptionDetails.text || 'Browser evaluation failed')
  return result.result.value
}

async function setViewport(protocol, viewport) {
  await protocol.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width < 768,
  })
}

async function navigate(protocol, url) {
  await protocol.send('Page.navigate', { url })
  await sleep(2400)
}

async function assertNoOverflow(protocol, label) {
  const widths = await evaluate(protocol, '({ viewport: window.innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth })')
  if (widths.document > widths.viewport || widths.body > widths.viewport)
    throw new Error(`${label}: horizontal overflow ${JSON.stringify(widths)}`)
}

async function assertAccessibility(protocol, label, requiredLandmarks = ['main', 'navigation', 'banner', 'contentinfo']) {
  const accessibility = await protocol.send('Accessibility.getFullAXTree')
  const visibleNodes = accessibility.nodes.filter(node => !node.ignored)
  const interactiveRoles = new Set(['button', 'link', 'textbox'])
  const unnamedInteractive = visibleNodes.filter(node => interactiveRoles.has(node.role?.value) && !node.name?.value?.trim())
  const roles = new Set(visibleNodes.map(node => node.role?.value))
  if (unnamedInteractive.length)
    throw new Error(`${label}: ${unnamedInteractive.length} unnamed interactive controls`)
  for (const landmark of requiredLandmarks) {
    if (!roles.has(landmark))
      throw new Error(`${label}: missing ${landmark} landmark`)
  }
  console.log(`${label}: ${visibleNodes.length} accessible nodes; controls named; landmarks present.`)
}

async function runAudit(protocol) {
  await setViewport(protocol, { width: 1440, height: 900 })
  await navigate(protocol, `${baseUrl}/`)
  await assertNoOverflow(protocol, 'Desktop workbench')
  await assertAccessibility(protocol, 'Desktop workbench')

  const sceneStatus = await evaluate(protocol, 'document.querySelector(\'.system-window__status span:last-child\')?.textContent?.trim()')
  if (!sceneStatus || sceneStatus === 'booting')
    throw new Error(`Operator desk did not initialize: ${sceneStatus || 'missing status'}`)

  const terminalButtonFound = await evaluate(protocol, `(() => {
    const button = [...document.querySelectorAll('.system-window__bar button')].find(item => item.textContent.includes('enter terminal'))
    button?.click()
    return Boolean(button)
  })()`)
  await sleep(1250)
  const terminalState = await evaluate(protocol, `(() => {
    const input = document.querySelector('#operator-terminal-input')
    return {
      takeover: document.querySelector('.system-window')?.classList.contains('system-window--terminal'),
      label: document.querySelector('.system-window__bar button')?.textContent?.trim(),
      focused: document.activeElement === input,
    }
  })()`)
  if (!terminalButtonFound || !terminalState.takeover || !terminalState.label?.includes('leave terminal') || !terminalState.focused)
    throw new Error(`Terminal focus contract failed: ${JSON.stringify(terminalState)}`)

  await evaluate(protocol, `(() => {
    const input = document.querySelector('#operator-terminal-input')
    input.value = 'projects'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.form.requestSubmit()
  })()`)
  await sleep(150)
  const terminalOutput = await evaluate(protocol, 'document.querySelector(\'.operator-desk__semantic-log\')?.textContent')
  if (!terminalOutput?.includes('agala-ui') || !terminalOutput.includes('agala-deploy') || !terminalOutput.includes('agala-setup'))
    throw new Error('Terminal projects command did not return project targets')
  await assertAccessibility(protocol, 'Open terminal')

  await protocol.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  })
  await navigate(protocol, `${baseUrl}/`)
  const fallback = await evaluate(protocol, `({
    image: Boolean(document.querySelector('.operator-desk__fallback img')),
    button: [...document.querySelectorAll('.system-window__bar button')].find(item => item.textContent.includes('accessible terminal'))?.textContent?.trim(),
    status: document.querySelector('.system-window__status span:last-child')?.textContent?.trim(),
  })`)
  if (!fallback.image || !fallback.button || !fallback.status?.startsWith('accessible render'))
    throw new Error(`Reduced-motion fallback failed: ${JSON.stringify(fallback)}`)

  await evaluate(protocol, `(() => {
    const button = document.querySelector('.system-window__bar button')
    if (button && !button.disabled) button.click()
  })()`)
  await sleep(100)
  const fallbackTerminal = await evaluate(protocol, `({
    terminal: Boolean(document.querySelector('.operator-terminal-fallback')),
    focused: document.activeElement === document.querySelector('#operator-terminal-fallback-input'),
  })`)
  if (!fallbackTerminal.terminal || !fallbackTerminal.focused)
    throw new Error(`Reduced-motion terminal fallback failed: ${JSON.stringify(fallbackTerminal)}`)
  await assertAccessibility(protocol, 'Reduced-motion workbench')

  await protocol.send('Emulation.setEmulatedMedia', { media: 'screen', features: [] })
  await navigate(protocol, `${baseUrl}/resume`)
  await assertNoOverflow(protocol, 'Résumé route')
  await assertAccessibility(protocol, 'Résumé route', ['main', 'navigation'])
}

async function captureVisuals(protocol) {
  await mkdir(outputDirectory, { recursive: true })
  for (const viewport of viewports) {
    await setViewport(protocol, viewport)
    await navigate(protocol, `${baseUrl}/`)
    await assertNoOverflow(protocol, `${viewport.width}px workbench`)

    for (const section of sections) {
      await evaluate(protocol, `(() => {
        document.documentElement.style.scrollBehavior = 'auto'
        const target = document.getElementById(${JSON.stringify(section)})
        if (${JSON.stringify(section)} === 'top')
          window.scrollTo(0, 0)
        else if (target)
          window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - (window.innerHeight - target.offsetHeight) / 2)
      })()`)
      await sleep(350)
      const screenshot = await protocol.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
      const file = join(outputDirectory, `${viewport.width}-${section}.png`)
      await writeFile(file, Buffer.from(screenshot.data, 'base64'))
      console.log(`Captured ${file}`)

    }

    await evaluate(protocol, `(() => {
      document.getElementById('operator-desk')?.scrollIntoView({ block: 'center' })
      const button = document.querySelector('.system-window__bar button')
      if (button && !button.disabled) button.click()
    })()`)
    await sleep(1250)
    const terminalScreenshot = await protocol.send('Page.captureScreenshot', { format: 'png', fromSurface: true })
    const terminalFile = join(outputDirectory, `${viewport.width}-terminal.png`)
    await writeFile(terminalFile, Buffer.from(terminalScreenshot.data, 'base64'))
    console.log(`Captured ${terminalFile}`)
  }
}

async function main() {
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--no-sandbox',
    '--disable-background-networking',
    '--enable-unsafe-swiftshader',
    '--hide-scrollbars',
    '--window-size=1280,800',
    '--force-device-scale-factor=1',
    `--remote-debugging-port=${debugPort}`,
    'about:blank',
  ], { stdio: 'ignore' })

  try {
    const protocol = createProtocol(await waitForDebugger())
    await protocol.ready
    await protocol.send('Page.enable')
    await protocol.send('Runtime.enable')
    await protocol.send('Accessibility.enable')

    if (auditMode)
      await runAudit(protocol)
    else
      await captureVisuals(protocol)

    protocol.close()
  }
  finally {
    chrome.kill('SIGTERM')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
