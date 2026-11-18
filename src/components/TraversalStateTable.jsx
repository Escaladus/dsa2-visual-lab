import { classifyTraversalCode } from '../data/graphTraversal.js'
import {
  formatEdgeInterval,
  formatTraversalValue as value,
} from '../utils/graphTraversalPresentation.js'

export default function TraversalStateTable({ step, labels, colorsOnly, mode, example, complete }) {
  return (
    <>
      <h3 className="traversal-section-title">{labels.state}</h3>
      <div
        className="table-wrap traversal-state-table"
        tabIndex={0}
        role="region"
        aria-label={labels.state}
      >
        <table>
          <thead>
            <tr>
              {labels.columns.slice(0, colorsOnly ? 2 : mode === 'dfs' ? 8 : 6).map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {step.colors.map((color, v) => (
              <tr
                key={v}
                data-state-vertex={v}
                aria-current={step.vertex === v ? 'true' : undefined}
              >
                <th>{v}</th>
                <td>
                  <span className={`traversal-state-badge ${color}`}>{color}</span>
                </td>
                {!colorsOnly && (
                  <>
                    {[step.parent[v], step.root[v], step.depth[v]].map((n, i) => (
                      <td key={i}>{value(n)}</td>
                    ))}
                    <td>{step.distance[v] < 0 ? '∞' : step.distance[v]}</td>
                    {mode === 'dfs' && (
                      <>
                        <td>{step.tin[v] || '—'}</td>
                        <td>{step.tout[v] || '—'}</td>
                      </>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!colorsOnly && (
        <p className="recursion-note">
          {labels.distanceNote} {mode === 'dfs' && labels.partialTimes}
        </p>
      )}
      {!colorsOnly && mode === 'dfs' && (
        <details className="traversal-details">
          <summary>{labels.edgeTypes}</summary>
          <div className="traversal-edge-list">
            {Object.entries(step.types).map(([edge, kind]) => (
              <p key={edge} data-edge-result={edge}>
                <code>{edge.replace(':', example.directed ? ' → ' : ' — ')}</code> —{' '}
                {labels.types[kind]}
                {complete && (
                  <small className="traversal-interval-proof">
                    {labels.intervals}: <code>{formatEdgeInterval(step, edge)}</code>
                  </small>
                )}
              </p>
            ))}
          </div>
          <p>{labels.lessons[4][1]}</p>
          <details>
            <summary>{labels.helpers}</summary>
            <pre className="code-block">
              <code>{classifyTraversalCode}</code>
            </pre>
          </details>
        </details>
      )}
    </>
  )
}
