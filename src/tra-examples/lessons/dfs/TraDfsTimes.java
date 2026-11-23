import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** DFS: entry and exit times. Requires traj.jar and Java 11+. */
public class TraDfsTimes {
    static int clock;
    static Map<Vertex, Integer> tin = new IdentityHashMap<>();
    static Map<Vertex, Integer> tout = new IdentityHashMap<>();

    /**
     * Record entry/exit events of directed or undirected DFS from a non-null vertex.
     * Before the outer traversal, clear tin/tout, set clock to zero and colours to WHITE.
     * Updates the clock, maps and reached colours; preserves graph structure.
     */
    // lesson:start
    static void dfs(Vertex vertex) {
        vertex.setColor(GREY);
        tin.put(vertex, ++clock);
        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == WHITE) {
                dfs(next);
            }
        }
        tout.put(vertex, ++clock);
        vertex.setColor(BLACK);
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
        clock = 0;
        tin.clear();
        tout.clear();
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        dfs(a);
        for (Vertex vertex : graph.vertices()) {
            System.out.println(vertex.getLabel() + ": " + tin.get(vertex) + ".." + tout.get(vertex));
        }
    }
}
