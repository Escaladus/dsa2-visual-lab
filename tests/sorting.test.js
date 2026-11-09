import assert from 'node:assert/strict'
import test from 'node:test'
import { createSortingSteps, sortingAlgorithms, sortingInput } from '../src/utils/sortingAlgorithms.js'
import { dictionaries, formatMessage } from '../src/i18n/index.js'

const ascending = values => [...values].sort((a, b) => a - b)
const cases = [[], [1], [2, 1], [2, 2], [3, -1, 3, 0], [1, 2, 3, 4], [4, 3, 2, 1], sortingInput]
// Exhaustive small arrays cover ties, ordering, empty halves and pivot boundaries.
for (let length = 1; length <= 5; length++) {
  for (let encoded = 0; encoded < 3 ** length; encoded++) {
    let remaining = encoded
    cases.push(Array.from({ length }, () => {
      const value = remaining % 3 - 1
      remaining = Math.floor(remaining / 3)
      return value
    }))
  }
}

for (const { id } of sortingAlgorithms) {
  test(`${id}: correct final order and truthful, independent visualisation frames`, () => {
    for (const input of cases) {
      const original = [...input]
      const expected = ascending(input)
      const steps = createSortingSteps(id, input)
      assert.deepEqual(input, original, 'The input must remain unchanged')
      assert.deepEqual(steps[0].values, original)
      assert.deepEqual(steps.at(-1).values, expected)
      assert.equal(steps[0].message.key, 'start')
      assert.equal(steps.at(-1).message.key, 'done')
      assert.deepEqual(ascending(steps.at(-1).sorted), Array.from({ length: input.length }, (_, i) => i))
      let previousFixed = []
      for (const step of steps) {
        assert.deepEqual(ascending(step.values), expected, 'No values disappear or get duplicated during the demonstration')
        for (const position of [...step.active, ...step.sorted, ...step.ordered]) {
          assert.ok(position >= 0 && position < input.length, 'Highlight indices must be valid')
        }
        for (const position of step.sorted) assert.equal(step.values[position], expected[position], 'Green means a final position')
        for (const position of previousFixed) assert.ok(step.sorted.includes(position), 'A final position must remain final')
        previousFixed = step.sorted
        const orderedValues = step.ordered.map(position => step.values[position])
        assert.deepEqual(orderedValues, ascending(orderedValues), 'A highlighted sorted section must actually be sorted')
        if (step.pivot !== null) assert.ok(step.pivot >= 0 && step.pivot < input.length)
        if (step.auxiliary) {
          const { left, right, output, leftIndex, rightIndex } = step.auxiliary
          assert.deepEqual(left, ascending(left))
          assert.deepEqual(right, ascending(right))
          assert.equal(output.length, leftIndex + rightIndex)
          assert.deepEqual(output, ascending([...left.slice(0, leftIndex), ...right.slice(0, rightIndex)]))
        }
      }
      for (let index = 1; index < steps.length; index++) {
        assert.notEqual(steps[index].values, steps[index - 1].values, 'Earlier array snapshots must not be overwritten')
        if (steps[index].auxiliary && steps[index - 1].auxiliary) {
          assert.notEqual(steps[index].auxiliary.output, steps[index - 1].auxiliary.output, 'Earlier merge buffers must not be overwritten')
        }
      }
    }
  })

  test(`${id}: every displayed step has a complete translation in all three languages`, () => {
    for (const text of Object.values(dictionaries)) {
      assert.ok(text.sorting.algorithms[id].name)
      assert.ok(text.sorting.algorithms[id].description)
      for (const { message } of createSortingSteps(id, sortingInput)) {
        assert.equal(typeof text.sorting.messages[message.key], 'string', message.key)
        assert.doesNotMatch(formatMessage(text.sorting.messages[message.key], message.values), /\{\w+\}|undefined/)
      }
    }
  })
}

test('Finnish sorting title and navigation use Lajittelualgoritmit', () => {
  assert.equal(dictionaries.fi.pages.sorting.title, 'Lajittelualgoritmit')
  assert.ok(dictionaries.fi.topics.some(([title]) => title === 'Lajittelualgoritmit'))
})
