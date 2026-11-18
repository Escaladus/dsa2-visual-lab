// Separate catalogue: the original 31 JDK-only examples keep their own downloads.
export const traJavaExamples = [
  {
    id: 'graph',
    className: 'TraGraphExample',
    topics: ['graph-basics', 'graph-dfs', 'graph-bfs'],
    output:
      'Directed vertices: 3\nA neighbours: [B]\nA -> B: true\nB -> A: false\nA is GREY: true\nA is BLACK: true\nU -> V: true\nV -> U: true',
  },
  {
    id: 'dfs',
    className: 'TraDfsExample',
    topics: ['graph-dfs', 'recursion', 'graph-apps'],
    output:
      'PRE: [0, 1, 2, 3]\nPOST: [2, 1, 3, 0]\nparent(2): 1\nisolated WHITE: true\nALL PRE: [0, 1, 2, 3, 4]\nALL POST: [2, 1, 3, 0, 4]\nroots: [0, 4]',
  },
  {
    id: 'bfs',
    className: 'TraBfsExample',
    topics: ['graph-bfs', 'graph-apps', 'shortest-paths'],
    output:
      'Discovered: [0, 1, 2, 3]\nDistances: [0, 1, 1, 1, -1]\nPath to 2: [0, 2]\nPath to 4: []\nisolated WHITE: true',
  },
]
