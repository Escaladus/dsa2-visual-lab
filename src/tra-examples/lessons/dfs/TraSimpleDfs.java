import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;

/** Recursive DFS: visit a vertex. Requires traj.jar and Java 11+. */
public class TraSimpleDfs {
    /**
     * Print the reachable vertices once, starting from a non-null vertex.
     * Before the first call, visited must contain every graph vertex with value false.
     * Updates visited; leaves graph structure and Vertex colours unchanged.
     */
    // lesson:start
    static void dfs(Vertex vertex, Map<Vertex, Boolean> visited) {
        // Mark first: following a cycle must not visit this vertex again.
        visited.put(vertex, true);
        System.out.println(vertex.getLabel());
        for (Vertex next : vertex.neighbors()) {
            if (!visited.get(next)) {
                dfs(next, visited); // Return here, then examine the next neighbour.
            }
        }
    }
    // lesson:end

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        Vertex d = graph.addVertex("D");
        a.addEdge(b);
        a.addEdge(c);
        b.addEdge(d);
        Map<Vertex, Boolean> visited = new IdentityHashMap<>();
        for (Vertex vertex : graph.vertices()) {
            visited.put(vertex, false);
        }
        dfs(a, visited);
    }
}
