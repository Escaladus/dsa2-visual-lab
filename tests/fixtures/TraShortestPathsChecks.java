import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/** Independent Bellman-Ford references and edge/path properties, using the actual TRA JAR. */
public class TraShortestPathsChecks {
    private static void check(boolean condition, String description) {
        if (!condition) throw new AssertionError(description);
    }

    private static void rejects(Runnable action, String message) {
        try {
            action.run();
        } catch (IllegalArgumentException expected) {
            check(expected.getMessage().contains(message), "Specific input/cycle explanation: " + message);
            return;
        }
        throw new AssertionError("Expected rejection: " + message);
    }

    private static List<Vertex> vertices(AbstractGraph graph) {
        List<Vertex> result = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) result.add(vertex);
        return result;
    }

    // Reference arcs are integer-indexed test data only; the lesson algorithms use real Edge.
    private static List<double[]> arcs(List<Vertex> vertices) {
        List<double[]> result = new ArrayList<>();
        for (int i = 0; i < vertices.size(); i++) {
            Vertex from = vertices.get(i);
            for (Edge edge : from.edges()) {
                result.add(new double[]{i, vertices.indexOf(edge.getEndPoint(from)), edge.getWeight()});
            }
        }
        return result;
    }

    private static double[] reference(int n, List<double[]> arcs, int start) {
        double[] distance = new double[n];
        Arrays.fill(distance, Double.POSITIVE_INFINITY);
        distance[start] = 0;
        for (int pass = 1; pass < n; pass++) {
            boolean changed = false;
            for (double[] arc : arcs) {
                int from = (int)arc[0], to = (int)arc[1];
                if (Double.isInfinite(distance[from])) continue;
                double candidate = distance[from] + arc[2];
                if (candidate < distance[to]) {
                    distance[to] = candidate;
                    changed = true;
                }
            }
            if (!changed) break;
        }
        return distance;
    }

    private static boolean negativeCycle(int n, List<double[]> arcs) {
        // Zero at every vertex acts as a super-source, so disconnected cycles cannot hide.
        double[] distance = new double[n];
        for (int pass = 0; pass < n; pass++) {
            boolean changed = false;
            for (double[] arc : arcs) {
                int from = (int)arc[0], to = (int)arc[1];
                double candidate = distance[from] + arc[2];
                if (candidate < distance[to]) {
                    distance[to] = candidate;
                    changed = true;
                }
            }
            if (!changed) return false;
            if (pass == n - 1) return true;
        }
        return false;
    }

    private static void close(double actual, double expected, String description) {
        if (Double.isInfinite(expected)) {
            check(actual == Double.POSITIVE_INFINITY, description + ": unreachable is +infinity");
        } else {
            check(Double.isFinite(actual), description + ": finite answer");
            double tolerance = Math.max(Math.ulp(expected) * 16, Math.abs(expected) * 1e-12);
            check(Math.abs(actual - expected) <= tolerance, description + ": " + actual + " != " + expected);
        }
    }

    private static void path(List<Vertex> path, List<Vertex> vertices, Vertex from, Vertex to, double expected) {
        if (Double.isInfinite(expected)) {
            check(path.isEmpty(), "Unreachable path must be empty");
            return;
        }
        check(!path.isEmpty() && path.get(0) == from && path.get(path.size() - 1) == to, "Path endpoints by identity");
        check(path.size() <= vertices.size(), "A chosen shortest path is simple, including zero cycles");
        Map<Vertex, Boolean> seen = new IdentityHashMap<>();
        double sum = 0;
        for (int i = 0; i < path.size(); i++) {
            Vertex vertex = path.get(i);
            check(vertices.contains(vertex) && seen.put(vertex, true) == null, "Only distinct input vertices");
            if (i == 0) continue;
            Vertex previous = path.get(i - 1);
            Edge edge = null;
            for (Edge candidate : previous.edges()) {
                if (candidate.getEndPoint(previous) == vertex) edge = candidate;
            }
            check(edge != null, "Path follows a real outgoing edge, not a fabricated reverse arc");
            sum += edge.getWeight();
        }
        close(sum, expected, "Path weight equals the shortest distance; any tied route is accepted");
        if (from == to) check(path.size() == 1, "Source-to-itself path has zero edges");
    }

    private static String snapshot(AbstractGraph graph, List<Vertex> vertices) {
        StringBuilder out = new StringBuilder();
        for (Vertex vertex : graph.vertices()) {
            out.append(vertices.indexOf(vertex)).append(':').append(vertex.getLabel()).append(':')
               .append(vertex.getColor()).append(':').append(vertex.getIndex()).append(':')
               .append(vertex.getWeight()).append(';');
        }
        for (Edge edge : graph.edges()) {
            out.append(vertices.indexOf(edge.getStartPoint())).append('>')
               .append(vertices.indexOf(edge.getEndPoint())).append(':').append(edge.getWeight())
               .append(':').append(edge.getColor()).append(':').append(edge.getLabel()).append(';');
        }
        return out.toString();
    }

    private static void verify(AbstractGraph graph) {
        List<Vertex> vertices = vertices(graph);
        for (int i = 0; i < vertices.size(); i++) {
            vertices.get(i).setColor(AbstractGraph.RED);
            vertices.get(i).setIndex(100 + i); // Must not be mistaken for a matrix index.
            vertices.get(i).setWeight(-100.0f - i); // Must not be mistaken for a path distance.
        }
        for (Edge edge : graph.edges()) edge.setColor(AbstractGraph.BLUE);
        String before = snapshot(graph, vertices);
        List<double[]> arcs = arcs(vertices);
        boolean negativeEdge = arcs.stream().anyMatch(arc -> arc[2] < 0);
        boolean cycle = negativeCycle(vertices.size(), arcs);
        TraFloydWarshallExample.Result floyd = null;
        if (cycle) {
            rejects(() -> TraFloydWarshallExample.search(graph), "negative cycle");
        } else {
            floyd = TraFloydWarshallExample.search(graph);
            check(floyd.vertices().equals(vertices), "Matrix order maps the actual vertex identities");
        }
        for (int start = 0; start < vertices.size(); start++) {
            Vertex first = vertices.get(start);
            double[] expected = reference(vertices.size(), arcs, start);
            if (floyd != null) {
                for (int target = 0; target < vertices.size(); target++) {
                    Vertex last = vertices.get(target);
                    close(floyd.distance(first, last), expected[target], "Floyd versus Bellman-Ford");
                    path(floyd.path(first, last), vertices, first, last, expected[target]);
                }
            }
            if (negativeEdge) {
                rejects(() -> TraDijkstraExample.search(graph, first), "negative weight");
            } else {
                TraDijkstraExample.Result dijkstra = TraDijkstraExample.search(graph, first);
                check(dijkstra.vertices().equals(vertices), "Dijkstra result owns its vertex order");
                for (int target = 0; target < vertices.size(); target++) {
                    Vertex last = vertices.get(target);
                    close(dijkstra.distanceTo(last), expected[target], "Dijkstra versus Bellman-Ford");
                    path(dijkstra.pathTo(last), vertices, first, last, expected[target]);
                }
                TraDijkstraExample.search(graph, vertices.get((start + 1) % vertices.size()));
                for (int target = 0; target < vertices.size(); target++) {
                    close(dijkstra.distanceTo(vertices.get(target)), expected[target], "Earlier run remains independent");
                }
            }
        }
        if (vertices.isEmpty()) {
            check(TraDijkstraExample.search(graph, null).vertices().isEmpty(), "Empty Dijkstra");
            check(floyd != null && floyd.vertices().isEmpty(), "Empty Floyd");
        } else {
            rejects(() -> TraDijkstraExample.search(graph, null), "Start");
        }
        Vertex foreign = new DiGraph().addVertex("same");
        rejects(() -> TraDijkstraExample.search(graph, foreign), "Start");
        if (floyd != null) {
            TraFloydWarshallExample.Result saved = floyd;
            rejects(() -> saved.path(foreign, foreign), "Foreign");
            rejects(() -> saved.distance(foreign, foreign), "Foreign");
            TraFloydWarshallExample.search(graph);
            for (int i = 0; i < vertices.size(); i++) {
                double[] expected = reference(vertices.size(), arcs, i);
                for (int j = 0; j < vertices.size(); j++) close(saved.distance(vertices.get(i), vertices.get(j)), expected[j], "Saved Floyd");
            }
        }
        if (!negativeEdge) {
            TraDijkstraExample.Result saved = TraDijkstraExample.search(graph, vertices.isEmpty() ? null : vertices.get(0));
            rejects(() -> saved.pathTo(foreign), "Foreign");
            rejects(() -> saved.distanceTo(foreign), "Foreign");
        }
        check(snapshot(graph, vertices).equals(before), "All graph fields and topology remain intact, including after rejection");
    }

    private static void boundaries() {
        verify(new Graph());
        verify(new DiGraph());
        for (float weight : new float[]{0, 2, -1}) {
            DiGraph graph = new DiGraph();
            Vertex v = graph.addVertex("same");
            v.addEdge(v, weight);
            verify(graph);
        }
        Graph negative = new Graph();
        negative.addVertex("same").addEdge(negative.addVertex("same"), -0.25f);
        verify(negative); // Undirected negative edge gives an unbounded closed walk.
        DiGraph hidden = new DiGraph();
        hidden.addVertex("same");
        Vertex hiddenB = hidden.addVertex("same"), hiddenC = hidden.addVertex("same");
        hiddenB.addEdge(hiddenC, -2.0f);
        hiddenC.addEdge(hiddenB, 1.0f);
        verify(hidden); // Negative cycle unreachable from the first start still rejects Floyd.
        DiGraph tied = new DiGraph();
        Vertex ta = tied.addVertex("same"), tb = tied.addVertex("same");
        Vertex tc = tied.addVertex("same"), td = tied.addVertex("same");
        ta.addEdge(tb, 1.0f); ta.addEdge(tc, 1.0f);
        tb.addEdge(tc, 0.0f); tc.addEdge(tb, 0.0f);
        tb.addEdge(td, 1.0f); tc.addEdge(td, 1.0f);
        verify(tied); // Equal shortest paths and a zero cycle must not create a parent loop.
        for (float weight : new float[]{Float.NaN, Float.POSITIVE_INFINITY, Float.NEGATIVE_INFINITY}) {
            DiGraph bad = new DiGraph();
            Vertex first = bad.addVertex("same");
            bad.addVertex("same").addEdge(bad.addVertex("same"), weight);
            String before = snapshot(bad, vertices(bad));
            rejects(() -> TraDijkstraExample.search(bad, first), "non-finite weight");
            rejects(() -> TraFloydWarshallExample.search(bad), "non-finite weight");
            check(snapshot(bad, vertices(bad)).equals(before), "Non-finite input is rejected without mutation");
        }
        for (float weight : new float[]{Float.MIN_VALUE, Float.MAX_VALUE, 0.25f}) {
            DiGraph graph = new DiGraph();
            Vertex a = graph.addVertex("same"), b1 = graph.addVertex("same"), c1 = graph.addVertex("same");
            a.addEdge(b1, weight);
            b1.addEdge(c1, weight);
            verify(graph);
            double expected = (double)weight + (double)weight;
            check(TraDijkstraExample.search(graph, a).distanceTo(c1) == expected, "Accumulate float weights in double");
            check(TraFloydWarshallExample.search(graph).distance(a, c1) == expected, "No float overflow/underflow in the sum");
        }
        DiGraph decimal = new DiGraph();
        Vertex a = decimal.addVertex("A"), b = decimal.addVertex("B"), c = decimal.addVertex("C");
        a.addEdge(b, 0.1f); b.addEdge(c, 0.2f); a.addEdge(c, 0.3f);
        verify(decimal);
        double representedSum = (double)0.1f + (double)0.2f;
        check(TraDijkstraExample.search(decimal, a).distanceTo(c) == representedSum, "Use stored float values, not ideal decimal literals");
        check(TraFloydWarshallExample.search(decimal).distance(a, c) == representedSum, "Stored fractional path sum");
    }

    public static void main(String[] args) {
        boundaries();
        verify(TraDijkstraExample.createExampleGraph());
        verify(TraFloydWarshallExample.createExampleGraph());
        Random random = new Random(20261120);
        for (int run = 0; run < 340; run++) {
            boolean directed = run >= 200 || run % 2 == 0;
            AbstractGraph graph = directed ? new DiGraph() : new Graph();
            int count = run < 3 ? run : random.nextInt(8);
            List<Vertex> vertices = new ArrayList<>();
            int[] potential = new int[count];
            for (int i = 0; i < count; i++) {
                vertices.add(graph.addVertex("same"));
                potential[i] = random.nextInt(9) - 4;
            }
            for (int i = 0; i < count; i++) {
                for (int j = directed ? 0 : i + 1; j < count; j++) {
                    if (random.nextInt(4) != 0) continue;
                    float weight = random.nextInt(6) * 0.25f;
                    if (run >= 200 && run < 280) weight += (potential[j] - potential[i]) * 0.25f;
                    if (run >= 280) weight = (random.nextInt(9) - 3) * 0.5f;
                    vertices.get(i).addEdge(vertices.get(j), weight);
                }
            }
            verify(graph);
        }
        System.out.println("TRA shortest paths passed: 340 generated graphs, Bellman-Ford, path properties and numerical boundaries");
    }
}
