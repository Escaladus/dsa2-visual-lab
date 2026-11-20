import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, join, resolve } from 'node:path'
import test from 'node:test'
import { treeExamples } from '../src/data/treeTraversal.js'
import { treeTraversalCode } from '../src/data/treeTraversalCode.js'
import { createTreeTraversalSteps, treeStats } from '../src/utils/treeTraversal.js'
import { createHeapOperation, heapExample } from '../src/utils/heapAlgorithms.js'
import { traLibraryPath } from '../scripts/tra-library.mjs'

// Iterative event stack, independent of the recursive JS/Java implementation.
function reference(tree) {
  const result = { pre: [], in: [], post: [], height: -1, size: 0 }
  const work = tree.root === null ? [] : [{ id: tree.root, phase: 'pre', depth: 0 }]
  while (work.length) {
    const { id, phase, depth } = work.pop()
    if (id === null) continue
    const node = tree.nodes[id]
    result[phase].push(node.value)
    if (phase === 'pre') {
      result.height = Math.max(result.height, depth)
      result.size++
      work.push(
        { id, phase: 'post', depth },
        { id: node.right, phase: 'pre', depth: depth + 1 },
        { id, phase: 'in', depth },
        { id: node.left, phase: 'pre', depth: depth + 1 },
      )
    }
  }
  return result
}

const trees = [...Object.values(treeExamples)]
let seed = 74021
const random = max => (seed = (1664525 * seed + 1013904223) >>> 0) % max
for (let run = 0; run < 40; run++) {
  const count = random(20)
  const nodes = {}
  const slots = []
  for (let i = 0; i < count; i++) {
    const id = `n${i}`
    nodes[id] = { value: `value${i % 3}`, left: null, right: null }
    if (i) {
      const slot = slots.splice(random(slots.length), 1)[0]
      nodes[slot.id][slot.side] = id
    }
    slots.push({ id, side: 'left' }, { id, side: 'right' })
  }
  trees.push({ root: count ? 'n0' : null, nodes })
}

test('tree processing, heights and owned paths agree with an iterative reference, including repeated values', () => {
  for (const tree of trees) {
    const before = JSON.stringify(tree)
    const expected = reference(tree)
    assert.deepEqual(treeStats(tree), {
      size: expected.size,
      height: expected.height,
      levels: expected.height + 1,
    })
    for (const type of ['pre', 'in', 'post']) {
      const steps = createTreeTraversalSteps(tree, type)
      assert.deepEqual(steps.at(-1)?.order ?? [], expected[type])
      assert.equal(steps.length, expected.size)
      steps.forEach((step, index) => {
        assert.equal(step.path[0], tree.root)
        assert.equal(step.path.at(-1), step.current)
        assert.equal(step.nodeFrames, step.depth + 1)
        assert.ok(
          step.peakNodeFrames >= step.nodeFrames && step.peakNodeFrames <= expected.height + 1,
        )
        assert.equal(new Set(step.processed).size, index + 1)
        assert.ok(
          treeTraversalCode.split('\n')[step.line - 1].includes(`${type}.add(node.getElement())`),
        )
        for (let i = 1; i < step.path.length; i++) {
          const parent = tree.nodes[step.path[i - 1]]
          assert.ok([parent.left, parent.right].includes(step.path[i]))
        }
        if (index) {
          assert.notEqual(step.order, steps[index - 1].order)
          assert.notEqual(step.path, steps[index - 1].path)
          assert.notEqual(step.processed, steps[index - 1].processed)
        }
      })
    }
    assert.equal(JSON.stringify(tree), before)
  }
  assert.throws(() => createTreeTraversalSteps(treeExamples.balanced, 'unknown'))
})

const hasJdk = ['java', 'javac'].every(name => spawnSync(name, ['--version']).status === 0)
test(
  'real TRA trees match every drawing/order and heap operations agree by values, not array layout',
  { skip: hasJdk ? false : 'JDK 11+ required for actual tree/PQ checks' },
  () => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-tra-trees-'))
    try {
      const commands = []
      const expected = []
      const array = values => `[${values.join(', ')}]`
      for (const [index, tree] of trees.entries()) {
        const result = reference(tree)
        expected.push(
          [
            result.size,
            result.height,
            array(result.pre),
            array(result.in),
            array(result.post),
          ].join('|'),
        )
        if (index < Object.keys(treeExamples).length) {
          commands.push(
            `TraTreeQueueChecks.tree(TraTreeExample.example("${Object.keys(treeExamples)[index]}"));`,
          )
        } else {
          const ids = Object.keys(tree.nodes)
          const children = side =>
            `new int[]{${ids.map(id => (tree.nodes[id][side] === null ? -1 : ids.indexOf(tree.nodes[id][side]))).join(',')}}`
          commands.push(
            `TraTreeQueueChecks.tree(TraTreeQueueChecks.generated(${children('left')},${children('right')},new String[]{${ids.map(id => JSON.stringify(tree.nodes[id].value)).join(',')}}));`,
          )
        }
      }
      let nodes = heapExample.map((value, id) => ({ value, id }))
      let id = nodes.length
      const queueRow = result =>
        [
          String(result),
          String(nodes[0]?.value ?? null),
          nodes.length,
          array(nodes.map(node => node.value).sort((a, b) => a - b)),
        ].join('|')
      commands.push('TraTreeQueueChecks.startQueue();')
      expected.push(queueRow(null))
      function operation(kind, value = 0) {
        commands.push(`TraTreeQueueChecks.operation("${kind}",${value});`)
        const last = createHeapOperation(
          nodes,
          kind,
          kind === 'offer' ? { id: id++, value } : undefined,
        ).at(-1)
        nodes = last.nodes
        expected.push(queueRow(last.result.value))
      }
      operation('peek')
      operation('offer', 3)
      operation('peek')
      operation('poll')
      for (let i = 0; i < 120; i++) {
        const choice = random(3)
        operation(
          choice === 0 && nodes.length < 15 ? 'offer' : choice === 1 ? 'peek' : 'poll',
          random(12) - 4,
        )
      }
      while (nodes.length) operation('poll')
      operation('peek')
      operation('poll')
      operation('offer', -99)
      operation('offer', 999)
      commands.push('TraTreeQueueChecks.additionalContracts();')
      writeFileSync(
        join(directory, 'TreeQueueCases.java'),
        `public class TreeQueueCases { public static void main(String[] args) { ${commands.join('\n')} } }`,
      )
      const compile = spawnSync(
        'javac',
        [
          '--release',
          '11',
          '-Xlint:all',
          '-cp',
          traLibraryPath,
          '-d',
          directory,
          resolve('src/tra-examples/TraTreeExample.java'),
          resolve('src/tra-examples/TraPriorityQueueExample.java'),
          resolve('tests/fixtures/TraTreeQueueChecks.java'),
          join(directory, 'TreeQueueCases.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      assert.equal(readFileSync(join(directory, 'TraTreeExample.class')).readUInt16BE(6), 55)
      const run = spawnSync(
        'java',
        ['-cp', directory + delimiter + traLibraryPath, 'TreeQueueCases'],
        { encoding: 'utf8', timeout: 10000 },
      )
      assert.equal(run.status, 0, run.stderr)
      assert.deepEqual(run.stdout.trim().split(/\r?\n/), expected)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
