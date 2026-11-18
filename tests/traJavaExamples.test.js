import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, delimiter } from 'node:path'
import test from 'node:test'
import { traJavaExamples } from '../src/data/traJavaExamples.js'
import { traJavaExampleTranslations } from '../src/i18n/traJavaExamples.js'
import { javaExamples } from '../src/data/javaExamples.js'
import { topics } from '../src/data/topics.js'
import { packageTraExamples, traExampleSourceFiles } from '../scripts/package-tra-examples.mjs'

test('TRA examples are additional files with complete descriptions in three languages', () => {
  assert.equal(javaExamples.length, 31, 'The original standalone catalogue stays intact')
  assert.deepEqual(
    readdirSync('src/tra-examples')
      .filter(name => name.endsWith('.java'))
      .sort(),
    traJavaExamples.map(example => `${example.className}.java`).sort(),
  )
  for (const example of traJavaExamples) {
    assert.ok(!javaExamples.some(original => original.className === example.className))
    assert.ok(example.output)
    for (const topic of example.topics)
      assert.ok(
        topics.some(item => item.id === topic),
        topic,
      )
    assert.match(
      readFileSync(`src/tra-examples/${example.className}.java`, 'utf8'),
      /import fi\.uef\.cs\.tra\./,
    )
  }
  for (const [language, labels] of Object.entries(traJavaExampleTranslations)) {
    assert.match(labels.intro, /JDK 11/)
    assert.equal(Object.keys(labels.examples).length, 3)
    for (const example of traJavaExamples) {
      assert.equal(labels.examples[example.id].length, 3)
      assert.ok(labels.examples[example.id].every(text => text.trim()))
    }
    for (const key of ['title', 'download', 'setup', 'order']) assert.ok(labels[key].trim())
    if (language !== 'ru') assert.doesNotMatch(JSON.stringify(labels), /[а-яё]/i)
    const readme = readFileSync(
      `src/tra-examples/${language === 'en' ? 'README.md' : `README.${language}.md`}`,
      'utf8',
    )
    for (const example of traJavaExamples)
      assert.ok(readme.includes(`-cp traj.jar ${example.className}.java`))
  }
})

const hasJdk = ['java', 'javac', 'jar'].every(name => spawnSync(name, ['--version']).status === 0)

test(
  'the actual TRA download runs on Java 11 and passes graph reference checks',
  { skip: hasJdk ? false : 'JDK 11+ required' },
  async t => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-examples-'))
    try {
      const archive = packageTraExamples(join(directory, 'tra.zip'))
      const unpack = spawnSync('jar', ['xf', archive], { cwd: directory, encoding: 'utf8' })
      assert.equal(unpack.status, 0, unpack.stderr)
      const work = join(directory, 'tra-graphs')
      for (const name of traExampleSourceFiles)
        assert.deepEqual(
          readFileSync(join(work, name)),
          readFileSync(resolve('src/tra-examples', name)),
        )
      assert.deepEqual(
        readFileSync(join(work, 'traj.jar')),
        readFileSync('exercises/dfs-reachable/traj.jar'),
      )
      const compile = spawnSync(
        'javac',
        [
          '--release',
          '11',
          '-Xlint:all',
          '-encoding',
          'UTF-8',
          '-classpath',
          join(work, 'traj.jar'),
          '-d',
          directory,
          ...traJavaExamples.map(example => join(work, `${example.className}.java`)),
          resolve('tests/fixtures/TraExamplesChecks.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      for (const name of readdirSync(directory).filter(name => name.endsWith('.class')))
        assert.equal(readFileSync(join(directory, name)).readUInt16BE(6), 55, name)
      for (const example of traJavaExamples) {
        await t.test(
          `${example.className}: downloaded source and precompiled output match the site`,
          () => {
            const source = spawnSync(
              'java',
              ['-Dfile.encoding=UTF-8', '-cp', 'traj.jar', `${example.className}.java`],
              { cwd: work, encoding: 'utf8', timeout: 15000 },
            )
            assert.equal(source.status, 0, source.stderr)
            assert.equal(source.stdout.trim().replace(/\r\n/g, '\n'), example.output)
            const compiled = spawnSync(
              'java',
              ['-cp', directory + delimiter + join(work, 'traj.jar'), example.className],
              { encoding: 'utf8', timeout: 10000 },
            )
            assert.equal(compiled.status, 0, compiled.stderr)
            assert.equal(compiled.stdout.trim().replace(/\r\n/g, '\n'), example.output)
            assert.ok(
              readFileSync(join(work, 'expected-output.txt'), 'utf8').includes(example.output),
            )
          },
        )
      }
      await t.test(
        'directed and undirected graphs, every start/scope, duplicates, cycles, paths and repeat runs',
        () => {
          const result = spawnSync(
            'java',
            ['-cp', directory + delimiter + join(work, 'traj.jar'), 'TraExamplesChecks'],
            { encoding: 'utf8', timeout: 15000 },
          )
          assert.equal(result.status, 0, result.stdout + result.stderr)
          assert.match(result.stdout, /All TRA graph checks passed/)
        },
      )
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
