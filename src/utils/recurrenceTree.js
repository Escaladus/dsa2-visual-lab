import { recurrenceExamples, recurrenceInputs } from '../data/recurrenceTrees.js'

// Build the full geometry once. Revealing levels never moves existing nodes.
export function createRecurrenceTree(exampleId, n) {
  if (!Object.hasOwn(recurrenceExamples, exampleId) || !recurrenceInputs.includes(n)) {
    throw new Error('Invalid recurrence example or input')
  }
  const example = recurrenceExamples[exampleId]
  const nodes = []
  const levels = []
  // Leaf columns determine the full width even while only the root is visible.
  let leaves = 0
  function visit(size, depth, parent = null) {
    const id = nodes.length
    const node = {
      id,
      parent,
      depth,
      size,
      work: example.own === 'linear' ? size : 1,
      children: [],
      x: 0,
      y: 48 + depth * 88,
    }
    nodes.push(node)
    const row = (levels[depth] ??= {
      index: depth,
      size,
      nodeCount: 0,
      ownWork: node.work,
      work: 0,
      ids: [],
    })
    row.nodeCount++
    row.work += node.work
    row.ids.push(id)
    if (size > 1) {
      const next = example.reduction === 'halve' ? size / 2 : size - 1
      for (let i = 0; i < example.children; i++) {
        node.children.push(visit(next, depth + 1, id))
      }
      node.x = node.children.reduce((sum, child) => sum + nodes[child].x, 0) / node.children.length
    } else {
      node.x = 72 + leaves++ * 112
    }
    return id
  }
  visit(n, 0)
  let cumulativeWork = 0
  let cumulativeNodes = 0
  // A level counts both internal calls and base cases, including their own work.
  for (const row of levels) {
    row.cumulativeWork = cumulativeWork += row.work
    row.cumulativeNodes = cumulativeNodes += row.nodeCount
  }
  return {
    nodes,
    levels,
    maxDepth: levels.length - 1,
    totalLevels: levels.length,
    maxWidth: Math.max(...levels.map(row => row.nodeCount)),
    totalNodes: nodes.length,
    totalWork: cumulativeWork,
    width: leaves * 112 + 32,
    height: 96 + (levels.length - 1) * 88,
  }
}
