# Try it in Java: shortest BFS distances — Java 11+

Return Map<Vertex, Integer> with the shortest number of outgoing edges from start to every reachable vertex. Include start with distance 0. Leave unreachable vertices out of the map.

For the drawing, start = 0 → {0:0, 1:1, 2:1, 3:2}; vertex 4 is absent. From start = 3, return only {3:0}. Map iteration order does not matter.

## How to solve and check

1. Install JDK 11 or newer. Extract the ZIP and open bfs-distances in your IDE.
2. Edit only Solution.java. Replace the TODO exception with a queue-based BFS; helpers are allowed.
3. Save, open a terminal in that folder and run the command below. After a correction, run the same command again.

```bash
java -Dfile.encoding=UTF-8 Check.java en
```

The untouched template reports unfinished work. After implementing the method, the checker shows which cases pass and explains failures. To start over, restore Solution.java from the ZIP.

## Conditions and useful library methods

- The directed unweighted graph may contain cycles, self-loops and equal labels, but no parallel edges. start is a valid non-null vertex.
- Colours can have arbitrary values. Do not read them as discovery marks or change any graph fields: record discovery in your new distance map.
- Return actual Vertex keys and integer hop distances. Unreachable vertices must be absent; -1 entries are not accepted.

The ZIP contains Solution.java, Check.java, GraphChecks.java, the supplied traj.jar, and English and Finnish README files. No Maven or Gradle setup is needed.

## What the checker does

The checker compiles with --release 11 and the original traj.jar. Ten groups cover isolation, chains, shared neighbours, cycles, disconnection, direction, a shorter alternative, a self-loop, equal labels and 30 fixed-seed graphs. It compares against independent shortest-hop calculations and checks unchanged input fields. Each group has a fresh JVM and 5-second limit.

A failure shows the graph, start, expected result and actual result. Compilation errors and stack overflows are explained separately. Every run is a fresh attempt; results never lock your code.

Passing cases do not prove that the code uses BFS or has the claimed complexity. Explain the algorithm separately; the timeout is not a benchmark.

## Optional: explain your solution

- Why does first discovery give a shortest hop distance?
- Why is each vertex enqueued at most once, including on cycles?
- What are time and queue/map memory costs for the reachable part?

Write a few self-evaluation lines in the optional comment in Solution.java. You can retry indefinitely; there is no score to reset on the website.
