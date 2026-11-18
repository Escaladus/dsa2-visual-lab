import { useEffect, useRef } from 'react'
import { formatMessage } from '../i18n/index.js'
export default function TraversalFrontier({ id, step, mode, labels, common, colorsOnly, panel }) {
  // Each call owns its locals. The graph's colour arrays are shared across calls.
  const stackScroll = useRef(null)
  useEffect(() => {
    if (stackScroll.current) {
      stackScroll.current.scrollTop = 0
    }
  }, [step.stack.at(-1), panel])
  return (
    <section
      className="recursion-panel recursion-stack-panel"
      id={`${id}-stack`}
      role="tabpanel"
      aria-labelledby={`${id}-tab-stack`}
    >
      <h3>{mode === 'dfs' ? labels.stack : labels.queue}</h3>
      <div className="recursion-stack" ref={stackScroll}>
        {mode === 'dfs' ? (
          <>
            {[...step.stack].reverse().map(callId => {
              const node = step.nodes[callId]
              return (
                <div
                  key={callId}
                  className={`recursion-stack-card ${node.status}`}
                  data-call-id={callId}
                >
                  <div>
                    <strong>
                      dfs({node.v}) #{node.id + 1}
                    </strong>
                    <span>{common[node.status]}</span>
                  </div>
                  <code>
                    {Object.entries(node.locals)
                      .map(([k, v]) => `${k} = ${v}`)
                      .join(' · ')}
                  </code>
                  {node.continuation && !colorsOnly && (
                    <small>
                      {formatMessage(labels.resume, {
                        v: node.v,
                        line: node.continuation.line,
                        i: node.continuation.nextI,
                      })}
                    </small>
                  )}
                </div>
              )
            })}
            {!step.stack.length && <p className="recursion-empty">{common.stackEmpty}</p>}
          </>
        ) : (
          <>
            <p className="traversal-queue-current">
              {labels.current}: <strong>{step.vertex ?? '—'}</strong>{' '}
              {step.vertex !== null && step.colors[step.vertex]}
            </p>
            <div className="traversal-queue">
              <small>{labels.queueFront} →</small>
              {step.queue.map(v => (
                <span key={v} data-queued={v}>
                  {v}
                </span>
              ))}
              {!step.queue.length && <em>{labels.empty}</em>}
              <small>→ {labels.queueBack}</small>
            </div>
            <code>
              {Object.entries(step.locals)
                .map(([k, v]) => `${k} = ${v}`)
                .join(' · ')}
            </code>
            <p className="recursion-note">{labels.lessons[2][1]}</p>
          </>
        )}
      </div>
    </section>
  )
}
