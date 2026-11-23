import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { traJavaExamples } from '../src/data/traJavaExamples.js'
import { traJavaExampleTranslations } from '../src/i18n/traJavaExamples.js'
import { javaLessonExcerpt } from '../src/utils/javaLesson.js'
import { packageTraExamples, traExampleSourceFiles } from '../scripts/package-tra-examples.mjs'
import { readTraLibrary } from '../scripts/tra-library.mjs'
import { topics } from '../src/data/topics.js'

const sourceRoot = resolve('src/tra-examples')

test('short teaching sources have exact excerpts, topic placement and three complete explanations', () => {
  const sourceFiles = readdirSync(join(sourceRoot, 'lessons'), { recursive: true })
    .filter(name => name.endsWith('.java'))
    .map(name => `lessons/${name}`)
  assert.deepEqual(sourceFiles.sort(), traJavaExamples.map(example => example.sourcePath).sort())
  assert.equal(new Set(traJavaExamples.map(example => example.id)).size, traJavaExamples.length)
  assert.equal(
    new Set(traJavaExamples.map(example => example.className)).size,
    traJavaExamples.length,
  )
  for (const example of traJavaExamples) {
    const source = readFileSync(join(sourceRoot, example.sourcePath), 'utf8')
    const excerpt = javaLessonExcerpt(source)
    assert.ok(excerpt.trim())
    assert.match(source, /import fi\.uef\.cs\.tra\./)
    assert.match(source, /public static void main/)
    assert.doesNotMatch(source, /class (Result|State)\b/)
    for (const topic of example.topics) assert.ok(topics.some(item => item.id === topic))
    assert.ok(example.output && example.output !== 'PENDING')
    for (const [language, labels] of Object.entries(traJavaExampleTranslations)) {
      assert.ok(labels.groups[example.group], `${language}: ${example.group}`)
      assert.equal(labels.examples[example.id].length, 4)
      assert.ok(labels.examples[example.id].every(value => value.trim()))
    }
  }
  for (const [language, labels] of Object.entries(traJavaExampleTranslations)) {
    assert.equal(Object.keys(labels.examples).length, traJavaExamples.length)
    for (const key of [
      'title',
      'intro',
      'download',
      'setup',
      'input',
      'code',
      'complete',
      'advanced',
      'explanation',
      'order',
      'traceTitle',
      'setupTitle',
    ])
      assert.ok(labels[key]?.trim(), `${language}: ${key}`)
    for (const field of ['contracts', 'traces']) {
      assert.deepEqual(
        Object.keys(labels[field]),
        Object.keys(traJavaExampleTranslations.en[field]),
      )
      for (const [id, value] of Object.entries(labels[field])) {
        assert.ok(traJavaExamples.some(example => example.id === id))
        assert.ok((Array.isArray(value) ? value : [value]).every(item => item.trim()))
      }
    }
    assert.match(labels.intro, /JDK 11/)
    if (language !== 'ru') assert.doesNotMatch(JSON.stringify(labels), /[а-яё]/i)
    const name = language === 'en' ? 'README.md' : `README.${language}.md`
    const readme = readFileSync(join(sourceRoot, name), 'utf8')
    for (const example of traJavaExamples)
      assert.ok(readme.includes(`-cp traj.jar ${example.sourcePath}`))
  }
  // Keep these introductory methods independent: students should not need the colour/timing lesson.
  const dfs = readFileSync(join(sourceRoot, 'lessons/dfs/TraSimpleDfs.java'), 'utf8')
  assert.doesNotMatch(dfs, /GREY|BLACK|\btin\b|\btout\b/)
  const basics = traJavaExamples.filter(example => example.topics.includes('graph-basics'))
  assert.equal(basics.length, 5)
  assert.ok(basics.every(example => example.group === 'basics' && !example.advanced))
  assert.equal(
    traJavaExamples.some(example => example.className === 'TraTraversalExample'),
    false,
  )
})

test('a missing or ambiguous Java teaching region fails rather than showing unrelated source', () => {
  assert.equal(
    javaLessonExcerpt('    // lesson:start\n    first();\n        second();\n    // lesson:end'),
    'first();\n    second();',
  )
  for (const source of [
    '',
    '// lesson:start\n// lesson:end',
    '// lesson:start\na\n// lesson:start\nb\n// lesson:end',
  ])
    assert.throws(() => javaLessonExcerpt(source), /Java lesson region/)
})

const hasJdk = ['java', 'javac', 'jar'].every(name => spawnSync(name, ['--version']).status === 0)
test(
  'student ZIP sources run independently on Java 11 and pass separate algorithm references',
  {
    skip: hasJdk ? false : 'JDK 11+ required',
  },
  async t => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-compact-tra-'))
    try {
      const archive = packageTraExamples(join(directory, 'student.zip'))
      const unpack = spawnSync('jar', ['xf', archive], { cwd: directory, encoding: 'utf8' })
      assert.equal(unpack.status, 0, unpack.stderr)
      const work = join(directory, 'tra-graphs')
      for (const name of traExampleSourceFiles) {
        assert.deepEqual(readFileSync(join(work, name)), readFileSync(join(sourceRoot, name)))
      }
      assert.deepEqual(readFileSync(join(work, 'traj.jar')), readTraLibrary())
      assert.equal(
        readdirSync(work).filter(name => name.endsWith('.java')).length,
        0,
        'No technical reference files in student ZIP',
      )
      for (const group of new Set(traJavaExamples.map(example => example.group))) {
        const commands = readFileSync(join(work, 'lessons', group, 'RUN.txt'), 'utf8')
        for (const example of traJavaExamples.filter(example => example.group === group))
          assert.ok(commands.includes(`-cp traj.jar ${example.sourcePath}`))
      }
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
          ...traJavaExamples.map(example => join(work, example.sourcePath)),
          resolve('tests/fixtures/TraLessonChecks.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      for (const name of readdirSync(directory).filter(name => name.endsWith('.class')))
        assert.equal(readFileSync(join(directory, name)).readUInt16BE(6), 55)
      for (const example of traJavaExamples) {
        await t.test(`${example.className}: independent download and expected output`, () => {
          // Use exactly the README command, from the folder containing the ZIP's JAR.
          const source = spawnSync(
            'java',
            ['-Dfile.encoding=UTF-8', '-cp', 'traj.jar', example.sourcePath],
            {
              cwd: work,
              encoding: 'utf8',
              timeout: 15000,
            },
          )
          assert.equal(source.status, 0, source.stderr)
          assert.equal(source.stdout.trim().replace(/\r\n/g, '\n'), example.output)
          const compiled = spawnSync(
            'java',
            ['-cp', directory + delimiter + join(work, 'traj.jar'), example.className],
            {
              encoding: 'utf8',
              timeout: 10000,
            },
          )
          assert.equal(compiled.status, 0, compiled.stderr)
          assert.equal(compiled.stdout.trim().replace(/\r\n/g, '\n'), example.output)
          assert.ok(
            readFileSync(join(work, 'expected-output.txt'), 'utf8').includes(example.output),
          )
        })
      }
      const checks = spawnSync(
        'java',
        ['-cp', directory + delimiter + join(work, 'traj.jar'), 'TraLessonChecks'],
        {
          encoding: 'utf8',
          timeout: 30000,
        },
      )
      assert.equal(checks.status, 0, checks.stdout + checks.stderr)
      assert.match(checks.stdout, /Independent compact TRA lesson checks passed/)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
