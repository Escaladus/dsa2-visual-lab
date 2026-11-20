import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** All-pairs shortest paths; the matrix is derived from TRA, not a replacement graph. JDK 11+. */
public class TraFloydWarshallExample {
    public static final class Result {
        private final List<Vertex> vertices;
        private final Map<Vertex, Integer> index = new IdentityHashMap<>();
        private final double[][] distance;
        private final int[][] next;

        private Result(AbstractGraph graph) {
            List<Vertex> ordered = new ArrayList<>();
            for (Vertex vertex : graph.vertices()) {
                index.put(vertex, ordered.size());
                ordered.add(vertex);
            }
            vertices = List.copyOf(ordered);
            int n = vertices.size();
            distance = new double[n][n];
            next = new int[n][n];
            for (int i = 0; i < n; i++) {
                Arrays.fill(distance[i], Double.POSITIVE_INFINITY);
                Arrays.fill(next[i], -1);
                distance[i][i] = 0.0; // The empty path costs zero, even with a positive self-loop.
                next[i][i] = i;
            }
            for (int i = 0; i < n; i++) {
                Vertex from = vertices.get(i);
                for (Edge edge : from.edges()) {
                    float weight = edge.getWeight();
                    if (!Float.isFinite(weight)) throw new IllegalArgumentException("non-finite weight");
                    int j = index.get(edge.getEndPoint(from));
                    if (weight < distance[i][j]) {
                        distance[i][j] = weight;
                        next[i][j] = j;
                    }
                }
            }
        }

        public List<Vertex> vertices() { return vertices; }

        private int indexOf(Vertex vertex) {
            Integer i = index.get(vertex);
            if (i == null) throw new IllegalArgumentException("Foreign vertex");
            return i;
        }

        public double distance(Vertex from, Vertex to) {
            return distance[indexOf(from)][indexOf(to)];
        }

        /** Empty list = unreachable; a vertex to itself is a one-vertex, zero-edge path. */
        public List<Vertex> path(Vertex from, Vertex to) {
            int i = indexOf(from);
            int j = indexOf(to);
            if (next[i][j] == -1) return List.of();
            List<Vertex> path = new ArrayList<>();
            path.add(vertices.get(i));
            while (i != j) {
                i = next[i][j];
                path.add(vertices.get(i));
            }
            return path;
        }
    }

    /**
     * Finite float edge weights are accumulated in double; negative edges are allowed.
     * Any negative cycle rejects the whole result, even in a disconnected part.
     * The input is untouched, and earlier results survive later runs.
     */
    public static Result search(AbstractGraph graph) {
        Result result = new Result(graph);
        int n = result.vertices.size();
        rejectNegativeCycle(result.distance); // Includes a negative self-loop at input.
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                if (Double.isInfinite(result.distance[i][k])) continue;
                for (int j = 0; j < n; j++) {
                    if (Double.isInfinite(result.distance[k][j])) continue;
                    double candidate = result.distance[i][k] + result.distance[k][j];
                    if (candidate < result.distance[i][j]) {
                        result.distance[i][j] = candidate;
                        result.next[i][j] = result.next[i][k];
                    }
                }
            }
            rejectNegativeCycle(result.distance); // Do not publish a partial distance matrix.
        }
        return result;
    }

    private static void rejectNegativeCycle(double[][] distance) {
        for (int v = 0; v < distance.length; v++) {
            if (distance[v][v] < 0) throw new IllegalArgumentException("negative cycle");
        }
    }

    /** A→B:5, B→C:-2, A→C:10; D is isolated. Shortest A→C has weight 3. */
    public static DiGraph createExampleGraph() {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        graph.addVertex("D");
        a.addEdge(b, 5.0f);
        b.addEdge(c, -2.0f);
        a.addEdge(c, 10.0f);
        return graph;
    }

    private static List<String> labels(List<Vertex> path) {
        List<String> names = new ArrayList<>();
        for (Vertex vertex : path) names.add(vertex.getLabel());
        return names;
    }

    public static void main(String[] args) {
        DiGraph graph = createExampleGraph();
        Result result = search(graph);
        List<Vertex> vertices = result.vertices();
        System.out.println("Matrix order: " + labels(vertices));
        for (Vertex from : vertices) {
            List<String> row = new ArrayList<>();
            for (Vertex to : vertices) {
                double value = result.distance(from, to);
                row.add(Double.isInfinite(value) ? "INF" : Double.toString(value));
            }
            System.out.println(row);
        }
        System.out.println("Path A to C: " + labels(result.path(vertices.get(0), vertices.get(2))));
        System.out.println("Path C to A: " + labels(result.path(vertices.get(2), vertices.get(0))));
        System.out.println("Path D to D: " + labels(result.path(vertices.get(3), vertices.get(3))));
        vertices.get(2).addEdge(vertices.get(0), -4.0f); // A→B→C→A totals -1.
        try {
            search(graph);
        } catch (IllegalArgumentException error) {
            System.out.println("Rejected: " + error.getMessage());
        }
    }
}
