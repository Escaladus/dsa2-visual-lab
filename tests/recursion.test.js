import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import {
  memoizedFibonacciCode,
  recursionExamples,
  recursionQuestions,
} from '../src/data/recursion.js'
import {
  activeRecursionReturn,
  answerRecursionPrediction,
  createRecursionPrediction,
  createRecursionTrace,
  getRecursionStepContext,
  recursionTreeLayout,
} from '../src/utils/recursionAlgorithms.js'
import { dictionaries, formatMessage } from '../src/i18n/index.js'
import { createQuizReducer, createQuizState, scoreQuiz } from '../src/utils/studentQuiz.js'
import {
  factorialLessonTrace,
  factorialWalkthrough,
  fibonacciLeftReturn,
  fibonacciLessonTrace,
} from '../src/data/recursionLesson.js'
import { recursionTheory } from '../src/i18n/recursionTheory.js'
import { recursionTracing } from '../src/i18n/recursionTracing.js'

for (const [kind, example] of Object.entries(recursionExamples)) {
  test(`${kind}: correct results, real stack discipline, independent locals and fully translated steps`, () => {
    for (let n = 0; n <= example.max; n++) {
      const frames = createRecursionTrace(kind, n)
      let expected
      if (kind === 'factorial') {
        expected = 1
        for (let i = 2; i <= n; i++) {
          expected *= i
        }
      } else {
        let a = 0
        let b = 1
        for (let i = 0; i < n; i++) {
          ;[a, b] = [b, a + b]
        }
        expected = a
      }
      assert.equal(frames.at(-1).result, expected)
      assert.deepEqual(frames.at(-1).stack, [])
      assert.ok(frames.at(-1).nodes.every(node => node.status === 'done'))
      assert.equal(frames[0].nodes.length, 0)
      let previous = frames[0]
      let max = 0
      for (const frame of frames) {
        max = Math.max(max, frame.stack.length)
        assert.equal(frame.maxDepth, max)
        assert.equal(new Set(frame.stack).size, frame.stack.length)
        for (let i = 0; i < frame.stack.length; i++) {
          const node = frame.nodes[frame.stack[i]]
          assert.notEqual(node.status, 'done', 'Completed calls must leave the stack')
          assert.equal(
            node.parent,
            i === 0 ? null : frame.stack[i - 1],
            'The stack must be one ancestor path, not the whole tree',
          )
          assert.equal(node.locals.n, node.n)
          if (node.parent === null) {
            assert.equal(node.n, n)
          } else {
            assert.ok(
              [
                frame.nodes[node.parent].n - 1,
                ...(kind === 'fibonacci' ? [frame.nodes[node.parent].n - 2] : []),
              ].includes(node.n),
            )
          }
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
        if (frame.line !== null) {
          assert.ok(frame.line > 0 && frame.line <= example.code.split('\n').length)
        }
        for (const dictionary of Object.values(dictionaries)) {
          const template = dictionary.recursion.messages[frame.message.key]
          assert.equal(typeof template, 'string', frame.message.key)
          assert.doesNotMatch(formatMessage(template, frame.message.values), /\{\w+\}|undefined/)
        }
        if (frame !== previous) {
          assert.notEqual(frame.stack, previous.stack)
          for (const node of frame.nodes) {
            if (previous.nodes[node.id]) {
              assert.notEqual(node.locals, previous.nodes[node.id].locals)
            }
          }
        }
        previous = frame
      }
      for (const node of frames.at(-1).nodes) {
        const children = frames.at(-1).nodes.filter(child => child.parent === node.id)
        assert.deepEqual(
          children.map(child => child.n),
          node.n <= 1 ? [] : kind === 'factorial' ? [node.n - 1] : [node.n - 1, node.n - 2],
        )
      }
      const layout = recursionTreeLayout(frames.at(-1).nodes)
      for (const node of frames.at(-1).nodes) {
        const position = layout.positions[node.id]
        assert.ok(position.x >= 27 && position.x <= layout.width - 27)
        assert.ok(position.y >= 27 && position.y <= layout.height - 27)
        if (node.parent !== null) {
          assert.ok(
            position.y - 32 - (layout.positions[node.parent].y + 45) >= 18,
            'Return labels and child call IDs must not overlap',
          )
        }
      }
    }
  })
}

test('factorial unwinds after its base case; Fibonacci repeats calls without keeping them all on the stack', () => {
  const factorial = createRecursionTrace('factorial', 4)
  assert.deepEqual(
    factorial
      .filter(frame => ['return', 'returnRoot'].includes(frame.message.key))
      .map(frame => frame.returned.value),
    [1, 2, 6, 24],
  )
  assert.equal(factorial.at(-1).maxDepth, 4)
  const receive = factorial.find(
    frame => frame.message.key === 'receiveFactorial' && frame.message.values.n === 4,
  )
  assert.equal(receive.nodes[0].locals.child, 6)
  assert.equal(receive.nodes[0].result, null, 'The caller must still perform its multiplication')
  const fibonacci = createRecursionTrace('fibonacci', 4)
  assert.deepEqual(
    fibonacci.at(-1).nodes.map(node => node.n),
    [4, 3, 2, 1, 0, 1, 2, 1, 0],
  )
  assert.equal(fibonacci.at(-1).nodes.length, 9)
  assert.equal(fibonacci.at(-1).maxDepth, 4)
  assert.equal(fibonacci.at(-1).result, 3)
  assert.equal(createRecursionTrace('fibonacci', 0).at(-1).result, 0)
})

test('recursion input bounds prevent runaway traces', () => {
  for (const [kind, value] of [
    ['unknown', 4],
    ['factorial', -1],
    ['factorial', 9],
    ['fibonacci', 7],
    ['fibonacci', 1.5],
    ['factorial', '4'],
  ]) {
    assert.throws(() => createRecursionTrace(kind, value))
  }
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
  for (const [kind, filename] of [
    ['factorial', 'FactorialExample.java'],
    ['fibonacci', 'FibonacciExample.java'],
  ]) {
    const source = readFileSync(
      new URL('../src/examples/' + filename, import.meta.url),
      'utf8',
    ).replace(/\s+/g, ' ')
    assert.ok(source.includes(recursionExamples[kind].code.replace(/\s+/g, ' ')))
  }
  const memoized = readFileSync(
    new URL('../src/examples/MemoizedFibonacciExample.java', import.meta.url),
    'utf8',
  )
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
      if (i) {
        assert.notEqual(frame.cache, frames[i - 1].cache)
      }
      assert.equal(frame.stack.length, new Set(frame.stack).size)
      frame.stack.forEach((id, depth) => {
        assert.notEqual(frame.nodes[id].status, 'done')
        assert.equal(frame.nodes[id].parent, depth ? frame.stack[depth - 1] : null)
      })
      if (frame.message.key === 'cacheHit') {
        hits++
        assert.equal(frames[i - 1].cache[frame.message.values.n], frame.message.values.value)
        assert.ok(
          !final.nodes.some(node => node.parent === frame.current),
          'Cache hits must not create child calls',
        )
      }
      if (frame.message.key === 'storeCache') {
        const { n: key, value } = frame.message.values
        assert.equal(frames[i - 1].cache[key], undefined)
        assert.equal(frame.cache[key], value)
        assert.equal(
          frame.nodes[frame.current].locals.left + frame.nodes[frame.current].locals.right,
          value,
        )
      }
      assert.equal(frame.cacheHits, hits)
      if (frame.line !== null) {
        assert.ok(frame.line > 0 && frame.line <= memoizedFibonacciCode.split('\n').length)
      }
      for (const dictionary of Object.values(dictionaries)) {
        assert.equal(typeof dictionary.recursion.messages[frame.message.key], 'string')
        assert.doesNotMatch(
          formatMessage(dictionary.recursion.messages[frame.message.key], frame.message.values),
          /\{\w+\}|undefined/,
        )
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
      if (!transfer) {
        continue
      }
      assert.equal(frame.nodes[transfer.from].status, 'done')
      assert.equal(frame.nodes[transfer.from].parent, transfer.to)
      assert.equal(frame.nodes[transfer.from].result, transfer.value)
      if (transfer.to !== null) {
        assert.equal(frame.stack.at(-1), transfer.to)
        assert.ok(['active', 'waiting'].includes(frame.nodes[transfer.to].status))
      }
    }
    assert.equal(
      activeRecursionReturn(frames.at(-1)),
      null,
      'A stale return must not stay highlighted',
    )
  }
})

test('predictions cover calls, values, stack removals and resume lines before the corresponding event', () => {
  const types = new Set()
  for (const [kind, max] of [
    ['factorial', 8],
    ['fibonacci', 6],
  ]) {
    for (let n = 0; n <= max; n++) {
      const frames = createRecursionTrace(kind, n)
      for (let i = 0; i < frames.length; i++) {
        const question = createRecursionPrediction(frames, i)
        if (!question) {
          continue
        }
        const next = frames[i + 1]
        types.add(question.key)
        const expected = {
          nextCall: next.message.values.n,
          nextValue: next.message.values.value,
          nextStack: next.stack.length,
          resumeLine: next.line,
        }
        assert.equal(question.answer, expected[question.key])
        assert.equal(question.choices.length, 4)
        assert.equal(new Set(question.choices).size, 4)
        assert.ok(question.choices.every(value => Number.isInteger(value) && value >= 0))
        assert.ok(question.choices.includes(question.answer))
        assert.deepEqual(
          question,
          createRecursionPrediction(frames, i),
          'Rewinding must not shuffle the answers',
        )
        if (question.key === 'nextCall') {
          assert.equal(next.nodes.length, frames[i].nodes.length + 1)
        }
        if (question.key === 'nextValue') {
          assert.equal(
            frames[i].nodes[next.current].result,
            null,
            'The value being predicted must not already be revealed',
          )
        }
        if (question.key === 'nextStack') {
          assert.equal(next.stack.length, frames[i].stack.length - 1)
        }
        if (question.key === 'resumeLine') {
          assert.equal(next.line, frames[i].returned.line)
          assert.equal(next.current, frames[i].returned.to)
          assert.equal(question.reason.values.target, next.returned.target)
        }
        for (const [language, dictionary] of Object.entries(dictionaries)) {
          const labels = {
            ...dictionary.recursion.enhancements.practice,
            ...recursionTracing[language].practice,
          }
          assert.equal(typeof labels[question.key], 'string')
          assert.doesNotMatch(
            formatMessage(labels[question.key], question.values),
            /\{\w+\}|undefined/,
          )
          if (question.reason) {
            assert.doesNotMatch(
              formatMessage(labels.reasons[question.reason.key], question.reason.values),
              /\{\w+\}|undefined/,
            )
          }
        }
      }
    }
  }
  assert.deepEqual([...types].sort(), ['nextCall', 'nextStack', 'nextValue', 'resumeLine'])
})

test('saved continuation points match Java assignments and remain independent in every stack frame', () => {
  for (const [kind, memoized, max] of [
    ['factorial', false, 8],
    ['fibonacci', false, 6],
    ['fibonacci', true, 6],
  ]) {
    const code = (memoized ? memoizedFibonacciCode : recursionExamples[kind].code).split('\n')
    for (let n = 0; n <= max; n++) {
      const frames = createRecursionTrace(kind, n, { memoized })
      for (let index = 0; index < frames.length; index++) {
        const frame = frames[index]
        for (const node of frame.nodes) {
          if (node.continuation) {
            assert.equal(node.status, 'waiting')
            assert.equal(node.locals[node.continuation.target], null)
            assert.ok(
              code[node.continuation.line - 1].includes(`${node.continuation.target} = ${kind}(`),
            )
            if (index && frames[index - 1].nodes[node.id]?.continuation) {
              assert.notEqual(node.continuation, frames[index - 1].nodes[node.id].continuation)
            }
          }
          if (node.returnTo) {
            assert.equal(node.returnTo.id, node.parent)
            assert.ok(code[node.returnTo.line - 1].includes(`${node.returnTo.target} = ${kind}(`))
          } else {
            assert.equal(node.parent, null)
          }
        }
        if (frame.message.key.startsWith('receive')) {
          assert.equal(frame.line, frame.returned.line)
          assert.equal(frame.current, frame.returned.to)
          assert.equal(
            frame.nodes[frame.current].locals[frame.returned.target],
            frame.returned.value,
          )
          assert.equal(frame.nodes[frame.current].continuation, null)
        }
        const next = frames[index + 1]
        if (next?.message.key === 'enter' && next.nodes[next.current].parent !== null) {
          const child = next.nodes[next.current]
          const waiting = frame.nodes[child.parent]
          assert.equal(child.n, waiting.continuation.nextN)
          assert.deepEqual(child.returnTo, {
            id: waiting.id,
            line: waiting.continuation.line,
            target: waiting.continuation.target,
          })
        }
      }
    }
  }
})

test('every step has an accurate current call, top frame, continuation owner and translated next action', () => {
  for (const [kind, memoized] of [
    ['factorial', false],
    ['fibonacci', false],
    ['fibonacci', true],
  ]) {
    for (const n of [0, 1, 4]) {
      const frames = createRecursionTrace(kind, n, { memoized })
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i]
        const context = getRecursionStepContext(frames, i)
        assert.equal(context.current, frame.nodes[frame.current] ?? null)
        assert.equal(context.top, frame.nodes[frame.stack.at(-1)] ?? null)
        for (const labels of Object.values(recursionTracing)) {
          assert.equal(typeof labels.actions[context.nextAction], 'string')
        }
        if (context.resume) {
          assert.ok(frame.stack.includes(context.resume.id))
          assert.ok(['child', 'left', 'right'].includes(context.resume.target))
          if (frame.message.key === 'return') {
            assert.equal(context.resume.id, frame.returned.to)
          }
          if (frame.message.key.startsWith('receive')) {
            assert.equal(context.resume.id, frame.current)
          }
        }
      }
      assert.equal(getRecursionStepContext(frames, 0).current, null)
      assert.equal(getRecursionStepContext(frames, frames.length - 1).resume, null)
      assert.equal(getRecursionStepContext(frames, frames.length - 1).nextAction, 'finished')
    }
  }
})

test('a prediction is scored once per position; rewinding cannot change checked answers, including zero', () => {
  const frames = createRecursionTrace('factorial', 4)
  const index = frames.findIndex(
    (_, i) => createRecursionPrediction(frames, i)?.key === 'resumeLine',
  )
  const question = createRecursionPrediction(frames, index)
  const empty = {}
  assert.equal(answerRecursionPrediction(empty, index, null, 0), empty)
  assert.equal(answerRecursionPrediction(empty, index, question, -1), empty)
  const wrong = question.choices.find(value => value !== question.answer)
  const answers = answerRecursionPrediction(empty, index, question, wrong)
  assert.deepEqual(empty, {})
  assert.equal(answers[index].correct, false)
  const rewound = createRecursionPrediction(frames, index)
  assert.equal(answerRecursionPrediction(answers, index, rewound, question.answer), answers)
  assert.equal(Object.keys(answers).length, 1)
  const zeroFrames = createRecursionTrace('fibonacci', 0)
  const zeroIndex = zeroFrames.findIndex(
    (_, i) => createRecursionPrediction(zeroFrames, i)?.key === 'nextStack',
  )
  const zero = createRecursionPrediction(zeroFrames, zeroIndex)
  assert.equal(zero.answer, 0)
  assert.deepEqual(answerRecursionPrediction({}, zeroIndex, zero, 0)[zeroIndex], {
    selected: 0,
    correct: true,
  })
})

test('the factorial lesson opens the actual waiting, base-case, return and continuation states it explains', () => {
  let previous = -1
  const moments = {}
  for (const moment of factorialWalkthrough) {
    assert.ok(moment.index > previous && moment.index < factorialLessonTrace.length)
    previous = moment.index
    moments[moment.id] = factorialLessonTrace[moment.index]
    for (const labels of Object.values(recursionTheory)) {
      assert.equal(labels.moments[moment.id].length, 2)
    }
  }
  assert.deepEqual(moments.start.stack, [])
  assert.equal(moments.enter.line, 1)
  assert.deepEqual(
    moments.wait.stack.map(id => moments.wait.nodes[id].n),
    [4, 3],
  )
  assert.equal(moments.wait.nodes[0].status, 'waiting')
  assert.equal(moments.wait.nodes[0].locals.child, null)
  assert.equal(moments.base.line, 2)
  assert.equal(
    moments.base.stack.length,
    4,
    'The base call must still return before its frame is popped',
  )
  assert.equal(moments.return.stack.length, 3)
  assert.equal(moments.return.returned.value, 1)
  assert.equal(moments.resume.line, 3)
  assert.deepEqual(moments.resume.nodes[0].locals, { n: 4, child: 6 })
  assert.equal(
    moments.resume.nodes[0].result,
    null,
    'Returning to the caller must not skip its remaining multiplication',
  )
  assert.equal(moments.multiply.line, 4)
  assert.equal(moments.multiply.nodes[0].result, 24)
  assert.equal(moments.done.result, 24)
  assert.deepEqual(moments.done.stack, [])
})

test('the Fibonacci lesson pauses after the left branch, before the right branch is called', () => {
  assert.ok(fibonacciLeftReturn > 0)
  const frame = fibonacciLessonTrace[fibonacciLeftReturn]
  assert.equal(frame.message.key, 'receiveLeft')
  assert.equal(frame.line, 3)
  assert.deepEqual(frame.nodes[0].locals, { n: 4, left: 2 })
  assert.deepEqual(
    frame.nodes.filter(node => node.parent === 0).map(node => node.n),
    [3],
  )
  const final = fibonacciLessonTrace.at(-1)
  assert.equal(final.nodes.length, 9)
  assert.equal(final.maxDepth, 4)
  assert.equal(final.result, 3)
  for (const labels of Object.values(recursionTheory)) {
    assert.doesNotMatch(
      formatMessage(labels.countText, { calls: final.nodes.length, depth: final.maxDepth }),
      /\{\w+\}/,
    )
  }
})
