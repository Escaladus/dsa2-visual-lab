import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** BFS: visit using a queue. Requires traj.jar and Java 11+. */
public class TraSimpleBfs {
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
        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();
            System.out.println(vertex.getLabel());
            for (Vertex next : vertex.neighbors()) {
                if (next.getColor() == WHITE) {
                    next.setColor(GREY); // Discover before enqueueing.
                    queue.offer(next);
                }
            }
            vertex.setColor(BLACK);
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
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        bfs(a);
    }
}
