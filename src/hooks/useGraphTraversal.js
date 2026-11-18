import { useEffect, useMemo, useRef, useState } from 'react'
import { traversalExamples } from '../data/graphTraversal.js'
import { graphTraversalMoments, graphTraversalTasks } from '../data/graphTraversalLessons.js'
import { createGraphTraversalTrace, traversalContinuation } from '../utils/graphTraversal.js'
import { recursionTreeLayout } from '../utils/recursionAlgorithms.js'

/** Own traversal inputs and playback. Translated text belongs to the rendering components. */
export default function useGraphTraversal({ initialMode, colorsOnly, edgesOnly, active }) {
  const [preset, setPreset] = useState(edgesOnly ? 'directed' : 'branching')
  const [start, setStart] = useState(0)
  const [all, setAll] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [mode, setMode] = useState(initialMode)
  const [indices, setIndices] = useState({ dfs: 0, bfs: 0 })
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(850)
  const [panel, setPanel] = useState('tree')
  const [view, setView] = useState('graph')
  const [wideCode, setWideCode] = useState(false)
  const [classification, setClassification] = useState(edgesOnly)
  const [target, setTarget] = useState(2)
  const [task, setTask] = useState('reach')
  const stage = useRef(null)
  const lesson = useRef(null)
  const example = traversalExamples[preset]
  const traces = useMemo(
    () =>
      Object.fromEntries(
        ['dfs', 'bfs'].map(algorithm => [
          algorithm,
          createGraphTraversalTrace(example.graph, {
            algorithm,
            start,
            all,
            directed: example.directed,
            reverse,
          }),
        ]),
      ),
    [example, start, all, reverse],
  )
  // Colour lessons omit classification/timestamp events, but use the same underlying algorithm.
  const frames = useMemo(
    () =>
      colorsOnly
        ? traces[mode].filter(
            frame => !['edgeType', 'edgeKnown', 'stamp', 'finishTime'].includes(frame.message.key),
          )
        : traces[mode],
    [colorsOnly, traces, mode],
  )
  const index = indices[mode]
  const step = frames[index]
  const last = frames.length - 1
  const complete = index === last
  // Lay out the final forest once; revealing calls must not move existing vertices.
  const layout = useMemo(() => recursionTreeLayout(traces.dfs.at(-1).nodes), [traces])
  const continuation = mode === 'dfs' ? traversalContinuation(step) : null
  // Hidden learning views stay mounted to preserve state, so their timers must be stopped explicitly.
  useEffect(() => {
    if (!active || !playing) {
      return
    }
    if (complete) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(
      () => setIndices(prev => ({ ...prev, [mode]: Math.min(prev[mode] + 1, last) })),
      speed,
    )
    return () => clearTimeout(timer)
  }, [active, playing, complete, mode, index, last, speed])
  useEffect(() => {
    if (!active) {
      setPlaying(false)
    }
  }, [active])
  // A changed input invalidates both traces; changing only the algorithm keeps its saved cursor.
  function choose({
    preset: nextPreset = preset,
    start: nextStart = start,
    all: nextAll = all,
    reverse: nextReverse = reverse,
  }) {
    setPlaying(false)
    setIndices({ dfs: 0, bfs: 0 })
    setPreset(nextPreset)
    setStart(Math.min(nextStart, traversalExamples[nextPreset].graph.length - 1))
    setAll(nextAll)
    setReverse(nextReverse)
    setPanel('tree')
    setView('graph')
    setTarget(prev => Math.min(prev, traversalExamples[nextPreset].graph.length - 1))
  }
  function seek(i) {
    setPlaying(false)
    setIndices(prev => ({ ...prev, [mode]: Math.max(0, Math.min(last, i)) }))
  }
  function switchMode(next) {
    setPlaying(false)
    setMode(next)
  }
  function toggle() {
    if (complete) {
      setIndices(prev => ({ ...prev, [mode]: 0 }))
    }
    setPlaying(prev => !prev)
  }
  function explore(key) {
    const { preset, algorithm, event, matches, showEdgeTypes = false } = graphTraversalMoments[key]
    choose({ preset, start: 0, all: false, reverse: false })
    setMode(algorithm)
    setClassification(showEdgeTypes)
    const trace = createGraphTraversalTrace(traversalExamples[preset].graph, {
      algorithm,
      directed: traversalExamples[preset].directed,
    })
    setIndices({
      dfs: 0,
      bfs: 0,
      [algorithm]: trace.findIndex(step => step.message.key === event && matches(step)),
    })
    lesson.current.open = false
    requestAnimationFrame(() => {
      stage.current.focus({ preventScroll: true })
      stage.current.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
  }
  function launch(key) {
    const { preset, algorithm, traverseAll } = graphTraversalTasks[key]
    choose({ preset, start: 0, all: traverseAll, reverse: false })
    setMode(algorithm)
    setTask(key)
    setTarget(2)
    setClassification(key === 'cycle')
    requestAnimationFrame(() =>
      stage.current.scrollIntoView({ block: 'start', behavior: 'instant' }),
    )
  }
  return {
    trace: {
      preset,
      start,
      all,
      reverse,
      mode,
      example,
      traces,
      frames,
      step,
      index,
      complete,
      layout,
      continuation,
    },
    playback: { playing, speed, seek, toggle, setSpeed },
    workspace: {
      panel,
      setPanel,
      view,
      setView,
      wideCode,
      setWideCode,
      classification,
      setClassification,
    },
    application: { task, target, setTarget, launch },
    refs: { stage, lesson },
    actions: { choose, switchMode, explore },
  }
}
