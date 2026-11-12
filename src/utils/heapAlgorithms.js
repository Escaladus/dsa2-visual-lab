export const heapExample = [2, 5, 3, 9, 7, 6]
export const heapLimit = 15
export const heapValueMin = -99
export const heapValueMax = 999

export function validHeapValue(value) {
  return Number.isInteger(value) && value >= heapValueMin && value <= heapValueMax
}

export function isMinHeap(nodes) {
  return nodes.every((node, index) => index === 0 || nodes[Math.floor((index - 1) / 2)].value <= node.value)
}

function frame(nodes, key, values = {}, active = [], swapping = [], result = null) {
  return { nodes: nodes.map(node => ({ ...node })), message: { key, values }, active: [...active], swapping: [...swapping], result: result ? { ...result } : null, valid: isMinHeap(nodes) }
}

export function createHeapOperation(input, operation, entry) {
  if (!isMinHeap(input)) throw new Error('An operation must start from a valid min-heap')
  if (!['offer', 'peek', 'poll'].includes(operation)) throw new Error('Unknown heap operation')
  if (operation === 'offer' && (!entry || !validHeapValue(entry.value) || input.length >= heapLimit || input.some(node => node.id === entry.id))) throw new Error('Invalid heap insertion')
  const nodes = input.map(node => ({ ...node }))
  const steps = []
  let result = null
  const push = (key, values = {}, active = [], swapping = []) => steps.push(frame(nodes, key, values, active, swapping, result))

  if (operation === 'peek') {
    push('peekStart', {}, nodes.length ? [0] : [])
    result = { kind: 'peek', value: nodes[0]?.value ?? null }
    push(nodes.length ? 'peekResult' : 'peekEmpty', { value: result.value }, nodes.length ? [0] : [])
    return steps
  }

  if (operation === 'offer') {
    push('offerStart', { value: entry.value })
    nodes.push({ ...entry })
    let index = nodes.length - 1
    push('offerAppend', { value: entry.value, index }, [index])
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      const childValue = nodes[index].value, parentValue = nodes[parent].value
      push('compareUp', { child: childValue, parent: parentValue }, [parent, index])
      if (childValue >= parentValue) {
        push('upFits', { child: childValue, parent: parentValue }, [parent, index])
        break
      }
      ;[nodes[parent], nodes[index]] = [nodes[index], nodes[parent]]
      push('swapUp', { child: childValue, parent: parentValue }, [parent, index], [parent, index])
      index = parent
    }
    result = { kind: 'offer', value: true }
    push('offerDone', { value: entry.value, index }, [index])
    return steps
  }

  push('pollStart', {}, nodes.length ? [0] : [])
  if (!nodes.length) {
    result = { kind: 'poll', value: null }
    push('pollEmpty')
    return steps
  }
  const minimum = nodes[0].value
  const last = nodes.pop()
  result = { kind: 'poll', value: minimum }
  if (!nodes.length) {
    push('pollSingle', { value: minimum })
    return steps
  }
  nodes[0] = last
  push('pollReplace', { removed: minimum, value: last.value }, [0])
  let index = 0
  while (2 * index + 1 < nodes.length) {
    const left = 2 * index + 1, right = left + 1
    let child = left
    if (right < nodes.length) {
      if (nodes[right].value < nodes[left].value) child = right
      push('chooseChild', { left: nodes[left].value, right: nodes[right].value, child: nodes[child].value }, [left, right])
    }
    const parentValue = nodes[index].value, childValue = nodes[child].value
    push('compareDown', { parent: parentValue, child: childValue }, [index, child])
    if (parentValue <= childValue) {
      push('downFits', { parent: parentValue, child: childValue }, [index, child])
      break
    }
    ;[nodes[index], nodes[child]] = [nodes[child], nodes[index]]
    push('swapDown', { parent: parentValue, child: childValue }, [index, child], [index, child])
    index = child
  }
  push('pollDone', { value: minimum })
  return steps
}

export function createHeapState(values = heapExample) {
  const nodes = values.map((value, id) => ({ id, value }))
  if (values.length > heapLimit || !values.every(validHeapValue) || !isMinHeap(nodes)) throw new Error('Invalid initial heap')
  return { frames: [frame(nodes, values.length ? 'ready' : 'emptyReady')], index: 0, nextId: values.length, removedBefore: [], playing: false }
}

export function pollHistory(state) {
  const result = state.frames[state.index].result
  return result?.kind === 'poll' && result.value !== null ? [...state.removedBefore, result.value] : [...state.removedBefore]
}

export function heapLabReducer(state, action) {
  if (action.type === 'RESET') return createHeapState()
  if (action.type === 'EMPTY') return createHeapState([])
  const last = state.frames.length - 1
  if (action.type === 'SEEK') {
    if (!Number.isInteger(action.index)) return state
    return { ...state, index: Math.max(0, Math.min(last, action.index)), playing: false }
  }
  if (action.type === 'PLAY') return last === 0 ? state : { ...state, index: state.index === last ? 0 : state.index, playing: !state.playing }
  if (action.type === 'NEXT' || action.type === 'PREVIOUS' || action.type === 'TICK') {
    if (action.type === 'TICK' && !state.playing) return state
    const index = Math.max(0, Math.min(last, state.index + (action.type === 'PREVIOUS' ? -1 : 1)))
    return { ...state, index, playing: action.type === 'TICK' && index < last }
  }
  if (!['OFFER', 'PEEK', 'POLL'].includes(action.type) || state.index !== last || state.playing) return state
  const nodes = state.frames[state.index].nodes
  if (action.type === 'OFFER' && (!validHeapValue(action.value) || nodes.length >= heapLimit)) return state
  const frames = createHeapOperation(nodes, action.type.toLowerCase(), { id: state.nextId, value: action.value })
  return { ...state, frames, index: 0, nextId: state.nextId + Number(action.type === 'OFFER'), removedBefore: pollHistory(state), playing: false }
}
