import { useId } from 'react'
import { traJavaExamples } from '../data/traJavaExamples.js'
import { traJavaExampleTranslations } from '../i18n/traJavaExamples.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { javaLessonExcerpt } from '../utils/javaLesson.js'

const sources = import.meta.glob('../tra-examples/lessons/**/*.java', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const downloads = import.meta.glob('../tra-examples/lessons/**/*.java', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

function ExampleCard({ example, initiallyOpen, labels, text }) {
  const filename = `${example.className}.java`
  const key = `../tra-examples/${example.sourcePath}`
  const source = sources[key]
  const [title, goal, complexity, explanation] = labels.examples[example.id]
  return (
    <details className="java-example" data-tra-example={example.id} open={initiallyOpen}>
      <summary>
        <span>{title}</span>
      </summary>
      <div className="java-example-body">
        <p className="java-lesson-goal">{goal}</p>
        {labels.contracts[example.id] && (
          <p className="java-lesson-contract">{labels.contracts[example.id]}</p>
        )}
        <div className="java-lesson-data">
          <div>
            <h4>{labels.input}</h4>
            <pre className="code-block java-lesson-input" tabIndex={0}>
              {example.diagram}
            </pre>
          </div>
          <div>
            <h4>{text.ui.expectedOutput}</h4>
            <pre className="code-block" tabIndex={0} data-lesson-output>
              <code>{example.output}</code>
            </pre>
          </div>
        </div>
        <h4>{labels.code}</h4>
        <pre className="code-block" tabIndex={0} aria-label={`${title}: ${labels.code}`}>
          <code>{javaLessonExcerpt(source)}</code>
        </pre>
        <p>{explanation}</p>
        {labels.traces[example.id] && (
          <div className="java-lesson-trace">
            <h4>{labels.traceTitle}</h4>
            <ol>
              {labels.traces[example.id].map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
        <p className="java-complexity">
          <strong>{text.ui.complexityLabel}:</strong> {complexity}
        </p>
        <a className="java-download" href={downloads[key]} download={filename}>
          {text.ui.downloadJava} · {filename}
        </a>
        <details className="java-full-source">
          <summary>{labels.complete}</summary>
          <h4>{text.ui.runJava}</h4>
          <pre className="code-block tra-run-command" tabIndex={0}>
            <code>java -Dfile.encoding=UTF-8 -cp traj.jar {filename}</code>
          </pre>
          <pre className="code-block" tabIndex={0} aria-label={filename}>
            <code>{source}</code>
          </pre>
        </details>
      </div>
    </details>
  )
}

export default function TraJavaExamples({ topicId }) {
  const { language, text } = useLanguage()
  const labels = traJavaExampleTranslations[language]
  const id = useId()
  const examples = traJavaExamples.filter(example => example.topics.includes(topicId))
  if (examples.length === 0) return null
  const groups = [...new Set(examples.map(example => example.group))]
  const firstBasic = examples.find(example => !example.advanced)?.id
  const showsTraversal = [
    'recursion',
    'graph-dfs',
    'graph-bfs',
    'graph-apps',
    'shortest-paths',
  ].includes(topicId)
  return (
    <section
      className="java-examples tra-java-examples"
      data-primary="true"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>{labels.title}</h2>
      <p className="java-note tra-java-note">{labels.intro}</p>
      <a
        className="java-download tra-kit-download"
        href={`${import.meta.env.BASE_URL}examples/tra-graphs.zip`}
        download="tra-graphs.zip"
      >
        {labels.download}
      </a>
      <details className="java-lesson-setup">
        <summary>{labels.setupTitle}</summary>
        <p className="java-note">{labels.setup}</p>
      </details>
      {groups.map(group => {
        const groupExamples = examples.filter(example => example.group === group)
        const basic = groupExamples.filter(example => !example.advanced)
        const advanced = groupExamples.filter(example => example.advanced)
        const card = example => (
          <ExampleCard
            key={example.id}
            example={example}
            initiallyOpen={example.id === firstBasic}
            labels={labels}
            text={text}
          />
        )
        return (
          <div className="java-lesson-group" data-tra-group={group} key={group}>
            <h3>{labels.groups[group]}</h3>
            {basic.map(card)}
            {advanced.length > 0 && (
              <details className="java-lesson-advanced">
                <summary>
                  {labels.advanced} ({advanced.length})
                </summary>
                {advanced.map(card)}
              </details>
            )}
          </div>
        )
      })}
      {showsTraversal && <p className="java-note">{labels.order}</p>}
    </section>
  )
}
