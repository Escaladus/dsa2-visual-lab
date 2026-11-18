// Unit-cost model for the shown Java long/array operations. These are counts,
// not measured execution times or JVM byte sizes.
export function recursionGrowth(n) {
  if (!Number.isInteger(n) || n < 0 || n > 20) {
    throw new Error('Growth input must be an integer from 0 to 20')
  }
  let previous = 1
  let calls = 1
  for (let i = 2; i <= n; i++) {
    ;[previous, calls] = [calls, 1 + previous + calls]
  }
  const peak = Math.max(1, n)
  return [
    { id: 'factorial', calls: Math.max(1, n), peak, cacheSlots: 0 },
    { id: 'fibonacci', calls, peak, cacheSlots: 0 },
    { id: 'memoized', calls: n <= 1 ? 1 : 2 * n - 1, peak, cacheSlots: n + 1 },
  ]
}

export function recursionMetrics(step, n, memoized = false) {
  const metrics = {
    calls: step.nodes.length,
    active: step.stack.length,
    peak: step.maxDepth,
    repeated: step.nodes.length - new Set(step.nodes.map(node => node.n)).size,
  }
  if (memoized) {
    Object.assign(metrics, {
      cacheEntries: Object.keys(step.cache).length,
      cacheSlots: n + 1,
      cacheHits: step.cacheHits,
    })
  }
  return metrics
}

export function dfsMetrics(step) {
  return {
    calls: step.nodes.length,
    active: step.stack.length,
    peak: step.maxDepth,
    reached: step.visited.filter(Boolean).length,
    neighborChecks: step.neighborChecks,
    outerChecks: step.outerChecks,
    visitedSlots: step.visitedSlots,
    resultEntries: step.pre.length + step.post.length,
  }
}

export function dfsWorkSummary(graph, finalStep) {
  return {
    vertices: graph.length,
    adjacency: graph.reduce((sum, row) => sum + row.length, 0),
    reached: finalStep.pre.length,
    scanned: finalStep.neighborChecks,
    outer: finalStep.outerChecks,
    slots: finalStep.visitedSlots,
  }
}
