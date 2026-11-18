import { useEffect, useId, useMemo, useState } from 'react'
import { recurrenceExamples, recurrenceInputs } from '../data/recurrenceTrees.js'
import { createRecurrenceTree } from '../utils/recurrenceTree.js'
import { recurrenceTreeTranslations } from '../i18n/recurrenceTrees.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import RecurrenceTreeViewport from './RecurrenceTreeViewport.jsx'

export default function RecurrenceTreeLab() {
  const { language, locale } = useLanguage()
  const labels = recurrenceTreeTranslations[language]
  const id = useId()
  const [preset, setPreset] = useState('chain')
  const [n, setN] = useState(4)
  const [level, setLevel] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [resetView, setResetView] = useState(0)
  const model = useMemo(() => createRecurrenceTree(preset, n), [preset, n])
  const example = recurrenceExamples[preset]
  const row = model.levels[level]
  const complete = level === model.maxDepth
  const number = value => value.toLocaleString(locale)

  useEffect(() => {
    if (!playing) {
      return
    }
    if (complete) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setLevel(value => Math.min(value + 1, model.maxDepth)), 850)
    return () => clearTimeout(timer)
  }, [playing, complete, level, model.maxDepth])

  function choose(nextPreset, nextN) {
    setPlaying(false)
    setLevel(0)
    setPreset(nextPreset)
    setN(nextN)
  }
  function seek(next) {
    setPlaying(false)
    setLevel(Math.max(0, Math.min(model.maxDepth, next)))
  }
  function toggle() {
    if (playing) {
      setPlaying(false)
    } else if (model.maxDepth > 0) {
      if (complete) {
        setLevel(0)
      }
      setPlaying(true)
    }
  }
  function scale(value) {
    setZoom(Math.max(0.25, Math.min(1.5, value)))
  }

  return (
    <section
      className="lab-shell recurrence-tree-lab"
      aria-labelledby={`${id}-title`}
      data-example={preset}
      data-n={n}
      data-level={level}
      data-playing={playing}
      data-zoom={zoom}
    >
      <h2 id={`${id}-title`}>{labels.title}</h2>
      <p className="rt-intro">{labels.intro}</p>
      <div className="rt-inputs">
        <label>
          {labels.choose}
          <select value={preset} onChange={event => choose(event.target.value, n)}>
            {Object.entries(recurrenceExamples).map(([key, item]) => (
              <option value={key} key={key}>
                {item.recurrence}
              </option>
            ))}
          </select>
        </label>
        <label>
          {labels.input}
          <select value={n} onChange={event => choose(preset, Number(event.target.value))}>
            {recurrenceInputs.map(value => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        className="rt-highlight-example"
        aria-pressed={preset === 'linearSplit'}
        onClick={() => {
          if (preset !== 'linearSplit') {
            choose('linearSplit', n)
          }
        }}
      >
        <span>{labels.linearExample}</span>
        <code>2T(n/2) + n → Θ(n log n)</code>
      </button>
      <div className="rt-example-description">
        <h3>{labels.examples[preset][0]}</h3>
        <code className="rt-recurrence">{example.recurrence} · T(1) = 1</code>
        <p>{labels.examples[preset][1]}</p>
      </div>
      <p className="rt-note">{labels.base}</p>
      <details className="rt-code">
        <summary>{labels.code}</summary>
        <pre className="code-block" tabIndex={0} aria-label={labels.code}>
          <code>{example.code}</code>
        </pre>
        <p>{labels.units}</p>
      </details>
      <p className="rt-note">{labels.construction}</p>

      <div className="rt-workspace">
        <div className="rt-diagram-section">
          <div className="rt-zoom" role="group" aria-label={labels.zoom}>
            <button
              aria-label={labels.zoomOut}
              disabled={zoom === 0.25}
              onClick={() => scale(zoom - 0.25)}
            >
              −
            </button>
            <input
              type="range"
              min="25"
              max="150"
              step="25"
              value={zoom * 100}
              aria-label={labels.zoom}
              onChange={event => scale(Number(event.target.value) / 100)}
            />
            <output>{Math.round(zoom * 100)}%</output>
            <button
              aria-label={labels.zoomIn}
              disabled={zoom === 1.5}
              onClick={() => scale(zoom + 0.25)}
            >
              +
            </button>
            <button className="rt-reset-zoom" onClick={() => scale(1)}>
              {labels.resetZoom}
            </button>
          </div>
          <div className="rt-plot">
            <aside className="rt-depth-axis" aria-label={labels.depth}>
              <strong>{labels.depth}</strong>
              <span>{labels.root}</span>
              <div className="rt-depth-arrow" aria-hidden="true" />
              <dl>
                <div>
                  <dt>{labels.maxDepth}</dt>
                  <dd data-depth-value={model.maxDepth}>
                    <code>
                      {example.depth} = {model.maxDepth}
                    </code>
                  </dd>
                </div>
                <div>
                  <dt>{labels.depthGrowth}</dt>
                  <dd>
                    <code>{example.depthBound}</code>
                  </dd>
                </div>
                <div>
                  <dt>{labels.levels}</dt>
                  <dd data-levels-value={model.totalLevels}>
                    <code>
                      {example.levels} = {model.totalLevels}
                    </code>
                  </dd>
                </div>
              </dl>
            </aside>
            <RecurrenceTreeViewport
              model={model}
              level={level}
              zoom={zoom}
              resetView={resetView}
              labels={labels}
            />
            <div className="rt-width-axis" aria-label={labels.horizontal}>
              <div className="rt-width-arrow" aria-hidden="true" />
              <strong>{labels.horizontal}</strong>
              <span>
                {labels.width}:{' '}
                <code data-width-value={model.maxWidth}>
                  {example.width} = {number(model.maxWidth)}
                </code>
              </span>
            </div>
          </div>
          <p className="rt-note rt-axis-note">{labels.horizontalNote}</p>
          <div className="rt-legend">
            <span aria-hidden="true" />
            {labels.current}
          </div>
          <div className="rt-controls" role="group" aria-label={labels.controls}>
            <div className="playback rt-primary-controls">
              <button disabled={level === 0} onClick={() => seek(level - 1)}>
                {labels.previous}
              </button>
              <button disabled={model.maxDepth === 0} onClick={toggle}>
                {playing ? labels.pause : labels.play}
              </button>
              <button className="primary" disabled={complete} onClick={() => seek(level + 1)}>
                {labels.next}
              </button>
            </div>
            <div className="playback rt-secondary-controls">
              <button disabled={complete} onClick={() => seek(model.maxDepth)}>
                {labels.showAll}
              </button>
              <button
                onClick={() => {
                  seek(0)
                  setResetView(value => value + 1)
                }}
              >
                {labels.reset}
              </button>
            </div>
            <p className="step-text">
              {formatMessage(labels.progress, {
                level,
                last: model.maxDepth,
                shown: level + 1,
                total: model.totalLevels,
              })}
            </p>
          </div>
        </div>

        <section className="rt-calculation" aria-labelledby={`${id}-work-title`}>
          <h3 id={`${id}-work-title`}>{labels.table}</h3>
          <p className="rt-level-rule">
            {formatMessage(labels.rowRule, {
              size: example.sizeAtLevel,
              calls: example.callsAtLevel,
              own: example.ownAtLevel,
              work: example.workAtLevel,
            })}
          </p>
          <div
            className="table-wrap rt-table-wrap"
            role="region"
            aria-labelledby={`${id}-work-title`}
            tabIndex={0}
          >
            <table className="rt-table">
              <thead>
                <tr>
                  {labels.columns.map(label => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {model.levels.slice(0, level + 1).map(item => (
                  <tr
                    key={item.index}
                    className={item.index === level ? 'current' : ''}
                    data-level-row={item.index}
                  >
                    <th scope="row">{item.index}</th>
                    <td>{number(item.size)}</td>
                    <td>{number(item.nodeCount)}</td>
                    <td>{number(item.ownWork)}</td>
                    <td data-level-work={item.work}>{number(item.work)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rt-note">{labels.workSymbol}</p>
          <dl className="rt-totals">
            <div>
              <dt>{labels.revealedNodes}</dt>
              <dd data-total-nodes={row.cumulativeNodes}>
                {number(row.cumulativeNodes)} / {number(model.totalNodes)}
              </dd>
            </div>
            <div>
              <dt>{labels.revealedWork}</dt>
              <dd data-total-work={row.cumulativeWork}>{number(row.cumulativeWork)}</dd>
            </div>
          </dl>
          <div className={`rt-result ${complete ? 'complete' : ''}`} role="status">
            {complete ? (
              <>
                <h4>{labels.result}</h4>
                <p>
                  <code>
                    {formatMessage(labels.sum, {
                      sum: model.levels.map(item => number(item.work)).join(' + '),
                      value: number(model.totalWork),
                    })}
                  </code>
                </p>
                <p className="rt-solution">
                  <code>
                    {formatMessage(labels.solution, {
                      formula: example.total,
                      value: number(model.totalWork),
                      bound: example.bound,
                    })}
                  </code>
                </p>
              </>
            ) : (
              <p>{labels.partial}</p>
            )}
          </div>
          <p className="rt-note">{labels.boundsNote}</p>
        </section>
      </div>
    </section>
  )
}
