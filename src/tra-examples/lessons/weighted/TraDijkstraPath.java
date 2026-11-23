import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Dijkstra: remember the improved path. Requires traj.jar and Java 11+. */
public class TraDijkstraPath {
    /**
     * Compute distances and parents from a non-null start belonging to graph.
     * Reject non-finite/negative weights; clear and refill the supplied parent map.
     * @return a new distance map with Infinity for unreachable vertices; graph is unchanged
     */
    static Map<Vertex, Double> dijkstra(DiGraph graph, Vertex start, Map<Vertex, Vertex> parent) {
        Map<Vertex, Double> distance = new IdentityHashMap<>();
        Set<Vertex> done = Collections.newSetFromMap(new IdentityHashMap<>());
        for (Vertex vertex : graph.vertices()) {
            distance.put(vertex, Double.POSITIVE_INFINITY);
            for (Edge edge : vertex.edges()) {
                if (!Float.isFinite(edge.getWeight()) || edge.getWeight() < 0) {
                    throw new IllegalArgumentException("Use finite nonnegative weights");
                }
            }
        }
        parent.clear();
        parent.put(start, null);
        distance.put(start, 0.0);
        while (true) {
            Vertex best = null;
            for (Vertex vertex : graph.vertices()) {
                if (!done.contains(vertex)
                        && (best == null || distance.get(vertex) < distance.get(best))) {
                    best = vertex;
                }
            }
            if (best == null || !Double.isFinite(distance.get(best))) {
                break; // No more reachable vertices.
            }
            done.add(best);
            for (Edge edge : best.edges()) {
                Vertex next = edge.getEndPoint(best);
                double candidate = distance.get(best) + edge.getWeight();
                // lesson:start
                if (candidate < distance.get(next)) {
                    distance.put(next, candidate);
                    parent.put(next, best);
                }
                // lesson:end
            }
        }
        return distance;
    }

    /**
     * Read an acyclic parent map produced by the preceding traversal.
     * @return labels from its start to target, or an empty list if target has no entry
     * The parent map and graph are unchanged; labels are for display, not vertex identity.
     */
    static List<String> pathTo(Vertex target, Map<Vertex, Vertex> parent) {
        List<String> path = new ArrayList<>();
        if (!parent.containsKey(target)) {
            return path; // Unreachable: do not invent a path.
        }
        for (Vertex vertex = target; vertex != null; vertex = parent.get(vertex)) {
            path.add(vertex.getLabel());
        }
        Collections.reverse(path);
        return path;
    }

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        Vertex d = graph.addVertex("D");
        a.addEdge(b, 5.0f);
        a.addEdge(c, 1.0f);
        c.addEdge(b, 2.0f);
        Map<Vertex, Vertex> parent = new IdentityHashMap<>();
        dijkstra(graph, a, parent);
        System.out.println("Path to B: " + pathTo(b, parent));
        System.out.println("Path to D: " + pathTo(d, parent));
    }
}
