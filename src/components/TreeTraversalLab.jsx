import { useEffect, useMemo, useState } from 'react'

import { useLanguage } from '../i18n/LanguageContext.jsx'

const nodes = {
  A: { x: 50, y: 10 },
  B: { x: 27, y: 35 },
  C: { x: 73, y: 35 },
  D: { x: 14, y: 68 },
  E: { x: 38, y: 68 },
  F: { x: 62, y: 68 },
  G: { x: 86, y: 68 },
}
const edges = [['A','B'],['A','C'],['B','D'],['B','E'],['C','F'],['C','G']]
const tree = { A:['B','C'], B:['D','E'], C:['F','G'], D:[], E:[], F:[], G:[] }

function makeSteps(type) {
  const out = []
  const order = []
  function walk(v) {
    if (type === 'pre') { order.push(v); out.push({ current:v, order:[...order], message: 'treePre' }) }
    const [left, right] = tree[v]
    if (left) walk(left)
    if (type === 'in') { order.push(v); out.push({ current:v, order:[...order], message: 'treeIn' }) }
    if (right) walk(right)
    if (type === 'post') { order.push(v); out.push({ current:v, order:[...order], message: 'treePost' }) }
  }
  walk('A')
  return out
}

export default function TreeTraversalLab() {
  const { text, message } = useLanguage()
  const [type, setType] = useState('pre')
  const [index, setIndex] = useState(0)
  const steps = useMemo(() => makeSteps(type), [type])
  const step = steps[index]
  const done = new Set(step?.order ?? [])

  useEffect(() => setIndex(0), [type])

  return (
    <div className="lab-shell">
      <div className="lab-toolbar">
        <div className="segmented three">
          <button className={type === 'pre' ? 'selected' : ''} onClick={() => setType('pre')}>PRE</button>
          <button className={type === 'in' ? 'selected' : ''} onClick={() => setType('in')}>IN</button>
          <button className={type === 'post' ? 'selected' : ''} onClick={() => setType('post')}>POST</button>
        </div>
      </div>
      <div className="tree-grid">
        <svg className="tree-svg" viewBox="0 0 100 82" role="img" aria-label={text.ui.tree}>
          {edges.map(([a,b]) => <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />)}
          {Object.entries(nodes).map(([k,p]) => (
            <g key={k} className={`tree-node ${k === step?.current ? 'current' : done.has(k) ? 'done' : ''}`}>
              <circle cx={p.x} cy={p.y} r="7"/><text x={p.x} y={p.y+1.3} textAnchor="middle">{k}</text>
            </g>
          ))}
        </svg>
        <div className="state-panel">
          <div className="step-badge">{text.ui.step} {index + 1} / {steps.length}</div>
          <h3>{text.ui.result}</h3>
          <div className="order-pills">{(step?.order ?? []).map((v,i)=><span key={`${v}-${i}`}>{v}</span>)}</div>
          <div className="explanation-box">{message(step.message, { v: step.current })}</div>
          <div className="mini-rule">
            {type === 'pre' && <><b>PRE:</b> {text.ui.root} → {text.ui.left} → {text.ui.right}</>}
            {type === 'in' && <><b>IN:</b> {text.ui.left} → {text.ui.root} → {text.ui.right}</>}
            {type === 'post' && <><b>POST:</b> {text.ui.left} → {text.ui.right} → {text.ui.root}</>}
          </div>
        </div>
      </div>
      <div className="playback">
        <button onClick={() => setIndex(i=>Math.max(0,i-1))} disabled={index===0}>{text.ui.back}</button>
        <button className="primary" onClick={() => setIndex(i=>Math.min(steps.length-1,i+1))} disabled={index===steps.length-1}>{text.ui.next}</button>
        <button onClick={() => setIndex(0)}>{text.ui.reset}</button>
      </div>
    </div>
  )
}
