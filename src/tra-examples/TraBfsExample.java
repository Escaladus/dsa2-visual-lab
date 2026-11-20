import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Unweighted shortest paths using TRA vertices and LinkedQueue. Requires JDK 11+. */
public class TraBfsExample {
    public static final class Result {
        private final Map<Vertex, Integer> distance = new IdentityHashMap<>();
        private final Map<Vertex, Vertex> parent = new IdentityHashMap<>();
        private final List<Vertex> discovered = new ArrayList<>();

        public int distanceTo(Vertex target) {
            return distance.getOrDefault(target, -1);
        }

        public Vertex parentOf(Vertex target) {
            return parent.get(target);
        }

        public List<Vertex> discovered() {
            return Collections.unmodifiableList(discovered);
        }

        public List<Vertex> pathTo(Vertex target) {
            if (distanceTo(target) < 0) {
                return Collections.emptyList();
            }
            List<Vertex> path = new ArrayList<>();
            for (Vertex vertex = target; vertex != null; vertex = parent.get(vertex)) {
                path.add(vertex);
            }
            Collections.reverse(path);
            return path;
        }
    }

    /** Follow outgoing edges from start. Unreachable distances remain -1. */
    public static Result search(AbstractGraph graph, Vertex start) {
        requireStart(graph, start);
        Result result = new Result();
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(AbstractGraph.WHITE);
            result.distance.put(vertex, -1);
        }
        if (start == null) {
            return result; // The graph is empty.
        }

        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        start.setColor(AbstractGraph.GREY);
        result.distance.put(start, 0);
        result.discovered.add(start);
        queue.offer(start);

        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();
            // Removing the vertex from the queue does not finish processing it: still GREY.
            for (Vertex next : vertex.neighbors()) {
                if (next.getColor() == AbstractGraph.WHITE) {
                    next.setColor(AbstractGraph.GREY); // Mark before enqueueing: no duplicates.
                    result.distance.put(next, result.distance.get(vertex) + 1);
                    result.parent.put(next, vertex);
                    result.discovered.add(next);
                    queue.offer(next);
                }
            }
            vertex.setColor(AbstractGraph.BLACK); // All neighbours are now examined.
        }
        return result;
    }

    private static void requireStart(AbstractGraph graph, Vertex start) {
        if (graph.vertexCount() == 0 && start == null) {
            return;
        }
        for (Vertex vertex : graph.vertices()) {
            if (vertex == start) {
                return;
            }
        }
        throw new IllegalArgumentException("Start must belong to the graph");
    }

    private static List<String> labels(List<Vertex> vertices) {
        List<String> labels = new ArrayList<>();
        for (Vertex vertex : vertices) {
            labels.add(vertex.getLabel());
        }
        return labels;
    }

    /** The same A–H undirected graph as the basic BFS drawing. */
    public static Graph createBasicGraph() {
        Graph graph = new Graph();
        String[] names = {"A", "B", "C", "D", "E", "F", "G", "H"};
        Vertex[] vertices = new Vertex[names.length];
        for (int i = 0; i < names.length; i++) {
            vertices[i] = graph.addVertex(names[i]);
        }
        // Endpoint numbers index the explicit names array above.
        int[][] edges = {
            {0, 1}, {0, 2}, {1, 3}, {1, 5}, {2, 3}, {2, 4},
            {3, 4}, {3, 6}, {4, 6}, {5, 6}, {6, 7}
        };
        for (int[] edge : edges) {
            vertices[edge[0]].addEdge(vertices[edge[1]]);
        }
        return graph;
    }

    public static void main(String[] args) {
        Graph graph = createBasicGraph();
        List<Vertex> vertices = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) vertices.add(vertex);
        Result result = search(graph, vertices.get(0));
        System.out.println("Discovered: " + labels(result.discovered()));
        List<Integer> distances = new ArrayList<>();
        for (Vertex vertex : vertices) distances.add(result.distanceTo(vertex));
        System.out.println("Distances: " + distances);
        System.out.println("Path to H: " + labels(result.pathTo(vertices.get(7))));
        // search also supports DiGraph, empty graphs and unreachable targets.
    }
}
