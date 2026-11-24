import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { exercisePackageFiles, packageBfsPathExercise } from '../scripts/package-graph-exercise.mjs'
import { readTraLibrary } from '../scripts/tra-library.mjs'
import { bfsPathExerciseTranslations } from '../src/i18n/bfsPathExercise.js'

const kit = resolve('exercises/bfs-path')
const starter = readFileSync(join(kit, 'Solution.java'), 'utf8')
const imports = starter.match(/^import .+;/gm).join('\n')
const correctMethod = `
    public static List<Vertex> shortestPath(Vertex start, Vertex target) {
        Map<Vertex, Vertex> parent = new IdentityHashMap<>();
        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        parent.put(start, null);
        queue.offer(start);
        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();
            for (Vertex next : vertex.neighbors()) {
                if (!parent.containsKey(next)) {
                    parent.put(next, vertex);
                    queue.offer(next);
                }
            }
        }
        return path(target, parent);
    }
    static List<Vertex> path(Vertex target, Map<Vertex, Vertex> parent) {
        List<Vertex> path = new ArrayList<>();
        if (!parent.containsKey(target)) {
            return path;
        }
        for (Vertex vertex = target; vertex != null; vertex = parent.get(vertex)) {
            path.add(vertex);
        }
        Collections.reverse(path);
        return path;
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

test('path task specifies actual vertices, special cases, parent reconstruction and three-language instructions', () => {
  function shape(value) {
    if (Array.isArray(value)) return value.map(shape)
    if (typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
    assert.ok(typeof value === 'string' && value.trim())
    return 'text'
  }
  const reference = shape(bfsPathExerciseTranslations.en)
  for (const [lang, labels] of Object.entries(bfsPathExerciseTranslations)) {
    assert.deepEqual(shape(labels), reference)
    assert.equal(labels.walkthrough.length, 4)
    assert.equal(labels.hintItems.length, 3)
    assert.equal(labels.selfItems.length, 3)
    assert.equal(
      labels.signature,
      'public static List<Vertex> shortestPath(Vertex start, Vertex target)',
    )
    assert.ok(labels.example.includes('[0, 1, 3]') && labels.example.includes('[0, 2, 3]'))
    const filename = lang === 'fi' ? 'README.fi.md' : 'README.md'
    const readme = readFileSync(join(kit, filename), 'utf8')
    assert.ok(
      readme.includes(`java -Dfile.encoding=UTF-8 Check.java ${lang === 'fi' ? 'fi' : 'en'}`),
    )
    assert.ok(readme.includes(labels.signature))
    assert.ok(readme.includes('bfs-path'))
    if (lang !== 'ru') assert.doesNotMatch(JSON.stringify(labels), /[а-яё]/i)
  }
  assert.match(starter, /TODO: implement shortestPath/)
})

test(
  'actual shortest-path kit accepts alternatives and rejects incorrect routes on Java 11',
  {
    skip: hasJdk ? false : 'JDK 11+ required',
  },
  async t => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-bfs-path-'))
    try {
      const archive = packageBfsPathExercise(join(directory, 'path.zip'))
      assert.deepEqual(
        readFileSync(archive),
        readFileSync(packageBfsPathExercise(join(directory, 'same.zip'))),
      )
      const extract = spawnSync('jar', ['xf', archive], { cwd: directory, encoding: 'utf8' })
      assert.equal(extract.status, 0, extract.stderr)
      const work = join(directory, 'bfs-path')
      const compiled = join(directory, 'compiled')
      mkdirSync(compiled)
      for (const name of exercisePackageFiles)
        assert.deepEqual(
          readFileSync(join(work, name)),
          name === 'traj.jar' ? readTraLibrary() : readFileSync(join(kit, name)),
        )
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
      await t.test(
        'starter reports TODO, then correct BFS passes all ten groups in every language',
        () => {
          const initial = run()
          assert.equal(initial.status, 1)
          assert.match(initial.stdout, /TODO: implement shortestPath/)
          assert.match(initial.stdout, /Passed: 0\/10/)
          compile(correctMethod)
          for (const name of ['Solution', 'Check', 'GraphChecks'])
            assert.equal(readFileSync(join(compiled, name + '.class')).readUInt16BE(6), 55)
          for (const [lang, expected] of [
            ['en', 'Passed: 10/10'],
            ['ru', 'Пройдено: 10/10'],
            ['fi', 'Läpäisty: 10/10'],
          ]) {
            const result = run(lang)
            assert.equal(result.status, 0, result.stdout + result.stderr)
            assert.ok(result.stdout.includes(expected))
          }
        },
      )
      await t.test('opposite neighbour order chooses the other valid shortest route', () => {
        const reversed = correctMethod.replace(
          'for (Vertex next : vertex.neighbors()) {',
          `List<Vertex> neighbors = new ArrayList<>();
          for (Vertex next : vertex.neighbors()) neighbors.add(next);
          Collections.reverse(neighbors);
          for (Vertex next : neighbors) {`,
        )
        compile(reversed)
        const result = run()
        assert.equal(result.status, 0, result.stdout + result.stderr)
        // Prove that this fixture actually picks 0->2->3, rather than rechecking the same route.
        writeFileSync(
          join(work, 'Alternative.java'),
          `import fi.uef.cs.tra.*;
      public class Alternative {
          public static void main(String[] args) {
              DiGraph g = new DiGraph(); Vertex a=g.addVertex("0"), b=g.addVertex("1"), c=g.addVertex("2"), d=g.addVertex("3");
              a.addEdge(b); a.addEdge(c); b.addEdge(d); c.addEdge(d);
              if (Solution.shortestPath(a,d).get(1) != c) throw new AssertionError("Expected alternative via 2");
          }
      }`,
        )
        const check = spawnSync(
          javac,
          [
            '--release',
            '11',
            '-cp',
            compiled + delimiter + 'traj.jar',
            '-d',
            compiled,
            'Alternative.java',
          ],
          { cwd: work, encoding: 'utf8', timeout: 10000 },
        )
        assert.equal(check.status, 0, check.stderr)
        const alternative = spawnSync(
          java,
          ['-cp', compiled + delimiter + join(work, 'traj.jar'), 'Alternative'],
          { encoding: 'utf8', timeout: 10000 },
        )
        assert.equal(alternative.status, 0, alternative.stderr)
      })
      await t.test('a backwards parent chain gets a specific explanation', () => {
        compile(correctMethod.replace('Collections.reverse(path);', ''))
        const result = worker(2)
        assert.equal(result.status, 1)
        assert.match(result.stdout, /Did you reverse the parent chain/)
        assert.match(result.stdout, /Returned path IDs: \[3, 2, 1, 0\]/)
      })
      await t.test('a real DFS route is rejected if a shorter direct route exists', () => {
        compile(
          `public static List<Vertex> shortestPath(Vertex start, Vertex target) {
          Map<Vertex, Vertex> parent = new IdentityHashMap<>(); parent.put(start,null);
          visit(start,parent); return path(target,parent);
      }
      static void visit(Vertex vertex, Map<Vertex, Vertex> parent) {
          for (Vertex next : vertex.neighbors()) if (!parent.containsKey(next)) { parent.put(next,vertex); visit(next,parent); }
      }` + correctMethod.slice(correctMethod.indexOf('    static List<Vertex> path(')),
        )
        const result = worker(4)
        assert.equal(result.status, 1)
        assert.match(result.stdout, /Path is not shortest: expected 1 edges, received 3/)
      })
      await t.test('null, a missing edge and an unreachable target have distinct feedback', () => {
        compile(
          'public static List<Vertex> shortestPath(Vertex start, Vertex target) { return null; }',
        )
        assert.match(worker(1).stdout, /Returned null/)
        compile(
          'public static List<Vertex> shortestPath(Vertex start, Vertex target) { return List.of(start,target); }',
        )
        assert.match(worker(2).stdout, /Missing directed edge: 0->3/)
        assert.match(worker(7).stdout, /Target is unreachable/)
      })
      await t.test(
        'start equals target is a one-vertex path and labels cannot replace identity',
        () => {
          compile(
            correctMethod.replace(
              'if (!parent.containsKey(target))',
              'if (parent.get(target) == null)',
            ),
          )
          assert.match(worker(0).stdout, /A path exists; expected a nonempty list/)
          compile(
            correctMethod.replace(
              'if (!parent.containsKey(next))',
              'if (!parent.containsKey(next) && !next.getLabel().equals(start.getLabel()))',
            ),
          )
          assert.equal(worker(8).status, 1)
        },
      )
      await t.test('foreign vertices, repeated vertices and changed input are rejected', () => {
        compile(
          'public static List<Vertex> shortestPath(Vertex start, Vertex target) { return List.of(new fi.uef.cs.tra.DiGraph().addVertex("0")); }',
        )
        assert.match(worker(0).stdout, /actual input Vertex objects/)
        compile(
          'public static List<Vertex> shortestPath(Vertex start, Vertex target) { return List.of(start,start,target); }',
        )
        assert.match(worker(3).stdout, /Repeated vertex/)
        compile(
          correctMethod.replace(
            'parent.put(start, null);',
            'start.setColor(123); parent.put(start, null);',
          ),
        )
        assert.match(worker(0).stdout, /Input vertex fields changed/)
        compile(
          correctMethod.replace(
            'parent.put(start, null);',
            'start.addEdge(target); parent.put(start, null);',
          ),
        )
        assert.match(worker(2).stdout, /Graph edges changed/)
      })
      await t.test('fresh compilation rejects a broken edit and a corrected attempt passes', () => {
        writeFileSync(join(work, 'Solution.java'), solution('this is not Java'))
        const broken = run('ru')
        assert.equal(broken.status, 1)
        assert.match(broken.stderr, /Ошибка компиляции/)
        compile(correctMethod)
        const corrected = run()
        assert.equal(corrected.status, 0, corrected.stdout + corrected.stderr)
        assert.match(corrected.stdout, /Every run starts fresh/)
      })
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
