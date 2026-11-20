import { useState } from 'react'
import { graphTraversalTasks } from '../data/graphTraversalLessons.js'
import { graphTraversalTranslations } from '../i18n/graphTraversal.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import GraphTraversalLab from './GraphTraversalLab.jsx'

/** Reuse the existing traversal workspace; no second graph algorithm or animation model. */
export default function GraphApplicationsLab() {
  const { language } = useLanguage()
  const labels = graphTraversalTranslations[language]
  const [task, setTask] = useState('components')
  const [open, setOpen] = useState(false)
  const [visited, setVisited] = useState(false)
  return (
    <section className="graph-applications-lab">
      <details
        className="graph-learning-practice"
        onToggle={event => {
          setOpen(event.currentTarget.open)
          if (event.currentTarget.open) setVisited(true)
        }}
      >
        <summary>{labels.applicationsOpen}</summary>
        <p>{labels.applicationsGuide}</p>
        <div className="callout-actions" role="group" aria-label={labels.applications}>
          {Object.keys(graphTraversalTasks).map(key => (
            <button
              key={key}
              data-application={key}
              aria-pressed={task === key}
              className={task === key ? 'primary' : ''}
              onClick={() => setTask(key)}
            >
              {labels.tasks[key][0]}
            </button>
          ))}
        </div>
        {visited && (
          <GraphTraversalLab key={task} initialTask={task} showTaskLauncher={false} active={open} />
        )}
      </details>
    </section>
  )
}
