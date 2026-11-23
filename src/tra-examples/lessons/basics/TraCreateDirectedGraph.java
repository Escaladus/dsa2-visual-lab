import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;

/** Create a directed graph. Requires traj.jar and Java 11+. */
public class TraCreateDirectedGraph {
    public static void main(String[] args) {
        // lesson:start
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        a.addEdge(b);
        System.out.println("A -> B: " + a.isAdjacent(b));
        System.out.println("B -> A: " + b.isAdjacent(a));
        // lesson:end
    }
}
