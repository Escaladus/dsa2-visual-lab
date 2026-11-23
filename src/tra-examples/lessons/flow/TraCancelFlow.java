import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;

/** Flow: cancel an earlier decision. Requires traj.jar and Java 11+. */
public class TraCancelFlow {
    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex x = graph.addVertex("X");
        Edge edge = a.addEdge(x, 1.0f);
        long capacity = (long) edge.getWeight();
        long flow = 1; // One unit was previously sent on A -> X.
        // lesson:start
        long reverseResidual = flow;
        long cancel = 1;
        if (cancel <= reverseResidual) {
            flow -= cancel;
        }
        // lesson:end
        System.out.println("Input X->A exists: " + x.isAdjacent(a));
        System.out.println("Flow after cancellation: " + flow);
        System.out.println("A->X remaining: " + (capacity - flow));
    }
}
