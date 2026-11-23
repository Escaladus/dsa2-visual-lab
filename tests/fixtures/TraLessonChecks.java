import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/** Independent references for the shorter student versions, not only their fixed main output. */
public class TraLessonChecks {
    static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    static void rejects(Runnable action) {
        try {
            action.run();
        } catch (IllegalArgumentException expected) {
            return;
        }
        throw new AssertionError("Expected invalid input rejection");
    }

    static String capture(Runnable action) {
        PrintStream previous = System.out;
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (PrintStream temporary = new PrintStream(bytes)) {
            System.setOut(temporary);
            action.run();
        } finally {
            System.setOut(previous);
        }
        return bytes.toString();
    }

    // Repeated relaxation is independent of both queue BFS and greedy Dijkstra.
    static double[] referenceDistances(double[][] weights, int source) {
        double[] distance = new double[weights.length];
        Arrays.fill(distance, Double.POSITIVE_INFINITY);
        distance[source] = 0;
        for (int pass = 1; pass < weights.length; pass++) {
            for (int from = 0; from < weights.length; from++) {
                for (int to = 0; to < weights.length; to++) {
                    distance[to] = Math.min(distance[to], distance[from] + weights[from][to]);
                }
            }
        }
        return distance;
    }

    static void paths(Random random) {
        for (int sample = 0; sample < 120; sample++) {
            int n = 1 + random.nextInt(6);
            DiGraph graph = new DiGraph();
            List<Vertex> vertices = new ArrayList<>();
            for (int i = 0; i < n; i++) vertices.add(graph.addVertex("X"));
            double[][] weight = new double[n][n];
            double[][] hops = new double[n][n];
            for (int i = 0; i < n; i++) {
                Arrays.fill(weight[i], Double.POSITIVE_INFINITY);
                Arrays.fill(hops[i], Double.POSITIVE_INFINITY);
            }
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    if (random.nextInt(4) == 0) {
                        int cost = random.nextInt(8);
                        vertices.get(from).addEdge(vertices.get(to), (float) cost);
                        weight[from][to] = cost;
                        hops[from][to] = 1;
                    }
                }
            }
            double[][] floyd = TraFloydDistances.matrix(vertices);
            TraFloydDistances.floyd(floyd);
            double[][] withNext = TraFloydPath.matrix(vertices);
            int[][] next = new int[n][n];
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    next[from][to] = Double.isFinite(withNext[from][to]) ? to : -1;
                }
            }
            TraFloydPath.floyd(withNext, next);
            for (int source = 0; source < n; source++) {
                Vertex start = vertices.get(source);
                double[] expected = referenceDistances(weight, source);
                double[] expectedHops = referenceDistances(hops, source);
                Map<Vertex, Integer> bfs = TraBfsDistances.distances(start);
                Map<Vertex, Double> dijkstra = TraDijkstraDistances.dijkstra(graph, start);
                Map<Vertex, Vertex> parent = new IdentityHashMap<>();
                Map<Vertex, Double> withPath = TraDijkstraPath.dijkstra(graph, start, parent);
                Map<Vertex, Vertex> bfsParent = TraBfsPath.parents(start);
                Map<Vertex, Boolean> visited = new IdentityHashMap<>();
                for (Vertex vertex : vertices) visited.put(vertex, false);
                capture(() -> TraSimpleDfs.dfs(start, visited));
                for (int target = 0; target < n; target++) {
                    Vertex vertex = vertices.get(target);
                    check(dijkstra.get(vertex) == expected[target], "Dijkstra distance");
                    check(withPath.get(vertex) == expected[target], "Dijkstra path distance");
                    check(floyd[source][target] == expected[target], "Floyd distance");
                    check(withNext[source][target] == expected[target], "Floyd path distance");
                    if (Double.isFinite(expected[target])) {
                        int cursorIndex = source;
                        int length = 0;
                        double cost = 0;
                        while (cursorIndex != target) {
                            int nextIndex = next[cursorIndex][target];
                            check(nextIndex >= 0 && ++length <= n, "Floyd next-hop termination");
                            cost += weight[cursorIndex][nextIndex];
                            cursorIndex = nextIndex;
                        }
                        check(cost == expected[target], "Floyd actual path-edge sum");
                    } else {
                        check(TraFloydPath.path(source, target, next, vertices).isEmpty(), "Floyd unreachable path");
                    }
                    int expectedDistance = Double.isFinite(expectedHops[target]) ? (int) expectedHops[target] : -1;
                    check(bfs.getOrDefault(vertex, -1) == expectedDistance, "BFS shortest hops");
                    check(visited.get(vertex) == Double.isFinite(expected[target]), "Basic DFS reachability");
                    check(bfsParent.containsKey(vertex) == Double.isFinite(expected[target]), "BFS path reachability");
                    if (!Double.isFinite(expected[target])) {
                        check(TraDijkstraPath.pathTo(vertex, parent).isEmpty(), "Unreachable weighted path");
                        check(TraBfsPath.pathTo(vertex, bfsParent).isEmpty(), "Unreachable BFS path");
                        continue;
                    }
                    double sum = 0;
                    Vertex cursor = vertex;
                    int steps = 0;
                    while (parent.get(cursor) != null) {
                        Vertex before = parent.get(cursor);
                        check(++steps <= n, "Parent cycle");
                        Edge edge = before.getEdge(cursor);
                        check(edge != null, "Parent must be an actual directed edge");
                        sum += edge.getWeight();
                        cursor = before;
                    }
                    check(cursor == start && sum == expected[target], "Weighted parent-chain sum");
                    cursor = vertex;
                    steps = 0;
                    while (bfsParent.get(cursor) != null) {
                        Vertex before = bfsParent.get(cursor);
                        check(before.isAdjacent(cursor) && ++steps <= n, "BFS physical parent chain");
                        cursor = before;
                    }
                    check(cursor == start && steps == expectedDistance, "BFS shortest chain length");
                }
            }
        }
        DiGraph invalid = new DiGraph();
        Vertex a = invalid.addVertex("A");
        Vertex b = invalid.addVertex("B");
        a.addEdge(b, -1.0f);
        rejects(() -> TraDijkstraDistances.dijkstra(invalid, a));
        rejects(() -> TraDijkstraPath.dijkstra(invalid, a, new IdentityHashMap<>()));
        b.addEdge(a, -1.0f);
        rejects(() -> TraFloydDistances.floyd(TraFloydDistances.matrix(List.of(a, b))));
        // Negative edges without a cycle remain valid for Floyd.
        DiGraph dag = new DiGraph();
        Vertex x = dag.addVertex("X");
        Vertex y = dag.addVertex("Y");
        x.addEdge(y, -3.0f);
        double[][] result = TraFloydDistances.matrix(List.of(x, y));
        TraFloydDistances.floyd(result);
        check(result[0][1] == -3, "Negative DAG edge");
    }

    static int componentCount(boolean[][] edges, int removed, int skipA, int skipB) {
        int n = edges.length;
        boolean[] seen = new boolean[n];
        int count = 0;
        for (int root = 0; root < n; root++) {
            if (root == removed || seen[root]) continue;
            count++;
            List<Integer> pending = new ArrayList<>();
            pending.add(root);
            seen[root] = true;
            for (int i = 0; i < pending.size(); i++) {
                int from = pending.get(i);
                for (int to = 0; to < n; to++) {
                    boolean skipEdge = (from == skipA && to == skipB) || (from == skipB && to == skipA);
                    if (to != removed && edges[from][to] && !skipEdge && !seen[to]) {
                        seen[to] = true;
                        pending.add(to);
                    }
                }
            }
        }
        return count;
    }

    static double minimumForest(List<Edge> edges, List<Vertex> vertices, int components) {
        double best = Double.POSITIVE_INFINITY;
        for (int mask = 0; mask < (1 << edges.size()); mask++) {
            if (Integer.bitCount(mask) != vertices.size() - components) continue;
            boolean[][] chosen = new boolean[vertices.size()][vertices.size()];
            double sum = 0;
            for (int bit = 0; bit < edges.size(); bit++) {
                if ((mask & (1 << bit)) != 0) {
                    Edge edge = edges.get(bit);
                    int from = vertices.indexOf(edge.getStartPoint());
                    int to = vertices.indexOf(edge.getEndPoint());
                    chosen[from][to] = chosen[to][from] = true;
                    sum += edge.getWeight();
                }
            }
            if (componentCount(chosen, -1, -1, -1) == components) best = Math.min(best, sum);
        }
        return best;
    }

    static void checkForest(List<Edge> chosen, List<Edge> all, List<Vertex> vertices, int components, double optimum) {
        check(chosen.size() == vertices.size() - components, "Forest V-C");
        boolean[][] adjacency = new boolean[vertices.size()][vertices.size()];
        double sum = 0;
        for (Edge edge : chosen) {
            check(all.contains(edge), "Actual input Edge in forest");
            int from = vertices.indexOf(edge.getStartPoint());
            int to = vertices.indexOf(edge.getEndPoint());
            check(!adjacency[from][to], "No repeated edge");
            adjacency[from][to] = adjacency[to][from] = true;
            sum += edge.getWeight();
        }
        check(componentCount(adjacency, -1, -1, -1) == components, "Forest components");
        check(sum == optimum, "Exhaustive minimum forest weight");
    }

    static void undirected(Random random) {
        for (int sample = 0; sample < 100; sample++) {
            int n = random.nextInt(6);
            Graph graph = new Graph();
            List<Vertex> vertices = new ArrayList<>();
            for (int i = 0; i < n; i++) vertices.add(graph.addVertex("X"));
            List<Edge> edges = new ArrayList<>();
            boolean[][] adjacency = new boolean[n][n];
            for (int from = 0; from < n; from++) {
                for (int to = from + 1; to < n; to++) {
                    if (random.nextBoolean()) {
                        Edge edge = vertices.get(to).addEdge(vertices.get(from), (float) (random.nextInt(10) - 3));
                        edges.add(edge); // Reversed storage orientation is deliberate.
                        adjacency[from][to] = adjacency[to][from] = true;
                    }
                }
            }
            int components = componentCount(adjacency, -1, -1, -1);
            TraLowValues.clock = 0;
            TraLowValues.tin.clear();
            TraLowValues.low.clear();
            TraBridges.clock = 0;
            TraBridges.tin.clear();
            TraBridges.low.clear();
            TraBridges.bridges.clear();
            TraArticulationPoints.clock = 0;
            TraArticulationPoints.tin.clear();
            TraArticulationPoints.low.clear();
            TraArticulationPoints.cuts.clear();
            for (Vertex vertex : vertices) {
                if (!TraLowValues.tin.containsKey(vertex)) TraLowValues.visit(vertex, null);
                if (!TraBridges.tin.containsKey(vertex)) TraBridges.visit(vertex, null);
                if (!TraArticulationPoints.tin.containsKey(vertex)) TraArticulationPoints.visit(vertex, null);
            }
            for (int i = 0; i < n; i++) {
                Vertex vertex = vertices.get(i);
                check(TraLowValues.low.get(vertex) <= TraLowValues.tin.get(vertex), "low <= tin");
                boolean cut = componentCount(adjacency, i, -1, -1) > components;
                check(TraArticulationPoints.cuts.contains(vertex) == cut, "Deletion articulation oracle");
            }
            for (Edge edge : edges) {
                int from = vertices.indexOf(edge.getStartPoint());
                int to = vertices.indexOf(edge.getEndPoint());
                boolean bridge = componentCount(adjacency, -1, from, to) > components;
                check(TraBridges.bridges.contains(edge) == bridge, "Deletion bridge oracle");
            }
            boolean cycle = false;
            for (Vertex vertex : vertices) vertex.setColor(fi.uef.cs.tra.AbstractGraph.WHITE);
            for (Vertex vertex : vertices) {
                if (vertex.getColor() == fi.uef.cs.tra.AbstractGraph.WHITE && TraUndirectedCycle.hasCycle(vertex, null)) {
                    cycle = true;
                    break;
                }
            }
            check(cycle == (edges.size() > n - components), "Undirected cycle rank");
            double best = minimumForest(edges, vertices, components);
            checkForest(TraPrim.prim(graph), edges, vertices, components, best);
            checkForest(TraKruskal.kruskal(graph), edges, vertices, components, best);
        }
    }

    static int exhaustiveMatching(boolean[][] edges, int left, boolean[] used) {
        if (left == edges.length) return 0;
        int best = exhaustiveMatching(edges, left + 1, used);
        for (int right = 0; right < used.length; right++) {
            if (edges[left][right] && !used[right]) {
                used[right] = true;
                best = Math.max(best, 1 + exhaustiveMatching(edges, left + 1, used));
                used[right] = false;
            }
        }
        return best;
    }

    static void matching(Random random) {
        for (int sample = 0; sample < 120; sample++) {
            Graph graph = new Graph();
            int l = random.nextInt(5);
            int r = random.nextInt(5);
            List<Vertex> left = new ArrayList<>();
            List<Vertex> right = new ArrayList<>();
            for (int i = 0; i < l; i++) left.add(graph.addVertex("X"));
            for (int i = 0; i < r; i++) right.add(graph.addVertex("X"));
            boolean[][] edges = new boolean[l][r];
            for (int i = 0; i < l; i++) {
                for (int j = 0; j < r; j++) {
                    if (random.nextBoolean()) {
                        left.get(i).addEdge(right.get(j));
                        edges[i][j] = true;
                    }
                }
            }
            Map<Vertex, Vertex> owner = new IdentityHashMap<>();
            int size = 0;
            for (Vertex vertex : left) {
                Set<Vertex> seen = Collections.newSetFromMap(new IdentityHashMap<>());
                if (TraMaximumMatching.augment(vertex, owner, seen)) size++;
            }
            check(size == exhaustiveMatching(edges, 0, new boolean[r]), "Exhaustive matching cardinality");
            Set<Vertex> used = Collections.newSetFromMap(new IdentityHashMap<>());
            for (Map.Entry<Vertex, Vertex> pair : owner.entrySet()) {
                check(pair.getKey().isAdjacent(pair.getValue()), "Matching input edge");
                check(used.add(pair.getValue()), "One partner per left vertex");
            }
        }
    }

    static long exhaustiveCut(long[][] capacity) {
        int n = capacity.length;
        long best = Long.MAX_VALUE;
        for (int mask = 0; mask < (1 << n); mask++) {
            if ((mask & 1) == 0 || (mask & (1 << (n - 1))) != 0) continue;
            long sum = 0;
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    if ((mask & (1 << from)) != 0 && (mask & (1 << to)) == 0) sum += capacity[from][to];
                }
            }
            best = Math.min(best, sum);
        }
        return best;
    }

    static void flows(Random random) {
        for (int sample = 0; sample < 140; sample++) {
            int n = 2 + random.nextInt(5);
            DiGraph graph = new DiGraph();
            List<Vertex> vertices = new ArrayList<>();
            for (int i = 0; i < n; i++) vertices.add(graph.addVertex("X"));
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    if (random.nextInt(3) == 0) vertices.get(from).addEdge(vertices.get(to), (float) random.nextInt(8));
                }
            }
            long[][] capacity = TraMaximumFlow.capacities(vertices);
            long[][] residual = Arrays.stream(capacity).map(long[]::clone).toArray(long[][]::new);
            long expected = exhaustiveCut(capacity);
            long value = TraMaximumFlow.maxFlow(residual, 0, n - 1);
            check(value == expected, "Exhaustive max-flow/min-cut oracle");
            int[] reached = TraMaximumFlow.bfs(residual, 0);
            check(reached[n - 1] == -1, "No final augmenting path");
            long cut = 0;
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    if (reached[from] >= 0 && reached[to] == -1) cut += capacity[from][to];
                }
            }
            check(cut == value, "Actual residual cut witness");
            long[][] second = Arrays.stream(capacity).map(long[]::clone).toArray(long[][]::new);
            check(TraMinimumCut.maxFlow(second, 0, n - 1) == expected, "Complete cut example solver");
            for (Vertex vertex : vertices) {
                for (Edge edge : vertex.edges()) {
                    int from = vertices.indexOf(vertex);
                    int to = vertices.indexOf(edge.getEndPoint(vertex));
                    check(edge.getWeight() == capacity[from][to], "Input capacities preserved");
                }
            }
        }
        for (float invalid : new float[]{-1, 0.5f, Float.NaN, Float.POSITIVE_INFINITY, 1_000_000_064f}) {
            DiGraph graph = new DiGraph();
            Vertex a = graph.addVertex("A");
            Vertex b = graph.addVertex("B");
            a.addEdge(b, invalid);
            rejects(() -> TraMaximumFlow.capacities(List.of(a, b)));
        }
        rejects(() -> TraMaximumFlow.maxFlow(new long[1][1], 0, 0));
        check(TraTreeSize.size(null) == 0 && TraTreeHeight.height(null) == -1, "Empty tree base cases");
    }

    static void directedBoundaries() {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        a.addEdge(b);
        a.addEdge(c);
        b.addEdge(c); // A -> C later reaches BLACK, which is not a cycle.
        for (Vertex vertex : graph.vertices()) vertex.setColor(fi.uef.cs.tra.AbstractGraph.WHITE);
        check(!TraDirectedCycle.hasCycle(a), "BLACK convergence is not a directed cycle");
        for (Vertex vertex : graph.vertices()) vertex.setColor(fi.uef.cs.tra.AbstractGraph.WHITE);
        List<String> post = new ArrayList<>();
        TraTopologicalOrder.visit(a, post);
        Collections.reverse(post);
        check(post.indexOf("A") < post.indexOf("B") && post.indexOf("B") < post.indexOf("C"), "Every DAG edge precedes its target");
        c.addEdge(a);
        for (Vertex vertex : graph.vertices()) vertex.setColor(fi.uef.cs.tra.AbstractGraph.WHITE);
        check(TraDirectedCycle.hasCycle(a), "Directed back-edge cycle");
        for (Vertex vertex : graph.vertices()) vertex.setColor(fi.uef.cs.tra.AbstractGraph.WHITE);
        rejects(() -> TraTopologicalOrder.visit(a, new ArrayList<>()));
        DiGraph loop = new DiGraph();
        Vertex single = loop.addVertex("single");
        single.addEdge(single);
        single.setColor(fi.uef.cs.tra.AbstractGraph.WHITE);
        check(TraDirectedCycle.hasCycle(single), "Directed self-loop");
    }

    public static void main(String[] args) {
        Random random = new Random(11232026);
        directedBoundaries();
        paths(random);
        undirected(random);
        matching(random);
        flows(random);
        System.out.println("Independent compact TRA lesson checks passed");
    }
}
