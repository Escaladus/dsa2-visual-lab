import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Kruskal: accept edges without creating cycles. Requires traj.jar and Java 11+. */
public class TraKruskal {
    /**
     * Follow a valid parent forest containing every queried Vertex.
     * @return its representative; does not change parent or compress paths
     */
    static Vertex find(Vertex vertex, Map<Vertex, Vertex> parent) {
        while (parent.get(vertex) != vertex) {
            vertex = parent.get(vertex);
        }
        return vertex;
    }

    /**
     * Join the two sets in a valid parent forest; changes parent only when roots differ.
     * @return true for a join, false if the two vertices were already connected
     */
    static boolean union(Vertex a, Vertex b, Map<Vertex, Vertex> parent) {
        Vertex rootA = find(a, parent);
        Vertex rootB = find(b, parent);
        if (rootA == rootB) {
            return false; // Already connected: adding this edge would form a cycle.
        }
        parent.put(rootA, rootB);
        return true;
    }

    /**
     * Find a minimum spanning forest of an undirected Graph with finite weights.
     * @return a new list of actual Edge objects; input graph fields stay unchanged
     * Uses the preceding simple DSU, without rank or path compression.
     */
    // lesson:start
    static List<Edge> kruskal(Graph graph) {
        Map<Vertex, Vertex> parent = new IdentityHashMap<>();
        for (Vertex vertex : graph.vertices()) {
            parent.put(vertex, vertex);
        }
        List<Edge> edges = new ArrayList<>();
        for (Edge edge : graph.edges()) {
            edges.add(edge);
        }
        edges.sort(Comparator.comparingDouble(Edge::getWeight));
        List<Edge> chosen = new ArrayList<>();
        for (Edge edge : edges) {
            if (union(edge.getStartPoint(), edge.getEndPoint(), parent)) {
                chosen.add(edge);
            }
        }
        return chosen;
    }
    // lesson:end

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        a.addEdge(b, 1.0f);
        a.addEdge(c, 4.0f);
        b.addEdge(c, 2.0f);
        for (Edge edge : kruskal(graph)) {
            System.out.println(edge.getStartPoint().getLabel() + "-" + edge.getEndPoint().getLabel());
        }
    }
}
