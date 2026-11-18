import { useId, useState } from 'react'
import CallTree from './RecursionTree.jsx'
import MobileTabs from './RecursionTabs.jsx'
import StepSummary from './RecursionStepSummary.jsx'
import {
  RecursionCodePanel as CodePanel,
  RecursionCounters as Counters,
} from './RecursionExecution.jsx'
import { memoizedFibonacciCode, recursionExamples } from '../data/recursion.js'
import { getRecursionStepContext } from '../utils/recursionAlgorithms.js'
import { formatMessage } from '../i18n/index.js'

// The two runs have different lengths. Clamp each cursor independently when comparing them.
export default function RecursionComparison({
  frames,
  memoFrames,
  layout,
  memoLayout,
  index,
  labels,
}) {
  const extra = labels.enhancements
  const [panel, setPanel] = useState('naive')
  const id = useId()
  const memo = memoFrames[Math.min(index, memoFrames.length - 1)]
  const naive = frames[Math.min(index, frames.length - 1)]
  return (
    <div className="recursion-comparison">
      <h3>{extra.comparisonTitle}</h3>
      <details className="recursion-comparison-note">
        <summary>{extra.comparisonHelp}</summary>
        <p className="recursion-note">{extra.comparisonNote}</p>
      </details>
      <MobileTabs
        id={id}
        tabs={['naive', 'memoized'].map(key => [key, extra[key]])}
        value={panel}
        onChange={setPanel}
        label={extra.comparisonTitle}
      />
      <div className="recursion-comparison-grid" data-mobile-panel={panel}>
        {[
          {
            id: 'naive',
            step: naive,
            trace: frames,
            treeLayout: layout,
            code: recursionExamples.fibonacci.code,
          },
          {
            id: 'memoized',
            step: memo,
            trace: memoFrames,
            treeLayout: memoLayout,
            code: memoizedFibonacciCode,
          },
        ].map(({ id: executionId, step, trace, treeLayout, code }) => (
          <section
            key={executionId}
            id={`${id}-${executionId}`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${executionId}`}
            className="recursion-panel"
            data-execution={executionId}
          >
            <h3>{extra[executionId]}</h3>
            <p className="recursion-note">{extra[executionId + 'Cost']}</p>
            <span className="step-text">
              {formatMessage(extra.localStep, {
                current: Math.min(index + 1, trace.length),
                total: trace.length,
              })}
            </span>
            <Counters step={step} labels={labels} />
            <strong
              className={`recursion-cache-hits ${executionId === 'naive' ? 'placeholder' : ''}`}
              aria-hidden={executionId === 'naive'}
            >
              {formatMessage(extra.hits, { count: step.cacheHits })}
              {executionId === 'memoized' && ` · ✓ ${extra.cached}`}
            </strong>
            <CallTree step={step} layout={treeLayout} kind="fibonacci" labels={labels} />
            {executionId === 'memoized' && (
              <div className="recursion-cache">
                <h4>{extra.cache}</h4>
                <div className="recursion-cache-values">
                  {Object.keys(memo.cache).length ? (
                    Object.entries(memo.cache).map(([key, value]) => (
                      <code
                        key={key}
                        className={
                          memo.message.key === 'cacheHit' && String(memo.message.values.n) === key
                            ? 'hit'
                            : ''
                        }
                      >
                        memo[{key}] = {value}
                      </code>
                    ))
                  ) : (
                    <span>{extra.cacheEmpty}</span>
                  )}
                </div>
                <details>
                  <summary>{extra.cacheHelp}</summary>
                  <p className="recursion-note">{extra.cacheNote}</p>
                  <code>Long[] memo = new Long[n + 1];</code>
                </details>
              </div>
            )}
            <StepSummary
              step={step}
              context={getRecursionStepContext(trace, Math.min(index, trace.length - 1))}
              kind="fibonacci"
              labels={labels}
            />
            <details className="recursion-comparison-code">
              <summary>{labels.code}</summary>
              <CodePanel
                step={step}
                code={code}
                labels={labels}
                context={getRecursionStepContext(trace, Math.min(index, trace.length - 1))}
                kind="fibonacci"
              />
            </details>
          </section>
        ))}
      </div>
      {naive.result !== null && memo.result !== null && (
        <div className="explanation-box recursion-comparison-result" role="status">
          {formatMessage(extra.comparisonResult, {
            value: naive.result,
            naive: naive.nodes.length,
            memoized: memo.nodes.length,
            hits: memo.cacheHits,
          })}
        </div>
      )}
    </div>
  )
}
