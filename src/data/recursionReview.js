import { memoizedFibonacciCode, recursionExamples, recursionQuestions } from './recursion.js'
import { dfsCode, dfsDriverCode, dfsExamples } from './recursiveDfs.js'

const graphDeclaration = preset =>
  `int[][] graph = {${dfsExamples[preset].graph.map(row => `{${row.join(', ')}}`).join(', ')}};`
const branching = graphDeclaration('branching')
const disconnected = graphDeclaration('disconnected')
const dfsExample = graph => `${graph}\n\n${dfsCode}`

// Stable choice IDs keep checked answers intact when the UI language changes.
export const recursionReviewQuestions = [
  ...recursionQuestions,
  {
    id: 'resume',
    code: recursionExamples.factorial.code,
    choices: ['restart', 'multiply', 'return-child', 'change-n'],
    correctIndex: 1,
  },
  {
    id: 'stack',
    code: recursionExamples.fibonacci.code,
    choices: ['4,3,2,1', '1,2,3,4', '1', 'all-nine'],
    correctIndex: 1,
  },
  { id: 'dfs-next', code: dfsExample(branching), choices: ['3', '2', '1', '0'], correctIndex: 1 },
  {
    id: 'dfs-skip',
    code: dfsExample(graphDeclaration('cycle')),
    choices: ['smaller', 'post', 'visited', 'no-cycle'],
    correctIndex: 2,
  },
  {
    id: 'dfs-post',
    code: dfsExample(branching),
    choices: ['3,1,2,0', '0,1,3,2', '3,2,1,0', '0,2,1,3'],
    correctIndex: 0,
  },
  {
    id: 'dfs-scope',
    code: `${disconnected}\n\n${dfsDriverCode}`,
    choices: ['0,1', 'all', 'empty', '2'],
    correctIndex: 3,
  },
  {
    id: 'fib-cost',
    code: recursionExamples.fibonacci.code,
    choices: ['linear-linear', 'exponential-exponential', 'exponential-linear', 'linear-constant'],
    correctIndex: 2,
  },
  {
    id: 'memo-cost',
    code: `Long[] memo = new Long[n + 1];\n\n${memoizedFibonacciCode}`,
    choices: ['linear', 'quadratic', 'exponential', 'constant'],
    correctIndex: 0,
  },
  {
    id: 'dfs-cost',
    code: `${dfsDriverCode}\n\n${dfsCode}`,
    choices: ['linear-v', 'linear-ve', 'quadratic', 'constant-stack'],
    correctIndex: 1,
  },
  {
    id: 'dfs-setup',
    code: `${disconnected}\n\n${dfsDriverCode}`,
    choices: ['constant', 'log', 'linear', 'quadratic'],
    correctIndex: 2,
  },
]
