import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'
import { dfsCode, dfsDriverCode, dfsExamples } from '../src/data/recursiveDfs.js'
import { dfsLessonTrace, dfsWalkthrough } from '../src/data/recursiveDfsLesson.js'
import { createRecursiveDfsTrace, dfsContinuation } from '../src/utils/recursiveDfs.js'
import { recursionTreeLayout } from '../src/utils/recursionAlgorithms.js'
import { recursiveDfsTranslations } from '../src/i18n/recursiveDfs.js'
import { formatMessage } from '../src/i18n/index.js'

// Independent iterative DFS: advance each saved neighbour cursor before descending.
function reference(graph, start, all) {
  const visited = new Set()
  const pre = []
  const post = []
  const stack = []
  let maxDepth = 0
  for (const root of graph.length ? [start, ...(all ? graph.map((_, v) => v) : [])] : []) {
    if (visited.has(root)) {
      continue
    }
    visited.add(root)
    pre.push(root)
    stack.push({ v: root, i: 0 })
    while (stack.length) {
      maxDepth = Math.max(maxDepth, stack.length)
      const top = stack.at(-1)
      if (top.i === graph[top.v].length) {
        post.push(top.v)
        stack.pop()
        continue
      }
      const next = graph[top.v][top.i++]
      if (!visited.has(next)) {
        visited.add(next)
        pre.push(next)
        stack.push({ v: next, i: 0 })
      }
    }
  }
  return { pre, post, maxDepth }
}

for (const [name, example] of Object.entries(dfsExamples)) {
  test(`${name}: every start and scope matches an independent DFS with truthful frames and translated events`, () => {
    const { graph } = example
    for (let start = 0; start < graph.length; start++) {
      for (const all of [false, true]) {
        const frames = createRecursiveDfsTrace(graph, start, all)
        const final = frames.at(-1)
        const expected = reference(graph, start, all)
        assert.deepEqual(final.pre, expected.pre)
        assert.deepEqual(final.post, expected.post)
        assert.equal(final.maxDepth, expected.maxDepth)
        assert.deepEqual(final.stack, [])
        assert.equal(final.nodes.length, final.pre.length)
        assert.deepEqual(
          final.nodes.map(node => node.v),
          final.pre,
        )
        assert.ok(final.nodes.every(node => node.status === 'done' && node.result === null))
        assert.equal(new Set(final.pre).size, final.pre.length)
        if (all) {
          assert.ok(final.visited.every(Boolean))
        }
        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i]
          const previous = frames[i - 1]
          assert.equal(new Set(frame.stack).size, frame.stack.length)
          frame.stack.forEach((id, depth) => {
            assert.notEqual(frame.nodes[id].status, 'done')
            assert.equal(frame.nodes[id].parent, depth ? frame.stack[depth - 1] : null)
          })
          if (frame.line !== null) {
            assert.ok(
              frame.line > 0 &&
                frame.line <= (frame.method === 'dfs' ? dfsCode : dfsDriverCode).split('\n').length,
            )
          }
          if (previous) {
            for (const field of ['nodes', 'stack', 'visited', 'pre', 'post']) {
              assert.notEqual(frame[field], previous[field])
            }
            frame.nodes.forEach(node => {
              if (previous.nodes[node.id]) {
                assert.notEqual(node.locals, previous.nodes[node.id].locals)
                assert.notEqual(node.returnTo, previous.nodes[node.id].returnTo)
                if (node.continuation && previous.nodes[node.id].continuation) {
                  assert.notEqual(node.continuation, previous.nodes[node.id].continuation)
                }
              }
            })
          }
          if (frame.message.key === 'enter') {
            assert.equal(frame.stack.length, previous.stack.length + 1)
            assert.equal(
              frame.visited[frame.nodes[frame.current].v],
              false,
              'The call is created before its mark instruction',
            )
          }
          if (frame.message.key === 'mark') {
            const v = frame.message.values.v
            assert.equal(previous.visited[v], false)
            assert.equal(frame.visited[v], true)
            assert.ok(!frame.pre.includes(v), 'PRE is a separate instruction after marking')
          }
          if (frame.message.key === 'skip') {
            assert.equal(frame.visited[frame.message.values.next], true)
            assert.equal(frames[i + 1].nodes.length, frame.nodes.length)
          }
          if (frame.message.key === 'post') {
            const node = frame.nodes[frame.current]
            assert.ok(frame.stack.includes(node.id), 'POST happens before the frame is popped')
            assert.ok(
              !Object.hasOwn(node.locals, 'i') && !Object.hasOwn(node.locals, 'next'),
              'Loop variables leave scope',
            )
          }
          if (['return', 'returnRoot'].includes(frame.message.key)) {
            assert.equal(frame.stack.length, previous.stack.length - 1)
            assert.equal(previous.stack.at(-1), frame.returned.from)
            assert.ok(frame.post.includes(frame.returned.v))
            assert.equal(
              frame.returned.value,
              null,
              'void returns control without a numeric answer',
            )
          }
          const continuation = dfsContinuation(frame)
          if (continuation?.method === 'dfs') {
            assert.ok(frame.stack.includes(continuation.id))
            assert.equal(continuation.line, 7)
            assert.ok(Number.isInteger(continuation.nextI))
          }
          for (const labels of Object.values(recursiveDfsTranslations)) {
            assert.equal(typeof labels.messages[frame.message.key], 'string')
            assert.doesNotMatch(
              formatMessage(labels.messages[frame.message.key], frame.message.values),
              /\{\w+\}|undefined/,
            )
          }
        }
      }
    }
  })
}

test('returns resume the saved loop rather than restarting a vertex', () => {
  const frames = createRecursiveDfsTrace(dfsExamples.branching.graph)
  const index = frames.findIndex(
    frame => frame.message.key === 'resume' && frame.message.values.v === 0,
  )
  const resumed = frames[index]
  const parent = resumed.nodes[resumed.current]
  assert.deepEqual(parent.locals, { v: 0, i: 0, next: 1 })
  assert.equal(resumed.line, 7)
  assert.deepEqual(dfsContinuation(resumed), { id: parent.id, method: 'dfs', line: 7, nextI: 1 })
  assert.equal(frames[index + 1].line, 4)
  assert.equal(frames[index + 1].nodes[parent.id].locals.i, 1)
  assert.deepEqual(frames[index + 2].nodes[parent.id].locals, { v: 0, i: 1, next: 2 })
})

test('disconnected and isolated vertices form a call forest only when requested', () => {
  const graph = dfsExamples.disconnected.graph
  const partial = createRecursiveDfsTrace(graph, 0, false).at(-1)
  assert.deepEqual(partial.pre, [0, 1])
  assert.deepEqual(partial.visited, [true, true, false, false, false])
  const isolated = createRecursiveDfsTrace(graph, 2, false).at(-1)
  assert.deepEqual(isolated.pre, [2])
  assert.deepEqual(isolated.post, [2])
  const full = createRecursiveDfsTrace(graph, 0, true).at(-1)
  assert.deepEqual(
    full.nodes.filter(node => node.parent === null).map(node => node.v),
    [0, 2, 3],
  )
  const layout = recursionTreeLayout(full.nodes)
  for (const node of full.nodes) {
    assert.ok(layout.positions[node.id])
    assert.ok(layout.positions[node.id].x >= 27 && layout.positions[node.id].x <= layout.width - 27)
  }
  assert.equal(
    new Set(full.nodes.map(node => `${layout.positions[node.id].x}:${layout.positions[node.id].y}`))
      .size,
    full.nodes.length,
  )
})

test('cycles, self-loops, duplicates and small generated graphs terminate with reference orders', () => {
  let seed = 83
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 2 ** 32
  }
  const graphs = [[], [[0, 0]], [[], []]]
  for (let trial = 0; trial < 35; trial++) {
    const n = 1 + Math.floor(rand() * 7)
    graphs.push(
      Array.from({ length: n }, () =>
        Array.from({ length: n }, (_, v) => v).filter(() => rand() < 0.25),
      ),
    )
  }
  for (const graph of graphs) {
    for (const all of [false, true]) {
      const actual = createRecursiveDfsTrace(graph, 0, all).at(-1)
      const expected = reference(graph, 0, all)
      assert.deepEqual(actual.pre, expected.pre)
      assert.deepEqual(actual.post, expected.post)
      assert.ok(actual.nodes.length <= graph.length)
    }
  }
  for (const args of [[null], [[[2]], 0], [[[]], -1], [[[]], 1], [[[]], 0.5], [[[]], 0, 'true']]) {
    assert.throws(() => createRecursiveDfsTrace(...args))
  }
})

test('guided moments point to the complete branching example and its real return states', () => {
  let previous = -1
  for (const moment of dfsWalkthrough) {
    assert.ok(moment.index > previous && moment.index < dfsLessonTrace.length)
    previous = moment.index
    for (const labels of Object.values(recursiveDfsTranslations)) {
      assert.equal(labels.moments[moment.id].length, 2)
    }
  }
  const final = dfsLessonTrace.at(-1)
  assert.deepEqual(final.pre, [0, 1, 3, 2])
  assert.deepEqual(final.post, [3, 1, 2, 0])
  const source = readFileSync('src/examples/RecursiveDfsExample.java', 'utf8').replace(/\s+/g, ' ')
  assert.ok(source.includes(dfsCode.replace(/\s+/g, ' ')))
  assert.ok(source.includes(dfsDriverCode.replace(/\s+/g, ' ')))
})

const hasJdk =
  spawnSync('javac', ['-version']).status === 0 && spawnSync('java', ['-version']).status === 0
test(
  'the downloadable Java methods match all displayed graph/start/scope combinations',
  { skip: hasJdk ? false : 'JDK 11+ required' },
  () => {
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-dfs-parity-'))
    try {
      const expected = []
      const cases = []
      for (const { graph } of [...Object.values(dfsExamples), { graph: [] }]) {
        for (let start = 0; start < Math.max(1, graph.length); start++) {
          for (const all of [false, true]) {
            const literal = '{' + graph.map(row => '{' + row.join(',') + '}').join(',') + '}'
            cases.push(
              `{ var r = RecursiveDfsExample.traverse(new int[][]${literal}, ${start}, ${all}); System.out.println(r.pre()); System.out.println(r.post()); }`,
            )
            const frame = createRecursiveDfsTrace(graph, start, all).at(-1)
            expected.push(frame.pre, frame.post)
          }
        }
      }
      const harness = join(directory, 'DfsParity.java')
      writeFileSync(
        harness,
        `public class DfsParity { public static void main(String[] args) { ${cases.join('\n')} } }`,
      )
      const compile = spawnSync(
        'javac',
        [
          '--release',
          '11',
          '-Xlint:all',
          '-d',
          directory,
          resolve('src/examples/RecursiveDfsExample.java'),
          harness,
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      const run = spawnSync('java', ['-cp', directory, 'DfsParity'], {
        encoding: 'utf8',
        timeout: 10000,
      })
      assert.equal(run.status, 0, run.stderr)
      assert.deepEqual(
        run.stdout
          .trim()
          .split('\n')
          .map(line => JSON.parse(line)),
        expected,
      )
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
