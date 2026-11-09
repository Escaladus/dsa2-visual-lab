import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TopologicalExample {
    public static List<Integer> sort(int[][] graph) {
        int[] color = new int[graph.length];
        List<Integer> post = new ArrayList<>();
        for (int v = 0; v < graph.length; v++) if (color[v] == 0) dfs(graph, v, color, post);
        Collections.reverse(post);
        return post;
    }

    private static void dfs(int[][] graph, int v, int[] color, List<Integer> post) {
        color[v] = 1;
        for (int next : graph[v]) {
            if (color[next] == 1) throw new IllegalArgumentException("cycle");
            if (color[next] == 0) dfs(graph, next, color, post);
        }
        color[v] = 2;
        post.add(v);
    }

    public static void main(String[] args) {
        System.out.println(sort(new int[][]{{1, 2}, {3}, {3}, {}}));
        try { sort(new int[][]{{1}, {0}}); }
        catch (IllegalArgumentException error) { System.out.println(error.getMessage()); }
    }
}
