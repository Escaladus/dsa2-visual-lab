import { formatMessage } from '../i18n/index.js'

// Checked answers belong to the controller, so rewinding cannot award points twice.
export default function RecursionPrediction({
  question,
  answer,
  answers,
  onAnswer,
  onContinue,
  onSkip,
  labels,
  messages,
}) {
  const checked = Object.values(answers)
  return (
    <div className="recursion-prediction">
      <p className="recursion-note">{labels.note}</p>
      <span className="step-text">
        {formatMessage(labels.score, {
          correct: checked.filter(item => item.correct).length,
          total: checked.length,
        })}
      </span>
      {question ? (
        <>
          <h3>{formatMessage(labels[question.key], question.values)}</h3>
          <div
            className="recursion-prediction-options"
            role="group"
            aria-label={formatMessage(labels[question.key], question.values)}
          >
            {question.choices.map(value => (
              <button
                key={value}
                disabled={Boolean(answer)}
                aria-pressed={answer?.selected === value}
                onClick={() => onAnswer(value)}
              >
                {value}
              </button>
            ))}
          </div>
          {!answer && (
            <button className="recursion-prediction-skip" onClick={onSkip}>
              {labels.skip}
            </button>
          )}
          {answer && (
            <div role="status">
              <p>
                {answer.correct
                  ? labels.correct
                  : formatMessage(labels.incorrect, { value: question.answer })}{' '}
                {question.reason
                  ? formatMessage(labels.reasons[question.reason.key], question.reason.values)
                  : formatMessage(messages[question.explanation.key], question.explanation.values)}
              </p>
              <button onClick={onContinue}>{labels.continue}</button>
            </div>
          )}
        </>
      ) : (
        <p>{labels.waiting}</p>
      )}
    </div>
  )
}
