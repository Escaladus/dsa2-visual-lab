import { useState } from 'react'
import { formatMessage } from '../i18n/index.js'
import RecursionTabs from './RecursionTabs.jsx'
export default function TraversalStepSummary({
  id,
  step,
  frames,
  index,
  example,
  labels,
  tracing,
  mode,
  classification,
  type,
  local,
  caption,
  eventText,
  colorsOnly,
}) {
  const [summaryPanel, setSummaryPanel] = useState(colorsOnly ? 'event' : 'context')
  return (
    <div
      className="recursion-step-summary traversal-step-summary"
      data-summary-panel={summaryPanel}
    >
      <RecursionTabs
        id={`${id}-summary`}
        tabs={['context', 'event'].map(key => [key, tracing[key]])}
        value={summaryPanel}
        onChange={setSummaryPanel}
        label={tracing.summary}
        className="recursion-summary-tabs"
      />
      <div
        className="recursion-summary-event"
        id={`${id}-summary-event`}
        role="tabpanel"
        aria-labelledby={`${id}-summary-tab-event`}
      >
        <p className="recursion-step-message" role="status">
          {eventText(step)}
        </p>
        {classification && type && mode === 'dfs' && step.message.key === 'edgeType' && (
          <p className="traversal-edge-rule">
            <strong>{labels.types[type]}</strong> · {labels.rule[type]}
          </p>
        )}
      </div>
      <dl
        className="recursion-step-context"
        id={`${id}-summary-context`}
        role="tabpanel"
        aria-labelledby={`${id}-summary-tab-context`}
      >
        <div>
          <dt>{labels.now}</dt>
          <dd>
            <code>
              {local && Object.keys(local).length
                ? Object.entries(local)
                    .map(([k, v]) => `${k} = ${v}`)
                    .join(' · ')
                : step.method}
            </code>
          </dd>
        </div>
        <div>
          <dt>{labels.continuation}</dt>
          <dd>{caption ?? '—'}</dd>
        </div>
        <div>
          <dt>{labels.next}</dt>
          <dd>
            {frames[index + 1]
              ? eventText(frames[index + 1])
              : formatMessage(labels.messages.done, {
                  count: step.pre.length,
                  total: example.graph.length,
                })}
          </dd>
        </div>
      </dl>
    </div>
  )
}
