# DSA2 Visual Lab

An interactive React/Vite study site for Data Structures and Algorithms II. Explore graphs, DFS/BFS, PRE/POST events, trees, sorting, and algorithm complexity through visual explanations and runnable Java examples.

## Languages

The interface, lessons, and algorithm explanations are available in Finnish, Russian, and English. Use the language switcher at the top of the page on desktop or mobile. Your choice is saved in the browser; English is the default on the first visit. Switching languages preserves the current topic and visualisation step.

Core translations are in `src/i18n/fi.js`, `src/i18n/ru.js`, and `src/i18n/en.js`. Topic IDs and algorithm logic are shared across languages.

For code navigation, trace state, Java snippet synchronisation and development checks, see the [code guide](docs/CODE_GUIDE.md). Run `npm run format` to apply the shared style, `npm run format:check` to verify it and `npm run lint` to check JavaScript. The Pages workflow runs the format and lint checks before building.

## Course handout and Java examples

The material is aligned with the supplied `dsaII_handout.pdf` (University of Eastern Finland, autumn 2025, 89 pages). The [coverage map and implementation notes](docs/HANDOUT_ALIGNMENT.md) document the corresponding sections and identify topics covered at an introductory level. That companion document is currently in Russian.

The site contains 22 topics and 31 standalone Java examples covering Set/Map, `equals`/`hashCode`, lists and queues, traversals, merge sort, Dijkstra/Floyd–Warshall, Prim/Kruskal, articulation points, matching, maximum flow, dynamic programming, strings, and files. Each example includes source code, expected output, complexity, assumptions, and a `.java` download.

Run a downloaded example with JDK 11 or newer:

```bash
java SetOperationsExample.java
```

Java sources are in `src/examples`, their catalogue is in `src/data/javaExamples.js`, and handout references are in `src/data/handout.js`. Additional lesson translations are in `src/i18n/handout.fi.js`, `src/i18n/handout.ru.js`, and `src/i18n/handout.en.js`. The handout PDF is not bundled with the site.

Sixteen **TRA examples** are in [`src/tra-examples`](src/tra-examples/README.md): graph construction and identity-keyed Map data, basic recursive DFS with an owned iterator, a short native-order colour DFS, basic A–H BFS, extended colour/edge DFS/BFS, BTree/Tree traversal, TRA PriorityQueue, undirected components/cycles, directed topological sorting, Dijkstra, Floyd–Warshall, Prim/Kruskal spanning forests, articulation points/bridges, bipartite matching and maximum flow. TRA is primary on these migrated topics; the original 31 standalone sources remain as optional comparisons where replaced. The algorithm migration through stage 6 is complete; new coding exercises and the final audit remain stages 7–8.

The downloadable `tra-graphs.zip` contains all sixteen sources, the supplied `traj.jar`, expected output and RU/FI/EN instructions. Extract the archive and run, for example, `java -Dfile.encoding=UTF-8 -cp traj.jar TraGraphExample.java` with JDK 11+.

The graph/tree migration is tracked in the [scope and file map](docs/TRA_MIGRATION.md) and [verified TRA contracts](docs/TRA_CONTRACTS.md). Stages 1–6 cover the pinned API, Graph basics/Map, source-derived DFS/BFS, trees/PQ, traversal applications, weighted shortest paths, spanning forests and graph analysis. Both download builders verify the same pinned JAR (`npm run check:tra-library`).

## Features

- A DSA2 topic roadmap.
- An interactive Big O table with adjustable input size `n`.
- A recurrence-tree lab in the Recursion topic compares `T(n−1)+1`, `2T(n/2)+1`, `2T(n−1)+1`, and `2T(n/2)+n`, with `T(1)=1`. Left-hand annotations explain depth and level count; the horizontal annotation shows calls per level and maximum width. Reveal levels manually or every 850 ms, compare local and level work, and derive the full sum and time bound. All nodes remain individually drawn, including the 255-call example, with stable positions, internal scrolling, dragging, and manual 25–150% zoom. Java fragments count abstract work units; they do not measure machine instructions. Inputs are 1, 2, 4, and 8. The three languages preserve the selected example, input, level, scale, and view; mobile places the work table below the diagram.
- A five-question time complexity quiz with Java examples, multiple-choice answers, explanations, a final score, and retries in all three languages.
- Two-pointer union of sorted lists.
- Set/Map operations and the `equals`/`hashCode` contract.
- Expandable recursion explanations cover stack frames, independent local variables, continuation after a return, termination, and `void` methods. Eight narrated factorial checkpoints open the matching visualisation states; a Fibonacci example separates sequential execution, total calls, and maximum stack depth. All lesson text is available in the three interface languages.
- Each recursion step identifies its call and local variables, saved continuation, and next action. Java and waiting stack frames mark the return location. Optional predictions cover nested calls, values, stack size, and resume lines, with explanations, explicit skipping, and one checked answer per step when rewinding. Mobile separates the event and step analysis into tabs.
- A recursion lesson with factorial and Fibonacci call trees, active call stacks, local variables, highlighted Java code, and visible returns to waiting callers. Desktop places code and stack beside the tree; smaller screens use Tree/Code/Stack tabs. Bottom playback controls, tree zoom, fit-to-view, optional call following, next-step predictions, and the review quiz support exploration. Side-by-side Fibonacci executions compare naive recursion with memoisation, including call counts and a live cache; mobile switches between the two executions using tabs.
- A 15-question recursion review in the recursion topic covers base cases, local state, stack order, return continuations, the next neighbour, `visited`, PRE/POST, disconnected graphs, and time and space complexity. Each checked answer has an explanation; incorrect choices receive specific feedback. Previous/next navigation preserves checked answers and pending choices without adding points twice. Language changes preserve the question, answers, score and visualisation step. Results include answer review and a fresh retry. The original five-question Big O quiz remains available in the complexity topic.
- An expandable time and space analysis below the recursion workspace covers factorial, naive and memoised Fibonacci, and recursive DFS. Live counters distinguish total calls, current and peak stack frames, cache capacity and filled entries, adjacency reads, and shared structures. Recurrences and a comparison table explain the bounds; a separate `n = 0…20` growth table preserves the visualisation step. Basic DFS analysis includes initialising a visited-map entry for every Vertex even in reachable-only mode, assuming expected constant-time identity-map operations. Counts describe the shown Java algorithms, separately from timing and visualisation history, in all three languages.
- Visual preorder, inorder, and postorder tree traversals.
- Interactive min-heap and PriorityQueue visualisations: synchronised tree/array views, offer/peek/poll, sift-up/down animations, removal order, return values, and manual or automatic playback. Peek is immediate; starting another operation completes the current one, and Undo restores the pre-operation heap.
- Step-by-step and automatic visualisations of bubble, insertion, merge, and quick sort, including merge buffers and pivot highlighting.
- Graph adjacency lists.
- Three separate learning views keep the original traversal illustration as the default. **Step-by-step traversal** restores recursive DFS with coloured call cards, local variables, saved loop continuations, PRE/POST, code expansion and the graph/call-tree switch; basic BFS restores the A–H graph, queue and distances. **Vertex colours** focuses on WHITE → GREY → BLACK without edge classes or timestamps; BFS vertices remain GREY after removal until all neighbours are examined. **DFS edge types** uses directed examples with tree/back/forward/cross annotations and tin/tout. Each algorithm/view retains its own settings and position, including across language changes; leaving a view pauses its animation. Mobile graph/code/stack tabs and bottom controls remain available.
- A collapsed **Practice: applications and DFS/BFS comparison** block below the main workspace retains the advanced shared-graph lab, five examples, common start/scope/neighbour order and separately saved DFS/BFS positions. Opening practice does not replace the basic illustration.
- Guided graph moments, optional tree/back/forward/cross labels, the undirected parent-edge exception, a full-results comparison, target/path highlighting and five application scenarios cover reachability, shortest unweighted paths, undirected components, cycle witnesses and topological order. Other BFS forest roots retain infinite distance from the original start. Directed traversal trees are not presented as SCCs. The native-order basic core uses O(V) space. `TraTraversalExample.java` supplies the extended methods: its explicit sorted-neighbour preparation takes O(V + E + Σ d(v) log(d(v) + 1)) time and O(V + E) space; the full traversal core afterwards is Θ(V + E). Edge classes are keyed by physical TRA Edge objects. `TraRecursiveDfsExample.java` supplies the basic iterator/visited-map lesson; `TraBfsExample.java` builds the actual A–H fixture. Both final results and intermediate colours, queue states and saved caller positions are checked against Java 11 execution.
- A separate 12-question graph quiz uses fixed visual states, explanations for each wrong choice and post-check edge classification. Previous questions, pending choices, checked answers and results survive language changes. The original 15-question recursion review remains in the recursion topic.
- The DFS topic includes a downloadable Java coding task: implement one recursive method that counts distinct reachable vertices using the course's `traj.jar`. The ZIP contains a starter, a portable JDK 11+ checker and RU/FI/EN instructions. Checks run locally with `java -Dfile.encoding=UTF-8 Check.java en` (or `ru` / `fi`), explain failed cases and can be rerun freely after edits. The website shows the task and graph; it does not execute submitted Java. Existing visualisations and quizzes are preserved.
- Connected components, cycles, shortest paths, and topological ordering.
- Java tools: Iterator, Comparable, Comparator, and generics.

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal.

The `predev` and `prebuild` steps run `package:java-downloads` to prepare `public/exercises/dfs-reachable.zip` from [`exercises/dfs-reachable`](exercises/dfs-reachable/README.md) and `public/examples/tra-graphs.zip` from [`src/tra-examples`](src/tra-examples/README.md). Both include the supplied JAR unchanged. Node generates the archives without extra build dependencies. Regenerate both with `npm run package:java-downloads`, or one with `npm run package:graph-exercise` / `npm run package:tra-examples`.

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Tests

Run translation, quiz state, recursion and complexity, graph traversal, sorting visualisation, and Java example checks:

```bash
npm test
```

The Java checks require JDK 11 or newer and are explicitly skipped when a JDK is unavailable. They compile every example with `--release 11`, verify Java 11 class-file versions and compare actual output with the output displayed on the site. Additional algorithm checks cover boundary cases and comparisons with reference results.

The graph coding task tests also extract the actual download, compile and run student-code fixtures with the supplied JAR, verify all three feedback languages and exercise incorrect counts, colours, duplicate labels, graph changes, stack overflow, compilation errors, time limits and correction followed by a successful retry. These are local checks, separate from the Pages deployment.

The TRA example checks extract their own ZIP, compile for Java 11, execute each file in source mode and compare output with the site. An independent reference checks DFS/BFS on 80 directed/undirected graphs with every start and traversal scope, including cycles, self-loops, duplicate labels, empty graphs, shortest paths, invalid starts, colour resets and repeat runs.

The generated code check now covers basic DFS, extended DFS/BFS and basic BFS; edit their TRA Java sources and run `npm run sync:java-snippets`. Event-equivalence tests instrument temporary copies of those exact statements, leaving downloadable sources free of test logging.

The Trees lesson preserves the A–G drawing and adds empty/single/chain cases, live size/edge-height/depth/node-frame counts and a source-derived Java highlight. The combined method fills all three orders; each view filters the corresponding append events. Null-base frames are explained separately from displayed node frames. Binary BTree, general Tree, BST, heap and external-memory B-tree are distinguished. The heap visualisation retains its controls and array/tree views; tests compare values, minima and removal results with the real TRA queue without assuming its internal layout. `TraPriorityQueueExample` includes duplicates, empty peek/poll and a task comparator.

Graph applications reuse the existing DFS/BFS workspace in an expandable walkthrough with five scenarios. `TraComponentsExample` groups an undirected Graph and checks cycles by physical Edge identity; `TraTopologicalExample` returns reverse POST only after a full DiGraph cycle check, including disconnected cycles and self-loops. Both native-order operations take Θ(V + E) time and O(V) additional space. `TraTraversalExample` supplies paths, forest roots, cycle witnesses and the shared animation; its prepared Edge lists avoid the binary's linear getEdge lookup inside the traversal loop. Property checks use reachability closure, Kahn's algorithm and forest edge counts on 240 generated graphs, accepting any valid path/partition/order. Runnable example commands and output remain checked with Java 11 and the supplied JAR.

Weighted shortest paths use `TraDijkstraExample` (immutable lazy TRA PriorityQueue entries, non-negative weights, parents) and `TraFloydWarshallExample` (identity-based indices and distance/next-hop matrices derived from real TRA Edge objects). Both preserve all graph fields and reconstruct minimum-weight paths, with INF/empty paths for unreachable vertices. Dijkstra takes O(V + E log(E + 1)) time and O(V + E) extra space; Floyd takes O(V³ + E) time and O(V²) extra space. These bounds assume expected O(1) identity-map operations. Finite float weights accumulate in double, with documented floating-point limits. Floyd permits negative edges but rejects the whole result on any computed negative cycle, including disconnected ones. Tests compare distances against independent Bellman-Ford and validate actual path edges/weights on 340 generated inputs plus numeric, empty, identity, cycle and repeat-run boundaries. No new runtime library or weighted-animation replacement is introduced.

Minimum spanning trees/forests use `TraMinimumSpanningTreeExample`. Prim holds real boundary Edge objects in TRA PriorityQueue and restarts per component; Kruskal sorts a copy of Graph.edges() and uses private union-find arrays with external Vertex identity indices. Results expose the actual selected edges, all vertices, component count and double weight. Disconnected input yields a minimum spanning forest with V-C edges; isolated, empty and one-vertex cases are explicit. Finite negative/zero/equal weights are supported, non-finite weights rejected, and all input fields preserved. Each method takes O(V + E log(E + 1)) time and O(V + E) extra space under the documented identity-map model. Independent checks enumerate small spanning subsets and validate cycle-exchange optimality across 76 labelled topologies and 320 generated graphs, accepting different equally good forests. The lesson contrasts an MST of weight 3 with a shortest-path tree of weight 4 on the same triangle.

Graph analysis uses three primary TRA sources: `TraGraphCutsExample` (all-component Graph tin/low DFS and real bridge edges), `TraBipartiteMatchingExample` (validated explicit partition and maximum-cardinality reassignment) and `TraMaxFlowExample` (DiGraph Edmonds–Karp with TRA LinkedQueue). Flow uses a separate forward/cancellation residual pair per input Edge, preserving original antiparallel edges and all input fields. Its teaching capacity contract accepts stored finite integral floats in [0, 1_000_000_000], then uses exact long arithmetic and returns per-Edge flows plus an equal-capacity min-cut witness. Cuts/matching ignore weights. Independent deletion, exhaustive matching and exhaustive min-cut checks cover 160 generated graphs per algorithm plus boundary/identity/preservation cases. Details, commands and complexity assumptions are in the TRA source README files; no new graph editor, SCC implementation or runtime dependency is added.
