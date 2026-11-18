import { traversalPath, traversalTopological } from '../utils/graphTraversal.js'
import {
  formatTraversalSequence as sequence,
  formatTraversalValue as value,
} from '../utils/graphTraversalPresentation.js'

export default function TraversalPractice({
  step,
  labels,
  ui,
  example,
  complete,
  mode,
  task,
  path,
  traces,
  target,
  onTargetChange,
  onLaunch,
}) {
  const roots = [...new Set(step.root.filter(vertex => vertex >= 0))]
  const topo = traversalTopological(step)
  return (
    <>
      <div className="traversal-target">
        <label>
          {labels.target}
          <select value={target} onChange={e => onTargetChange(Number(e.target.value))}>
            {example.graph.map((_, v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
      <details className="traversal-details traversal-comparison">
        <summary>{labels.comparison}</summary>
        <p>{labels.fullResults}</p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{ui.algorithm}</th>
                <th>{labels.discoveryOrder}</th>
                <th>{labels.parents}</th>
                <th>{labels.path}</th>
                <th>{labels.pathLength}</th>
                <th>{labels.distance}</th>
              </tr>
            </thead>
            <tbody>
              {['dfs', 'bfs'].map(algorithm => {
                const final = traces[algorithm].at(-1)
                const completedPath = traversalPath(final, target)
                return (
                  <tr key={algorithm} data-comparison={algorithm}>
                    <th>{algorithm.toUpperCase()}</th>
                    <td>{sequence(final.pre)}</td>
                    <td>{final.parent.map((n, v) => `${v}:${value(n)}`).join(' · ')}</td>
                    <td>{completedPath.length ? sequence(completedPath) : labels.unreachable}</td>
                    <td>{completedPath.length ? completedPath.length - 1 : '∞'}</td>
                    <td>{final.distance.map(n => (n < 0 ? '∞' : n)).join(', ')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
      <details className="traversal-details traversal-applications">
        <summary>{labels.applications}</summary>
        <div className="traversal-task-grid">
          {Object.entries(labels.tasks).map(([key, [title, body]]) => (
            <section key={key}>
              <h4>{title}</h4>
              <p>{body}</p>
              <button onClick={() => onLaunch(key)} data-task={key}>
                {labels.launch}
              </button>
            </section>
          ))}
        </div>
      </details>
      <section className="traversal-result" aria-label={labels.result}>
        <h3>{labels.result}</h3>
        {!complete ? (
          <p>{labels.finishFirst}</p>
        ) : (
          <>
            {['reach', 'shortest'].includes(task) && (
              <p>
                {labels.path}: <strong>{path.length ? sequence(path) : labels.unreachable}</strong>
                {path.length > 0 && ` · ${labels.pathLength}: ${path.length - 1}`}
              </p>
            )}
            {task === 'components' && (
              <>
                <h4>{example.directed ? labels.forest : labels.components}</h4>
                {roots.map(r => (
                  <p key={r}>
                    {r}: {step.root.flatMap((root, v) => (root === r ? [v] : [])).join(', ')}
                  </p>
                ))}
              </>
            )}
            {task === 'cycle' && (
              <p>
                {step.cycle.length
                  ? `${labels.cycle}: ${sequence(step.cycle)}`
                  : mode === 'dfs' && step.colors.every(c => c === 'BLACK')
                    ? labels.noCycle
                    : labels.cycleUnknown}
              </p>
            )}
            {task === 'topological' && (
              <p>
                {topo.reason
                  ? labels.topoReasons[topo.reason]
                  : `${labels.topological}: ${sequence(topo.order)}`}
              </p>
            )}
          </>
        )}
      </section>
    </>
  )
}
