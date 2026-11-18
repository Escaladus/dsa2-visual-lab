import { useEffect, useId, useRef, useState } from 'react'
import { activeRecursionReturn, recursionExpression } from '../utils/recursionAlgorithms.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import { recursionTracing } from '../i18n/recursionTracing.js'
import RecursionTabs from './RecursionTabs.jsx'

const callName = (kind, node) => `${kind}(${node.n}) #${node.id + 1}`

function ReturnBridge({ step, kind, labels }) {
  const transfer = activeRecursionReturn(step)
  if (!transfer) {
    return null
  }
  const parent = transfer.to === null ? null : step.nodes[transfer.to]
  let continuation
  if (parent) {
    const locals = { ...parent.locals, [transfer.target]: transfer.value }
    continuation = recursionExpression({ ...parent, locals }, kind)
  }
  return (
    <div className="recursion-return-bridge active" aria-live="polite">
      <strong>{parent ? labels.enhancements.returnTo : labels.returned}</strong>
      <div className="recursion-return-flow">
        <code>{callName(kind, step.nodes[transfer.from])}</code>
        <span aria-hidden="true">→</span>
        <b>{transfer.value}</b>
        <span aria-hidden="true">→</span>
        {parent ? (
          <code>{callName(kind, parent)}</code>
        ) : (
          <span>{labels.enhancements.program}</span>
        )}
      </div>
      {parent && (
        <p>
          {labels.enhancements.resume}: <code>{continuation}</code>
        </p>
      )}
    </div>
  )
}

export default function RecursionStepSummary({ step, context, kind, labels, hideNext = false }) {
  const { language } = useLanguage()
  const tracing = recursionTracing[language]
  const [panel, setPanel] = useState('context')
  const scroll = useRef(null)
  const id = useId()
  const current = context.current
  const resume = context.resume
  const owner = resume ? step.nodes[resume.id] : null
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
        <ReturnBridge step={step} kind={kind} labels={labels} />
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
            {current ? (
              <>
                <code>{callName(kind, current)}</code>
                <span className="recursion-context-status"> · {labels[current.status]}</span>
                <code className="recursion-context-locals">
                  {Object.entries(current.locals)
                    .map(([name, value]) => `${name} = ${value ?? '?'}`)
                    .join(' · ')}
                </code>
              </>
            ) : (
              <span>{tracing.noCall}</span>
            )}
          </dd>
        </div>
        <div>
          <dt>{tracing.resume}</dt>
          <dd>
            {resume
              ? formatMessage(
                  current?.continuation ? tracing.waiting : tracing.returnTo,
                  current?.continuation
                    ? {
                        fn: kind,
                        n: current.continuation.nextN,
                        line: resume.line,
                        target: resume.target,
                      }
                    : { call: callName(kind, owner), line: resume.line, target: resume.target },
                )
              : step.result !== null
                ? tracing.finished
                : tracing.program}
          </dd>
        </div>
        <div>
          <dt>{tracing.next}</dt>
          <dd className="recursion-context-next">
            {hideNext ? tracing.predictFirst : tracing.actions[context.nextAction]}
          </dd>
        </div>
      </dl>
    </div>
  )
}
