import { useEffect, useMemo, useReducer, useRef } from 'react'
import { formatMessage } from '../i18n/index.js'
import { createQuizReducer, createQuizState, scoreQuiz } from '../utils/studentQuiz.js'

export default function StudentQuiz({ questions, labels, id }) {
  const reducer = useMemo(() => createQuizReducer(questions), [questions])
  const [state, dispatch] = useReducer(reducer, undefined, () => createQuizState(questions.length))
  const stageHeading = useRef(null)
  const total = questions.length
  const checkedCount = state.answers.filter(answer => answer.checked).length
  const question = questions[state.index]
  const answer = state.answers[state.index]
  const content = labels.questions[question.id]
  const choices = content.choices ?? question.choices
  const correct = answer.selected === question.correctIndex
  const score = scoreQuiz(questions, state.answers)

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
    <section className="complexity-quiz" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{labels.title}</h2>
      {state.phase === 'intro' ? (
        <>
          <p className="quiz-intro">{labels.intro}</p>
          <div className="playback quiz-actions"><button className="primary" onClick={() => dispatch({ type: 'START' })}>{labels.start}</button></div>
        </>
      ) : state.phase === 'question' ? (
        <>
          <p id={`${id}-instructions`} className="quiz-instructions">{labels.instructions}</p>
          <progress className="quiz-progress" max={total} value={checkedCount} aria-label={formatMessage(labels.progress, { count: checkedCount, total })} />
          <div className="quiz-question-meta">
            <span>{formatMessage(labels.question, { current: state.index + 1, total })}</span>
            <span className="quiz-level">{labels.levels[state.index]}</span>
          </div>
          <h3 className="quiz-stage-heading" ref={stageHeading} tabIndex={-1}>{content.title}</h3>
          <p id={`${id}-assumptions`} className="quiz-assumptions">{content.assumptions}</p>
          <pre className="code-block quiz-code" tabIndex={0} aria-label={labels.codeLabel}><code>{question.code}</code></pre>
          <form onSubmit={submit}>
            <fieldset className="quiz-options" disabled={answer.checked} aria-describedby={`${id}-assumptions ${id}-instructions`}>
              <legend>{content.prompt ?? labels.prompt}</legend>
              {choices.map((choice, option) => {
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
                <p>{labels.correctAnswer}: <code>{choices[question.correctIndex]}</code></p>
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
          {questions.map((item, index) => {
            const review = labels.questions[item.id]
            const selected = state.answers[index].selected
            const reviewChoices = review.choices ?? item.choices
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
                  <p>{labels.yourAnswer}: <code>{reviewChoices[selected]}</code></p>
                  <p>{labels.correctAnswer}: <code>{reviewChoices[item.correctIndex]}</code></p>
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
