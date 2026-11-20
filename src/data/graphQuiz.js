import {
  traversalExamples,
  dfsTraversalCode,
  bfsTraversalCode,
  classifyTraversalCode,
  traverseTraversalCode,
  topologicalTraversalCode,
  traversalExcerpt,
} from './graphTraversal.js'
import { createGraphTraversalTrace } from '../utils/graphTraversal.js'

function createQuestionContext(preset, algorithm, event, test = () => true, extra = {}) {
  const example = traversalExamples[preset]
  const options = { algorithm, start: 0, all: false, directed: example.directed, ...extra }
  const frames = createGraphTraversalTrace(example.graph, options)
  const index =
    event === 'done'
      ? frames.length - 1
      : frames.findIndex(step => step.message.key === event && test(step))
  if (index < 0) {
    throw new Error(`Missing quiz context: ${preset} ${event}`)
  }
  const step = frames[index]
  const after = step.edge
    ? (frames
        .slice(index + 1)
        .find(
          s =>
            ['edgeType', 'parentEdge'].includes(s.message.key) &&
            s.edge?.from === step.edge.from &&
            s.edge?.to === step.edge.to,
        ) ?? step)
    : step
  return { preset, options, index, step, after }
}
const matchesEdge = (u, v) => step => step.edge?.from === u && step.edge?.to === v
const createQuestion = (id, correctIndex, questionContext, code) => ({
  id,
  correctIndex,
  choices: ['a', 'b', 'c', 'd'],
  context: questionContext,
  code,
})
export const graphQuizQuestions = [
  createQuestion(
    'resume',
    2,
    createQuestionContext('branching', 'dfs', 'resume', s => s.vertex === 0),
    traversalExcerpt(dfsTraversalCode, 'for (int i', 'state.post.add(v)'),
  ),
  createQuestion(
    'dfsGrey',
    0,
    createQuestionContext('branching', 'dfs', 'wait', s => s.vertex === 1),
    traversalExcerpt(dfsTraversalCode, 'static void dfs', 'state.pre.add(v)'),
  ),
  createQuestion(
    'bfsGrey',
    2,
    createQuestionContext('branching', 'bfs', 'dequeue', s => s.vertex === 0),
    traversalExcerpt(bfsTraversalCode, 'start.setColor(GREY)', 'if (next.getColor() != WHITE)'),
  ),
  createQuestion(
    'post',
    1,
    createQuestionContext('branching', 'dfs', 'post', s => s.vertex === 3),
    traversalExcerpt(dfsTraversalCode, 'state.post.add(v)', 'v.setColor(BLACK)'),
  ),
  createQuestion(
    'tree',
    0,
    createQuestionContext('directed', 'dfs', 'check', matchesEdge(0, 1)),
    traversalExcerpt(dfsTraversalCode, 'if (next.getColor() == WHITE)', 'dfs(next, state);'),
  ),
  createQuestion(
    'back',
    1,
    createQuestionContext('directed', 'dfs', 'seen', matchesEdge(2, 0)),
    classifyTraversalCode,
  ),
  createQuestion(
    'forward',
    2,
    createQuestionContext('directed', 'dfs', 'seen', matchesEdge(0, 2)),
    classifyTraversalCode,
  ),
  createQuestion(
    'cross',
    3,
    createQuestionContext('directed', 'dfs', 'seen', matchesEdge(3, 2)),
    classifyTraversalCode,
  ),
  createQuestion(
    'parent',
    1,
    createQuestionContext('branching', 'dfs', 'seen', matchesEdge(1, 0)),
    traversalExcerpt(dfsTraversalCode, '} else if (!state.directed', 'state.types.putIfAbsent'),
  ),
  createQuestion(
    'forest',
    2,
    createQuestionContext('dag', 'dfs', 'done', () => true, { start: 2, all: true }),
    traversalExcerpt(traverseTraversalCode, 'if (all)', 'return state;'),
  ),
  createQuestion(
    'shortest',
    0,
    createQuestionContext('dag', 'bfs', 'done'),
    traversalExcerpt(bfsTraversalCode, 'state.parent.put(next, v', 'queue.offer(next)'),
  ),
  createQuestion(
    'topological',
    3,
    createQuestionContext('directed', 'dfs', 'done', () => true, { all: true }),
    topologicalTraversalCode,
  ),
]
