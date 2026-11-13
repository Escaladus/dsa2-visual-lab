import { recursionQuestions } from '../data/recursion.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import StudentQuiz from './StudentQuiz.jsx'

export default function RecursionQuiz() {
  const { text } = useLanguage()
  return <StudentQuiz questions={recursionQuestions} labels={text.recursion.quiz} id="recursion-quiz" />
}
