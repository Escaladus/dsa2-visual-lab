import { useEffect, useMemo, useState } from 'react'
import { adjacency, createBfsSteps, createDfsSteps, graphEdges, graphNodes } from '../utils/graphAlgorithms.js'

import { useLanguage } from '../i18n/LanguageContext.jsx'

const nodeKeys = Object.keys(graphNodes)

function GraphSvg({ step }) {
  const { text } = useLanguage()
  const visited = new Set(step?.visited ?? [])
  const current = step?.current
  const next = step?.next

  return (
    <svg className="graph-svg" viewBox="0 0 100 100" role="img" aria-label={text.ui.graph}>
      {graphEdges.map(([a, b]) => {
        const isFocus = (a === current && b === next) || (b === current && a === next)
        return (
          <line
            key={`${a}-${b}`}
            x1={graphNodes[a].x} y1={graphNodes[a].y}
            x2={graphNodes[b].x} y2={graphNodes[b].y}
            className={isFocus ? 'edge focus' : 'edge'}
          />
        )
      })}
      {nodeKeys.map(key => {
        const p = graphNodes[key]
        const state = key === current ? 'current' : visited.has(key) ? 'visited' : 'idle'
        return (
          <g key={key} className={`graph-node ${state}`}>
            <circle cx={p.x} cy={p.y} r="6.7" />
            <text x={p.x} y={p.y + 1.2} textAnchor="middle">{key}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function GraphLab({ initialMode = 'dfs' }) {
  const { text, message } = useLanguage()
  const [mode, setMode] = useState(initialMode)
  const [start, setStart] = useState('A')
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(850)

  useEffect(() => {
    setMode(initialMode)
    setIndex(0)
    setPlaying(false)
  }, [initialMode])

  const steps = useMemo(
    () => mode === 'dfs' ? createDfsSteps(start) : createBfsSteps(start),
    [mode, start],
  )
  const step = steps[index] ?? steps[0]

  useEffect(() => {
    if (!playing) return
    if (index >= steps.length - 1) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setIndex(i => Math.min(i + 1, steps.length - 1)), speed)
    return () => clearTimeout(timer)
  }, [playing, index, speed, steps.length])

  function reset() {
    setPlaying(false)
    setIndex(0)
  }

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented">
          <button className={mode === 'dfs' ? 'selected' : ''} onClick={() => { setMode('dfs'); reset() }}>DFS</button>
          <button className={mode === 'bfs' ? 'selected' : ''} onClick={() => { setMode('bfs'); reset() }}>BFS</button>
        </div>
        <label>
          {text.ui.start}
          <select value={start} onChange={e => { setStart(e.target.value); setIndex(0); setPlaying(false) }}>
            {nodeKeys.map(n => <option key={n}>{n}</option>)}
          </select>
        </label>
        <label className="speed-label">
          {text.ui.speed}
          <input type="range" min="250" max="1600" step="50" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </label>
      </div>

      <div className="graph-grid">
        <div className="visual-panel">
          <GraphSvg step={step} />
          <div className="legend-row">
            <span><i className="legend-dot idle" />{text.ui.idle}</span>
            <span><i className="legend-dot visited" />{text.ui.visited}</span>
            <span><i className="legend-dot current" />{text.ui.current}</span>
          </div>
        </div>

        <div className="state-panel">
          <div className="step-badge">{text.ui.step} {index + 1} / {steps.length}</div>
          <h3>{mode === 'dfs' ? text.ui.dfsStack : text.ui.bfsQueue}</h3>
          <div className="frontier">
            {(step?.frontier ?? []).length ? (step.frontier ?? []).map((v, i) => <span key={`${v}-${i}`}>{v}</span>) : <em>{text.ui.empty}</em>}
          </div>

          <div className="state-row">
            <strong>visited</strong>
            <code>{(step?.visited ?? []).join(' → ') || '—'}</code>
          </div>

          {mode === 'dfs' ? (
            <>
              <div className="state-row pre"><strong>PRE</strong><code>{(step?.pre ?? []).join(' → ') || '—'}</code></div>
              <div className="state-row post"><strong>POST</strong><code>{(step?.post ?? []).join(' → ') || '—'}</code></div>
              <p className="hint">{text.ui.dfsHint}</p>
            </>
          ) : (
            <>
              <div className="state-row"><strong>{text.ui.order}</strong><code>{(step?.order ?? []).join(' → ') || '—'}</code></div>
              <div className="distance-grid">
                {nodeKeys.map(n => <span key={n}>{n}: {step?.distance?.[n] ?? '∞'}</span>)}
              </div>
              <p className="hint">{text.ui.bfsHint}</p>
            </>
          )}

          <div className="explanation-box">{message(step.message.key, step.message.values)}</div>
        </div>
      </div>

      <div className="playback">
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}>{text.ui.back}</button>
        <button className="primary" onClick={() => setPlaying(p => !p)}>{playing ? text.ui.pause : text.ui.play}</button>
        <button onClick={() => setIndex(i => Math.min(steps.length - 1, i + 1))} disabled={index === steps.length - 1}>{text.ui.forward}</button>
        <button onClick={reset}>{text.ui.reset}</button>
      </div>

      <details className="adjacency-box">
        <summary>{text.ui.adjacency}</summary>
        <pre>{Object.entries(adjacency).map(([k, v]) => `${k}: [${v.join(', ')}]`).join('\n')}</pre>
      </details>
    </div>
  )
}
