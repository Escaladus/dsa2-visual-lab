import { traversalLine } from '../data/graphTraversal.js'

export const vertexColors = ['WHITE', 'GREY', 'BLACK']
// State holds colour, parent, root, depth, distance, tin and tout arrays.
const SHARED_ARRAY_COUNT = 7

/** Both adjacency records of an undirected edge must share one classification. */
export const traversalEdgeKey = (u, v, directed) => (directed || u <= v ? `${u}:${v}` : `${v}:${u}`)

export function orderedTraversalGraph(graph, reverse = false) {
  return graph.map(row => [...row].sort((a, b) => (reverse ? b - a : a - b)))
}

function validateTraversalInput(input, { algorithm, start, all, directed, reverse }) {
  if (
    !Array.isArray(input) ||
    input.some(
      row =>
        !Array.isArray(row) ||
        new Set(row).size !== row.length ||
        row.some(v => !Number.isInteger(v) || v < 0 || v >= input.length),
    ) ||
    !['dfs', 'bfs'].includes(algorithm) ||
    !Number.isInteger(start) ||
    start < 0 ||
    (input.length ? start >= input.length : start !== 0) ||
    [all, directed, reverse].some(value => typeof value !== 'boolean')
  ) {
    throw new Error('Invalid traversal input')
  }
  if (!directed && input.some((row, u) => row.some(v => !input[v].includes(u)))) {
    throw new Error('Undirected adjacency must be symmetric')
  }
}

/**
 * Build a complete, rewindable execution before playback starts.
 * `current` identifies a call frame; `vertex` identifies a graph vertex.
 * A parent/root/distance of -1 is unknown; a timestamp of 0 has not occurred yet.
 * The history stores copies and is not part of the algorithm's working-memory bound.
 */
export function createGraphTraversalTrace(
  input,
  { algorithm = 'dfs', start = 0, all = false, directed = false, reverse = false } = {},
) {
  validateTraversalInput(input, { algorithm, start, all, directed, reverse })
  const graph = orderedTraversalGraph(input, reverse)
  const count = graph.length
  const frames = []
  const nodes = []
  const stack = []
  const queue = []
  const colors = Array(count).fill('WHITE')
  const parent = Array(count).fill(-1)
  const root = Array(count).fill(-1)
  const depth = Array(count).fill(-1)
  const distance = Array(count).fill(-1)
  const tin = Array(count).fill(0)
  const tout = Array(count).fill(0)
  const pre = []
  const post = []
  const removed = []
  const types = {}
  const cycle = []
  let clock = 0
  let neighborChecks = 0
  let outerChecks = 0
  let maxDepth = 0
  let returned = null
  let vertex = null
  let locals = {}
  let allocated = false
  const line = (method, source) => (source === null ? null : traversalLine(method, source))
  // Copy nested locals/continuations as well as arrays: later calls must not mutate old steps.
  function snapshot(
    key,
    values = {},
    current = null,
    method = algorithm,
    source = null,
    edge = null,
  ) {
    frames.push({
      algorithm,
      start,
      all,
      directed,
      reverse,
      nodes: nodes.map(node => ({
        ...node,
        locals: { ...node.locals },
        returnTo: { ...node.returnTo },
        continuation: node.continuation ? { ...node.continuation } : null,
      })),
      stack: [...stack],
      queue: [...queue],
      colors: [...colors],
      visited: colors.map(color => color !== 'WHITE'),
      parent: [...parent],
      root: [...root],
      depth: [...depth],
      distance: [...distance],
      tin: [...tin],
      tout: [...tout],
      clock,
      pre: [...pre],
      post: [...post],
      removed: [...removed],
      types: { ...types },
      cycle: [...cycle],
      current,
      vertex,
      locals: { ...locals },
      method,
      line: line(method, source),
      edge: edge ? { ...edge } : null,
      returned: returned ? { ...returned } : null,
      maxDepth,
      neighborChecks,
      outerChecks,
      colorSlots: allocated ? count : 0,
      metadataSlots: allocated ? count * SHARED_ARRAY_COUNT : 0,
      message: { key, values },
    })
  }
  // Related metadata assignments form one teaching event, located at its first Java statement.
  function initializeRoot(v) {
    root[v] = v
    depth[v] = 0
    distance[v] = v === start ? 0 : -1
  }
  function discoverChild(v, next) {
    parent[next] = v
    root[next] = root[v]
    depth[next] = depth[v] + 1
    distance[next] = root[v] === start ? depth[next] : -1
  }
  function classifyVisitedEdge(v, next) {
    const key = traversalEdgeKey(v, next, directed)
    if (types[key]) {
      return types[key]
    }
    let type
    if (!directed || colors[next] === 'GREY') {
      type = 'back'
    } else if (tin[v] < tin[next]) {
      type = 'forward'
    } else {
      type = 'cross'
    }
    // Follow the active ancestor chain to retain one explicit cycle witness.
    if (type === 'back' && !cycle.length) {
      const branch = []
      for (let x = v; x !== next; x = parent[x]) {
        branch.push(x)
      }
      cycle.push(next, ...branch.reverse(), next)
    }
    return type
  }
  const driverStart = 'if (graph.length > 0)'
  const driverRoot = 'if (state.color[v] == WHITE)'
  function dfs(v, parentCall = null, driverSource = driverStart) {
    const id = nodes.length
    const callLine = line('dfs', 'dfs(graph, next, state);')
    const loopLine = line('dfs', 'for (int i')
    const node = {
      id,
      parent: parentCall,
      n: v,
      v,
      locals: { v },
      status: 'active',
      result: null,
      continuation: null,
      returnTo:
        parentCall === null
          ? { id: null, method: 'traverse', line: line('traverse', driverSource) }
          : {
              id: parentCall,
              method: 'dfs',
              line: callLine,
              nextI: nodes[parentCall].locals.i + 1,
            },
    }
    nodes.push(node)
    stack.push(id)
    maxDepth = Math.max(maxDepth, stack.length)
    vertex = v
    snapshot('enter', { v, call: id + 1 }, id, 'dfs', 'static void dfs')
    if (parent[v] < 0) {
      initializeRoot(v)
      snapshot('rootSetup', { v }, id, 'dfs', 'if (state.parent[v] < 0)')
    }
    colors[v] = 'GREY'
    snapshot('mark', { v }, id, 'dfs', 'state.color[v] = GREY;')
    tin[v] = ++clock
    snapshot('stamp', { v, time: clock }, id, 'dfs', 'state.tin[v]')
    pre.push(v)
    snapshot('pre', { v }, id, 'dfs', 'state.pre.add(v)')
    // Include the final failed loop test as an instructional step before POST.
    for (let i = 0; i <= graph[v].length; i++) {
      node.locals.i = i
      delete node.locals.next
      vertex = v
      snapshot('loop', { v, i, length: graph[v].length }, id, 'dfs', 'for (int i')
      if (i === graph[v].length) {
        break
      }
      const next = graph[v][i]
      const edge = { from: v, to: next }
      node.locals.next = next
      neighborChecks++
      snapshot('neighbor', { v, i, next }, id, 'dfs', 'int next =', edge)
      snapshot(
        colors[next] === 'WHITE' ? 'check' : 'seen',
        { v, next, color: colors[next] },
        id,
        'dfs',
        'if (state.color[next] == WHITE)',
        edge,
      )
      if (colors[next] === 'WHITE') {
        discoverChild(v, next)
        snapshot('adopt', { v, next }, id, 'dfs', 'state.parent[next] =', edge)
        types[traversalEdgeKey(v, next, directed)] = 'tree'
        snapshot(
          'edgeType',
          { v, next, kind: 'tree', sourceTin: tin[v], targetTin: tin[next] },
          id,
          'dfs',
          'state.types.put(',
          edge,
        )
        // Save this caller's i; the recursive child owns a different loop variable.
        node.status = 'waiting'
        node.continuation = {
          method: 'dfs',
          line: callLine,
          nextLine: loopLine,
          nextI: i + 1,
          child: next,
        }
        snapshot('wait', { v, next, i }, id, 'dfs', 'dfs(graph, next, state);', edge)
        dfs(next, id)
        vertex = v
        node.status = 'active'
        node.continuation = null
        snapshot(
          'resume',
          { v, next, i, nextI: i + 1 },
          id,
          'dfs',
          'dfs(graph, next, state);',
          edge,
        )
      } else if (!directed && parent[v] === next) {
        snapshot('parentEdge', { v, next }, id, 'dfs', '} else if (!state.directed', edge)
      } else {
        const known = Object.hasOwn(types, traversalEdgeKey(v, next, directed))
        const type = classifyVisitedEdge(v, next)
        types[traversalEdgeKey(v, next, directed)] ??= type
        snapshot(
          known ? 'edgeKnown' : 'edgeType',
          { v, next, kind: type, sourceTin: tin[v], targetTin: tin[next] },
          id,
          'dfs',
          'state.types.putIfAbsent',
          edge,
        )
      }
    }
    delete node.locals.i
    delete node.locals.next
    post.push(v)
    node.status = 'returning'
    snapshot('post', { v }, id, 'dfs', 'state.post.add(v)')
    tout[v] = ++clock
    snapshot('finishTime', { v, time: clock }, id, 'dfs', 'state.tout[v]')
    colors[v] = 'BLACK'
    snapshot('black', { v }, id, 'dfs', 'state.color[v] = BLACK')
    stack.pop()
    node.status = 'done'
    returned = { from: id, to: parentCall, value: null, v, ...node.returnTo }
    // returnTo.id identifies the caller, not the returning frame.
    returned.to = parentCall
    snapshot(
      parentCall === null ? 'returnRoot' : 'return',
      { v, parent: parentCall === null ? 'traverse' : nodes[parentCall].v },
      id,
      'dfs',
      '    state.color[v] = BLACK',
    )
    frames.at(-1).line = dfsEndLine
  }
  // The closing method brace is the return point for this void method.
  const dfsEndLine = traversalLine('dfs', 'state.color[v] = BLACK') + 1
  function bfs(v) {
    vertex = v
    locals = {}
    initializeRoot(v)
    snapshot('rootSetup', { v }, null, 'bfs', 'state.root[start]')
    snapshot('queueInit', {}, null, 'bfs', 'ArrayDeque<Integer>')
    colors[v] = 'GREY'
    snapshot('bfsMark', { v }, null, 'bfs', 'state.color[start] = GREY')
    pre.push(v)
    snapshot('discover', { v }, null, 'bfs', 'state.discovered.add(start)')
    queue.push(v)
    snapshot('enqueue', { v }, null, 'bfs', 'queue.add(start)')
    while (queue.length) {
      // Dequeue does not finish processing: keep GREY until the last neighbour is examined.
      v = queue.shift()
      vertex = v
      locals = { v }
      snapshot('dequeue', { v }, null, 'bfs', 'int v = queue.remove()')
      removed.push(v)
      snapshot('removeOrder', { v }, null, 'bfs', 'state.removed.add(v)')
      for (let i = 0; i <= graph[v].length; i++) {
        locals = { v, i }
        snapshot('loop', { v, i, length: graph[v].length }, null, 'bfs', 'for (int i')
        if (i === graph[v].length) {
          break
        }
        const next = graph[v][i]
        const edge = { from: v, to: next }
        locals.next = next
        neighborChecks++
        snapshot('neighbor', { v, i, next }, null, 'bfs', 'int next =', edge)
        if (colors[next] !== 'WHITE') {
          snapshot(
            'bfsSkip',
            { v, next, color: colors[next] },
            null,
            'bfs',
            'if (state.color[next] != WHITE)',
            edge,
          )
          continue
        }
        snapshot('check', { v, next }, null, 'bfs', 'if (state.color[next] != WHITE)', edge)
        colors[next] = 'GREY'
        snapshot('bfsMark', { v: next }, null, 'bfs', 'state.color[next] = GREY', edge)
        discoverChild(v, next)
        snapshot('adopt', { v, next }, null, 'bfs', 'state.parent[next] =', edge)
        pre.push(next)
        snapshot('discover', { v: next }, null, 'bfs', 'state.discovered.add(next)', edge)
        queue.push(next)
        snapshot('enqueue', { v: next }, null, 'bfs', 'queue.add(next)', edge)
      }
      locals = { v }
      post.push(v)
      snapshot('processed', { v }, null, 'bfs', 'state.completed.add(v)')
      colors[v] = 'BLACK'
      snapshot('black', { v }, null, 'bfs', 'state.color[v] = BLACK')
    }
    vertex = null
    locals = {}
  }
  function visitRoot(v, source) {
    snapshot('startRoot', { v }, null, 'traverse', source)
    if (algorithm === 'dfs') {
      dfs(v, null, source)
    } else {
      bfs(v)
    }
    vertex = null
    locals = {}
    snapshot('rootResume', { v }, null, 'traverse', source)
  }
  snapshot('ready', { start }, null, 'traverse')
  allocated = true
  snapshot('init', {}, null, 'traverse', 'State state =')
  if (count) {
    visitRoot(start, driverStart)
  }
  if (all) {
    for (let v = 0; v < count; v++) {
      outerChecks++
      snapshot('outerLoop', { v }, null, 'traverse', 'for (int v')
      if (colors[v] === 'WHITE') {
        visitRoot(v, driverRoot)
      } else {
        snapshot('rootSkip', { v }, null, 'traverse', driverRoot)
      }
    }
  }
  vertex = null
  locals = {}
  snapshot('done', { count: pre.length, total: count }, null, 'traverse', 'return state;')
  return frames
}

export function traversalPath(step, target) {
  // A later forest root is still unreachable from the originally selected start.
  if (
    !Number.isInteger(target) ||
    target < 0 ||
    target >= step.parent.length ||
    step.root[target] !== step.start
  ) {
    return []
  }
  const result = []
  for (let v = target; v !== -1; v = step.parent[v]) {
    result.push(v)
  }
  return result.reverse()
}

export function traversalTopological(step) {
  if (step.algorithm !== 'dfs' || !step.directed) {
    return { reason: 'directedDfs', order: [] }
  }
  if (step.cycle.length) {
    return { reason: 'cycle', order: [] }
  }
  if (step.colors.some(color => color !== 'BLACK')) {
    return { reason: 'full', order: [] }
  }
  return { reason: null, order: [...step.post].reverse() }
}

export function traversalContinuation(step) {
  if (
    ['return', 'returnRoot', 'resume', 'rootResume'].includes(step.message.key) &&
    step.returned
  ) {
    return {
      id: step.returned.to,
      method: step.returned.method,
      line: step.returned.line,
      nextI: step.returned.nextI,
    }
  }
  const node = step.nodes[step.current]
  return node?.continuation ? { id: node.id, ...node.continuation } : (node?.returnTo ?? null)
}
