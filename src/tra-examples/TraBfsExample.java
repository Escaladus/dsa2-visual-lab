import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
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

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex[] vertices = new Vertex[5];
        for (int i = 0; i < vertices.length; i++) {
            vertices[i] = graph.addVertex(String.valueOf(i));
        }
        vertices[0].addEdge(vertices[1]);
        vertices[0].addEdge(vertices[2]);
        vertices[0].addEdge(vertices[3]);
        vertices[1].addEdge(vertices[2]);
        vertices[2].addEdge(vertices[0]);
        vertices[3].addEdge(vertices[2]);

        Result result = search(graph, vertices[0]);
        System.out.println("Discovered: " + labels(result.discovered()));
        List<Integer> distances = new ArrayList<>();
        for (Vertex vertex : vertices) {
            distances.add(result.distanceTo(vertex));
        }
        System.out.println("Distances: " + distances);
        System.out.println("Path to 2: " + labels(result.pathTo(vertices[2])));
        System.out.println("Path to 4: " + labels(result.pathTo(vertices[4])));
        System.out.println("isolated WHITE: " + (vertices[4].getColor() == AbstractGraph.WHITE));
    }
}
