import assert from 'node:assert/strict'
import test from 'node:test'
import { recursionReviewQuestions as questions } from '../src/data/recursionReview.js'
import { recursionReviewTranslations } from '../src/i18n/recursionReview.js'
import { dictionaries } from '../src/i18n/index.js'
import { createQuizReducer, createQuizState, scoreQuiz } from '../src/utils/studentQuiz.js'
import { createRecursionTrace } from '../src/utils/recursionAlgorithms.js'
import { createRecursiveDfsTrace } from '../src/utils/recursiveDfs.js'
import { dfsExamples } from '../src/data/recursiveDfs.js'
import { recursionGrowth, dfsWorkSummary } from '../src/utils/recursionComplexity.js'

const reduce = createQuizReducer(questions)
const start = () => reduce(createQuizState(questions.length), { type: 'START' })
const check = (state, selected) =>
  reduce(reduce(state, { type: 'SELECT', option: selected }), { type: 'CHECK' })

test('the review covers calls, continuations, tracing and complexity with complete choices and reasons in three languages', () => {
  assert.equal(questions.length, 15)
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length)
  for (const [language, review] of Object.entries(recursionReviewTranslations)) {
    assert.equal(review.levels.length, questions.length)
    assert.deepEqual(Object.keys(review.questions).sort(), questions.map(q => q.id).sort())
    for (const question of questions) {
      const content = {
        ...dictionaries[language].recursion.quiz.questions[question.id],
        ...review.questions[question.id],
      }
      assert.ok(content.title && content.assumptions && content.explanation && question.code)
      assert.equal(question.choices.length, 4)
      const choices = content.choices ?? question.choices
      assert.equal(choices.length, 4)
      assert.equal(new Set(choices).size, 4)
      assert.ok(
        Number.isInteger(question.correctIndex) &&
          question.correctIndex >= 0 &&
          question.correctIndex < 4,
      )
      assert.equal(content.feedback.length, 4)
      assert.equal(new Set(content.feedback).size, 4)
      for (const feedback of content.feedback) {
        assert.ok(feedback.trim().length > 20)
      }
      assert.doesNotMatch(JSON.stringify(content), /undefined|\{\w+\}/)
    }
  }
})

test('reviewing previous questions preserves checked and pending answers without changing the score', () => {
  let state = start()
  assert.equal(reduce(state, { type: 'PREVIOUS' }), state)
  state = check(state, questions[0].correctIndex)
  state = reduce(state, { type: 'NEXT' })
  state = reduce(state, { type: 'SELECT', option: 0 })
  const before = structuredClone(state)
  state = reduce(state, { type: 'PREVIOUS' })
  assert.equal(state.index, 0)
  assert.equal(scoreQuiz(questions, state.answers), 1)
  assert.equal(reduce(state, { type: 'SELECT', option: 0 }), state)
  assert.equal(reduce(state, { type: 'CHECK' }), state)
  state = reduce(state, { type: 'NEXT' })
  assert.deepEqual(state, before, 'The pending choice on the next question is retained')
  assert.equal(
    reduce(state, { type: 'NEXT' }),
    state,
    'An unchecked question still cannot be bypassed',
  )
  state = check(state, (questions[1].correctIndex + 1) % 4)
  for (let i = 0; i < 3; i++) {
    state = reduce(state, { type: 'PREVIOUS' })
    state = reduce(state, { type: 'NEXT' })
    assert.equal(
      scoreQuiz(questions, state.answers),
      1,
      'Revisiting cannot add points or correct an error',
    )
  }
  assert.deepEqual(before.answers[0], { selected: questions[0].correctIndex, checked: true })
  assert.equal(before.answers[1].checked, false, 'Earlier state is immutable')
})

test('all fifteen questions support perfect, mixed and zero scores and an independent fresh retry', () => {
  for (const mode of ['correct', 'mixed', 'wrong']) {
    let state = start()
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const correct = mode === 'correct' || (mode === 'mixed' && i % 2 === 0)
      assert.equal(reduce(state, { type: 'NEXT' }), state)
      state = check(state, correct ? q.correctIndex : (q.correctIndex + 1) % 4)
      state = reduce(state, { type: 'NEXT' })
    }
    const score = mode === 'correct' ? 15 : mode === 'mixed' ? 8 : 0
    assert.equal(state.phase, 'result')
    assert.equal(scoreQuiz(questions, state.answers), score)
    assert.equal(reduce(state, { type: 'PREVIOUS' }), state)
    const retry = reduce(state, { type: 'START' })
    assert.deepEqual(retry, start())
    assert.equal(scoreQuiz(questions, state.answers), score)
  }
})

test('the continuation, stack and DFS answers agree with the real teaching states', () => {
  const factorial = createRecursionTrace('factorial', 4)
  const resume = factorial.find(
    step => step.message.key === 'receiveFactorial' && step.message.values.n === 4,
  )
  const parent = resume.nodes[resume.current]
  assert.equal(parent.locals.n, 4)
  assert.equal(parent.locals.child, 6)
  assert.equal(factorial.at(-1).result, 24)
  const fib = createRecursionTrace('fibonacci', 4)
  const entered = fib.find(step => step.message.key === 'enter' && step.message.values.n === 1)
  assert.deepEqual(
    [...entered.stack].reverse().map(id => entered.nodes[id].n),
    [1, 2, 3, 4],
  )
  const branching = createRecursiveDfsTrace(dfsExamples.branching.graph)
  const resumed = branching.findIndex(
    step => step.message.key === 'resume' && step.message.values.v === 0,
  )
  const nextNeighbor = branching.slice(resumed + 1).find(step => step.message.key === 'neighbor')
  assert.deepEqual(nextNeighbor.edge, { from: 0, to: 2 })
  assert.deepEqual(branching.at(-1).post, [3, 1, 2, 0])
  const cycle = createRecursiveDfsTrace(dfsExamples.cycle.graph)
  const skipped = cycle.find(
    step => step.message.key === 'skip' && step.edge.from === 2 && step.edge.to === 0,
  )
  assert.equal(skipped.visited[0], true)
  assert.equal(
    skipped.post.includes(0),
    false,
    'Already discovered is different from already finished',
  )
  const isolated = createRecursiveDfsTrace(dfsExamples.disconnected.graph, 2, false).at(-1)
  assert.deepEqual(isolated.pre, [2])
  assert.equal(isolated.outerChecks, 0)
  assert.equal(isolated.visitedSlots, 5)
  assert.deepEqual(
    createRecursiveDfsTrace(dfsExamples.disconnected.graph, 2, true).at(-1).pre,
    [2, 0, 1, 3, 4],
  )
})

test('complexity exercises distinguish total work, simultaneous frames and shared setup', () => {
  const n10 = recursionGrowth(10)
  const n20 = recursionGrowth(20)
  assert.ok(n20[1].calls > 100 * n10[1].calls, 'Naive Fibonacci repeats subproblems exponentially')
  assert.equal(n20[1].peak, 2 * n10[1].peak, 'Its stack depth only doubles')
  assert.equal(n20[2].calls, 39)
  assert.equal(n20[2].cacheSlots, 21, 'One shared cache, not one array per frame')
  for (const { graph } of Object.values(dfsExamples)) {
    const summary = dfsWorkSummary(graph, createRecursiveDfsTrace(graph, 0, true).at(-1))
    assert.equal(summary.reached, graph.length)
    assert.equal(
      summary.scanned,
      graph.reduce((sum, row) => sum + row.length, 0),
    )
    assert.equal(summary.outer, graph.length)
  }
})
