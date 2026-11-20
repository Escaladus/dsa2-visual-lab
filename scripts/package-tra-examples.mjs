import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { traJavaExamples } from '../src/data/traJavaExamples.js'
import { createStoredZip } from './package-graph-exercise.mjs'
import { readTraLibrary } from './tra-library.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
export const traExampleSourceFiles = [
  ...traJavaExamples.map(example => `${example.className}.java`),
  'README.md',
  'README.ru.md',
  'README.fi.md',
]

export function packageTraExamples(output = resolve(root, 'public/examples/tra-graphs.zip')) {
  const files = traExampleSourceFiles.map(name => ({
    name: `tra-graphs/${name}`,
    data: readFileSync(resolve(root, 'src/tra-examples', name)),
  }))
  // Reuse the supplied library rather than maintaining a second source JAR.
  files.push({
    name: 'tra-graphs/traj.jar',
    data: readTraLibrary(),
  })
  files.push({
    name: 'tra-graphs/expected-output.txt',
    data: Buffer.from(
      traJavaExamples
        .map(example => `=== ${example.className} ===\n${example.output}\n`)
        .join('\n'),
      'utf8',
    ),
  })
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, createStoredZip(files))
  return output
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  console.log(`Prepared ${packageTraExamples()}`)
}
