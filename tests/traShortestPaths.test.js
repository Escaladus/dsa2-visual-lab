import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { traLibraryPath } from '../scripts/tra-library.mjs'

const hasJdk = ['java', 'javac'].every(name => spawnSync(name, ['--version']).status === 0)

test(
  'TRA weighted paths agree with Bellman-Ford and preserve inputs on valid and rejected graphs',
  { skip: hasJdk ? false : 'JDK 11+ required' },
  () => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-shortest-'))
    try {
      const classes = ['TraDijkstraExample', 'TraFloydWarshallExample']
      const compile = spawnSync(
        'javac',
        [
          '--release',
          '11',
          '-Xlint:all',
          '-encoding',
          'UTF-8',
          '-cp',
          traLibraryPath,
          '-d',
          directory,
          ...classes.map(name => resolve(`src/tra-examples/${name}.java`)),
          resolve('tests/fixtures/TraShortestPathsChecks.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      for (const name of [...classes, 'TraShortestPathsChecks']) {
        assert.equal(readFileSync(join(directory, `${name}.class`)).readUInt16BE(6), 55)
      }
      const run = spawnSync(
        'java',
        ['-cp', directory + delimiter + traLibraryPath, 'TraShortestPathsChecks'],
        { encoding: 'utf8', timeout: 20000 },
      )
      assert.equal(run.status, 0, run.stdout + run.stderr)
      assert.match(run.stdout, /TRA shortest paths passed: 340 generated graphs/)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
