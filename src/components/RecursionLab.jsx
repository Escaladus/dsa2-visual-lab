import { useEffect, useMemo, useRef, useState } from 'react'
import { recursionExamples } from '../data/recursion.js'
import { createRecursionTrace, recursionTreeLayout } from '../utils/recursionAlgorithms.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'

const color = n => ({ '--call-fill': `hsl(${(n * 53 + 185) % 360} 34% 21%)`, '--call-stroke': `hsl(${(n * 53 + 185) % 360} 65% 70%)` })

function CallTree({ step, layout, kind, labels }) {
  const scroll = useRef(null)
  useEffect(() => {
    const element = scroll.current
    const position = layout.positions[step.current ?? 0]
    if (!position) return
    const center = () => {
      element.scrollLeft = Math.max(0, position.x - element.clientWidth / 2)
      element.scrollTop = Math.max(0, position.y - element.clientHeight / 2)
    }
    center()
    const observer = new ResizeObserver(center)
    observer.observe(element)
    return () => observer.disconnect()
  }, [step.current, layout])
  return <div className="recursion-tree-scroll" ref={scroll} tabIndex={0}>
    <svg className="recursion-tree" width={layout.width} height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={labels.tree}>
      {step.nodes.filter(node => node.parent !== null).map(node => {
        const parent = layout.positions[node.parent], child = layout.positions[node.id]
        return <line key={node.id} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} className={step.stack.includes(node.id) ? 'recursion-edge active' : 'recursion-edge'} />
      })}
      {step.nodes.map(node => {
        const point = layout.positions[node.id]
        return <g key={node.id} data-call-id={node.id} data-n={node.n} className={`recursion-node ${node.status} ${step.current === node.id ? 'current' : ''}`} style={color(node.n)} transform={`translate(${point.x},${point.y})`}>
          <circle r="27" />
          <text textAnchor="middle" dy=".35em">{kind === 'factorial' ? 'fact' : 'fib'}({node.n})</text>
          <text className="recursion-call-id" textAnchor="middle" y="-32">#{node.id + 1}</text>
          {node.result !== null && <text className="recursion-node-result" textAnchor="middle" y="45">= {node.result}</text>}
        </g>
      })}
    </svg>
  </div>
}

function expression(node, kind) {
  if (node.n <= 1) return String(kind === 'factorial' ? 1 : node.n)
  return kind === 'factorial' ? `${node.n} × ${node.locals.child ?? '?'}` : `${node.locals.left ?? '?'} + ${node.locals.right ?? '?'}`
}

export default function RecursionLab() {
  const { text } = useLanguage()
  const labels = text.recursion
  const [kind, setKind] = useState('factorial')
  const [n, setN] = useState(4)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(850)
  const stackScroll = useRef(null)
  const frames = useMemo(() => createRecursionTrace(kind, n), [kind, n])
  const layout = useMemo(() => recursionTreeLayout(frames.at(-1).nodes), [frames])
  const step = frames[index]
  const last = frames.length - 1

  useEffect(() => {
    if (stackScroll.current) stackScroll.current.scrollTop = 0
  }, [step.stack.at(-1)])

  useEffect(() => {
    if (!playing) return
    if (index === last) { setPlaying(false); return }
    const timer = setTimeout(() => setIndex(value => Math.min(value + 1, last)), speed)
    return () => clearTimeout(timer)
  }, [playing, index, last, speed])

  function choose(nextKind, nextN) {
    setPlaying(false)
    setIndex(0)
    setKind(nextKind)
    setN(Math.min(nextN, recursionExamples[nextKind].max))
  }
  function seek(value) { setPlaying(false); setIndex(Math.max(0, Math.min(last, value))) }
  function toggle() { if (index === last) setIndex(0); setPlaying(value => !value) }

  return <section className="lab-shell recursion-lab" aria-labelledby="recursion-lab-title">
    <h2 id="recursion-lab-title">{labels.title}</h2>
    <div className="lab-toolbar">
      <div className="segmented" role="group" aria-label={labels.choose}>
        {Object.keys(recursionExamples).map(id => <button key={id} className={kind === id ? 'selected' : ''} aria-pressed={kind === id} onClick={() => choose(id, n)}>{labels.algorithms[id][0]}</button>)}
      </div>
      <label>{labels.input}<select value={n} onChange={event => choose(kind, Number(event.target.value))}>
        {Array.from({ length: recursionExamples[kind].max + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}
      </select></label>
    </div>
    <p className="recursion-description">{labels.algorithms[kind][1]}</p>
    <div className="recursion-counters">
      <span>{formatMessage(labels.calls, { count: step.nodes.length })}</span>
      <span>{formatMessage(labels.depth, { depth: step.maxDepth })}</span>
      <strong className="recursion-final">{labels.result}: <code>{step.result ?? '—'}</code></strong>
    </div>
    <div className="recursion-panels">
      <div className="recursion-panel">
        <h3>{labels.code}</h3>
        <pre className="code-block recursion-code" tabIndex={0} aria-label={labels.code}><code>{recursionExamples[kind].code.split('\n').map((line, i) => (
          <span key={i} data-line={i + 1} className={`recursion-code-line ${step.line === i + 1 ? 'current' : ''}`}><span aria-hidden="true">{i + 1}</span><span>{line}</span></span>
        ))}</code></pre>
        <div className="recursion-return"><h4>{labels.returned}</h4><code>{step.returned ? `${kind}(${step.nodes[step.returned.from].n}) → ${step.returned.value}` : '—'}</code></div>
      </div>
      <div className="recursion-panel">
        <h3>{labels.stack}</h3>
        <p className="recursion-note">{labels.stackNote}</p>
        <div className="recursion-stack" ref={stackScroll} role="list" aria-label={labels.stack}>
          {step.stack.length ? [...step.stack].reverse().map(id => {
            const node = step.nodes[id]
            return <div key={id} className={`recursion-stack-card ${node.status}`} data-call-id={id} role="listitem" style={color(node.n)}>
              <div><strong>{kind}({node.n})</strong><small>{formatMessage(labels.call, { id: id + 1 })}</small><span>{labels[node.status]}</span></div>
              <code>{Object.entries(node.locals).map(([key, value]) => `${key} = ${value ?? '?'}`).join(' · ')}</code>
              <code>{expression(node, kind)}{node.result !== null ? ` = ${node.result}` : ''}</code>
            </div>
          }) : <p className="recursion-empty">{labels.stackEmpty}</p>}
        </div>
      </div>
    </div>
    <div className="recursion-panel recursion-tree-panel">
      <h3>{labels.tree}</h3>
      <p className="recursion-note">{labels.treeNote}</p>
      <CallTree step={step} layout={layout} kind={kind} labels={labels} />
    </div>
    <div className="explanation-box" aria-live="polite">{formatMessage(labels.messages[step.message.key], step.message.values)}</div>
    <div className="sorting-timeline"><span className="step-text">{text.ui.step} {index + 1} / {frames.length}</span><input type="range" min="0" max={last} value={index} aria-label={labels.timeline} onChange={event => seek(Number(event.target.value))} /></div>
    <div className="playback">
      <button disabled={index === 0} onClick={() => seek(index - 1)}>{text.ui.back}</button>
      <button className="primary" onClick={toggle}>{playing ? text.ui.pause : text.ui.play}</button>
      <button disabled={index === last} onClick={() => seek(index + 1)}>{text.ui.next}</button>
      <button disabled={index === last} onClick={() => seek(last)}>{labels.finish}</button>
      <button onClick={() => seek(0)}>{labels.reset}</button>
    </div>
    <label className="sorting-speed">{text.ui.speed}<input type="range" min="200" max="1600" step="100" value={speed} onChange={event => setSpeed(Number(event.target.value))} /></label>
  </section>
}
