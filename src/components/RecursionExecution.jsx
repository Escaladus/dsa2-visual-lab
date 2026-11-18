import { useEffect, useId, useRef } from 'react'
import CallTree from './RecursionTree.jsx'
import ExecutionCode from './ExecutionCode.jsx'
import MobileTabs from './RecursionTabs.jsx'
import StepSummary from './RecursionStepSummary.jsx'
import {
  activeRecursionReturn,
  getRecursionStepContext,
  recursionExpression as expression,
} from '../utils/recursionAlgorithms.js'
import { recursionTracing } from '../i18n/recursionTracing.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import { recursionExamples } from '../data/recursion.js'

// Code, stack and tree render one immutable trace step; none of these panels advances it.
const color = n => ({
  '--call-fill': `hsl(${(n * 53 + 185) % 360} 34% 21%)`,
  '--call-stroke': `hsl(${(n * 53 + 185) % 360} 65% 70%)`,
})
const callName = (kind, node) => `${kind}(${node.n}) #${node.id + 1}`

export function RecursionCodePanel({ step, code, labels, context, kind }) {
  const { language } = useLanguage()
  const tracing = recursionTracing[language]
  const resume = context?.resume
  const caption = resume
    ? formatMessage(tracing.codeResume, {
        call: callName(kind, step.nodes[resume.id]),
        line: resume.line,
        target: resume.target,
      })
    : null
  return (
    <ExecutionCode
      code={code}
      line={step.line}
      label={labels.code}
      resume={resume}
      caption={caption}
    />
  )
}

export function RecursionCounters({ step, labels }) {
  return (
    <div className="recursion-counters">
      <span>{formatMessage(labels.calls, { count: step.nodes.length })}</span>
      <span>{formatMessage(labels.depth, { depth: step.maxDepth })}</span>
      <strong className="recursion-final">
        {labels.result}: <code>{step.result ?? '—'}</code>
      </strong>
    </div>
  )
}

export default function RecursionExecution({
  frames,
  index,
  layout,
  kind,
  labels,
  panel,
  onPanelChange,
  hideNext,
}) {
  const step = frames[index]
  const context = getRecursionStepContext(frames, index)
  const { language } = useLanguage()
  const tracing = recursionTracing[language]
  const stackScroll = useRef(null)
  const id = useId()
  const transfer = activeRecursionReturn(step)
  const extra = labels.enhancements
  useEffect(() => {
    if (stackScroll.current) {
      stackScroll.current.scrollTop = 0
    }
  }, [step.stack.at(-1), panel])
  return (
    <>
      <RecursionCounters step={step} labels={labels} />
      <MobileTabs
        id={id}
        tabs={Object.entries(extra.tabs)}
        value={panel}
        onChange={onPanelChange}
        label={extra.workspace}
      />
      <div className="recursion-workspace" data-mobile-panel={panel}>
        <section
          className="recursion-panel recursion-code-panel"
          id={`${id}-code`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-code`}
        >
          <h3>{labels.code}</h3>
          {context.current && (
            <code className="recursion-current-call">
              {callName(kind, context.current)} · {formatMessage(tracing.line, { line: step.line })}
            </code>
          )}
          <RecursionCodePanel
            step={step}
            code={recursionExamples[kind].code}
            labels={labels}
            context={context}
            kind={kind}
          />
        </section>
        <section
          className="recursion-panel recursion-stack-panel"
          id={`${id}-stack`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-stack`}
        >
          <div className="recursion-panel-heading">
            <h3>{labels.stack}</h3>
            <details className="recursion-help">
              <summary aria-label={extra.stackHelp}>?</summary>
              <p>{labels.stackNote}</p>
            </details>
          </div>
          <div className="recursion-stack" ref={stackScroll} role="list" aria-label={labels.stack}>
            {step.stack.length ? (
              [...step.stack].reverse().map(id => {
                const node = step.nodes[id]
                return (
                  <div
                    key={id}
                    className={`recursion-stack-card ${node.status} ${transfer?.to === id ? 'receiving' : ''}`}
                    data-call-id={id}
                    role="listitem"
                    style={color(node.n)}
                  >
                    <div>
                      <strong>
                        {kind}({node.n})
                      </strong>
                      <small>{formatMessage(labels.call, { id: id + 1 })}</small>
                      <span>{labels[node.status]}</span>
                    </div>
                    <code>
                      {Object.entries(node.locals)
                        .map(([key, value]) => `${key} = ${value ?? '?'}`)
                        .join(' · ')}
                    </code>
                    <code>
                      {expression(node, kind)}
                      {node.result !== null ? ` = ${node.result}` : ''}
                    </code>
                    {node.continuation && (
                      <small className="recursion-stack-continuation">
                        {formatMessage(tracing.continuation, node.continuation)}
                      </small>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="recursion-empty">{labels.stackEmpty}</p>
            )}
          </div>
        </section>
        <section
          className="recursion-panel recursion-tree-panel"
          id={`${id}-tree`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-tree`}
        >
          <div className="recursion-panel-heading">
            <h3>{labels.tree}</h3>
            <details className="recursion-help">
              <summary aria-label={extra.treeHelp}>?</summary>
              <p>{labels.treeNote}</p>
            </details>
          </div>
          <CallTree step={step} layout={layout} kind={kind} labels={labels} />
        </section>
      </div>
      <StepSummary step={step} context={context} kind={kind} labels={labels} hideNext={hideNext} />
    </>
  )
}
