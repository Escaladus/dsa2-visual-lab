import { useEffect, useReducer, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import { createHeapState, heapLabReducer, heapLimit, heapValueMin, heapValueMax, pollHistory, validHeapValue } from '../utils/heapAlgorithms.js'

function HeapTree({ step, layoutCount, labels }) {
  const scroll = useRef(null)
  const depth = Math.floor(Math.log2(Math.max(1, layoutCount)))
  const width = Math.max(320, 2 ** depth * 72)
  const height = 94 + depth * 80
  const positions = Array.from({ length: layoutCount }, (_, index) => {
    const level = Math.floor(Math.log2(index + 1))
    const first = 2 ** level - 1
    return { x: width * (index - first + 0.5) / 2 ** level, y: 38 + level * 80 }
  })
  const active = new Set(step.active), swapping = new Set(step.swapping)

  useEffect(() => {
    const element = scroll.current
    const center = () => { element.scrollLeft = Math.max(0, (element.scrollWidth - element.clientWidth) / 2) }
    center()
    const observer = new ResizeObserver(center)
    observer.observe(element)
    return () => observer.disconnect()
  }, [width])

  return <div className="heap-tree-scroll" ref={scroll} tabIndex={0}>
    {step.nodes.length ? (
      <svg className="heap-tree" viewBox={`0 0 ${width} ${height}`} style={{ minWidth: layoutCount > 7 ? `${width}px` : undefined }} role="img" aria-label={labels.tree}>
        {step.nodes.map((node, index) => {
          if (!index) return null
          const parent = Math.floor((index - 1) / 2)
          const pair = active.has(index) && active.has(parent)
          return <line key={index} x1={positions[parent].x} y1={positions[parent].y} x2={positions[index].x} y2={positions[index].y}
            className={`heap-edge ${pair ? 'active' : ''} ${swapping.has(index) && swapping.has(parent) ? 'swapping' : ''}`} />
        })}
        {step.nodes.map((node, index) => <text key={`index-${index}`} className="heap-tree-index" x={positions[index].x} y={positions[index].y + 38} textAnchor="middle">{index}</text>)}
        {step.nodes.map((node, index) => (
          <g key={node.id} data-node-id={node.id} data-index={index} data-value={node.value}
            className={`heap-node ${index === 0 && step.valid ? 'minimum' : ''} ${active.has(index) ? 'active' : ''} ${swapping.has(index) ? 'swapping' : ''}`}
            style={{ transform: `translate(${positions[index].x}px, ${positions[index].y}px)` }}>
            <circle r="23" />
            <text textAnchor="middle" dy=".35em">{node.value}</text>
          </g>
        ))}
      </svg>
    ) : <div className="heap-empty">{labels.empty}</div>}
  </div>
}

export default function HeapLab() {
  const { text } = useLanguage()
  const labels = text.heap
  const [state, dispatch] = useReducer(heapLabReducer, undefined, () => createHeapState())
  const [input, setInput] = useState('1')
  const [invalid, setInvalid] = useState(false)
  const [speed, setSpeed] = useState(800)
  const step = state.frames[state.index]
  const last = state.frames.length - 1
  const canOperate = state.index === last && !state.playing
  const full = step.nodes.length >= heapLimit
  const active = new Set(step.active), swapping = new Set(step.swapping)
  const priority = [...step.nodes].sort((a, b) => a.value - b.value)
  const removed = pollHistory(state)
  const layoutCount = Math.max(1, ...state.frames.map(item => item.nodes.length))

  useEffect(() => {
    if (!state.playing) return
    const timer = setTimeout(() => dispatch({ type: 'TICK' }), speed)
    return () => clearTimeout(timer)
  }, [state.playing, state.index, speed])

  function offer(event) {
    event.preventDefault()
    if (!canOperate || full) return
    const value = Number(input)
    if (!input.trim() || !validHeapValue(value)) { setInvalid(true); return }
    setInvalid(false)
    dispatch({ type: 'OFFER', value })
  }

  function reset(type) {
    setInvalid(false)
    if (type === 'RESET') setInput('1')
    dispatch({ type })
  }

  return (
    <section className="lab-shell heap-lab" aria-labelledby="heap-lab-title">
      <h2 id="heap-lab-title">{labels.title}</h2>
      <p className="heap-intro">{labels.intro}</p>
      <div className="heap-controls">
        <form className="heap-offer-form" onSubmit={offer} noValidate>
          <label htmlFor="heap-value">{labels.value}</label>
          <div className="heap-offer-input">
            <input id="heap-value" type="number" min={heapValueMin} max={heapValueMax} step="1" value={input} disabled={!canOperate}
              aria-invalid={invalid} aria-describedby={invalid ? 'heap-input-error' : undefined}
              onChange={event => { setInput(event.target.value); setInvalid(false) }} />
            <button type="submit" className="primary" disabled={!canOperate || full}>{labels.offer}</button>
          </div>
        </form>
        <div className="heap-operation-buttons">
          <button disabled={!canOperate} onClick={() => dispatch({ type: 'PEEK' })}>{labels.peek}</button>
          <button disabled={!canOperate} onClick={() => dispatch({ type: 'POLL' })}>{labels.poll}</button>
        </div>
      </div>
      {invalid && <p className="heap-input-error" id="heap-input-error" role="alert">{formatMessage(labels.invalid, { min: heapValueMin, max: heapValueMax })}</p>}
      {full && <p className="heap-hint">{formatMessage(labels.limit, { max: heapLimit })}</p>}
      {!canOperate && <p className="heap-hint">{labels.finishHint}</p>}
      <div className="heap-status-row">
        <span className={`heap-invariant ${step.valid ? 'valid' : 'repairing'}`}>{step.valid ? labels.invariant : labels.transient}</span>
        <span>{formatMessage(labels.size, { count: step.nodes.length, max: heapLimit })}</span>
      </div>
      <div className="heap-layout">
        <div className="heap-structure">
          <div className="heap-panel">
            <h3>{labels.tree}</h3>
            <HeapTree step={step} layoutCount={layoutCount} labels={labels} />
          </div>
          <div className="heap-panel heap-array-panel">
            <h3>{labels.array}</h3>
            <div className="heap-array" role="list" aria-label={labels.array}>
              {step.nodes.length ? step.nodes.map((node, index) => (
                <div key={index} role="listitem" aria-label={`${index}: ${node.value}`} data-value={node.value}
                  className={`heap-array-cell ${index === 0 && step.valid ? 'minimum' : ''} ${active.has(index) ? 'active' : ''} ${swapping.has(index) ? 'swapping' : ''}`}>
                  <small>{index}</small><strong>{node.value}</strong>
                </div>
              )) : <p className="heap-muted">{labels.empty}</p>}
            </div>
            <p className="heap-rule">{labels.rule}</p>
          </div>
        </div>
        <div className="heap-panel heap-queue-panel">
          <h3>{labels.queue}</h3>
          <p className="heap-order-label">{labels.order}</p>
          <div className="heap-removal-order" role="list" aria-label={labels.order}>
            {!step.valid ? <p className="heap-muted">{labels.repairing}</p>
              : priority.length ? priority.map((node, index) => <span className={`heap-token ${index === 0 ? 'next' : ''}`} key={node.id} role="listitem" data-value={node.value}>{node.value}</span>)
                : <p className="heap-muted">{labels.empty}</p>}
          </div>
          <p className="heap-queue-note">{labels.queueNote}</p>
          <div className="heap-return">
            <h4>{labels.result}</h4>
            <code>{step.result ? `${step.result.kind} → ${String(step.result.value)}` : '—'}</code>
          </div>
          <h4>{labels.history}</h4>
          <div className="heap-history" role="list" aria-label={labels.history}>
            {removed.length ? removed.map((value, index) => <span className="heap-token" role="listitem" key={index}>{value}</span>) : <p className="heap-muted">{labels.noHistory}</p>}
          </div>
        </div>
      </div>
      <div className="heap-legend">
        <span><i className="legend-dot heap-minimum" />{labels.minimum}</span>
        <span><i className="legend-dot comparison" />{labels.active}</span>
        <span><i className="legend-dot heap-swapping" />{labels.swapping}</span>
      </div>
      <div className="explanation-box" aria-live="polite">{formatMessage(labels.messages[step.message.key], step.message.values)}</div>
      <div className="sorting-timeline">
        <span className="step-text">{text.ui.step} {state.index + 1} / {state.frames.length}</span>
        <input type="range" aria-label={labels.timeline} min="0" max={last} value={state.index} disabled={last === 0}
          onChange={event => dispatch({ type: 'SEEK', index: Number(event.target.value) })} />
      </div>
      <div className="playback">
        <button disabled={state.index === 0} onClick={() => dispatch({ type: 'PREVIOUS' })}>{text.ui.back}</button>
        <button className="primary" disabled={last === 0} onClick={() => dispatch({ type: 'PLAY' })}>{state.playing ? text.ui.pause : text.ui.play}</button>
        <button disabled={state.index === last} onClick={() => dispatch({ type: 'NEXT' })}>{text.ui.next}</button>
        <button disabled={state.index === last} onClick={() => dispatch({ type: 'SEEK', index: last })}>{labels.finish}</button>
      </div>
      <div className="heap-bottom-controls">
        <label className="sorting-speed">{text.ui.speed}<input type="range" min="200" max="1600" step="100" value={speed} onChange={event => setSpeed(Number(event.target.value))} /></label>
        <div className="playback"><button onClick={() => reset('RESET')}>{labels.reset}</button><button onClick={() => reset('EMPTY')}>{labels.clear}</button></div>
      </div>
      <p className="heap-costs">{labels.costs}</p>
    </section>
  )
}
