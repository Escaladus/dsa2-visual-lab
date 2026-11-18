# Graph task 1: count reachable vertices

Write one recursive DFS method in `Solution.java`:

```java
public static int reachableCount(Vertex start)
```

Return the number of **distinct vertices reachable by following outgoing edges** from `start`. Include `start` itself. Different vertices may have the same label: count vertices, not labels.

## Example

Directed edges: `0→1, 0→2, 1→3, 2→3`. Vertex `4` is isolated.

- Start at `0`: return **4**. Vertex `3` is counted once even though two paths reach it. Vertex `4` is not reachable.
- Start at `3`: return **1**, because there are no outgoing edges.

## Contract

- `start` is not null. The graph is small, directed, unweighted, and may contain cycles or self-loops; there are no parallel edges.
- The checker creates each graph and sets every vertex to `AbstractGraph.WHITE` before calling your method. Do not initialise or reset colours inside recursive calls.
- Mark discovered vertices `AbstractGraph.GREY` or `AbstractGraph.BLACK`. Leave unreachable vertices WHITE. The checks accept either visited colour; a full three-colour DFS is not required for this task.
- Use recursive DFS. You may add helper methods. Do not add/remove vertices or edges, and do not rely on labels being unique.
- Return an integer. The checker reads the return value, not printed output. The neighbour order does not affect the answer.

## Run

Install **JDK 11 or newer**. Extract the ZIP first. Open a terminal **inside the `dfs-reachable` folder**, where `Check.java`, `GraphChecks.java`, `Solution.java` and `traj.jar` are together.

```bash
java -Dfile.encoding=UTF-8 Check.java en
```

Other feedback languages: `java -Dfile.encoding=UTF-8 Check.java ru` and `java -Dfile.encoding=UTF-8 Check.java fi`.

Edit only `Solution.java`, save, and run the same command again. The starter deliberately throws a TODO exception: the first run checks that everything launches and reports unfinished work. There are no permanent scores or locked answers. Restore the original `Solution.java` from the ZIP to start over.

The launcher compiles the saved solution with the supplied JAR. It runs 10 check groups: isolated start, chain, branching, directed cycle, disconnected graph, direction, two paths to one vertex, self-loop, duplicate labels, and 30 additional reproducible graphs. Each group has a fresh process, a 5-second time limit, and bounded heap/stack. Compile errors, exceptions, timeouts, wrong counts, wrong colours and graph modification are reported separately. Temporary compiled files are removed; an old `.class` is never used after a compilation error.

You can also use an IDE: add `traj.jar` as a library, edit `Solution.java`, and run `Check.main` with the exercise folder as its working directory.

## Library reference

Use `fi.uef.cs.tra.*` (not the older `fi.joensuu.cs.tra` package also present in this JAR).

```java
vertex.neighbors()                    // Iterable<Vertex>: outgoing neighbours
vertex.getColor()                     // current colour
vertex.setColor(AbstractGraph.GREY)    // mark this vertex
```

The supplied `traj.jar` is included unchanged. SHA-256: `589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423`.
Documentation is also inside the JAR under `javadoc/fi/uef/cs/tra/`.

## After solving

Explain when you mark a vertex, why a cycle terminates, and why converging paths do not double-count a vertex. Express your method's time in terms of reachable vertices R and examined outgoing adjacency entries A_R, and explain the maximum recursion stack. Initialising the graph and its colours is done by the checker, outside your method.

Passing checks verifies these finite examples and the stated output/colour/structure conditions. It does not prove that the method is recursive, correct on every possible input, or has a particular time complexity. Review the code for recursion and derive complexity separately. The time limit only stops nonterminating attempts; it is not a benchmark.
