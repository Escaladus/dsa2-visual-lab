import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { javaExamples } from '../src/data/javaExamples.js'

const hasJdk = spawnSync('javac', ['-version']).status === 0 && spawnSync('java', ['-version']).status === 0

test('Java 17 examples compile, match their displayed outputs and pass algorithm checks', { skip: hasJdk ? false : 'JDK 17+ is required to verify Java examples' }, async t => {
  const directory = mkdtempSync(join(tmpdir(), 'dsa2-java-tests-'))
  try {
    const sourceFiles = readdirSync('src/examples').filter(file => file.endsWith('.java')).sort()
    assert.deepEqual(sourceFiles, javaExamples.map(example => `${example.className}.java`).sort())
    const compile = spawnSync('javac', ['--release', '17', '-Xlint:all', '-d', directory,
      ...sourceFiles.map(file => resolve('src/examples', file)), resolve('tests/fixtures/ExamplesChecks.java')], { encoding: 'utf8', timeout: 30000 })
    assert.equal(compile.status, 0, compile.stderr)
    assert.equal(compile.stderr, '', 'Compilation should produce no warnings')
    for (const example of javaExamples) {
      await t.test(example.className, () => {
        const run = spawnSync('java', ['-Djava.io.tmpdir=' + directory, '-cp', directory, example.className], { encoding: 'utf8', timeout: 10000 })
        assert.equal(run.status, 0, run.stderr)
        assert.equal(run.stdout.trim().replace(/\r\n/g, '\n'), example.output)
      })
    }
    await t.test('boundary cases and comparisons with independent reference results', () => {
      const run = spawnSync('java', ['-Djava.io.tmpdir=' + directory, '-cp', directory, 'ExamplesChecks'], { encoding: 'utf8', timeout: 20000 })
      assert.equal(run.status, 0, run.stderr)
      assert.match(run.stdout, /All algorithm checks passed/)
    })
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
