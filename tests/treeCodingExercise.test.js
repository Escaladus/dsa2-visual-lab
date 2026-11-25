import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import {
  treeExercisePackageFiles,
  packageTreeSizeExercise,
  packageTreeHeightExercise,
} from '../scripts/package-graph-exercise.mjs'
import { readTraLibrary } from '../scripts/tra-library.mjs'
import { treeCodingExerciseTranslations } from '../src/i18n/treeCodingExercise.js'

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
  size: { package: packageTreeSizeExercise, base: 0, combine: '1 + left + right' },
  height: { package: packageTreeHeightExercise, base: -1, combine: '1 + Math.max(left, right)' },
}

for (const [method, config] of Object.entries(settings)) {
  const kit = resolve(`exercises/btree-${method}`)
  const starter = readFileSync(join(kit, 'Solution.java'), 'utf8')
  const imports = 'import fi.uef.cs.tra.BTreeNode;\nimport java.util.*;'
  const source = body => `${imports}\npublic class Solution {\n${body}\n}`
  const correct = `public static int ${method}(BTreeNode<?> node) {
    if (node == null) return ${config.base};
    int left = ${method}(node.getLeftChild());
    int right = ${method}(node.getRightChild());
    return ${config.combine};
  }`

  test(`${method} task has complete translations, separate instructions and English-only README`, () => {
    function shape(value) {
      if (Array.isArray(value)) return value.map(shape)
      if (typeof value === 'object')
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      assert.ok(typeof value === 'string' && value.trim())
      return 'text'
    }
    const translations = treeCodingExerciseTranslations[method]
    for (const [lang, labels] of Object.entries(translations)) {
      assert.deepEqual(shape(labels), shape(translations.en))
      assert.equal(labels.signature, `public static int ${method}(BTreeNode<?> node)`)
      assert.equal(labels.hintItems.length, 3)
      assert.equal(labels.walkthrough.length, 3)
      assert.equal(labels.selfItems.length, 3)
      if (lang !== 'ru') assert.doesNotMatch(JSON.stringify(labels), /[а-яё]/i)
    }
    const readme = readFileSync(join(kit, 'README.md'), 'utf8')
    assert.ok(readme.includes(translations.en.signature))
    assert.ok(readme.includes('java -Dfile.encoding=UTF-8 Check.java en'))
    assert.doesNotMatch(readme, /[а-яё]/i)
    assert.deepEqual(
      readdirSync(kit).filter(name => name.startsWith('README')),
      ['README.md'],
    )
    assert.match(starter, new RegExp(`TODO: implement ${method}`))
  })

  test(
    `actual ${method} ZIP checks results, subtree boundaries, preservation and retries on Java 11`,
    { skip: hasJdk ? false : 'JDK 11+ required' },
    async t => {
      const directory = mkdtempSync(join(tmpdir(), `dsa2-btree-${method}-`))
      try {
        const archive = config.package(join(directory, 'task.zip'))
        assert.deepEqual(
          readFileSync(archive),
          readFileSync(config.package(join(directory, 'same.zip'))),
        )
        const extract = spawnSync(jar, ['xf', archive], { cwd: directory, encoding: 'utf8' })
        assert.equal(extract.status, 0, extract.stderr)
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
          'starter explains TODO; correct recursion passes all groups and feedback languages',
          () => {
            const initial = run()
            assert.equal(initial.status, 1)
            assert.ok(initial.stdout.includes(`TODO: implement ${method}`))
            compile(correct)
            for (const name of ['Solution', 'TreeChecks', 'Check'])
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
        await t.test('empty/leaf conventions are checked explicitly', () => {
          compile(
            correct.replace(
              `if (node == null) return ${config.base};`,
              `if (node == null) return ${config.base + 1};`,
            ),
          )
          const empty = worker(0)
          assert.equal(empty.status, 1)
          assert.ok(empty.stdout.includes(`expected ${config.base}, received ${config.base + 1}`))
          const leaf = worker(1)
          assert.equal(leaf.status, 1)
          assert.match(leaf.stdout, /single leaf/)
        })
        await t.test('left and right children are both required', () => {
          compile(correct.replace('node.getRightChild()', 'null'))
          assert.equal(worker(3).status, 1)
          compile(correct.replace('node.getLeftChild()', 'null'))
          assert.equal(worker(2).status, 1)
        })
        if (method === 'size') {
          await t.test('counting leaves, distinct values or just longest paths is rejected', () => {
            compile(
              correct.replace(
                'return 1 + left + right;',
                'return node.getLeftChild()==null && node.getRightChild()==null ? 1 : left + right;',
              ),
            )
            assert.match(worker(4).stdout, /expected 4, received 2/)
            compile(correct.replace('1 + left + right', '1 + Math.max(left, right)'))
            assert.match(worker(4).stdout, /expected 4, received 3/)
            compile(`public static int size(BTreeNode<?> node) {
            Set<Object> values=new HashSet<>(); visit(node,values); return values.size();
          }
          static void visit(BTreeNode<?> node,Set<Object> values) {
            if(node==null)return; values.add(node.getElement());visit(node.getLeftChild(),values);visit(node.getRightChild(),values);
          }`)
            assert.match(worker(7).stdout, /expected 7, received 1/)
          })
          await t.test('a stale accumulator fails the second call on the same input', () => {
            compile(`static int total;
          public static int size(BTreeNode<?> node) { visit(node); return total; }
          static void visit(BTreeNode<?> node) { if(node==null)return; total++;visit(node.getLeftChild());visit(node.getRightChild()); }`)
            assert.match(worker(1).stdout, /Call: 2; expected 1, received 2/)
          })
        } else {
          await t.test(
            'height is maximum depth, not node count, minimum depth or balance metadata',
            () => {
              compile(correct.replace('Math.max', 'Math.min'))
              assert.equal(worker(6).status, 1)
              compile(
                correct
                  .replace('if (node == null) return -1;', 'if (node == null) return 0;')
                  .replace('1 + Math.max(left, right)', '1 + left + right'),
              )
              assert.match(worker(4).stdout, /expected 2, received 4/)
              compile(
                'public static int height(BTreeNode<?> node) { return node==null ? -1 : node.getBalance(); }',
              )
              assert.match(worker(1).stdout, /expected 0, received 47/)
            },
          )
          await t.test('a stale height cache fails on subsequent different trees', () => {
            compile(`static Integer cached;
              public static int height(BTreeNode<?> node) {
                if (cached == null) cached = compute(node);
                return cached;
              }
              static int compute(BTreeNode<?> node) {
                if (node == null) return -1;
                return 1 + Math.max(compute(node.getLeftChild()),compute(node.getRightChild()));
              }`)
            assert.equal(worker(9).status, 1)
          })
        }
        await t.test(
          'null elements still represent real nodes and parent links do not expand the query',
          () => {
            compile(
              correct.replace(
                'if (node == null)',
                'if (node == null || node.getElement() == null)',
              ),
            )
            assert.equal(worker(9).status, 1)
            compile(
              correct.replace('if (node == null)', 'if (node == null || node.getParent() != null)'),
            )
            assert.equal(worker(8).status, 1)
          },
        )
        await t.test('element/balance, child and parent mutations are detected', () => {
          for (const mutation of [
            'alterElement(node);',
            'node.setBalance(123);',
            'if(node.getLeftChild()!=null) node.removeLeftChild();',
            'if(node.getLeftChild()!=null) node.getLeftChild().setParent(null);',
          ]) {
            compile(
              correct.replace(
                `return ${config.combine};`,
                `${mutation} return ${config.combine};`,
              ) +
                `
              static <E> void alterElement(BTreeNode<E> node) {
                if (node.getLeftChild() != null) node.setElement(node.getLeftChild().getElement());
              }`,
            )
            const result = worker(4)
            assert.equal(result.status, 1)
            assert.match(result.stdout, /Input node changed/)
          }
        })
        await t.test(
          'stack overflow has an explanation and fresh compilation allows correction',
          () => {
            compile(`public static int ${method}(BTreeNode<?> node) { return ${method}(node); }`)
            assert.match(worker(1).stdout, /Stack overflow: check the null base case/)
            writeFileSync(join(work, 'Solution.java'), source('this is not Java'))
            const broken = run('fi')
            assert.equal(broken.status, 1)
            assert.match(broken.stderr, /Käännös epäonnistui/)
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
