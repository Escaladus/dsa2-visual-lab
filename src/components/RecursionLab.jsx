import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react'
import CallTree from './RecursionTree.jsx'
import ExecutionCode from './ExecutionCode.jsx'
import RecursionPlayback from './RecursionPlayback.jsx'
import RecursionComplexity from './RecursionComplexity.jsx'
import MobileTabs from './RecursionTabs.jsx'
import StepSummary from './RecursionStepSummary.jsx'
import { recursionTracing } from '../i18n/recursionTracing.js'
import RecursionLesson from './RecursionLesson.jsx'
import { memoizedFibonacciCode, recursionExamples } from '../data/recursion.js'
import { activeRecursionReturn, answerRecursionPrediction, createRecursionPrediction, createRecursionTrace, getRecursionStepContext, recursionExpression as expression, recursionTreeLayout } from '../utils/recursionAlgorithms.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'

const RecursiveDfsLab = lazy(() => import('./RecursiveDfsLab.jsx'))

const color = n => ({ '--call-fill': `hsl(${(n * 53 + 185) % 360} 34% 21%)`, '--call-stroke': `hsl(${(n * 53 + 185) % 360} 65% 70%)` })
const callName = (kind, node) => `${kind}(${node.n}) #${node.id + 1}`

function CodePanel({ step, code, labels, context, kind }) {
  const { language } = useLanguage()
  const tracing = recursionTracing[language]
  const resume = context?.resume
  const caption = resume ? formatMessage(tracing.codeResume, { call: callName(kind, step.nodes[resume.id]), line: resume.line, target: resume.target }) : null
  return <ExecutionCode code={code} line={step.line} label={labels.code} resume={resume} caption={caption} />
}

function Counters({ step, labels }) {
  return <div className="recursion-counters">
    <span>{formatMessage(labels.calls, { count: step.nodes.length })}</span>
    <span>{formatMessage(labels.depth, { depth: step.maxDepth })}</span>
    <strong className="recursion-final">{labels.result}: <code>{step.result ?? '—'}</code></strong>
  </div>
}

function Execution({ frames, index, layout, kind, labels, panel, onPanelChange, hideNext }) {
  const step = frames[index]
  const context = getRecursionStepContext(frames, index)
  const { language } = useLanguage()
  const tracing = recursionTracing[language]
  const stackScroll = useRef(null)
  const id = useId()
  const transfer = activeRecursionReturn(step)
  const extra = labels.enhancements
  useEffect(() => { if (stackScroll.current) stackScroll.current.scrollTop = 0 }, [step.stack.at(-1), panel])
  return <>
    <Counters step={step} labels={labels} />
    <MobileTabs id={id} tabs={Object.entries(extra.tabs)} value={panel} onChange={onPanelChange} label={extra.workspace} />
    <div className="recursion-workspace" data-mobile-panel={panel}>
      <section className="recursion-panel recursion-code-panel" id={`${id}-code`} role="tabpanel" aria-labelledby={`${id}-tab-code`}>
        <h3>{labels.code}</h3>
        {context.current && <code className="recursion-current-call">{callName(kind, context.current)} · {formatMessage(tracing.line, { line: step.line })}</code>}
        <CodePanel step={step} code={recursionExamples[kind].code} labels={labels} context={context} kind={kind} />
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
              {node.continuation && <small className="recursion-stack-continuation">{formatMessage(tracing.continuation, node.continuation)}</small>}
            </div>
          }) : <p className="recursion-empty">{labels.stackEmpty}</p>}
        </div>
      </section>
      <section className="recursion-panel recursion-tree-panel" id={`${id}-tree`} role="tabpanel" aria-labelledby={`${id}-tab-tree`}>
        <div className="recursion-panel-heading"><h3>{labels.tree}</h3><details className="recursion-help"><summary aria-label={extra.treeHelp}>?</summary><p>{labels.treeNote}</p></details></div>
        <CallTree step={step} layout={layout} kind={kind} labels={labels} />
      </section>
    </div>
    <StepSummary step={step} context={context} kind={kind} labels={labels} hideNext={hideNext} />
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
        <StepSummary step={step} context={getRecursionStepContext(trace, Math.min(index, trace.length - 1))} kind="fibonacci" labels={labels} />
        <details className="recursion-comparison-code"><summary>{labels.code}</summary><CodePanel step={step} code={code} labels={labels} context={getRecursionStepContext(trace, Math.min(index, trace.length - 1))} kind="fibonacci" /></details>
      </section>)}
    </div>
    {naive.result !== null && memo.result !== null && <div className="explanation-box recursion-comparison-result" role="status">{formatMessage(extra.comparisonResult, { value: naive.result, naive: naive.nodes.length, memoized: memo.nodes.length, hits: memo.cacheHits })}</div>}
  </div>
}

function Prediction({ question, answer, answers, onAnswer, onContinue, onSkip, labels, messages }) {
  const checked = Object.values(answers)
  return <div className="recursion-prediction">
    <p className="recursion-note">{labels.note}</p>
    <span className="step-text">{formatMessage(labels.score, { correct: checked.filter(item => item.correct).length, total: checked.length })}</span>
    {question ? <>
      <h3>{formatMessage(labels[question.key], question.values)}</h3>
      <div className="recursion-prediction-options" role="group" aria-label={formatMessage(labels[question.key], question.values)}>{question.choices.map(value => <button key={value} disabled={Boolean(answer)} aria-pressed={answer?.selected === value} onClick={() => onAnswer(value)}>{value}</button>)}</div>
      {!answer && <button className="recursion-prediction-skip" onClick={onSkip}>{labels.skip}</button>}
      {answer && <div role="status">
        <p>{answer.correct ? labels.correct : formatMessage(labels.incorrect, { value: question.answer })} {question.reason ? formatMessage(labels.reasons[question.reason.key], question.reason.values) : formatMessage(messages[question.explanation.key], question.explanation.values)}</p>
        <button onClick={onContinue}>{labels.continue}</button>
      </div>}
    </> : <p>{labels.waiting}</p>}
  </div>
}

export default function RecursionLab() {
  const { text, language } = useLanguage()
  const labels = text.recursion, extra = labels.enhancements
  const practiceLabels = { ...extra.practice, ...recursionTracing[language].practice }
  const [kind, setKind] = useState('factorial')
  const [showDfs, setShowDfs] = useState(false)
  const [n, setN] = useState(4)
  const [comparing, setComparing] = useState(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(850)
  const [practice, setPractice] = useState(false)
  const [answers, setAnswers] = useState({})
  const [panel, setPanel] = useState('tree')
  const stage = useRef(null)
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
    setPanel('tree')
    setKind(nextKind); setN(Math.min(nextN, recursionExamples[nextKind].max))
  }
  function seek(value) { setPlaying(false); setIndex(Math.max(0, Math.min(last, value))) }
  function toggle() {
    if (index === last) { setIndex(0); setAnswers({}) }
    else if (needsPrediction) setIndex(index + 1)
    setPlaying(value => !value)
  }

  if (showDfs) return <Suspense fallback={<p role="status">{extra.loading}</p>}><RecursiveDfsLab onExampleSelect={id => { choose(id, n); setShowDfs(false) }} /></Suspense>

  return <section className="lab-shell recursion-lab" aria-labelledby="recursion-lab-title">
    <h2 id="recursion-lab-title">{labels.title}</h2>
    <RecursionLesson onExplore={(nextKind, nextN, nextIndex, nextPanel) => {
      choose(nextKind, nextN)
      setPanel(nextPanel)
      setPractice(false)
      setIndex(nextIndex)
      requestAnimationFrame(() => {
        stage.current?.focus({ preventScroll: true })
        stage.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
      })
    }} />
    <div className="lab-toolbar">
      <div className="segmented" role="group" aria-label={labels.choose}>
        {Object.keys(recursionExamples).map(id => <button key={id} className={kind === id ? 'selected' : ''} aria-pressed={kind === id} onClick={() => choose(id, n)}>{labels.algorithms[id][0]}</button>)}
        <button aria-pressed="false" onClick={() => { setPlaying(false); setShowDfs(true) }}>DFS</button>
      </div>
      <label>{labels.input}<select value={n} onChange={event => choose(kind, Number(event.target.value), comparing)}>
        {Array.from({ length: recursionExamples[kind].max + 1 }, (_, value) => <option key={value} value={value}>{value}</option>)}
      </select></label>
    </div>
    <p className="recursion-description">{labels.algorithms[kind][1]}</p>
    {kind === 'fibonacci' && <div className="segmented recursion-view-switch"><button className={!comparing ? 'selected' : ''} aria-pressed={!comparing} onClick={() => choose(kind, n)}>{extra.individual}</button><button className={comparing ? 'selected' : ''} aria-pressed={comparing} onClick={() => choose(kind, n, true)}>{extra.compare}</button></div>}
    {!comparing && <label className="recursion-practice-toggle"><input type="checkbox" checked={practice} onChange={event => { setPractice(event.target.checked); setPlaying(false) }} />{extra.practice.toggle}</label>}
    <div className="recursion-stage" ref={stage} tabIndex={-1} aria-label={extra.workspace}>
      {comparing ? <Comparison key={`compare-${n}`} frames={frames} memoFrames={memoFrames} layout={layout} memoLayout={memoLayout} index={index} labels={labels} /> : <Execution key={`${kind}-${n}`} frames={frames} index={index} layout={layout} kind={kind} labels={labels} panel={panel} onPanelChange={setPanel} hideNext={Boolean(question)} />}
      {practice && !comparing && <Prediction question={question} answer={answer} answers={answers} labels={practiceLabels} messages={labels.messages} onAnswer={value => { setPlaying(false); setAnswers(previous => answerRecursionPrediction(previous, index, question, value)) }} onContinue={() => seek(index + 1)} onSkip={() => seek(index + 1)} />}
      <RecursionPlayback index={index} count={count} playing={playing} speed={speed} onSeek={seek} onToggle={toggle} onReset={() => { seek(0); setAnswers({}) }} onSpeed={setSpeed} labels={{ controls: extra.controls, moreControls: extra.moreControls, finish: labels.finish, reset: labels.reset, timeline: labels.timeline }} ui={text.ui} />
    </div>
    <RecursionComplexity kind={kind} n={n} frames={frames} index={index} memoFrames={comparing ? memoFrames : undefined} onSeek={seek} />
  </section>
}
