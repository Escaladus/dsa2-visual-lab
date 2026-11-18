import { useId } from 'react'
import useGraphTraversal from '../hooks/useGraphTraversal.js'
import { graphTraversalMoments } from '../data/graphTraversalLessons.js'
import {
  traversalExamples,
  dfsTraversalCode,
  bfsTraversalCode,
  traverseTraversalCode,
} from '../data/graphTraversal.js'
import { orderedTraversalGraph, traversalEdgeKey, traversalPath } from '../utils/graphTraversal.js'
import { graphLearningTranslations } from '../i18n/graphLearning.js'
import { graphTraversalTranslations } from '../i18n/graphTraversal.js'
import { recursionTracing } from '../i18n/recursionTracing.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import TraversalGraph from './TraversalGraph.jsx'
import CallTree from './RecursionTree.jsx'
import ExecutionCode from './ExecutionCode.jsx'
import RecursionTabs from './RecursionTabs.jsx'
import RecursionPlayback from './RecursionPlayback.jsx'
import TraversalFrontier from './TraversalFrontier.jsx'
import TraversalStepSummary from './TraversalStepSummary.jsx'
import TraversalStateTable from './TraversalStateTable.jsx'
import TraversalPractice from './TraversalPractice.jsx'
import {
  formatTraversalSequence as sequence,
  formatTraversalContinuation,
} from '../utils/graphTraversalPresentation.js'

export default function GraphTraversalLab({
  initialMode = 'dfs',
  onExampleSelect,
  presentation = 'practice',
  active = true,
}) {
  const { language, text } = useLanguage()
  const labels = graphTraversalTranslations[language]
  const common = text.recursion
  const id = useId()
  const learning = graphLearningTranslations[language]
  const colorsOnly = presentation === 'colors'
  const edgesOnly = presentation === 'edges'
  const practice = presentation === 'practice'
  const controller = useGraphTraversal({ initialMode, colorsOnly, edgesOnly, active })
  const {
    preset,
    start,
    all,
    reverse,
    mode,
    example,
    traces,
    frames,
    step,
    index,
    complete,
    layout,
    continuation,
  } = controller.trace
  const { playing, speed, seek, toggle, setSpeed } = controller.playback
  const {
    panel,
    setPanel,
    view,
    setView,
    wideCode,
    setWideCode,
    classification,
    setClassification,
  } = controller.workspace
  const { task, target, setTarget, launch } = controller.application
  const { stage, lesson } = controller.refs
  const { choose, switchMode, explore } = controller.actions
  const tracing = recursionTracing[language]
  const caption = formatTraversalContinuation(step, continuation, { colorsOnly, learning, labels })
  const current = step.nodes[step.current]
  const local = mode === 'dfs' ? current?.locals : step.locals
  const path =
    practice && complete && ['reach', 'shortest'].includes(task) ? traversalPath(step, target) : []
  const code = { dfs: dfsTraversalCode, bfs: bfsTraversalCode, traverse: traverseTraversalCode }[
    step.method
  ]
  const eventText = s =>
    colorsOnly && s.message.key === 'init'
      ? learning.initColors
      : formatMessage(labels.messages[s.message.key], s.message.values)
  const type = step.edge
    ? step.types[traversalEdgeKey(step.edge.from, step.edge.to, example.directed)]
    : null
  return (
    <section
      className={`lab-shell recursion-lab recursive-dfs-lab traversal-lab ${mode} traversal-presentation-${presentation}`}
      data-algorithm={mode}
      data-preset={preset}
      data-step={index}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>
        {colorsOnly ? learning.colorsTitle : edgesOnly ? learning.edgesTitle : labels.title}
      </h2>
      {onExampleSelect && (
        <div className="segmented dfs-example-switch">
          {['factorial', 'fibonacci'].map(kind => (
            <button key={kind} onClick={() => onExampleSelect(kind)}>
              {common.algorithms[kind][0]}
            </button>
          ))}
        </div>
      )}
      <p className="recursion-description">
        {colorsOnly ? learning.colorsIntro : edgesOnly ? learning.edgesIntro : labels.intro}
      </p>
      <details className="dfs-lesson traversal-lesson" ref={lesson}>
        <summary>{labels.lesson}</summary>
        {labels.lessons
          .filter((_, i) => !colorsOnly || i === (mode === 'dfs' ? 1 : 2))
          .map(([title, body]) => (
            <section key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </section>
          ))}
        {practice && (
          <>
            <h3>{labels.guided}</h3>
            <div className="traversal-guided">
              {Object.keys(graphTraversalMoments).map(key => (
                <button key={key} data-moment={key} onClick={() => explore(key)}>
                  {labels.moments[key]}
                </button>
              ))}
            </div>
          </>
        )}
      </details>
      {practice && (
        <div className="traversal-mode segmented" role="group" aria-label={text.ui.algorithm}>
          {['dfs', 'bfs'].map(algorithm => (
            <button
              key={algorithm}
              className={mode === algorithm ? 'selected' : ''}
              aria-pressed={mode === algorithm}
              onClick={() => switchMode(algorithm)}
            >
              {algorithm.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      {colorsOnly && (
        <div className="traversal-color-guide">
          {Object.entries(labels.colorHelp).map(([color, help]) => (
            <p key={color}>
              <span className={`traversal-state-badge ${color}`}>{color}</span> {help}
            </p>
          ))}
        </div>
      )}
      <div className="lab-toolbar dfs-toolbar traversal-toolbar">
        <label>
          {labels.example}
          <select value={preset} onChange={e => choose({ preset: e.target.value })}>
            {Object.keys(traversalExamples)
              .filter(key =>
                edgesOnly
                  ? traversalExamples[key].directed
                  : !colorsOnly || !traversalExamples[key].directed,
              )
              .map(key => (
                <option key={key} value={key}>
                  {labels.examples[key]}
                </option>
              ))}
          </select>
        </label>
        <label>
          {labels.start}
          <select value={start} onChange={e => choose({ start: Number(e.target.value) })}>
            {example.graph.map((_, v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          {labels.scope}
          <select value={String(all)} onChange={e => choose({ all: e.target.value === 'true' })}>
            <option value="false">{labels.reachable}</option>
            <option value="true">{labels.all}</option>
          </select>
        </label>
        <label>
          {labels.order}
          <select
            value={String(reverse)}
            onChange={e => choose({ reverse: e.target.value === 'true' })}
          >
            <option value="false">{labels.ascending}</option>
            <option value="true">{labels.descending}</option>
          </select>
        </label>
      </div>
      <p className="recursion-note">{example.directed ? labels.directed : labels.undirected}</p>
      {practice &&
        (mode === 'dfs' ? (
          <label className="traversal-class-toggle">
            <input
              type="checkbox"
              checked={classification}
              onChange={e => setClassification(e.target.checked)}
            />
            {labels.classify}
          </label>
        ) : (
          <p className="recursion-note">{labels.bfsNoTypes}</p>
        ))}
      <div
        className="recursion-stage traversal-stage"
        ref={stage}
        tabIndex={-1}
        aria-label={labels.title}
      >
        <div className="dfs-shared traversal-shared">
          <div>
            <strong>{labels.state}</strong>
            <div className="traversal-color-strip">
              {step.colors.map((color, v) => (
                <span
                  key={v}
                  className={`traversal-state-badge ${color}`}
                  title={`${v}: ${color} — ${labels.colorHelp[color]}`}
                >
                  {v}: {color[0]}
                </span>
              ))}
            </div>
          </div>
          {!colorsOnly && (
            <>
              <div>
                <strong>{mode === 'dfs' ? labels.pre : labels.discovery}</strong>
                <code>{sequence(step.pre)}</code>
              </div>
              <div>
                <strong>{mode === 'dfs' ? labels.post : labels.removed}</strong>
                <code>{sequence(mode === 'dfs' ? step.post : step.removed)}</code>
              </div>
            </>
          )}
        </div>
        <RecursionTabs
          id={id}
          tabs={(colorsOnly ? ['tree', 'stack'] : ['tree', 'code', 'stack']).map(key => [
            key,
            key === 'tree'
              ? labels.graph
              : key === 'code'
                ? common.enhancements.tabs.code
                : mode === 'dfs'
                  ? labels.stack
                  : labels.queue,
          ])}
          value={panel}
          onChange={setPanel}
          label={labels.title}
        />
        <div
          className="recursion-workspace dfs-workspace"
          data-mobile-panel={panel}
          data-code-expanded={wideCode}
        >
          {!colorsOnly && (
            <section
              className="recursion-panel recursion-code-panel"
              id={`${id}-code`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-code`}
            >
              <div className="dfs-code-heading">
                <h3>{labels.code}</h3>
                <button
                  className="dfs-code-width-toggle"
                  aria-pressed={wideCode}
                  onClick={() => setWideCode(v => !v)}
                >
                  {wideCode ? labels.restore : labels.expand}
                </button>
              </div>
              <code className="recursion-current-call">
                {step.method} {step.vertex !== null ? `(${step.vertex})` : ''} · {step.line ?? '—'}
              </code>
              <ExecutionCode
                code={code}
                line={step.line}
                label={labels.code}
                resume={continuation?.method === step.method ? continuation : null}
                caption={caption}
              />
            </section>
          )}
          <TraversalFrontier
            id={id}
            step={step}
            mode={mode}
            labels={labels}
            common={common}
            colorsOnly={colorsOnly}
            panel={panel}
          />
          <section
            className="recursion-panel recursion-tree-panel"
            id={`${id}-tree`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-tree`}
          >
            {mode === 'dfs' && !colorsOnly && (
              <div className="segmented dfs-view-switch">
                <button
                  aria-pressed={view === 'graph'}
                  className={view === 'graph' ? 'selected' : ''}
                  onClick={() => setView('graph')}
                >
                  {labels.graph}
                </button>
                <button
                  aria-pressed={view === 'calls'}
                  className={view === 'calls' ? 'selected' : ''}
                  onClick={() => setView('calls')}
                >
                  {labels.calls}
                </button>
              </div>
            )}
            {mode === 'dfs' && view === 'calls' ? (
              <CallTree
                step={step}
                layout={layout}
                kind="dfs"
                labels={common}
                nodeLabel={node => `dfs(${node.v})`}
                returnLabel={labels.returnControl}
              />
            ) : (
              <TraversalGraph
                example={example}
                step={step}
                labels={labels}
                classification={mode === 'dfs' && classification}
                path={path}
              />
            )}
          </section>
        </div>
        <TraversalStepSummary
          id={id}
          step={step}
          frames={frames}
          index={index}
          example={example}
          labels={labels}
          tracing={tracing}
          mode={mode}
          classification={classification}
          type={type}
          local={local}
          caption={caption}
          eventText={eventText}
          colorsOnly={colorsOnly}
        />
        <RecursionPlayback
          index={index}
          count={frames.length}
          playing={playing}
          speed={speed}
          onSeek={seek}
          onToggle={toggle}
          onReset={() => seek(0)}
          onSpeed={setSpeed}
          labels={{
            controls: labels.controls,
            moreControls: common.enhancements.moreControls,
            finish: labels.finish,
            reset: labels.reset,
            timeline: labels.timeline,
          }}
          ui={text.ui}
        />
      </div>
      <TraversalStateTable
        step={step}
        labels={labels}
        colorsOnly={colorsOnly}
        mode={mode}
        example={example}
        complete={complete}
      />
      {practice && (
        <TraversalPractice
          step={step}
          labels={labels}
          ui={text.ui}
          example={example}
          complete={complete}
          mode={mode}
          task={task}
          path={path}
          traces={traces}
          target={target}
          onTargetChange={setTarget}
          onLaunch={launch}
        />
      )}
      {!colorsOnly && (
        <details className="traversal-details">
          <summary>{labels.complexity}</summary>
          <p>{all ? labels.fullBound : labels.partialBound}</p>
          <div className="traversal-metrics">
            {[
              step.neighborChecks,
              step.outerChecks,
              step.metadataSlots,
              Object.keys(step.types).length,
              ...(mode === 'dfs' ? [step.nodes.length, step.maxDepth] : []),
            ].map((n, i) => (
              <p key={i}>
                {labels.metrics[i]}: <strong>{n}</strong>
              </p>
            ))}
          </div>
          <p>{labels.memory}</p>
        </details>
      )}
      <details className="adjacency-box">
        <summary>{labels.adjacency}</summary>
        <pre>
          {orderedTraversalGraph(example.graph, reverse)
            .map((row, v) => `${v}: [${row.join(', ')}]`)
            .join('\n')}
        </pre>
      </details>
    </section>
  )
}
