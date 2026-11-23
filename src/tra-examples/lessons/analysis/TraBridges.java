import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Bridge: can the child subtree get back?. Requires traj.jar and Java 11+. */
public class TraBridges {
    static int clock;
    static Map<Vertex, Integer> tin = new IdentityHashMap<>();
    static Map<Vertex, Integer> low = new IdentityHashMap<>();
    static List<Edge> bridges = new ArrayList<>();

    /**
     * Compute tin/low and collect actual bridge Edge objects in an undirected Graph.
     * Reset clock and clear maps/bridges before the outer root loop; parentEdge is null at roots.
     * Only auxiliary state is changed; skip the identical physical parent Edge.
     */
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
                // lesson:start
                if (low.get(next) > tin.get(vertex)) {
                    bridges.add(edge); // No route back to this vertex or its ancestors.
                }
                // lesson:end
            } else {
                low.put(vertex, Math.min(low.get(vertex), tin.get(next)));
            }
        }
    }

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
        bridges.clear();
        for (Vertex vertex : graph.vertices()) {
            if (!tin.containsKey(vertex)) {
                visit(vertex, null);
            }
        }
        for (Edge edge : bridges) {
            System.out.println("Bridge: " + edge.getStartPoint().getLabel() + "-" + edge.getEndPoint().getLabel());
        }
    }
}
