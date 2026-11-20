import { treeTraversalCode } from '../data/treeTraversalCode.js'

export function treeProcessingLine(type) {
  const statement = { pre: 'pre.add(', in: 'in.add(', post: 'post.add(' }[type]
  if (!statement) throw new Error('Unknown tree traversal')
  return treeTraversalCode.split('\n').findIndex(line => line.includes(statement)) + 1
}

/** One step per processed node, preserving the existing illustration's PRE/IN/POST rhythm. */
export function createTreeTraversalSteps(tree, type) {
  const line = treeProcessingLine(type)
  const steps = []
  const order = []
  const processed = []
  const path = []
  let peakNodeFrames = 0
  function walk(id) {
    if (id === null) return
    const node = tree.nodes[id]
    path.push(id)
    peakNodeFrames = Math.max(peakNodeFrames, path.length)
    function process() {
      order.push(node.value)
      processed.push(id)
      steps.push({
        current: id,
        value: node.value,
        order: [...order],
        processed: [...processed],
        depth: path.length - 1,
        path: [...path],
        nodeFrames: path.length,
        peakNodeFrames,
        line,
        message: { pre: 'treePre', in: 'treeIn', post: 'treePost' }[type],
      })
    }
    if (type === 'pre') process()
    walk(node.left)
    if (type === 'in') process()
    walk(node.right)
    if (type === 'post') process()
    path.pop()
  }
  walk(tree.root)
  return steps
}

export function treeStats(tree) {
  function count(id) {
    if (id === null) return { size: 0, height: -1 }
    const node = tree.nodes[id]
    const left = count(node.left)
    const right = count(node.right)
    return { size: 1 + left.size + right.size, height: 1 + Math.max(left.height, right.height) }
  }
  const result = count(tree.root)
  return { ...result, levels: result.height + 1 }
}
