import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import {
  componentsExercisePackageFiles,
  packageComponentsExercise,
} from '../scripts/package-graph-exercise.mjs'
import { readTraLibrary } from '../scripts/tra-library.mjs'
import { componentsCodingExerciseTranslations } from '../src/i18n/componentsCodingExercise.js'

const kit = resolve('exercises/graph-components')
const starter = readFileSync(join(kit, 'Solution.java'), 'utf8')
const imports = starter.match(/^import .+;/gm).join('\n')
const correctBfs = `
    public static List<List<Vertex>> components(Graph graph) {
        List<List<Vertex>> result = new ArrayList<>();
        Set<Vertex> visited = Collections.newSetFromMap(new IdentityHashMap<>());
        for (Vertex root : graph.vertices()) {
            if (visited.contains(root)) continue;
            List<Vertex> component = new ArrayList<>();
            LinkedQueue<Vertex> queue = new LinkedQueue<>();
            visited.add(root);
            queue.offer(root);
            while (!queue.isEmpty()) {
                Vertex vertex = queue.remove();
                component.add(vertex);
                for (Vertex next : vertex.neighbors()) {
                    if (visited.add(next)) queue.offer(next);
                }
            }
            result.add(component);
        }
        return result;
    }
`
const alternativeDfs = `
    public static List<List<Vertex>> components(Graph graph) {
        List<List<Vertex>> result = new ArrayList<>();
        Set<Vertex> visited = Collections.newSetFromMap(new IdentityHashMap<>());
        for (Vertex root : graph.vertices()) {
            if (visited.contains(root)) continue;
            List<Vertex> component = new ArrayList<>();
            visit(root, visited, component);
            Collections.reverse(component);
            result.add(component);
        }
        Collections.reverse(result);
        return result;
    }
    static void visit(Vertex vertex, Set<Vertex> visited, List<Vertex> component) {
        if (!visited.add(vertex)) return;
        component.add(vertex);
        for (Vertex next : vertex.neighbors()) visit(next, visited, component);
    }
`
const solution = body => `${imports}\npublic class Solution {\n${body}\n}\n`
const executable = name =>
  process.env.GRAPH_EXERCISE_JDK
    ? join(
        process.env.GRAPH_EXERCISE_JDK,
        'bin',
        process.platform === 'win32' ? `${name}.exe` : name,
      )
    : name
const java = executable('java')
const javac = executable('javac')
const jar = executable('jar')
const hasJdk = [java, javac, jar].every(name => spawnSync(name, ['--version']).status === 0)

test('component task has complete translations, a small partition example and English-only README', () => {
  function shape(value) {
    if (Array.isArray(value)) return value.map(shape)
    if (typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
    assert.ok(typeof value === 'string' && value.trim())
    return 'text'
  }
  const reference = shape(componentsCodingExerciseTranslations.en)
  const readme = readFileSync(join(kit, 'README.md'), 'utf8')
  for (const [lang, labels] of Object.entries(componentsCodingExerciseTranslations)) {
    assert.deepEqual(shape(labels), reference)
    assert.equal(labels.walkthrough.length, 4)
    assert.equal(labels.hintItems.length, 3)
    assert.equal(labels.selfItems.length, 3)
    assert.equal(labels.signature, 'public static List<List<Vertex>> components(Graph graph)')
    assert.ok(readme.includes(labels.signature))
    assert.ok(labels.example.includes('[[0, 1], [2], [3, 4]]'))
    assert.ok(labels.example.includes('[[4, 3], [1, 0], [2]]'))
    if (lang !== 'ru') assert.doesNotMatch(JSON.stringify(labels), /[а-яё]/i)
  }
  assert.ok(readme.includes('java -Dfile.encoding=UTF-8 Check.java en'))
  assert.deepEqual(
    readdirSync(kit).filter(name => name.startsWith('README')),
    ['README.md'],
  )
  assert.doesNotMatch(readme, /[а-яё]/i)
  assert.match(starter, /TODO: implement components/)
})

test(
  'actual component kit checks partitions independently of DFS/BFS or result order on Java 11',
  { skip: hasJdk ? false : 'JDK 11+ required' },
  async t => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-components-'))
    try {
      const archive = packageComponentsExercise(join(directory, 'components.zip'))
      assert.deepEqual(
        readFileSync(archive),
        readFileSync(packageComponentsExercise(join(directory, 'same.zip'))),
      )
      const extract = spawnSync(jar, ['xf', archive], { cwd: directory, encoding: 'utf8' })
      assert.equal(extract.status, 0, extract.stderr)
      const work = join(directory, 'graph-components')
      // Source launch on Java 11 must not see Check.class in the exercise folder.
      const compiled = join(directory, 'compiled')
      mkdirSync(compiled)
      assert.deepEqual(readdirSync(work).sort(), [...componentsExercisePackageFiles].sort())
      for (const name of componentsExercisePackageFiles)
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
      await t.test('TODO is clear, then BFS passes every group in all three languages', () => {
        const initial = run()
        assert.equal(initial.status, 1)
        assert.match(initial.stdout, /TODO: implement components/)
        assert.match(initial.stdout, /Passed: 0\/10/)
        compile(correctBfs)
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
      })
      await t.test('DFS with reversed components and member lists is equally valid', () => {
        compile(alternativeDfs)
        const result = run()
        assert.equal(result.status, 0, result.stdout + result.stderr)
        // Prove this fixture actually reverses both orders for the displayed graph.
        writeFileSync(
          join(work, 'Alternative.java'),
          `import fi.uef.cs.tra.*;
public class Alternative {
    public static void main(String[] args) {
        Graph g = new Graph(); Vertex[] v = new Vertex[5];
        for (int i=0; i<5; i++) v[i]=g.addVertex(""+i);
        v[0].addEdge(v[1]); v[3].addEdge(v[4]);
        var groups = Solution.components(g);
        if (groups.get(0).get(0)!=v[4] || groups.get(2).get(0)!=v[1])
            throw new AssertionError("Expected reversed component and member order");
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
      await t.test(
        'missing isolated vertices and stopping after one component are explained',
        () => {
          compile(
            correctBfs.replace(
              'if (visited.contains(root))',
              'if (visited.contains(root) || !root.neighbors().iterator().hasNext())',
            ),
          )
          assert.match(worker(4).stdout, /Missing vertex: 2\. Include isolated vertices too/)
          compile(correctBfs.replace('result.add(component);', 'result.add(component); break;'))
          assert.match(worker(4).stdout, /Missing vertex: 2/)
        },
      )
      await t.test('splitting and merging get distinct pair-based diagnostics', () => {
        compile(`public static List<List<Vertex>> components(Graph graph) {
          List<List<Vertex>> result = new ArrayList<>();
          for (Vertex v : graph.vertices()) result.add(List.of(v));
          return result;
        }`)
        const split = worker(3)
        assert.equal(split.status, 1)
        assert.match(split.stdout, /Connected vertices were split.*0, 1/)
        compile(`public static List<List<Vertex>> components(Graph graph) {
          List<Vertex> all = new ArrayList<>();
          for (Vertex v : graph.vertices()) all.add(v);
          return all.isEmpty() ? List.of() : List.of(all);
        }`)
        const merged = worker(4)
        assert.equal(merged.status, 1)
        assert.match(merged.stdout, /Disconnected vertices were merged.*0, 2/)
        assert.match(merged.stdout, /Returned groups \(vertex IDs\): \[\[0, 1, 2, 3, 4\]\]/)
      })
      await t.test('duplicates within or across groups and empty groups are rejected', () => {
        compile(
          correctBfs.replace(
            'component.add(vertex);',
            'component.add(vertex); component.add(vertex);',
          ),
        )
        assert.match(worker(3).stdout, /Repeated vertex/)
        compile(
          correctBfs.replace(
            'result.add(component);',
            'result.add(component); result.add(component);',
          ),
        )
        assert.match(worker(4).stdout, /Repeated vertex/)
        compile(
          'public static List<List<Vertex>> components(Graph graph) { return List.of(List.of()); }',
        )
        assert.match(worker(0).stdout, /Empty component/)
      })
      await t.test('null lists/members and foreign vertices have useful feedback', () => {
        compile('public static List<List<Vertex>> components(Graph graph) { return null; }')
        assert.match(worker(0).stdout, /Returned null/)
        compile(
          'public static List<List<Vertex>> components(Graph graph) { return Collections.singletonList(null); }',
        )
        assert.match(worker(1).stdout, /Each component must be a non-null list/)
        compile(
          'public static List<List<Vertex>> components(Graph graph) { return List.of(Collections.singletonList(null)); }',
        )
        assert.match(worker(1).stdout, /actual input Vertex objects/)
        compile(
          'public static List<List<Vertex>> components(Graph graph) { return List.of(List.of(new Graph().addVertex("0"))); }',
        )
        assert.match(worker(1).stdout, /actual input Vertex objects/)
      })
      await t.test('labels cannot replace vertex identity', () => {
        compile(
          correctBfs.replace(
            'for (Vertex root : graph.vertices()) {',
            `java.util.Set<String> labels = new java.util.HashSet<>();
          for (Vertex root : graph.vertices()) {
            if (!labels.add(root.getLabel())) continue;`,
          ),
        )
        const result = worker(8)
        assert.equal(result.status, 1)
        assert.match(result.stdout, /Missing vertex/)
      })
      await t.test('vertex fields, physical edge fields and topology are preserved', () => {
        for (const mutation of [
          'root.setColor(123);',
          'root.setIndex(123);',
          'root.setWeight(123.0f);',
          'root.setLabel("changed");',
        ]) {
          compile(correctBfs.replace('visited.add(root);', mutation + ' visited.add(root);'))
          assert.match(worker(1).stdout, /Input vertex fields changed/)
        }
        for (const mutation of [
          'edge.setWeight(2.0f);',
          'edge.setColor(123);',
          'edge.setLabel("changed");',
        ]) {
          compile(
            correctBfs.replace(
              'visited.add(root);',
              `for (fi.uef.cs.tra.Edge edge : root.edges()) { ${mutation} } visited.add(root);`,
            ),
          )
          assert.match(worker(3).stdout, /Input edge changed/)
        }
        // Remove one known edge after iteration; removeEdges() in this JAR invalidates its own iterator.
        compile(
          correctBfs.replace(
            'return result;',
            'Vertex first = graph.firstVertex(); first.removeEdge(first.edges().iterator().next()); return result;',
          ),
        )
        assert.match(worker(3).stdout, /Graph edges changed/)
        compile(correctBfs.replace('return result;', 'graph.addVertex("extra"); return result;'))
        assert.match(worker(3).stdout, /Vertex count changed/)
      })
      await t.test('compile failure followed by correction starts a fresh attempt', () => {
        writeFileSync(join(work, 'Solution.java'), solution('this is not Java'))
        const broken = run('ru')
        assert.equal(broken.status, 1)
        assert.match(broken.stderr, /Ошибка компиляции/)
        compile(correctBfs)
        const corrected = run()
        assert.equal(corrected.status, 0, corrected.stdout + corrected.stderr)
        assert.match(corrected.stdout, /Every run starts fresh/)
      })
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
