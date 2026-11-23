# Reading and changing the code

The project separates the algorithm being taught from playback and rendering. A useful starting point is the topic in `src/App.jsx`, then its lab component, then the matching trace builder in `src/utils`.

## Where to look

| Responsibility                                               | Location                                                                                                       |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Topic selection and page contents                            | `src/App.jsx`                                                                                                  |
| Basic traversal, colour and edge-type learning tabs          | `src/components/GraphLearningLab.jsx`                                                                          |
| Extended DFS/BFS inputs, independent cursors and playback    | `src/hooks/useGraphTraversal.js`                                                                               |
| DFS/BFS snapshots and algorithm results                      | `src/utils/graphTraversal.js`                                                                                  |
| Named guided moments and application presets                 | `src/data/graphTraversalLessons.js`                                                                            |
| Extended traversal layout                                    | `src/components/GraphTraversalLab.jsx`                                                                         |
| Stack/queue, step explanation, vertex table and applications | `TraversalFrontier`, `TraversalStepSummary`, `TraversalStateTable` and `TraversalPractice` in `src/components` |
| Basic recursive DFS                                          | `BasicDfsLab`, `BasicDfsGraph`, `BasicDfsSummary` and `src/utils/recursiveDfs.js`                              |
| Factorial/Fibonacci controls and trace                       | `src/components/RecursionLab.jsx` and `src/utils/recursionAlgorithms.js`                                       |
| Execution panels, memoisation comparison and predictions     | `RecursionExecution`, `RecursionComparison` and `RecursionPrediction` in `src/components`                      |
| Recurrence work/geometry and its viewport                    | `src/utils/recurrenceTree.js`, `RecurrenceTreeLab` and `RecurrenceTreeViewport`                                |
| Runnable Java sources                                        | `src/examples`                                                                                                 |
| Short TRA teaching examples | `src/tra-examples/lessons`, `src/data/traJavaExamples.js`, `TraJavaExamples`, `src/utils/javaLesson.js` and `src/i18n/traJavaExamples.js` |
| Downloadable graph coding tasks and local checkers | `exercises/dfs-reachable`, `exercises/bfs-distances`; canonical JAR remains in dfs-reachable |
| Coding task page and archive builder | `GraphCodingExercise`, `src/i18n/graphCodingExercise.js` and `scripts/package-graph-exercise.mjs` |
| Translated UI and event explanations                         | `src/i18n`                                                                                                     |

## How a visualisation step works

For the planned graph/tree transition, start with [TRA_MIGRATION.md](TRA_MIGRATION.md): it maps every affected lesson, source, trace, question and test to its migration stage. [TRA_CONTRACTS.md](TRA_CONTRACTS.md) records the verified API, ordering rules, empty inputs and Java commands. `scripts/tra-library.mjs` owns the canonical JAR pin and supplies verified bytes to both ZIP builders. Keep the library in its existing exercise folder; do not maintain another source copy.

1. A pure trace builder runs the algorithm and records a complete history. It does not read the DOM or start timers.
2. The playback controller selects a history index. Back, forward and play select existing snapshots; they do not partially execute the algorithm again.
3. Rendering components read the selected snapshot and translated labels.

A snapshot must own its mutable arrays and nested objects. Copying only the outer object would let a later recursive call rewrite an earlier step. The snapshots and complete call tree are visualisation history, separate from the demonstrated algorithm's working-space bound.

## IDs and saved continuations

- A graph **vertex** identifies an input vertex. A **call ID** identifies a particular invocation. `step.current` is a call ID; `step.vertex` is a vertex ID in the extended traversal.
- A call frame owns `locals` and a saved continuation. Its caller resumes at the recursive call site, then continues its own loop or expression.
- A completed child's `returned` record identifies the receiving caller. A return transfers control; it does not create a graph edge.
- The shared call-tree renderer also accepts DFS calls. Their `n` field contains the vertex ID for compatibility with the factorial/Fibonacci tree shape.
- The extended graph model uses `-1` for unknown parent/root/distance and `0` for a timestamp that has not happened. Another forest root retains distance `-1` from the originally selected start; its local depth is stored separately.

The basic, colour and edge-type panels remain mounted after their first visit. This preserves their private steps and view settings. Hidden panels receive `active=false` and must stop playback. Language changes translate the existing state rather than resetting it.

## Editing Java and highlighted lines

The DFS coding task is a separate download supporting JDK 11 and newer. Its `Solution.java` is deliberately unfinished and is not part of the 31 runnable examples. `GraphCodingExercise` imports that exact starter as text. `Check.java` uses the JDK compiler with `--release 11`, a fresh temporary build and one worker process per check group. `GraphChecks.java` constructs inputs, computes an independent BFS reference from integer edges and checks the student's returned count, colours and graph structure. Each worker has a timeout and bounded heap/stack; this is a local teaching tool, not a sandbox service for public submissions. Results are not persisted, and rerunning after edits always starts fresh. The exercise tests compile every delivered Java file for release 11; set `GRAPH_EXERCISE_JDK` to a JDK directory to run `node --test tests/graphCodingExercise.test.js` with that runtime and compiler.

`predev`/`prebuild` generate the ignored ZIP in `public/exercises` using the source files in `exercises/dfs-reachable`. The Node-only ZIP builder stores entries with deterministic timestamps. Keep the supplied JAR unchanged; its hash and package choice are documented in the included readmes. The browser uses Vite's base URL for the download, including repository Pages paths. Source changes require regenerating the ZIP before testing a download.

Additional TRA examples live separately from the original standalone catalogue. `package-java-downloads.mjs` now prepares both the task ZIP and `public/examples/tra-graphs.zip`; the latter reuses the canonical JAR from the task folder and generates `expected-output.txt` from the TRA catalogue. `TraJavaExamples` displays primary TRA sources first on migrated topics; standalone graph variants are optional collapsed comparisons. Keep the two catalogues separate: their classpaths differ. Each TRA file runs independently with the supplied JAR on JDK 11+. Traversal results use vertex identity and fresh containers per call; resetting colours does not rewrite previously returned lists or maps. Tests compile the actual archive, compare source-mode output and check graph algorithms against integer reference traversals.

`TraTraversalExample.java` is the source of truth for the extended traversal's displayed Java methods:

```bash
npm run sync:java-snippets
npm run check:java-snippets
```

The script produces `src/data/graphTraversalCode.js`; do not edit that generated file directly. It preserves method-relative line numbers. Java statements locate execution highlights and quiz excerpts, so moving a statement to a different line does not require changing a numeric slice. Renaming a statement still requires updating its selector in `src/utils/graphTraversal.js` or `src/data/graphQuiz.js`.

Some teaching events group related metadata assignments, such as assigning a child's parent, root, depth and distance. Their highlight points to the first statement in that group. Keep the event explanation consistent with the whole group when changing it.

Basic DFS is generated from `TraRecursiveDfsExample.java` into `recursiveDfsCode.js`; basic BFS is generated from `TraBfsExample.java` into `basicBfsCode.js`. `data/recursiveDfs.js` exposes statement-based line lookup. Factorial/Fibonacci keep their existing snippets in `data/recursion.js`. Change each source, matching selectors and explanations together. Basic DFS has an actual per-call `Iterator<Vertex>` and a scoped i counter; next() advances the iterator before a child call, while the for-loop increments i after that child returns. Extended DFS uses i in an explicitly prepared Java List. Neither is Vertex.index.

Java examples target JDK 11. Comments use English to keep source code consistent across the three interface languages. Explain contracts and decisions, such as excluding a parent edge or rejecting a stale queue entry, rather than narrating every assignment.

## Checks before finishing a change

```bash
npm run format
npm run format:check
npm run lint
npm test
npm run build
```

Prettier owns layout; ESLint checks undefined variables, unreachable code and duplicate object keys. Both checks run before a Pages build. They are development dependencies and add no browser runtime libraries.

Tests include execution of Java examples when a JDK is available. They do not replace a browser check for rendering changes. For visualisation refactors, check playback, rewinding, language preservation, mobile tabs, internal scrolling and the position of the bottom controls. New layout components should retain the existing DOM classes and accessibility relationships unless the layout itself is intentionally changing.

## Graph basics after migration stage 2

`GraphBasicsLesson` renders `data/graphBasics.js` and extracts its construction method directly from `TraGraphExample.java`; its copy and class links are in `i18n/graphBasics.js`. The Java reference emits the real factory's topology/weights for comparison to that drawing. `TraGraphDataExample` keeps outgoing counts in an IdentityHashMap without changing the input.

`primaryTopics` in the TRA catalogue puts that block first for migrated topics; `comparisonTopics` in the standalone catalogue moves the old custom graph to an optional collapsed group. Keep ordinary Map examples visible. Dependency notes must describe the particular source group, not every example on the page. Existing DFS/BFS snippets are not migrated by this placement change.

## TRA traversal after migration stage 3

Vertex IDs in browser snapshots are stable visual identifiers; runnable algorithms use real TRA Vertex references and identity-keyed metadata. Extended classification keys the physical Edge and excludes its reverse parent view. State captures final colours so a later run resetting vertices cannot rewrite earlier results. Generated snapshots still retain their own nested data for rewinding.

The A–H BFS retains its drawing and queue layout, adds the currently processed vertex separately from the newly discovered focus, and records BLACK only after all neighbours. Its code details highlight statements extracted from TraBfsExample. The expanded colour/edge/practice workspace retains independent cursors, mobile tabs, code expansion and bottom controls. Preparation details expose the actual State constructor and sorting cost.

`tests/traTraversalEvents.test.js` injects observation calls into temporary copies of exact source statements. It compares real intermediate Vertex colours, metadata, queue contents, PRE/POST and waiting/resuming i values with the JS trace. The downloadable sources contain no observation hooks. Full-result tests cover every lesson graph/start/scope/order/algorithm combination; native/basic helpers also run on generated graphs.

## Trees and priority queues after migration stage 4

`data/treeTraversal.js` owns the four presets; `utils/treeTraversal.js` produces one immutable snapshot per processing event. `TreeTraversalLab` keeps the original A–G geometry and controls, shows edge height/depth and paths, and handles the null root without a fake processed node. Its displayed method, construction, size/height and general-tree examples are generated from `TraTreeExample.java` by the same sync script. The combined Java method appends PRE/IN/POST in one run; the selected view filters to its append events. Node frames exclude short null calls; Java's actual maximum includes one more frame.

`TraPriorityQueueExample.java` is the heap topic's primary runnable source. Preserve the educational heap renderer/reducer; compare its completed operations to actual TRA values/results, never its exact internal array. `tests/treeTraversal.test.js` uses an iterative independent reference, the real BTree factories, generated trees with repeated values and real PriorityQueue sequences. `TraTreeQueueChecks.java` checks structure preservation, first-child/sibling links, comparator copies, duplicate/extreme priorities and null rejection.

## Traversal applications after migration stage 5

`GraphApplicationsLab` mounts the existing `GraphTraversalLab` only after its details is opened. Five buttons pick `graphTraversalTasks`; `initialTask` sets the initial graph, mode and scope in `useGraphTraversal`. Choosing another problem starts a new walkthrough, while language changes preserve the current one. Closing details stops playback without discarding its step. The original DFS/BFS views and bottom controls retain their behaviour.

`TraComponentsExample` is a standalone undirected Graph lesson: component DFS plus a separate cycle DFS that skips the identical parent Edge. It iterates Edge directly to avoid repeated linear `Vertex.getEdge` searches. `TraTopologicalExample` performs a full DiGraph DFS, throws on a GREY neighbour and exposes reverse POST only on success. Its error contract permits interrupted colours, reset on the next run. Both use native iteration, Θ(V + E) time and O(V) additional space.

The shared `TraTraversalExample.State` now prepares aligned neighbour and outgoing Edge lists. DFS indexes both by its saved i, keeping source/trace alignment while eliminating the old per-neighbour linear edge lookup. Preparation still includes sorting and takes O(V + E + Σ d(v) log(d(v) + 1)) time and O(V + E) space. Update its Java source, regenerate snippets and keep the preparation explanation in all languages aligned.

`tests/traApplications.test.js` compiles the actual sources and `TraApplicationsChecks.java` for release 11. Independent Floyd-style reachability/distances, Kahn cycle checks and the forest edge-count property validate components, paths, cycle witnesses and orders on 240 generated graphs. Tests accept any valid result and verify actual factory topology against the three diagram presets, duplicate labels, empty/single inputs, disconnected cycles, self-loops, repeated runs and structure preservation.

## Weighted paths after migration stage 6a

`TraDijkstraExample` keeps distances/parents in private IdentityHashMaps and uses immutable QueueEntry objects in an explicitly imported TRA PriorityQueue. Always validate all weights, including unreachable edges; use the capacity-plus-comparator constructor. Improvements offer a new entry, and stale entries must be skipped before examining outgoing Edge objects. Do not mutate Vertex.weight to represent a queued priority. Result queries reject foreign vertices; source null is valid only for an empty input.

`TraFloydWarshallExample.Result` assigns external indices to actual Vertex references and builds distance/next-hop matrices from outgoing Edge objects. DiGraph directions are preserved; Graph supplies both adjacency directions. The k loop is outermost, infinity subpaths are skipped, and a negative diagonal rejects the entire result before it escapes. Distances alone do not reconstruct a path: keep next-hop updates aligned with each improvement. Empty/self/unreachable path conventions and the global rejection policy are shared across source comments, output, descriptions and the three lesson supplements.

Weights are finite float input, summed in double. The examples use strict improvement comparisons; numeric error tolerances belong in independent verification, not in queue comparator equality. Expected O(1) identity-map access is assumed in the published bounds. `tests/traShortestPaths.test.js` compiles the actual sources for release 11 and runs `TraShortestPathsChecks.java`: Bellman-Ford references, 340 generated weighted inputs, actual path sums, equal alternatives/zero cycles, disconnected negative cycles, direction/identity, all input fields, repeat ownership, non-finite rejection, subnormal/large float sums and decimal-representation cases.

## Spanning forests after migration stage 6b

`TraMinimumSpanningTreeExample` is one independently runnable source containing both Prim and Kruskal. Its Graph parameter deliberately excludes DiGraph. Result owns read-only Vertex/Edge lists, component count and a double weight snapshot; list elements remain actual input objects, not deep copies. Empty means zero components and is not named a tree; a single vertex is a zero-edge tree. Forest outputs cover all components with V-C selected physical edges.

Prim stores actual crossing Edge objects in TRA PriorityQueue using the capacity-plus-comparator constructor. `addBoundary` visits a fresh vertex and offers only edges to unreached endpoints. Each physical edge is offered at most once, but a queued edge can become stale; skip it when both endpoints have been reached. Drain the queue before starting another root, including isolated vertices. Do not assume stored Edge endpoint order identifies the new vertex, or change weights while queued.

Kruskal copies Graph.edges(), sorts by weight and uses external IdentityHashMap indices into private DisjointSets arrays. The arrays implement rank/compression; Vertex.index, colours, weights, labels and graph topology stay unchanged. Ties may produce different forests, so do not compare exact selected edge lists except the fixed sample output.

`tests/traSpanningForests.test.js` compiles for release 11 and runs `TraSpanningForestChecks.java`. Independent BFS connectivity and subset enumeration check coverage/acyclicity/count/minimum weight; a maximum-on-tree-path exchange check validates minimum forests on larger inputs, including all-negative paths. The suite covers all 76 labelled topologies through four vertices, 320 generated graphs, endpoint storage reversal, duplicate labels, ties/zero/negative weights, isolated/empty vertices, non-finite rejection, float extremes, read-only lists and repeat/input preservation. A real Dijkstra run confirms the same-triangle contrast with a shortest-path tree.

## Graph analysis after migration stage 6c

`TraGraphCutsExample.find(Graph)` owns identity tin/low maps, cut vertices and physical bridge Edge references. Its DFS skips the identical parent edge, uses a visited neighbour's tin and a returning child's low, and treats root child count separately. The result snapshots times and read-only output lists. Weights/colours are irrelevant, and every component is visited. Entry-only tin differs from the earlier two-event tin/tout counter. Expected core cost O(V + E) time/O(V) space; console label sorting is separate.

`TraBipartiteMatchingExample.match(Graph, left)` validates distinct member left vertices and every crossing edge; right is the graph complement. It does not compute a bipartition automatically. Fresh seen-right state per left search and recursive owner reassignment produce maximum cardinality. Actual Edge pairs and symmetric Vertex partners are returned; unmatched members give null, foreign queries fail. Weights are ignored. Expected cost O(V + E + L E) time/O(V) space, assuming expected O(1) identity operations.

`TraMaxFlowExample.maxFlow(DiGraph, source, sink)` validates distinct member terminals and stored float capacities as finite integers in [0, 1_000_000_000]. This is a deliberate teaching policy, not a restriction of TRA Edge itself. Validated capacities, flow and residual amounts are exact longs with checked additions. ResidualArc is private cancellation bookkeeping referring to real Vertex/Edge objects; it is not a replacement input graph class. Each original Edge has a distinct forward/reverse pair, so original antiparallel arcs remain independent. No graph edge is inserted or mutated. LinkedQueue BFS allocates discovered-parent state only for reached vertices per round. Expected O(V + E + V E²) time/O(V + E) space includes initial/final full-input passes. Results snapshot per-Edge capacities/flows and a min-cut witness. No full augmentation history is stored; reverseSteps is only a counter.

`tests/traGraphAnalysis.test.js` compiles all three real sources for release 11 and runs TraGraphAnalysisChecks. Independent references remove vertices/edges, enumerate matching choices and enumerate source-side cuts. They check actual edge identity, capacity bounds, conservation, cut equality, repeats and preserved fields on 160 graphs per algorithm plus boundaries. Cases include duplicate labels, ignored NaN weights for topology algorithms, invalid partitions/capacities/terminals, zero/antiparallel/loop flow edges, real residual cancellation and a 3-billion flow. Keep these algorithms' different input contracts explicit; do not propagate flow's capacity restriction to unweighted cuts/matching.


## Editing the short TRA teaching catalogue

The student examples live in `src/tra-examples/lessons/<group>`, separate from the sixteen technical reference files at the parent level. One file teaches one operation and runs independently with Java 11 and traj.jar. Add its metadata to `src/data/traJavaExamples.js` and four translated fields (title, goal, complexity, explanation) to `src/i18n/traJavaExamples.js`. Set advanced only for a next step with explained prerequisites.

Mark exactly one source region with `// lesson:start` and `// lesson:end`. `javaLessonExcerpt` extracts it with relative indentation intact, so the page never maintains a second code copy. The full file stays in a nested disclosure. Choose a small input diagram matching main and add its exact console output. Keep setup in main and algorithm methods readable; technical validators belong in tests unless needed by the lesson's correctness.

The package builder includes catalogue paths under topic folders plus root traj.jar, three README files, expected output and per-group RUN.txt. Update all three instructions when adding a source. Commands in the ZIP run from tra-graphs; individual-download commands assume the file is next to the JAR. `tests/traLessons.test.js` checks both the packaged source launcher and compiled output for every entry. `tests/fixtures/TraLessonChecks.java` supplies independent algorithm references for the shorter implementations.

The parent Java files and `traReferenceExamples.js` support existing animation/code synchronisation and stricter regression checks. They are no longer beginner downloads. Do not change them or their generated line maps merely to edit a student lesson. Earlier implementation sections in this guide describe those reference algorithms; the current teaching versions and their different bounds are documented in TRA_CONTRACTS.md and the lesson README.


## Contracts, narrated cases and the BFS task

Write short Javadoc before algorithm methods, outside the teaching-region markers. Explain initial state, return values and mutations; comments inside the region should explain the reason for a critical step. `contracts` in the TRA translation dictionary makes those prerequisites visible in each interface language. `traces` adds short narrated steps for DFS cycles, BFS shared discovery and full disconnected traversal. These annotations do not change the original animation models.

`GraphCodingExercise` selects DFS or BFS using its algorithm prop. The two starter contracts and translations are separate; the small directed diamond drawing is shared. `packageBfsExercise` writes the new kit, reusing the same verified JAR bytes as DFS. Keep checkers out of the beginner example catalogue. Tests compile their fixtures into a separate directory so Java 11 source-file launch does not encounter an existing Check.class in its application classpath. Run meaningful incorrect implementations as well as the reference to verify feedback and retries. Optional self-evaluation is a comment/disclosure, not a scored web form.
