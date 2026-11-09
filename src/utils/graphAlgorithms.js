export const graphNodes = {
  A: { x: 12, y: 48 },
  B: { x: 30, y: 18 },
  C: { x: 31, y: 77 },
  D: { x: 53, y: 34 },
  E: { x: 54, y: 72 },
  F: { x: 76, y: 16 },
  G: { x: 80, y: 58 },
  H: { x: 92, y: 82 },
}

export const graphEdges = [
  ['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'F'], ['C', 'D'],
  ['C', 'E'], ['D', 'E'], ['D', 'G'], ['E', 'G'], ['F', 'G'], ['G', 'H'],
]

export const adjacency = Object.keys(graphNodes).reduce((acc, key) => ({ ...acc, [key]: [] }), {})
for (const [a, b] of graphEdges) {
  adjacency[a].push(b)
  adjacency[b].push(a)
}
for (const key of Object.keys(adjacency)) adjacency[key].sort()

export function createDfsSteps(start) {
  const steps = []
  const visited = new Set()
  const pre = []
  const post = []
  const stack = []

  function dfs(v, parent = null) {
    visited.add(v)
    stack.push(v)
    pre.push(v)
    steps.push({
      kind: 'enter', current: v, parent,
      visited: [...visited], pre: [...pre], post: [...post], frontier: [...stack],
      message: { key: 'dfsEnter', values: { v } },
    })

    for (const next of adjacency[v]) {
      steps.push({
        kind: visited.has(next) ? 'skip' : 'edge', current: v, next,
        visited: [...visited], pre: [...pre], post: [...post], frontier: [...stack],
        message: { key: visited.has(next) ? 'dfsSkip' : 'dfsEdge', values: { v, next } },
      })
      if (!visited.has(next)) dfs(next, v)
    }

    post.push(v)
    steps.push({
      kind: 'exit', current: v,
      visited: [...visited], pre: [...pre], post: [...post], frontier: [...stack],
      message: { key: 'dfsExit', values: { v } },
    })
    stack.pop()
  }

  dfs(start)
  return steps
}

export function createBfsSteps(start) {
  const steps = []
  const visited = new Set([start])
  const queue = [start]
  const order = []
  const distance = { [start]: 0 }
  const parent = { [start]: null }

  steps.push({
    kind: 'enqueue', current: start, visited: [...visited], frontier: [...queue],
    order: [...order], distance: { ...distance },
    message: { key: 'bfsStart', values: { start } },
  })

  while (queue.length) {
    const v = queue.shift()
    order.push(v)
    steps.push({
      kind: 'dequeue', current: v, visited: [...visited], frontier: [...queue],
      order: [...order], distance: { ...distance },
      message: { key: 'bfsDequeue', values: { v } },
    })

    for (const next of adjacency[v]) {
      if (visited.has(next)) {
        steps.push({
          kind: 'skip', current: v, next, visited: [...visited], frontier: [...queue],
          order: [...order], distance: { ...distance },
          message: { key: 'bfsSkip', values: { next } },
        })
        continue
      }
      visited.add(next)
      parent[next] = v
      distance[next] = distance[v] + 1
      queue.push(next)
      steps.push({
        kind: 'enqueue', current: next, parent: v, visited: [...visited], frontier: [...queue],
        order: [...order], distance: { ...distance },
        message: { key: 'bfsEnqueue', values: { v, next, distance: distance[next] } },
      })
    }
  }

  return steps
}
