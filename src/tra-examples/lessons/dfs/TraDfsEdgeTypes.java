import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;
import static fi.uef.cs.tra.AbstractGraph.BLACK;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.WHITE;

/** Directed DFS: classify one edge. Requires traj.jar and Java 11+. */
public class TraDfsEdgeTypes {
    static int clock;
    static Map<Vertex, Integer> tin = new IdentityHashMap<>();

    /**
     * Classify outgoing edges during directed DFS from a non-null vertex.
     * Clear tin, reset clock and initialise every colour to WHITE before the first call.
     * Updates tin, clock and colours; prints edge types without changing graph edges.
     */
    static void dfs(Vertex vertex) {
        vertex.setColor(GREY);
        tin.put(vertex, ++clock);
        for (Vertex next : vertex.neighbors()) {
            // lesson:start
            String type;
            if (next.getColor() == WHITE) {
                type = "tree";
            } else if (next.getColor() == GREY) {
                type = "back";
            } else if (tin.get(vertex) < tin.get(next)) {
                type = "forward";
            } else {
                type = "cross";
            }
            // lesson:end
            System.out.println(vertex.getLabel() + "->" + next.getLabel() + " " + type);
            if (next.getColor() == WHITE) {
                dfs(next);
            }
        }
        vertex.setColor(BLACK);
    }

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("0");
        Vertex b = graph.addVertex("1");
        Vertex c = graph.addVertex("2");
        Vertex d = graph.addVertex("3");
        a.addEdge(b);
        a.addEdge(c);
        a.addEdge(d);
        b.addEdge(c);
        c.addEdge(a);
        d.addEdge(c);
        clock = 0;
        tin.clear();
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(WHITE);
        }
        dfs(a);
    }
}
