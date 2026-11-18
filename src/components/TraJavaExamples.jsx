import { useId } from 'react'
import { traJavaExamples } from '../data/traJavaExamples.js'
import { traJavaExampleTranslations } from '../i18n/traJavaExamples.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const sources = import.meta.glob('../tra-examples/*.java', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const downloads = import.meta.glob('../tra-examples/*.java', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

export default function TraJavaExamples({ topicId }) {
  const { language, text } = useLanguage()
  const labels = traJavaExampleTranslations[language]
  const id = useId()
  const examples = traJavaExamples.filter(example => example.topics.includes(topicId))
  if (examples.length === 0) {
    return null
  }

  return (
    <section className="java-examples tra-java-examples" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{labels.title}</h2>
      <p className="java-note tra-java-note">{labels.intro}</p>
      <a
        className="java-download tra-kit-download"
        href={`${import.meta.env.BASE_URL}examples/tra-graphs.zip`}
        download="tra-graphs.zip"
      >
        {labels.download}
      </a>
      <p className="java-note">{labels.setup}</p>
      {examples.map(example => {
        const filename = `${example.className}.java`
        const key = `../tra-examples/${filename}`
        const [title, description, complexity] = labels.examples[example.id]
        return (
          <details className="java-example" key={example.id} data-tra-example={example.id}>
            <summary>
              <span>{title}</span>
              <code>{filename} · traj.jar</code>
            </summary>
            <div className="java-example-body">
              <p>{description}</p>
              <p className="java-complexity">
                <strong>{text.ui.complexityLabel}:</strong> {complexity}
              </p>
              <a className="java-download" href={downloads[key]} download={filename}>
                {text.ui.downloadJava}
              </a>
              <div className="java-result-grid">
                <div>
                  <h4>{text.ui.runJava}</h4>
                  <pre className="code-block tra-run-command" tabIndex={0}>
                    <code>java -Dfile.encoding=UTF-8 -cp traj.jar {filename}</code>
                  </pre>
                </div>
                <div>
                  <h4>{text.ui.expectedOutput}</h4>
                  <pre className="code-block" tabIndex={0}>
                    <code>{example.output}</code>
                  </pre>
                </div>
              </div>
              <pre className="code-block" tabIndex={0} aria-label={filename}>
                <code>{sources[key]}</code>
              </pre>
            </div>
          </details>
        )
      })}
      <p className="java-note">{labels.order}</p>
    </section>
  )
}
