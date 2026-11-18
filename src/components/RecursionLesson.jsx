import { useId, useRef } from 'react'
import { recursionExamples } from '../data/recursion.js'
import {
  factorialLessonTrace,
  factorialWalkthrough,
  fibonacciLeftReturn,
  fibonacciLessonTrace,
} from '../data/recursionLesson.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { recursionTheory } from '../i18n/recursionTheory.js'
import { formatMessage } from '../i18n/index.js'

const badCode = `static int bad(int n) {
    if (n == 0) return 0;
    return bad(n);
}`

export default function RecursionLesson({ onExplore }) {
  const { language } = useLanguage()
  const labels = recursionTheory[language]
  const id = useId()
  const details = useRef(null)
  const waitingIndex = factorialWalkthrough.find(moment => moment.id === 'wait').index
  const waiting = factorialLessonTrace[waitingIndex]
  const counts = fibonacciLessonTrace.at(-1)
  function explore(kind, index, panel = 'tree') {
    details.current.open = false
    onExplore(kind, 4, index, panel)
  }

  return (
    <section className="recursion-lesson" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{labels.title}</h3>
      <p className="recursion-lesson-intro">{labels.intro}</p>
      <details ref={details} className="recursion-lesson-details">
        <summary>{labels.more}</summary>
        <div className="recursion-lesson-body">
          <h4>{labels.cycleTitle}</h4>
          <ol className="recursion-cycle">
            {labels.cycle.map(([title, body], index) => (
              <li key={title}>
                <span aria-hidden="true">{index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <details className="recursion-lesson-chapter" data-chapter="frames">
            <summary>{labels.frameTitle}</summary>
            <p>{labels.frameIntro}</p>
            <p className="recursion-lesson-caption">{labels.frameCaption}</p>
            <div className="recursion-frame-example">
              {[...waiting.stack].reverse().map(nodeId => {
                const node = waiting.nodes[nodeId]
                return (
                  <div
                    key={nodeId}
                    className={`recursion-lesson-frame ${nodeId === waiting.current ? 'top' : ''}`}
                  >
                    <span>{nodeId === waiting.current ? labels.child : labels.parent}</span>
                    <strong>factorial({node.n})</strong>
                    {Object.entries(node.locals).map(([name, value]) => (
                      <code key={name}>
                        {name} = {value ?? '?'}
                        {value === null && <small> · {labels.pending}</small>}
                      </code>
                    ))}
                  </div>
                )
              })}
            </div>
            <p>{labels.frameOwn}</p>
            <p>{labels.continuation}</p>
            <p className="recursion-lesson-caption">{labels.pendingNote}</p>
            <button
              className="recursion-lesson-action"
              onClick={() => explore('factorial', waitingIndex, 'stack')}
            >
              {labels.showFrame}
            </button>
            <h4>{labels.codeTitle}</h4>
            <pre
              className="code-block recursion-lesson-code"
              tabIndex={0}
              aria-label={labels.codeTitle}
            >
              <code>
                {recursionExamples.factorial.code.split('\n').map((line, index) => (
                  <span key={index}>
                    <i aria-hidden="true">{index + 1}</i>
                    {line}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
            <dl className="recursion-line-explanations">
              {Object.entries(labels.lines).map(([line, body]) => (
                <div key={line}>
                  <dt>{line}</dt>
                  <dd>{body}</dd>
                </div>
              ))}
            </dl>
          </details>

          <details className="recursion-lesson-chapter" data-chapter="factorial">
            <summary>{labels.walkthroughTitle}</summary>
            <p>{labels.walkthroughIntro}</p>
            <ol className="recursion-walkthrough">
              {factorialWalkthrough.map(moment => {
                const [title, body] = labels.moments[moment.id]
                return (
                  <li key={moment.id} data-moment={moment.id}>
                    <h4>{title}</h4>
                    <p>{body}</p>
                    <button
                      className="recursion-lesson-action"
                      aria-label={`${labels.showStep}: ${title}`}
                      onClick={() => explore('factorial', moment.index)}
                    >
                      {labels.showStep}
                    </button>
                  </li>
                )
              })}
            </ol>
          </details>

          <details className="recursion-lesson-chapter" data-chapter="fibonacci">
            <summary>{labels.fibonacciTitle}</summary>
            <p>{labels.fibonacciIntro}</p>
            <pre className="code-block recursion-lesson-code" tabIndex={0}>
              <code>{recursionExamples.fibonacci.code}</code>
            </pre>
            <ol className="recursion-fibonacci-order">
              {labels.fibonacciOrder.map(body => (
                <li key={body}>{body}</li>
              ))}
            </ol>
            <button
              className="recursion-lesson-action"
              onClick={() => explore('fibonacci', fibonacciLeftReturn)}
            >
              {labels.showLeft}
            </button>
          </details>

          <details className="recursion-lesson-chapter" data-chapter="counts">
            <summary>{labels.countTitle}</summary>
            <p>
              {formatMessage(labels.countText, {
                calls: counts.nodes.length,
                depth: counts.maxDepth,
              })}
            </p>
            <p>{labels.countNote}</p>
          </details>

          <details className="recursion-lesson-chapter" data-chapter="termination">
            <summary>{labels.safetyTitle}</summary>
            <ul>
              {labels.safetyPoints.map(body => (
                <li key={body}>{body}</li>
              ))}
            </ul>
            <pre
              className="code-block recursion-lesson-code"
              tabIndex={0}
              aria-label={labels.badCodeLabel}
            >
              <code>{badCode}</code>
            </pre>
          </details>

          <details className="recursion-lesson-chapter" data-chapter="void">
            <summary>{labels.voidTitle}</summary>
            <p>{labels.voidText}</p>
            <p>{labels.voidShared}</p>
          </details>
        </div>
      </details>
    </section>
  )
}
