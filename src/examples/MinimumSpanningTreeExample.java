import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class MinimumSpanningTreeExample {
    public record Edge(int from, int to, int weight) {}
    private static final class UnionFind {
        private final int[] parent, rank;
        UnionFind(int size) {
            parent = new int[size]; rank = new int[size];
            for (int i = 0; i < size; i++) parent[i] = i;
        }
        int find(int v) {
            if (parent[v] != v) parent[v] = find(parent[v]);
            return parent[v];
        }
        boolean union(int a, int b) {
            a = find(a); b = find(b);
            if (a == b) return false;
            if (rank[a] < rank[b]) { int temporary = a; a = b; b = temporary; }
            parent[b] = a;
            if (rank[a] == rank[b]) rank[a]++;
            return true;
        }
    }

    public static long kruskal(int vertices, List<Edge> edges) {
        List<Edge> sorted = new ArrayList<>(edges);
        sorted.sort(Comparator.comparingInt(Edge::weight));
        UnionFind sets = new UnionFind(vertices);
        long total = 0;
        int accepted = 0;
        for (Edge edge : sorted) {
            if (sets.union(edge.from(), edge.to())) { total += edge.weight(); accepted++; }
        }
        if (accepted != Math.max(0, vertices - 1)) throw new IllegalArgumentException("disconnected");
        return total;
    }

    public static long prim(int vertices, List<Edge> edges) {
        if (vertices == 0) return 0;
        List<List<Edge>> graph = new ArrayList<>();
        for (int v = 0; v < vertices; v++) graph.add(new ArrayList<>());
        for (Edge edge : edges) {
            graph.get(edge.from()).add(edge);
            graph.get(edge.to()).add(new Edge(edge.to(), edge.from(), edge.weight()));
        }
        boolean[] visited = new boolean[vertices];
        PriorityQueue<Edge> queue = new PriorityQueue<>(Comparator.comparingInt(Edge::weight));
        queue.add(new Edge(0, 0, 0));
        long total = 0;
        int reached = 0;
        while (!queue.isEmpty()) {
            Edge edge = queue.remove();
            if (visited[edge.to()]) continue;
            visited[edge.to()] = true;
            reached++;
            total += edge.weight();
            for (Edge next : graph.get(edge.to())) if (!visited[next.to()]) queue.add(next);
        }
        if (reached != vertices) throw new IllegalArgumentException("disconnected");
        return total;
    }

    public static void main(String[] args) {
        List<Edge> edges = List.of(new Edge(0, 1, 1), new Edge(1, 2, 2), new Edge(0, 2, 5), new Edge(2, 3, 1));
        System.out.println(kruskal(4, edges));
        System.out.println(prim(4, edges));
    }
}
