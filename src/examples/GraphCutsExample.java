import java.util.ArrayList;
import java.util.List;
import java.util.TreeSet;

public class GraphCutsExample {
    public record Result(List<Integer> articulation, List<String> bridges) {}

    // Input: a simple undirected graph; every edge appears in both neighbor lists.
    public static Result find(int[][] graph) {
        int[] discovery = new int[graph.length], low = new int[graph.length], clock = {0};
        boolean[] cut = new boolean[graph.length];
        List<String> bridges = new ArrayList<>();
        for (int v = 0; v < graph.length; v++) {
            if (discovery[v] == 0) dfs(graph, v, -1, discovery, low, clock, cut, bridges);
        }
        List<Integer> articulation = new ArrayList<>();
        for (int v = 0; v < cut.length; v++) if (cut[v]) articulation.add(v);
        return new Result(articulation, bridges);
    }

    private static void dfs(int[][] graph, int v, int parent, int[] discovery, int[] low,
                            int[] clock, boolean[] cut, List<String> bridges) {
        discovery[v] = low[v] = ++clock[0];
        int children = 0;
        for (int next : graph[v]) {
            if (next == parent) continue;
            if (discovery[next] == 0) {
                children++;
                dfs(graph, next, v, discovery, low, clock, cut, bridges);
                low[v] = Math.min(low[v], low[next]);
                if (parent != -1 && low[next] >= discovery[v]) cut[v] = true;
                if (low[next] > discovery[v]) bridges.add(Math.min(v, next) + "-" + Math.max(v, next));
            } else low[v] = Math.min(low[v], discovery[next]);
        }
        if (parent == -1 && children > 1) cut[v] = true;
    }

    public static void main(String[] args) {
        Result result = find(new int[][]{{1, 2}, {0, 2, 3}, {0, 1}, {1, 4}, {3}});
        System.out.println(result.articulation());
        System.out.println(new TreeSet<>(result.bridges()));
    }
}
