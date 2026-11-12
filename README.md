# DSA2 Visual Lab

An interactive React/Vite study site for Data Structures and Algorithms II. Explore graphs, DFS/BFS, PRE/POST events, trees, sorting, and algorithm complexity through visual explanations and runnable Java examples.

## Languages

The interface, lessons, and algorithm explanations are available in Finnish, Russian, and English. Use the language switcher at the top of the page on desktop or mobile. Your choice is saved in the browser; English is the default on the first visit. Switching languages preserves the current topic and visualisation step.

Core translations are in `src/i18n/fi.js`, `src/i18n/ru.js`, and `src/i18n/en.js`. Topic IDs and algorithm logic are shared across languages.

## Course handout and Java examples

The material is aligned with the supplied `dsaII_handout.pdf` (University of Eastern Finland, autumn 2025, 89 pages). The [coverage map and implementation notes](docs/HANDOUT_ALIGNMENT.md) document the corresponding sections and identify topics covered at an introductory level. That companion document is currently in Russian.

The site contains 21 topics and 26 standalone Java examples covering Set/Map, `equals`/`hashCode`, lists and queues, traversals, merge sort, Dijkstra/Floyd–Warshall, Prim/Kruskal, articulation points, matching, maximum flow, dynamic programming, strings, and files. Each example includes source code, expected output, complexity, assumptions, and a `.java` download.

Run a downloaded example with JDK 17 or newer:

```bash
java SetOperationsExample.java
```

Java sources are in `src/examples`, their catalogue is in `src/data/javaExamples.js`, and handout references are in `src/data/handout.js`. Additional lesson translations are in `src/i18n/handout.fi.js`, `src/i18n/handout.ru.js`, and `src/i18n/handout.en.js`. The handout PDF is not bundled with the site.

## Features

- A DSA2 topic roadmap.
- An interactive Big O table with adjustable input size `n`.
- A five-question time complexity quiz with Java examples, multiple-choice answers, explanations, a final score, and retries in all three languages.
- Two-pointer union of sorted lists.
- Set/Map operations and the `equals`/`hashCode` contract.
- Visual preorder, inorder, and postorder tree traversals.
- Interactive min-heap and PriorityQueue visualisations: synchronised tree/array views, offer/peek/poll, sift-up/down animations, removal order, return values, and manual or automatic playback.
- Step-by-step and automatic visualisations of bubble, insertion, merge, and quick sort, including merge buffers and pivot highlighting.
- Graph adjacency lists.
- Interactive DFS with PRE/POST events, a call stack, visited vertices, and step explanations.
- Interactive BFS with a queue, visited vertices, and distances.
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

Run translation, graph traversal, sorting visualisation, and Java example checks:

```bash
npm test
```

The Java checks require JDK 17 or newer and are explicitly skipped when a JDK is unavailable. They compile the examples and compare their actual output with the output displayed on the site. Additional algorithm checks cover boundary cases and comparisons with reference results.
