import { additionalTopics } from './handout.js'

// Stable IDs keep navigation and the current lesson independent of language.
export const topics = [
  { id: 'overview', group: 0 },
  { id: 'complexity', group: 0 },
  { id: 'recursion', group: 0 },
  { id: 'sorted-lists', group: 1 },
  { id: 'sets-maps', group: 1 },
  { id: 'trees', group: 2 },
  { id: 'heap', group: 2 },
  { id: 'sorting', group: 3 },
  { id: 'graph-basics', group: 4 },
  { id: 'graph-dfs', group: 4 },
  { id: 'graph-bfs', group: 4 },
  { id: 'graph-apps', group: 4 },
  { id: 'java-tools', group: 5 },
  ...additionalTopics,
]

export const roadmapIds = ['complexity', 'sorted-lists', 'recursion', 'trees', 'sorting', 'graph-basics']
