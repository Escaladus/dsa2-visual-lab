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
| Additional ready-to-run TRA examples and their catalogue | `src/tra-examples`, `src/data/traJavaExamples.js`, `TraJavaExamples` and `src/i18n/traJavaExamples.js` |
| Downloadable DFS coding task, supplied JAR and local checker | `exercises/dfs-reachable` |
| Coding task page and archive builder | `GraphCodingExercise`, `src/i18n/graphCodingExercise.js` and `scripts/package-graph-exercise.mjs` |
| Translated UI and event explanations                         | `src/i18n`                                                                                                     |

## How a visualisation step works

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

Additional TRA examples live separately from the original standalone catalogue. `package-java-downloads.mjs` now prepares both the task ZIP and `public/examples/tra-graphs.zip`; the latter reuses the canonical JAR from the task folder and generates `expected-output.txt` from the TRA catalogue. `TraJavaExamples` displays related sources, commands and output after the original examples. Keep the two catalogues separate: their classpaths differ. Each TRA file runs independently with the supplied JAR on JDK 11+. Traversal results use vertex identity and fresh containers per call; resetting colours does not rewrite previously returned lists or maps. Tests compile the actual archive, compare source-mode output and check graph algorithms against integer reference traversals.

`GraphTraversalExample.java` is the source of truth for the extended traversal's displayed Java methods:

```bash
npm run sync:java-snippets
npm run check:java-snippets
```

The script produces `src/data/graphTraversalCode.js`; do not edit that generated file directly. It preserves method-relative line numbers. Java statements locate execution highlights and quiz excerpts, so moving a statement to a different line does not require changing a numeric slice. Renaming a statement still requires updating its selector in `src/utils/graphTraversal.js` or `src/data/graphQuiz.js`.

Some teaching events group related metadata assignments, such as assigning a child's parent, root, depth and distance. Their highlight points to the first statement in that group. Keep the event explanation consistent with the whole group when changing it.

The basic DFS and factorial/Fibonacci use short teaching snippets in `src/data/recursiveDfs.js` and `src/data/recursion.js`. Their trace builders refer to snippet-relative line numbers. Change those snippets, the matching Java source and line references together. The tests compare source, traces, continuations and results.

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
