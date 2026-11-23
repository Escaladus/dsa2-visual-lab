import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;

/** Visit one vertex’s neighbours. Requires traj.jar and Java 11+. */
public class TraListNeighbors {
    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        Vertex d = graph.addVertex("D");
        a.addEdge(b);
        a.addEdge(c);
        d.addEdge(a);
        // lesson:start
        for (Vertex next : a.neighbors()) {
            System.out.println(next.getLabel());
        }
        // lesson:end
    }
}
