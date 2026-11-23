import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { traJavaExamples } from '../src/data/traJavaExamples.js'
import { createStoredZip } from './package-graph-exercise.mjs'
import { readTraLibrary } from './tra-library.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
export const traExampleSourceFiles = [
  ...traJavaExamples.map(example => example.sourcePath),
  'README.md',
  'README.ru.md',
  'README.fi.md',
]

export function packageTraExamples(output = resolve(root, 'public/examples/tra-graphs.zip')) {
  const files = traExampleSourceFiles.map(name => ({
    name: `tra-graphs/${name}`,
    data: readFileSync(resolve(root, 'src/tra-examples', name)),
  }))
  files.push({ name: 'tra-graphs/traj.jar', data: readTraLibrary() })
  files.push({
    name: 'tra-graphs/expected-output.txt',
    data: Buffer.from(
      traJavaExamples
        .map(example => `=== ${example.sourcePath} ===\n${example.output}\n`)
        .join('\n'),
      'utf8',
    ),
  })
  // Every topic has its own command index; paths are relative to the ZIP root.
  for (const group of new Set(traJavaExamples.map(example => example.group))) {
    files.push({
      name: `tra-graphs/lessons/${group}/RUN.txt`,
      data: Buffer.from(
        traJavaExamples
          .filter(example => example.group === group)
          .map(example => `java -Dfile.encoding=UTF-8 -cp traj.jar ${example.sourcePath}`)
          .join('\n') + '\n',
        'utf8',
      ),
    })
  }
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, createStoredZip(files))
  return output
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  console.log(`Prepared ${packageTraExamples()}`)
}
