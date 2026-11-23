import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** DAG: reverse the POST order. Requires traj.jar and Java 11+. */
public class TraTopologicalOrder {
    /**
     * Append completion labels to post; throw on a directed GREY back edge.
     * Start with WHITE colours and an empty post list, and visit all remaining roots.
     * Reverse post only after a successful full traversal; colours and post are modified.
     */
    // lesson:start
    static void visit(Vertex vertex, List<String> post) {
        vertex.setColor(GREY);
        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == GREY) {
                throw new IllegalArgumentException("Cycle: no topological order");
            }
            if (next.getColor() == WHITE) {
                visit(next, post);
            }
        }
        vertex.setColor(BLACK);
        post.add(vertex.getLabel());
    }
    // lesson:end

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        a.addEdge(b);
        a.addEdge(c);
        b.addEdge(c);
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        List<String> post = new ArrayList<>();
        try {
            for (Vertex vertex : graph.vertices()) {
                if (vertex.getColor() == WHITE) {
                    visit(vertex, post);
                }
            }
            Collections.reverse(post);
            System.out.println("Order: " + post);
        } catch (IllegalArgumentException error) {
            System.out.println(error.getMessage());
        }
    }
}
