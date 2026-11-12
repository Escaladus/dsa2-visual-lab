import assert from 'node:assert/strict'
import test from 'node:test'
import { createHeapOperation, createHeapState, heapExample, heapLabReducer as reduce, heapLimit, isMinHeap, pollHistory, validHeapValue } from '../src/utils/heapAlgorithms.js'
import { dictionaries, formatMessage } from '../src/i18n/index.js'

const values = nodes => nodes.map(node => node.value)
const sorted = numbers => [...numbers].sort((a, b) => a - b)
const finish = state => reduce(state, { type: 'SEEK', index: state.frames.length - 1 })

function checkFrames(frames) {
  for (let index = 0; index < frames.length; index++) {
    const step = frames[index]
    assert.equal(new Set(step.nodes.map(node => node.id)).size, step.nodes.length)
    const valid = step.nodes.every((node, i) => !i || step.nodes[Math.floor((i - 1) / 2)].value <= node.value)
    assert.equal(step.valid, valid, 'Repair status must describe the actual current heap')
    for (const i of [...step.active, ...step.swapping]) assert.ok(i >= 0 && i < step.nodes.length)
    if (index) {
      assert.notEqual(step.nodes, frames[index - 1].nodes)
      for (const node of step.nodes) assert.ok(!frames[index - 1].nodes.includes(node), 'Earlier snapshots must own their node data')
    }
    for (const dictionary of Object.values(dictionaries)) {
      const template = dictionary.heap.messages[step.message.key]
      assert.equal(typeof template, 'string', step.message.key)
      assert.doesNotMatch(formatMessage(template, step.message.values), /\{\w+\}|undefined/)
    }
  }
  assert.equal(frames.at(-1).valid, true)
}

test('offer sifts up, poll chooses the smaller child, and peek leaves the heap unchanged', () => {
  const input = Object.freeze(createHeapState().frames[0].nodes.map(Object.freeze))
  const offered = createHeapOperation(input, 'offer', { id: 6, value: 1 })
  checkFrames(offered)
  assert.equal(offered.filter(step => step.message.key === 'swapUp').length, 2)
  assert.deepEqual(values(offered.at(-1).nodes), [1, 5, 2, 9, 7, 6, 3])
  assert.deepEqual(offered.at(-1).result, { kind: 'offer', value: true })
  assert.ok(offered.some(step => !step.valid))
  const polled = createHeapOperation(input, 'poll')
  checkFrames(polled)
  assert.deepEqual(values(polled.at(-1).nodes), [3, 5, 6, 9, 7])
  assert.deepEqual(polled.at(-1).result, { kind: 'poll', value: 2 })
  const peeked = createHeapOperation(input, 'peek')
  checkFrames(peeked)
  assert.ok(peeked.every(step => JSON.stringify(step.nodes) === JSON.stringify(input)))
  assert.deepEqual(peeked.at(-1).result, { kind: 'peek', value: 2 })
  assert.deepEqual(values(input), heapExample)
})

test('empty queues return null; zero, negative values and duplicates remain real elements', () => {
  for (const operation of ['peek', 'poll']) {
    const frames = createHeapOperation([], operation)
    checkFrames(frames)
    assert.deepEqual(frames.at(-1).nodes, [])
    assert.deepEqual(frames.at(-1).result, { kind: operation, value: null })
  }
  let nodes = []
  for (const [id, value] of [0, -5, 0, -5, 999, -99].entries()) {
    const frames = createHeapOperation(nodes, 'offer', { id, value })
    checkFrames(frames)
    nodes = frames.at(-1).nodes
  }
  const output = []
  while (nodes.length) {
    const frames = createHeapOperation(nodes, 'poll')
    checkFrames(frames)
    output.push(frames.at(-1).result.value)
    nodes = frames.at(-1).nodes
  }
  assert.deepEqual(output, [-99, -5, -5, 0, 0, 999])
})

test('mixed heap operations agree with an independently sorted multiset', () => {
  let seed = 29, nextId = 0, nodes = [], bag = []
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed }
  for (let i = 0; i < 600; i++) {
    const choice = random() % 3
    const operation = nodes.length >= heapLimit ? 'poll' : choice === 0 ? 'offer' : choice === 1 ? 'poll' : 'peek'
    const value = random() % 31 - 15
    const before = structuredClone(nodes)
    const frames = createHeapOperation(nodes, operation, { id: nextId++, value })
    checkFrames(frames)
    assert.deepEqual(nodes, before)
    if (operation === 'offer') bag.push(value)
    else {
      const expected = bag.length ? Math.min(...bag) : null
      assert.equal(frames.at(-1).result.value, expected)
      if (operation === 'poll' && bag.length) bag.splice(bag.indexOf(expected), 1)
    }
    nodes = frames.at(-1).nodes
    assert.deepEqual(sorted(values(nodes)), sorted(bag))
    assert.equal(isMinHeap(nodes), true)
  }
})

test('new operations wait for completion and replay does not duplicate poll history', () => {
  let state = createHeapState([0, 0, 2])
  state = reduce(state, { type: 'POLL' })
  assert.equal(reduce(state, { type: 'OFFER', value: 1 }), state)
  assert.equal(reduce(state, { type: 'PEEK' }), state)
  assert.deepEqual(pollHistory(state), [])
  state = finish(state)
  assert.deepEqual(pollHistory(state), [0])
  state = reduce(state, { type: 'PLAY' })
  assert.equal(state.index, 0)
  assert.equal(state.playing, true)
  assert.deepEqual(pollHistory(state), [])
  while (state.playing) state = reduce(state, { type: 'TICK' })
  assert.deepEqual(pollHistory(state), [0])
  state = finish(reduce(state, { type: 'PEEK' }))
  assert.equal(state.frames[state.index].result.value, 0)
  assert.deepEqual(pollHistory(state), [0])
  state = finish(reduce(state, { type: 'POLL' }))
  assert.deepEqual(pollHistory(state), [0, 0])
  state = reduce(state, { type: 'PREVIOUS' })
  assert.equal(state.playing, false)
  assert.equal(reduce(state, { type: 'POLL' }), state)
  state = finish(state)
  state = finish(reduce(state, { type: 'POLL' }))
  assert.deepEqual(pollHistory(state), [0, 0, 2])
  state = finish(reduce(state, { type: 'POLL' }))
  assert.deepEqual(pollHistory(state), [0, 0, 2])
  assert.equal(state.frames[state.index].result.value, null)
})

test('limits, invalid input, clearing and reset protect the heap and stop playback', () => {
  for (const value of ['', null, undefined, '1', NaN, Infinity, 0.5, -100, 1000]) assert.equal(validHeapValue(value), false)
  for (const value of [-99, 0, 999]) assert.equal(validHeapValue(value), true)
  const full = createHeapState(Array.from({ length: heapLimit }, (_, i) => i))
  assert.equal(reduce(full, { type: 'OFFER', value: 2 }), full)
  assert.throws(() => createHeapOperation(full.frames[0].nodes, 'offer', { id: 20, value: 2 }))
  assert.throws(() => createHeapState([3, 1]))
  let state = reduce(createHeapState(), { type: 'OFFER', value: 1 })
  state = reduce(state, { type: 'PLAY' })
  state = reduce(state, { type: 'EMPTY' })
  assert.equal(state.playing, false)
  assert.deepEqual(state.frames[0].nodes, [])
  assert.equal(reduce(state, { type: 'TICK' }), state, 'A cancelled timer must not advance the next operation')
  state = reduce(state, { type: 'RESET' })
  assert.deepEqual(values(state.frames[0].nodes), heapExample)
  assert.deepEqual(pollHistory(state), [])
  assert.equal(state.playing, false)
})
