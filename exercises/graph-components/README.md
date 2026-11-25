# Connected components — TRA Java exercise

Write one method in `Solution.java`:

```java
public static List<List<Vertex>> components(Graph graph)
```

Find **all connected components** of the supplied, non-null, **undirected** TRA
`Graph`. A component is a maximal group of vertices connected by paths. Use DFS
or BFS; helper methods are allowed. This is not a directed or strongly connected
components task.

## What to return

- Return the actual input `Vertex` objects in nonempty component lists.
- Every input vertex must occur exactly once, including isolated vertices.
- Component order and vertex order do not matter. Do not sort to satisfy a checker.
- An empty graph returns `[]`; an isolated vertex forms a singleton component.
- Labels may repeat. They and `Vertex.index` are not identifiers for this task.
- Do not change topology or any vertex/edge fields. Initial colours are arbitrary;
  use your own visited set or map. Input graphs have no loops or parallel edges.

Example: vertices `0,1,2,3,4`, undirected edges `0—1` and `3—4`.

```text
0 — 1       2       3 — 4

One valid result:     [[0, 1], [2], [3, 4]]
Another valid result: [[4, 3], [1, 0], [2]]
```

The numbers above identify the pictured vertices. Return `Vertex` references,
not numbers, labels or newly created copies.

## Solve and check (JDK 11 or newer)

Extract the ZIP, open the `graph-components` folder in your IDE and edit **only
`Solution.java`**. Replace the TODO exception with your implementation. Save, then
run from that folder:

```bash
java -Dfile.encoding=UTF-8 Check.java en
```

Use `ru` or `fi` instead of `en` for Russian or Finnish checker messages. English
is the default when no language argument is given. This README is in English.
The ZIP contains `Solution.java`, `Check.java`, `GraphChecks.java`, this README
and the original `traj.jar`; no Maven, Gradle or separate downloads are needed.
For IDE completion, add this JAR as a library. The checker sets its own classpath.

The untouched template reports `TODO: implement components`. Every run compiles
the current files from scratch, using `--release 11`. Edit, save and rerun as many
times as needed. To restart, restore the original `Solution.java` from the ZIP.

The ten groups cover empty/singleton/all-isolated inputs, a chain, the pictured
partition, a cycle plus other components, bridged cycles, reversed stored edge
endpoints, equal labels, and 40 fixed-seed graphs. An independent undirected
transitive-closure calculation checks coverage, uniqueness and membership;
**any valid ordering** is accepted. Graph fields and physical edges must remain
unchanged. Each group has a fresh JVM and a five-second limit.

Feedback shows the graph and returned groups using diagnostic vertex IDs. It
distinguishes missing/repeated/foreign vertices, empty groups, connected pairs
split apart, disconnected pairs merged together, and input mutation. Compilation
errors are separate. Tests do not prove that you used DFS/BFS or establish
asymptotic complexity. The time limit detects nontermination; it is not an
efficiency benchmark.

## Hints — open after trying

1. Loop over **all** `graph.vertices()`, not just one starting vertex. A visited
   set survives between traversals. `Collections.newSetFromMap(new
   IdentityHashMap<>())` gives a set of actual vertex identities.
2. For each unvisited root, start a fresh component list. Mark a vertex before
   recursion or enqueueing; collect all vertices reached through `v.neighbors()`.
   With BFS, the supplied TRA `LinkedQueue` supports `offer`, `remove`, `isEmpty`.
3. After that traversal, save its component and continue the outer loop. A root
   with no neighbours still adds itself, giving a singleton component.

## Walkthrough of the drawing

1. Start at `0`: a traversal finds `0` and `1`, producing `[0, 1]`.
2. The outer loop skips already visited `1`, then starts at isolated `2`: `[2]`.
3. Start at `3`: find `3` and `4`, producing `[3, 4]`; later skip visited `4`.
4. Return all three lists. Other root/neighbour orders change the listing but
   not which vertices belong together.

With expected O(1) visited-set operations and adjacency lists, the complete DFS
or BFS takes expected O(V + E) time. An undirected edge appears in two neighbour
lists, still O(E). Working memory is O(V) in the worst case (visited set plus
DFS stack or BFS queue); the returned lists also require O(V) space. The input
graph is excluded. Explain why each traversal gives a whole component, why no
vertex is repeated, and why the outer loop covers every component.
