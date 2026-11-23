// Technical reference sources retained for visualisation synchronisation and independent checks.
// Sources with a TRA classpath stay separate from the standalone JDK downloads.
export const traReferenceExamples = [
  {
    id: 'graph',
    className: 'TraGraphExample',
    topics: ['graph-basics'],
    primaryTopics: ['graph-basics'],
    output:
      'Directed vertices: 4\nA neighbours: [B, C]\nB neighbours: [C]\nC neighbours: []\nD neighbours: []\nA -> B: true\nB -> A: false\nA -> B weight: 5.0\nA is GREY: true\nA is BLACK: true\nU neighbours: [V]\nV neighbours: [U]',
  },
  {
    id: 'graphData',
    className: 'TraGraphDataExample',
    topics: ['graph-basics', 'maps'],
    primaryTopics: ['graph-basics', 'maps'],
    output:
      'Outgoing counts: [A=2, B=1, C=0, D=0]\nSame label: true\nDifferent vertices: true\nSeparate counts: 1 / 0\nMap size: 2',
  },
  {
    id: 'recursiveDfs',
    className: 'TraRecursiveDfsExample',
    topics: ['recursion', 'graph-dfs'],
    primaryTopics: ['recursion', 'graph-dfs'],
    output: 'PRE: [0, 1, 3, 2]\nPOST: [3, 1, 2, 0]',
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
    primaryTopics: ['graph-bfs'],
    topics: ['graph-bfs', 'graph-apps', 'shortest-paths'],
    output:
      'Discovered: [A, B, C, D, F, E, G, H]\nDistances: [0, 1, 1, 2, 2, 2, 3, 4]\nPath to H: [A, B, D, G, H]',
  },
  {
    id: 'cuts',
    className: 'TraGraphCutsExample',
    topics: ['graph-analysis'],
    primaryTopics: ['graph-analysis'],
    output:
      'Articulation: [1, 3]\nBridges: [1-3, 3-4]\ntin: [1, 2, 3, 4, 5, 6]\nlow: [1, 1, 1, 4, 5, 6]',
  },
  {
    id: 'matching',
    className: 'TraBipartiteMatchingExample',
    topics: ['graph-analysis'],
    primaryTopics: ['graph-analysis'],
    output: 'Size: 2\nPairs: [L1-R0, L0-R1]\nL0 partner: R1\nR2 unmatched: true',
  },
  {
    id: 'flow',
    className: 'TraMaxFlowExample',
    topics: ['graph-analysis'],
    primaryTopics: ['graph-analysis'],
    output:
      'Flow: 5\nCut capacity: 5\nSource side: [s]\nRerouted flow: 2\nReverse residual steps: 1\nFinal a->x flow: 0',
  },
  {
    id: 'traversal',
    className: 'TraTraversalExample',
    topics: ['recursion', 'graph-dfs', 'graph-bfs', 'graph-analysis', 'graph-apps'],
    primaryTopics: ['recursion', 'graph-dfs', 'graph-bfs', 'graph-analysis', 'graph-apps'],
    output:
      '[0, 1, 2, 3, 4]\n[2, 1, 3, 0, 4]\n{0:1=tree, 1:2=tree, 2:0=back, 0:2=forward, 0:3=tree, 3:2=cross}\n[0, 1, 2, 0]\n[0, 1, 1, 1, -1]\n[0, 2]\n[4, 0, 3, 1, 2]',
  },
  {
    id: 'components',
    className: 'TraComponentsExample',
    topics: ['graph-apps'],
    primaryTopics: ['graph-apps'],
    output:
      'Components: [[0, 1], [2], [3, 4]]\nCycle: false\nTriangle cycle: true\nEmpty components: []',
  },
  {
    id: 'topological',
    className: 'TraTopologicalExample',
    topics: ['graph-apps', 'graph-analysis'],
    primaryTopics: ['graph-apps', 'graph-analysis'],
    output: 'DAG order: [4, 0, 3, 1, 2]\nDirected cycle: cycle\nSelf-loop: cycle\nEmpty order: []',
  },
  {
    id: 'dijkstra',
    className: 'TraDijkstraExample',
    topics: ['shortest-paths'],
    primaryTopics: ['shortest-paths'],
    output:
      'Distances from A: [0.0, 3.0, 1.0, 4.0, INF]\nPath to D: [A, C, B, D]\nPath to A: [A]\nPath to E: []\nRejected: negative weight',
  },
  {
    id: 'floyd',
    className: 'TraFloydWarshallExample',
    topics: ['shortest-paths'],
    primaryTopics: ['shortest-paths'],
    output:
      'Matrix order: [A, B, C, D]\n[0.0, 5.0, 3.0, INF]\n[INF, 0.0, -2.0, INF]\n[INF, INF, 0.0, INF]\n[INF, INF, INF, 0.0]\nPath A to C: [A, B, C]\nPath C to A: []\nPath D to D: [D]\nRejected: negative cycle',
  },
  {
    id: 'mst',
    className: 'TraMinimumSpanningTreeExample',
    topics: ['mst'],
    primaryTopics: ['mst'],
    output:
      'Prim: weight=4.0, components=1, tree=true\nEdges: [A-B, B-C, C-D]\nKruskal: weight=4.0, components=1, tree=true\nEdges: [A-B, C-D, B-C]\nPrim forest: weight=2.0, components=3, tree=false\nEdges: [A-B, B-C, C-D, F-G]\nKruskal forest: weight=2.0, components=3, tree=false\nEdges: [F-G, A-B, C-D, B-C]\nEmpty: weight=0.0, components=0, tree=false\nEdges: []\nContrast MST weight: 3.0',
  },
  {
    id: 'tree',
    className: 'TraTreeExample',
    topics: ['trees'],
    primaryTopics: ['trees'],
    output:
      'PRE: [A, B, D, E, C, F, G]\nIN: [D, B, E, A, F, C, G]\nPOST: [D, E, B, F, G, C, A]\nNodes: 7\nHeight (edges): 2\nLevels: 3\nEmpty height: -1\nGeneral children of R: [X, Y, Z]',
  },
  {
    id: 'priorityQueue',
    className: 'TraPriorityQueueExample',
    topics: ['heap'],
    primaryTopics: ['heap'],
    output:
      'peek: 2\nSize after peek: 6\nSize after duplicate: 7\npoll: 2\nRemoval order: [3, 3, 5, 6, 7, 9]\nEmpty peek: null\nEmpty poll: null\nTasks (priority, then id): [A, B, C]',
  },
]
