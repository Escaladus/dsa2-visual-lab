import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public class ComponentsExample {
    // Input: an undirected graph with symmetric neighbor lists.
    public static List<List<Integer>> components(int[][] graph) {
        boolean[] visited = new boolean[graph.length];
        List<List<Integer>> result = new ArrayList<>();
        for (int start = 0; start < graph.length; start++) {
            if (visited[start]) continue;
            List<Integer> component = new ArrayList<>();
            Queue<Integer> queue = new ArrayDeque<>();
            queue.add(start);
            visited[start] = true;
            while (!queue.isEmpty()) {
                int v = queue.remove();
                component.add(v);
                for (int next : graph[v]) {
                    if (visited[next]) continue;
                    visited[next] = true;
                    queue.add(next);
                }
            }
            result.add(component);
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(components(new int[][]{{1}, {0}, {3}, {2}, {}}));
    }
}
