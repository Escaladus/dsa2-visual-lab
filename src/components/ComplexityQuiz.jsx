import { useEffect, useReducer, useRef } from 'react'
import { complexityQuestions } from '../data/complexityQuiz.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatMessage } from '../i18n/index.js'
import { complexityQuizReducer, initialQuizState, quizScore } from '../utils/complexityQuiz.js'

export default function ComplexityQuiz() {
  const { text } = useLanguage()
  const labels = text.complexityQuiz
  const [state, dispatch] = useReducer(complexityQuizReducer, undefined, initialQuizState)
  const stageHeading = useRef(null)
  const total = complexityQuestions.length
  const checkedCount = state.answers.filter(answer => answer.checked).length
  const question = complexityQuestions[state.index]
  const answer = state.answers[state.index]
  const content = labels.questions[question.id]
  const correct = answer.selected === question.correctIndex
  const score = quizScore(state.answers)

  useEffect(() => {
    if (state.phase === 'intro') return
    stageHeading.current?.focus({ preventScroll: true })
    stageHeading.current?.scrollIntoView({ block: 'start' })
  }, [state.phase, state.index])

  function submit(event) {
    event.preventDefault()
    dispatch({ type: answer.checked ? 'NEXT' : 'CHECK' })
  }

  return (
    <section className="complexity-quiz" aria-labelledby="complexity-quiz-title">
      <h2 id="complexity-quiz-title">{labels.title}</h2>
      {state.phase === 'intro' ? (
        <>
          <p className="quiz-intro">{labels.intro}</p>
          <div className="playback quiz-actions"><button className="primary" onClick={() => dispatch({ type: 'START' })}>{labels.start}</button></div>
        </>
      ) : state.phase === 'question' ? (
        <>
          <p id="quiz-instructions" className="quiz-instructions">{labels.instructions}</p>
          <progress className="quiz-progress" max={total} value={checkedCount} aria-label={formatMessage(labels.progress, { count: checkedCount, total })} />
          <div className="quiz-question-meta">
            <span>{formatMessage(labels.question, { current: state.index + 1, total })}</span>
            <span className="quiz-level">{labels.levels[state.index]}</span>
          </div>
          <h3 className="quiz-stage-heading" ref={stageHeading} tabIndex={-1}>{content.title}</h3>
          <p id="quiz-assumptions" className="quiz-assumptions">{content.assumptions}</p>
          <pre className="code-block quiz-code" tabIndex={0} aria-label={labels.codeLabel}><code>{question.code}</code></pre>
          <form onSubmit={submit}>
            <fieldset className="quiz-options" disabled={answer.checked} aria-describedby="quiz-assumptions quiz-instructions">
              <legend>{labels.prompt}</legend>
              {question.choices.map((choice, option) => {
                const isCorrect = answer.checked && option === question.correctIndex
                const isWrong = answer.checked && option === answer.selected && !isCorrect
                const classes = ['quiz-option', answer.selected === option && 'selected', isCorrect && 'correct', isWrong && 'incorrect'].filter(Boolean).join(' ')
                return (
                  <label key={`${question.id}-${option}`} className={classes}>
                    <input type="radio" name={question.id} value={option} checked={answer.selected === option}
                      onChange={() => dispatch({ type: 'SELECT', option })} />
                    <span className="quiz-option-letter" aria-hidden="true">{String.fromCharCode(65 + option)}</span>
                    <span className="quiz-option-content"><code>{choice}</code>{isCorrect && <small>{labels.correctAnswer}</small>}</span>
                  </label>
                )
              })}
            </fieldset>
            {answer.checked ? (
              <div className={`quiz-feedback ${correct ? 'correct' : 'incorrect'}`} role="status">
                <strong>{correct ? labels.correct : labels.incorrect}</strong>
                <p>{labels.correctAnswer}: <code>{question.choices[question.correctIndex]}</code></p>
                <p>{content.explanation}</p>
              </div>
            ) : <p className="quiz-choice-hint">{labels.chooseHint}</p>}
            <div className="playback quiz-actions">
              <button type="submit" className="primary" disabled={answer.selected === null}>
                {!answer.checked ? labels.check : state.index === total - 1 ? labels.finish : labels.next}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="quiz-result">
          <h3 className="quiz-stage-heading" ref={stageHeading} tabIndex={-1}>{labels.resultTitle}</h3>
          <p className="quiz-score" role="status">{formatMessage(labels.score, { score, total })}</p>
          <p className="quiz-intro">{score === total ? labels.perfect : labels.practice}</p>
          <div className="playback quiz-actions"><button className="primary" onClick={() => dispatch({ type: 'START' })}>{labels.restart}</button></div>
          <h4 className="quiz-review-title">{labels.review}</h4>
          {complexityQuestions.map((item, index) => {
            const review = labels.questions[item.id]
            const selected = state.answers[index].selected
            const isCorrect = selected === item.correctIndex
            return (
              <details className="quiz-review" key={item.id} open={!isCorrect}>
                <summary>
                  <span aria-hidden="true" className={`quiz-review-mark ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? '✓' : '×'}</span>
                  {index + 1}. {review.title} <strong>{isCorrect ? labels.correct : labels.incorrect}</strong>
                </summary>
                <div className="quiz-review-body">
                  <p>{review.assumptions}</p>
                  <pre className="code-block" tabIndex={0} aria-label={labels.codeLabel}><code>{item.code}</code></pre>
                  <p>{labels.yourAnswer}: <code>{item.choices[selected]}</code></p>
                  <p>{labels.correctAnswer}: <code>{item.choices[item.correctIndex]}</code></p>
                  <p>{review.explanation}</p>
                </div>
              </details>
            )
          })}
        </div>
      )}
    </section>
  )
}
