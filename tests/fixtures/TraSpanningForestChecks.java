import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/** Independent forest checks: reachability, exhaustive subsets and the cycle-exchange property. */
public class TraSpanningForestChecks {
    private static void check(boolean condition, String description) {
        if (!condition) throw new AssertionError(description);
    }

    private static List<Vertex> vertices(Graph graph) {
        List<Vertex> result = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) result.add(vertex);
        return result;
    }

    private static List<Edge> edges(Graph graph) {
        List<Edge> result = new ArrayList<>();
        for (Edge edge : graph.edges()) result.add(edge);
        return result;
    }

    private static Map<Vertex, Integer> ids(List<Vertex> vertices) {
        Map<Vertex, Integer> result = new IdentityHashMap<>();
        for (int i = 0; i < vertices.size(); i++) result.put(vertices.get(i), i);
        return result;
    }

    private static double[][] matrix(int count) {
        double[][] result = new double[count][count];
        for (double[] row : result) Arrays.fill(row, Double.NaN); // No edge; zero is a valid weight.
        return result;
    }

    private static double[][] matrix(List<Vertex> vertices, List<Edge> edges) {
        double[][] result = matrix(vertices.size());
        Map<Vertex, Integer> ids = ids(vertices);
        for (Edge edge : edges) {
            int from = ids.get(edge.getStartPoint()), to = ids.get(edge.getEndPoint());
            result[from][to] = result[to][from] = edge.getWeight();
        }
        return result;
    }

    private static boolean[] reachable(double[][] graph, int start) {
        boolean[] seen = new boolean[graph.length];
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        seen[start] = true;
        queue.add(start);
        while (!queue.isEmpty()) {
            int vertex = queue.remove();
            for (int next = 0; next < graph.length; next++) {
                if (!Double.isNaN(graph[vertex][next]) && !seen[next]) {
                    seen[next] = true;
                    queue.add(next);
                }
            }
        }
        return seen;
    }

    private static int components(double[][] graph) {
        int count = 0;
        boolean[] seen = new boolean[graph.length];
        for (int root = 0; root < graph.length; root++) {
            if (seen[root]) continue;
            count++;
            boolean[] part = reachable(graph, root);
            for (int v = 0; v < seen.length; v++) seen[v] |= part[v];
        }
        return count;
    }

    private static double maximumOnPath(double[][] forest, int from, int to) {
        boolean[] seen = new boolean[forest.length];
        double[] maximum = new double[forest.length];
        Arrays.fill(maximum, Double.NEGATIVE_INFINITY); // Paths of negative edges need no zero floor.
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        seen[from] = true;
        queue.add(from);
        while (!queue.isEmpty()) {
            int vertex = queue.remove();
            if (vertex == to) return maximum[vertex];
            for (int next = 0; next < forest.length; next++) {
                if (!Double.isNaN(forest[vertex][next]) && !seen[next]) {
                    seen[next] = true;
                    maximum[next] = Math.max(maximum[vertex], forest[vertex][next]);
                    queue.add(next);
                }
            }
        }
        return Double.NaN;
    }

    private static double exhaustiveWeight(List<Vertex> vertices, List<Edge> edges, int components) {
        Map<Vertex, Integer> id = ids(vertices);
        double best = Double.POSITIVE_INFINITY;
        int required = vertices.size() - components;
        for (int mask = 0; mask < (1 << edges.size()); mask++) {
            if (Integer.bitCount(mask) != required) continue;
            double[][] chosen = matrix(vertices.size());
            double sum = 0;
            for (int e = 0; e < edges.size(); e++) {
                if ((mask & (1 << e)) == 0) continue;
                Edge edge = edges.get(e);
                int from = id.get(edge.getStartPoint()), to = id.get(edge.getEndPoint());
                chosen[from][to] = chosen[to][from] = edge.getWeight();
                sum += edge.getWeight();
            }
            // A subset cannot join different input components. Full coverage with V-C edges
            // therefore gives a forest spanning each of them, independently of union-find.
            if (components(chosen) == components) best = Math.min(best, sum);
        }
        return best;
    }

    private static void checkResult(TraMinimumSpanningTreeExample.Result result,
                                    List<Vertex> vertices, List<Edge> edges, boolean exhaustive) {
        Map<Vertex, Integer> id = ids(vertices);
        Set<Vertex> covered = Collections.newSetFromMap(new IdentityHashMap<Vertex, Boolean>());
        for (Vertex vertex : result.vertices()) {
            check(id.containsKey(vertex) && covered.add(vertex), "Every actual input vertex once, even equal labels");
        }
        check(covered.size() == vertices.size(), "All vertices are covered, including isolated ones");
        Set<Edge> inputEdges = Collections.newSetFromMap(new IdentityHashMap<Edge, Boolean>());
        inputEdges.addAll(edges);
        Set<Edge> accepted = Collections.newSetFromMap(new IdentityHashMap<Edge, Boolean>());
        double[][] chosen = matrix(vertices.size());
        double sum = 0;
        for (Edge edge : result.edges()) {
            check(inputEdges.contains(edge) && accepted.add(edge), "Choose each physical input Edge at most once");
            int from = id.get(edge.getStartPoint()), to = id.get(edge.getEndPoint());
            check(!reachable(chosen, from)[to], "A selected edge must not close a cycle");
            chosen[from][to] = chosen[to][from] = edge.getWeight();
            sum += (double)edge.getWeight();
        }
        double[][] original = matrix(vertices, edges);
        int componentCount = components(original);
        check(result.components() == componentCount, "Input component count, not a count of nonempty edge groups");
        check(result.edges().size() == vertices.size() - componentCount, "Forest edge count is V-C");
        check(result.isSpanningTree() == (!vertices.isEmpty() && componentCount == 1), "Empty/single/tree convention");
        for (int v = 0; v < vertices.size(); v++) {
            check(Arrays.equals(reachable(original, v), reachable(chosen, v)), "Same connected partition as input");
        }
        check(Double.isFinite(result.totalWeight()) && result.totalWeight() == sum, "Sum finite float weights in double");
        for (Edge edge : edges) {
            int from = id.get(edge.getStartPoint()), to = id.get(edge.getEndPoint());
            double maximum = maximumOnPath(chosen, from, to);
            check(!Double.isNaN(maximum) && maximum <= edge.getWeight(),
                    "No cheaper edge can replace the maximum on a chosen path: minimum forest property");
        }
        if (exhaustive && vertices.size() <= 6 && edges.size() <= 12) {
            check(result.totalWeight() == exhaustiveWeight(vertices, edges, componentCount),
                    "Minimum over every spanning subset, not just agreement of two implementations");
        }
        if (!result.edges().isEmpty()) {
            try { result.edges().remove(0); throw new AssertionError("Read-only Edge result"); }
            catch (UnsupportedOperationException expected) { /* Contract: cannot remove a result edge. */ }
        }
        if (!result.vertices().isEmpty()) {
            try { result.vertices().remove(0); throw new AssertionError("Read-only Vertex result"); }
            catch (UnsupportedOperationException expected) { /* Contract: cannot remove a covered vertex. */ }
        }
    }

    private static String snapshot(Graph graph, List<Vertex> vertices) {
        Map<Vertex, Integer> id = ids(vertices);
        StringBuilder out = new StringBuilder();
        for (Vertex vertex : graph.vertices()) {
            out.append(id.get(vertex)).append(':').append(vertex.getLabel()).append(':')
               .append(vertex.getColor()).append(':').append(vertex.getIndex()).append(':')
               .append(vertex.getWeight()).append(';');
        }
        for (Edge edge : graph.edges()) {
            out.append(id.get(edge.getStartPoint())).append('>').append(id.get(edge.getEndPoint()))
               .append(':').append(edge.getWeight()).append(':').append(edge.getColor())
               .append(':').append(edge.getLabel()).append(';');
        }
        return out.toString();
    }

    private static void verify(Graph graph, boolean exhaustive) {
        List<Vertex> vertices = vertices(graph);
        List<Edge> edges = edges(graph);
        for (int i = 0; i < vertices.size(); i++) {
            vertices.get(i).setColor(AbstractGraph.RED);
            vertices.get(i).setIndex(100 + i);
            vertices.get(i).setWeight(-99.0f - i);
        }
        for (Edge edge : edges) edge.setColor(AbstractGraph.BLUE);
        String before = snapshot(graph, vertices);
        TraMinimumSpanningTreeExample.Result prim = TraMinimumSpanningTreeExample.prim(graph);
        List<Edge> savedEdges = new ArrayList<>(prim.edges());
        double savedWeight = prim.totalWeight();
        TraMinimumSpanningTreeExample.Result kruskal = TraMinimumSpanningTreeExample.kruskal(graph);
        checkResult(prim, vertices, edges, exhaustive);
        checkResult(kruskal, vertices, edges, exhaustive);
        TraMinimumSpanningTreeExample.Result repeat = TraMinimumSpanningTreeExample.prim(graph);
        checkResult(repeat, vertices, edges, false);
        check(prim.edges().equals(savedEdges) && prim.totalWeight() == savedWeight, "A later run preserves earlier results");
        check(prim != repeat, "Each run owns its result");
        check(snapshot(graph, vertices).equals(before), "Both algorithms preserve all graph fields and topology");
    }

    private static void rejects(Runnable action) {
        try { action.run(); }
        catch (IllegalArgumentException error) {
            check(error.getMessage().equals("non-finite weight"), "Specific invalid-weight reason");
            return;
        }
        throw new AssertionError("Non-finite input must be rejected before a forest escapes");
    }

    private static void boundaries() {
        verify(new Graph(), true);
        Graph isolated = new Graph();
        for (int i = 0; i < 4; i++) isolated.addVertex("same");
        verify(isolated, true);
        verify(TraMinimumSpanningTreeExample.createExampleGraph(false), true);
        Graph disconnected = TraMinimumSpanningTreeExample.createExampleGraph(true);
        verify(disconnected, false);
        check(TraMinimumSpanningTreeExample.prim(disconnected).components() == 3, "Three example components");
        check(TraMinimumSpanningTreeExample.kruskal(disconnected).totalWeight() == 2, "Negative component contributes weight");
        for (float weight : new float[]{Float.MIN_VALUE, -Float.MIN_VALUE, Float.MAX_VALUE, -Float.MAX_VALUE, 0.1f}) {
            Graph graph = new Graph();
            Vertex a = graph.addVertex("same"), b = graph.addVertex("same"), c = graph.addVertex("same");
            b.addEdge(a, weight); // Reversed storage orientation must not break Prim's endpoint choice.
            c.addEdge(b, weight);
            verify(graph, false);
            double expected = (double)weight + (double)weight;
            check(TraMinimumSpanningTreeExample.prim(graph).totalWeight() == expected, "Prim accumulates in double");
            check(TraMinimumSpanningTreeExample.kruskal(graph).totalWeight() == expected, "Kruskal accumulates in double");
        }
        for (float invalid : new float[]{Float.NaN, Float.POSITIVE_INFINITY, Float.NEGATIVE_INFINITY}) {
            Graph graph = new Graph();
            graph.addVertex("first isolated");
            graph.addVertex("same").addEdge(graph.addVertex("same"), invalid);
            String before = snapshot(graph, vertices(graph));
            rejects(() -> TraMinimumSpanningTreeExample.prim(graph));
            rejects(() -> TraMinimumSpanningTreeExample.kruskal(graph));
            check(snapshot(graph, vertices(graph)).equals(before), "Invalid input is not modified");
        }
        Graph contrast = TraMinimumSpanningTreeExample.createContrastGraph();
        verify(contrast, true);
        List<Vertex> v = vertices(contrast);
        TraDijkstraExample.Result distances = TraDijkstraExample.search(contrast, v.get(0));
        check(distances.distanceTo(v.get(1)) == 2 && distances.distanceTo(v.get(2)) == 2, "Shortest paths from A");
        check(TraMinimumSpanningTreeExample.prim(contrast).totalWeight() == 3, "MST differs from the weight-4 shortest-path tree");
    }

    public static void main(String[] args) {
        boundaries();
        int topologies = 0;
        for (int n = 0; n <= 4; n++) {
            int pairs = n * (n - 1) / 2;
            for (int mask = 0; mask < (1 << pairs); mask++) {
                Graph graph = new Graph();
                List<Vertex> vertices = new ArrayList<>();
                for (int i = 0; i < n; i++) vertices.add(graph.addVertex("same"));
                int bit = 0;
                for (int i = 0; i < n; i++) {
                    for (int j = i + 1; j < n; j++, bit++) {
                        if ((mask & (1 << bit)) != 0) vertices.get(j).addEdge(vertices.get(i), (float)(bit % 3 - 1));
                    }
                }
                verify(graph, true);
                topologies++;
            }
        }
        Random random = new Random(202611206);
        for (int run = 0; run < 320; run++) {
            Graph graph = new Graph();
            int n = run < 200 ? random.nextInt(7) : 8 + random.nextInt(23);
            List<Vertex> vertices = new ArrayList<>();
            for (int i = 0; i < n; i++) vertices.add(graph.addVertex("same"));
            for (int i = 0; i < n; i++) {
                for (int j = i + 1; j < n; j++) {
                    if (random.nextInt(5) != 0) continue;
                    float weight = (random.nextInt(17) - 8) * 0.25f;
                    if (run % 7 == 0) weight = 0; // Many valid minimum forests.
                    if (random.nextBoolean()) vertices.get(i).addEdge(vertices.get(j), weight);
                    else vertices.get(j).addEdge(vertices.get(i), weight);
                }
            }
            verify(graph, true);
        }
        System.out.println("TRA spanning forests passed: " + topologies
                + " exhaustive topologies, 320 generated graphs, minimum/identity/preservation boundaries");
    }
}
