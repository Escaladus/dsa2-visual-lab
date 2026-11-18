# DSA2 Visual Lab

An interactive React/Vite study site for Data Structures and Algorithms II. Explore graphs, DFS/BFS, PRE/POST events, trees, sorting, and algorithm complexity through visual explanations and runnable Java examples.

## Languages

The interface, lessons, and algorithm explanations are available in Finnish, Russian, and English. Use the language switcher at the top of the page on desktop or mobile. Your choice is saved in the browser; English is the default on the first visit. Switching languages preserves the current topic and visualisation step.

Core translations are in `src/i18n/fi.js`, `src/i18n/ru.js`, and `src/i18n/en.js`. Topic IDs and algorithm logic are shared across languages.

For code navigation, trace state, Java snippet synchronisation and development checks, see the [code guide](docs/CODE_GUIDE.md). Run `npm run format` to apply the shared style, `npm run format:check` to verify it and `npm run lint` to check JavaScript. The Pages workflow runs the format and lint checks before building.

## Course handout and Java examples

The material is aligned with the supplied `dsaII_handout.pdf` (University of Eastern Finland, autumn 2025, 89 pages). The [coverage map and implementation notes](docs/HANDOUT_ALIGNMENT.md) document the corresponding sections and identify topics covered at an introductory level. That companion document is currently in Russian.

The site contains 22 topics and 31 standalone Java examples covering Set/Map, `equals`/`hashCode`, lists and queues, traversals, merge sort, Dijkstra/Floyd–Warshall, Prim/Kruskal, articulation points, matching, maximum flow, dynamic programming, strings, and files. Each example includes source code, expected output, complexity, assumptions, and a `.java` download.

Run a downloaded example with JDK 17 or newer:

```bash
java SetOperationsExample.java
```

Java sources are in `src/examples`, their catalogue is in `src/data/javaExamples.js`, and handout references are in `src/data/handout.js`. Additional lesson translations are in `src/i18n/handout.fi.js`, `src/i18n/handout.ru.js`, and `src/i18n/handout.en.js`. The handout PDF is not bundled with the site.

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
- An expandable time and space analysis below the recursion workspace covers factorial, naive and memoised Fibonacci, and recursive DFS. Live counters distinguish total calls, current and peak stack frames, cache capacity and filled entries, adjacency reads, and shared structures. Recurrences and a comparison table explain the bounds; a separate `n = 0…20` growth table preserves the visualisation step. DFS analysis includes the cost of allocating `visited` even for reachable-only traversal. Counts describe the shown Java algorithms, separately from timing and visualisation history, in all three languages.
- Visual preorder, inorder, and postorder tree traversals.
- Interactive min-heap and PriorityQueue visualisations: synchronised tree/array views, offer/peek/poll, sift-up/down animations, removal order, return values, and manual or automatic playback. Peek is immediate; starting another operation completes the current one, and Undo restores the pre-operation heap.
- Step-by-step and automatic visualisations of bubble, insertion, merge, and quick sort, including merge buffers and pivot highlighting.
- Graph adjacency lists.
- Three separate learning views keep the original traversal illustration as the default. **Step-by-step traversal** restores recursive DFS with coloured call cards, local variables, saved loop continuations, PRE/POST, code expansion and the graph/call-tree switch; basic BFS restores the A–H graph, queue and distances. **Vertex colours** focuses on WHITE → GREY → BLACK without edge classes or timestamps; BFS vertices remain GREY after removal until all neighbours are examined. **DFS edge types** uses directed examples with tree/back/forward/cross annotations and tin/tout. Each algorithm/view retains its own settings and position, including across language changes; leaving a view pauses its animation. Mobile graph/code/stack tabs and bottom controls remain available.
- A collapsed **Practice: applications and DFS/BFS comparison** block below the main workspace retains the advanced shared-graph lab, five examples, common start/scope/neighbour order and separately saved DFS/BFS positions. Opening practice does not replace the basic illustration.
- Guided graph moments, optional tree/back/forward/cross labels, the undirected parent-edge exception, a full-results comparison, target/path highlighting and five application scenarios cover reachability, shortest unweighted paths, undirected components, cycle witnesses and topological order. Other BFS forest roots retain infinite distance from the original start. Directed traversal trees are not presented as SCCs. Working memory is O(V); storing all edge classes adds O(E) output. `GraphTraversalExample.java` matches the displayed DFS/BFS methods; the older `RecursiveDfsExample.java` remains a simpler boolean-visited example.
- A separate 12-question graph quiz uses fixed visual states, explanations for each wrong choice and post-check edge classification. Previous questions, pending choices, checked answers and results survive language changes. The original 15-question recursion review remains in the recursion topic.
- Connected components, cycles, shortest paths, and topological ordering.
- Java tools: Iterator, Comparable, Comparator, and generics.

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal.

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

The Java checks require JDK 17 or newer and are explicitly skipped when a JDK is unavailable. They compile the examples and compare their actual output with the output displayed on the site. Additional algorithm checks cover boundary cases and comparisons with reference results.
