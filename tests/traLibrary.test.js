import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { readTraLibrary, traLibrary, traLibraryPath } from '../scripts/tra-library.mjs'

test('TRA packaging rejects a changed binary against the shared library pin', () => {
  assert.equal(traLibrary.packageName, 'fi.uef.cs.tra')
  assert.equal(traLibrary.javaRelease, 11)
  assert.equal(traLibraryPath, resolve(traLibrary.source))
  const original = readTraLibrary()
  const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-pin-'))
  try {
    const path = join(directory, 'traj.jar')
    writeFileSync(path, original)
    assert.deepEqual(readTraLibrary(path), original)
    const changed = Buffer.from(original)
    changed[changed.length - 1] ^= 1
    writeFileSync(path, changed)
    assert.throws(() => readTraLibrary(path), /TRA library checksum mismatch/)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

const hasJdk = ['java', 'javac'].every(name => spawnSync(name, ['--version']).status === 0)
test(
  'the pinned TRA binary satisfies the graph, tree and queue contracts on Java 11+',
  { skip: hasJdk ? false : 'JDK 11+ required for actual TRA contracts' },
  () => {
    readTraLibrary()
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-contracts-'))
    try {
      const compile = spawnSync(
        'javac',
        [
          '--release',
          String(traLibrary.javaRelease),
          '-Xlint:all',
          '-encoding',
          'UTF-8',
          '-cp',
          traLibraryPath,
          '-d',
          directory,
          resolve('tests/fixtures/TraLibraryChecks.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      assert.equal(readFileSync(join(directory, 'TraLibraryChecks.class')).readUInt16BE(6), 55)
      const run = spawnSync(
        'java',
        ['-cp', directory + delimiter + traLibraryPath, 'TraLibraryChecks'],
        { encoding: 'utf8', timeout: 10000 },
      )
      assert.equal(run.status, 0, run.stdout + run.stderr)
      assert.match(run.stdout, /TRA contracts passed/)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
