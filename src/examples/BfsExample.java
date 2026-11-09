import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Queue;

public class BfsExample {
    public record Result(int[] distance, int[] parent) {
        public List<Integer> pathTo(int target) {
            if (distance[target] == -1) return List.of();
            List<Integer> path = new ArrayList<>();
            for (int v = target; v != -1; v = parent[v]) path.add(v);
            Collections.reverse(path);
            return path;
        }
    }

    public static Result search(int[][] graph, int start) {
        int[] distance = new int[graph.length], parent = new int[graph.length];
        Arrays.fill(distance, -1);
        Arrays.fill(parent, -1);
        Queue<Integer> queue = new ArrayDeque<>();
        distance[start] = 0;
        queue.add(start);
        while (!queue.isEmpty()) {
            int v = queue.remove();
            for (int next : graph[v]) {
                if (distance[next] != -1) continue;
                distance[next] = distance[v] + 1;
                parent[next] = v;
                queue.add(next);
            }
        }
        return new Result(distance, parent);
    }

    public static void main(String[] args) {
        Result result = search(new int[][]{{1, 2}, {3}, {3}, {}, {}}, 0);
        System.out.println(Arrays.toString(result.distance()));
        System.out.println(result.pathTo(3));
        System.out.println(result.pathTo(4));
    }
}
