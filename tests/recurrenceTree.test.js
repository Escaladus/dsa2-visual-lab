import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { recurrenceExamples, recurrenceInputs } from '../src/data/recurrenceTrees.js'
import { createRecurrenceTree } from '../src/utils/recurrenceTree.js'
import { recurrenceTreeTranslations } from '../src/i18n/recurrenceTrees.js'
import { formatMessage } from '../src/i18n/index.js'

for (const id of Object.keys(recurrenceExamples)) test(`${id}: exact level counts, work and full geometry for every supported input`, () => {
  const before = JSON.stringify(recurrenceExamples)
  for (const n of recurrenceInputs) {
    const tree = createRecurrenceTree(id, n), log = Math.log2(n)
    const halved = id === 'split' || id === 'linearSplit', binary = id !== 'chain'
    const depth = halved ? log : n - 1
    const count = id === 'chain' ? n : halved ? 2 * n - 1 : 2 ** n - 1
    const work = id === 'linearSplit' ? n * (log + 1) : count
    assert.equal(tree.maxDepth, depth)
    assert.equal(tree.totalLevels, depth + 1)
    assert.equal(tree.maxWidth, binary ? 2 ** depth : 1)
    assert.equal(tree.totalNodes, count)
    assert.equal(tree.totalWork, work)
    assert.equal(tree.nodes.length, count)
    assert.equal(tree.levels.length, depth + 1)
    assert.equal(new Set(tree.nodes.map(node => node.id)).size, count)
    let sum = 0, calls = 0
    for (const row of tree.levels) {
      assert.equal(row.nodeCount, binary ? 2 ** row.index : 1)
      assert.equal(row.size, halved ? n / 2 ** row.index : n - row.index)
      assert.equal(row.ownWork, id === 'linearSplit' ? row.size : 1)
      assert.equal(row.work, id === 'linearSplit' ? n : row.nodeCount)
      assert.equal(row.cumulativeWork, sum += row.work)
      assert.equal(row.cumulativeNodes, calls += row.nodeCount)
      const nodes = row.ids.map(nodeId => tree.nodes[nodeId])
      assert.equal(nodes.length, row.nodeCount)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        assert.equal(node.depth, row.index)
        assert.equal(node.size, row.size)
        assert.equal(node.work, row.ownWork)
        assert.ok(node.x - 44 >= 0 && node.x + 44 <= tree.width)
        assert.ok(node.y - 25 >= 0 && node.y + 25 <= tree.height)
        if (i) assert.ok(node.x - nodes[i - 1].x >= 112, 'Full-size nodes never overlap on a level')
        if (node.parent !== null) {
          const parent = tree.nodes[node.parent]
          assert.equal(parent.depth + 1, node.depth)
          assert.ok(parent.children.includes(node.id))
          assert.ok(node.y - parent.y >= 88)
        }
        assert.equal(node.children.length, node.size === 1 ? 0 : binary ? 2 : 1)
      }
    }
    assert.equal(tree.nodes.filter(node => node.size === 1).length, tree.maxWidth)
    assert.deepEqual(createRecurrenceTree(id, n), tree, 'Rebuilding gives stable positions and IDs')
    const first = tree.nodes[0]
    assert.equal(first.parent, null)
    assert.equal(first.size, n)
    for (let level = 0; level <= depth; level++) {
      const visible = tree.nodes.filter(node => node.depth <= level)
      assert.equal(visible.length, tree.levels[level].cumulativeNodes)
      assert.equal(visible.reduce((total, node) => total + node.work, 0), tree.levels[level].cumulativeWork)
      for (const node of visible) if (node.parent !== null) assert.ok(visible.some(parent => parent.id === node.parent))
    }
  }
  assert.equal(JSON.stringify(recurrenceExamples), before)
})

test('the requested examples yield 4, 7, 15 and 12 units at n=4, including a shared shape with different work', () => {
  const examples = Object.keys(recurrenceExamples).map(id => createRecurrenceTree(id, 4))
  assert.deepEqual(examples.map(model => model.totalWork), [4, 7, 15, 12])
  const [chain, split, binary, linear] = examples
  assert.deepEqual([chain.maxDepth, split.maxDepth, binary.maxDepth, linear.maxDepth], [3, 2, 3, 2])
  assert.deepEqual(split.nodes.map(({ id, parent, size, x, y }) => ({ id, parent, size, x, y })), linear.nodes.map(({ id, parent, size, x, y }) => ({ id, parent, size, x, y })))
  assert.deepEqual(binary.levels.map(row => row.nodeCount), [1, 2, 4, 8])
  const max = createRecurrenceTree('binary', 8)
  assert.equal(max.nodes.length, 255)
  assert.equal(max.levels.at(-1).nodeCount, 128)
  assert.equal(max.nodes.filter(node => node.parent !== null).length, 254)
})

test('a single root is a complete base case; unsupported inputs and prototype names are rejected', () => {
  for (const id of Object.keys(recurrenceExamples)) {
    const tree = createRecurrenceTree(id, 1)
    assert.equal(tree.maxDepth, 0)
    assert.equal(tree.totalLevels, 1)
    assert.equal(tree.totalNodes, 1)
    assert.equal(tree.totalWork, 1)
    assert.equal(tree.maxWidth, 1)
  }
  for (const n of [0, -1, 3, 5, 16, 1.5, '4', NaN, undefined]) assert.throws(() => createRecurrenceTree('chain', n))
  for (const id of ['unknown', '__proto__', 'constructor', null]) assert.throws(() => createRecurrenceTree(id, 4))
})

test('every example and calculated caption has three complete translations', () => {
  for (const labels of Object.values(recurrenceTreeTranslations)) {
    assert.deepEqual(Object.keys(labels.examples).sort(), Object.keys(recurrenceExamples).sort())
    assert.equal(labels.columns.length, 5)
    for (const [key, values] of [
      ['node', { size: 1, work: 1, depth: 0 }], ['nodeWork', { work: 1 }],
      ['progress', { level: 0, last: 0, shown: 1, total: 1 }],
      ['rowRule', { size: 'n / 2ⁱ', calls: '2ⁱ', own: '1', work: '2ⁱ' }],
      ['sum', { sum: '1 + 2 + 4', value: 7 }], ['solution', { formula: '2n − 1', value: 7, bound: 'Θ(n)' }],
    ]) assert.doesNotMatch(formatMessage(labels[key], values), /\{\w+\}|undefined/)
  }
})

const hasJava = spawnSync('java', ['-version']).status === 0

test('the exact displayed Java fragments return the work predicted by each recurrence', { skip: hasJava ? false : 'JDK 17+ is required' }, () => {
  const directory = mkdtempSync(join(tmpdir(), 'dsa2-recurrences-'))
  try {
    const file = join(directory, 'RecurrenceWorkCheck.java')
    writeFileSync(file, `public class RecurrenceWorkCheck {
${Object.values(recurrenceExamples).map(example => example.code).join('\n')}
public static void main(String[] args) {
    for (int n : new int[]{1, 2, 4, 8}) {
        int levels = Integer.numberOfTrailingZeros(n) + 1;
        if (chain(n) != n || split(n) != 2L * n - 1
            || binary(n) != (1L << n) - 1 || linearSplit(n) != (long) n * levels)
            throw new AssertionError("Wrong work for n=" + n);
    }
    System.out.println("Recurrence work verified");
}}
`)
    const result = spawnSync('java', ['--source', '17', file], { encoding: 'utf8', timeout: 20000 })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /Recurrence work verified/)
  } finally { rmSync(directory, { recursive: true, force: true }) }
})
