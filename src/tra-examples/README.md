# Additional TRA graph examples — JDK 11+

These are complete runnable examples using the course's `fi.uef.cs.tra` package. They supplement the site's original 31 examples without external Java dependencies.

Extract the ZIP. Keep the three `.java` files and `traj.jar` together. Open a terminal in that folder and run any example:

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar TraGraphExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraDfsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraBfsExample.java
```

The same commands work on Windows, macOS and Linux. In an IDE, add `traj.jar` as a library. Each file contains its own main method and helper classes; it does not depend on the other examples. `expected-output.txt` contains the output verified with this JAR.

- **TraGraphExample:** create `DiGraph`/`Graph`, add vertices and edges, use `vertices()`, `neighbors()`, `getColor()` and `setColor()`. An undirected edge is added once; Graph provides both neighbour directions.
- **TraDfsExample:** recursive DFS, GREY/PRE on entry, POST/BLACK on completion, caller continuation, parents and roots. `traverse(graph, start, false)` visits the reachable part; `true` continues from remaining WHITE vertices. Directed traversal roots are not strongly connected components.
- **TraBfsExample:** `LinkedQueue<Vertex>`, GREY before enqueueing, BLACK after examining neighbours, shortest distances by number of edges and a parent path. Unreachable distance is -1 and its path is empty. Queue removal does not immediately turn a vertex BLACK.

Both traversal methods accept `AbstractGraph`, so they work with `DiGraph` or `Graph`. A nonempty graph needs a start vertex belonging to that graph; an empty graph uses null. Each call resets colours. Vertex identities are used for parent/distance maps: duplicate labels do not merge vertices.

In this TRA version, `DiGraph` permits self-loops; `Graph` rejects them when an edge is added.

The displayed PRE/POST and discovery orders follow `neighbors()` in the included JAR. Changing neighbour order may change DFS parents and traversal lists, and may choose a different equally short BFS path. It does not change shortest distances. Source comments and console output are shared across interface languages.

Full DFS takes Θ(V + E) time and O(V) additional memory, including results and stack. Reachable-only DFS and BFS take Θ(V + R + A_R), including the initial colour reset and, for BFS, distance initialisation. R is the number of reachable vertices; A_R counts examined outgoing adjacency entries. The graph itself is excluded from additional memory. These examples do not sort neighbours or copy all adjacency lists before traversal.

The supplied `traj.jar` is included unchanged (SHA-256 `589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423`). It also contains the older `fi.joensuu.cs.tra` package; these examples consistently use `fi.uef.cs.tra`. Library documentation is inside `javadoc/fi/uef/cs/tra/` in the JAR.
