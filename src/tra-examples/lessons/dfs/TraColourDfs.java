import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** DFS with WHITE, GREY and BLACK. Requires traj.jar and Java 11+. */
public class TraColourDfs {
    /**
     * Visit the reachable part from a non-null vertex; initialise all colours to WHITE first.
     * Print discovery/completion and change reached vertices from GREY to BLACK.
     * Does not change graph structure, labels or weights.
     */
    // lesson:start
    static void dfs(Vertex vertex) {
        vertex.setColor(GREY);
        System.out.println(vertex.getLabel() + " GREY");
        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == WHITE) {
                dfs(next);
            }
        }
        // Leaving this call: every neighbour has been considered.
        vertex.setColor(BLACK);
        System.out.println(vertex.getLabel() + " BLACK");
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
        dfs(a);
    }
}
