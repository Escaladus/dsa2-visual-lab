import { useId } from 'react'
import { formatMessage } from '../i18n/index.js'

// The dashed arrow shows control returning to a caller, not a new physical graph edge.
export default function BasicDfsGraph({ example, step, labels }) {
  const marker = useId()
  const { graph, positions } = example
  const vertex = step.nodes[step.current]?.v ?? step.message.values.v ?? step.message.values.start
  const edges = graph.flatMap((neighbors, v) =>
    neighbors.filter(next => v < next).map(next => [v, next]),
  )
  const transfer = ['return', 'resume'].includes(step.message.key) ? step.returned : null
  const from = transfer && positions[transfer.v]
  const to = transfer?.to != null && positions[step.nodes[transfer.to].v]
  let arrow
  if (to) {
    const distance = Math.hypot(to.x - from.x, to.y - from.y)
    const along = part => ({
      x: from.x + (to.x - from.x) * part,
      y: from.y + (to.y - from.y) * part,
    })
    arrow = { start: along(25 / distance), end: along(1 - 28 / distance) }
  }
  return (
    <div className="dfs-graph-view">
      <svg
        className="dfs-graph"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={labels.graphLabel}
      >
        <defs>
          <marker
            id={marker}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-2)" />
          </marker>
        </defs>
        {edges.map(([v, next]) => {
          const focus =
            step.edge && [v, next].includes(step.edge.from) && [v, next].includes(step.edge.to)
          return (
            <line
              key={`${v}-${next}`}
              data-edge={`${v}-${next}`}
              className={`dfs-edge ${focus ? 'focus' : ''}`}
              x1={positions[v].x}
              y1={positions[v].y}
              x2={positions[next].x}
              y2={positions[next].y}
            />
          )
        })}
        {arrow && (
          <line
            className="dfs-return-arrow"
            strokeDasharray="7 5"
            aria-label={labels.control}
            x1={arrow.start.x}
            y1={arrow.start.y}
            x2={arrow.end.x}
            y2={arrow.end.y}
            markerEnd={`url(#${marker})`}
          />
        )}
        {positions.map((point, v) => (
          <g
            key={v}
            data-vertex={v}
            data-visited={step.visited[v]}
            className={`dfs-vertex ${step.visited[v] ? 'visited' : ''} ${step.post.includes(v) ? 'finished' : ''} ${vertex === v ? 'current' : ''}`}
            transform={`translate(${point.x},${point.y})`}
          >
            <title>
              {formatMessage(labels.visitedEntry, { v, value: String(step.visited[v]) })}
            </title>
            <circle r="22" />
            <text textAnchor="middle" dy=".35em">
              {v}
            </text>
            {step.post.includes(v) && (
              <text className="dfs-finished-mark" x="18" y="-18" aria-hidden="true">
                ✓
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="dfs-legend">
        <span>
          <i className="legend-dot current" />
          {labels.active}
        </span>
        <span>
          <i className="legend-dot visited" />
          {labels.discovered}
        </span>
        <span>✓ {labels.finished}</span>
      </div>
      <p className="dfs-edge-caption">
        {arrow
          ? formatMessage(labels.returnEdge, { from: transfer.v, to: step.nodes[transfer.to].v })
          : step.edge
            ? formatMessage(labels.edge, step.edge)
            : '—'}
      </p>
    </div>
  )
}
