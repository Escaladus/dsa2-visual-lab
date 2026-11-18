import java.util.ArrayList;
import java.util.List;

/** Each recursive call owns its neighbour index; visited and result lists are shared. */
public class RecursiveDfsExample {
    public static final class Result {
        private final List<Integer> pre;
        private final List<Integer> post;

        public Result(List<Integer> pre, List<Integer> post) {
            this.pre = pre;
            this.post = post;
        }

        public List<Integer> pre() {
            return pre;
        }

        public List<Integer> post() {
            return post;
        }
    }

    // Vertices are array indices. The given neighbour order is preserved.
    // For a nonempty graph, start must be a valid vertex index.
    static Result traverse(int[][] graph, int start, boolean all) {
        boolean[] visited = new boolean[graph.length];
        List<Integer> pre = new ArrayList<>(), post = new ArrayList<>();
        if (graph.length > 0) dfs(graph, start, visited, pre, post);
        if (all) {
            for (int v = 0; v < graph.length; v++) {
                if (!visited[v]) dfs(graph, v, visited, pre, post);
            }
        }
        return new Result(pre, post);
    }

    static void dfs(int[][] graph, int v, boolean[] visited, List<Integer> pre, List<Integer> post) {
        visited[v] = true;
        pre.add(v);
        for (int i = 0; i < graph[v].length; i++) {
            int next = graph[v][i];
            if (!visited[next]) {
                dfs(graph, next, visited, pre, post);
            }
        }
        post.add(v);
    }

    public static void main(String[] args) {
        int[][] branching = {{1, 2}, {0, 3}, {0}, {1}};
        int[][] cycle = {{1, 2}, {0, 2, 3}, {0, 1}, {1}};
        int[][] disconnected = {{1}, {0}, {}, {4}, {3}};
        for (int[][] graph : new int[][][]{branching, cycle, disconnected}) {
            Result result = traverse(graph, 0, false);
            System.out.println(result.pre());
            System.out.println(result.post());
        }
        Result all = traverse(disconnected, 0, true);
        System.out.println(all.pre());
        System.out.println(all.post());
    }
}
