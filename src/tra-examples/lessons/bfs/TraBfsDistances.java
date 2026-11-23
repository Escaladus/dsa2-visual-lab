import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;

/** BFS: distance in number of edges. Requires traj.jar and Java 11+. */
public class TraBfsDistances {
    /**
     * Find shortest hop distances along outgoing edges from a non-null start.
     * @return a new Vertex-keyed map: start is 0, unreachable vertices have no entry
     * Neither graph fields nor its structure are changed.
     */
    // lesson:start
    static Map<Vertex, Integer> distances(Vertex start) {
        Map<Vertex, Integer> distance = new IdentityHashMap<>();
        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        distance.put(start, 0);
        queue.offer(start);
        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();
            for (Vertex next : vertex.neighbors()) {
                if (!distance.containsKey(next)) { // First discovery fixes the shortest hop distance.
                    distance.put(next, distance.get(vertex) + 1);
                    queue.offer(next);
                }
            }
        }
        return distance;
    }
    // lesson:end

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        Vertex d = graph.addVertex("D");
        a.addEdge(b);
        a.addEdge(c);
        b.addEdge(d);
        graph.addVertex("E");
        Map<Vertex, Integer> distance = distances(a);
        for (Vertex vertex : graph.vertices()) {
            System.out.println(vertex.getLabel() + ": " + distance.getOrDefault(vertex, -1));
        }
    }
}
