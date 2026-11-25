import { useId } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/** Shared download/instructions shell. Starters, contracts and diagrams stay task-specific. */
export default function CodingExercise({
  folder,
  algorithm,
  starter: starterCode,
  translations,
  renderExample,
  className = '',
  collapsible = false,
}) {
  const { language } = useLanguage()
  const labels = translations[language]
  const id = useId()
  const content = (
    <section
      className={`lab-shell coding-exercise ${className}`}
      data-coding-algorithm={algorithm}
      data-coding-exercise={folder}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>{labels.title}</h2>
      <p>{labels.intro}</p>
      <p className="coding-note">{labels.rules[1]}</p>
      <div className="coding-task-example">
        {renderExample({ id: `${id}-arrow`, label: labels.diagram ?? labels.graph })}
        <div>
          <h3>{labels.task}</h3>
          <p>{labels.description}</p>
          {labels.signature && (
            <pre className="code-block coding-run-command" tabIndex={0}>
              <code>{labels.signature}</code>
            </pre>
          )}
          <p className="coding-example-answer">{labels.example}</p>
          {labels.pathExplanation && <p>{labels.pathExplanation}</p>}
        </div>
      </div>
      <a
        className="java-download coding-download"
        href={`${import.meta.env.BASE_URL}exercises/${folder}.zip`}
        download={`${folder}.zip`}
      >
        {labels.download}
      </a>
      <details className="coding-chapter" open>
        <summary>{labels.instructions}</summary>
        <ol>
          {labels.steps.map(step => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <pre className="code-block coding-run-command" tabIndex={0}>
          <code>java -Dfile.encoding=UTF-8 Check.java {language}</code>
        </pre>
        <p>{labels.initial}</p>
        <p className="coding-note">{labels.files}</p>
      </details>
      <details className="coding-chapter">
        <summary>{labels.template}</summary>
        <pre className="code-block" tabIndex={0} aria-label="Solution.java">
          <code>{starterCode}</code>
        </pre>
      </details>
      <details className="coding-chapter">
        <summary>{labels.contract}</summary>
        <ul>
          {labels.rules.map(rule => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <dl className="coding-api">
          {labels.api.map(([method, explanation]) => (
            <div key={method}>
              <dt>
                <code>{method}</code>
              </dt>
              <dd>{explanation}</dd>
            </div>
          ))}
        </dl>
      </details>
      <details className="coding-chapter">
        <summary>{labels.checks}</summary>
        <p>{labels.checking}</p>
        <p>{labels.feedback}</p>
        <p className="coding-note">{labels.limits}</p>
      </details>
      <details className="coding-chapter">
        <summary>{labels.hints}</summary>
        {labels.hintItems.map(([title, explanation], index) => (
          <details className="coding-hint" key={`hint-${index}`}>
            <summary>{title}</summary>
            <p>{explanation}</p>
          </details>
        ))}
      </details>
      {labels.walkthrough && (
        <details className="coding-chapter" data-coding-walkthrough>
          <summary>{labels.walkthroughTitle}</summary>
          <ol>
            {labels.walkthrough.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="coding-note">{labels.costNote}</p>
        </details>
      )}
      <p className="coding-note">{labels.after}</p>
      <details className="coding-chapter">
        <summary>{labels.selfEvaluation}</summary>
        <ol>
          {labels.selfItems.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </details>
    </section>
  )
  return collapsible ? (
    <details className="coding-task-disclosure" data-coding-task={folder}>
      <summary>{labels.title}</summary>
      {content}
    </details>
  ) : (
    content
  )
}
