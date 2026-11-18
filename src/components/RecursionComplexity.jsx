import { useId, useState } from 'react'
import {
  recursionGrowth,
  recursionMetrics,
  dfsMetrics,
  dfsWorkSummary,
} from '../utils/recursionComplexity.js'
import { recursionComplexityTranslations } from '../i18n/recursionComplexity.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'

const algorithms = ['factorial', 'fibonacci', 'memoized', 'dfs']
const times = { factorial: 'Θ(n)', fibonacci: 'Θ(φⁿ)', memoized: 'Θ(n)', dfs: 'Θ(V + E)' }

export default function RecursionComplexity({
  kind = 'factorial',
  n = 4,
  frames,
  index,
  memoFrames,
  graph,
  all = false,
  onSeek,
}) {
  const { language, locale } = useLanguage()
  const labels = recursionComplexityTranslations[language]
  const [growthN, setGrowthN] = useState(6)
  const id = useId()
  const focus = graph ? 'dfs' : memoFrames ? 'memoized' : kind
  const count = Math.max(frames.length, memoFrames?.length ?? 0)
  const last = count - 1
  const growth = recursionGrowth(growthN)
  const example = recursionGrowth(6)
  const number = value => value.toLocaleString(locale)
  const runs = graph
    ? [{ id: 'dfs', trace: frames }]
    : memoFrames
      ? [
          { id: 'fibonacci', trace: frames },
          { id: 'memoized', trace: memoFrames },
        ]
      : [{ id: kind, trace: frames }]
  const work = graph ? dfsWorkSummary(graph, frames.at(-1)) : null
  const bound = graph
    ? labels.bounds[all ? 'dfs' : 'partialDfs']
    : labels.bounds[memoFrames ? 'comparison' : kind]

  return (
    <details className="recursion-complexity" data-analysis-kind={focus}>
      <summary>
        <span>{labels.title}</span>
        <small>{bound}</small>
      </summary>
      <div className="recursion-complexity-body">
        <div className="analysis-live-heading">
          <h3>{labels.live}</h3>
          <div className="analysis-step-controls" role="group" aria-label={labels.live}>
            <button
              aria-label={labels.previousStep}
              title={labels.previousStep}
              disabled={index === 0}
              onClick={() => onSeek(index - 1)}
            >
              ←
            </button>
            <button
              aria-label={labels.nextStep}
              title={labels.nextStep}
              disabled={index === last}
              onClick={() => onSeek(index + 1)}
            >
              →
            </button>
            <button disabled={index === last} onClick={() => onSeek(last)}>
              {labels.finishRun}
            </button>
          </div>
        </div>
        <div className="analysis-runs" id={`${id}-metrics`}>
          {runs.map(run => {
            const at = Math.min(index, run.trace.length - 1)
            const step = run.trace[at]
            const metrics =
              run.id === 'dfs' ? dfsMetrics(step) : recursionMetrics(step, n, run.id === 'memoized')
            return (
              <section
                className="analysis-run"
                key={run.id}
                data-analysis-run={run.id}
                aria-label={labels.names[run.id]}
              >
                <h4>{labels.names[run.id]}</h4>
                <p className="step-text">
                  {formatMessage(labels.progress, { step: at + 1, total: run.trace.length })}
                </p>
                <dl>
                  {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} data-metric={key} data-value={value}>
                      <dt>{labels.metricLabels[key]}</dt>
                      <dd>{number(value)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )
          })}
        </div>
        <p className="analysis-note">{labels.counterNote}</p>
        {work && (
          <div className="analysis-dfs-input">
            <p>{formatMessage(labels.dfsInput, work)}</p>
            <p>{formatMessage(all ? labels.dfsFull : labels.dfsPartial, work)}</p>
          </div>
        )}

        <h3>{labels.methodTitle}</h3>
        <ol className="analysis-method">
          {labels.method.map(([title, body]) => (
            <li key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </li>
          ))}
        </ol>
        <p className="analysis-note">{labels.model}</p>

        <h3 id={`${id}-bounds`}>{labels.tableTitle}</h3>
        <div
          className="table-wrap analysis-table-wrap"
          tabIndex={0}
          role="region"
          aria-labelledby={`${id}-bounds`}
        >
          <table className="complexity-table analysis-table">
            <thead>
              <tr>
                <th scope="col">{labels.algorithm}</th>
                <th scope="col">{labels.time}</th>
                <th scope="col">{labels.memory}</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map(algorithm => (
                <tr key={algorithm} data-bound={algorithm}>
                  <th scope="row">{labels.names[algorithm]}</th>
                  <td>
                    <code>{times[algorithm]}</code>
                  </td>
                  <td>{labels.memoryRows[algorithm]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="analysis-note">{labels.tableNote}</p>

        <div className="analysis-chapters">
          {algorithms.map(algorithm => {
            const chapter = labels.chapters[algorithm]
            return (
              <details
                key={algorithm}
                open={focus === algorithm}
                data-complexity-chapter={algorithm}
              >
                <summary>{chapter.title}</summary>
                <p className="analysis-formula">
                  <code>{chapter.formula}</code>
                </p>
                {chapter.paragraphs.map(body => (
                  <p key={body}>{body}</p>
                ))}
              </details>
            )
          })}
        </div>

        <h3 id={`${id}-growth`}>{labels.growthTitle}</h3>
        <label className="analysis-growth-input" htmlFor={`${id}-n`}>
          {labels.growthInput}: <output htmlFor={`${id}-n`}>{growthN}</output>
          <input
            id={`${id}-n`}
            type="range"
            min="0"
            max="20"
            value={growthN}
            aria-label={labels.growthInput}
            onChange={event => setGrowthN(Number(event.target.value))}
          />
        </label>
        <div
          className="table-wrap analysis-table-wrap"
          tabIndex={0}
          role="region"
          aria-labelledby={`${id}-growth`}
        >
          <table className="complexity-table analysis-table analysis-growth-table">
            <thead>
              <tr>
                <th scope="col">{labels.algorithm}</th>
                <th scope="col">{labels.growthCalls}</th>
                <th scope="col">{labels.growthStack}</th>
                <th scope="col">{labels.growthCache}</th>
              </tr>
            </thead>
            <tbody>
              {growth.map(row => (
                <tr key={row.id} data-growth-row={row.id}>
                  <th scope="row">{labels.names[row.id]}</th>
                  {['calls', 'peak', 'cacheSlots'].map(key => (
                    <td key={key} data-growth-metric={key} data-value={row[key]}>
                      {number(row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="analysis-note">{labels.growthNote}</p>
        <p>
          {formatMessage(labels.fibExample, {
            naive: example[1].calls,
            memoized: example[2].calls,
            peak: example[1].peak,
          })}
        </p>

        <h3>{labels.historyTitle}</h3>
        <p>{labels.history}</p>
      </div>
    </details>
  )
}
