import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.IdentityHashMap;
import java.util.Map;

/** Attach data to a vertex. Requires traj.jar and Java 11+. */
public class TraVertexMap {
    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex first = graph.addVertex("X");
        Vertex second = graph.addVertex("X");
        // lesson:start
        Map<Vertex, Integer> distance = new IdentityHashMap<>();
        distance.put(first, 0);
        distance.put(second, 7);
        System.out.println("First X: " + distance.get(first));
        System.out.println("Second X: " + distance.get(second));
        // lesson:end
    }
}
