import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { dfsCode, dfsDriverCode, dfsExamples } from '../data/recursiveDfs.js'
import { dfsWalkthrough } from '../data/recursiveDfsLesson.js'
import { createRecursiveDfsTrace, dfsContinuation } from '../utils/recursiveDfs.js'
import { recursionTreeLayout } from '../utils/recursionAlgorithms.js'
import { recursiveDfsTranslations } from '../i18n/recursiveDfs.js'
import { recursionTracing } from '../i18n/recursionTracing.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import { handoutSections } from '../data/handout.js'
import CallTree from './RecursionTree.jsx'
import ExecutionCode from './ExecutionCode.jsx'
import RecursionPlayback from './RecursionPlayback.jsx'
import RecursionComplexity from './RecursionComplexity.jsx'
import RecursionTabs from './RecursionTabs.jsx'

const callName = node => `dfs(${node.v}) #${node.id + 1}`
const color = v => ({ '--call-fill': `hsl(${(v * 53 + 185) % 360} 34% 21%)`, '--call-stroke': `hsl(${(v * 53 + 185) % 360} 65% 70%)` })
const showOrder = values => values.length ? values.join(' → ') : '—'

function resumeText(step, continuation, labels) {
  if (!continuation) return null
  if (continuation.method === 'traverse') return formatMessage(labels.resumeDriver, continuation)
  const node = step.nodes[continuation.id]
  return formatMessage(labels.resumeDfs, { v: node.v, call: node.id + 1, i: continuation.nextI })
}

function DfsGraph({ example, step, labels }) {
  const marker = useId()
  const { graph, positions } = example
  const vertex = step.nodes[step.current]?.v ?? step.message.values.v ?? step.message.values.start
  const edges = graph.flatMap((neighbors, v) => neighbors.filter(next => v < next).map(next => [v, next]))
  const transfer = ['return', 'resume'].includes(step.message.key) ? step.returned : null
  const from = transfer && positions[transfer.v]
  const to = transfer?.to != null && positions[step.nodes[transfer.to].v]
  let arrow
  if (to) {
    const distance = Math.hypot(to.x - from.x, to.y - from.y)
    const along = part => ({ x: from.x + (to.x - from.x) * part, y: from.y + (to.y - from.y) * part })
    arrow = { start: along(25 / distance), end: along(1 - 28 / distance) }
  }
  return <div className="dfs-graph-view">
    <svg className="dfs-graph" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label={labels.graphLabel}>
      <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-2)" /></marker></defs>
      {edges.map(([v, next]) => {
        const focus = step.edge && [v, next].includes(step.edge.from) && [v, next].includes(step.edge.to)
        return <line key={`${v}-${next}`} data-edge={`${v}-${next}`} className={`dfs-edge ${focus ? 'focus' : ''}`} x1={positions[v].x} y1={positions[v].y} x2={positions[next].x} y2={positions[next].y} />
      })}
      {arrow && <line className="dfs-return-arrow" aria-label={labels.control} x1={arrow.start.x} y1={arrow.start.y} x2={arrow.end.x} y2={arrow.end.y} markerEnd={`url(#${marker})`} />}
      {positions.map((point, v) => <g key={v} data-vertex={v} data-visited={step.visited[v]} className={`dfs-vertex ${step.visited[v] ? 'visited' : ''} ${step.post.includes(v) ? 'finished' : ''} ${vertex === v ? 'current' : ''}`} transform={`translate(${point.x},${point.y})`}>
        <title>{formatMessage(labels.visitedEntry, { v, value: String(step.visited[v]) })}</title><circle r="22" /><text textAnchor="middle" dy=".35em">{v}</text>{step.post.includes(v) && <text className="dfs-finished-mark" x="18" y="-18" aria-hidden="true">✓</text>}
      </g>)}
    </svg>
    <div className="dfs-legend"><span><i className="legend-dot current" />{labels.active}</span><span><i className="legend-dot visited" />{labels.discovered}</span><span>✓ {labels.finished}</span></div>
    <p className="dfs-edge-caption">{arrow ? formatMessage(labels.returnEdge, { from: transfer.v, to: step.nodes[transfer.to].v }) : step.edge ? formatMessage(labels.edge, step.edge) : '—'}</p>
  </div>
}

function DfsSummary({ frames, index, labels, common, tracing }) {
  const id = useId(), scroll = useRef(null)
  const [panel, setPanel] = useState('context')
  const step = frames[index], next = frames[index + 1], current = step.nodes[step.current]
  const resume = resumeText(step, dfsContinuation(step), labels)
  const transfer = ['return', 'returnRoot', 'resume', 'rootResume'].includes(step.message.key) ? step.returned : null
  useEffect(() => { scroll.current.scrollTop = 0 }, [step])
  return <div className="recursion-step-summary" data-summary-panel={panel} ref={scroll}>
    <RecursionTabs id={id} tabs={['context', 'event'].map(key => [key, tracing[key]])} value={panel} onChange={setPanel} label={tracing.summary} className="recursion-summary-tabs" />
    <div className="recursion-summary-event" id={`${id}-event`} role="tabpanel" aria-labelledby={`${id}-tab-event`}>
      <p className="recursion-step-message" role="status">{formatMessage(labels.messages[step.message.key], step.message.values)}</p>
      {transfer && <div className="recursion-return-bridge active"><div className="recursion-return-flow"><code>{callName(step.nodes[transfer.from])}</code><b>↩</b>{transfer.to === null ? <code>traverse</code> : <code>{callName(step.nodes[transfer.to])}</code>}</div><p>{labels.control}</p></div>}
    </div>
    <dl className="recursion-step-context" id={`${id}-context`} role="tabpanel" aria-labelledby={`${id}-tab-context`}>
      <div><dt>{tracing.now}</dt><dd><code>{current ? callName(current) : 'traverse'}</code>{current && <span className="recursion-context-status"> · {common[current.status]}</span>}
        <code className="recursion-context-locals">{current ? Object.entries(current.locals).map(([name, value]) => `${name} = ${value}`).join(' · ') : step.message.values.v !== undefined ? `v = ${step.message.values.v}` : '—'}</code></dd></div>
      <div><dt>{tracing.resume}</dt><dd>{resume ?? (step.message.key === 'done' ? tracing.finished : '—')}</dd></div>
      <div><dt>{tracing.next}</dt><dd className="recursion-context-next">{next ? formatMessage(labels.messages[next.message.key], next.message.values) : tracing.finished}</dd></div>
    </dl>
  </div>
}

export default function RecursiveDfsLab({ onExampleSelect }) {
  const { text, language } = useLanguage()
  const labels = recursiveDfsTranslations[language], common = text.recursion, tracing = recursionTracing[language]
  const [preset, setPreset] = useState('branching'), [start, setStart] = useState(0), [all, setAll] = useState(false)
  const [index, setIndex] = useState(0), [playing, setPlaying] = useState(false), [speed, setSpeed] = useState(850)
  const [panel, setPanel] = useState('tree'), [view, setView] = useState('graph')
  const [wideCode, setWideCode] = useState(false)
  const stage = useRef(null), lesson = useRef(null), stackScroll = useRef(null), id = useId()
  const example = dfsExamples[preset]
  const frames = useMemo(() => createRecursiveDfsTrace(example.graph, start, all), [example, start, all])
  const layout = useMemo(() => recursionTreeLayout(frames.at(-1).nodes), [frames])
  const step = frames[index], last = frames.length - 1
  const continuation = dfsContinuation(step), caption = resumeText(step, continuation, labels)
  const current = step.nodes[step.current]

  useEffect(() => {
    if (!playing) return
    if (index === last) { setPlaying(false); return }
    const timer = setTimeout(() => setIndex(value => Math.min(value + 1, last)), speed)
    return () => clearTimeout(timer)
  }, [playing, index, last, speed])
  useEffect(() => { if (stackScroll.current) stackScroll.current.scrollTop = 0 }, [step.stack.at(-1), panel])

  function choose(nextPreset, nextStart, nextAll) {
    setPlaying(false); setIndex(0); setPreset(nextPreset); setStart(Math.min(nextStart, dfsExamples[nextPreset].graph.length - 1)); setAll(nextAll)
    setPanel('tree'); setView('graph')
  }
  function seek(value) { setPlaying(false); setIndex(Math.max(0, Math.min(last, value))) }
  function explore(moment) {
    choose('branching', 0, false); setIndex(moment.index); lesson.current.open = false
    requestAnimationFrame(() => { stage.current?.focus({ preventScroll: true }); stage.current?.scrollIntoView({ block: 'start', behavior: 'instant' }) })
  }

  return <section className="lab-shell recursion-lab recursive-dfs-lab" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`}>{labels.title}</h2>
    {onExampleSelect && <div className="segmented dfs-example-switch" role="group" aria-label={common.choose}>
      {['factorial', 'fibonacci'].map(kind => <button key={kind} aria-pressed="false" onClick={() => onExampleSelect(kind)}>{common.algorithms[kind][0]}</button>)}<button className="selected" aria-pressed="true">DFS</button>
    </div>}
    <p className="recursion-description">{labels.intro}</p>
    <details className="dfs-lesson" ref={lesson}>
      <summary>{labels.lesson}</summary>
      {labels.points.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}
      <h3>{labels.walkthrough}</h3>
      <ol className="recursion-walkthrough">{dfsWalkthrough.map(moment => <li key={moment.id} data-dfs-moment={moment.id}><h4>{labels.moments[moment.id][0]}</h4><p>{labels.moments[moment.id][1]}</p><button className="recursion-lesson-action" onClick={() => explore(moment)}>{labels.show}</button></li>)}</ol>
    </details>
    <div className="lab-toolbar dfs-toolbar">
      <label>{labels.example}<select value={preset} onChange={event => choose(event.target.value, start, all)}>{Object.keys(dfsExamples).map(key => <option key={key} value={key}>{labels.examples[key][0]}</option>)}</select></label>
      <label>{labels.start}<select value={start} onChange={event => choose(preset, Number(event.target.value), all)}>{example.graph.map((_, v) => <option key={v} value={v}>{v}</option>)}</select></label>
      <label>{labels.scope}<select value={String(all)} onChange={event => choose(preset, start, event.target.value === 'true')}><option value="false">{labels.reachable}</option><option value="true">{labels.all}</option></select></label>
    </div>
    <p className="recursion-note">{labels.examples[preset][1]} {labels.order}</p>
    <div className="recursion-stage" ref={stage} tabIndex={-1} aria-label={labels.title}>
      <div className="recursion-counters"><span>{formatMessage(labels.callsCount, { count: step.nodes.length })}</span><span>{formatMessage(labels.depth, { depth: step.maxDepth })}</span></div>
      <div className="dfs-shared" role="group" aria-label={labels.shared}>
        <div><strong>{labels.visited}</strong><div className="dfs-visited">{step.visited.map((value, v) => <code key={v} data-visited-vertex={v} data-value={String(value)} className={value ? 'seen' : ''} title={formatMessage(labels.visitedEntry, { v, value: String(value) })}>{v}: {value ? '✓' : '—'}</code>)}</div></div>
        <div><strong>{labels.pre}</strong><code className="dfs-pre">{showOrder(step.pre)}</code></div>
        <div><strong>{labels.post}</strong><code className="dfs-post">{showOrder(step.post)}</code></div>
      </div>
      <RecursionTabs id={id} tabs={['tree', 'code', 'stack'].map(key => [key, key === 'tree' ? labels.graph : key === 'code' ? text.recursion.enhancements.tabs.code : labels.stack])} value={panel} onChange={setPanel} label={labels.title} />
      <div className="recursion-workspace dfs-workspace" id={`${id}-workspace`} data-mobile-panel={panel} data-code-expanded={wideCode}>
        <section className="recursion-panel recursion-code-panel" id={`${id}-code`} role="tabpanel" aria-labelledby={`${id}-tab-code`} data-method={step.method}>
          <div className="dfs-code-heading"><h3>{labels.code}</h3><button className="dfs-code-width-toggle" aria-pressed={wideCode} aria-controls={`${id}-workspace`} onClick={() => setWideCode(value => !value)}>{wideCode ? labels.restoreLayout : labels.expandCode}</button></div>
          <code className="recursion-current-call">{current ? callName(current) : 'traverse'}{step.line !== null ? ` · ${formatMessage(tracing.line, { line: step.line })}` : ''}</code>
          <ExecutionCode code={step.method === 'dfs' ? dfsCode : dfsDriverCode} line={step.line} label={labels.code} resume={continuation?.method === step.method ? continuation : null} caption={caption} />
        </section>
        <section className="recursion-panel recursion-stack-panel" id={`${id}-stack`} role="tabpanel" aria-labelledby={`${id}-tab-stack`}>
          <div className="recursion-panel-heading"><h3>{labels.stack}</h3><details className="recursion-help"><summary aria-label={common.enhancements.stackHelp}>?</summary><p>{labels.recursiveOnly} {labels.localNote}</p></details></div>
          <div className="recursion-stack" ref={stackScroll} role="list" aria-label={labels.stack}>
            {[...step.stack].reverse().map(callId => { const node = step.nodes[callId]; return <div key={callId} data-call-id={callId} data-vertex={node.v} className={`recursion-stack-card ${node.status} ${step.message.key === 'return' && step.returned.to === callId ? 'receiving' : ''}`} role="listitem" style={color(node.v)}>
              <div><strong>{callName(node)}</strong><span>{common[node.status]}</span></div>
              <code>{Object.entries(node.locals).map(([name, value]) => `${name} = ${value}`).join(' · ')}</code>
              {node.continuation && <small className="recursion-stack-continuation">{formatMessage(labels.nextIndex, { i: node.continuation.nextI })}</small>}
            </div> })}
            {!step.stack.length && <p className="recursion-empty">{common.stackEmpty}</p>}
          </div>
        </section>
        <section className="recursion-panel recursion-tree-panel" id={`${id}-tree`} role="tabpanel" aria-labelledby={`${id}-tab-tree`}>
          <div className="segmented dfs-view-switch" role="group" aria-label={labels.rightView}><button className={view === 'graph' ? 'selected' : ''} aria-pressed={view === 'graph'} onClick={() => setView('graph')}>{labels.graph}</button><button className={view === 'calls' ? 'selected' : ''} aria-pressed={view === 'calls'} onClick={() => setView('calls')}>{labels.calls}</button></div>
          {view === 'graph' ? <DfsGraph example={example} step={step} labels={labels} /> : <CallTree step={step} layout={layout} kind="dfs" labels={common} nodeLabel={node => `dfs(${node.v})`} returnLabel={labels.control} />}
        </section>
      </div>
      <DfsSummary frames={frames} index={index} labels={labels} common={common} tracing={tracing} />
      <RecursionPlayback index={index} count={frames.length} playing={playing} speed={speed} onSeek={seek} onToggle={() => { if (index === last) setIndex(0); setPlaying(value => !value) }} onReset={() => seek(0)} onSpeed={setSpeed}
        labels={{ controls: labels.playback, moreControls: common.enhancements.moreControls, finish: labels.finish, reset: labels.reset, timeline: labels.timeline }} ui={text.ui} />
    </div>
    <RecursionComplexity frames={frames} index={index} graph={example.graph} all={all} onSeek={seek} />
    <details className="adjacency-box"><summary>{labels.adjacency}</summary><pre>{example.graph.map((neighbors, v) => `${v}: [${neighbors.join(', ')}]`).join('\n')}</pre></details>
    <p className="dfs-source">{text.ui.handout}: dsaII_handout.pdf · § {handoutSections['graph-dfs'].section} · {text.ui.handoutPages} {handoutSections['graph-dfs'].pages}</p>
    {!onExampleSelect && <a className="dfs-recursion-link" href="#recursion">{labels.recursionLink}</a>}
  </section>
}
