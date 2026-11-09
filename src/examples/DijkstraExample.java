import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class DijkstraExample {
    public record Edge(int to, int weight) {}
    private record State(int vertex, long distance) {}

    public static long[] distances(List<List<Edge>> graph, int start) {
        for (List<Edge> edges : graph) for (Edge edge : edges) {
            if (edge.weight() < 0) throw new IllegalArgumentException("negative weight");
        }
        long[] distance = new long[graph.size()];
        Arrays.fill(distance, Long.MAX_VALUE);
        PriorityQueue<State> queue = new PriorityQueue<>(Comparator.comparingLong(State::distance));
        distance[start] = 0;
        queue.add(new State(start, 0));
        while (!queue.isEmpty()) {
            State current = queue.remove();
            int v = current.vertex();
            if (current.distance() != distance[v]) continue;
            for (Edge edge : graph.get(v)) {
                long candidate = distance[v] + edge.weight();
                if (candidate < distance[edge.to()]) {
                    distance[edge.to()] = candidate;
                    queue.add(new State(edge.to(), candidate));
                }
            }
        }
        return distance;
    }

    public static void main(String[] args) {
        List<List<Edge>> graph = new ArrayList<>();
        for (int i = 0; i < 4; i++) graph.add(new ArrayList<>());
        graph.get(0).addAll(List.of(new Edge(1, 10), new Edge(2, 1)));
        graph.get(2).addAll(List.of(new Edge(1, 2), new Edge(3, 8)));
        graph.get(1).add(new Edge(3, 1));
        System.out.println(Arrays.toString(distances(graph, 0)));
    }
}
