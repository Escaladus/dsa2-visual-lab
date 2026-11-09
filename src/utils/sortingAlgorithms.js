export const sortingAlgorithms = [
  { id: 'bubble', average: 'O(n²)' },
  { id: 'insertion', average: 'O(n²)' },
  { id: 'merge', average: 'O(n log n)' },
  { id: 'quick', average: 'O(n log n)' },
]

export const sortingInput = [7, 3, 9, 2, 6, 1, 8, 4, 5]

// Every frame owns its data so moving backwards restores the exact earlier state.
export function createSortingSteps(algorithm, input) {
  const values = [...input]
  const steps = []
  const settled = new Set()

  function snapshot(key, params = {}, state = {}) {
    const { auxiliary, ...rest } = state
    steps.push({
      values: [...values], active: [], sorted: [...settled], ordered: [],
      range: null, pivot: null, auxiliary: auxiliary ? {
        ...auxiliary, left: [...auxiliary.left], right: [...auxiliary.right], output: [...auxiliary.output],
      } : null,
      ...rest, message: { key, values: params },
    })
  }

  function bubble() {
    for (let end = values.length - 1; end > 0; end--) {
      for (let i = 0; i < end; i++) {
        snapshot('compare', { a: values[i], b: values[i + 1] }, { active: [i, i + 1], range: [0, end] })
        if (values[i] > values[i + 1]) {
          ;[values[i], values[i + 1]] = [values[i + 1], values[i]]
          snapshot('bubbleSwap', {}, { active: [i, i + 1], range: [0, end] })
        }
      }
      settled.add(end)
      snapshot('bubbleFixed', { value: values[end], position: end + 1 })
    }
  }

  function insertion() {
    for (let end = 1; end < values.length; end++) {
      const key = values[end]
      let i = end
      snapshot('insertionSelect', { value: key }, { active: [i], ordered: Array.from({ length: end }, (_, k) => k) })
      while (i > 0) {
        snapshot('insertionCompare', { value: key, left: values[i - 1] }, { active: [i - 1, i], range: [0, end] })
        if (values[i - 1] <= key) break
        ;[values[i - 1], values[i]] = [values[i], values[i - 1]]
        i--
        snapshot('insertionMove', { value: key }, { active: [i, i + 1], range: [0, end] })
      }
      snapshot('insertionPlaced', { value: key, position: i + 1 }, { active: [i], ordered: Array.from({ length: end + 1 }, (_, k) => k) })
    }
  }

  function merge(from, to) {
    if (from >= to) return
    const mid = Math.floor((from + to) / 2)
    snapshot('mergeSplit', { from: from + 1, to: to + 1, middle: mid + 1 }, { range: [from, to] })
    merge(from, mid)
    merge(mid + 1, to)
    const left = values.slice(from, mid + 1), right = values.slice(mid + 1, to + 1)
    const output = []
    let i = 0, j = 0
    const auxiliary = () => ({ left, right, output, leftIndex: i, rightIndex: j })
    snapshot('mergeStart', {}, { range: [from, to], auxiliary: auxiliary() })
    while (i < left.length || j < right.length) {
      if (i < left.length && j < right.length) {
        snapshot('compare', { a: left[i], b: right[j] }, { active: [from + i, mid + 1 + j], range: [from, to], auxiliary: auxiliary() })
      }
      const takeLeft = j === right.length || i < left.length && left[i] <= right[j]
      const value = takeLeft ? left[i++] : right[j++]
      output.push(value)
      snapshot(takeLeft ? 'mergeTakeLeft' : 'mergeTakeRight', { value }, { range: [from, to], auxiliary: auxiliary() })
    }
    values.splice(from, output.length, ...output)
    snapshot('mergeWrite', { from: from + 1, to: to + 1 }, {
      range: [from, to], ordered: Array.from({ length: to - from + 1 }, (_, k) => from + k), auxiliary: auxiliary(),
    })
  }

  function quick(from, to) {
    if (from > to) return
    if (from === to) {
      settled.add(from)
      snapshot('quickSingle', { value: values[from] }, { range: [from, to] })
      return
    }
    const pivot = values[to]
    let boundary = from
    snapshot('quickPivot', { value: pivot }, { pivot: to, range: [from, to] })
    for (let i = from; i < to; i++) {
      snapshot('quickCompare', { value: values[i], pivot }, { active: [i, to], pivot: to, range: [from, to] })
      if (values[i] < pivot) {
        if (i !== boundary) {
          ;[values[i], values[boundary]] = [values[boundary], values[i]]
          snapshot('quickSwap', { pivot }, { active: [i, boundary], pivot: to, range: [from, to] })
        }
        boundary++
      }
    }
    ;[values[boundary], values[to]] = [values[to], values[boundary]]
    settled.add(boundary)
    snapshot('quickPlaced', { value: pivot, position: boundary + 1 }, { active: [boundary], pivot: boundary, range: [from, to] })
    quick(from, boundary - 1)
    quick(boundary + 1, to)
  }

  const generators = { bubble, insertion, merge: () => merge(0, values.length - 1), quick: () => quick(0, values.length - 1) }
  if (!Object.hasOwn(generators, algorithm)) throw new Error(`Unknown sorting algorithm: ${algorithm}`)
  snapshot('start')
  generators[algorithm]()
  for (let i = 0; i < values.length; i++) settled.add(i)
  snapshot('done')
  return steps
}
