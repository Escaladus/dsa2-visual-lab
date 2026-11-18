import { formatMessage } from '../i18n/index.js'

export const formatTraversalSequence = vertices => (vertices.length ? vertices.join(' → ') : '—')
export const formatTraversalValue = value => (value < 0 ? '—' : value)

/** Describe the saved caller without exposing Java line numbers in the colour-only lesson. */
export function formatTraversalContinuation(step, continuation, { colorsOnly, learning, labels }) {
  if (!continuation) {
    return null
  }
  if (colorsOnly && continuation.method !== 'dfs') {
    return null
  }
  if (continuation.method === 'traverse') {
    return formatMessage(labels.driver, continuation)
  }

  const caller = step.nodes[continuation.id]
  return formatMessage(colorsOnly ? learning.resume : labels.resume, {
    v: caller.v,
    line: continuation.line,
    i: continuation.nextI ?? '—',
  })
}

/** Completed DFS intervals are either nested (ancestor/descendant) or disjoint. */
export function formatEdgeInterval(step, edgeKey) {
  const [source, target] = edgeKey.split(':').map(Number)
  if (source === target) {
    return `u = v = ${source}; tin = ${step.tin[source]}, tout = ${step.tout[source]}`
  }

  const [earlier, later] = step.tin[source] < step.tin[target] ? [source, target] : [target, source]
  const nested = step.tout[later] < step.tout[earlier]
  if (!nested) {
    return `tout[${earlier}] = ${step.tout[earlier]} < tin[${later}] = ${step.tin[later]}`
  }

  return `tin[${earlier}] = ${step.tin[earlier]} < tin[${later}] = ${step.tin[later]} < tout[${later}] = ${step.tout[later]} < tout[${earlier}] = ${step.tout[earlier]}`
}
