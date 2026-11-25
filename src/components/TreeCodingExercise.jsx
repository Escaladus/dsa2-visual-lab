import CodingExercise from './CodingExercise.jsx'
import sizeStarter from '../../exercises/btree-size/Solution.java?raw'
import heightStarter from '../../exercises/btree-height/Solution.java?raw'
import preStarter from '../../exercises/btree-pre/Solution.java?raw'
import inStarter from '../../exercises/btree-in/Solution.java?raw'
import postStarter from '../../exercises/btree-post/Solution.java?raw'
import { treeCodingExerciseTranslations } from '../i18n/treeCodingExercise.js'
import { treeTraversalExerciseTranslations } from '../i18n/treeTraversalExercise.js'

const starters = {
  size: sizeStarter,
  height: heightStarter,
  pre: preStarter,
  in: inStarter,
  post: postStarter,
}
const translations = { ...treeCodingExerciseTranslations, ...treeTraversalExerciseTranslations }

// A small asymmetric tree distinguishes total node count from the longest path.
const nodes = [
  [225, 40],
  [115, 110],
  [335, 110],
  [55, 185],
]
const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
]

function ExampleTree({ label }) {
  return (
    <svg className="coding-example-tree" viewBox="0 0 450 230" role="img" aria-label={label}>
      {edges.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={nodes[from][0]}
          y1={nodes[from][1]}
          x2={nodes[to][0]}
          y2={nodes[to][1]}
          stroke="#8ca6ce"
          strokeWidth="2"
        />
      ))}
      {nodes.map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r="25" fill="#152238" stroke="#8ca6ce" strokeWidth="2" />
          <text
            x={x}
            y={y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize="20"
            fontWeight="600"
          >
            {['A', 'B', 'C', 'D'][index]}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function TreeCodingExercise({ task }) {
  return (
    <CodingExercise
      folder={`btree-${task}`}
      algorithm={`recursive-tree-${task}`}
      starter={starters[task]}
      translations={translations[task]}
      className="tree-coding-exercise"
      collapsible
      renderExample={({ label }) => <ExampleTree label={label} />}
    />
  )
}
