import { recursionReviewQuestions } from '../data/recursionReview.js'
import { recursionReviewTranslations } from '../i18n/recursionReview.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import StudentQuiz from './StudentQuiz.jsx'

export default function RecursionQuiz() {
  const { text, language } = useLanguage()
  const review = recursionReviewTranslations[language]
  const labels = { ...text.recursion.quiz, ...review,
    questions: Object.fromEntries(recursionReviewQuestions.map(({ id }) => [id, { ...text.recursion.quiz.questions[id], ...review.questions[id] }])) }
  return <StudentQuiz questions={recursionReviewQuestions} labels={labels} id="recursion-quiz" />
}
