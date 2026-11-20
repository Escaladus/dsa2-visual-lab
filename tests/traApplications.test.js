import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { traLibraryPath } from '../scripts/tra-library.mjs'
import { traversalExamples } from '../src/data/graphTraversal.js'

const hasJdk = ['java', 'javac'].every(name => spawnSync(name, ['--version']).status === 0)

test(
  'TRA applications accept valid partitions/paths/orders and reject cycles across every component',
  { skip: hasJdk ? false : 'JDK 11+ required' },
  () => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-applications-'))
    try {
      const classes = ['TraComponentsExample', 'TraTopologicalExample', 'TraTraversalExample']
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
          resolve('tests/fixtures/TraApplicationsChecks.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      for (const name of [...classes, 'TraApplicationsChecks']) {
        assert.equal(readFileSync(join(directory, `${name}.class`)).readUInt16BE(6), 55)
      }
      const result = spawnSync(
        'java',
        ['-cp', directory + delimiter + traLibraryPath, 'TraApplicationsChecks'],
        { encoding: 'utf8', timeout: 20000 },
      )
      assert.equal(result.status, 0, result.stdout + result.stderr)
      assert.match(result.stdout, /TRA applications passed: 240 generated graphs/)
      for (const preset of ['disconnected', 'dag', 'directed']) {
        const line = result.stdout.split('\n').find(line => line.startsWith(`${preset}=`))
        assert.ok(line, preset)
        assert.deepEqual(
          JSON.parse(line.slice(preset.length + 1)),
          traversalExamples[preset].graph,
          `The ${preset} drawing must match the actual new Java factory`,
        )
      }
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
