import { createServer } from 'node:http'
import { access, copyFile, mkdir, readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { spawn } from 'node:child_process'

const root = join(process.cwd(), '.output', 'public')
const publicPdf = join(process.cwd(), 'public', 'julian-benitez-resume.pdf')
const outputPdf = join(root, 'julian-benitez-resume.pdf')

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

async function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname)
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(root, safePath)

  try {
    if ((await stat(filePath)).isDirectory()) filePath = join(filePath, 'index.html')
  }
  catch {
    filePath = join(filePath, 'index.html')
  }

  return filePath
}

async function main() {
  await access(join(root, 'resume', 'index.html'))
  await mkdir(join(process.cwd(), 'public'), { recursive: true })

  const server = createServer(async (request, response) => {
    try {
      const filePath = await resolveRequestPath(request.url || '/')
      const contents = await readFile(filePath)
      response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream' })
      response.end(contents)
    }
    catch {
      response.writeHead(404)
      response.end('Not found')
    }
  })

  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  const chrome = process.env.CHROME_PATH || 'google-chrome'

  const exitCode = await new Promise((resolve, reject) => {
    const chromeProcess = spawn(chrome, [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${publicPdf}`,
      `http://127.0.0.1:${port}/resume/`,
    ], { stdio: 'inherit' })

    chromeProcess.on('error', reject)
    chromeProcess.on('close', resolve)
  })

  server.close()
  if (exitCode !== 0) throw new Error(`Chrome exited with code ${exitCode}`)

  await copyFile(publicPdf, outputPdf)
  console.log(`Resume PDF written to ${publicPdf}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
