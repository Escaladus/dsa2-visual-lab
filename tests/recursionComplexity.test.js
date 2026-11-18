import assert from 'node:assert/strict'
import test from 'node:test'
import {
  recursionGrowth,
  recursionMetrics,
  dfsMetrics,
  dfsWorkSummary,
} from '../src/utils/recursionComplexity.js'
import { createRecursionTrace } from '../src/utils/recursionAlgorithms.js'
import { createRecursiveDfsTrace } from '../src/utils/recursiveDfs.js'
import { dfsExamples } from '../src/data/recursiveDfs.js'
import { recursionComplexityTranslations } from '../src/i18n/recursionComplexity.js'
import { formatMessage } from '../src/i18n/index.js'

test('growth counts match real traces, including base cases and a single shared cache', () => {
  for (let n = 0; n <= 8; n++) {
    const growth = recursionGrowth(n)
    const factorial = createRecursionTrace('factorial', n).at(-1)
    assert.equal(growth[0].calls, factorial.nodes.length)
    assert.equal(growth[0].peak, factorial.maxDepth)
    if (n > 6) {
      continue
    }
    const fibonacci = createRecursionTrace('fibonacci', n).at(-1)
    const memo = createRecursionTrace('fibonacci', n, { memoized: true }).at(-1)
    assert.equal(growth[1].calls, fibonacci.nodes.length)
    assert.equal(growth[1].peak, fibonacci.maxDepth)
    assert.equal(growth[2].calls, memo.nodes.length)
    assert.equal(growth[2].peak, memo.maxDepth)
    assert.equal(growth[2].cacheSlots, n + 1)
  }
})

test('the theoretical growth table uses exact recurrence counts without running exponential traces', () => {
  let a = 0
  let b = 1
  for (let n = 0; n <= 20; n++) {
    const growth = recursionGrowth(n)
    assert.equal(growth[1].calls, 2 * b - 1, 'C(n) = 2 F(n + 1) - 1')
    assert.equal(growth[0].calls, Math.max(1, n))
    assert.equal(growth[2].calls, n < 2 ? 1 : 2 * n - 1)
    assert.ok(growth.every(row => row.peak === Math.max(1, n)))
    ;[a, b] = [b, a + b]
  }
  assert.equal(recursionGrowth(20)[1].calls, 21891)
  assert.equal(recursionGrowth(20)[2].calls, 39)
  for (const n of [-1, 21, 0.5, '6', NaN]) {
    assert.throws(() => recursionGrowth(n))
  }
})

test('live memory counters keep current frames separate from peak frames and filled cache from allocated slots', () => {
  const plain = createRecursionTrace('fibonacci', 6)
  const memo = createRecursionTrace('fibonacci', 6, { memoized: true })
  assert.deepEqual(recursionMetrics(plain[0], 6), { calls: 0, active: 0, peak: 0, repeated: 0 })
  assert.deepEqual(recursionMetrics(plain.at(-1), 6), {
    calls: 25,
    active: 0,
    peak: 6,
    repeated: 18,
  })
  const final = recursionMetrics(memo.at(-1), 6, true)
  assert.deepEqual(final, {
    calls: 11,
    active: 0,
    peak: 6,
    repeated: 4,
    cacheEntries: 5,
    cacheSlots: 7,
    cacheHits: 3,
  })
  assert.equal(recursionMetrics(memo[0], 6, true).cacheEntries, 0)
  assert.equal(recursionMetrics(memo[0], 6, true).cacheSlots, 7)
  for (const [n, slots] of [
    [0, 1],
    [1, 2],
  ]) {
    const base = createRecursionTrace('fibonacci', n, { memoized: true }).at(-1)
    assert.equal(recursionMetrics(base, n, true).cacheEntries, 0)
    assert.equal(recursionMetrics(base, n, true).cacheSlots, slots)
  }
  for (const step of memo) {
    const before = JSON.stringify(step)
    recursionMetrics(step, 6, true)
    assert.equal(
      JSON.stringify(step),
      before,
      'Reading counters must not change the execution history',
    )
  }
})

test('DFS counters count adjacency reads and outer-loop vertices once, not animation frames', () => {
  for (const { graph } of Object.values(dfsExamples)) {
    for (let start = 0; start < graph.length; start++) {
      for (const all of [false, true]) {
        const frames = createRecursiveDfsTrace(graph, start, all)
        let scans = 0
        let outer = 0
        for (const step of frames) {
          if (step.message.key === 'neighbor') {
            scans++
          }
          if (step.message.key === 'outerLoop') {
            outer++
          }
          const metrics = dfsMetrics(step)
          assert.equal(metrics.neighborChecks, scans)
          assert.equal(metrics.outerChecks, outer)
          assert.equal(metrics.resultEntries, step.pre.length + step.post.length)
          assert.equal(metrics.active, step.stack.length)
          assert.equal(metrics.reached, step.visited.filter(Boolean).length)
        }
        assert.equal(frames[0].visitedSlots, 0)
        assert.equal(
          frames.find(step => step.message.key === 'initializeVisited').visitedSlots,
          graph.length,
        )
        const final = frames.at(-1)
        const work = dfsWorkSummary(graph, final)
        assert.equal(
          work.scanned,
          final.pre.reduce((sum, v) => sum + graph[v].length, 0),
        )
        assert.equal(
          work.adjacency,
          graph.reduce((sum, row) => sum + row.length, 0),
        )
        assert.equal(work.outer, all ? graph.length : 0)
        assert.equal(work.slots, graph.length)
        if (all) {
          assert.equal(work.scanned, work.adjacency)
        }
        assert.ok(final.neighborChecks < frames.length)
        for (const labels of Object.values(recursionComplexityTranslations)) {
          assert.doesNotMatch(formatMessage(labels.dfsInput, work), /\{\w+\}|undefined/)
          assert.doesNotMatch(
            formatMessage(all ? labels.dfsFull : labels.dfsPartial, work),
            /\{\w+\}|undefined/,
          )
        }
      }
    }
  }
})

test('an isolated start still allocates visited for the whole input graph', () => {
  const graph = dfsExamples.disconnected.graph
  const final = createRecursiveDfsTrace(graph, 2, false).at(-1)
  assert.deepEqual(dfsWorkSummary(graph, final), {
    vertices: 5,
    adjacency: 4,
    reached: 1,
    scanned: 0,
    outer: 0,
    slots: 5,
  })
  assert.deepEqual(dfsMetrics(final), {
    calls: 1,
    active: 0,
    peak: 1,
    reached: 1,
    neighborChecks: 0,
    outerChecks: 0,
    visitedSlots: 5,
    resultEntries: 2,
  })
  for (const step of createRecursiveDfsTrace([], 0, true)) {
    assert.equal(dfsMetrics(step).visitedSlots, 0)
  }
})
