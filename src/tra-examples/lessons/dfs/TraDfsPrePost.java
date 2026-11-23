import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;

/** DFS: entry and return (PRE / POST). Requires traj.jar and Java 11+. */
public class TraDfsPrePost {
    /**
     * Print PRE on entry and POST after all recursive children have returned.
     * Before the first call, visited must contain every graph vertex with value false.
     * Updates visited only; each call resumes its own neighbour loop after a child.
     */
    // lesson:start
    static void dfs(Vertex vertex, Map<Vertex, Boolean> visited) {
        // Mark first: following a cycle must not visit this vertex again.
        visited.put(vertex, true);
        System.out.println("PRE " + vertex.getLabel());
        for (Vertex next : vertex.neighbors()) {
            if (!visited.get(next)) {
                dfs(next, visited);
            }
        }
        // All child calls have returned; this call can now finish.
        System.out.println("POST " + vertex.getLabel());
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
