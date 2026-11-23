import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;

/** DFS: what tin and low mean. Requires traj.jar and Java 11+. */
public class TraLowValues {
    static int clock;
    static Map<Vertex, Integer> tin = new IdentityHashMap<>();
    static Map<Vertex, Integer> low = new IdentityHashMap<>();

    /**
     * Compute tin/low in an undirected Graph; parentEdge is the actual entering Edge or null.
     * Reset clock and clear maps before the outer root loop; continue only from unseen roots.
     * Updates only clock and maps; graph structure and fields are unchanged.
     */
    // lesson:start
    static void visit(Vertex vertex, Edge parentEdge) {
        tin.put(vertex, ++clock);
        low.put(vertex, clock);
        for (Edge edge : vertex.edges()) {
            if (edge == parentEdge) {
                continue;
            }
            Vertex next = edge.getEndPoint(vertex);
            if (!tin.containsKey(next)) {
                visit(next, edge);
                low.put(vertex, Math.min(low.get(vertex), low.get(next)));
            } else {
                low.put(vertex, Math.min(low.get(vertex), tin.get(next)));
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
        graph.addVertex("E");
        a.addEdge(b);
        b.addEdge(c);
        c.addEdge(a);
        c.addEdge(d);
        clock = 0;
        tin.clear();
        low.clear();
        for (Vertex vertex : graph.vertices()) {
            if (!tin.containsKey(vertex)) {
                visit(vertex, null);
            }
        }
        for (Vertex vertex : graph.vertices()) {
            System.out.println(vertex.getLabel() + ": tin=" + tin.get(vertex) + ", low=" + low.get(vertex));
        }
    }
}
