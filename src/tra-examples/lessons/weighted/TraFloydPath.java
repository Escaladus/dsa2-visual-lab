import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Floyd: reconstruct a shortest path. Requires traj.jar and Java 11+. */
public class TraFloydPath {
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
     * Improve distance and next-hop matrices in place; both must be initialised as in main.
     * Distance is square, with Infinity for missing edges; negative weights are allowed.
     * Reject negative cycles before reading any path from next.
     */
    static void floyd(double[][] distance, int[][] next) {
        int n = distance.length;
        for (int via = 0; via < n; via++) {
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    double candidate = distance[from][via] + distance[via][to];
                    if (candidate < distance[from][to]) {
                        distance[from][to] = candidate;
                        next[from][to] = next[from][via];
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

    /**
     * Read a next-hop table after successful Floyd with no negative cycle.
     * from/to are valid indices in the same ordered Vertex list used to build the tables.
     * @return path labels, or an empty list when unreachable; tables are unchanged
     */
    // lesson:start
    static List<String> path(int from, int to, int[][] next, List<Vertex> vertices) {
        List<String> result = new ArrayList<>();
        if (next[from][to] == -1) {
            return result; // No path.
        }
        result.add(vertices.get(from).getLabel());
        while (from != to) {
            from = next[from][to]; // Take the first hop of the remaining shortest path.
            result.add(vertices.get(from).getLabel());
        }
        return result;
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
        int n = vertices.size();
        int[][] next = new int[n][n];
        for (int from = 0; from < n; from++) {
            for (int to = 0; to < n; to++) {
                next[from][to] = Double.isFinite(distance[from][to]) ? to : -1;
            }
        }
        floyd(distance, next);
        System.out.println("Path A to C: " + path(0, 2, next, vertices));
        System.out.println("Path C to A: " + path(2, 0, next, vertices));
    }
}
