import { dfsExamples } from './recursiveDfs.js'
import { createRecursiveDfsTrace } from '../utils/recursiveDfs.js'

export const dfsLessonTrace = createRecursiveDfsTrace(dfsExamples.branching.graph)
const find = (key, v) => dfsLessonTrace.findIndex(step => step.message.key === key && step.message.values.v === v)
export const dfsWalkthrough = [
  { id: 'mark', index: find('mark', 0) },
  { id: 'descend', index: find('wait', 1) },
  { id: 'finishLeaf', index: find('post', 3) },
  { id: 'return', index: find('return', 3) },
  { id: 'resume', index: find('resume', 0) },
  { id: 'nextNeighbor', index: dfsLessonTrace.findIndex(step => step.message.key === 'neighbor' && step.message.values.v === 0 && step.message.values.next === 2) },
  { id: 'done', index: dfsLessonTrace.length - 1 },
]
