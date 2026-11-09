import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class GraphRepresentationExample {
    static final class Graph<V> {
        private final Map<V, Set<V>> adjacency = new LinkedHashMap<>();
        void addVertex(V vertex) { adjacency.computeIfAbsent(vertex, key -> new LinkedHashSet<>()); }
        void addEdge(V from, V to) {
            addVertex(from);
            addVertex(to);
            adjacency.get(from).add(to);
        }
        Set<V> neighbors(V vertex) {
            return Collections.unmodifiableSet(adjacency.getOrDefault(vertex, Set.of()));
        }
        void removeVertex(V vertex) {
            adjacency.remove(vertex);
            for (Set<V> neighbors : adjacency.values()) neighbors.remove(vertex);
        }
    }

    public static void main(String[] args) {
        Graph<String> graph = new Graph<>();
        graph.addEdge("A", "B");
        graph.addEdge("A", "C");
        graph.addVertex("D");
        Map<String, Integer> distance = new LinkedHashMap<>();
        distance.put("A", 0);
        for (String neighbor : graph.neighbors("A")) distance.put(neighbor, 1);
        System.out.println(graph.neighbors("A"));
        System.out.println(graph.neighbors("B"));
        System.out.println(distance);
        graph.removeVertex("B");
        System.out.println(graph.neighbors("A"));
    }
}
