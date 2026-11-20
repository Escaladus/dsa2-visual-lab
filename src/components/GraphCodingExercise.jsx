import { useId } from 'react'
import starterCode from '../../exercises/dfs-reachable/Solution.java?raw'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { graphCodingExerciseTranslations } from '../i18n/graphCodingExercise.js'

const vertices = [
  [55, 110],
  [175, 45],
  [175, 175],
  [295, 110],
  [395, 175],
]
const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
]

function ExampleGraph({ id, label }) {
  return (
    <svg className="coding-example-graph" viewBox="0 0 450 230" role="img" aria-label={label}>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8ca6ce" />
        </marker>
      </defs>
      {edges.map(([from, to]) => {
        const [x1, y1] = vertices[from]
        const [x2, y2] = vertices[to]
        const distance = Math.hypot(x2 - x1, y2 - y1)
        const dx = (x2 - x1) / distance
        const dy = (y2 - y1) / distance
        return (
          <line
            key={`${from}-${to}`}
            x1={x1 + dx * 25}
            y1={y1 + dy * 25}
            x2={x2 - dx * 29}
            y2={y2 - dy * 29}
            stroke="#8ca6ce"
            strokeWidth="2"
            markerEnd={`url(#${id})`}
          />
        )
      })}
      {vertices.map(([x, y], index) => (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r="25"
            fill={index === 0 ? '#284d79' : '#152238'}
            stroke={index === 0 ? '#8ff0c4' : '#8ca6ce'}
            strokeWidth="2"
          />
          <text
            x={x}
            y={y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="20"
            fontWeight="600"
          >
            {index}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function GraphCodingExercise() {
  const { language } = useLanguage()
  const labels = graphCodingExerciseTranslations[language]
  const id = useId()
  return (
    <section className="lab-shell graph-coding-exercise" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{labels.title}</h2>
      <p>{labels.intro}</p>
      <p className="coding-note">{labels.rules[1]}</p>
      <div className="coding-task-example">
        <ExampleGraph id={`${id}-arrow`} label={labels.graph} />
        <div>
          <h3>{labels.task}</h3>
          <p>{labels.description}</p>
          <p className="coding-example-answer">{labels.example}</p>
        </div>
      </div>
      <a
        className="java-download coding-download"
        href={`${import.meta.env.BASE_URL}exercises/dfs-reachable.zip`}
        download="dfs-reachable.zip"
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
        {labels.hintItems.map(([title, explanation]) => (
          <details className="coding-hint" key={title}>
            <summary>{title}</summary>
            <p>{explanation}</p>
          </details>
        ))}
      </details>
      <p className="coding-note">{labels.after}</p>
    </section>
  )
}
