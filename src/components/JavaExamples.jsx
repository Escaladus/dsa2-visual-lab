import { javaExamples } from '../data/javaExamples.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const sources = import.meta.glob('../examples/*.java', { eager: true, query: '?raw', import: 'default' })
const downloads = import.meta.glob('../examples/*.java', { eager: true, query: '?url&no-inline', import: 'default' })

export default function JavaExamples({ topicId }) {
  const { text } = useLanguage()
  const examples = javaExamples.filter(example => example.topics.includes(topicId))
  if (!examples.length) return null

  return (
    <section className="java-examples" aria-labelledby="java-examples-title">
      <h2 id="java-examples-title">{text.ui.javaExamples}</h2>
      <p className="java-note">{text.ui.javaNote}</p>
      {examples.map((example, index) => {
        const [title, description, complexity] = text.examples[example.id]
        const filename = `${example.className}.java`
        const key = `../examples/${filename}`
        return (
          <details className="java-example" key={example.id} open={index === 0}>
            <summary><span>{title}</span><code>{filename}</code></summary>
            <div className="java-example-body">
              <p>{description}</p>
              <p className="java-complexity"><strong>{text.ui.complexityLabel}:</strong> {complexity}</p>
              <a className="java-download" href={downloads[key]} download={filename}>{text.ui.downloadJava}</a>
              <pre className="code-block" tabIndex={0} aria-label={filename}><code>{sources[key]}</code></pre>
              <div className="java-result-grid">
                <div><h4>{text.ui.runJava}</h4><pre className="code-block" tabIndex={0}><code>java {filename}</code></pre></div>
                <div><h4>{text.ui.expectedOutput}</h4><pre className="code-block" tabIndex={0}><code>{example.output}</code></pre></div>
              </div>
            </div>
          </details>
        )
      })}
    </section>
  )
}
