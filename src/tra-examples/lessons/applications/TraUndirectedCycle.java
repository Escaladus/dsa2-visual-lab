import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** Cycle in an undirected graph. Requires traj.jar and Java 11+. */
public class TraUndirectedCycle {
    /**
     * Return true on a cycle reachable in an undirected Graph.
     * Start with WHITE colours and parentEdge null at a root; pass the actual entering Edge below.
     * Changes colours and may stop early; graph edges are unchanged.
     */
    // lesson:start
    static boolean hasCycle(Vertex vertex, Edge parentEdge) {
        vertex.setColor(GREY);
        for (Edge edge : vertex.edges()) {
            if (edge == parentEdge) {
                continue; // The same undirected edge is listed at both endpoints.
            }
            Vertex next = edge.getEndPoint(vertex);
            if (next.getColor() != WHITE || hasCycle(next, edge)) {
                return true;
            }
        }
        vertex.setColor(BLACK);
        return false;
    }
    // lesson:end

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        a.addEdge(b);
        b.addEdge(c);
        c.addEdge(a);
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        boolean cycle = false;
        for (Vertex vertex : graph.vertices()) {
            if (vertex.getColor() == WHITE && hasCycle(vertex, null)) {
                cycle = true;
                break;
            }
        }
        System.out.println("Cycle: " + cycle);
    }
}
