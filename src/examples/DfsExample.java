import java.util.ArrayList;
import java.util.List;

public class DfsExample {
    public record Result(List<Integer> pre, List<Integer> post) {}

    public static Result traverse(int[][] graph) {
        boolean[] visited = new boolean[graph.length];
        List<Integer> pre = new ArrayList<>(), post = new ArrayList<>();
        for (int v = 0; v < graph.length; v++) {
            if (!visited[v]) dfs(graph, v, visited, pre, post);
        }
        return new Result(pre, post);
    }

    private static void dfs(int[][] graph, int v, boolean[] visited,
                            List<Integer> pre, List<Integer> post) {
        visited[v] = true;
        pre.add(v);
        for (int next : graph[v]) {
            if (!visited[next]) dfs(graph, next, visited, pre, post);
        }
        post.add(v);
    }

    public static void main(String[] args) {
        Result result = traverse(new int[][]{{1, 2}, {2}, {}, {}});
        System.out.println(result.pre());
        System.out.println(result.post());
    }
}
