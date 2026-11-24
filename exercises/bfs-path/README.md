# Task 2: BFS — find and return a shortest path — Java 11+

After finding BFS distances, return the actual route. Implement one method with TRA vertices, a queue and a parent map, then check it locally.

```java
public static List<Vertex> shortestPath(Vertex start, Vertex target)
```

Return the actual Vertex objects of a shortest path by number of edges, ordered from start to target and including both endpoints. Any shortest route is accepted.

Remember where each vertex was discovered from: its parent. After BFS, follow parents from target back to start, then reverse the list. This is called reconstructing the path.

For start = 0, target = 3: [0, 1, 3] or [0, 2, 3] — both have 2 edges. For target = 4, return []. For start = target = 0, return [0]. Numbers identify the vertices in this drawing; return Vertex objects, not numbers or labels.

## How to solve and check

1. Use JDK 11 or newer. Extract the ZIP and open bfs-path in your IDE.
2. Edit only Solution.java. Replace the TODO exception with BFS and parent-chain reconstruction. Helpers are allowed.
3. Save and run the command below from that folder. Correct errors and run it again; every attempt starts fresh.

```bash
java -Dfile.encoding=UTF-8 Check.java en
```

The untouched template reports unfinished work. After implementing the method, the checker shows which cases pass and explains failures. To start over, restore Solution.java from the ZIP.

## Conditions and useful library methods

- start and target are non-null vertices of the same directed graph. Each edge counts as one step; cycles, self-loops and equal labels are possible. No parallel edges.
- Do not change graph structure or any vertex/edge fields. Colours may be arbitrary. Record discovery and parents in your own map.
- Return original Vertex objects, in forward order, including both endpoints. Unreachable means an empty list, never null. start == target means [start].
- The checker accepts any valid shortest path; neighbour order and ties do not require one canonical list.

The ZIP contains Solution.java, Check.java, GraphChecks.java, the supplied traj.jar, and English and Finnish README files. No Maven or Gradle setup is needed.

## Need a hint?

### How do I record a parent?

On first discovery set parent[next] = current. A parent-map entry also means discovered. Give start an entry with a null parent.

### What if the target cannot be reached?

After BFS, a missing target entry means return an empty list. If start equals target, the correct path contains start.

### How do I return the forward route?

Append target, then its parent, and continue until the start/null parent. The resulting list is backwards, so reverse it.

## Walkthrough: from parents to the route

1. One valid BFS discovers 1 from 0 and 3 from 1: parent(1)=0, parent(3)=1.
2. Read backwards from target 3: [3, 1, 0]. The null parent of 0 ends the chain.
3. Reverse it to [0, 1, 3]. Three vertices make two edges.
4. Discovering 3 from 2 instead gives [0, 2, 3], also correct. The checker checks the route properties rather than a fixed answer.

For R discovered vertices and A examined neighbour entries, BFS takes expected O(R + A) time and O(R) extra memory. Reading and reversing a route containing k vertices takes O(k) time and O(k) result space. This excludes the input graph.

## What the checker does

The checker uses the real traj.jar and --release 11. Ten groups cover equal terminals, unreachable targets, chains, two valid shortest routes, a shorter direct route, cycles, disconnected graphs, direction, equal labels/self-loops and 36 fixed-seed graphs. It checks actual vertices, directed edges, endpoints, shortest length and unchanged input fields. Each group has a fresh JVM and a 5-second limit.

A failure shows input edges, start, target and the returned vertex IDs where available. It explains a reversed route, a missing edge, a non-shortest route, foreign vertices or changed input. Compilation errors are reported separately; you can retry without limits.

Tests accept all valid shortest routes on these inputs. They do not prove BFS use or an asymptotic bound. Explain correctness and complexity in your own words; the timeout is not a speed measurement.

## Optional: explain your solution

- Why does first discovery of target give a shortest hop path?
- Why do the saved parent links lead back to start, and why reverse them?
- What are BFS time/memory and the extra cost of building a path of length k?

Optionally write a few explanation lines in the Solution.java comment. Use the walkthrough after trying the task. Existing distance and DFS tasks remain available.
