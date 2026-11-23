# TRA examples: one idea at a time — Java 11+

Each file teaches one operation or one algorithm step and runs independently. Start with basics, then DFS/BFS, applications, trees/queue, weighted paths/MST, and finally analysis/flow. On the site the main code comes first; the complete source and launch command are expandable.

Extract this ZIP and open a terminal in `tra-graphs` (the folder containing `traj.jar`). The commands below use paths from that folder and work on Windows, macOS and Linux. For one file downloaded from the site, put it next to `traj.jar` and run `java -Dfile.encoding=UTF-8 -cp traj.jar Filename.java`. In an IDE, add the JAR as a library. No other example source is needed.

The topic folders contain `RUN.txt` with the same root-relative commands. `expected-output.txt` records the checked console output. Comments and output in Java are in English; lesson explanations are available in English, Russian and Finnish on the site.

## Assumptions and next steps

- Each lesson states its own starting conditions. Basic DFS uses a visited map; colour DFS is separate. Algorithms that use colours initialise them before the call and are allowed to change them. Topology is not changed by traversal.
- Neighbours follow the supplied JAR's order. Changing it can change DFS order, parents and the chosen equally short BFS path. The demonstrated fixture order is checked, not promised for arbitrary inputs. Duplicate labels are not vertex IDs: maps use Vertex identity.
- The first Dijkstra scans vertices: expected O(V² + E) time, O(V) extra space. It requires finite nonnegative weights. Floyd starts from a matrix built from actual TRA edges; it allows negative weights and rejects negative cycles. Infinity means unreachable.
- Prim and Kruskal are separate. Prim uses TRA PriorityQueue; the first Kruskal uses an explicit DSU without rank/compression, giving expected O(V + E log(E + 1) + E·V) time. Do not assign the optimised DSU bound to this version. Edge weights must be finite and fixed. Disconnected inputs give forests.
- tin/low, bridges and articulation points are separate lessons. The root rule counts DFS children, not degree. Matching assumes an explicitly known valid bipartition: all edges cross it. It does not compute or validate an arbitrary partition.
- Flow has three small prerequisite examples before the complete algorithm. Individual steps are not maximum-flow solvers. The full implementation maps TRA vertices to a residual matrix, uses TRA LinkedQueue, and accepts stored finite integral float capacities in [0, 1_000_000_000]. The residual matrix changes, the input graph does not. It aggregates cancellation and opposite capacity, so it reports a total flow/min-cut, not per-input-edge flows. Matrix scanning gives O(V² + E + V³·E) time and O(V²) space. Vertex lists must contain every graph vertex exactly once; terminal indices must be valid and distinct.
- An empty binary tree has height -1; a leaf has height 0. PRE, IN and POST have separate methods. Tree's first-child/next-sibling representation has its own example.
- In TRA, `addEdge(v, 5.0f)` sets a weight; `addEdge(v, 5)` sets a colour. Use `fi.uef.cs.tra` consistently. Map bounds assume expected O(1) identity-map operations.

The original course JAR is unchanged: SHA-256 `589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423`. Technical reference implementations used to verify existing visualisations stay in the repository, outside this student ZIP.

## Examples in learning order

### basics

**Create an undirected graph**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraCreateGraph.java
```

**Create a directed graph**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraCreateDirectedGraph.java
```

**Visit every vertex**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraListVertices.java
```

**Visit one vertex’s neighbours**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraListNeighbors.java
```

**Read an edge weight**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraReadEdgeWeight.java
```

**Attach data to a vertex**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraVertexMap.java
```

### dfs

**Recursive DFS: visit a vertex**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraSimpleDfs.java
```

**DFS: why a cycle stops**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsCycle.java
```

**DFS: entry and return (PRE / POST)**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsPrePost.java
```

**DFS with WHITE, GREY and BLACK**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraColourDfs.java
```

**DFS: entry and exit times**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsTimes.java
```

**Directed DFS: classify one edge**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsEdgeTypes.java
```

### bfs

**BFS: visit using a queue**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraSimpleBfs.java
```

**BFS: why D enters the queue once**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsDiscovery.java
```

**BFS: distance in number of edges**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsDistances.java
```

**BFS: reconstruct a path**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsPath.java
```

### applications

**DFS: continue in another component**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraFullDfs.java
```

**Cycle in an undirected graph**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraUndirectedCycle.java
```

**Cycle in a directed graph**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraDirectedCycle.java
```

**DAG: reverse the POST order**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraTopologicalOrder.java
```

### trees

**Create a binary tree**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraCreateTree.java
```

**Read a node’s children**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeChildren.java
```

**PRE: node, left, right**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreePRE.java
```

**IN: left, node, right**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeIN.java
```

**POST: left, right, node**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreePOST.java
```

**Count tree nodes**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeSize.java
```

**Compute height in edges**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeHeight.java
```

**General tree: children and siblings**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraGeneralTreeChildren.java
```

### queue

**PriorityQueue: add values**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueOffer.java
```

**PriorityQueue: look without removing**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueuePeek.java
```

**PriorityQueue: remove the minimum**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueuePoll.java
```

**PriorityQueue: equal values are allowed**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueDuplicates.java
```

**PriorityQueue: choose another order**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueComparator.java
```

**Tasks: priority and a tie-breaker**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraTaskPriority.java
```

### weighted

**Dijkstra: distances with nonnegative weights**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraDijkstraDistances.java
```

**Dijkstra: remember the improved path**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraDijkstraPath.java
```

**TRA graph → distance matrix**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraGraphMatrix.java
```

**Floyd: try one intermediate vertex**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraFloydDistances.java
```

**Floyd: reconstruct a path**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraFloydPath.java
```

### mst

**Prim: grow one tree**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraPrim.java
```

**Disjoint sets: are endpoints already connected?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraDisjointSets.java
```

**Kruskal: accept edges without creating cycles**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraKruskal.java
```

### analysis

**DFS: what tin and low mean**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraLowValues.java
```

**Bridge: can the child subtree get back?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraBridges.java
```

**Articulation point: what if the vertex disappears?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraArticulationPoints.java
```

**Matching: move an existing pair**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraMatchingStep.java
```

**Matching: repeat with each left vertex**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraMaximumMatching.java
```

### flow

**Flow: remaining capacity**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraResidualCapacity.java
```

**Flow: augment one known path**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraAugmentFlow.java
```

**Flow: cancel an earlier decision**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraCancelFlow.java
```

**Maximum flow: repeat augmenting paths**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraMaximumFlow.java
```

**Minimum cut: reachable residual side**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraMinimumCut.java
```
