export function createQuizState(count, phase = 'intro') {
  return { phase, index: 0, answers: Array.from({ length: count }, () => ({ selected: null, checked: false })) }
}

export function scoreQuiz(questions, answers) {
  return questions.reduce((score, question, index) => score + Number(answers[index]?.checked === true && answers[index].selected === question.correctIndex), 0)
}

export function createQuizReducer(questions) {
  return (state, action) => {
    if (action.type === 'START') return createQuizState(questions.length, 'question')
    if (state.phase !== 'question') return state
    const answer = state.answers[state.index], question = questions[state.index]
    if (action.type === 'SELECT') {
      if (answer.checked || !Number.isInteger(action.option) || action.option < 0 || action.option >= question.choices.length) return state
      return { ...state, answers: state.answers.map((item, index) => index === state.index ? { ...item, selected: action.option } : item) }
    }
    if (action.type === 'CHECK') {
      if (answer.selected === null || answer.checked) return state
      return { ...state, answers: state.answers.map((item, index) => index === state.index ? { ...item, checked: true } : item) }
    }
    if (action.type === 'NEXT' && answer.checked) return state.index === questions.length - 1 ? { ...state, phase: 'result' } : { ...state, index: state.index + 1 }
    return state
  }
}
