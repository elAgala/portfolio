import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const pdf = resolve('public/julian-benitez-resume.pdf')

if (!existsSync(pdf))
  throw new Error('Résumé PDF is missing; run `npm run generate && npm run resume:pdf` first')

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.status !== 0)
    throw new Error(`${command} failed: ${result.stderr || result.stdout}`)
  return result.stdout
}

const metadata = run('pdfinfo', [pdf])
const text = run('pdftotext', ['-layout', pdf, '-'])

const requiredMetadata = [
  ['one page', /Pages:\s+1\b/],
  ['A4 page size', /Page size:\s+594\.\d+ x 841\.\d+ pts \(A4\)/],
  ['tagged document', /Tagged:\s+yes\b/],
]

for (const [label, pattern] of requiredMetadata) {
  if (!pattern.test(metadata))
    throw new Error(`Résumé verification failed: expected ${label}`)
}

const requiredClaims = [
  'Software Engineer / Tech Lead',
  'Frontend Guild',
  'technical interviews',
  'Agala Labs',
  'Next.js',
  'OpenTofu',
]

for (const claim of requiredClaims) {
  if (!text.includes(claim))
    throw new Error(`Résumé verification failed: missing ${claim}`)
}

if (text.toLowerCase().includes('github.com/agala-labs'))
  throw new Error('Résumé verification failed: private organization link is public')

console.log('Résumé verification passed: one tagged A4 page with leadership and Agala Labs evidence.')
