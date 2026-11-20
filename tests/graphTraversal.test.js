import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { traLibraryPath } from '../scripts/tra-library.mjs'
import { join, resolve, delimiter } from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  traversalExamples,
  dfsTraversalCode,
  bfsTraversalCode,
  traverseTraversalCode,
  classifyTraversalCode,
} from '../src/data/graphTraversal.js'
import {
  createGraphTraversalTrace,
  orderedTraversalGraph,
  traversalEdgeKey,
  traversalPath,
  traversalTopological,
  traversalContinuation,
} from '../src/utils/graphTraversal.js'
import { graphTraversalTranslations } from '../src/i18n/graphTraversal.js'
import { graphQuizTranslations } from '../src/i18n/graphQuiz.js'
import { graphQuizQuestions } from '../src/data/graphQuiz.js'
import { formatMessage } from '../src/i18n/index.js'
import { createQuizReducer, createQuizState, scoreQuiz } from '../src/utils/studentQuiz.js'

function bfsDistances(graph, start) {
  const result = Array(graph.length).fill(-1)
  const frontier = []
  if (graph.length) {
    result[start] = 0
    frontier.push(start)
  }
  for (let i = 0; i < frontier.length; i++) {
    for (const next of graph[frontier[i]]) {
      if (result[next] < 0) {
        result[next] = result[frontier[i]] + 1
        frontier.push(next)
      }
    }
  }
  return result
}
const cases = []
for (const [name, e] of Object.entries(traversalExamples)) {
  for (let start = 0; start < e.graph.length; start++) {
    for (const all of [false, true]) {
      for (const reverse of [false, true]) {
        for (const algorithm of ['dfs', 'bfs']) {
          cases.push({ name, ...e, start, all, reverse, algorithm })
        }
      }
    }
  }
}

for (const name of Object.keys(traversalExamples)) {
  test(`${name}: all starts/scopes/orders and both algorithms have truthful independent snapshots`, () => {
    for (const c of cases.filter(c => c.name === name)) {
      const original = JSON.stringify(c.graph)
      const frames = createGraphTraversalTrace(c.graph, c)
      const final = frames.at(-1)
      const reference = bfsDistances(c.graph, c.start)
      assert.equal(JSON.stringify(c.graph), original)
      assert.deepEqual(
        final.colors.filter(color => color === 'GREY'),
        [],
      )
      assert.equal(final.pre.length, new Set(final.pre).size)
      assert.equal(final.post.length, final.pre.length)
      assert.equal(final.pre.length, c.all ? c.graph.length : reference.filter(d => d >= 0).length)
      assert.deepEqual(final.stack, [])
      assert.deepEqual(final.queue, [])
      assert.equal(final.outerChecks, c.all ? c.graph.length : 0)
      assert.equal(
        final.neighborChecks,
        final.pre.reduce((sum, v) => sum + c.graph[v].length, 0),
      )
      assert.equal(final.metadataSlots, 7 * c.graph.length)
      assert.equal(
        final.maxDepth,
        c.algorithm === 'dfs' ? Math.max(0, ...final.depth.map(d => (d < 0 ? 0 : d + 1))) : 0,
      )
      const physicalEdges = new Set(
        final.pre.flatMap(u => c.graph[u].map(v => traversalEdgeKey(u, v, c.directed))),
      )
      assert.equal(Object.keys(final.types).length, c.algorithm === 'dfs' ? physicalEdges.size : 0)
      if (c.algorithm === 'bfs') {
        assert.deepEqual(final.distance, reference)
      }
      for (let v = 0; v < c.graph.length; v++) {
        const path = traversalPath(final, v)
        assert.equal(path.length > 0, reference[v] >= 0)
        if (path.length) {
          assert.equal(path[0], c.start)
          assert.equal(path.at(-1), v)
          for (let i = 1; i < path.length; i++) {
            assert.ok(c.graph[path[i - 1]].includes(path[i]))
          }
          assert.equal(final.distance[v], path.length - 1)
        }
        if (reference[v] < 0) {
          assert.equal(
            final.distance[v],
            -1,
            'Other forest roots do not reset distance from the original start',
          )
        }
      }
      if (final.cycle.length) {
        assert.equal(final.cycle[0], final.cycle.at(-1))
        for (let i = 1; i < final.cycle.length; i++) {
          assert.ok(c.graph[final.cycle[i - 1]].includes(final.cycle[i]))
        }
      }
      for (let i = 0; i < frames.length; i++) {
        const s = frames[i]
        const prev = frames[i - 1]
        const key = s.message.key
        if (prev) {
          for (const field of [
            'colors',
            'parent',
            'root',
            'tin',
            'tout',
            'pre',
            'post',
            'stack',
            'queue',
            'types',
          ]) {
            assert.notEqual(prev[field], s[field])
          }
        }
        if (prev) {
          s.colors.forEach((color, v) => {
            const rank = { WHITE: 0, GREY: 1, BLACK: 2 }
            assert.ok(rank[color] >= rank[prev.colors[v]])
          })
        }
        assert.equal(new Set(s.queue).size, s.queue.length)
        assert.ok(s.queue.every(v => s.colors[v] === 'GREY'))
        if (key === 'mark' || key === 'bfsMark') {
          const v = s.message.values.v
          assert.equal(prev.colors[v], 'WHITE')
          assert.equal(s.colors[v], 'GREY')
        }
        if (key === 'dequeue') {
          assert.equal(s.colors[s.vertex], 'GREY')
          assert.ok(!s.queue.includes(s.vertex))
        }
        if (key === 'enqueue') {
          assert.equal(s.colors[s.message.values.v], 'GREY')
          assert.equal(s.queue.at(-1), s.message.values.v)
        }
        if (key === 'post') {
          assert.equal(s.colors[s.vertex], 'GREY')
          assert.ok(s.stack.includes(s.current))
          assert.equal(s.post.at(-1), s.vertex)
        }
        if (key === 'black') {
          assert.equal(prev.colors[s.message.values.v], 'GREY')
          assert.equal(s.colors[s.message.values.v], 'BLACK')
        }
        if (key === 'return' || key === 'returnRoot') {
          assert.equal(s.stack.length, prev.stack.length - 1)
          assert.equal(s.colors[s.returned.v], 'BLACK')
          assert.equal(s.returned.from, prev.stack.at(-1))
          assert.equal(s.returned.to, s.nodes[s.returned.from].parent)
        }
        if (key === 'parentEdge') {
          assert.equal(s.types[traversalEdgeKey(s.edge.from, s.edge.to, false)], 'tree')
        }
        const continuation = traversalContinuation(s)
        if (continuation?.method === 'dfs') {
          assert.ok(s.stack.includes(continuation.id))
          assert.ok(continuation.nextI > 0)
        }
        const code =
          s.method === 'dfs'
            ? dfsTraversalCode
            : s.method === 'bfs'
              ? bfsTraversalCode
              : traverseTraversalCode
        if (s.line !== null) {
          assert.ok(s.line > 0 && s.line <= code.split('\n').length)
        }
        for (const labels of Object.values(graphTraversalTranslations)) {
          assert.ok(labels.messages[key], key)
          assert.doesNotMatch(
            formatMessage(labels.messages[key], s.message.values),
            /undefined|\{\w+\}/,
          )
        }
      }
    }
  })
}

test('four directed edge classes, event clock, parent exception and cycle witnesses match the teaching example', () => {
  const e = traversalExamples.directed
  const final = createGraphTraversalTrace(e.graph, { directed: true, all: true }).at(-1)
  assert.deepEqual(final.pre, [0, 1, 2, 3, 4])
  assert.deepEqual(final.post, [2, 1, 3, 0, 4])
  assert.deepEqual(final.types, {
    '0:1': 'tree',
    '1:2': 'tree',
    '2:0': 'back',
    '0:2': 'forward',
    '0:3': 'tree',
    '3:2': 'cross',
  })
  assert.deepEqual(final.tin, [1, 2, 3, 6, 9])
  assert.deepEqual(final.tout, [8, 5, 4, 7, 10])
  assert.deepEqual(final.cycle, [0, 1, 2, 0])
  for (const [edge, type] of Object.entries(final.types)) {
    const [u, v] = edge.split(':').map(Number)
    if (type === 'tree' || type === 'forward') {
      assert.ok(final.tin[u] < final.tin[v] && final.tout[v] < final.tout[u])
    }
    if (type === 'cross') {
      assert.ok(final.tout[v] < final.tin[u])
    }
    if (type === 'back') {
      assert.ok(final.tin[v] < final.tin[u] && final.tout[u] < final.tout[v])
    }
  }
  const reverse = createGraphTraversalTrace(e.graph, {
    directed: true,
    all: true,
    reverse: true,
  }).at(-1)
  assert.notDeepEqual(reverse.pre, final.pre)
  assert.notDeepEqual(reverse.types, final.types)
  const branch = createGraphTraversalTrace(traversalExamples.branching.graph).at(-1)
  assert.deepEqual(branch.cycle, [])
  assert.ok(Object.values(branch.types).every(t => t === 'tree'))
  for (const directed of [false, true]) {
    const loop = createGraphTraversalTrace([[0]], { directed }).at(-1)
    assert.deepEqual(loop.cycle, [0, 0])
    assert.equal(loop.types['0:0'], 'back')
  }
  for (const algorithm of ['dfs', 'bfs']) {
    const empty = createGraphTraversalTrace([], { algorithm, all: true }).at(-1)
    assert.deepEqual(empty.pre, [])
    assert.equal(empty.metadataSlots, 0)
  }
  for (const graph of [[[1], []], [[0, 0]], [[2]]]) {
    assert.throws(() => createGraphTraversalTrace(graph))
  }
})

test('DAG ordering is checked for every edge; cycles, incomplete runs and BFS are rejected', () => {
  const e = traversalExamples.dag
  for (let start = 0; start < 5; start++) {
    for (const reverse of [false, true]) {
      const final = createGraphTraversalTrace(e.graph, {
        directed: true,
        all: true,
        start,
        reverse,
      }).at(-1)
      const result = traversalTopological(final)
      assert.equal(result.reason, null)
      assert.equal(result.order.length, 5)
      e.graph.forEach((row, u) =>
        row.forEach(v => assert.ok(result.order.indexOf(u) < result.order.indexOf(v))),
      )
    }
  }
  assert.equal(
    traversalTopological(
      createGraphTraversalTrace(traversalExamples.directed.graph, { directed: true, all: true }).at(
        -1,
      ),
    ).reason,
    'cycle',
  )
  assert.equal(
    traversalTopological(createGraphTraversalTrace(e.graph, { directed: true }).at(-1)).reason,
    'full',
  )
  assert.equal(
    traversalTopological(
      createGraphTraversalTrace(e.graph, { directed: true, all: true, algorithm: 'bfs' }).at(-1),
    ).reason,
    'directedDfs',
  )
  const dfs = createGraphTraversalTrace(e.graph, { directed: true }).at(-1)
  const bfs = createGraphTraversalTrace(e.graph, { directed: true, algorithm: 'bfs' }).at(-1)
  assert.deepEqual(traversalPath(dfs, 3), [0, 3])
  const opposite = createGraphTraversalTrace(e.graph, {
    directed: true,
    all: true,
    start: 3,
    algorithm: 'bfs',
  }).at(-1)
  assert.deepEqual(traversalPath(opposite, 0), [])
  assert.equal(opposite.distance[0], -1)
  assert.equal(opposite.depth[0], 0)
  assert.deepEqual(traversalPath(dfs, 2), [0, 1, 2])
  assert.deepEqual(traversalPath(bfs, 2), [0, 2])
  assert.deepEqual(traversalPath(bfs, 4), [])
})

test('generated directed and undirected graphs terminate with reference BFS distances and valid DFS intervals', () => {
  let seed = 73
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 2 ** 32
  }
  for (let sample = 0; sample < 60; sample++) {
    const n = 1 + (sample % 6)
    const directed = sample % 2 === 0
    const graph = Array.from({ length: n }, () => [])
    for (let u = 0; u < n; u++) {
      for (let v = directed ? 0 : u; v < n; v++) {
        if (random() < 0.25) {
          graph[u].push(v)
          if (!directed && u !== v) {
            graph[v].push(u)
          }
        }
      }
    }
    const start = sample % n
    const bfs = createGraphTraversalTrace(graph, {
      algorithm: 'bfs',
      directed,
      all: true,
      start,
    }).at(-1)
    const dfs = createGraphTraversalTrace(graph, { directed, all: true, start }).at(-1)
    assert.deepEqual(bfs.distance, bfsDistances(graph, start))
    assert.equal(dfs.pre.length, n)
    assert.equal(dfs.clock, 2 * n)
    for (let v = 0; v < n; v++) {
      assert.ok(dfs.tin[v] < dfs.tout[v])
      if (dfs.parent[v] >= 0) {
        const p = dfs.parent[v]
        assert.ok(dfs.tin[p] < dfs.tin[v] && dfs.tout[v] < dfs.tout[p])
      }
    }
  }
})

test('twelve fixed graph tasks have complete options and explanations and immutable checked answers', () => {
  assert.equal(graphQuizQuestions.length, 12)
  for (const labels of Object.values(graphQuizTranslations)) {
    assert.equal(labels.levels.length, 12)
    assert.deepEqual(Object.keys(labels.questions).sort(), graphQuizQuestions.map(q => q.id).sort())
    for (const q of graphQuizQuestions) {
      const content = labels.questions[q.id]
      assert.ok(q.context.index >= 0 && q.code)
      assert.equal(content.choices.length, 4)
      assert.equal(new Set(content.choices).size, 4)
      assert.equal(content.feedback.length, 4)
      assert.equal(new Set(content.feedback).size, 4)
      assert.ok(content.explanation && content.assumptions)
    }
  }
  for (const correct of [true, false]) {
    const reduce = createQuizReducer(graphQuizQuestions)
    let state = reduce(createQuizState(12), { type: 'START' })
    for (const q of graphQuizQuestions) {
      state = reduce(state, {
        type: 'SELECT',
        option: correct ? q.correctIndex : (q.correctIndex + 1) % 4,
      })
      state = reduce(state, { type: 'CHECK' })
      assert.equal(reduce(state, { type: 'SELECT', option: 0 }), state)
      if (state.index) {
        const prev = reduce(state, { type: 'PREVIOUS' })
        state = reduce(prev, { type: 'NEXT' })
      }
      state = reduce(state, { type: 'NEXT' })
    }
    assert.equal(scoreQuiz(graphQuizQuestions, state.answers), correct ? 12 : 0)
    assert.equal(state.phase, 'result')
    assert.deepEqual(reduce(state, { type: 'START' }), {
      ...createQuizState(12),
      phase: 'question',
    })
  }
  assert.equal(graphQuizQuestions.find(q => q.id === 'bfsGrey').context.step.colors[0], 'GREY')
  const forest = graphQuizQuestions.find(q => q.id === 'forest').context.step
  assert.deepEqual([...new Set(forest.root)], [0, 2, 4])
  for (const kind of ['tree', 'back', 'forward', 'cross']) {
    const q = graphQuizQuestions.find(q => q.id === kind)
    const e = q.context.step.edge
    assert.equal(q.context.after.types[traversalEdgeKey(e.from, e.to, true)], kind)
  }
})

const hasJava = spawnSync('javac', ['-version']).status === 0

test(
  'displayed Java methods match source and Java/visualisation agree for all graph/start/scope/order/algorithm cases',
  { skip: hasJava ? false : 'JDK 11+ required' },
  () => {
    const source = readFileSync('src/tra-examples/TraTraversalExample.java', 'utf8').replace(
      /\s+/g,
      ' ',
    )
    for (const code of [
      dfsTraversalCode,
      bfsTraversalCode,
      traverseTraversalCode,
      classifyTraversalCode,
    ]) {
      assert.ok(source.includes(code.replace(/\s+/g, ' ')))
    }
    const directory = mkdtempSync(join(tmpdir(), 'dsa2-graph-traversal-'))
    try {
      const expected = []
      const rows = []
      const arr = a => '[' + a.join(', ') + ']'
      for (const c of cases) {
        const final = createGraphTraversalTrace(c.graph, c).at(-1)
        const graph = c.graph
        rows.push(
          `run(new int[][]{${graph.map(row => '{' + row.join(',') + '}').join(',')}},${c.start},${c.all},${c.directed},${c.algorithm === 'bfs'},${c.reverse});`,
        )
        expected.push(
          [
            arr(final.pre),
            arr(final.post),
            arr(final.colors.map(c => ['WHITE', 'GREY', 'BLACK'].indexOf(c))),
            arr(final.parent),
            arr(final.root),
            arr(final.depth),
            arr(final.distance),
            arr(final.tin),
            arr(final.tout),
            '{' +
              Object.entries(final.types)
                .map(([k, v]) => `${k}=${v}`)
                .join(', ') +
              '}',
            arr(final.cycle),
            final.neighborChecks,
          ].join('|'),
        )
      }
      writeFileSync(
        join(directory, 'TraversalCheck.java'),
        `import fi.uef.cs.tra.*; import java.util.*;
public class TraversalCheck {
static <T> List<T> values(TraTraversalExample.State s,Map<Vertex,T> map){List<T> list=new ArrayList<>();for(Vertex v:s.vertices)list.add(map.get(v));return list;}
static List<Integer> links(TraTraversalExample.State s,Map<Vertex,Vertex> map){List<Integer> list=new ArrayList<>();for(Vertex v:s.vertices)list.add(map.get(v)==null?-1:s.id.get(map.get(v)));return list;}
static void run(int[][] input,int start,boolean all,boolean directed,boolean breadth,boolean reverse){
AbstractGraph graph=directed?new DiGraph():new Graph();List<Vertex> vertices=new ArrayList<>();
for(int i=0;i<input.length;i++)vertices.add(graph.addVertex("same"));
for(int u=0;u<input.length;u++)for(int v:input[u])if(directed||u<v)vertices.get(u).addEdge(vertices.get(v));
var s=TraTraversalExample.traverse(graph,vertices,vertices.isEmpty()?null:vertices.get(start),all,breadth,reverse);
List<Integer> colors=new ArrayList<>();for(Vertex v:vertices){int color=s.color.get(v);colors.add(color==AbstractGraph.WHITE?0:color==AbstractGraph.GREY?1:2);}
System.out.println(TraTraversalExample.ids(s,s.pre)+"|"+TraTraversalExample.ids(s,s.post)+"|"+colors+"|"+links(s,s.parent)+"|"+links(s,s.root)+"|"+values(s,s.depth)+"|"+values(s,s.distance)+"|"+values(s,s.tin)+"|"+values(s,s.tout)+"|"+TraTraversalExample.edgeDescriptions(s)+"|"+TraTraversalExample.ids(s,s.cycle)+"|"+s.neighborChecks);
}
public static void main(String[] args){${rows.join('\n')}}}`,
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
          resolve('src/tra-examples/TraTraversalExample.java'),
          join(directory, 'TraversalCheck.java'),
        ],
        { encoding: 'utf8', timeout: 30000 },
      )
      assert.equal(compile.status, 0, compile.stderr)
      assert.equal(compile.stderr, '')
      const run = spawnSync(
        'java',
        ['-cp', directory + delimiter + traLibraryPath, 'TraversalCheck'],
        {
          encoding: 'utf8',
          timeout: 10000,
        },
      )
      assert.equal(run.status, 0, run.stderr)
      assert.deepEqual(run.stdout.trim().split(/\r?\n/), expected)
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  },
)
