import { useEffect, useId, useMemo, useRef, useState } from 'react'
import CallTree from './RecursionTree.jsx'
import { memoizedFibonacciCode, recursionExamples } from '../data/recursion.js'
import { activeRecursionReturn, createRecursionPrediction, createRecursionTrace, recursionTreeLayout } from '../utils/recursionAlgorithms.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'

const color = n => ({ '--call-fill': `hsl(${(n * 53 + 185) % 360} 34% 21%)`, '--call-stroke': `hsl(${(n * 53 + 185) % 360} 65% 70%)` })
const callName = (kind, node) => `${kind}(${node.n}) #${node.id + 1}`

function expression(node, kind) {
  if (node.n <= 1) return String(kind === 'factorial' ? 1 : node.n)
  return kind === 'factorial' ? `${node.n} × ${node.locals.child ?? '?'}` : `${node.locals.left ?? '?'} + ${node.locals.right ?? '?'}`
}

function ReturnBridge({ step, kind, labels }) {
  const active = activeRecursionReturn(step)
  const transfer = active
  if (!transfer) return null
  const parent = transfer.to === null ? null : step.nodes[transfer.to]
  let continuation
  if (parent) {
    const locals = { ...parent.locals }
    const from = step.nodes[transfer.from]
    const siblings = step.nodes.filter(node => node.parent === parent.id)
    locals[kind === 'factorial' ? 'child' : siblings[0].id === from.id ? 'left' : 'right'] = transfer.value
    continuation = expression({ ...parent, locals }, kind)
  }
  return <div className={`recursion-return-bridge ${active ? 'active' : ''}`} aria-live="polite">
    <strong>{active && parent ? labels.enhancements.returnTo : labels.returned}</strong>
    <div className="recursion-return-flow">
      <code>{callName(kind, step.nodes[transfer.from])}</code><span aria-hidden="true">→</span>
      <b>{transfer.value}</b><span aria-hidden="true">→</span>
      {parent ? <code>{callName(kind, parent)}</code> : <span>{labels.enhancements.program}</span>}
    </div>
    {parent && active && <p>{labels.enhancements.resume}: <code>{continuation}</code></p>}
  </div>
}

function CodePanel({ step, code, labels }) {
  const scroll = useRef(null)
  useEffect(() => {
    const element = scroll.current
    const center = () => {
      const active = element.querySelector('.current')
      if (active && element.clientHeight) element.scrollTop = Math.max(0, active.offsetTop - element.clientHeight / 2 + active.offsetHeight / 2)
    }
    center()
    const observer = new ResizeObserver(center)
    observer.observe(element)
    return () => observer.disconnect()
  }, [step.line])
  return <pre ref={scroll} className="code-block recursion-code" tabIndex={0} aria-label={labels.code}><code>{code.split('\n').map((line, i) => (
    <span key={i} data-line={i + 1} className={`recursion-code-line ${step.line === i + 1 ? 'current' : ''}`}><span aria-hidden="true">{i + 1}</span><span>{line}</span></span>
  ))}</code></pre>
}

function Counters({ step, labels }) {
  return <div className="recursion-counters">
    <span>{formatMessage(labels.calls, { count: step.nodes.length })}</span>
    <span>{formatMessage(labels.depth, { depth: step.maxDepth })}</span>
    <strong className="recursion-final">{labels.result}: <code>{step.result ?? '—'}</code></strong>
  </div>
}

function MobileTabs({ id, tabs, value, onChange, label }) {
  return <div className="recursion-mobile-tabs" role="tablist" aria-label={label}>
    {tabs.map(([key, title], index) => <button key={key} id={`${id}-tab-${key}`} role="tab" aria-selected={value === key} aria-controls={`${id}-${key}`} tabIndex={value === key ? 0 : -1} onClick={() => onChange(key)} onKeyDown={event => {
      let next
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
      if (event.key === 'Home') next = 0
      if (event.key === 'End') next = tabs.length - 1
      if (next === undefined) return
      event.preventDefault()
      onChange(tabs[next][0])
      event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus()
    }}>{title}</button>)}
  </div>
}

function StepSummary({ step, kind, labels }) {
  return <div className="recursion-step-summary">
    <p className="recursion-step-message" role="status">{formatMessage(labels.messages[step.message.key], step.message.values)}</p>
    <ReturnBridge step={step} kind={kind} labels={labels} />
  </div>
}

function Execution({ step, layout, kind, labels }) {
  const stackScroll = useRef(null)
  const [panel, setPanel] = useState('tree')
  const id = useId()
  const transfer = activeRecursionReturn(step)
  const extra = labels.enhancements
  useEffect(() => { if (stackScroll.current) stackScroll.current.scrollTop = 0 }, [step.stack.at(-1), panel])
  return <>
    <Counters step={step} labels={labels} />
    <MobileTabs id={id} tabs={Object.entries(extra.tabs)} value={panel} onChange={setPanel} label={extra.workspace} />
    <div className="recursion-workspace" data-mobile-panel={panel}>
      <section className="recursion-panel recursion-code-panel" id={`${id}-code`} role="tabpanel" aria-labelledby={`${id}-tab-code`}>
        <h3>{labels.code}</h3>
        <CodePanel step={step} code={recursionExamples[kind].code} labels={labels} />
      </section>
      <section className="recursion-panel recursion-stack-panel" id={`${id}-stack`} role="tabpanel" aria-labelledby={`${id}-tab-stack`}>
        <div className="recursion-panel-heading"><h3>{labels.stack}</h3><details className="recursion-help"><summary aria-label={extra.stackHelp}>?</summary><p>{labels.stackNote}</p></details></div>
        <div className="recursion-stack" ref={stackScroll} role="list" aria-label={labels.stack}>
          {step.stack.length ? [...step.stack].reverse().map(id => {
            const node = step.nodes[id]
            return <div key={id} className={`recursion-stack-card ${node.status} ${transfer?.to === id ? 'receiving' : ''}`} data-call-id={id} role="listitem" style={color(node.n)}>
              <div><strong>{kind}({node.n})</strong><small>{formatMessage(labels.call, { id: id + 1 })}</small><span>{labels[node.status]}</span></div>
              <code>{Object.entries(node.locals).map(([key, value]) => `${key} = ${value ?? '?'}`).join(' · ')}</code>
              <code>{expression(node, kind)}{node.result !== null ? ` = ${node.result}` : ''}</code>
            </div>
          }) : <p className="recursion-empty">{labels.stackEmpty}</p>}
        </div>
      </section>
      <section className="recursion-panel recursion-tree-panel" id={`${id}-tree`} role="tabpanel" aria-labelledby={`${id}-tab-tree`}>
        <div className="recursion-panel-heading"><h3>{labels.tree}</h3><details className="recursion-help"><summary aria-label={extra.treeHelp}>?</summary><p>{labels.treeNote}</p></details></div>
        <CallTree step={step} layout={layout} kind={kind} labels={labels} />
      </section>
    </div>
    <StepSummary step={step} kind={kind} labels={labels} />
  </>
}

function Comparison({ frames, memoFrames, layout, memoLayout, index, labels }) {
  const extra = labels.enhancements
  const [panel, setPanel] = useState('naive')
  const id = useId()
  const memo = memoFrames[Math.min(index, memoFrames.length - 1)]
  const naive = frames[Math.min(index, frames.length - 1)]
  return <div className="recursion-comparison">
    <h3>{extra.comparisonTitle}</h3>
    <details className="recursion-comparison-note"><summary>{extra.comparisonHelp}</summary><p className="recursion-note">{extra.comparisonNote}</p></details>
    <MobileTabs id={id} tabs={['naive', 'memoized'].map(key => [key, extra[key]])} value={panel} onChange={setPanel} label={extra.comparisonTitle} />
    <div className="recursion-comparison-grid" data-mobile-panel={panel}>
      {[{ id: 'naive', step: naive, trace: frames, treeLayout: layout, code: recursionExamples.fibonacci.code }, { id: 'memoized', step: memo, trace: memoFrames, treeLayout: memoLayout, code: memoizedFibonacciCode }].map(({ id: executionId, step, trace, treeLayout, code }) => <section key={executionId} id={`${id}-${executionId}`} role="tabpanel" aria-labelledby={`${id}-tab-${executionId}`} className="recursion-panel" data-execution={executionId}>
        <h3>{extra[executionId]}</h3><p className="recursion-note">{extra[executionId + 'Cost']}</p>
        <span className="step-text">{formatMessage(extra.localStep, { current: Math.min(index + 1, trace.length), total: trace.length })}</span>
        <Counters step={step} labels={labels} />
        <strong className={`recursion-cache-hits ${executionId === 'naive' ? 'placeholder' : ''}`} aria-hidden={executionId === 'naive'}>{formatMessage(extra.hits, { count: step.cacheHits })}{executionId === 'memoized' && ` · ✓ ${extra.cached}`}</strong>
        <CallTree step={step} layout={treeLayout} kind="fibonacci" labels={labels} />
        {executionId === 'memoized' && <div className="recursion-cache">
          <h4>{extra.cache}</h4>
          <div className="recursion-cache-values">{Object.keys(memo.cache).length ? Object.entries(memo.cache).map(([key, value]) => <code key={key} className={memo.message.key === 'cacheHit' && String(memo.message.values.n) === key ? 'hit' : ''}>memo[{key}] = {value}</code>) : <span>{extra.cacheEmpty}</span>}</div>
          <details><summary>{extra.cacheHelp}</summary><p className="recursion-note">{extra.cacheNote}</p><code>Long[] memo = new Long[n + 1];</code></details>
        </div>}
        <StepSummary step={step} kind="fibonacci" labels={labels} />
        <details className="recursion-comparison-code"><summary>{labels.code}</summary><CodePanel step={step} code={code} labels={labels} /></details>
      </section>)}
    </div>
    {naive.result !== null && memo.result !== null && <div className="explanation-box recursion-comparison-result" role="status">{formatMessage(extra.comparisonResult, { value: naive.result, naive: naive.nodes.length, memoized: memo.nodes.length, hits: memo.cacheHits })}</div>}
  </div>
}

function Prediction({ question, answer, answers, onAnswer, onContinue, labels, messages }) {
  const checked = Object.values(answers)
  return <div className="recursion-prediction">
    <p className="recursion-note">{labels.note}</p>
    <span className="step-text">{formatMessage(labels.score, { correct: checked.filter(item => item.correct).length, total: checked.length })}</span>
    {question ? <>
      <h3>{labels[question.key]}</h3>
      <div className="recursion-prediction-options" role="group" aria-label={labels[question.key]}>{question.choices.map(value => <button key={value} disabled={Boolean(answer)} aria-pressed={answer?.selected === value} onClick={() => onAnswer(value)}>{value}</button>)}</div>
      {answer && <div role="status">
        <p>{answer.correct ? labels.correct : formatMessage(labels.incorrect, { value: question.answer })} {formatMessage(messages[question.explanation.key], question.explanation.values)}</p>
        <button onClick={onContinue}>{labels.continue}</button>
      </div>}
    </> : <p>{labels.waiting}</p>}
  </div>
}

export default function RecursionLab() {
  const { text } = useLanguage()
  const labels = text.recursion, extra = labels.enhancements
  const [kind, setKind] = useState('factorial')
  const [n, setN] = useState(4)
  const [comparing, setComparing] = useState(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(850)
  const [practice, setPractice] = useState(false)
  const [answers, setAnswers] = useState({})
  const frames = useMemo(() => createRecursionTrace(kind, n), [kind, n])
  const memoFrames = useMemo(() => createRecursionTrace('fibonacci', Math.min(n, 6), { memoized: true }), [n])
  const layout = useMemo(() => recursionTreeLayout(frames.at(-1).nodes), [frames])
  const memoLayout = useMemo(() => recursionTreeLayout(memoFrames.at(-1).nodes), [memoFrames])
  const step = frames[Math.min(index, frames.length - 1)]
  const count = comparing ? Math.max(frames.length, memoFrames.length) : frames.length
  const last = count - 1
  const question = practice && !comparing ? createRecursionPrediction(frames, index) : null
  const answer = answers[index]
  const needsPrediction = Boolean(question && !answer)

  useEffect(() => {
    if (!playing) return
    if (index === last || needsPrediction) { setPlaying(false); return }
    const timer = setTimeout(() => setIndex(value => Math.min(value + 1, last)), speed)
    return () => clearTimeout(timer)
  }, [playing, index, last, speed, needsPrediction])

  function choose(nextKind, nextN, compare = false) {
    setPlaying(false); setIndex(0); setAnswers({}); setComparing(compare)
    setKind(nextKind); setN(Math.min(nextN, recursionExamples[nextKind].max))
  }
  function seek(value) { setPlaying(false); setIndex(Math.max(0, Math.min(last, value))) }
  function toggle() {
    if (index === last) { setIndex(0); setAnswers({}) }
    else if (needsPrediction) setIndex(index + 1)
    setPlaying(value => !value)
  }

  return <section className="lab-shell recursion-lab" aria-labelledby="recursion-lab-title">
    <h2 id="recursion-lab-title">{labels.title}</h2>
    <div className="lab-toolbar">
      <div className="segmented" role="group" aria-label={labels.choose}>
        {Object.keys(recursionExamples).map(id => <button key={id} className={kind === id ? 'selected' : ''} aria-pressed={kind === id} onClick={() => choose(id, n)}>{labels.algorithms[id][0]}</button>)}
      </div>
      <label>{labels.input}<select value={n} onChange={event => choose(kind, Number(event.target.value), comparing)}>
        {Array.from({ length: recursionExamples[kind].max + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}
      </select></label>
    </div>
    <p className="recursion-description">{labels.algorithms[kind][1]}</p>
    {kind === 'fibonacci' && <div className="segmented recursion-view-switch"><button className={!comparing ? 'selected' : ''} aria-pressed={!comparing} onClick={() => choose(kind, n)}>{extra.individual}</button><button className={comparing ? 'selected' : ''} aria-pressed={comparing} onClick={() => choose(kind, n, true)}>{extra.compare}</button></div>}
    {!comparing && <label className="recursion-practice-toggle"><input type="checkbox" checked={practice} onChange={event => { setPractice(event.target.checked); setPlaying(false) }} />{extra.practice.toggle}</label>}
    <div className="recursion-stage">
      {comparing ? <Comparison key={`compare-${n}`} frames={frames} memoFrames={memoFrames} layout={layout} memoLayout={memoLayout} index={index} labels={labels} /> : <Execution key={`${kind}-${n}`} step={step} layout={layout} kind={kind} labels={labels} />}
      {practice && !comparing && <Prediction question={question} answer={answer} answers={answers} labels={extra.practice} messages={labels.messages} onAnswer={value => { setPlaying(false); setAnswers(previous => ({ ...previous, [index]: { selected: value, correct: value === question.answer } })) }} onContinue={() => seek(index + 1)} />}
      <div className="recursion-bottom-controls" role="group" aria-label={extra.controls}>
        <div className="recursion-controls-main">
          <div className="playback">
            <button disabled={index === 0} onClick={() => seek(index - 1)}>{text.ui.back}</button>
            <button onClick={toggle}>{playing ? text.ui.pause : text.ui.play}</button>
            <button className="primary" disabled={index === last} onClick={() => seek(index + 1)}>{text.ui.next}</button>
          </div>
          <details className="recursion-control-options" onKeyDown={event => {
            if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary').focus() }
          }}>
            <summary aria-label={extra.moreControls} title={extra.moreControls}>⋯</summary>
            <div className="recursion-options-popover">
              <button disabled={index === last} onClick={event => { event.currentTarget.closest('details').open = false; seek(last) }}>{labels.finish}</button>
              <button onClick={event => { event.currentTarget.closest('details').open = false; seek(0); setAnswers({}) }}>{labels.reset}</button>
              <label className="sorting-speed">{text.ui.speed}<input type="range" min="200" max="1600" step="100" value={speed} onChange={event => setSpeed(Number(event.target.value))} /></label>
            </div>
          </details>
        </div>
        <div className="sorting-timeline"><span className="step-text">{text.ui.step} {index + 1} / {count}</span><input type="range" min="0" max={last} value={index} aria-label={labels.timeline} onChange={event => seek(Number(event.target.value))} /></div>
      </div>
    </div>
  </section>
}
