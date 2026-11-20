import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.PriorityQueue;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** One-source shortest paths over real TRA edges. Requires JDK 11+. */
public class TraDijkstraExample {
    // Never change a queued priority: insert a fresh entry when a better route is found.
    private static final class QueueEntry {
        final Vertex vertex;
        final double distance;

        QueueEntry(Vertex vertex, double distance) {
            this.vertex = vertex;
            this.distance = distance;
        }
    }

    public static final class Result {
        private final List<Vertex> vertices;
        private final Map<Vertex, Double> distance = new IdentityHashMap<>();
        private final Map<Vertex, Vertex> parent = new IdentityHashMap<>();

        private Result(AbstractGraph graph) {
            List<Vertex> ordered = new ArrayList<>();
            for (Vertex vertex : graph.vertices()) {
                ordered.add(vertex);
                distance.put(vertex, Double.POSITIVE_INFINITY);
            }
            vertices = List.copyOf(ordered);
        }

        public List<Vertex> vertices() { return vertices; }

        /** Positive infinity means unreachable. A foreign/null target is an input error. */
        public double distanceTo(Vertex target) {
            if (!distance.containsKey(target)) throw new IllegalArgumentException("Foreign target");
            return distance.get(target);
        }

        /** Any minimum-weight parent path is valid; ties need not choose the same route. */
        public List<Vertex> pathTo(Vertex target) {
            if (Double.isInfinite(distanceTo(target))) return List.of();
            List<Vertex> path = new ArrayList<>();
            for (Vertex vertex = target; vertex != null; vertex = parent.get(vertex)) path.add(vertex);
            Collections.reverse(path);
            return path;
        }
    }

    /**
     * Graph or DiGraph; finite non-negative edge weights only, including unreachable edges.
     * A nonempty graph requires a member start; an empty graph accepts null.
     * Vertex colours/index/weight, edges and labels are left intact. Each result owns its maps.
     */
    public static Result search(AbstractGraph graph, Vertex start) {
        Result result = new Result(graph);
        if (!(result.vertices.isEmpty() && start == null) && !result.distance.containsKey(start)) {
            throw new IllegalArgumentException("Start must belong to the graph");
        }
        for (Edge edge : graph.edges()) {
            float weight = edge.getWeight();
            if (!Float.isFinite(weight)) throw new IllegalArgumentException("non-finite weight");
            if (weight < 0) throw new IllegalArgumentException("negative weight");
        }
        if (start == null) return result;

        PriorityQueue<QueueEntry> queue = new PriorityQueue<>(
                11, Comparator.comparingDouble(entry -> entry.distance));
        result.distance.put(start, 0.0);
        queue.offer(new QueueEntry(start, 0.0));
        while (!queue.isEmpty()) {
            QueueEntry current = queue.poll();
            Vertex vertex = current.vertex;
            if (current.distance != result.distance.get(vertex)) continue; // Stale entry.
            for (Edge edge : vertex.edges()) { // In DiGraph these are outgoing edges only.
                Vertex next = edge.getEndPoint(vertex);
                double candidate = current.distance + (double)edge.getWeight();
                if (candidate < result.distance.get(next)) {
                    result.distance.put(next, candidate);
                    result.parent.put(next, vertex);
                    queue.offer(new QueueEntry(next, candidate));
                }
            }
        }
        return result;
    }

    /** A→B:10, A→C:1, C→B:2, C→D:8, B→D:1; E is isolated. */
    public static DiGraph createExampleGraph() {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        Vertex d = graph.addVertex("D");
        graph.addVertex("E");
        a.addEdge(b, 10.0f); // A float selects weight; an int would select colour in TRA.
        a.addEdge(c, 1.0f);
        c.addEdge(b, 2.0f);
        c.addEdge(d, 8.0f);
        b.addEdge(d, 1.0f);
        return graph;
    }

    private static List<String> labels(List<Vertex> path) {
        List<String> names = new ArrayList<>();
        for (Vertex vertex : path) names.add(vertex.getLabel());
        return names;
    }

    public static void main(String[] args) {
        DiGraph graph = createExampleGraph();
        List<Vertex> vertices = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) vertices.add(vertex);
        Result result = search(graph, vertices.get(0));
        List<String> distances = new ArrayList<>();
        for (Vertex vertex : result.vertices()) {
            double value = result.distanceTo(vertex);
            distances.add(Double.isInfinite(value) ? "INF" : Double.toString(value));
        }
        System.out.println("Distances from A: " + distances);
        System.out.println("Path to D: " + labels(result.pathTo(vertices.get(3))));
        System.out.println("Path to A: " + labels(result.pathTo(vertices.get(0))));
        System.out.println("Path to E: " + labels(result.pathTo(vertices.get(4))));
        // Even a negative edge in the unreachable part violates this method's contract.
        vertices.get(4).addEdge(vertices.get(0), -1.0f);
        try {
            search(graph, vertices.get(0));
        } catch (IllegalArgumentException error) {
            System.out.println("Rejected: " + error.getMessage());
        }
    }
}
