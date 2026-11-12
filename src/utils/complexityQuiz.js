import { complexityQuestions } from '../data/complexityQuiz.js'

export function initialQuizState(phase = 'intro') {
  return { phase, index: 0, answers: complexityQuestions.map(() => ({ selected: null, checked: false })) }
}

export function quizScore(answers) {
  return complexityQuestions.reduce((score, question, index) =>
    score + Number(answers[index]?.checked === true && answers[index].selected === question.correctIndex), 0)
}

export function complexityQuizReducer(state, action) {
  if (action.type === 'START') return initialQuizState('question')
  if (state.phase !== 'question') return state
  const answer = state.answers[state.index]
  const question = complexityQuestions[state.index]

  if (action.type === 'SELECT') {
    if (answer.checked || !Number.isInteger(action.option) || action.option < 0 || action.option >= question.choices.length) return state
    return { ...state, answers: state.answers.map((item, index) => index === state.index ? { ...item, selected: action.option } : item) }
  }
  if (action.type === 'CHECK') {
    if (answer.selected === null || answer.checked) return state
    return { ...state, answers: state.answers.map((item, index) => index === state.index ? { ...item, checked: true } : item) }
  }
  if (action.type === 'NEXT') {
    if (!answer.checked) return state
    return state.index === complexityQuestions.length - 1
      ? { ...state, phase: 'result' }
      : { ...state, index: state.index + 1 }
  }
  return state
}
