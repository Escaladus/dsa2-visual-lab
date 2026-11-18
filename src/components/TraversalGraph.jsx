import { useId } from 'react'
import { traversalEdgeKey } from '../utils/graphTraversal.js'
import { formatMessage } from '../i18n/index.js'

export default function TraversalGraph({
  example,
  step,
  labels,
  classification = false,
  path = [],
}) {
  const marker = useId()
  const controlMarker = useId()
  const { graph, positions, directed } = example
  const edges = graph.flatMap((row, u) => row.filter(v => directed || u <= v).map(v => [u, v]))
  const transfer =
    step.algorithm === 'dfs' && ['return', 'resume'].includes(step.message.key)
      ? step.returned
      : null
  const parentVertex = transfer?.to != null ? step.nodes[transfer.to]?.v : null
  // Shorten paths at circle boundaries; bend reciprocal arrows so both directions stay visible.
  function geometry(u, v, bend = 0) {
    const a = positions[u]
    const b = positions[v]
    if (u === v) {
      return {
        d: `M ${a.x - 17} ${a.y - 18} C ${a.x - 55} ${a.y - 70}, ${a.x + 55} ${a.y - 70}, ${a.x + 17} ${a.y - 18}`,
        x: a.x,
        y: a.y - 48,
      }
    }
    const length = Math.hypot(b.x - a.x, b.y - a.y)
    const dx = (b.x - a.x) / length
    const dy = (b.y - a.y) / length
    const x = (a.x + b.x) / 2 - dy * bend
    const y = (a.y + b.y) / 2 + dx * bend
    return {
      d: `M ${a.x + dx * 26} ${a.y + dy * 26} Q ${x} ${y} ${b.x - dx * 29} ${b.y - dy * 29}`,
      x,
      y,
    }
  }
  return (
    <div className="dfs-graph-view traversal-graph-view">
      <svg
        className="dfs-graph traversal-graph"
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
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10Z" fill="context-stroke" />
          </marker>
          <marker
            id={controlMarker}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <path d="M0 0 L10 5 L0 10Z" fill="#8ee5c3" />
          </marker>
        </defs>
        {edges.map(([u, v]) => {
          const key = traversalEdgeKey(u, v, directed)
          const type = step.types[key]
          const focus =
            step.edge && traversalEdgeKey(step.edge.from, step.edge.to, directed) === key
          const shape = geometry(u, v, directed && graph[v].includes(u) ? 22 : 0)
          const inPath = path.some(
            (node, i) => i > 0 && traversalEdgeKey(path[i - 1], node, directed) === key,
          )
          return (
            <g key={key}>
              <path
                d={shape.d}
                className={`traversal-edge ${classification && type ? type : ''} ${focus ? 'focus' : ''} ${inPath ? 'path' : ''}`}
                data-edge={key}
                data-edge-type={type ?? ''}
                markerEnd={directed ? `url(#${marker})` : undefined}
              >
                <title>
                  {formatMessage(labels.edgeLabel, {
                    u,
                    v,
                    type: type && classification ? labels.types[type] : '—',
                  })}
                </title>
              </path>
              {classification && type && (
                <text className="traversal-edge-name" x={shape.x + 6} y={shape.y - 6}>
                  {type}
                </text>
              )}
            </g>
          )
        })}
        {parentVertex !== null && parentVertex !== undefined && (
          <path
            d={geometry(transfer.v, parentVertex, -28).d}
            className="traversal-control-return"
            markerEnd={`url(#${controlMarker})`}
            aria-label={labels.returnControl}
          >
            <title>{labels.returnControl}</title>
          </path>
        )}
        {positions.map((point, v) => (
          <g
            key={v}
            className={`traversal-vertex ${step.colors[v]} ${step.vertex === v ? 'current' : ''} ${path.includes(v) ? 'path' : ''}`}
            transform={`translate(${point.x},${point.y})`}
            data-vertex={v}
            data-color={step.colors[v]}
          >
            <title>{formatMessage(labels.vertex, { v, color: step.colors[v] })}</title>
            <circle r="23" />
            <text textAnchor="middle" dy=".35em">
              {v}
            </text>
            <text className="traversal-color-name" textAnchor="middle" y="39">
              {step.colors[v]}
            </text>
          </g>
        ))}
      </svg>
      <div className="traversal-legend">
        {['WHITE', 'GREY', 'BLACK'].map(color => (
          <span key={color} title={labels.colorHelp[color]}>
            <i className={`traversal-dot ${color}`} />
            {color}
          </span>
        ))}
        <span>
          <i className="traversal-dot current" />
          {labels.current}
        </span>
        {path.length > 0 && (
          <span>
            <i className="traversal-dot path" />
            {labels.selectedPath}
          </span>
        )}
      </div>
      <p className="dfs-edge-caption">
        {parentVertex !== null && parentVertex !== undefined
          ? labels.returnControl
          : step.edge
            ? `${step.edge.from} ${directed ? '→' : '—'} ${step.edge.to}`
            : '—'}
      </p>
    </div>
  )
}
