import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import {
  treeExercisePackageFiles,
  packageTreeTraversalExercise,
} from '../scripts/package-graph-exercise.mjs'
import { readTraLibrary } from '../scripts/tra-library.mjs'
import { treeTraversalExerciseTranslations } from '../src/i18n/treeTraversalExercise.js'

const executable = name =>
  process.env.GRAPH_EXERCISE_JDK
    ? join(
        process.env.GRAPH_EXERCISE_JDK,
        'bin',
        process.platform === 'win32' ? `${name}.exe` : name,
      )
    : name
const java = executable('java'),
  javac = executable('javac'),
  jar = executable('jar')
const hasJdk = [java, javac, jar].every(name => spawnSync(name, ['--version']).status === 0)
const settings = {
  pre: { order: [0, 1, 2], example: '[A, B, D, C]', ids: '[0, 1, 3, 2]' },
  in: { order: [1, 0, 2], example: '[D, B, A, C]', ids: '[3, 1, 0, 2]' },
  post: { order: [1, 2, 0], example: '[D, B, C, A]', ids: '[3, 1, 2, 0]' },
}
const source = body =>
  `import fi.uef.cs.tra.BTreeNode;\nimport java.util.*;\npublic class Solution {\n${body}\n}`
function recursive(method, order) {
  const steps = [
    'out.add(node);',
    'visit(node.getLeftChild(), out);',
    'visit(node.getRightChild(), out);',
  ]
  return `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node) {
    List<BTreeNode<?>> out = new ArrayList<>();
    visit(node, out); return out;
  }
  static void visit(BTreeNode<?> node, List<BTreeNode<?>> out) {
    if (node == null) return;
    ${order.map(index => steps[index]).join('\n    ')}
  }`
}
function iterative(method) {
  const walk =
    method === 'in'
      ? `BTreeNode<?> current=node;
    while(current!=null || !stack.isEmpty()) {
      if(current!=null) { stack.push(current); current=current.getLeftChild(); }
      else { current=stack.pop();out.add(current);current=current.getRightChild(); }
    }`
      : `if(node!=null) stack.push(node);
    while(!stack.isEmpty()) {
      BTreeNode<?> current=stack.pop();out.add(current);
      ${
        method === 'pre'
          ? 'if(current.getRightChild()!=null) stack.push(current.getRightChild()); if(current.getLeftChild()!=null) stack.push(current.getLeftChild());'
          : 'if(current.getLeftChild()!=null) stack.push(current.getLeftChild()); if(current.getRightChild()!=null) stack.push(current.getRightChild());'
      }
    }
    ${method === 'post' ? 'Collections.reverse(out);' : ''}`
  return `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node) {
    List<BTreeNode<?>> out=new ArrayList<>();
    ArrayDeque<BTreeNode<?>> stack=new ArrayDeque<>();
    ${walk}
    return out;
  }`
}

for (const [method, config] of Object.entries(settings)) {
  const kit = resolve(`exercises/btree-${method}`)
  const starter = readFileSync(join(kit, 'Solution.java'), 'utf8')
  const correct = recursive(method, config.order)
  test(`${method.toUpperCase()} task has a separate short starter, complete translations and English README`, () => {
    function shape(value) {
      if (Array.isArray(value)) return value.map(shape)
      if (typeof value === 'object')
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      assert.ok(typeof value === 'string' && value.trim())
      return 'text'
    }
    const translations = treeTraversalExerciseTranslations[method]
    const readme = readFileSync(join(kit, 'README.md'), 'utf8')
    for (const [lang, labels] of Object.entries(translations)) {
      assert.deepEqual(shape(labels), shape(translations.en))
      assert.equal(
        labels.signature,
        `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node)`,
      )
      assert.ok(labels.example.includes(config.example))
      assert.equal(labels.hintItems.length, 3)
      assert.equal(labels.walkthrough.length, 3)
      assert.equal(labels.selfItems.length, 3)
      if (lang !== 'ru') assert.doesNotMatch(JSON.stringify(labels), /[а-яё]/i)
      assert.ok(readme.includes(labels.signature))
    }
    assert.ok(readme.includes('java -Dfile.encoding=UTF-8 Check.java en'))
    assert.doesNotMatch(readme, /[а-яё]/i)
    assert.deepEqual(
      readdirSync(kit).filter(name => name.startsWith('README')),
      ['README.md'],
    )
    assert.ok(starter.includes(`TODO: implement ${method}`))
  })

  test(
    `${method.toUpperCase()} real kit checks node identity, exact order, preservation and retry on Java 11`,
    { skip: hasJdk ? false : 'JDK 11+ required' },
    async t => {
      const directory = mkdtempSync(join(tmpdir(), `dsa2-btree-${method}-`))
      try {
        const archive = packageTreeTraversalExercise(method, join(directory, 'task.zip'))
        assert.deepEqual(
          readFileSync(archive),
          readFileSync(packageTreeTraversalExercise(method, join(directory, 'same.zip'))),
        )
        const extracted = spawnSync(jar, ['xf', archive], { cwd: directory, encoding: 'utf8' })
        assert.equal(extracted.status, 0, extracted.stderr)
        const work = join(directory, `btree-${method}`),
          compiled = join(directory, 'compiled')
        mkdirSync(compiled)
        assert.deepEqual(readdirSync(work).sort(), [...treeExercisePackageFiles].sort())
        for (const name of treeExercisePackageFiles)
          assert.deepEqual(
            readFileSync(join(work, name)),
            name === 'traj.jar' ? readTraLibrary() : readFileSync(join(kit, name)),
          )
        function compile(body) {
          writeFileSync(join(work, 'Solution.java'), source(body))
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
              'TreeChecks.java',
              'Check.java',
            ],
            { cwd: work, encoding: 'utf8', timeout: 15000 },
          )
          assert.equal(result.status, 0, result.stderr)
          assert.equal(result.stderr, '')
        }
        function run(lang = 'en') {
          return spawnSync(java, ['-Dfile.encoding=UTF-8', 'Check.java', lang], {
            cwd: work,
            encoding: 'utf8',
            timeout: 35000,
          })
        }
        function worker(index, lang = 'en') {
          return spawnSync(
            java,
            [
              '-cp',
              compiled + delimiter + join(work, 'traj.jar'),
              'TreeChecks',
              String(index),
              lang,
            ],
            { cwd: work, encoding: 'utf8', timeout: 10000 },
          )
        }
        await t.test(
          'TODO is clear; correct recursion passes all three languages and Java 11 bytecode',
          () => {
            const initial = run()
            assert.equal(initial.status, 1)
            assert.ok(initial.stdout.includes(`TODO: implement ${method}`))
            compile(correct)
            for (const name of ['Solution', 'Check', 'TreeChecks'])
              assert.equal(readFileSync(join(compiled, name + '.class')).readUInt16BE(6), 55)
            for (const [lang, message] of [
              ['en', 'Passed: 10/10'],
              ['ru', 'Пройдено: 10/10'],
              ['fi', 'Läpäisty: 10/10'],
            ]) {
              const result = run(lang)
              assert.equal(result.status, 0, result.stdout + result.stderr)
              assert.ok(result.stdout.includes(message))
            }
          },
        )
        await t.test(
          'an independent iterative solution also passes, since results do not prove recursion',
          () => {
            compile(iterative(method))
            for (let index = 0; index < 10; index++) {
              const result = worker(index)
              assert.equal(result.status, 0, result.stdout + result.stderr)
            }
          },
        )
        await t.test(
          'another traversal and mirrored children have specific order diagnostics',
          () => {
            const other = Object.values(settings).find(item => item !== config)
            compile(recursive(method, other.order))
            const wrong = worker(4)
            assert.equal(wrong.status, 1)
            assert.match(wrong.stdout, /Wrong order at position/)
            assert.ok(wrong.stdout.includes(`Expected node IDs: ${config.ids}`))
            compile(
              correct
                .replaceAll('getLeftChild', 'LEFT_TEMP')
                .replaceAll('getRightChild', 'getLeftChild')
                .replaceAll('LEFT_TEMP', 'getRightChild'),
            )
            assert.match(worker(4).stdout, /Wrong order at position/)
          },
        )
        await t.test('missing leaves or one branch and repeated nodes are distinguished', () => {
          compile(
            correct.replace(
              'if (node == null)',
              'if (node == null || (node.getLeftChild()==null && node.getRightChild()==null))',
            ),
          )
          assert.match(worker(4).stdout, /Missing nodes: expected 4, received 2/)
          compile(correct.replace('visit(node.getRightChild(), out);', 'visit(null, out);'))
          assert.match(worker(3).stdout, /Missing nodes/)
          compile(correct.replace('out.add(node);', 'out.add(node); out.add(node);'))
          assert.match(worker(4).stdout, /Repeated node ID/)
        })
        await t.test(
          'null output, null children, element values and copied nodes are rejected',
          () => {
            compile(
              `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node) { return null; }`,
            )
            assert.match(worker(0).stdout, /Returned null/)
            compile(
              `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node) { return Collections.singletonList(null); }`,
            )
            assert.match(worker(1).stdout, /actual input BTreeNode objects/)
            compile(
              `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node) { return List.of(new BTreeNode<>("N0")); }`,
            )
            assert.match(worker(1).stdout, /actual input BTreeNode objects/)
            compile(`@SuppressWarnings({"rawtypes","unchecked"})
          public static List<BTreeNode<?>> ${method}(BTreeNode<?> node) {
            List<Object> values=new ArrayList<>();values.add(node.getElement());return (List)values;
          }`)
            assert.match(worker(1).stdout, /actual input BTreeNode objects/)
          },
        )
        await t.test(
          'duplicate/null payloads are real nodes and outside parents do not expand the subtree',
          () => {
            compile(
              'static Set<Object> seen;\n' +
                correct
                  .replace(
                    'visit(node, out); return out;',
                    'seen=new HashSet<>(); visit(node, out); return out;',
                  )
                  .replace(
                    'if (node == null) return;',
                    'if (node == null || !seen.add(node.getElement())) return;',
                  ),
            )
            assert.match(worker(7).stdout, /Missing nodes/)
            compile(
              correct.replace('if (node == null)', 'if (node == null || node.getElement()==null)'),
            )
            assert.match(worker(9).stdout, /Missing nodes/)
            compile(
              correct.replace(
                'visit(node, out); return out;',
                'while(node!=null && node.getParent()!=null)node=node.getParent(); visit(node, out); return out;',
              ),
            )
            assert.match(worker(8).stdout, /Node outside the queried subtree/)
          },
        )
        await t.test('input elements, balance, children and parents are preserved', () => {
          for (const mutation of [
            'alterElement(node);',
            'node.setBalance(123);',
            'if(node.getLeftChild()!=null)node.removeLeftChild();',
            'if(node.getLeftChild()!=null)node.getLeftChild().setParent(null);',
          ]) {
            compile(
              correct.replace('out.add(node);', mutation + ' out.add(node);') +
                `
            static <E> void alterElement(BTreeNode<E> node) {
              if(node.getLeftChild()!=null)node.setElement(node.getLeftChild().getElement());
            }`,
            )
            const result = worker(4)
            assert.equal(result.status, 1)
            assert.match(result.stdout, /Input node changed/)
          }
        })
        await t.test('a static accumulating list is detected on the second call', () => {
          compile(
            'static List<BTreeNode<?>> shared=new ArrayList<>();\n' +
              correct.replace(
                'List<BTreeNode<?>> out = new ArrayList<>();',
                'List<BTreeNode<?>> out = shared;',
              ),
          )
          const result = worker(1)
          assert.equal(result.status, 1)
          assert.match(result.stdout, /Call: 2/)
          assert.match(result.stdout, /Repeated node ID/)
        })
        await t.test(
          'stack overflow, compilation failure and correction allow a fresh attempt',
          () => {
            compile(
              `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node) { return ${method}(node); }`,
            )
            assert.match(worker(1).stdout, /Stack overflow: check the null base case/)
            writeFileSync(join(work, 'Solution.java'), source('this is not Java'))
            const broken = run('ru')
            assert.equal(broken.status, 1)
            assert.match(broken.stderr, /Ошибка компиляции/)
            compile(correct)
            const fixed = run()
            assert.equal(fixed.status, 0, fixed.stdout + fixed.stderr)
            assert.match(fixed.stdout, /Every run starts fresh/)
          },
        )
      } finally {
        rmSync(directory, { recursive: true, force: true })
      }
    },
  )
}
