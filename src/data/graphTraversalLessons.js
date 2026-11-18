// Presets used by the guided lessons. Neighbours are ascending unless the student changes them.
export const graphTraversalTasks = {
  reach: { preset: 'dag', algorithm: 'dfs', traverseAll: false },
  shortest: { preset: 'dag', algorithm: 'bfs', traverseAll: false },
  components: { preset: 'disconnected', algorithm: 'dfs', traverseAll: true },
  cycle: { preset: 'directed', algorithm: 'dfs', traverseAll: true },
  topological: { preset: 'dag', algorithm: 'dfs', traverseAll: true },
}

export const graphTraversalMoments = {
  descend: {
    preset: 'branching',
    algorithm: 'dfs',
    event: 'wait',
    matches: step => step.message.values.v === 1,
  },
  skip: {
    preset: 'branching',
    algorithm: 'dfs',
    event: 'parentEdge',
    matches: step => step.vertex === 3,
  },
  leaf: {
    preset: 'branching',
    algorithm: 'dfs',
    event: 'post',
    matches: step => step.vertex === 3,
  },
  backtrack: {
    preset: 'branching',
    algorithm: 'dfs',
    event: 'return',
    matches: step => step.message.values.v === 3,
  },
  resume: {
    preset: 'branching',
    algorithm: 'dfs',
    event: 'resume',
    matches: step => step.vertex === 0,
  },
  neighbour: {
    preset: 'branching',
    algorithm: 'dfs',
    event: 'neighbor',
    matches: step => step.vertex === 0 && step.edge.to === 2,
  },
  back: {
    preset: 'directed',
    algorithm: 'dfs',
    event: 'edgeType',
    matches: step => step.message.values.kind === 'back',
    showEdgeTypes: true,
  },
  forward: {
    preset: 'directed',
    algorithm: 'dfs',
    event: 'edgeType',
    matches: step => step.message.values.kind === 'forward',
    showEdgeTypes: true,
  },
  cross: {
    preset: 'directed',
    algorithm: 'dfs',
    event: 'edgeType',
    matches: step => step.message.values.kind === 'cross',
    showEdgeTypes: true,
  },
  bfsGrey: {
    preset: 'branching',
    algorithm: 'bfs',
    event: 'dequeue',
    matches: step => step.vertex === 0,
  },
}
