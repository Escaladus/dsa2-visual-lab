import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** BFS: discover a shared neighbour only once. Requires traj.jar and Java 11+. */
public class TraBfsDiscovery {
    /**
     * Print the reachable vertices in BFS removal order from a non-null start.
     * Initialise all vertex colours to WHITE before this call.
     * Changes reached colours to GREY/BLACK; preserves graph structure and weights.
     */
    // lesson:start
    static void bfs(Vertex start) {
        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        start.setColor(GREY);
        queue.offer(start);
        System.out.println("Add " + start.getLabel());
        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();
            System.out.println("Take " + vertex.getLabel());
            for (Vertex next : vertex.neighbors()) {
                if (next.getColor() == WHITE) {
                    next.setColor(GREY); // Discover before enqueueing.
                    queue.offer(next);
                    System.out.println("Add " + next.getLabel());
                } else {
                    System.out.println("Skip " + next.getLabel() + ": already discovered");
                }
            }
            vertex.setColor(BLACK);
        }
    }
    // lesson:end

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        Vertex d = graph.addVertex("D");
        a.addEdge(b);
        a.addEdge(c);
        b.addEdge(d);
        c.addEdge(d);
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        bfs(a);
    }
}
