import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;

/** Read an edge weight. Requires traj.jar and Java 11+. */
public class TraReadEdgeWeight {
    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        // lesson:start
        Edge edge = a.addEdge(b, 5.0f);
        System.out.println("From: " + edge.getStartPoint().getLabel());
        System.out.println("To: " + edge.getEndPoint().getLabel());
        System.out.println("Weight: " + edge.getWeight());
        // lesson:end
    }
}
