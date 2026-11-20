import { useId } from 'react'
import { javaExamples } from '../data/javaExamples.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const sources = import.meta.glob('../examples/*.java', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const downloads = import.meta.glob('../examples/*.java', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

function ExampleGroup({ examples, comparison = false }) {
  const { text } = useLanguage()
  const id = useId()

  return (
    <section className="java-examples" data-comparison={comparison} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{text.ui.javaExamples}</h2>
      <p className="java-note">{comparison ? text.ui.javaComparisonNote : text.ui.javaNote}</p>
      {examples.map((example, index) => {
        const [title, description, complexity] = text.examples[example.id]
        const filename = `${example.className}.java`
        const key = `../examples/${filename}`
        return (
          <details className="java-example" key={example.id} open={index === 0}>
            <summary>
              <span>{title}</span>
              <code>{filename}</code>
            </summary>
            <div className="java-example-body">
              <p>{description}</p>
              <p className="java-complexity">
                <strong>{text.ui.complexityLabel}:</strong> {complexity}
              </p>
              <a className="java-download" href={downloads[key]} download={filename}>
                {text.ui.downloadJava}
              </a>
              <pre className="code-block" tabIndex={0} aria-label={filename}>
                <code>{sources[key]}</code>
              </pre>
              <div className="java-result-grid">
                <div>
                  <h4>{text.ui.runJava}</h4>
                  <pre className="code-block" tabIndex={0}>
                    <code>java {filename}</code>
                  </pre>
                </div>
                <div>
                  <h4>{text.ui.expectedOutput}</h4>
                  <pre className="code-block" tabIndex={0}>
                    <code>{example.output}</code>
                  </pre>
                </div>
              </div>
            </div>
          </details>
        )
      })}
    </section>
  )
}

export default function JavaExamples({ topicId }) {
  const { text } = useLanguage()
  const examples = javaExamples.filter(example => example.topics.includes(topicId))
  const main = examples.filter(example => !example.comparisonTopics?.includes(topicId))
  const comparison = examples.filter(example => example.comparisonTopics?.includes(topicId))
  return (
    <>
      {main.length > 0 && <ExampleGroup examples={main} />}
      {comparison.length > 0 && (
        <details className="java-comparison">
          <summary>{text.ui.javaComparison}</summary>
          <ExampleGroup examples={comparison} comparison />
        </details>
      )}
    </>
  )
}
