import CodingExercise from './CodingExercise.jsx'
import dfsStarter from '../../exercises/dfs-reachable/Solution.java?raw'
import bfsStarter from '../../exercises/bfs-distances/Solution.java?raw'
import pathStarter from '../../exercises/bfs-path/Solution.java?raw'
import componentsStarter from '../../exercises/graph-components/Solution.java?raw'
import { graphCodingExerciseTranslations } from '../i18n/graphCodingExercise.js'
import { bfsCodingExerciseTranslations } from '../i18n/bfsCodingExercise.js'
import { bfsPathExerciseTranslations } from '../i18n/bfsPathExercise.js'
import { componentsCodingExerciseTranslations } from '../i18n/componentsCodingExercise.js'

const vertices = [
  [55, 110],
  [175, 45],
  [175, 175],
  [295, 110],
  [395, 175],
]
const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
]

// Task drawings are independent of the interactive traversal models.
const directedExample = { vertices, edges, directed: true, start: 0, target: null }
const codingTasks = {
  dfs: {
    folder: 'dfs-reachable',
    algorithm: 'dfs',
    starter: dfsStarter,
    translations: graphCodingExerciseTranslations,
    example: directedExample,
  },
  bfs: {
    folder: 'bfs-distances',
    algorithm: 'bfs',
    starter: bfsStarter,
    translations: bfsCodingExerciseTranslations,
    example: directedExample,
  },
  bfsPath: {
    folder: 'bfs-path',
    algorithm: 'bfs',
    starter: pathStarter,
    translations: bfsPathExerciseTranslations,
    example: { ...directedExample, target: 3 },
  },
  components: {
    folder: 'graph-components',
    algorithm: 'dfs-or-bfs',
    starter: componentsStarter,
    translations: componentsCodingExerciseTranslations,
    example: {
      vertices: [
        [55, 70],
        [175, 70],
        [350, 70],
        [110, 170],
        [250, 170],
      ],
      edges: [
        [0, 1],
        [3, 4],
      ],
      directed: false,
      start: null,
      target: null,
    },
  },
}

function ExampleGraph({ id, label, example }) {
  const { vertices, edges, directed, start, target } = example
  return (
    <svg className="coding-example-graph" viewBox="0 0 450 230" role="img" aria-label={label}>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8ca6ce" />
        </marker>
      </defs>
      {edges.map(([from, to]) => {
        const [x1, y1] = vertices[from]
        const [x2, y2] = vertices[to]
        const distance = Math.hypot(x2 - x1, y2 - y1)
        const dx = (x2 - x1) / distance
        const dy = (y2 - y1) / distance
        return (
          <line
            key={`${from}-${to}`}
            x1={x1 + dx * 25}
            y1={y1 + dy * 25}
            x2={x2 - dx * 29}
            y2={y2 - dy * 29}
            stroke="#8ca6ce"
            strokeWidth="2"
            markerEnd={directed ? `url(#${id})` : undefined}
          />
        )
      })}
      {vertices.map(([x, y], index) => (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r="25"
            fill={index === start ? '#284d79' : '#152238'}
            stroke={index === start ? '#8ff0c4' : index === target ? '#ffd166' : '#8ca6ce'}
            strokeWidth="2"
          />
          <text
            x={x}
            y={y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="20"
            fontWeight="600"
          >
            {index}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function GraphCodingExercise({ task = 'dfs', collapsible = false }) {
  const settings = codingTasks[task]
  return (
    <CodingExercise
      {...settings}
      className="graph-coding-exercise"
      collapsible={collapsible}
      renderExample={({ id, label }) => (
        <ExampleGraph id={id} label={label} example={settings.example} />
      )}
    />
  )
}
