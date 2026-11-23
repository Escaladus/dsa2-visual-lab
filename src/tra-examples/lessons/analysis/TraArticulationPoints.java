import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.Map;
import java.util.Set;

/** Articulation point: what if the vertex disappears?. Requires traj.jar and Java 11+. */
public class TraArticulationPoints {
    static int clock;
    static Map<Vertex, Integer> tin = new IdentityHashMap<>();
    static Map<Vertex, Integer> low = new IdentityHashMap<>();
    static Set<Vertex> cuts = Collections.newSetFromMap(new IdentityHashMap<>());

    /**
     * Compute tin/low and collect articulation vertices of an undirected Graph.
     * Reset clock and clear maps/cuts before the outer root loop; parentEdge is null at roots.
     * Only auxiliary state is changed; roots use their number of DFS children.
     */
    // lesson:start
    static void visit(Vertex vertex, Edge parentEdge) {
        tin.put(vertex, ++clock);
        low.put(vertex, clock);
        int children = 0;
        for (Edge edge : vertex.edges()) {
            if (edge == parentEdge) {
                continue;
            }
            Vertex next = edge.getEndPoint(vertex);
            if (!tin.containsKey(next)) {
                children++;
                visit(next, edge);
                low.put(vertex, Math.min(low.get(vertex), low.get(next)));
                if (parentEdge != null && low.get(next) >= tin.get(vertex)) {
                    cuts.add(vertex);
                }
            } else {
                low.put(vertex, Math.min(low.get(vertex), tin.get(next)));
            }
        }
        if (parentEdge == null && children >= 2) {
            cuts.add(vertex); // Root has a different rule: count DFS children, not degree.
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
        cuts.clear();
        for (Vertex vertex : graph.vertices()) {
            if (!tin.containsKey(vertex)) {
                visit(vertex, null);
            }
        }
        for (Vertex vertex : graph.vertices()) {
            if (cuts.contains(vertex)) {
                System.out.println("Articulation: " + vertex.getLabel());
            }
        }
    }
}
