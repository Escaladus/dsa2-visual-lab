/** Basic boolean-visited DFS. Each snapshot owns its data so playback can safely rewind.
 * Call IDs identify stack frames; v identifies a graph vertex. Java line numbers refer to dfsCode.
 */
export function createRecursiveDfsTrace(graph, start = 0, all = false) {
  if (
    !Array.isArray(graph) ||
    graph.some(
      row =>
        !Array.isArray(row) || row.some(v => !Number.isInteger(v) || v < 0 || v >= graph.length),
    ) ||
    !Number.isInteger(start) ||
    start < 0 ||
    (graph.length ? start >= graph.length : start !== 0) ||
    typeof all !== 'boolean'
  ) {
    throw new Error('Invalid DFS graph, start or mode')
  }
  const frames = []
  const nodes = []
  const stack = []
  const pre = []
  const post = []
  const visited = Array(graph.length).fill(false)
  let returned = null
  let maxDepth = 0
  let neighborChecks = 0
  let outerChecks = 0
  let visitedSlots = 0
  // Continuations and locals need their own copies, not only a copied outer array.
  function snapshot(key, values = {}, current = null, line = null, method = 'dfs', edge = null) {
    frames.push({
      nodes: nodes.map(node => ({
        ...node,
        locals: { ...node.locals },
        continuation: node.continuation ? { ...node.continuation } : null,
        returnTo: { ...node.returnTo },
      })),
      stack: [...stack],
      visited: [...visited],
      pre: [...pre],
      post: [...post],
      current,
      line,
      method,
      edge: edge ? { ...edge } : null,
      returned: returned ? { ...returned } : null,
      maxDepth,
      neighborChecks,
      outerChecks,
      visitedSlots,
      message: { key, values },
    })
  }
  function visit(v, parent = null, driverLine = 4) {
    const id = nodes.length
    const node = {
      id,
      parent,
      n: v,
      v,
      locals: { v },
      result: null,
      status: 'active',
      continuation: null,
      returnTo:
        parent === null
          ? { method: 'traverse', line: driverLine, id: null }
          : { method: 'dfs', line: 7, id: parent, nextI: nodes[parent].locals.i + 1 },
    }
    nodes.push(node)
    stack.push(id)
    maxDepth = Math.max(maxDepth, stack.length)
    snapshot('enter', { v, call: id + 1 }, id, 1)
    visited[v] = true
    snapshot('mark', { v }, id, 2)
    pre.push(v)
    snapshot('pre', { v }, id, 3)
    // Show the final failed loop test before completing the call.
    for (let i = 0; i <= graph[v].length; i++) {
      node.locals.i = i
      delete node.locals.next
      snapshot('loop', { v, i, length: graph[v].length }, id, 4)
      if (i === graph[v].length) {
        break
      }
      const next = graph[v][i]
      node.locals.next = next
      const edge = { from: v, to: next }
      neighborChecks++
      snapshot('neighbor', { v, i, next }, id, 5, 'dfs', edge)
      snapshot(visited[next] ? 'skip' : 'check', { v, next }, id, 6, 'dfs', edge)
      if (!visited[next]) {
        // The parent resumes at the call site, then increments its saved neighbour index.
        node.status = 'waiting'
        node.continuation = { method: 'dfs', line: 7, nextLine: 4, nextI: i + 1, child: next }
        snapshot('wait', { v, next, i }, id, 7, 'dfs', edge)
        visit(next, id)
        node.status = 'active'
        node.continuation = null
        snapshot('resume', { v, next, i, nextI: i + 1 }, id, 7, 'dfs', edge)
      }
    }
    delete node.locals.i
    delete node.locals.next
    post.push(v)
    node.status = 'returning'
    snapshot('post', { v }, id, 10)
    stack.pop()
    node.status = 'done'
    returned = {
      from: id,
      to: parent,
      value: null,
      v,
      method: node.returnTo.method,
      line: node.returnTo.line,
      nextI: node.returnTo.nextI ?? null,
    }
    snapshot(
      parent === null ? 'returnRoot' : 'return',
      { v, parent: parent === null ? 'traverse' : nodes[parent].v },
      id,
      11,
    )
  }

  snapshot('ready', { start }, null, null, 'traverse')
  visitedSlots = graph.length
  snapshot('initializeVisited', {}, null, 2, 'traverse')
  snapshot('initializeOrders', {}, null, 3, 'traverse')
  if (graph.length) {
    snapshot('start', { start }, null, 4, 'traverse')
    visit(start)
    snapshot('rootResume', { v: start }, null, 4, 'traverse')
  }
  snapshot(all ? 'all' : 'reachable', {}, null, 5, 'traverse')
  if (all) {
    for (let v = 0; v < graph.length; v++) {
      outerChecks++
      snapshot('outerLoop', { v }, null, 6, 'traverse')
      snapshot(visited[v] ? 'rootSkip' : 'root', { v }, null, 7, 'traverse')
      if (!visited[v]) {
        visit(v, null, 7)
        snapshot('rootResume', { v }, null, 7, 'traverse')
      }
    }
  }
  snapshot('done', { count: pre.length, total: graph.length }, null, 10, 'traverse')
  return frames
}

/** Return the caller location on a return event, otherwise the waiting call location. */
export function dfsContinuation(step) {
  const current = step.nodes[step.current]
  if (
    ['return', 'returnRoot', 'resume', 'rootResume'].includes(step.message.key) &&
    step.returned
  ) {
    const { to, method, line, nextI } = step.returned
    return { id: to, method, line, nextI }
  }
  if (current?.continuation) {
    return { id: current.id, ...current.continuation }
  }
  return current?.returnTo ?? null
}
