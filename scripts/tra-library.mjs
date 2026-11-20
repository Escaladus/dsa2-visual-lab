import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Both download builders use this exact supplied binary. A library upgrade must
// update the pin and recheck docs/TRA_CONTRACTS.md, not silently change the ZIPs.
export const traLibrary = Object.freeze({
  source: 'exercises/dfs-reachable/traj.jar',
  sha256: '589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423',
  packageName: 'fi.uef.cs.tra',
  javaRelease: 11,
  documentation: 'https://cs.uef.fi/pages/sjuva/trajavadoc2017/index.html',
})

export const traLibraryPath = fileURLToPath(new URL(`../${traLibrary.source}`, import.meta.url))

/** Read and verify before packaging, including builds on machines without Java. */
export function readTraLibrary(path = traLibraryPath) {
  const bytes = readFileSync(path)
  const checksum = createHash('sha256').update(bytes).digest('hex')
  if (checksum !== traLibrary.sha256) {
    throw new Error(
      `TRA library checksum mismatch: ${path}. Expected ${traLibrary.sha256}, got ${checksum}. ` +
        'Restore the supplied JAR or review the library upgrade and its contracts.',
    )
  }
  return bytes
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  readTraLibrary()
  console.log(`Verified ${traLibrary.source} (SHA-256 ${traLibrary.sha256})`)
}
