import { dfsCode, dfsDriverCode } from './recursiveDfsCode.js'
export { dfsCode, dfsDriverCode }

export function dfsLine(method, statement) {
  const code = method === 'dfs' ? dfsCode : dfsDriverCode
  const index = code.split('\n').findIndex(line => line.includes(statement))
  if (index < 0) throw new Error(`Missing TRA DFS line: ${method} ${statement}`)
  return index + 1
}

// Undirected fixtures are inserted in ID order; the pinned JAR yields these native neighbour lists.
// General Vertex.neighbors() does not promise sorted labels. The root list has explicit stable IDs.
export const dfsExamples = {
  branching: {
    graph: [[1, 2], [0, 3], [0], [1]],
    positions: [
      { x: 130, y: 48 },
      { x: 90, y: 145 },
      { x: 300, y: 145 },
      { x: 90, y: 250 },
    ],
  },
  cycle: {
    graph: [[1, 2], [0, 2, 3], [0, 1], [1]],
    positions: [
      { x: 100, y: 48 },
      { x: 225, y: 140 },
      { x: 65, y: 235 },
      { x: 335, y: 245 },
    ],
  },
  disconnected: {
    graph: [[1], [0], [], [4], [3]],
    positions: [
      { x: 65, y: 65 },
      { x: 175, y: 65 },
      { x: 325, y: 65 },
      { x: 110, y: 235 },
      { x: 280, y: 235 },
    ],
  },
}
