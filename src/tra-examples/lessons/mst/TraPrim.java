import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.PriorityQueue;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** Prim: grow one tree. Requires traj.jar and Java 11+. */
public class TraPrim {
    /**
     * Mark one new vertex BLACK and enqueue its edges to WHITE endpoints.
     * Called only for an unreached vertex; finite edge weights stay fixed while queued.
     * Changes colours and queue; preserves graph edges and weights.
     */
    static void addBoundary(Vertex vertex, PriorityQueue<Edge> queue) {
        vertex.setColor(BLACK);
        for (Edge edge : vertex.edges()) {
            if (edge.getEndPoint(vertex).getColor() == WHITE) {
                queue.offer(edge);
            }
        }
    }

    /**
     * Find a minimum spanning forest of an undirected Graph with finite fixed weights.
     * @return a new list of actual input Edge objects; isolated vertices add no edge
     * Resets and changes vertex colours; leaves topology, labels and weights intact.
     */
    static List<Edge> prim(Graph graph) {
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        List<Edge> chosen = new ArrayList<>();
        PriorityQueue<Edge> queue = new PriorityQueue<>(
                11, Comparator.comparingDouble(Edge::getWeight));
        for (Vertex root : graph.vertices()) {
            if (root.getColor() == BLACK) {
                continue;
            }
            addBoundary(root, queue);
            // lesson:start
            while (!queue.isEmpty()) {
                Edge edge = queue.poll();
                Vertex a = edge.getStartPoint();
                Vertex b = edge.getEndPoint();
                if (a.getColor() == BLACK && b.getColor() == BLACK) {
                    continue; // Both endpoints are already in the tree.
                }
                chosen.add(edge);
                addBoundary(a.getColor() == WHITE ? a : b, queue);
            }
            // lesson:end
        }
        return chosen;
    }

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        a.addEdge(b, 1.0f);
        a.addEdge(c, 4.0f);
        b.addEdge(c, 2.0f);
        for (Edge edge : prim(graph)) {
            System.out.println(edge.getStartPoint().getLabel() + "-" + edge.getEndPoint().getLabel());
        }
    }
}
