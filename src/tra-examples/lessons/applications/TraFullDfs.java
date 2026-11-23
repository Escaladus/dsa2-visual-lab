import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** DFS: continue in another component. Requires traj.jar and Java 11+. */
public class TraFullDfs {
    /**
     * Visit and print the WHITE region of this root, changing its colours to BLACK.
     * Initialise all graph colours to WHITE once, before the outer root loop.
     * Graph structure is unchanged; a new WHITE root starts another undirected component.
     */
    static void dfs(Vertex vertex) {
        vertex.setColor(GREY);
        System.out.println(vertex.getLabel());
        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == WHITE) {
                dfs(next);
            }
        }
        vertex.setColor(BLACK);
    }

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        graph.addVertex("C");
        Vertex d = graph.addVertex("D");
        Vertex e = graph.addVertex("E");
        a.addEdge(b);
        d.addEdge(e);
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        // lesson:start
        int components = 0;
        for (Vertex vertex : graph.vertices()) {
            if (vertex.getColor() == WHITE) {
                components++;
                System.out.println("Component " + components);
                dfs(vertex);
            }
        }
        // lesson:end
        System.out.println("Components: " + components);
    }
}
