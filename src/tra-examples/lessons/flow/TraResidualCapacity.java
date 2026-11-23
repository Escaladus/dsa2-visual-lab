import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;

/** Flow: remaining capacity. Requires traj.jar and Java 11+. */
public class TraResidualCapacity {
    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex source = graph.addVertex("s");
        Vertex sink = graph.addVertex("t");
        Edge edge = source.addEdge(sink, 5.0f);
        // lesson:start
        long capacity = (long) edge.getWeight(); // This fixture uses the integer capacity 5.
        long flow = 3;
        System.out.println("Forward remaining: " + (capacity - flow));
        System.out.println("Can cancel: " + flow);
        // lesson:end
    }
}
