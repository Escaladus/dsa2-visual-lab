import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;

/** Flow: augment one known path. Requires traj.jar and Java 11+. */
public class TraAugmentFlow {
    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex s = graph.addVertex("s");
        Vertex a = graph.addVertex("A");
        Vertex t = graph.addVertex("t");
        Edge first = s.addEdge(a, 3.0f);
        Edge second = a.addEdge(t, 2.0f);
        long[][] residual = new long[3][3];
        residual[0][1] = (long) first.getWeight();
        residual[1][2] = (long) second.getWeight();
        // lesson:start
        int[] path = {0, 1, 2};
        long amount = Math.min(residual[0][1], residual[1][2]);
        for (int i = 0; i + 1 < path.length; i++) {
            int from = path[i];
            int to = path[i + 1];
            residual[from][to] -= amount;
            residual[to][from] += amount;
        }
        // lesson:end
        System.out.println("Sent: " + amount);
        System.out.println("s->A remaining: " + residual[0][1]);
        System.out.println("A->s cancellation: " + residual[1][0]);
    }
}
