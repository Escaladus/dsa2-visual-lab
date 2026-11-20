export const treeExamples = {
  balanced: {
    root: 'A',
    nodes: {
      A: { value: 'A', left: 'B', right: 'C', x: 50, y: 10 },
      B: { value: 'B', left: 'D', right: 'E', x: 27, y: 35 },
      C: { value: 'C', left: 'F', right: 'G', x: 73, y: 35 },
      D: { value: 'D', left: null, right: null, x: 14, y: 68 },
      E: { value: 'E', left: null, right: null, x: 38, y: 68 },
      F: { value: 'F', left: null, right: null, x: 62, y: 68 },
      G: { value: 'G', left: null, right: null, x: 86, y: 68 },
    },
  },
  single: {
    root: 'A',
    nodes: { A: { value: 'A', left: null, right: null, x: 50, y: 35 } },
  },
  chain: {
    root: 'A',
    nodes: {
      A: { value: 'A', left: 'B', right: null, x: 50, y: 10 },
      B: { value: 'B', left: 'C', right: null, x: 50, y: 30 },
      C: { value: 'C', left: 'D', right: null, x: 50, y: 50 },
      D: { value: 'D', left: null, right: null, x: 50, y: 70 },
    },
  },
  empty: { root: null, nodes: {} },
}
