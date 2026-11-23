import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Maximum flow: repeat augmenting paths. Requires traj.jar and Java 11+. */
public class TraMaximumFlow {
    static long[][] capacities(List<Vertex> vertices) {
        Map<Vertex, Integer> index = new IdentityHashMap<>();
        for (int i = 0; i < vertices.size(); i++) {
            index.put(vertices.get(i), i);
        }
        long[][] capacity = new long[vertices.size()][vertices.size()];
        for (Vertex vertex : vertices) {
            for (Edge edge : vertex.edges()) {
                float weight = edge.getWeight();
                if (!Float.isFinite(weight) || weight < 0 || weight > 1_000_000_000L
                        || weight != Math.rint(weight)) {
                    throw new IllegalArgumentException("Use integer capacities in [0, 1000000000]");
                }
                capacity[index.get(vertex)][index.get(edge.getEndPoint(vertex))] = (long) weight;
            }
        }
        return capacity;
    }

    static int[] bfs(long[][] residual, int source) {
        int[] parent = new int[residual.length];
        Arrays.fill(parent, -1);
        LinkedQueue<Integer> queue = new LinkedQueue<>();
        parent[source] = source;
        queue.offer(source);
        while (!queue.isEmpty()) {
            int from = queue.remove();
            for (int to = 0; to < residual.length; to++) {
                if (residual[from][to] > 0 && parent[to] == -1) {
                    parent[to] = from;
                    queue.offer(to);
                }
            }
        }
        return parent;
    }

    /**
     * Augment a square nonnegative residual matrix between distinct valid terminal indices.
     * For a complete zero-flow solve, initialise residual as a copy of capacities.
     * @return the additional maximum flow; updates residual in place, not the TRA graph
     */
    // lesson:start
    static long maxFlow(long[][] residual, int source, int sink) {
        if (source == sink) {
            throw new IllegalArgumentException("Source and sink must differ");
        }
        long total = 0;
        while (true) {
            int[] parent = bfs(residual, source);
            if (parent[sink] == -1) {
                return total;
            }
            long amount = Long.MAX_VALUE;
            for (int to = sink; to != source; to = parent[to]) {
                amount = Math.min(amount, residual[parent[to]][to]);
            }
            for (int to = sink; to != source; to = parent[to]) {
                int from = parent[to];
                residual[from][to] -= amount;
                residual[to][from] += amount;
            }
            total += amount;
        }
    }
    // lesson:end

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex s = graph.addVertex("s");
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex t = graph.addVertex("t");
        s.addEdge(a, 3.0f);
        s.addEdge(b, 2.0f);
        a.addEdge(b, 1.0f);
        a.addEdge(t, 2.0f);
        b.addEdge(t, 3.0f);
        List<Vertex> vertices = List.of(s, a, b, t);
        long[][] capacity = capacities(vertices);
        long[][] residual = new long[capacity.length][];
        for (int i = 0; i < capacity.length; i++) {
            residual[i] = capacity[i].clone();
        }
        System.out.println("Maximum flow: " + maxFlow(residual, 0, 3));
    }
}
