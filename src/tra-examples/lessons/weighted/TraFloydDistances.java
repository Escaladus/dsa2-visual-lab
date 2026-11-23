import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Floyd: try one intermediate vertex. Requires traj.jar and Java 11+. */
public class TraFloydDistances {
    static double[][] matrix(List<Vertex> vertices) {
        Map<Vertex, Integer> index = new IdentityHashMap<>();
        int n = vertices.size();
        double[][] distance = new double[n][n];
        for (int i = 0; i < n; i++) {
            index.put(vertices.get(i), i);
            Arrays.fill(distance[i], Double.POSITIVE_INFINITY);
            distance[i][i] = 0;
        }
        for (Vertex vertex : vertices) {
            int from = index.get(vertex);
            for (Edge edge : vertex.edges()) {
                if (!Float.isFinite(edge.getWeight())) {
                    throw new IllegalArgumentException("Use finite weights");
                }
                int to = index.get(edge.getEndPoint(vertex));
                distance[from][to] = Math.min(distance[from][to], edge.getWeight());
            }
        }
        return distance;
    }

    /**
     * Improve a square edge-distance matrix in place to all-pairs shortest distances.
     * Missing edges use positive Infinity; negative weights are allowed.
     * Reject a negative cycle; do not use the partially updated matrix after failure.
     */
    // lesson:start
    static void floyd(double[][] distance) {
        int n = distance.length;
        for (int via = 0; via < n; via++) {
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    double candidate = distance[from][via] + distance[via][to];
                    if (candidate < distance[from][to]) {
                        distance[from][to] = candidate;
                    }
                }
            }
        }
        for (int i = 0; i < n; i++) {
            if (distance[i][i] < 0) {
                throw new IllegalArgumentException("Negative cycle: distances undefined");
            }
        }
    }
    // lesson:end

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        a.addEdge(b, 5.0f);
        b.addEdge(c, -2.0f);
        a.addEdge(c, 9.0f);
        List<Vertex> vertices = List.of(a, b, c);
        double[][] distance = matrix(vertices);
        floyd(distance);
        for (double[] row : distance) {
            System.out.println(Arrays.toString(row));
        }
    }
}
