import { formatMessage } from '../i18n/index.js'

export const dfsCallName = node => `dfs(${node.v}) #${node.id + 1}`

/** A void DFS returns control to a saved caller location, rather than a numeric value. */
export function formatDfsContinuation(step, continuation, labels) {
  if (!continuation) {
    return null
  }
  if (continuation.method === 'traverse') {
    return formatMessage(labels.resumeDriver, continuation)
  }
  const node = step.nodes[continuation.id]
  return formatMessage(labels.resumeDfs, { v: node.v, call: node.id + 1, i: continuation.nextI })
}
