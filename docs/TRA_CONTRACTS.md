# TRA library contracts for the lessons

Verified on 19 November 2026 against the supplied binary, its bundled Javadoc and its public signatures. These are the starting rules for [the graph/tree migration](TRA_MIGRATION.md). Algorithm rules below are project conventions, not extra methods supplied by the library.

## Short teaching examples (23 November 2026)

The student catalogue now contains 52 independent lessons under `src/tra-examples/lessons`, grouped by a single operation or algorithm step. The original sixteen root-level Java files are technical references only. Algorithm contracts in the historical stage notes below apply to those references; do not copy their stronger input checks, preserved-colour guarantees or optimised bounds onto the shorter versions.

Each lesson has an explicit input condition and a main method that creates it. Basic DFS owns a visited map. Colour DFS/BFS, full DFS, cycle detection, topological sorting and Prim may change colours; main initialises them where needed. The tin/low teaching files own resettable clocks/maps. Other auxiliary data uses actual Vertex identity, not labels. Matrix inputs use an explicitly ordered list of all vertices once.

The initial Dijkstra scans vertices and globally rejects non-finite/negative weights: expected O(V² + E) time and O(V) space. Path reconstruction is a separate file. Floyd's matrix and update loop are separate lessons; the optional next-hop file rejects negative cycles before returning paths. Prim expects finite fixed weights and uses TRA PriorityQueue. Kruskal uses the preceding simple DSU without rank/compression, with expected O(V + E log(E + 1) + E·V) time; both produce forests on disconnected input. Matching assumes a valid known bipartition rather than validating arbitrary input.

Flow begins with three explicitly partial examples (remaining capacity, one known augmenting path and cancellation). Only TraMaximumFlow and TraMinimumCut contain the whole solver. They convert a DiGraph to a long residual matrix via an identity index map, validating stored Edge float capacities as finite integers in [0, 1_000_000_000]. Input topology/fields stay intact. The matrix aggregates opposite capacity and cancellation; no per-input-edge flow contract is claimed. Source/sink must be distinct valid indices. Matrix BFS uses TRA LinkedQueue<Integer> over auxiliary indices; O(V² + E + V³·E) time and O(V²) space account for its scans. The cut uses original capacities across the final residual reachable boundary.

Student code has no Result/State framework or shared example dependency. Launch commands and complete files are tested from the packaged topic folders. See the three source README files for the learning order and each implementation's prerequisites. Numerical and preservation checks for the older per-Edge solver remain in separate reference tests.


Teaching algorithm methods have short Java contracts for initial state, results and mutation. These are also exposed as RU/FI/EN prerequisites without bloating the highlighted algorithm region. The new cycle/diamond demonstrations log the repeated neighbour explicitly.

The BFS-distance exercise has a separate contract from the colour-based DFS task: start is non-null and belongs to a directed unweighted graph; return a fresh Map<Vertex,Integer> containing exactly reachable vertices, start at 0 and shortest hop distances. Unreachable vertices must be absent. Preserve vertex colours/indices/weights/labels and all original edges/fields; initial colours are arbitrary. Known method signatures and the existing DFS contract remain stable. Local tests check results and preservation, not whether BFS is present syntactically or its asymptotic bound. Each attempt compiles fresh for release 11 and runs isolated worker groups.

## Library and Java version

The single source JAR remains [`exercises/dfs-reachable/traj.jar`](../exercises/dfs-reachable/traj.jar), so the existing exercise folder also remains directly runnable. Do not add a second maintained source copy under `src`, `lib` or another exercise. Download ZIPs contain generated copies of this same binary.

[`scripts/tra-library.mjs`](../scripts/tra-library.mjs) owns its path, package choice, Java release and checksum:

```text
package: fi.uef.cs.tra
Java examples/checkers: JDK 11+
SHA-256: 589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423
```

The JAR also includes the older `fi.joensuu.cs.tra` package. Do not mix packages. Its binary classes target Java 8; our examples/checkers target Java 11. The short teaching sources, sixteen technical references and both ZIP builders use this pinned library. Both ZIP builders call the shared reader and reject a different checksum before writing an archive; verification requires Node, not a JDK. A deliberate library upgrade must update the pin, recheck contracts, rerun Java checks and regenerate **both** packages.

```bash
npm run check:tra-library
npm run package:java-downloads
```

The course reference is [TRA Javadoc](https://cs.uef.fi/pages/sjuva/trajavadoc2017/index.html). That URL timed out during this audit. The pinned JAR includes Javadoc under `javadoc/fi/uef/cs/tra/`; those files and `javap -classpath exercises/dfs-reachable/traj.jar ...` were inspected instead. A signature present in a newer/older website must not be assumed to exist in this binary.

## Verified API and common traps

| Need | API in this JAR | Rule for the material |
| --- | --- | --- |
| Directed / undirected graph | `new DiGraph()`, `new Graph()`, both extend `AbstractGraph` | Use `AbstractGraph` for traversal methods supporting both. Topological ordering needs a directed input; ordinary components need an undirected input. |
| Create and enumerate vertices | `addVertex(String)`, `vertexCount()`, `vertices()` | Store returned Vertex references. A label is display data, not a unique map key. |
| Neighbours | `v.neighbors()`, `v.neighborIterator()` | Returns `Iterable<Vertex>` / `Iterator<Vertex>`; no `neighbors[i]`, no promised numeric or alphabetical order. In DiGraph these are outgoing neighbours. |
| Edges | `u.addEdge(v)`, `u.edges()`, `graph.edges()`, `u.getEdge(v)` | One Graph insertion supplies both adjacency directions. The two adjacency entries refer to one physical Edge; global Graph edges enumerate it once. DiGraph does not add a reverse arc. |
| Edge lookup cost | `u.getEdge(v)` scans `u.edges()` in this binary | Do not call it for every neighbour while claiming a linear traversal. Iterate Edge directly for undirected cycle detection; the ordered visualisation stores aligned outgoing Edge references during preparation. |
| Other endpoint | `edge.getEndPoint(v)` | Returns the other endpoint, even when `v` is the target of a directed edge; this method alone does not enforce direction. Enumerate outgoing `v.edges()`/`neighbors()` when following directed edges. |
| Directed endpoints | `edge.getStartPoint()`, `edge.getEndPoint()`, `edge.goesOut(v)` | Show real arrow direction. A recursive return transfers control; it is not a new reverse edge. |
| Colour | `v.getColor()`, `v.setColor(int)`, `AbstractGraph.WHITE/GREY/BLACK` | Initialise explicitly per algorithm contract. `GRAY` is an alias for `GREY`; use one spelling, GREY, in lessons. |
| Edge weight | `edge.getWeight()` / `setWeight(float)`; `u.addEdge(v, float)` | Weight type is float. **`u.addEdge(v, 5)` selects colour**, while `u.addEdge(v, 5.0f)` selects weight. The library permits negative weights; an algorithm must validate its own restrictions. |
| FIFO | `LinkedQueue<E>.offer/peek/poll/remove/isEmpty` | Enqueue at the end, remove from the front. On empty, peek/poll return null; remove throws rather than returning null. |
| Priority queue | `fi.uef.cs.tra.PriorityQueue<E>` extends `java.util.PriorityQueue<E>` | Explicit import avoids confusion. Inherits offer/peek; duplicates are allowed, peek preserves size, poll removes a minimum, empty peek/poll return null. Iterator order is not sorted. A comparator uses `new PriorityQueue<>(initialCapacity, comparator)`; this TRA class has no comparator-only constructor. |
| Mutable priorities | `AdjustablePriorityQueue<E>.offer(E)` returns `BTreeNode<E>`; `improvePriority(handle)`, `decreasePriority(handle)` | This is a different API with handles, not a decrease-key method on ordinary PriorityQueue. Do not introduce it in the basic heap lesson. Recheck semantics with the selected algorithm before use. |
| Explicit priorities | `AssignablePriorityQueue<E>.add(float, E)` / `add(E, float)`, `peek()`, `poll()` | Another distinct type; assigning an initial priority is not proof of an in-place update operation. |
| Binary tree | `BTree<E>.getRoot()/setRoot(...)`, `BTreeNode<E>.getElement()/getLeftChild()/getRightChild()/getParent()` | Empty root and missing children are null. Set children with `setLeftChild`/`setRightChild`. A binary tree is not automatically a BST or a heap. |
| General tree | `Tree<E>`, `TreeNode<E>.getLeftChild()/getRightSibling()` | Left means first child; right means next sibling. Never translate right sibling as right child. IN is a binary-tree traversal rule, not a universal general-tree order. |

Do not mutate graph structure while iterating its vertices/edges/neighbours. A lesson about removal should finish enumeration first and use explicitly supported removal operations. No parallel edges are required by the teaching fixtures; their insertion/replacement semantics are outside the current contract.

## Identity, input and state ownership

- Use `Vertex` identity for visited sets, parents, distances and timestamps. Prefer `IdentityHashMap<Vertex, ...>` and identity-based sets to make that intention explicit. Duplicate labels remain distinct vertices. Do not derive uniqueness or priority from `Vertex.compareTo`, labels or default index fields.
- For numbered teaching graphs, keep an explicit construction-order `Vertex[]` and an external identity map from vertex to stable integer ID. IDs support the diagram and ordering; they do not replace Vertex objects in the Java algorithm. Do not overwrite `Vertex.index` as an undocumented side effect.
- Current traversal entry points accept a member start vertex. Empty graph + null start returns an empty result; null start in a nonempty graph or a foreign start is rejected. A directly called recursive helper instead requires a nonnull vertex and prepared state; state that precondition.
- The complete wrapper resets colours/visited state once and allocates fresh result containers. A recursive child does not reset global state. Repeated runs can change vertex colours, but must not rewrite previously returned PRE/POST/parent/distance results.
- The published `reachableCount(Vertex start)` exercise has its own contract: the checker prepares WHITE input, and accepts GREY or BLACK for visited vertices. Do not silently strengthen it to require every internal colour event. New colour-tracing tasks may define a stricter contract explicitly.
- Graph storage is input. The algorithm may change colours or other fields only when its public contract allows it; labels, edges and weights must remain intact in traversal tasks.

## Neighbour order and the trace

Two different modes must be labelled honestly:

1. **Native neighbours:** direct `for (Vertex next : vertex.neighbors())`. The graph/Map examples and native/basic traversal helpers use this mode. The extended TraTraversalExample uses explicit teaching order. Display their output as verified for the supplied JAR, not as a promise that labels sort themselves.
2. **Explicit teaching order:** the lesson assigns stable IDs when constructing its vertices, copies each outgoing neighbour iterable into a list and sorts by those IDs (ascending or descending). Build these ordered lists once before traversal and show the ordering helper/preparation. Use that same ID order in the Java reference and JavaScript fixture. The selected start is processed first; the existing full-forest outer loop then uses ascending IDs, independently of neighbour reversal.

Do not sort by label: repeated labels are valid. Do not claim order independence for PRE/POST, parents, DFS forest or edge classes. BFS distances by number of edges remain the same; multiple shortest parent paths can differ. A task accepts any valid path unless the neighbour order is explicitly part of its contract.

The saved iterator/list cursor belongs to the current DFS frame. After a child returns, continue that iterator; do not restart `dfs(parent)`. A displayed neighbour number can help trace the loop, but it is not a field/method supplied by TRA.

Native full traversal takes Θ(V + E) with adjacency enumeration. Preparing ordered lists adds O(V + E) space and O(V + E + Σ deg(v) log(deg(v) + 1)) time in this explicit implementation; do not silently include sorting in a claimed linear total. Traversal after preparation remains Θ(V + E). For undirected graphs adjacency entries count both directions. Reachable-only wrappers with whole-graph initialisation take Θ(V + R + A_R), where R is reachable vertices and A_R is their examined adjacency entries.

## DFS/BFS and applications

- DFS: GREY → PRE → examine outgoing neighbours → POST → BLACK → return. Record discovery/finish times using one event counter, separately from list positions.
- A WHITE target creates a tree edge. In directed DFS a GREY target is a back edge (including a self-loop). For BLACK targets use ancestry/timestamps to distinguish forward and cross edges. In Graph, both adjacency views of the same physical Edge keep one classification; the reverse parent-tree entry is not cycle evidence.
- BFS: GREY before enqueue; an extracted vertex remains GREY while examining neighbours; BLACK after examination. Discovery, removal and completion are separate events, not recursive POST.
- Full BFS forests keep distance from the original start separate from depth under a later root. Unreachable distance is -1 in the Java API and may be rendered as ∞; unreachable path is empty. A directed forest is not an SCC decomposition.
- Topological order requires a directed acyclic graph, a complete traversal and reverse POST; reject a cycle rather than outputting an order. Components refer to Graph unless another definition is explicitly introduced.
- Retain the existing simple-input restriction: no parallel edges; Graph disallows loops in this binary, while DiGraph permits loops. The generic concept of an undirected graph may allow loops, but that is not what this implementation accepts.

## Weighted algorithms and matrices

Use explicit finite weights; reject NaN/infinity at the algorithm boundary. Weighted teaching fixtures should initially use small exactly representable values. Dijkstra rejects negative edge weights. MST may use negative weights. Floyd may use negative edges and must explain/report reachable negative cycles.

Do not port existing integer overflow checks or `long` sentinels unchanged to float Edge weights. Choose and document a distance/accumulation type, comparisons, infinity and test tolerance at stage 6. A vertex's weight field is not an edge weight and is not automatically the shortest-path distance.

Floyd distance matrices, bipartite partitions, DSU and residual capacities can remain algorithm-owned structures. Build their index mapping from actual TRA vertices and explain how entries correspond to edges. No replacement custom graph class should be the main input. Maximum flow needs explicit nonnegative capacity rules and residual reverse arcs; a reverse residual arc is not necessarily an input DiGraph edge.

## Tree and memory conventions

For the planned size/height tasks, count **height in edges**: empty tree -1, leaf 0. Recursion stack along a nonempty root-to-leaf path has h + 1 frames for actual nodes (possibly one extra null-base frame). Traversal costs Θ(n) time and O(h + 1) stack, or O(n) in the worst case. PRE/IN/POST result lists add O(n) output storage. Keep the number of levels separate from edge depth; update existing ambiguous text such as “a chain has h = n” in stage 4.

The educational heap's internal tree/array is an explanation of heap mechanics. Do not assert its precise array layout equals a specific TRA PriorityQueue instance. Mutating a queued object's priority does not automatically repair an ordinary queue.

The external-memory B-tree and recursion-call trees are different concepts from the binary TRA `BTree`. They do not need to be rewritten using it.

## Running and verifying

From a downloaded example folder, with the source next to `traj.jar`:

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar TraGraphExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraDfsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraBfsExample.java
```

These single-source commands work on JDK 11+ on Windows/macOS/Linux. They do not depend on the other example sources. For the current coding task, from its own extracted folder:

```bash
java -Dfile.encoding=UTF-8 Check.java en
```

Use `ru` or `fi` for checker messages. The checker sets the library classpath when compiling/running the solution. For a precompiled multi-file program, include **both** the output directory and the JAR in `-cp`, separated by `:` on macOS/Linux or `;` on Windows; do not copy that separator into the single-JAR command unnecessarily.

`tests/traLibrary.test.js` verifies the shared pin and runs `tests/fixtures/TraLibraryChecks.java` with `--release 11`. It executes the graph direction/identity/physical-edge, endpoint, loop, colour, weight-overload, binary/general tree and FIFO/PQ contracts. Full algorithms and downloads remain covered by their own tests. Successful finite examples do not prove recursion usage or time/space complexity; those require source analysis.

### Stage 3 implementation notes

Basic DFS implements visited as `IdentityHashMap<Vertex, Boolean>` initialised for all V vertices. Its map operations have expected O(1) cost in the model; it leaves vertex colours unchanged. Each frame owns `neighborIterator()` and a real for-loop i counter, counting completed neighbours. The iterator advances when selecting next, before entering a child; i increases only after the child returns.

Extended DFS/BFS keep per-vertex identity maps and sorted outgoing lists in State. The classifies/parent exception uses physical Edge identity. i is an ordinary list index into those prepared lists. State's captured final colours survive later runs. The model's 7V metric counts colour/parent/root/depth/distance/tin/tout fields only, not all JVM allocations or prepared lists. Full wrapper cost includes sorting and final colour capture; only the traversal core is linear.

### Stage 4 implementation notes

TraTreeExample supplies the actual A–G BTree factory, one combined PRE/IN/POST method, size and edge-height helpers, four presets and a first-child/sibling Tree example. The animation selects append events from that method; it does not claim to show every Java instruction. Displayed node frames are the current root-to-node path. Calls on null children are short actual Java frames, giving peak h+2 for a nonempty tree with this implementation; stack remains O(h+1), empty O(1).

TraPriorityQueueExample imports the verified TRA class and uses its capacity-plus-comparator constructor. Its copying removal preview costs O(n log n)/O(n); queue operations are counted separately. Heap repair is logarithmic; including occasional array growth, offer is amortised O(log n). Iterator order/layout is not promised. Tests compare logical values and results with the educational renderer.

### Stage 5 implementation notes (20 November 2026)

`TraComponentsExample.components(Graph)` returns fresh lists forming the complete undirected partition. `hasCycle(Graph)` skips the identical parent Edge, finishes all roots and returns a boolean; both reset colours and finish every vertex BLACK. `TraTopologicalExample.sort(DiGraph)` resets colours, scans every root and throws on a GREY neighbour, including a self-loop. Only a successful full DFS exposes reverse POST. Failure may leave interrupted colours, but never returns a partial order; a later call resets state. The input graph structure, labels and weights are preserved.

Bytecode inspection confirmed `Vertex.getEdge(next)` performs a linear scan of incident edges in this binary. The new undirected cycle DFS iterates Edge directly. The common ordered State now stores outgoing Edge lists aligned with its neighbour lists; saved i selects both in O(1) list access. Preparing/sorting these lists has the previously stated O(V + E + Σ d(v) log(d(v) + 1)) bound and O(V + E) space; no repeated edge search is hidden inside a linear traversal claim.

`TraApplicationsChecks.java` uses independent closure/Kahn/forest properties on 240 generated inputs plus explicit boundaries. It validates paths in their real edge directions, shortest BFS lengths, original-start reachability across full forests, exact component partitions and every topological constraint; multiple valid listings are accepted. Factory output is compared to the disconnected/DAG/cyclic diagrams. Colours are intentionally mutable; structural preservation, duplicate-label identity and repeat-run ownership are checked separately.

### Stage 6a implementation notes (20 November 2026)

The main weighted API is AbstractGraph/Vertex/Edge. Both new examples iterate outgoing Edge directly, use external identity maps, preserve all input fields and allocate independent results on each run. Neither uses Vertex.index or Vertex.weight as algorithm scratch storage. Duplicate labels remain separate vertices. Foreign/null query vertices are errors. Dijkstra accepts null start only for an empty graph. Unreachable distance is positive infinity; unreachable path is empty, self path contains its one endpoint with zero edges.

Dijkstra validates every input weight for finiteness/non-negativity, even outside the reachable part. TRA PriorityQueue uses its verified (capacity, comparator) overload, holding immutable (Vertex, double distance) entries. Improvements enqueue fresh entries, stale entries are ignored, and no decrease-key API is invented. With expected O(1) identity maps, time O(V + E log(E + 1)), additional space O(V + E), path query O(path length).

Floyd derives distance/next-hop matrices from the real graph; matrices are algorithm-owned working data. Negative finite weights are allowed. A computed negative diagonal rejects the whole result, including a cycle in a disconnected part, before any partial matrix/path is returned. This deliberately conservative API does not mark only affected pairs as negative infinity. A negative undirected Edge permits an unbounded closed walk in the two adjacency directions. Time O(V³ + E), additional space O(V²), path query O(path length).

Numeric policy: finite float Edge weights accumulate in double, +infinity represents unreachable output, and Floyd never sums infinite subpaths. NaN and either infinity are rejected as inputs. Comparisons are strict; arbitrary decimal sums and near-cancelling negative-cycle decisions remain floating-point computations rather than exact proofs. Teaching fixtures and generated property cases use small exactly representable values; extreme/subnormal and represented 0.1f/0.2f cases are checked separately. Reference comparisons use scale/ULP-aware tolerances. These explicit choices replace the standalone examples' long sentinels, not their literal integer overflow assumptions.

### Stage 6b implementation notes (20 November 2026)

`TraMinimumSpanningTreeExample.prim(Graph)` and `.kruskal(Graph)` accept only an undirected Graph with finite float weights; negatives, zero and equal weights are valid. The minimum spanning forest covers every input component with V-C actual Edge references. Results expose vertices, chosen edges, component count, double weight and isSpanningTree; empty input has C=0/weight 0/tree false, while one vertex has C=1/no edges/tree true. Read-only lists are fresh result containers holding live input objects. Later algorithm runs do not rewrite previous results. All graph fields and topology remain intact.

Prim's TRA PriorityQueue uses the verified capacity-plus-comparator overload. It queues crossing Edge objects, never synthetic reverse/dummy edges, skips entries with both endpoints reached, and starts a fresh tree after the previous queue drains. Endpoint orientation is storage detail in Graph; edge weights must stay fixed during a run. Each physical edge is enqueued at most once. Kruskal sorts a copy of global Graph.edges(), which enumerates each physical edge once, and maintains rank/compression in private arrays indexed through Vertex identity. No mutable-priority special queue is needed.

With expected O(1) identity-map/set access, each implementation takes O(V + E log(E + 1)) time and O(V + E) additional space, including queue/sorted copy, results and sets. Float comparison preserves the supplied weight order; double aggregation has ordinary rounding. NaN and either infinity are rejected across the whole input, including disconnected parts. The MST objective counts each chosen edge once and does not inherit shortest-walk restrictions on negative undirected edges.

Independent verification uses full spanning-subset enumeration for small cases and the cycle-exchange property (no input edge lighter than the maximum along its chosen tree path), plus BFS coverage and explicit V-C/acyclicity/identity checks. Equal optimal forests are accepted. All 76 labelled topologies up to four vertices, 320 generated inputs and numerical/preservation boundaries run with real TRA on Java 11. The original connected-only JDK example remains an optional comparison; its rejection of disconnected input is not the new TRA contract.

### Stage 6c implementation notes (20 November 2026)

Cuts and cardinality matching accept Graph, ignore edge weights and preserve every input field. Cuts traverse all components with identity-keyed entry-only tin/low, physical parent-edge exclusion and the separate root-child rule. Results contain actual articulation Vertex/bridge Edge references and captured entry/low queries. Expected O(V + E) time/O(V) space excludes console label sorting. Matching accepts an explicit duplicate-free member left list; right is the complement, and every Edge must cross the supplied partition. Alternating reassignment with a fresh seen-right set per root finds maximum cardinality, not merely a maximal matching. Expected O(V + E + L E) time/O(V) space; unmatched partner is null and foreign queries fail. Empty inputs are valid for these two algorithms.

Flow accepts DiGraph and distinct member source/sink, so an empty graph cannot supply valid terminals. This implementation restricts stored float Edge capacities to finite integral values [0, 1_000_000_000], rejecting negative/fractional/non-finite/oversized values globally without rounding. TRA itself permits other weights. Validation concerns the value already stored as float, not an ideal decimal literal. Long capacities/residuals/flows and checked additions make the subsequent arithmetic exact. Each original physical Edge owns a forward/cancellation residual pair; actual opposite input arcs have separate pairs. Private residual entries are algorithm-owned auxiliary state, not additional DiGraph edges. Self-loops and zero capacities are harmless. No input field or structure changes.

LinkedQueue BFS discovers before enqueueing and uses a fresh identity parent map without repeatedly clearing all isolated V vertices. Expected O(V + E + V E²) time and O(V + E) space assume expected O(1) identity access. Result exposes actual input objects in read-only lists, captured per-Edge capacities/flows, value, source-side cut and capacity, plus a reverse-step counter. A foreign Edge query fails. The last unsuccessful BFS supplies residual reachability for the cut witness. Capacity/conservation and value=cut capacity are independently checked, including antiparallel arcs, rerouting absent input reverse arcs and values above int range.

All three allocate independent results on repeat runs. Tests use deletion and exhaustive matching/min-cut references on 160 generated graphs for each algorithm, plus invalid input, identity, empty/isolated/disconnected, root, zero/loop/reverse and preservation boundaries. Old array/matrix sources remain explicitly optional comparisons with their own contracts. SCC decomposition and new programming exercises are not added in this stage.
