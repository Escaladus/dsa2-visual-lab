import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import { createSortingSteps, sortingAlgorithms, sortingInput } from '../utils/sortingAlgorithms.js'

function MergeBuffer({ state, text }) {
  const runs = [
    [text.leftRun, state.left, state.leftIndex],
    [text.rightRun, state.right, state.rightIndex],
    [text.mergedRun, state.output, 0],
  ]
  return <div className="merge-buffer">
    {runs.map(([label, values, consumed], run) => (
      <div className="merge-run" key={run}>
        <strong>{label}</strong>
        <div className="merge-values">
          {values.length ? values.map((value, index) => (
            <span key={index} className={index < consumed ? 'consumed' : run < 2 && index === consumed ? 'next' : ''}>{value}</span>
          )) : <em>{text.empty}</em>}
        </div>
      </div>
    ))}
  </div>
}

export default function SortingLab() {
  const { text } = useLanguage()
  const labels = text.sorting
  const [algorithm, setAlgorithm] = useState('bubble')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(700)
  const steps = useMemo(() => createSortingSteps(algorithm, sortingInput), [algorithm])
  const step = steps[index]
  const active = new Set(step.active)
  const sorted = new Set(step.sorted)
  const ordered = new Set(step.ordered)

  useEffect(() => {
    if (!playing) return
    if (index >= steps.length - 1) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setIndex(value => Math.min(value + 1, steps.length - 1)), speed)
    return () => clearTimeout(timer)
  }, [playing, index, speed, steps.length])

  function seek(value) {
    setPlaying(false)
    setIndex(Math.max(0, Math.min(value, steps.length - 1)))
  }

  function choose(id) {
    setPlaying(false)
    setIndex(0)
    setAlgorithm(id)
  }

  function togglePlay() {
    if (index === steps.length - 1) setIndex(0)
    setPlaying(value => !value)
  }

  return (
    <div className="lab-shell sorting-lab">
      <div className="sorting-selector" role="group" aria-label={labels.choose}>
        {sortingAlgorithms.map(({ id }) => (
          <button key={id} type="button" aria-pressed={algorithm === id} onClick={() => choose(id)}>
            {labels.algorithms[id].name}
          </button>
        ))}
      </div>
      <p className="sorting-description">{labels.algorithms[algorithm].description}</p>
      <div className="bars" role="list" aria-label={labels.array}>
        {step.values.map((value, i) => {
          const outside = step.range && (i < step.range[0] || i > step.range[1]) && !sorted.has(i)
          const classes = ['bar', active.has(i) && 'active', sorted.has(i) && 'sorted', ordered.has(i) && 'ordered', step.pivot === i && 'pivot', outside && 'outside'].filter(Boolean).join(' ')
          return <div key={i} role="listitem" aria-label={`${i + 1}: ${value}`} data-value={value} className={classes} style={{ height: `${value * 24}px` }}><span>{value}</span></div>
        })}
      </div>
      <div className="sorting-legend">
        <span><i className="legend-dot comparison" />{labels.active}</span>
        <span><i className="legend-dot ordered" />{labels.ordered}</span>
        <span><i className="legend-dot visited" />{labels.sorted}</span>
        {algorithm === 'quick' && <span><i className="legend-dot pivot" />{labels.pivot}</span>}
      </div>
      {step.auxiliary && <MergeBuffer state={step.auxiliary} text={labels} />}
      <div className="explanation-box" aria-live="polite">{formatMessage(labels.messages[step.message.key], step.message.values)}</div>
      <div className="sorting-timeline">
        <span className="step-text">{text.ui.step} {index + 1} / {steps.length}</span>
        <input type="range" aria-label={labels.timeline} min="0" max={steps.length - 1} value={index} onChange={event => seek(Number(event.target.value))} />
      </div>
      <div className="playback">
        <button onClick={() => seek(index - 1)} disabled={index === 0}>{text.ui.back}</button>
        <button className="primary" onClick={togglePlay}>{playing ? text.ui.pause : text.ui.play}</button>
        <button onClick={() => seek(index + 1)} disabled={index === steps.length - 1}>{text.ui.next}</button>
        <button onClick={() => seek(0)}>{text.ui.reset}</button>
      </div>
      <label className="sorting-speed">{text.ui.speed}
        <input type="range" min="150" max="1500" step="50" value={speed} onChange={event => setSpeed(Number(event.target.value))} />
      </label>
    </div>
  )
}
