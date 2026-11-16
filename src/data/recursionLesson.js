import { createRecursionTrace } from '../utils/recursionAlgorithms.js'

// Lesson links use the same execution trace as the visualisation.
export const factorialLessonTrace = createRecursionTrace('factorial', 4)
export const fibonacciLessonTrace = createRecursionTrace('fibonacci', 4)

const find = (trace, key, n) => trace.findIndex(frame => frame.message.key === key && frame.message.values.n === n)

export const factorialWalkthrough = [
  { id: 'start', index: 0 },
  { id: 'enter', index: find(factorialLessonTrace, 'enter', 4) },
  { id: 'wait', index: find(factorialLessonTrace, 'enter', 3) },
  { id: 'base', index: find(factorialLessonTrace, 'base', 1) },
  { id: 'return', index: find(factorialLessonTrace, 'return', 1) },
  { id: 'resume', index: find(factorialLessonTrace, 'receiveFactorial', 4) },
  { id: 'multiply', index: find(factorialLessonTrace, 'multiply', 4) },
  { id: 'done', index: factorialLessonTrace.length - 1 },
]

export const fibonacciLeftReturn = find(fibonacciLessonTrace, 'receiveLeft', 4)
