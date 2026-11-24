import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'
import {
  createStoredZip,
  exercisePackageFiles,
  packageGraphExercise,
} from '../scripts/package-graph-exercise.mjs'
import { graphCodingExerciseTranslations } from '../src/i18n/graphCodingExercise.js'
import { readTraLibrary } from '../scripts/tra-library.mjs'

const kit = resolve('exercises/dfs-reachable')
const referenceMethod = `
    public static int reachableCount(Vertex start) {
        if (start.getColor() != AbstractGraph.WHITE) return 0;
        start.setColor(AbstractGraph.GREY);
        int count = 1;
        for (Vertex next : start.neighbors()) count += reachableCount(next);
        start.setColor(AbstractGraph.BLACK);
        return count;
    }
`
// Keep the starter imports in the fixtures: a correct method must compile
// without students first having to repair the supplied template.
const starterImports = readFileSync(join(kit, 'Solution.java'), 'utf8')
  .match(/^import .+;/gm)
  .join('\n')
const solution = body => `${starterImports}\npublic class Solution {\n${body}\n}\n`

test('graph coding task: the supplied JAR is unchanged and the archive is reproducible', () => {
  const jar = readFileSync(join(kit, 'traj.jar'))
  assert.deepEqual(jar, readTraLibrary())
  const files = exercisePackageFiles.map(name => ({
    name: `dfs-reachable/${name}`,
    data: readFileSync(join(kit, name)),
  }))
  assert.deepEqual(createStoredZip(files), createStoredZip(files))
  const knownCrc = createStoredZip([{ name: 'check.txt', data: Buffer.from('123456789') }])
  assert.equal(knownCrc.readUInt32LE(14), 0xcbf43926)
  assert.equal(knownCrc.readUInt16LE(8), 0, 'The small archive uses stored entries')
  assert.equal(knownCrc.readUInt32LE(knownCrc.length - 22), 0x06054b50)
})

test('graph coding task: all languages cover instructions, library methods, feedback and freely repeatable checks', () => {
  function shape(value) {
    if (Array.isArray(value)) return value.map(shape)
    if (value && typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
    assert.equal(typeof value, 'string')
    assert.ok(value.trim())
    return 'text'
  }
  const expected = shape(graphCodingExerciseTranslations.en)
  for (const [language, labels] of Object.entries(graphCodingExerciseTranslations)) {
    assert.deepEqual(shape(labels), expected)
    assert.equal(labels.steps.length, 3)
    assert.equal(labels.hintItems.length, 3)
    assert.deepEqual(
      labels.api.map(([method]) => method),
      ['vertex.neighbors()', 'vertex.getColor()', 'vertex.setColor(AbstractGraph.GREY)'],
    )
    assert.match(labels.example, /start = 0.*4/)
    const readme = readFileSync(join(kit, language === 'fi' ? 'README.fi.md' : 'README.md'), 'utf8')
    assert.ok(
      readme.includes(`java -Dfile.encoding=UTF-8 Check.java ${language === 'fi' ? 'fi' : 'en'}`),
    )
    assert.ok(readme.includes('Solution.java'))
    assert.ok(readme.includes('GREY'))
  }
})

const javaTool = name =>
  process.env.GRAPH_EXERCISE_JDK
    ? join(
        process.env.GRAPH_EXERCISE_JDK,
        'bin',
        `${name}${process.platform === 'win32' ? '.exe' : ''}`,
      )
    : name
const hasJdk = ['java', 'javac', 'jar'].every(
  command => spawnSync(javaTool(command), ['--version']).status === 0,
)

test(
  'graph coding task: the downloaded kit checks real student code with the supplied library',
  { skip: hasJdk ? false : 'JDK 11+ is required to check the downloaded exercise' },
  async t => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-graph-task-'))
    try {
      const zip = packageGraphExercise(join(directory, 'task.zip'))
      const unpack = spawnSync(javaTool('jar'), ['xf', zip], { cwd: directory, encoding: 'utf8' })
      assert.equal(unpack.status, 0, unpack.stderr)
      const work = join(directory, 'dfs-reachable')
      for (const name of exercisePackageFiles) {
        assert.deepEqual(readFileSync(join(work, name)), readFileSync(join(kit, name)), name)
      }
      const runCheck = language =>
        spawnSync(javaTool('java'), ['-Dfile.encoding=UTF-8', 'Check.java', language], {
          cwd: work,
          encoding: 'utf8',
          timeout: 35000,
        })
      const writeSolution = body => writeFileSync(join(work, 'Solution.java'), solution(body))

      await t.test(
        'all delivered Java files compile against Java 11 and produce version 55 classes',
        () => {
          const output = join(directory, 'java11-classes')
          const compile = spawnSync(
            javaTool('javac'),
            [
              '--release',
              '11',
              '-Xlint:all',
              '-encoding',
              'UTF-8',
              '-classpath',
              'traj.jar',
              '-d',
              output,
              'Check.java',
              'GraphChecks.java',
              'Solution.java',
            ],
            { cwd: work, encoding: 'utf8', timeout: 15000 },
          )
          assert.equal(compile.status, 0, compile.stderr)
          assert.equal(compile.stderr, '')
          for (const name of ['Check', 'GraphChecks', 'GraphChecks$Case', 'Solution']) {
            assert.equal(readFileSync(join(output, `${name}.class`)).readUInt16BE(6), 55, name)
          }
        },
      )

      await t.test('starter compiles and clearly reports unfinished work', () => {
        const run = runCheck('en')
        assert.equal(run.status, 1, run.stderr)
        assert.match(run.stdout, /TODO: implement reachableCount/)
        assert.match(run.stdout, /Passed: 0\/10/)
        assert.match(run.stdout, /Every run starts fresh/)
      })

      await t.test(
        'a recursive solution passes all fixtures and generated graphs in all feedback languages',
        () => {
          writeSolution(referenceMethod)
          for (const [language, expected] of [
            ['en', 'Passed: 10/10'],
            ['ru', 'Пройдено: 10/10'],
            ['fi', 'Läpäisty: 10/10'],
          ]) {
            const run = runCheck(language)
            assert.equal(run.status, 0, run.stdout + run.stderr)
            assert.ok(run.stdout.includes(expected))
            assert.equal((run.stdout.match(/PASS:/g) ?? []).length, 10)
          }
        },
      )

      function worker(body, caseIndex, expectedFeedback) {
        writeSolution(body)
        const compile = spawnSync(
          javaTool('javac'),
          [
            '--release',
            '11',
            '-Xlint:all',
            '-encoding',
            'UTF-8',
            '-classpath',
            'traj.jar',
            'Solution.java',
            'GraphChecks.java',
          ],
          { cwd: work, encoding: 'utf8', timeout: 15000 },
        )
        assert.equal(compile.status, 0, compile.stderr)
        assert.equal(compile.stderr, '')
        const run = spawnSync(
          javaTool('java'),
          [
            '-Xss1m',
            '-cp',
            `.${process.platform === 'win32' ? ';' : ':'}traj.jar`,
            'GraphChecks',
            String(caseIndex),
            'en',
          ],
          { cwd: work, encoding: 'utf8', timeout: 10000 },
        )
        assert.equal(run.status, 1, run.stdout + run.stderr)
        assert.match(run.stdout, expectedFeedback)
      }

      await t.test('returning a count without visited colours is rejected', () => {
        worker(
          'public static int reachableCount(Vertex start) { return 1; }',
          0,
          /Mark reached vertices GREY or BLACK/,
        )
      })
      await t.test('counting only immediate neighbours reports the actual counterexample', () => {
        worker(
          'public static int reachableCount(Vertex start) { start.setColor(AbstractGraph.GREY); int n=1; for(Vertex v : start.neighbors()) n++; return n; }',
          1,
          /Expected: 4; received: 2/,
        )
      })
      await t.test('counting labels instead of vertex objects fails duplicate labels', () => {
        worker(
          `static java.util.Set<String> seen = new java.util.HashSet<>();
        public static int reachableCount(Vertex start) {
          if(!seen.add(start.getLabel())) return 0;
          start.setColor(AbstractGraph.GREY);
          int n=1; for(Vertex v:start.neighbors()) n+=reachableCount(v); return n;
        }`,
          8,
          /Expected: 3; received: 1/,
        )
      })
      await t.test('changing graph edges is detected even when the count is right', () => {
        const recursiveHelper = referenceMethod.replaceAll('reachableCount', 'visit')
        worker(
          `public static int reachableCount(Vertex start) {
            int count = visit(start);
            start.removeEdges();
            return count;
          }\n${recursiveHelper}`,
          1,
          /Do not change vertices or edges/,
        )
      })
      await t.test('a missing visited guard reports stack overflow on a cycle', () => {
        worker(
          referenceMethod.replace('if (start.getColor() != AbstractGraph.WHITE) return 0;', ''),
          3,
          /Stack overflow/,
        )
      })
      await t.test('a compilation error cannot reuse an earlier successful class file', () => {
        writeSolution('public static int reachableCount(Vertex start) { return ; }')
        const run = runCheck('ru')
        assert.equal(run.status, 1)
        assert.match(run.stderr, /Ошибка компиляции/)
        assert.match(run.stderr, /Solution.java:\d+/)
        assert.doesNotMatch(run.stdout, /PASS:/)
        writeSolution(referenceMethod)
        const corrected = runCheck('ru')
        assert.equal(corrected.status, 0, corrected.stdout + corrected.stderr)
        assert.match(corrected.stdout, /Пройдено: 10\/10/)
      })
      await t.test('nontermination reaches a time limit and the next run can pass', () => {
        writeSolution(
          referenceMethod.replace(
            'if (start.getColor()',
            'if (start.getLabel().equals("v0") && !start.neighbors().iterator().hasNext()) { while (true) {} }\n        if (start.getColor()',
          ),
        )
        const run = runCheck('en')
        assert.equal(run.status, 1, run.stdout + run.stderr)
        assert.match(run.stdout, /TIME LIMIT \(5 seconds\)/)
        assert.match(run.stdout, /Every run starts fresh/)
        writeSolution(referenceMethod)
        assert.equal(runCheck('en').status, 0)
      })
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
