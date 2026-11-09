# DSA2 Visual Lab

An interactive React/Vite study site for Data Structures and Algorithms II. Explore graphs, DFS/BFS, PRE/POST events, trees, sorting, and algorithm complexity through visual explanations and runnable Java examples.

## Languages

The interface, lessons, and algorithm explanations are available in Finnish, Russian, and English. Use the language switcher at the top of the page on desktop or mobile. Your choice is saved in the browser; Russian is the default on the first visit. Switching languages preserves the current topic and visualisation step.

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
- Two-pointer union of sorted lists.
- Set/Map operations and the `equals`/`hashCode` contract.
- Visual preorder, inorder, and postorder tree traversals.
- Heap and PriorityQueue explanations.
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

## Deploy to GitHub Pages

The deployment workflow is already included in `.github/workflows/deploy.yml`.

1. Create an empty public GitHub repository, for example `dsa2-visual-lab`. Leave the README, licence, and `.gitignore` initialisation options unchecked.
2. In a terminal, change into this project's directory and run the following commands. Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub username and repository name:

   ```bash
   git init
   git add .
   git commit -m "Initial DSA2 Visual Lab"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

3. On GitHub, open the repository's **Settings → Pages**.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. Open **Actions → Deploy DSA2 Visual Lab to GitHub Pages → Run workflow**, select `main`, and start the workflow. If an earlier run failed before Pages was enabled, rerun it after completing step 4.
6. Wait for the workflow to succeed. Find the published URL under **Settings → Pages**:

   ```text
   https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
   ```

The workflow installs dependencies, builds the site, and publishes the `dist` directory. `vite.config.js` derives the correct base path from the repository name in GitHub Actions, including the root path for a `username.github.io` repository.

To publish subsequent changes:

```bash
git add .
git commit -m "Update site"
git push
```

Every push to `main` triggers deployment automatically.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Application layout and lesson rendering |
| `src/data/topics.js` | Stable topic IDs and navigation groups |
| `src/data/handout.js` | Handout sections and page references |
| `src/data/javaExamples.js` | Java example catalogue and expected outputs |
| `src/components` | Navigation, language controls, and interactive visualisations |
| `src/i18n` | Finnish, Russian, and English lesson text and step explanations |
| `src/utils/graphAlgorithms.js` | DFS and BFS visualisation steps |
| `src/utils/sortingAlgorithms.js` | Visualisation steps for all four sorting algorithms |
| `src/examples` | Downloadable standalone Java source files |
| `tests` | Translation, algorithm, and Java checks |

To extend a lesson, update its translations in `src/i18n`. Add interactive components under `src/components`, algorithm logic under `src/utils`, and Java examples under `src/examples` with a corresponding catalogue entry and translations.

The project is entirely static and requires no backend or database.
