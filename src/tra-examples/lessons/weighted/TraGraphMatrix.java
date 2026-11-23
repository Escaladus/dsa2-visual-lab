import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** TRA graph → distance matrix. Requires traj.jar and Java 11+. */
public class TraGraphMatrix {
    // lesson:start
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
        for (double[] row : distance) {
            System.out.println(Arrays.toString(row));
        }
    }
}
