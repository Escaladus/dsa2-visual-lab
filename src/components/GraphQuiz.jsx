import { graphQuizQuestions } from '../data/graphQuiz.js'
import { traversalExamples } from '../data/graphTraversal.js'
import { graphQuizTranslations } from '../i18n/graphQuiz.js'
import { graphTraversalTranslations } from '../i18n/graphTraversal.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import StudentQuiz from './StudentQuiz.jsx'
import TraversalGraph from './TraversalGraph.jsx'

export default function GraphQuiz() {
  const { text, language } = useLanguage()
  const t = graphTraversalTranslations[language]
  const labels = { ...text.recursion.quiz, ...graphQuizTranslations[language] }
  return (
    <StudentQuiz
      id="graph-quiz"
      questions={graphQuizQuestions}
      labels={labels}
      renderContext={(question, checked) => {
        const { preset, options, step, after } = question.context
        const snapshot = checked ? after : step
        return (
          <div className="graph-quiz-context">
            <p>
              {options.algorithm.toUpperCase()} · {t.examples[preset]} · {t.start}: {options.start}{' '}
              · {options.all ? t.all : t.reachable} · {t.ascending}
            </p>
            <div className="graph-quiz-diagram">
              <TraversalGraph
                example={traversalExamples[preset]}
                step={snapshot}
                labels={t}
                classification={checked && options.algorithm === 'dfs'}
              />
            </div>
            {step.edge && (
              <p>
                <code>
                  {step.edge.from} → {step.edge.to}
                </code>{' '}
                · {step.colors[step.edge.to]} · tin[{step.edge.from}] = {step.tin[step.edge.from]} ·
                tin[{step.edge.to}] = {step.tin[step.edge.to]}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
