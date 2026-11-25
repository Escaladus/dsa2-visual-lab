import {
  packageBfsExercise,
  packageBfsPathExercise,
  packageComponentsExercise,
  packageGraphExercise,
  packageTreeSizeExercise,
  packageTreeHeightExercise,
  packageTreeTraversalExercise,
} from './package-graph-exercise.mjs'
import { packageTraExamples } from './package-tra-examples.mjs'

console.log(`Prepared ${packageGraphExercise()}`)
console.log(`Prepared ${packageBfsExercise()}`)
console.log(`Prepared ${packageBfsPathExercise()}`)
console.log(`Prepared ${packageComponentsExercise()}`)
console.log(`Prepared ${packageTreeSizeExercise()}`)
console.log(`Prepared ${packageTreeHeightExercise()}`)
for (const order of ['pre', 'in', 'post']) {
  console.log(`Prepared ${packageTreeTraversalExercise(order)}`)
}
console.log(`Prepared ${packageTraExamples()}`)
