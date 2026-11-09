import java.util.Arrays;

public class FloydWarshallExample {
    public static final long INF = Long.MAX_VALUE / 4;

    // Finite input weights must have magnitude < INF / max(1, vertex count).
    public static long[][] distances(long[][] weights) {
        int n = weights.length;
        long[][] d = new long[n][];
        for (int i = 0; i < n; i++) {
            d[i] = weights[i].clone();
            d[i][i] = Math.min(d[i][i], 0);
        }
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    if (d[i][k] == INF || d[k][j] == INF) continue;
                    d[i][j] = Math.min(d[i][j], d[i][k] + d[k][j]);
                }
            }
            for (int v = 0; v < n; v++) {
                if (d[v][v] < 0) throw new IllegalArgumentException("negative cycle");
            }
        }
        return d;
    }

    public static void main(String[] args) {
        long[][] weights = {{0, 5, INF}, {INF, 0, -2}, {INF, INF, 0}};
        for (long[] row : distances(weights)) System.out.println(Arrays.stream(row).mapToObj(value -> value == INF ? "INF" : Long.toString(value)).toList());
    }
}
