import { useEffect, useId, useRef, useState } from 'react'
import { dfsContinuation } from '../utils/recursiveDfs.js'
import {
  dfsCallName as callName,
  formatDfsContinuation as resumeText,
} from '../utils/recursiveDfsPresentation.js'
import { formatMessage } from '../i18n/index.js'
import RecursionTabs from './RecursionTabs.jsx'

export default function BasicDfsSummary({ frames, index, labels, common, tracing }) {
  const id = useId()
  const scroll = useRef(null)
  const [panel, setPanel] = useState('context')
  const step = frames[index]
  const next = frames[index + 1]
  const current = step.nodes[step.current]
  const resume = resumeText(step, dfsContinuation(step), labels)
  const transfer = ['return', 'returnRoot', 'resume', 'rootResume'].includes(step.message.key)
    ? step.returned
    : null
  useEffect(() => {
    scroll.current.scrollTop = 0
  }, [step])
  return (
    <div className="recursion-step-summary" data-summary-panel={panel} ref={scroll}>
      <RecursionTabs
        id={id}
        tabs={['context', 'event'].map(key => [key, tracing[key]])}
        value={panel}
        onChange={setPanel}
        label={tracing.summary}
        className="recursion-summary-tabs"
      />
      <div
        className="recursion-summary-event"
        id={`${id}-event`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-event`}
      >
        <p className="recursion-step-message" role="status">
          {formatMessage(labels.messages[step.message.key], step.message.values)}
        </p>
        {transfer && (
          <div className="recursion-return-bridge active">
            <div className="recursion-return-flow">
              <code>{callName(step.nodes[transfer.from])}</code>
              <b>↩</b>
              {transfer.to === null ? (
                <code>traverse</code>
              ) : (
                <code>{callName(step.nodes[transfer.to])}</code>
              )}
            </div>
            <p>{labels.control}</p>
          </div>
        )}
      </div>
      <dl
        className="recursion-step-context"
        id={`${id}-context`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-context`}
      >
        <div>
          <dt>{tracing.now}</dt>
          <dd>
            <code>{current ? callName(current) : 'traverse'}</code>
            {current && (
              <span className="recursion-context-status"> · {common[current.status]}</span>
            )}
            <code className="recursion-context-locals">
              {current
                ? Object.entries(current.locals)
                    .map(([name, value]) => `${name} = ${value}`)
                    .join(' · ')
                : step.message.values.v !== undefined
                  ? `v = ${step.message.values.v}`
                  : '—'}
            </code>
          </dd>
        </div>
        <div>
          <dt>{tracing.resume}</dt>
          <dd>{resume ?? (step.message.key === 'done' ? tracing.finished : '—')}</dd>
        </div>
        <div>
          <dt>{tracing.next}</dt>
          <dd className="recursion-context-next">
            {next
              ? formatMessage(labels.messages[next.message.key], next.message.values)
              : tracing.finished}
          </dd>
        </div>
      </dl>
    </div>
  )
}
