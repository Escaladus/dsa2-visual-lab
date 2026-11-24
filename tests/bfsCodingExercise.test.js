import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { exercisePackageFiles, packageBfsExercise } from '../scripts/package-graph-exercise.mjs'
import { readTraLibrary } from '../scripts/tra-library.mjs'
import { bfsCodingExerciseTranslations } from '../src/i18n/bfsCodingExercise.js'

const kit = resolve('exercises/bfs-distances')
const imports = readFileSync(join(kit, 'Solution.java'), 'utf8')
  .match(/^import .+;/gm)
  .join('\n')
const correctMethod = `
    public static Map<Vertex, Integer> distances(Vertex start) {
        Map<Vertex, Integer> distance = new IdentityHashMap<>();
        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        distance.put(start, 0);
        queue.offer(start);
        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();
            for (Vertex next : vertex.neighbors()) {
                if (!distance.containsKey(next)) {
                    distance.put(next, distance.get(vertex) + 1);
                    queue.offer(next);
                }
            }
        }
        return distance;
    }
`
const solution = body => `${imports}\npublic class Solution {\n${body}\n}\n`
const java = process.env.GRAPH_EXERCISE_JDK
  ? join(process.env.GRAPH_EXERCISE_JDK, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')
  : 'java'
const javac = process.env.GRAPH_EXERCISE_JDK
  ? join(
      process.env.GRAPH_EXERCISE_JDK,
      'bin',
      process.platform === 'win32' ? 'javac.exe' : 'javac',
    )
  : 'javac'
const hasJdk = [java, javac, 'jar'].every(name => spawnSync(name, ['--version']).status === 0)

test('BFS exercise has matching instructions, hints and optional reasoning in three languages', () => {
  function shape(value) {
    if (Array.isArray(value)) return value.map(shape)
    if (typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
    assert.ok(typeof value === 'string' && value.trim())
    return 'text'
  }
  const reference = shape(bfsCodingExerciseTranslations.en)
  for (const [lang, labels] of Object.entries(bfsCodingExerciseTranslations)) {
    assert.deepEqual(shape(labels), reference)
    assert.equal(labels.steps.length, 3)
    assert.equal(labels.selfItems.length, 3)
    const name = lang === 'fi' ? 'README.fi.md' : 'README.md'
    const instructions = readFileSync(join(kit, name), 'utf8')
    assert.ok(
      instructions.includes(`java -Dfile.encoding=UTF-8 Check.java ${lang === 'fi' ? 'fi' : 'en'}`),
    )
    assert.ok(instructions.includes('bfs-distances'))
    assert.match(labels.example, /0:0, 1:1, 2:1, 3:2/)
    assert.ok(labels.rules[1].includes('WHITE') === false)
  }
})

test(
  'BFS exercise download runs on Java 11 and reports useful failures and successful retries',
  {
    skip: hasJdk ? false : 'JDK 11+ required',
  },
  async t => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-bfs-exercise-'))
    try {
      const archive = packageBfsExercise(join(directory, 'bfs.zip'))
      assert.deepEqual(
        readFileSync(archive),
        readFileSync(packageBfsExercise(join(directory, 'second.zip'))),
      )
      const extract = spawnSync('jar', ['xf', archive], { cwd: directory, encoding: 'utf8' })
      assert.equal(extract.status, 0, extract.stderr)
      const work = join(directory, 'bfs-distances')
      const compiled = join(directory, 'compiled')
      mkdirSync(compiled)
      for (const name of exercisePackageFiles) {
        const expected = name === 'traj.jar' ? readTraLibrary() : readFileSync(join(kit, name))
        assert.deepEqual(readFileSync(join(work, name)), expected)
      }
      function compile(body) {
        writeFileSync(join(work, 'Solution.java'), solution(body))
        const result = spawnSync(
          javac,
          [
            '--release',
            '11',
            '-Xlint:all',
            '-encoding',
            'UTF-8',
            '-cp',
            'traj.jar',
            '-d',
            compiled,
            'Solution.java',
            'GraphChecks.java',
            'Check.java',
          ],
          { cwd: work, encoding: 'utf8', timeout: 15000 },
        )
        assert.equal(result.status, 0, result.stderr)
        assert.equal(result.stderr, '')
      }
      function worker(index, lang = 'en') {
        return spawnSync(
          java,
          [
            '-cp',
            compiled + delimiter + join(work, 'traj.jar'),
            'GraphChecks',
            String(index),
            lang,
          ],
          { cwd: work, encoding: 'utf8', timeout: 10000 },
        )
      }
      function run(lang = 'en') {
        return spawnSync(java, ['-Dfile.encoding=UTF-8', 'Check.java', lang], {
          cwd: work,
          encoding: 'utf8',
          timeout: 35000,
        })
      }
      await t.test('untouched starter explains the TODO and allows another attempt', () => {
        const result = run()
        assert.equal(result.status, 1, result.stderr)
        assert.match(result.stdout, /TODO: implement distances/)
        assert.match(result.stdout, /Passed: 0\/10/)
      })
      await t.test(
        'correct BFS passes all three languages and generates version 55 classes',
        () => {
          compile(correctMethod)
          for (const name of ['Solution', 'Check', 'GraphChecks'])
            assert.equal(readFileSync(join(compiled, name + '.class')).readUInt16BE(6), 55)
          for (const [lang, summary] of [
            ['en', 'Passed: 10/10'],
            ['ru', 'Пройдено: 10/10'],
            ['fi', 'Läpäisty: 10/10'],
          ]) {
            const result = run(lang)
            assert.equal(result.status, 0, result.stdout + result.stderr)
            assert.ok(result.stdout.includes(summary))
          }
        },
      )
      await t.test('DFS discovery depth is rejected when a direct shorter path exists', () => {
        compile(`public static Map<Vertex, Integer> distances(Vertex start) {
          Map<Vertex, Integer> distance = new IdentityHashMap<>();
          visit(start, 0, distance);
          return distance;
      }
      static void visit(Vertex vertex, int depth, Map<Vertex, Integer> distance) {
          if (distance.containsKey(vertex)) return;
          distance.put(vertex, depth);
          for (Vertex next : vertex.neighbors()) visit(next, depth + 1, distance);
      }`)
        const result = worker(6)
        assert.equal(result.status, 1)
        assert.match(result.stdout, /Wrong distance at vertex 3: expected 1, received 3/)
        assert.match(result.stdout, /Input edges:.*start=0/)
      })
      await t.test('using labels as identity loses same-label vertices', () => {
        compile(
          correctMethod.replace(
            'if (!distance.containsKey(next))',
            'if (!distance.containsKey(next) && !next.getLabel().equals(start.getLabel()))',
          ),
        )
        const result = worker(8)
        assert.equal(result.status, 1)
        assert.match(result.stdout, /Wrong distance at vertex 1/)
      })
      await t.test('changing input colours violates this map-based task contract', () => {
        compile(
          correctMethod.replace(
            'distance.put(start, 0);',
            'start.setColor(123);\n distance.put(start, 0);',
          ),
        )
        const result = worker(0)
        assert.equal(result.status, 1)
        assert.match(result.stdout, /Input vertex fields changed/)
      })
      await t.test('null result and foreign keys have distinct explanations', () => {
        compile('public static Map<Vertex, Integer> distances(Vertex start) { return null; }')
        assert.match(worker(0).stdout, /Returned null/)
        compile(
          correctMethod.replace(
            'return distance;',
            'distance.put(new fi.uef.cs.tra.DiGraph().addVertex("foreign"), 99); return distance;',
          ),
        )
        assert.match(worker(0).stdout, /foreign or extra keys/)
      })
      await t.test(
        'a compiler error cannot reuse an old class; corrected code passes again',
        () => {
          writeFileSync(join(work, 'Solution.java'), solution('this is not Java'))
          const broken = run('ru')
          assert.equal(broken.status, 1)
          assert.match(broken.stderr, /Ошибка компиляции/)
          compile(correctMethod)
          const corrected = run()
          assert.equal(corrected.status, 0, corrected.stdout + corrected.stderr)
          assert.match(corrected.stdout, /Every run starts fresh/)
        },
      )
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
