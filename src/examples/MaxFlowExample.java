import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

public class MaxFlowExample {
    public static long maxFlow(int[][] capacity, int source, int sink) {
        if (source == sink) throw new IllegalArgumentException("source equals sink");
        int n = capacity.length;
        long[][] residual = new long[n][n];
        List<List<Integer>> neighbors = new ArrayList<>();
        for (int u = 0; u < n; u++) {
            neighbors.add(new ArrayList<>());
            for (int v = 0; v < n; v++) {
                if (capacity[u][v] < 0) throw new IllegalArgumentException("negative capacity");
                residual[u][v] = capacity[u][v];
                if (capacity[u][v] > 0 || capacity[v][u] > 0) neighbors.get(u).add(v);
            }
        }
        long total = 0;
        int[] parent = new int[n];
        while (true) {
            Arrays.fill(parent, -1);
            parent[source] = source;
            Queue<Integer> queue = new ArrayDeque<>();
            queue.add(source);
            while (!queue.isEmpty() && parent[sink] == -1) {
                int u = queue.remove();
                for (int v : neighbors.get(u)) {
                    if (parent[v] != -1 || residual[u][v] <= 0) continue;
                    parent[v] = u;
                    queue.add(v);
                }
            }
            if (parent[sink] == -1) break;
            long amount = Long.MAX_VALUE;
            for (int v = sink; v != source; v = parent[v]) amount = Math.min(amount, residual[parent[v]][v]);
            for (int v = sink; v != source; v = parent[v]) {
                residual[parent[v]][v] -= amount;
                residual[v][parent[v]] += amount;
            }
            total += amount;
        }
        return total;
    }

    public static void main(String[] args) {
        int[][] capacity = {{0, 3, 2, 0}, {0, 0, 1, 2}, {0, 0, 0, 3}, {0, 0, 0, 0}};
        System.out.println(maxFlow(capacity, 0, 3));
    }
}
