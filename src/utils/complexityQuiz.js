import { complexityQuestions } from '../data/complexityQuiz.js'
import { createQuizReducer, createQuizState, scoreQuiz } from './studentQuiz.js'

export const initialQuizState = (phase = 'intro') => createQuizState(complexityQuestions.length, phase)
export const quizScore = answers => scoreQuiz(complexityQuestions, answers)
export const complexityQuizReducer = createQuizReducer(complexityQuestions)
