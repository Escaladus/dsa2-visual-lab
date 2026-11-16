import assert from 'node:assert/strict'
import test from 'node:test'
import { topics, roadmapIds } from '../src/data/topics.js'
import { dictionaries, formatMessage, languages, readLanguage, resolveLanguage, saveLanguage, storageKey } from '../src/i18n/index.js'
import { createBfsSteps, createDfsSteps, graphNodes } from '../src/utils/graphAlgorithms.js'
import { javaExamples } from '../src/data/javaExamples.js'
import { handoutSections } from '../src/data/handout.js'
import { recursionTheory } from '../src/i18n/recursionTheory.js'
import { recursionTracing } from '../src/i18n/recursionTracing.js'
import { recursiveDfsTranslations } from '../src/i18n/recursiveDfs.js'
import { recursionComplexityTranslations } from '../src/i18n/recursionComplexity.js'
import { recursionReviewTranslations } from '../src/i18n/recursionReview.js'
import { recurrenceTreeTranslations } from '../src/i18n/recurrenceTrees.js'

function compareShape(reference, actual, path = '') {
  assert.equal(typeof actual, typeof reference, path)
  if (typeof reference === 'string') {
    assert.ok(actual.trim().length, `Empty translation: ${path}`)
    const placeholders = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
    assert.deepEqual(placeholders(actual), placeholders(reference), `Placeholders: ${path}`)
    return
  }
  assert.deepEqual(Object.keys(actual).sort(), Object.keys(reference).sort(), path)
  for (const key of Object.keys(reference)) compareShape(reference[key], actual[key], `${path}.${key}`)
}

for (const { code } of languages) {
  test(`${code}: all UI, lessons and animation messages are translated`, () => {
    const dictionary = dictionaries[code]
    compareShape(dictionaries.ru, dictionary)
    compareShape(recursionTheory.ru, recursionTheory[code], 'recursionTheory')
    compareShape(recursionTracing.ru, recursionTracing[code], 'recursionTracing')
    compareShape(recursiveDfsTranslations.ru, recursiveDfsTranslations[code], 'recursiveDfs')
    compareShape(recursionComplexityTranslations.ru, recursionComplexityTranslations[code], 'recursionComplexity')
    compareShape(recursionReviewTranslations.ru, recursionReviewTranslations[code], 'recursionReview')
    compareShape(recurrenceTreeTranslations.ru, recurrenceTreeTranslations[code], 'recurrenceTrees')
    assert.equal(dictionary.topics.length, topics.length)
    assert.equal(dictionary.roadmap.length, roadmapIds.length)
    assert.deepEqual(Object.keys(dictionary.pages).sort(), topics.map(topic => topic.id).sort())
    for (const topic of topics) assert.ok(dictionary.groups[topic.group])
    assert.deepEqual(Object.keys(dictionary.examples).sort(), javaExamples.map(example => example.id).sort())
    if (code !== 'ru') assert.doesNotMatch(JSON.stringify(dictionary), /[а-яё]/i)
    if (code !== 'ru') assert.doesNotMatch(JSON.stringify(recursionTheory[code]), /[а-яё]/i)
    if (code !== 'ru') assert.doesNotMatch(JSON.stringify(recursionTracing[code]), /[а-яё]/i)
    if (code !== 'ru') assert.doesNotMatch(JSON.stringify(recursiveDfsTranslations[code]), /[а-яё]/i)
    if (code !== 'ru') assert.doesNotMatch(JSON.stringify(recursionComplexityTranslations[code]), /[а-яё]/i)
    if (code !== 'ru') assert.doesNotMatch(JSON.stringify(recursionReviewTranslations[code]), /[а-яё]/i)
    if (code !== 'ru') assert.doesNotMatch(JSON.stringify(recurrenceTreeTranslations[code]), /[а-яё]/i)
  })

  test(`${code}: every graph step renders with substituted values for every starting vertex`, () => {
    for (const start of Object.keys(graphNodes)) {
      for (const createSteps of [createDfsSteps, createBfsSteps]) {
        const steps = createSteps(start)
        assert.equal(new Set(steps.at(-1).visited).size, Object.keys(graphNodes).length)
        for (const { message } of steps) {
          const template = dictionaries[code].messages[message.key]
          assert.equal(typeof template, 'string', message.key)
          const rendered = formatMessage(template, message.values)
          assert.doesNotMatch(rendered, /\{\w+\}|undefined/)
        }
      }
    }
  })
}

test('language choices persist and invalid or inaccessible storage falls back to English', () => {
  const values = new Map()
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  assert.equal(readLanguage(storage), 'en')
  for (const { code } of languages) {
    saveLanguage(storage, code)
    assert.equal(values.get(storageKey), code)
    assert.equal(readLanguage(storage), code)
  }
  for (const value of ['de', '__proto__', 'constructor', '', null, undefined]) {
    assert.equal(resolveLanguage(value), 'en')
    storage.setItem(storageKey, value)
    assert.equal(readLanguage(storage), 'en')
  }
  const blockedStorage = {
    getItem() { throw new Error('Storage blocked') },
    setItem() { throw new Error('Storage blocked') },
  }
  assert.equal(readLanguage(blockedStorage), 'en')
  assert.doesNotThrow(() => saveLanguage(blockedStorage, 'fi'))
})

test('every lesson has a handout reference and every practical lesson has runnable examples', () => {
  assert.deepEqual(Object.keys(handoutSections).sort(), topics.map(topic => topic.id).sort())
  for (const topic of topics.filter(topic => topic.id !== 'overview')) {
    assert.ok(javaExamples.some(example => example.topics.includes(topic.id)), topic.id)
  }
  const ids = new Set(topics.map(topic => topic.id))
  for (const example of javaExamples) for (const topicId of example.topics) assert.ok(ids.has(topicId), topicId)
})

test('message interpolation preserves zero distances', () => {
  assert.equal(formatMessage('distance = {distance}', { distance: 0 }), 'distance = 0')
})
