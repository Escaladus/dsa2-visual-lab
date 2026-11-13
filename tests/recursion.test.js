import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { recursionExamples, recursionQuestions } from '../src/data/recursion.js'
import { createRecursionTrace, recursionTreeLayout } from '../src/utils/recursionAlgorithms.js'
import { dictionaries, formatMessage } from '../src/i18n/index.js'
import { createQuizReducer, createQuizState, scoreQuiz } from '../src/utils/studentQuiz.js'

for (const [kind, example] of Object.entries(recursionExamples)) {
  test(`${kind}: correct results, real stack discipline, independent locals and fully translated steps`, () => {
    for (let n = 0; n <= example.max; n++) {
      const frames = createRecursionTrace(kind, n)
      let expected
      if (kind === 'factorial') { expected = 1; for (let i = 2; i <= n; i++) expected *= i }
      else { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; expected = a }
      assert.equal(frames.at(-1).result, expected)
      assert.deepEqual(frames.at(-1).stack, [])
      assert.ok(frames.at(-1).nodes.every(node => node.status === 'done'))
      assert.equal(frames[0].nodes.length, 0)
      let previous = frames[0], max = 0
      for (const frame of frames) {
        max = Math.max(max, frame.stack.length)
        assert.equal(frame.maxDepth, max)
        assert.equal(new Set(frame.stack).size, frame.stack.length)
        for (let i = 0; i < frame.stack.length; i++) {
          const node = frame.nodes[frame.stack[i]]
          assert.notEqual(node.status, 'done', 'Completed calls must leave the stack')
          assert.equal(node.parent, i === 0 ? null : frame.stack[i - 1], 'The stack must be one ancestor path, not the whole tree')
          assert.equal(node.locals.n, node.n)
          if (node.parent === null) assert.equal(node.n, n)
          else assert.ok([frame.nodes[node.parent].n - 1, ...(kind === 'fibonacci' ? [frame.nodes[node.parent].n - 2] : [])].includes(node.n))
        }
        if (frame.message.key === 'enter') {
          assert.equal(frame.stack.length, previous.stack.length + 1)
          assert.equal(frame.nodes.length, previous.nodes.length + 1)
        }
        if (['return', 'returnRoot'].includes(frame.message.key)) {
          assert.equal(frame.stack.length, previous.stack.length - 1)
          assert.equal(previous.stack.at(-1), frame.returned.from)
          assert.equal(frame.nodes[frame.returned.from].result, frame.returned.value)
        }
        if (frame.line !== null) assert.ok(frame.line > 0 && frame.line <= example.code.split('\n').length)
        for (const dictionary of Object.values(dictionaries)) {
          const template = dictionary.recursion.messages[frame.message.key]
          assert.equal(typeof template, 'string', frame.message.key)
          assert.doesNotMatch(formatMessage(template, frame.message.values), /\{\w+\}|undefined/)
        }
        if (frame !== previous) {
          assert.notEqual(frame.stack, previous.stack)
          for (const node of frame.nodes) {
            if (previous.nodes[node.id]) assert.notEqual(node.locals, previous.nodes[node.id].locals)
          }
        }
        previous = frame
      }
      for (const node of frames.at(-1).nodes) {
        const children = frames.at(-1).nodes.filter(child => child.parent === node.id)
        assert.deepEqual(children.map(child => child.n), node.n <= 1 ? [] : kind === 'factorial' ? [node.n - 1] : [node.n - 1, node.n - 2])
      }
      const layout = recursionTreeLayout(frames.at(-1).nodes)
      for (const node of frames.at(-1).nodes) {
        const position = layout.positions[node.id]
        assert.ok(position.x >= 27 && position.x <= layout.width - 27)
        assert.ok(position.y >= 27 && position.y <= layout.height - 27)
        if (node.parent !== null) assert.ok(position.y - 32 - (layout.positions[node.parent].y + 45) >= 18, 'Return labels and child call IDs must not overlap')
      }
    }
  })
}

test('factorial unwinds after its base case; Fibonacci repeats calls without keeping them all on the stack', () => {
  const factorial = createRecursionTrace('factorial', 4)
  assert.deepEqual(factorial.filter(frame => ['return', 'returnRoot'].includes(frame.message.key)).map(frame => frame.returned.value), [1, 2, 6, 24])
  assert.equal(factorial.at(-1).maxDepth, 4)
  const receive = factorial.find(frame => frame.message.key === 'receiveFactorial' && frame.message.values.n === 4)
  assert.equal(receive.nodes[0].locals.child, 6)
  assert.equal(receive.nodes[0].result, null, 'The caller must still perform its multiplication')
  const fibonacci = createRecursionTrace('fibonacci', 4)
  assert.deepEqual(fibonacci.at(-1).nodes.map(node => node.n), [4, 3, 2, 1, 0, 1, 2, 1, 0])
  assert.equal(fibonacci.at(-1).nodes.length, 9)
  assert.equal(fibonacci.at(-1).maxDepth, 4)
  assert.equal(fibonacci.at(-1).result, 3)
  assert.equal(createRecursionTrace('fibonacci', 0).at(-1).result, 0)
})

test('recursion input bounds prevent runaway traces', () => {
  for (const [kind, value] of [['unknown', 4], ['factorial', -1], ['factorial', 9], ['fibonacci', 7], ['fibonacci', 1.5], ['factorial', '4']]) assert.throws(() => createRecursionTrace(kind, value))
  assert.ok(createRecursionTrace('fibonacci', 6).at(-1).nodes.length <= 25)
})

test('the recursion quiz supports translated choices, a full score and clean retries', () => {
  const reduce = createQuizReducer(recursionQuestions)
  let state = reduce(createQuizState(recursionQuestions.length), { type: 'START' })
  for (const question of recursionQuestions) {
    for (const dictionary of Object.values(dictionaries)) {
      const text = dictionary.recursion.quiz.questions[question.id]
      assert.ok(text.title && text.assumptions && text.explanation)
      assert.equal((text.choices ?? question.choices).length, 4)
    }
    assert.equal(reduce(state, { type: 'NEXT' }), state)
    state = reduce(state, { type: 'SELECT', option: question.correctIndex })
    state = reduce(state, { type: 'CHECK' })
    state = reduce(state, { type: 'NEXT' })
  }
  assert.equal(state.phase, 'result')
  assert.equal(scoreQuiz(recursionQuestions, state.answers), 5)
  const restarted = reduce(state, { type: 'START' })
  assert.equal(scoreQuiz(recursionQuestions, restarted.answers), 0)
  assert.ok(restarted.answers.every(answer => !answer.checked && answer.selected === null))
})

test('the highlighted Java code matches the downloadable, compiled examples', () => {
  for (const [kind, filename] of [['factorial', 'FactorialExample.java'], ['fibonacci', 'FibonacciExample.java']]) {
    const source = readFileSync(new URL('../src/examples/' + filename, import.meta.url), 'utf8').replace(/\s+/g, ' ')
    assert.ok(source.includes(recursionExamples[kind].code.replace(/\s+/g, ' ')))
  }
})
