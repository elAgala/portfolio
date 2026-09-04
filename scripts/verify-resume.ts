import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const pdf = resolve('public/julian-benitez-resume.pdf')

if (!existsSync(pdf))
  throw new Error('Resume PDF is missing; run `npm run generate && npm run resume:pdf` first')

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { encoding: 'utf8' })
  if (result.status !== 0)
    throw new Error(`${command} failed: ${result.stderr || result.stdout}`)
  return result.stdout
}

const metadata = run('pdfinfo', [pdf])
const text = run('pdftotext', ['-layout', pdf, '-'])
const normalizedText = text.replace(/\s+/g, ' ')

const requiredMetadata: Array<[string, RegExp]> = [
  ['one page', /Pages:\s+1\b/],
  ['A4 page size', /Page size:\s+594\.\d+ x 841\.\d+ pts \(A4\)/],
  ['tagged document', /Tagged:\s+yes\b/],
]

for (const [label, pattern] of requiredMetadata) {
  if (!pattern.test(metadata))
    throw new Error(`Resume verification failed: expected ${label}`)
}

const requiredClaims = [
  'Technical Lead · Hands-on Software Engineer',
  '2024–Present',
  '2021–Present',
  'teams across Argentina, the US, and Europe',
  'client-facing and internal tools from the ground up',
  'engineering standards across the organization',
  'systems owned by different teams',
  'Frontend Guild',
  'shared design-system library',
  'technical interviews',
  'Agala Labs',
  'Next.js',
  'OpenTofu',
  'Kafka',
  'Redis',
  'Prometheus',
  'Grafana',
  'Professional working proficiency',
  'Computer Engineering coursework',
]

for (const claim of requiredClaims) {
  if (!normalizedText.includes(claim))
    throw new Error(`Resume verification failed: missing ${claim}`)
}

if (text.toLowerCase().includes('github.com/agala-labs'))
  throw new Error('Resume verification failed: private organization link is public')

for (const removedText of ['Self-employed', 'Alongside AlixPartners']) {
  if (normalizedText.includes(removedText))
    throw new Error(`Resume verification failed: removed content remains: ${removedText}`)
}

if (!normalizedText.includes('Technical Lead / Software Engineer 2024–Present') || !normalizedText.includes('Software Engineer 2021–2024'))
  throw new Error('Resume verification failed: expected SWE 2021–2024, then TL / SWE 2024–Present')

console.log('Resume verification passed: one tagged A4 page with leadership and Agala Labs evidence.')
