import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;

/** Disjoint sets: are endpoints already connected?. Requires traj.jar and Java 11+. */
public class TraDisjointSets {
    /**
     * Follow a valid parent forest containing every queried Vertex.
     * @return its representative; does not change parent or compress paths
     */
    // lesson:start
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
    // lesson:end

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        Map<Vertex, Vertex> parent = new IdentityHashMap<>();
        for (Vertex vertex : graph.vertices()) {
            parent.put(vertex, vertex);
        }
        System.out.println("Join A-B: " + union(a, b, parent));
        System.out.println("Join B-C: " + union(b, c, parent));
        System.out.println("Join A-C: " + union(a, c, parent));
    }
}
