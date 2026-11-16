import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { recurrenceExamples, recurrenceInputs } from '../data/recurrenceTrees.js'
import { createRecurrenceTree } from '../utils/recurrenceTree.js'
import { recurrenceTreeTranslations } from '../i18n/recurrenceTrees.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'

function TreeViewport({ model, level, zoom, resetView, labels }) {
  const viewport = useRef(null), previous = useRef(null), drag = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const offsetX = Math.max(0, (size.width - model.width * zoom) / 2)
  const offsetY = Math.max(0, (size.height - model.height * zoom) / 2)
  const shown = model.nodes.filter(node => node.depth <= level)

  useLayoutEffect(() => {
    const element = viewport.current
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const element = viewport.current, old = previous.current
    if (!size.width || !size.height) return
    if (!old || old.model !== model || old.resetView !== resetView || (level === 0 && old.level !== 0)) {
      element.scrollLeft = Math.max(0, model.nodes[0].x * zoom + offsetX - size.width / 2)
      element.scrollTop = 0
    } else if (old.zoom !== zoom || old.width !== size.width || old.height !== size.height) {
      // Keep the user's view centre when changing scale or viewport dimensions.
      const x = (element.scrollLeft + old.width / 2 - old.offsetX) / old.zoom
      const y = (element.scrollTop + old.height / 2 - old.offsetY) / old.zoom
      element.scrollLeft = Math.max(0, x * zoom + offsetX - size.width / 2)
      element.scrollTop = Math.max(0, y * zoom + offsetY - size.height / 2)
    }
    if (!old || old.model !== model || old.level !== level) {
      const y = (48 + level * 88) * zoom + offsetY
      if (y + 32 * zoom > element.scrollTop + size.height - 16) element.scrollTop = y + 32 * zoom - size.height + 16
      else if (y - 32 * zoom < element.scrollTop) element.scrollTop = Math.max(0, y - 32 * zoom - 12)
    }
    previous.current = { model, zoom, level, resetView, width: size.width, height: size.height, offsetX, offsetY }
  }, [model, zoom, level, resetView, size.width, size.height, offsetX, offsetY])

  return <div className="rt-scroll" ref={viewport} role="region" tabIndex={0} aria-label={labels.pan}
    onPointerDown={event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      event.preventDefault()
      event.currentTarget.focus({ preventScroll: true })
      drag.current = { x: event.clientX, y: event.clientY, left: viewport.current.scrollLeft, top: viewport.current.scrollTop }
      event.currentTarget.setPointerCapture(event.pointerId)
    }}
    onPointerMove={event => {
      if (!drag.current) return
      viewport.current.scrollLeft = drag.current.left + drag.current.x - event.clientX
      viewport.current.scrollTop = drag.current.top + drag.current.y - event.clientY
    }}
    onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
    <div className="rt-canvas" style={{ width: Math.max(size.width, model.width * zoom), height: Math.max(size.height, model.height * zoom) }}>
      <svg width={model.width * zoom} height={model.height * zoom} viewBox={`0 0 ${model.width} ${model.height}`} style={{ left: offsetX, top: offsetY }} role="img" aria-label={labels.tree}>
        {shown.filter(node => node.parent !== null).map(node => {
          const parent = model.nodes[node.parent]
          return <line key={node.id} className={`rt-edge ${node.depth === level ? 'current' : ''}`} x1={parent.x} y1={parent.y + 25} x2={node.x} y2={node.y - 25} />
        })}
        {shown.map(node => <g key={node.id} className={`rt-node ${node.depth === level ? 'current' : ''}`} transform={`translate(${node.x},${node.y})`} data-node-id={node.id} data-depth={node.depth} data-size={node.size} data-work={node.work}>
          <title>{formatMessage(labels.node, { size: node.size, work: node.work, depth: node.depth })}</title>
          <rect x="-44" y="-25" width="88" height="50" rx="10" />
          <text textAnchor="middle" y="-3">T({node.size})</text>
          <text className="rt-node-work" textAnchor="middle" y="15">{formatMessage(labels.nodeWork, { work: node.work })}</text>
        </g>)}
      </svg>
    </div>
  </div>
}

export default function RecurrenceTreeLab() {
  const { language, locale } = useLanguage()
  const labels = recurrenceTreeTranslations[language], id = useId()
  const [preset, setPreset] = useState('chain'), [n, setN] = useState(4)
  const [level, setLevel] = useState(0), [playing, setPlaying] = useState(false), [zoom, setZoom] = useState(1)
  const [resetView, setResetView] = useState(0)
  const model = useMemo(() => createRecurrenceTree(preset, n), [preset, n])
  const example = recurrenceExamples[preset], row = model.levels[level], complete = level === model.maxDepth
  const number = value => value.toLocaleString(locale)

  useEffect(() => {
    if (!playing) return
    if (complete) { setPlaying(false); return }
    const timer = setTimeout(() => setLevel(value => Math.min(value + 1, model.maxDepth)), 850)
    return () => clearTimeout(timer)
  }, [playing, complete, level, model.maxDepth])

  function choose(nextPreset, nextN) { setPlaying(false); setLevel(0); setPreset(nextPreset); setN(nextN) }
  function seek(next) { setPlaying(false); setLevel(Math.max(0, Math.min(model.maxDepth, next))) }
  function toggle() {
    if (playing) setPlaying(false)
    else if (model.maxDepth > 0) { if (complete) setLevel(0); setPlaying(true) }
  }
  function scale(value) { setZoom(Math.max(0.25, Math.min(1.5, value))) }

  return <section className="lab-shell recurrence-tree-lab" aria-labelledby={`${id}-title`} data-example={preset} data-n={n} data-level={level} data-playing={playing} data-zoom={zoom}>
    <h2 id={`${id}-title`}>{labels.title}</h2>
    <p className="rt-intro">{labels.intro}</p>
    <div className="rt-inputs">
      <label>{labels.choose}<select value={preset} onChange={event => choose(event.target.value, n)}>{Object.entries(recurrenceExamples).map(([key, item]) => <option value={key} key={key}>{item.recurrence}</option>)}</select></label>
      <label>{labels.input}<select value={n} onChange={event => choose(preset, Number(event.target.value))}>{recurrenceInputs.map(value => <option value={value} key={value}>{value}</option>)}</select></label>
    </div>
    <button className="rt-highlight-example" aria-pressed={preset === 'linearSplit'} onClick={() => { if (preset !== 'linearSplit') choose('linearSplit', n) }}>
      <span>{labels.linearExample}</span><code>2T(n/2) + n → Θ(n log n)</code>
    </button>
    <div className="rt-example-description"><h3>{labels.examples[preset][0]}</h3><code className="rt-recurrence">{example.recurrence} · T(1) = 1</code><p>{labels.examples[preset][1]}</p></div>
    <p className="rt-note">{labels.base}</p>
    <details className="rt-code"><summary>{labels.code}</summary><pre className="code-block" tabIndex={0} aria-label={labels.code}><code>{example.code}</code></pre><p>{labels.units}</p></details>
    <p className="rt-note">{labels.construction}</p>

    <div className="rt-workspace">
      <div className="rt-diagram-section">
        <div className="rt-zoom" role="group" aria-label={labels.zoom}>
          <button aria-label={labels.zoomOut} disabled={zoom === 0.25} onClick={() => scale(zoom - 0.25)}>−</button>
          <input type="range" min="25" max="150" step="25" value={zoom * 100} aria-label={labels.zoom} onChange={event => scale(Number(event.target.value) / 100)} />
          <output>{Math.round(zoom * 100)}%</output>
          <button aria-label={labels.zoomIn} disabled={zoom === 1.5} onClick={() => scale(zoom + 0.25)}>+</button>
          <button className="rt-reset-zoom" onClick={() => scale(1)}>{labels.resetZoom}</button>
        </div>
        <div className="rt-plot">
          <aside className="rt-depth-axis" aria-label={labels.depth}>
            <strong>{labels.depth}</strong><span>{labels.root}</span><div className="rt-depth-arrow" aria-hidden="true" />
            <dl><div><dt>{labels.maxDepth}</dt><dd data-depth-value={model.maxDepth}><code>{example.depth} = {model.maxDepth}</code></dd></div>
              <div><dt>{labels.depthGrowth}</dt><dd><code>{example.depthBound}</code></dd></div>
              <div><dt>{labels.levels}</dt><dd data-levels-value={model.totalLevels}><code>{example.levels} = {model.totalLevels}</code></dd></div></dl>
          </aside>
          <TreeViewport model={model} level={level} zoom={zoom} resetView={resetView} labels={labels} />
          <div className="rt-width-axis" aria-label={labels.horizontal}>
            <div className="rt-width-arrow" aria-hidden="true" />
            <strong>{labels.horizontal}</strong><span>{labels.width}: <code data-width-value={model.maxWidth}>{example.width} = {number(model.maxWidth)}</code></span>
          </div>
        </div>
        <p className="rt-note rt-axis-note">{labels.horizontalNote}</p>
        <div className="rt-legend"><span aria-hidden="true" />{labels.current}</div>
        <div className="rt-controls" role="group" aria-label={labels.controls}>
          <div className="playback rt-primary-controls"><button disabled={level === 0} onClick={() => seek(level - 1)}>{labels.previous}</button><button disabled={model.maxDepth === 0} onClick={toggle}>{playing ? labels.pause : labels.play}</button><button className="primary" disabled={complete} onClick={() => seek(level + 1)}>{labels.next}</button></div>
          <div className="playback rt-secondary-controls"><button disabled={complete} onClick={() => seek(model.maxDepth)}>{labels.showAll}</button><button onClick={() => { seek(0); setResetView(value => value + 1) }}>{labels.reset}</button></div>
          <p className="step-text">{formatMessage(labels.progress, { level, last: model.maxDepth, shown: level + 1, total: model.totalLevels })}</p>
        </div>
      </div>

      <section className="rt-calculation" aria-labelledby={`${id}-work-title`}>
        <h3 id={`${id}-work-title`}>{labels.table}</h3>
        <p className="rt-level-rule">{formatMessage(labels.rowRule, { size: example.sizeAtLevel, calls: example.callsAtLevel, own: example.ownAtLevel, work: example.workAtLevel })}</p>
        <div className="table-wrap rt-table-wrap" role="region" aria-labelledby={`${id}-work-title`} tabIndex={0}>
          <table className="rt-table"><thead><tr>{labels.columns.map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>
            {model.levels.slice(0, level + 1).map(item => <tr key={item.index} className={item.index === level ? 'current' : ''} data-level-row={item.index}>
              <th scope="row">{item.index}</th><td>{number(item.size)}</td><td>{number(item.nodeCount)}</td><td>{number(item.ownWork)}</td><td data-level-work={item.work}>{number(item.work)}</td>
            </tr>)}
          </tbody></table>
        </div>
        <p className="rt-note">{labels.workSymbol}</p>
        <dl className="rt-totals"><div><dt>{labels.revealedNodes}</dt><dd data-total-nodes={row.cumulativeNodes}>{number(row.cumulativeNodes)} / {number(model.totalNodes)}</dd></div><div><dt>{labels.revealedWork}</dt><dd data-total-work={row.cumulativeWork}>{number(row.cumulativeWork)}</dd></div></dl>
        <div className={`rt-result ${complete ? 'complete' : ''}`} role="status">
          {complete ? <><h4>{labels.result}</h4><p><code>{formatMessage(labels.sum, { sum: model.levels.map(item => number(item.work)).join(' + '), value: number(model.totalWork) })}</code></p><p className="rt-solution"><code>{formatMessage(labels.solution, { formula: example.total, value: number(model.totalWork), bound: example.bound })}</code></p></> : <p>{labels.partial}</p>}
        </div>
        <p className="rt-note">{labels.boundsNote}</p>
      </section>
    </div>
  </section>
}
