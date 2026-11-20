import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { traLibraryPath } from '../scripts/tra-library.mjs'

const hasJdk = ['java', 'javac'].every(name => spawnSync(name, ['--version']).status === 0)

test(
  'TRA Prim/Kruskal return minimum forests by exhaustive and cycle-exchange checks',
  { skip: hasJdk ? false : 'JDK 11+ required' },
  () => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-forests-'))
    try {
      const classes = ['TraMinimumSpanningTreeExample', 'TraDijkstraExample']
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
          resolve('tests/fixtures/TraSpanningForestChecks.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      for (const name of [...classes, 'TraSpanningForestChecks']) {
        assert.equal(readFileSync(join(directory, `${name}.class`)).readUInt16BE(6), 55)
      }
      const run = spawnSync(
        'java',
        ['-cp', directory + delimiter + traLibraryPath, 'TraSpanningForestChecks'],
        { encoding: 'utf8', timeout: 20000 },
      )
      assert.equal(run.status, 0, run.stdout + run.stderr)
      assert.match(
        run.stdout,
        /TRA spanning forests passed: 76 exhaustive topologies, 320 generated graphs/,
      )
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
