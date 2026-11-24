# Moving graph and tree lessons to TRA

Stages 1–6 of the API migration are complete. The teaching-example rewrite was completed on 23 November 2026; new coding exercises and the final overall audit remain stages 7–8. The ignored local plan retains the historical completed items and tracks the rewrite separately in section 16.

## Current teaching catalogue

`src/data/traJavaExamples.js` lists 52 independent Java 11 lessons in `src/tra-examples/lessons/<group>`. `src/i18n/traJavaExamples.js` supplies their titles, goals, explanations and implementation-specific bounds in English, Russian and Finnish. `TraJavaExamples` groups them by topic, extracts the marked teaching region directly from the downloadable source, and collapses the complete file/command separately. Advanced lessons are under a separate disclosure. No new runtime library is used.

| Topic | Short independent examples |
| --- | --- |
| Graph basics | TraCreateGraph, TraCreateDirectedGraph, TraListVertices, TraListNeighbors, TraReadEdgeWeight |
| Map | TraVertexMap: two same-label Vertex keys remain distinct |
| DFS / graph recursion | TraSimpleDfs, TraDfsCycle, TraDfsPrePost; separate TraColourDfs, then TraDfsTimes and TraDfsEdgeTypes |
| BFS | TraSimpleBfs, TraBfsDiscovery, TraBfsDistances, TraBfsPath |
| Traversal applications | TraFullDfs, TraUndirectedCycle, TraDirectedCycle, TraTopologicalOrder |
| Trees | TraCreateTree, TraTreeChildren, separate TraTreePRE/IN/POST, TraTreeSize, TraTreeHeight, TraGeneralTreeChildren |
| PriorityQueue | TraQueueOffer, TraQueuePeek, TraQueuePoll, TraQueueDuplicates, TraQueueComparator, TraTaskPriority |
| Weighted paths | TraDijkstraDistances, TraDijkstraPath, TraGraphMatrix, TraFloydDistances, TraFloydPath |
| MST | TraPrim, TraDisjointSets, TraKruskal |
| Graph analysis | TraLowValues, TraBridges, TraArticulationPoints, TraMatchingStep, TraMaximumMatching |
| Flow | TraResidualCapacity, TraAugmentFlow, TraCancelFlow, TraMaximumFlow, TraMinimumCut |

The ZIP contains only this teaching catalogue, the pinned JAR, English/Finnish README files, checked output and per-topic RUN.txt indexes. Paths in the instructions are relative to the extracted tra-graphs folder; each source runs alone. Individual downloads can sit next to traj.jar. The original 31 JDK files remain optional comparisons where replaced.

## Existing visualisations and technical references

The sixteen original multi-purpose TRA files remain at `src/tra-examples/*.java` and are catalogued separately in `src/data/traReferenceExamples.js`. They support source synchronisation and independent regression checks. They are outside the student catalogue and ZIP. Basic DFS/colour separation, graph/tree drawings, saved call continuations, bottom controls, code expansion and mobile tabs remain unchanged.

`scripts/sync-java-snippets.mjs` still reads those technical files for the animation. `GraphBasicsLesson` still extracts its small A/B/C/D construction method from the reference source. New examples intentionally use smaller independent inputs and are not exact replacements for the Java API of those visualisation fixtures. Do not silently replace a generated snippet or published exercise method when changing a student example.

## Teaching contracts and verification

Each new example states its starting conditions. A basic DFS uses visited instead of colours. Colour-based examples initialise colours in main and may change them. Static tin/low clocks/maps are explicitly reset for each demonstration. Matching assumes a known valid bipartition. Matrix algorithms require the supplied list to contain every actual Vertex exactly once.

The first Dijkstra scans vertices: expected O(V² + E), O(V) space. The first Kruskal uses an explicit unoptimised DSU: expected O(V + E log(E + 1) + E·V), O(V + E) space. Prim uses the real TRA PriorityQueue. Complete flow uses the simpler residual matrix, reports total flow/cut rather than per-Edge flow, and has O(V² + E + V³·E) time/O(V²) space. These versions deliberately have different bounds/contracts from the older technical implementations below. Flow stored capacities must be finite integral floats in [0, 10⁹].

`tests/traLessons.test.js` checks metadata/translations, exact source regions, actual ZIP layout, class version 55, isolated source-file launch commands and displayed output. `TraLessonChecks.java` independently verifies the new algorithms using relaxation, enumeration and deletion references. Existing source/animation equivalence and technical algorithm checks are retained. Browser checks cover all three languages, mobile/desktop layouts, disclosures, source/output identity and downloads with a Pages base path.

## Remaining work

- Stage 7 in progress: DFS reachability, BFS shortest-distance and shortest-path exercises are available; component and tree exercises remain. The existing DFS method contract is unchanged.
- Stage 8: final overall migration audit and course-material review after the exercise stage.
- SCC, bridges exercises, a graph editor, weighted animations and arbitrary partition validation are not added by this rewrite.

## Historical API migration verification

The sections below describe the technical reference implementations and their packaging at the time each migration stage finished. Their old source counts, ZIP contents and “primary” placements are historical, superseded by the current teaching catalogue above. Algorithm tests for those references remain useful and are preserved.

## Stage 1 verification

- Compared the user-supplied download and the canonical repository JAR byte hash; they match.
- Read bundled Javadoc and inspected actual public signatures using `javap`. The supplied online Javadoc URL timed out on 19 November 2026; its contents were not claimed to have been independently verified.
- `tests/fixtures/TraLibraryChecks.java` executes the documented graph identity/direction/edge, loop, overload, colour, tree and queue assumptions against that binary. `tests/traLibrary.test.js` compiles it for Java 11 and verifies the pin rejects a changed binary.
- Existing TRA example/task tests continue to extract and execute the real download packages. The stage changes packaging validation and documentation, not lesson layout or traversal behaviour.

## Stage 2 verification

Graph basics now teaches the TRA classes and the A→B (5), A→C (2), B→C (1), isolated D fixture. The displayed construction is extracted from TraGraphExample.java. The Java fixture exports the graph built by that exact method; tests compare its vertices, directed edges and weights to the drawing data. TraGraphDataExample is independently runnable and is checked on directed/undirected, empty and duplicate-label inputs, preserving colours and topology. The ZIP now contains four Java sources.

Base and supplement cards, primary/comparison notes, code, expected output and README instructions were updated in RU/FI/EN. Links to Graph, DiGraph, Vertex, Edge and AbstractGraph Javadoc were opened successfully during stage 2, although the frames/index page had timed out in stage 1. The DiGraph introductory example uses an older neighbours() spelling; the actual Vertex signature and supplied binary use neighbors().

## Stage 3 verification

TRA code now drives the displayed basic/colour/edge/practice snippets and the shared recursion questions. Basic DFS keeps the existing graph, stack cards, own i and saved continuation while using the actual neighbour iterator; the colour/edge algorithm uses prepared List cursors. Basic BFS retains A–H, identifies the currently processed vertex separately from the newly enqueued focus and exposes its real queue code. Sorting/preparation cost is explicit in the expanded lesson and source.

Java tests compare full states on every example/start/scope/order/algorithm combination, and observe intermediate real statement execution in temporary instrumented copies: colours, PRE/POST, queue, distances/parents/times and caller i. Native/basic helpers cover 80 generated graphs with duplicate labels and repeats. Real TRA helpers additionally reject invalid starts/orders, cycles, incomplete topological runs and BFS topological requests; earlier result containers survive later colour resets. The published coding-task contract and all old standalone sources remain intact.

## Stage 4 verification

Tree/PQ primary examples and materials use TRA, while old sources remain optional. The original A–G drawing is preserved; PRE/IN/POST now match the real BTree factory. Empty, single and chain presets use edge-height conventions (-1/0/n-1), with node depth/path and explicit null-frame accounting. Generated Java snippets come from the runnable source. TreeNode right siblings are distinguished from BTreeNode right children and external-memory B-trees.

Java checks cover all presets/orders and 40 generated trees, including repeated values and input preservation. Completed teaching-heap operations are compared with real TRA Queue return values, sizes, minima and removal order; no vendor array-layout assumption is made. Duplicate/null/empty/extreme values and capacity/comparator construction are checked. Special adjustable/assignable queues are left for algorithms that actually need them. The archive now contains eight independent sources; Java 11 and RU/FI/EN remain the baseline.

## Stage 5 verification

Graph applications now use primary TRA component/topological examples and the common colour DFS/BFS for paths, roots and cycle witnesses. Their factories match the disconnected, DAG and directed-cycle drawings. The page adds an expandable instance of the existing traversal workspace rather than another visualisation model. Scope, original-start reachability, shortest BFS paths versus DFS paths, directed forests versus SCCs and cycle rejection are explained in RU/FI/EN. Partial component listings and DFS selected for a shortest-path task receive explicit explanations.

The binary's Vertex.getEdge scans incident edges. The new undirected cycle check iterates Edge directly; the common State prepares aligned outgoing Edge lists before traversal, avoiding repeated scans in DFS. Neighbour order, events and classifications are unchanged; Java snippets are regenerated from the runnable source. Sorting preparation remains explicit and separate from the linear core.

Independent application checks cover 240 generated Graph/DiGraph inputs plus boundaries, use closure/distances, Kahn and forest properties rather than one canonical listing, and check every returned path/order/witness against real edges. They also verify disconnected cycles, directed self-loops, parent reversal, isolated vertices, duplicate labels, foreign/unreachable targets, separate forest depth/distance, repeats and unchanged graph structure. The download now has ten independent Java sources, the pinned JAR, three README files and expected output (15 entries). Java 11 remains the baseline; weighted/advanced topics and new coding tasks remain stages 6 and 7.

## Stage 6a verification

The shortest-path page now uses primary standalone TRA Dijkstra and Floyd sources. Old custom Edge/array sources remain closed optional comparisons. Cards and example notes explain the concrete weighted graphs, lazy queue entries, matrix creation from Vertex identities, direction, finite float input/double accumulation, infinity and actual paths in RU/FI/EN. Existing traversal/recursion visualisations remain intact; no weighted animation or graph editor is added in this stage.

Dijkstra rejects negative/non-finite weights globally and uses immutable entries in the real TRA PriorityQueue. Floyd supports negative finite weights, keeps next-hop reconstruction and rejects any computed negative cycle across the whole graph, including disconnected cycles/self-loops. Both leave colours, labels, weights, external Vertex.index fields and topology unchanged. Expected map access and implementation-specific queue/matrix bounds are stated explicitly.

The independent fixture uses Bellman-Ford rather than either lesson algorithm as its reference, plus actual path-edge/direction/weight checks on 340 generated inputs. Explicit boundaries include empty/single/isolated vertices, same labels, zero cycles/tied paths, foreign starts/queries, disconnected negative cycles, undirected negative edges, NaN/infinities, Float.MIN_VALUE/MAX_VALUE sums, represented decimal fractions and repeat runs. The ZIP now has twelve independent Java sources, the unchanged pinned JAR, three README files and expected output (17 entries). Stages 6b/6c and the new coding exercises remain pending.

## Stage 6b verification

The MST page now uses primary TraMinimumSpanningTreeExample. Prim and Kruskal return actual selected Edge references and all covered vertices, component count and weight, with a forest on disconnected Graph input. Prim restarts per component using a lazy TRA Edge queue; Kruskal sorts global physical edges and uses private union-find arrays. Both preserve input fields. Six cards and the example notes in RU/FI/EN explain V-C edges, isolated/empty/single inputs, finite negative/equal weights, the real connected/disconnected fixtures, numerical/complexity assumptions and an MST-versus-shortest-path counterexample. The old connected-only JDK source is kept in a closed comparison.

Java checks verify the actual physical Edge set, coverage, acyclicity, component count, weight, source preservation and repeat ownership. Minimum optimality is checked independently by enumerating small spanning subsets and by the cycle-exchange property on larger graphs. Tests cover all 76 labelled topologies up to four vertices plus 320 generated graphs, reversed edge storage, duplicate labels, negative/zero/tied weights, non-finite input, float extremes and immutable result lists. A Dijkstra comparison establishes the distinct shortest-path objective. The archive now contains thirteen independent Java sources, unchanged JAR, three instructions and expected output (18 entries). Stage 6c and later coding-task/audit stages remain pending.

## Stage 6c verification

Graph analysis now leads with TraGraphCutsExample, TraBipartiteMatchingExample and TraMaxFlowExample. The old five standalone graph-analysis sources are optional closed comparisons; shared TRA traversal/topological examples remain available. Eight cards and three translated source descriptions explain entry-only tin/low, root/physical-parent exceptions, explicit bipartition validation, maximum versus maximal matching, exact integer flow capacities, cancellation versus opposite input edges, and min-cut witnesses. Auxiliary residual lists refer to actual Vertex/Edge objects and do not mutate DiGraph. The handout alignment document remains English.

Independent checks cover 160 generated undirected cuts graphs, 160 bipartite graphs and 160 directed capacity graphs with two terminal directions, plus boundaries. References use vertex/edge deletion, exhaustive matching and exhaustive cuts. Capacity bounds, flow conservation, actual output object identity, zero/self/antiparallel arcs, cancellation without a reverse input edge, large long totals, invalid partitions/weights/terminals, immutable lists and repeat/input preservation are checked. All sixteen source files target Java 11; the ZIP contains them, three instructions, the original pinned JAR and expected output (21 entries). This completes the algorithm migration in stage 6; new exercises and the final migration audit remain stages 7–8.


## Teaching clarity follow-up

Method contracts now live beside the algorithm in Java and as translated prerequisites in the card. Comments explain base cases, early discovery and caller continuation. The DFS-cycle and BFS-diamond examples print the skipped repeat and have narrated state changes; a full-DFS trace explains isolated components. Input and output share a compact row; installation/setup is expandable.

A second coding kit, `exercises/bfs-distances`, asks for shortest outgoing hop distances from one non-null Vertex. It uses external state and preserves all input fields including arbitrary colours. `scripts/package-graph-exercise.mjs` packages the graph exercises using the same pinned JAR reader, without a second maintained binary. Separate tests check the actual archive, Java 11 execution, correct BFS, incorrect DFS depths, duplicate-label mistakes, mutation, null/foreign keys and compilation failure followed by correction. Both starters include optional reasoning comments. This follows the documented-method, separate-template/checker and self-evaluation pattern in the UEF examples; it does not copy their solutions or submission process.


## Stage 7.1: shortest-path practice

`exercises/bfs-path` adds a second BFS task after distances. `GraphCodingExercise` selects a small task configuration by task key; BFS path content is initially collapsed. Existing graph visuals and the first two exercise contracts remain unchanged. Its shared diamond drawing highlights target 3, and translated text identifies the start/target independently of colour. The method signature and both valid example routes are shown before the optional template and hints. A separate walkthrough explains parent links, reversal, vertex/edge counts and the extra cost of producing the path.

The contract returns actual input Vertex objects from start to target. Empty means unreachable; equal endpoints return a one-vertex list. Colours are arbitrary and all graph fields must stay unchanged. A non-null pair belonging to the same directed graph is a precondition, so no unrelated argument-validation framework is needed in the student solution. The checker validates directed edges and shortest length against independent all-pairs relaxation, not a canonical sequence. The new package function uses the shared pinned JAR reader; no additional maintained binary or runtime dependency is added. Components and BTree practice remain later stage-7 work.
