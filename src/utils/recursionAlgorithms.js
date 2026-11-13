import { recursionExamples } from '../data/recursion.js'

export function createRecursionTrace(kind, input) {
  if (!Object.hasOwn(recursionExamples, kind) || !Number.isInteger(input) || input < 0 || input > recursionExamples[kind].max) throw new Error('Invalid recursion example or input')
  const frames = [], nodes = [], stack = []
  let result = null, returned = null, maxDepth = 0
  const snapshot = (key, values = {}, current = null, line = null) => frames.push({
    nodes: nodes.map(node => ({ ...node, locals: { ...node.locals } })), stack: [...stack], current, line,
    message: { key, values }, result, returned: returned ? { ...returned } : null, maxDepth,
  })
  snapshot('ready', { fn: kind, n: input })

  function visit(n, parent = null) {
    const id = nodes.length
    const node = { id, parent, n, status: 'active', result: null, locals: { n } }
    nodes.push(node)
    stack.push(id)
    maxDepth = Math.max(maxDepth, stack.length)
    snapshot('enter', { fn: kind, n, call: id + 1 }, id, 1)
    snapshot('testBase', { n }, id, 2)
    if (n <= 1) {
      node.result = kind === 'factorial' ? 1 : n
      node.status = 'returning'
      snapshot('base', { fn: kind, n, value: node.result }, id, 2)
    } else if (kind === 'factorial') {
      node.status = 'waiting'
      node.locals.child = null
      snapshot('waitFactorial', { n, next: n - 1 }, id, 3)
      node.locals.child = visit(n - 1, id)
      node.status = 'active'
      snapshot('receiveFactorial', { n, value: node.locals.child }, id, 3)
      node.result = n * node.locals.child
      node.status = 'returning'
      snapshot('multiply', { n, child: node.locals.child, value: node.result }, id, 4)
    } else {
      node.status = 'waiting'
      node.locals.left = null
      snapshot('waitLeft', { n, next: n - 1 }, id, 3)
      node.locals.left = visit(n - 1, id)
      node.status = 'active'
      snapshot('receiveLeft', { n, value: node.locals.left }, id, 3)
      node.status = 'waiting'
      node.locals.right = null
      snapshot('waitRight', { n, next: n - 2, left: node.locals.left }, id, 4)
      node.locals.right = visit(n - 2, id)
      node.status = 'active'
      snapshot('receiveRight', { n, value: node.locals.right }, id, 4)
      node.result = node.locals.left + node.locals.right
      node.status = 'returning'
      snapshot('add', { left: node.locals.left, right: node.locals.right, value: node.result }, id, 5)
    }
    stack.pop()
    node.status = 'done'
    returned = { from: id, to: parent, value: node.result }
    snapshot(parent === null ? 'returnRoot' : 'return', { fn: kind, n, value: node.result }, id, n <= 1 ? 2 : kind === 'factorial' ? 4 : 5)
    return node.result
  }

  result = visit(input)
  snapshot('done', { fn: kind, n: input, value: result })
  return frames
}

export function recursionTreeLayout(nodes) {
  const children = new Map(nodes.map(node => [node.id, []]))
  for (const node of nodes) if (node.parent !== null) children.get(node.parent).push(node.id)
  const positions = {}, depths = {}
  let leaves = 0
  function place(id, depth) {
    depths[id] = depth
    const nested = children.get(id)
    for (const child of nested) place(child, depth + 1)
    positions[id] = { x: nested.length ? (positions[nested[0]].x + positions[nested.at(-1)].x) / 2 : 44 + 84 * leaves++, y: 45 + 112 * depth }
  }
  if (nodes.length) place(nodes[0].id, 0)
  const width = Math.max(320, leaves * 84 + 4)
  const offset = (width - (leaves * 84 + 4)) / 2
  for (const position of Object.values(positions)) position.x += offset
  return { positions, width, height: 108 + 112 * Math.max(0, ...Object.values(depths)) }
}
