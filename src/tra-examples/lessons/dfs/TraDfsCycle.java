import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;

/** DFS: stop a cycle using discovery marks. Requires traj.jar and Java 11+. */
public class TraDfsCycle {
    /**
     * Print the reachable vertices once, starting from a non-null vertex.
     * Before the first call, visited must contain every graph vertex with value false.
     * Updates visited; leaves graph structure and Vertex colours unchanged.
     */
    // lesson:start
    static void dfs(Vertex vertex, Map<Vertex, Boolean> visited) {
        // Mark first: following a cycle must not visit this vertex again.
        visited.put(vertex, true);
        System.out.println("Visit " + vertex.getLabel());
        for (Vertex next : vertex.neighbors()) {
            if (visited.get(next)) {
                System.out.println("Skip " + next.getLabel() + ": already visited");
            } else {
                dfs(next, visited);
            }
        }
    }
    // lesson:end

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        a.addEdge(b);
        b.addEdge(c);
        c.addEdge(a);
        Map<Vertex, Boolean> visited = new IdentityHashMap<>();
        for (Vertex vertex : graph.vertices()) {
            visited.put(vertex, false);
        }
        dfs(a, visited);
    }
}
