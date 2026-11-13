import { complexityQuestions } from '../data/complexityQuiz.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import StudentQuiz from './StudentQuiz.jsx'

export default function ComplexityQuiz() {
  const { text } = useLanguage()
  return <StudentQuiz questions={complexityQuestions} labels={text.complexityQuiz} id="complexity-quiz" />
}
