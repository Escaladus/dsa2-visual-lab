import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { complexityQuestions } from '../src/data/complexityQuiz.js'
import { dictionaries, formatMessage } from '../src/i18n/index.js'
import { complexityQuizReducer as reduce, initialQuizState, quizScore } from '../src/utils/complexityQuiz.js'

function complete(selections) {
  let state = reduce(initialQuizState(), { type: 'START' })
  for (const option of selections) {
    state = reduce(state, { type: 'SELECT', option })
    state = reduce(state, { type: 'CHECK' })
    state = reduce(state, { type: 'NEXT' })
  }
  return state
}

test('the quiz has five distinct Java examples and complete translations', () => {
  assert.equal(complexityQuestions.length, 5)
  assert.equal(new Set(complexityQuestions.map(question => question.id)).size, 5)
  assert.equal(new Set(complexityQuestions.map(question => question.code)).size, 5)
  const ids = complexityQuestions.map(question => question.id).sort()
  for (const dictionary of Object.values(dictionaries)) {
    assert.equal(dictionary.complexityQuiz.levels.length, 5)
    assert.deepEqual(Object.keys(dictionary.complexityQuiz.questions).sort(), ids)
    for (const question of complexityQuestions) {
      assert.equal(question.choices.length, 4)
      assert.equal(new Set(question.choices).size, 4)
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4)
      const translated = dictionary.complexityQuiz.questions[question.id]
      assert.ok(translated.title && translated.assumptions && translated.explanation)
      assert.ok(translated.explanation.includes(question.choices[question.correctIndex]))
    }
    for (const [key, params] of [['score', { score: 0, total: 5 }], ['question', { current: 1, total: 5 }], ['progress', { count: 0, total: 5 }]]) {
      assert.doesNotMatch(formatMessage(dictionary.complexityQuiz[key], params), /\{\w+\}|undefined/)
    }
  }
})

test('answers must be selected and checked before progressing; checked answers cannot change', () => {
  const intro = initialQuizState()
  assert.equal(intro.phase, 'intro')
  assert.equal(reduce(intro, { type: 'SELECT', option: 1 }), intro)
  let state = reduce(intro, { type: 'START' })
  assert.equal(state.phase, 'question')
  assert.equal(reduce(state, { type: 'CHECK' }), state)
  assert.equal(reduce(state, { type: 'NEXT' }), state)
  for (const option of [-1, 4, NaN, 0.5, '1', null]) assert.equal(reduce(state, { type: 'SELECT', option }), state)
  const before = state
  state = reduce(state, { type: 'SELECT', option: 0 })
  assert.equal(state.answers[0].selected, 0, 'The first radio option is a valid choice')
  assert.equal(before.answers[0].selected, null, 'Earlier state must not be mutated')
  assert.equal(reduce(state, { type: 'NEXT' }), state)
  state = reduce(state, { type: 'CHECK' })
  assert.equal(state.answers[0].checked, true)
  assert.equal(reduce(state, { type: 'SELECT', option: 1 }), state)
  assert.equal(reduce(state, { type: 'CHECK' }), state)
  state = reduce(state, { type: 'NEXT' })
  assert.equal(state.index, 1)
  assert.equal(state.answers[1].selected, null)
})

test('scores, final review and retries handle perfect, partial and zero results', () => {
  const correct = complexityQuestions.map(question => question.correctIndex)
  const wrong = correct.map(option => (option + 1) % 4)
  const perfect = complete(correct)
  const zero = complete(wrong)
  const partial = complete([correct[0], wrong[1], correct[2], wrong[3], correct[4]])
  for (const state of [perfect, zero, partial]) {
    assert.equal(state.phase, 'result')
    assert.equal(state.index, 4)
    assert.ok(state.answers.every(answer => answer.checked))
    assert.equal(reduce(state, { type: 'NEXT' }), state)
  }
  assert.equal(quizScore(perfect.answers), 5)
  assert.equal(quizScore(zero.answers), 0)
  assert.equal(quizScore(partial.answers), 3)
  assert.equal(quizScore(perfect.answers.map(answer => ({ ...answer, checked: false }))), 0)
  const restarted = reduce(partial, { type: 'START' })
  assert.equal(restarted.phase, 'question')
  assert.equal(restarted.index, 0)
  assert.equal(quizScore(restarted.answers), 0)
  assert.ok(restarted.answers.every(answer => answer.selected === null && !answer.checked))
  assert.equal(quizScore(partial.answers), 3, 'Restart must not mutate the completed result')
})

const hasJava = spawnSync('java', ['-version']).status === 0

test('the exact displayed Java methods compile and produce the iteration counts used in the explanations', { skip: hasJava ? false : 'JDK 17+ is required' }, () => {
  const directory = mkdtempSync(join(tmpdir(), 'dsa2-quiz-'))
  try {
    const file = join(directory, 'QuizExamplesCheck.java')
    writeFileSync(file, `public class QuizExamplesCheck {
${complexityQuestions.map(question => question.code).join('\n')}
static void check(boolean value) { if (!value) throw new AssertionError(); }
public static void main(String[] args) {
    for (int n : new int[]{1, 2, 3, 4, 7, 8, 31, 32, 1000}) {
        int[] values = new int[n];
        java.util.Arrays.fill(values, 1);
        check(first(values) == 1);
        check(sum(values) == n);
        check(halves(n) == 31 - Integer.numberOfLeadingZeros(n));
        check(pairs(n) == (long) n * (n - 1) / 2);
        int doublingSteps = n == 1 ? 0 : 32 - Integer.numberOfLeadingZeros(n - 1);
        check(work(n) == (long) n * doublingSteps);
    }
    check(sum(new int[]{}) == 0);
    System.out.println("Quiz examples verified");
}}
`)
    const result = spawnSync('java', ['--source', '17', file], { encoding: 'utf8', timeout: 20000 })
    assert.equal(result.status, 0, result.stderr)
    assert.match(result.stdout, /Quiz examples verified/)
  } finally { rmSync(directory, { recursive: true, force: true }) }
})
