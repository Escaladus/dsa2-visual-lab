import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.Map;
import java.util.Set;

/** Dijkstra: distances with nonnegative weights. Requires traj.jar and Java 11+. */
public class TraDijkstraDistances {
    /**
     * Compute weighted distances; start must be a non-null vertex of graph.
     * All edge weights must be finite and nonnegative; invalid weights are rejected.
     * @return a new map, including Infinity for unreachable vertices; graph is unchanged
     */
    // lesson:start
    static Map<Vertex, Double> dijkstra(DiGraph graph, Vertex start) {
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
                if (candidate < distance.get(next)) {
                    distance.put(next, candidate);
                }
            }
        }
        return distance;
    }
    // lesson:end

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        graph.addVertex("D");
        a.addEdge(b, 5.0f);
        a.addEdge(c, 1.0f);
        c.addEdge(b, 2.0f);
        Map<Vertex, Double> distance = dijkstra(graph, a);
        for (Vertex vertex : graph.vertices()) {
            System.out.println(vertex.getLabel() + ": " + distance.get(vertex));
        }
    }
}
