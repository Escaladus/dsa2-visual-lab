import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** Cycle in a directed graph. Requires traj.jar and Java 11+. */
public class TraDirectedCycle {
    /**
     * Return true on a cycle reachable from this vertex in a directed graph.
     * Initialise all colours to WHITE before the outer root loop.
     * Changes colours; an early true result may leave active vertices GREY.
     */
    // lesson:start
    static boolean hasCycle(Vertex vertex) {
        vertex.setColor(GREY);
        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == GREY) {
                return true; // Edge to an active ancestor, including a self-loop.
            }
            if (next.getColor() == WHITE && hasCycle(next)) {
                return true;
            }
        }
        vertex.setColor(BLACK);
        return false;
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
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        boolean cycle = false;
        for (Vertex vertex : graph.vertices()) {
            if (vertex.getColor() == WHITE && hasCycle(vertex)) {
                cycle = true;
                break;
            }
        }
        System.out.println("Cycle: " + cycle);
    }
}
