import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { readTraLibrary } from './tra-library.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
export const exercisePackageFiles = [
  'Solution.java',
  'Check.java',
  'GraphChecks.java',
  'README.md',
  'README.fi.md',
  'traj.jar',
]
// New kits have one English README; checker feedback still supports all three languages.
export const componentsExercisePackageFiles = exercisePackageFiles.filter(
  name => name !== 'README.fi.md',
)
export const treeExercisePackageFiles = [
  'Solution.java',
  'Check.java',
  'TreeChecks.java',
  'README.md',
  'traj.jar',
]

function crc32(bytes) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

// A small stored ZIP needs no build dependency or installed archive command.
// Fixed DOS timestamps make repeated builds byte-for-byte reproducible.
export function createStoredZip(files) {
  const localEntries = []
  const directoryEntries = []
  let offset = 0
  let directorySize = 0
  for (const { name, data } of files) {
    const filename = Buffer.from(name, 'utf8')
    const checksum = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0x800, 6)
    local.writeUInt16LE(33, 12) // 1980-01-01
    local.writeUInt32LE(checksum, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(filename.length, 26)
    localEntries.push(local, filename, data)

    const directory = Buffer.alloc(46)
    directory.writeUInt32LE(0x02014b50, 0)
    directory.writeUInt16LE(20, 4)
    directory.writeUInt16LE(20, 6)
    directory.writeUInt16LE(0x800, 8)
    directory.writeUInt16LE(33, 14)
    directory.writeUInt32LE(checksum, 16)
    directory.writeUInt32LE(data.length, 20)
    directory.writeUInt32LE(data.length, 24)
    directory.writeUInt16LE(filename.length, 28)
    directory.writeUInt32LE(offset, 42)
    directoryEntries.push(directory, filename)
    directorySize += directory.length + filename.length
    offset += local.length + filename.length + data.length
  }
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(directorySize, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...localEntries, ...directoryEntries, end])
}

export function packageGraphExercise(output = resolve(root, 'public/exercises/dfs-reachable.zip')) {
  return packageExercise('dfs-reachable', output)
}

export function packageBfsExercise(output = resolve(root, 'public/exercises/bfs-distances.zip')) {
  return packageExercise('bfs-distances', output)
}

export function packageBfsPathExercise(output = resolve(root, 'public/exercises/bfs-path.zip')) {
  return packageExercise('bfs-path', output)
}

export function packageComponentsExercise(
  output = resolve(root, 'public/exercises/graph-components.zip'),
) {
  return packageExercise('graph-components', output, componentsExercisePackageFiles)
}

export function packageTreeSizeExercise(output = resolve(root, 'public/exercises/btree-size.zip')) {
  return packageExercise('btree-size', output, treeExercisePackageFiles)
}

export function packageTreeHeightExercise(
  output = resolve(root, 'public/exercises/btree-height.zip'),
) {
  return packageExercise('btree-height', output, treeExercisePackageFiles)
}

export function packageTreeTraversalExercise(order, output) {
  if (!['pre', 'in', 'post'].includes(order)) {
    throw new Error(`Unknown tree traversal: ${order}`)
  }
  return packageExercise(
    `btree-${order}`,
    output ?? resolve(root, `public/exercises/btree-${order}.zip`),
    treeExercisePackageFiles,
  )
}

function packageExercise(folder, output, packageFiles = exercisePackageFiles) {
  const files = packageFiles.map(name => ({
    name: `${folder}/${name}`,
    data:
      name === 'traj.jar'
        ? readTraLibrary()
        : readFileSync(resolve(root, 'exercises', folder, name)),
  }))
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, createStoredZip(files))
  return output
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  console.log(`Prepared ${packageGraphExercise()}`)
}
