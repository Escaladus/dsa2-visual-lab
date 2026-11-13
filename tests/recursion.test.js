import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { memoizedFibonacciCode, recursionExamples, recursionQuestions } from '../src/data/recursion.js'
import { activeRecursionReturn, createRecursionPrediction, createRecursionTrace, recursionTreeLayout } from '../src/utils/recursionAlgorithms.js'
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
  const memoized = readFileSync(new URL('../src/examples/MemoizedFibonacciExample.java', import.meta.url), 'utf8')
  assert.ok(memoized.replace(/\s+/g, ' ').includes(memoizedFibonacciCode.replace(/\s+/g, ' ')))
})

test('memoised Fibonacci reuses only completed results, without hiding cache-hit invocations', () => {
  for (let n = 0; n <= 6; n++) {
    const frames = createRecursionTrace('fibonacci', n, { memoized: true })
    const final = frames.at(-1)
    assert.equal(final.result, createRecursionTrace('fibonacci', n).at(-1).result)
    assert.equal(final.nodes.length, n < 2 ? 1 : 2 * n - 1)
    assert.equal(final.cacheHits, Math.max(0, n - 3))
    assert.deepEqual(final.stack, [])
    let hits = 0
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i]
      if (i) assert.notEqual(frame.cache, frames[i - 1].cache)
      assert.equal(frame.stack.length, new Set(frame.stack).size)
      frame.stack.forEach((id, depth) => {
        assert.notEqual(frame.nodes[id].status, 'done')
        assert.equal(frame.nodes[id].parent, depth ? frame.stack[depth - 1] : null)
      })
      if (frame.message.key === 'cacheHit') {
        hits++
        assert.equal(frames[i - 1].cache[frame.message.values.n], frame.message.values.value)
        assert.ok(!final.nodes.some(node => node.parent === frame.current), 'Cache hits must not create child calls')
      }
      if (frame.message.key === 'storeCache') {
        const { n: key, value } = frame.message.values
        assert.equal(frames[i - 1].cache[key], undefined)
        assert.equal(frame.cache[key], value)
        assert.equal(frame.nodes[frame.current].locals.left + frame.nodes[frame.current].locals.right, value)
      }
      assert.equal(frame.cacheHits, hits)
      if (frame.line !== null) assert.ok(frame.line > 0 && frame.line <= memoizedFibonacciCode.split('\n').length)
      for (const dictionary of Object.values(dictionaries)) {
        assert.equal(typeof dictionary.recursion.messages[frame.message.key], 'string')
        assert.doesNotMatch(formatMessage(dictionary.recursion.messages[frame.message.key], frame.message.values), /\{\w+\}|undefined/)
      }
    }
    assert.equal(Object.keys(final.cache).length, Math.max(0, n - 1))
    assert.deepEqual(frames[0].cache, {}, 'Each execution starts with a fresh cache')
  }
  assert.throws(() => createRecursionTrace('factorial', 4, { memoized: true }))
})

test('return highlights connect an actual completed child to its waiting or resumed caller', () => {
  for (const kind of ['factorial', 'fibonacci']) {
    const frames = createRecursionTrace(kind, 4)
    for (const frame of frames) {
      const transfer = activeRecursionReturn(frame)
      if (!transfer) continue
      assert.equal(frame.nodes[transfer.from].status, 'done')
      assert.equal(frame.nodes[transfer.from].parent, transfer.to)
      assert.equal(frame.nodes[transfer.from].result, transfer.value)
      if (transfer.to !== null) {
        assert.equal(frame.stack.at(-1), transfer.to)
        assert.ok(['active', 'waiting'].includes(frame.nodes[transfer.to].status))
      }
    }
    assert.equal(activeRecursionReturn(frames.at(-1)), null, 'A stale return must not stay highlighted')
  }
})

test('predictions ask before revealing calls and calculations; zero and large values have four distinct choices', () => {
  for (const [kind, max] of [['factorial', 8], ['fibonacci', 6]]) {
    for (let n = 0; n <= max; n++) {
      const frames = createRecursionTrace(kind, n)
      for (let i = 0; i < frames.length; i++) {
        const question = createRecursionPrediction(frames, i)
        if (!question) continue
        const next = frames[i + 1]
        assert.equal(question.answer, next.message.values[question.key === 'nextCall' ? 'n' : 'value'])
        assert.equal(question.choices.length, 4)
        assert.equal(new Set(question.choices).size, 4)
        assert.ok(question.choices.every(value => Number.isInteger(value) && value >= 0))
        assert.ok(question.choices.includes(question.answer))
        assert.deepEqual(question, createRecursionPrediction(frames, i), 'Rewinding must not shuffle the answers')
        if (question.key === 'nextCall') assert.equal(next.nodes.length, frames[i].nodes.length + 1)
        else assert.equal(frames[i].nodes[next.current].result, null, 'The value being predicted must not already be revealed')
        for (const dictionary of Object.values(dictionaries)) assert.ok(dictionary.recursion.enhancements.practice[question.key])
      }
    }
  }
})
