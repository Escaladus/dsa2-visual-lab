import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import RecursionPlayback from './RecursionPlayback.jsx'
import RecursionComplexity from './RecursionComplexity.jsx'
import { recursionTracing } from '../i18n/recursionTracing.js'
import RecursionLesson from './RecursionLesson.jsx'
import { recursionExamples } from '../data/recursion.js'
import {
  answerRecursionPrediction,
  createRecursionPrediction,
  createRecursionTrace,
  recursionTreeLayout,
} from '../utils/recursionAlgorithms.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import RecursionExecution from './RecursionExecution.jsx'
import RecursionComparison from './RecursionComparison.jsx'
import RecursionPrediction from './RecursionPrediction.jsx'

const RecursiveDfsLab = lazy(() => import('./RecursiveDfsLab.jsx'))

export default function RecursionLab() {
  const { text, language } = useLanguage()
  const labels = text.recursion
  const extra = labels.enhancements
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
  const memoFrames = useMemo(
    () => createRecursionTrace('fibonacci', Math.min(n, 6), { memoized: true }),
    [n],
  )
  const layout = useMemo(() => recursionTreeLayout(frames.at(-1).nodes), [frames])
  const memoLayout = useMemo(() => recursionTreeLayout(memoFrames.at(-1).nodes), [memoFrames])
  const step = frames[Math.min(index, frames.length - 1)]
  const count = comparing ? Math.max(frames.length, memoFrames.length) : frames.length
  const last = count - 1
  const question = practice && !comparing ? createRecursionPrediction(frames, index) : null
  const answer = answers[index]
  const needsPrediction = Boolean(question && !answer)

  useEffect(() => {
    if (!playing) {
      return
    }
    if (index === last || needsPrediction) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setIndex(value => Math.min(value + 1, last)), speed)
    return () => clearTimeout(timer)
  }, [playing, index, last, speed, needsPrediction])

  function choose(nextKind, nextN, compare = false) {
    setPlaying(false)
    setIndex(0)
    setAnswers({})
    setComparing(compare)
    setPanel('tree')
    setKind(nextKind)
    setN(Math.min(nextN, recursionExamples[nextKind].max))
  }
  function seek(value) {
    setPlaying(false)
    setIndex(Math.max(0, Math.min(last, value)))
  }
  function toggle() {
    if (index === last) {
      setIndex(0)
      setAnswers({})
    } else if (needsPrediction) {
      setIndex(index + 1)
    }
    setPlaying(value => !value)
  }

  if (showDfs) {
    return (
      <Suspense fallback={<p role="status">{extra.loading}</p>}>
        <RecursiveDfsLab
          onExampleSelect={id => {
            choose(id, n)
            setShowDfs(false)
          }}
        />
      </Suspense>
    )
  }

  return (
    <section className="lab-shell recursion-lab" aria-labelledby="recursion-lab-title">
      <h2 id="recursion-lab-title">{labels.title}</h2>
      <RecursionLesson
        onExplore={(nextKind, nextN, nextIndex, nextPanel) => {
          choose(nextKind, nextN)
          setPanel(nextPanel)
          setPractice(false)
          setIndex(nextIndex)
          requestAnimationFrame(() => {
            stage.current?.focus({ preventScroll: true })
            stage.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
          })
        }}
      />
      <div className="lab-toolbar">
        <div className="segmented" role="group" aria-label={labels.choose}>
          {Object.keys(recursionExamples).map(id => (
            <button
              key={id}
              className={kind === id ? 'selected' : ''}
              aria-pressed={kind === id}
              onClick={() => choose(id, n)}
            >
              {labels.algorithms[id][0]}
            </button>
          ))}
          <button
            aria-pressed="false"
            onClick={() => {
              setPlaying(false)
              setShowDfs(true)
            }}
          >
            DFS
          </button>
        </div>
        <label>
          {labels.input}
          <select value={n} onChange={event => choose(kind, Number(event.target.value), comparing)}>
            {Array.from({ length: recursionExamples[kind].max + 1 }, (_, value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="recursion-description">{labels.algorithms[kind][1]}</p>
      {kind === 'fibonacci' && (
        <div className="segmented recursion-view-switch">
          <button
            className={!comparing ? 'selected' : ''}
            aria-pressed={!comparing}
            onClick={() => choose(kind, n)}
          >
            {extra.individual}
          </button>
          <button
            className={comparing ? 'selected' : ''}
            aria-pressed={comparing}
            onClick={() => choose(kind, n, true)}
          >
            {extra.compare}
          </button>
        </div>
      )}
      {!comparing && (
        <label className="recursion-practice-toggle">
          <input
            type="checkbox"
            checked={practice}
            onChange={event => {
              setPractice(event.target.checked)
              setPlaying(false)
            }}
          />
          {extra.practice.toggle}
        </label>
      )}
      <div className="recursion-stage" ref={stage} tabIndex={-1} aria-label={extra.workspace}>
        {comparing ? (
          <RecursionComparison
            key={`compare-${n}`}
            frames={frames}
            memoFrames={memoFrames}
            layout={layout}
            memoLayout={memoLayout}
            index={index}
            labels={labels}
          />
        ) : (
          <RecursionExecution
            key={`${kind}-${n}`}
            frames={frames}
            index={index}
            layout={layout}
            kind={kind}
            labels={labels}
            panel={panel}
            onPanelChange={setPanel}
            hideNext={Boolean(question)}
          />
        )}
        {practice && !comparing && (
          <RecursionPrediction
            question={question}
            answer={answer}
            answers={answers}
            labels={practiceLabels}
            messages={labels.messages}
            onAnswer={value => {
              setPlaying(false)
              setAnswers(previous => answerRecursionPrediction(previous, index, question, value))
            }}
            onContinue={() => seek(index + 1)}
            onSkip={() => seek(index + 1)}
          />
        )}
        <RecursionPlayback
          index={index}
          count={count}
          playing={playing}
          speed={speed}
          onSeek={seek}
          onToggle={toggle}
          onReset={() => {
            seek(0)
            setAnswers({})
          }}
          onSpeed={setSpeed}
          labels={{
            controls: extra.controls,
            moreControls: extra.moreControls,
            finish: labels.finish,
            reset: labels.reset,
            timeline: labels.timeline,
          }}
          ui={text.ui}
        />
      </div>
      <RecursionComplexity
        kind={kind}
        n={n}
        frames={frames}
        index={index}
        memoFrames={comparing ? memoFrames : undefined}
        onSeek={seek}
      />
    </section>
  )
}
