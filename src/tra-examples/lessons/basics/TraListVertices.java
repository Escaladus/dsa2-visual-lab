import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;

/** Visit every vertex. Requires traj.jar and Java 11+. */
public class TraListVertices {
    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        graph.addVertex("C"); // C is isolated.
        a.addEdge(b);
        // lesson:start
        for (Vertex vertex : graph.vertices()) {
            System.out.println(vertex.getLabel());
        }
        // lesson:end
    }
}
