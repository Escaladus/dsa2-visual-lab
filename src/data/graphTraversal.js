import { dfsTraversalCode, bfsTraversalCode, traverseTraversalCode } from './graphTraversalCode.js'
export {
  dfsTraversalCode,
  bfsTraversalCode,
  traverseTraversalCode,
  classifyTraversalCode,
  topologicalTraversalCode,
} from './graphTraversalCode.js'

/** Select a teaching excerpt by Java statements instead of fragile line-number offsets. */
export function traversalExcerpt(code, firstStatement, lastStatement) {
  const lines = code.split('\n')
  const first = lines.findIndex(line => line.includes(firstStatement))
  const last = lines.findIndex((line, index) => index >= first && line.includes(lastStatement))
  if (first < 0 || last < first) {
    throw new Error('Missing Java excerpt boundaries')
  }
  return lines.slice(first, last + 1).join('\n')
}

export const traversalExamples = {
  branching: {
    directed: false,
    graph: [[1, 2], [0, 3], [0], [1]],
    positions: [
      { x: 130, y: 48 },
      { x: 90, y: 145 },
      { x: 300, y: 145 },
      { x: 90, y: 250 },
    ],
  },
  cycle: {
    directed: false,
    graph: [[1, 2], [0, 2, 3], [0, 1], [1]],
    positions: [
      { x: 100, y: 48 },
      { x: 225, y: 140 },
      { x: 65, y: 235 },
      { x: 335, y: 245 },
    ],
  },
  disconnected: {
    directed: false,
    graph: [[1], [0], [], [4], [3]],
    positions: [
      { x: 65, y: 65 },
      { x: 175, y: 65 },
      { x: 325, y: 65 },
      { x: 110, y: 235 },
      { x: 280, y: 235 },
    ],
  },
  directed: {
    directed: true,
    graph: [[1, 2, 3], [2], [0], [2], []],
    positions: [
      { x: 95, y: 55 },
      { x: 230, y: 60 },
      { x: 230, y: 230 },
      { x: 70, y: 225 },
      { x: 350, y: 145 },
    ],
  },
  dag: {
    directed: true,
    graph: [[1, 2, 3], [2], [], [2], []],
    positions: [
      { x: 95, y: 55 },
      { x: 230, y: 60 },
      { x: 230, y: 230 },
      { x: 70, y: 225 },
      { x: 350, y: 145 },
    ],
  },
}

export function traversalLine(method, source) {
  const code = { dfs: dfsTraversalCode, bfs: bfsTraversalCode, traverse: traverseTraversalCode }[
    method
  ]
  const index = code.split('\n').findIndex(line => line.includes(source))
  if (index < 0) {
    throw new Error(`Missing Java line: ${method} ${source}`)
  }
  return index + 1
}
