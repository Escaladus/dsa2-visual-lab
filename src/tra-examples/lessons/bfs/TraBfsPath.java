import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** BFS: reconstruct a path. Requires traj.jar and Java 11+. */
public class TraBfsPath {
    /**
     * Build BFS parents along outgoing edges from a non-null start.
     * @return a new map with start mapped to null and no entry for unreachable vertices
     * Map membership also records discovery; no graph field is changed.
     */
    static Map<Vertex, Vertex> parents(Vertex start) {
        Map<Vertex, Vertex> parent = new IdentityHashMap<>();
        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        parent.put(start, null);
        queue.offer(start);
        while (!queue.isEmpty()) {
            Vertex vertex = queue.remove();
            for (Vertex next : vertex.neighbors()) {
                if (!parent.containsKey(next)) {
                    parent.put(next, vertex);
                    queue.offer(next);
                }
            }
        }
        return parent;
    }

    /**
     * Read an acyclic parent map produced by the preceding traversal.
     * @return labels from its start to target, or an empty list if target has no entry
     * The parent map and graph are unchanged; labels are for display, not vertex identity.
     */
    // lesson:start
    static List<String> pathTo(Vertex target, Map<Vertex, Vertex> parent) {
        List<String> path = new ArrayList<>();
        if (!parent.containsKey(target)) {
            return path; // Unreachable: do not invent a path.
        }
        for (Vertex vertex = target; vertex != null; vertex = parent.get(vertex)) {
            path.add(vertex.getLabel());
        }
        Collections.reverse(path); // Parents were read from target back to the start.
        return path;
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
        Vertex e = graph.addVertex("E");
        Map<Vertex, Vertex> parent = parents(a);
        System.out.println("Path to D: " + pathTo(d, parent));
        System.out.println("Path to E: " + pathTo(e, parent));
    }
}
