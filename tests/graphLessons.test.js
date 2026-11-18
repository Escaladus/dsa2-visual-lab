import assert from 'node:assert/strict'
import test from 'node:test'
import { graphTraversalMoments, graphTraversalTasks } from '../src/data/graphTraversalLessons.js'
import {
  traversalExamples,
  dfsTraversalCode,
  bfsTraversalCode,
  traversalExcerpt,
} from '../src/data/graphTraversal.js'
import { graphQuizQuestions } from '../src/data/graphQuiz.js'
import { createGraphTraversalTrace, traversalContinuation } from '../src/utils/graphTraversal.js'
import {
  formatTraversalContinuation,
  formatEdgeInterval,
} from '../src/utils/graphTraversalPresentation.js'
import { graphTraversalTranslations } from '../src/i18n/graphTraversal.js'
import { graphLearningTranslations } from '../src/i18n/graphLearning.js'

test('named guided moments resolve to actual events and have labels in every language', () => {
  for (const [name, moment] of Object.entries(graphTraversalMoments)) {
    const example = traversalExamples[moment.preset]
    const frames = createGraphTraversalTrace(example.graph, {
      algorithm: moment.algorithm,
      directed: example.directed,
    })
    const step = frames.find(step => step.message.key === moment.event && moment.matches(step))
    assert.ok(step, name)
    if (moment.showEdgeTypes)
      assert.ok(['back', 'forward', 'cross'].includes(step.message.values.kind))
    for (const labels of Object.values(graphTraversalTranslations)) assert.ok(labels.moments[name])
  }
  for (const [name, task] of Object.entries(graphTraversalTasks)) {
    assert.ok(traversalExamples[task.preset], name)
    assert.ok(['dfs', 'bfs'].includes(task.algorithm), name)
    assert.equal(typeof task.traverseAll, 'boolean')
    for (const labels of Object.values(graphTraversalTranslations)) assert.ok(labels.tasks[name])
  }
})

test('quiz Java excerpts retain the statement they explain after Java formatting changes', () => {
  const expectedStatements = {
    resume: 'dfs(graph, next, state);',
    dfsGrey: 'state.color[v] = GREY;',
    bfsGrey: 'int v = queue.remove();',
    post: 'state.post.add(v);',
    tree: 'state.types.put(',
    parent: '!state.directed && state.parent[v] == next',
    forest: 'for (int v',
    shortest: 'state.distance[next] =',
    topological: 'state.cycle.isEmpty()',
  }
  for (const [id, statement] of Object.entries(expectedStatements)) {
    assert.ok(graphQuizQuestions.find(question => question.id === id).code.includes(statement), id)
  }
  assert.throws(() => traversalExcerpt(dfsTraversalCode, 'missing', 'state.pre.add(v)'))
  assert.throws(() => traversalExcerpt(bfsTraversalCode, 'queue.add(next)', 'static void bfs'))
})

test('continuation captions resolve real caller frames in every language and presentation', () => {
  const frames = createGraphTraversalTrace(traversalExamples.branching.graph, { all: true })
  for (const step of frames) {
    for (const language of ['ru', 'fi', 'en']) {
      const continuation = traversalContinuation(step)
      for (const colorsOnly of [false, true]) {
        const caption = formatTraversalContinuation(step, continuation, {
          colorsOnly,
          labels: graphTraversalTranslations[language],
          learning: graphLearningTranslations[language],
        })
        if (!continuation || (colorsOnly && continuation.method !== 'dfs')) {
          assert.equal(caption, null)
        } else {
          assert.ok(caption.length > 0)
          assert.doesNotMatch(caption, /undefined|\{\w+\}/)
        }
      }
    }
  }
})

test('interval explanations distinguish descendants, separate branches and self loops', () => {
  const final = createGraphTraversalTrace(traversalExamples.directed.graph, {
    directed: true,
    all: true,
  }).at(-1)
  assert.equal(
    formatEdgeInterval(final, '0:2'),
    'tin[0] = 1 < tin[2] = 3 < tout[2] = 4 < tout[0] = 8',
  )
  assert.equal(formatEdgeInterval(final, '3:2'), 'tout[2] = 4 < tin[3] = 6')
  const loop = createGraphTraversalTrace([[0]], { directed: true }).at(-1)
  assert.equal(formatEdgeInterval(loop, '0:0'), 'u = v = 0; tin = 1, tout = 2')
})
