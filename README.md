# DSA2 Visual Lab

An interactive React/Vite study site for Data Structures and Algorithms II. Explore graphs, DFS/BFS, PRE/POST events, trees, sorting, and algorithm complexity through visual explanations and runnable Java examples.

## Languages

The interface, lessons, and algorithm explanations are available in Finnish, Russian, and English. Use the language switcher at the top of the page on desktop or mobile. Your choice is saved in the browser; English is the default on the first visit. Switching languages preserves the current topic and visualisation step.

Core translations are in `src/i18n/fi.js`, `src/i18n/ru.js`, and `src/i18n/en.js`. Topic IDs and algorithm logic are shared across languages.

For code navigation, trace state, Java snippet synchronisation and development checks, see the [code guide](docs/CODE_GUIDE.md). Run `npm run format` to apply the shared style, `npm run format:check` to verify it and `npm run lint` to check JavaScript. The Pages workflow runs the format and lint checks before building.

## Course handout and Java examples

The material is aligned with the supplied `dsaII_handout.pdf` (University of Eastern Finland, autumn 2025, 89 pages). The [coverage map and implementation notes](docs/HANDOUT_ALIGNMENT.md) document the corresponding sections and identify topics covered at an introductory level. That companion document is in English.

The site contains 22 topics and 31 standalone Java examples covering Set/Map, `equals`/`hashCode`, lists and queues, traversals, merge sort, Dijkstra/Floyd–Warshall, Prim/Kruskal, articulation points, matching, maximum flow, dynamic programming, strings, and files. Each example includes source code, expected output, complexity, assumptions, and a `.java` download.

Run a downloaded example with JDK 11 or newer:

```bash
java SetOperationsExample.java
```

Java sources are in `src/examples`, their catalogue is in `src/data/javaExamples.js`, and handout references are in `src/data/handout.js`. Additional lesson translations are in `src/i18n/handout.fi.js`, `src/i18n/handout.ru.js`, and `src/i18n/handout.en.js`. The handout PDF is not bundled with the site.

**52 short TRA lessons** are in [`src/tra-examples/lessons`](src/tra-examples/README.md). Each file teaches one operation or one algorithm step: graph creation, vertices, neighbours, weights, DFS, PRE/POST, colours, BFS, distances, paths, components/cycles, tree operations, queue operations, weighted paths, separate Prim/Kruskal, tin/low, bridges, articulation points, matching and flow. The site shows the actual source-derived teaching region, a small input, expected output and an explanation; the full runnable source is collapsed separately. Advanced steps follow the basic examples.

The downloadable `tra-graphs.zip` groups lessons by topic and includes the unchanged `traj.jar`, expected output, topic command indexes and English and Finnish README files. From the extracted `tra-graphs` folder, run with JDK 11+:

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraCreateGraph.java
```

Individual downloads can be placed next to `traj.jar` and launched by filename. Every file is independent. The old sixteen multi-purpose TRA sources remain technical references for existing visualisations and regression tests, outside the student catalogue and ZIP. The 31 original JDK sources remain, with replaced graph/tree versions in optional comparison sections.

The [migration map](docs/TRA_MIGRATION.md) and [TRA contracts](docs/TRA_CONTRACTS.md) distinguish the short teaching implementations from those technical references. The pedagogical rewrite follows the completed algorithm migration; BFS-distance and shortest-path exercises extend stage 7; component/tree exercises and the final audit remain pending. All download builders verify the pinned JAR (`npm run check:tra-library`).

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
- The DFS topic includes a downloadable Java coding task: implement one recursive method that counts distinct reachable vertices using the course's `traj.jar`. The ZIP contains a starter, a portable JDK 11+ checker and English and Finnish README files. Checks run locally with `java -Dfile.encoding=UTF-8 Check.java en` (or `ru` / `fi`), explain failed cases and can be rerun freely after edits. The website shows the task and graph; it does not execute submitted Java. Existing visualisations and quizzes are preserved.
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

The short-lesson checks extract the actual student ZIP, compile every source with `--release 11`, launch each independently in source mode and compare its output with the site. Teaching fragments are extracted from marked regions of those same downloadable files. A separate Java fixture checks the new versions against Bellman–Ford distances, exhaustive minimum forests, deletion-based articulation/bridge references, exhaustive matchings and exhaustive cuts. It covers duplicates, unreachable vertices, cycles/self-loops, negative-edge restrictions, disconnected graphs, parent/next-hop paths and residual cut witnesses.

The existing visualisation checks remain. Basic DFS, colour/edge DFS/BFS, basic BFS and tree traversal still use source-derived snippets from the technical reference files: edit those files only when intentionally changing the animation and run `npm run sync:java-snippets`. Their independent graph/tree/numeric checks continue to run even though the reference sources are no longer beginner downloads. Student examples and animation code are separate views of the same concepts, not an identical public Java API.

Implementation bounds are explicit: the first Dijkstra scans vertices (expected O(V² + E) time, O(V) space); Prim uses TRA PriorityQueue; the first Kruskal uses the preceding unoptimised DSU (expected O(V + E log(E + 1) + E·V)). Floyd uses a TRA-derived matrix with optional next-hop reconstruction and negative-cycle rejection. Flow lessons progress through remaining capacity, one augmentation and cancellation before a complete matrix-BFS Edmonds–Karp and minimum cut (O(V² + E + V³·E) time, O(V²) space). Stored flow capacities must be finite integral floats in [0, 1_000_000_000]. The residual matrix combines cancellation and opposite capacity; it is not a per-input-edge flow report. See the example README for starting conditions, allowed mutations and commands.


The teaching methods now document input conditions, results and state changes directly in Java, with translated prerequisites beside the code. Cycle/discovery lessons (`TraDfsCycle` and `TraBfsDiscovery`) explain why discovery must precede recursion or enqueueing; the full-component example explains isolated roots. Cards pair the small input with expected output and keep setup instructions expandable. Core DFS/colour visualisations remain unchanged.

The BFS topic also offers a local Java 11 exercise: implement `Map<Vertex, Integer> distances(Vertex start)`. The ZIP contains a TODO starter, the unchanged TRA JAR, English and Finnish README files and a checker. It requires shortest directed hop distances, actual Vertex keys, absent unreachable vertices and unchanged input fields/structure; colours may be arbitrary. The independent checker uses all-pairs relaxation, includes fixed-seed graphs, and reports concrete wrong distances. It rejects DFS discovery depth when a shorter path exists. Optional self-evaluation comments in both DFS and BFS starters ask students to explain termination, correctness and complexity without introducing an online quiz. Run from the extracted `bfs-distances` folder: `java -Dfile.encoding=UTF-8 Check.java en`.


The next BFS task is **find and return a shortest path**: implement `List<Vertex> shortestPath(Vertex start, Vertex target)` in the `bfs-path` kit. The result contains actual input vertices in forward order, including both endpoints; unreachable returns an empty list and equal endpoints return `[start]`. Any shortest route is accepted, including both branches of the illustrated diamond. The expandable task includes a method signature, parent-chain explanation, progressive hints, a separate walkthrough and time/memory reasoning. It follows the distance task without replacing it. Run `java -Dfile.encoding=UTF-8 Check.java en` in the extracted `bfs-path` folder.

The path checker independently computes shortest hop lengths, validates every vertex/edge and input field, and tests cycles, direction, self-loops, unreachable/equal terminals, duplicate labels and reproducible random graphs. Tests explicitly accept the alternate shortest route and reject reversed paths, valid but longer DFS routes, missing edges, foreign/repeated vertices, mutation and stale compilation followed by correction. All three coding kits use the original pinned JAR; each contains only a starter, launcher, checker and English/Finnish README files alongside the library.
