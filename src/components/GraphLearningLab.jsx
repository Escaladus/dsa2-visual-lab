import { lazy, Suspense, useId, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { graphLearningTranslations } from '../i18n/graphLearning.js'
import RecursionTabs from './RecursionTabs.jsx'

const BasicDfsLab = lazy(() => import('./BasicDfsLab.jsx'))
const BasicBfsLab = lazy(() => import('./BasicBfsLab.jsx'))
const GraphTraversalLab = lazy(() => import('./GraphTraversalLab.jsx'))

export default function GraphLearningLab({ initialMode = 'dfs', onExampleSelect }) {
  const { text, language } = useLanguage()
  const labels = graphLearningTranslations[language]
  const id = useId()
  const [algorithm, setAlgorithm] = useState(initialMode)
  const [tab, setTab] = useState('basic')
  // Keep visited panels mounted: their private steps, answers and zoom survive tab changes.
  const [visited, setVisited] = useState([`${initialMode}-basic`])
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [practiceVisited, setPracticeVisited] = useState(false)
  const current = `${algorithm}-${tab}`

  function select(nextAlgorithm, nextTab) {
    const key = `${nextAlgorithm}-${nextTab}`
    setAlgorithm(nextAlgorithm)
    setTab(nextTab)
    setVisited(previous => (previous.includes(key) ? previous : [...previous, key]))
  }

  return (
    <div className="graph-learning-lab" data-view={tab} data-algorithm={algorithm}>
      {onExampleSelect && current !== 'dfs-basic' && (
        <div
          className="segmented dfs-example-switch"
          role="group"
          aria-label={text.recursion.choose}
        >
          {['factorial', 'fibonacci'].map(kind => (
            <button key={kind} onClick={() => onExampleSelect(kind)}>
              {text.recursion.algorithms[kind][0]}
            </button>
          ))}
        </div>
      )}
      <div className="segmented dfs-section-switch" role="group" aria-label={text.ui.algorithm}>
        {['dfs', 'bfs'].map(mode => (
          <button
            key={mode}
            className={algorithm === mode ? 'selected' : ''}
            aria-pressed={algorithm === mode}
            onClick={() => select(mode, mode === 'bfs' && tab === 'edges' ? 'colors' : tab)}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="graph-learning-intro">{labels.intro}</p>
      <RecursionTabs
        id={id}
        tabs={Object.entries(labels.tabs).filter(([key]) => algorithm === 'dfs' || key !== 'edges')}
        value={tab}
        onChange={next => select(algorithm, next)}
        label={labels.choose}
        className="graph-learning-tabs"
      />
      <Suspense fallback={<p role="status">{text.recursion.enhancements.loading}</p>}>
        {visited.map(key => {
          const [mode, view] = key.split('-')
          const active = key === current
          return (
            <div
              key={key}
              id={active ? `${id}-${view}` : undefined}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${view}`}
              hidden={!active}
              className="graph-learning-view"
              data-learning-view={key}
            >
              {view === 'basic' ? (
                mode === 'dfs' ? (
                  <BasicDfsLab active={active} onExampleSelect={onExampleSelect} />
                ) : (
                  <BasicBfsLab active={active} />
                )
              ) : (
                <GraphTraversalLab initialMode={mode} presentation={view} active={active} />
              )}
            </div>
          )
        })}
        <details
          className="graph-learning-practice"
          onToggle={event => {
            setPracticeOpen(event.currentTarget.open)
            if (event.currentTarget.open) {
              setPracticeVisited(true)
            }
          }}
        >
          <summary>{labels.practice}</summary>
          {practiceVisited && (
            <GraphTraversalLab
              initialMode={initialMode}
              presentation="practice"
              active={practiceOpen}
            />
          )}
        </details>
      </Suspense>
    </div>
  )
}
