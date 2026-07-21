import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const publicDirectory = resolve('.output/public')
const resumeHtml = readFileSync(resolve(publicDirectory, 'resume/index.html'), 'utf8')
const requestedChunks = [...resumeHtml.matchAll(/(?:src|href)="\/?(_nuxt\/[^"?]+\.js)/g)]
  .map(match => match[1])

if (!requestedChunks.length)
  throw new Error('No resume JavaScript chunks found; generate the site before checking route isolation')

const forbiddenMarkers = ['agala-constellation', 'AgalaConstellation', 'three.module']
for (const chunk of new Set(requestedChunks)) {
  const source = readFileSync(resolve(publicDirectory, chunk), 'utf8')
  const marker = forbiddenMarkers.find(value => source.includes(value))
  if (marker)
    throw new Error(`Resume route chunk ${chunk} contains interactive portfolio marker ${marker}`)
}

console.log(`Resume isolation passed across ${new Set(requestedChunks).size} requested JavaScript chunks.`)
