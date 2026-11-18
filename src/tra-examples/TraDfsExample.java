import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Recursive DFS over TRA neighbours. Works with DiGraph or Graph, on JDK 11+. */
public class TraDfsExample {
    public static final class Result {
        private final List<Vertex> pre = new ArrayList<>();
        private final List<Vertex> post = new ArrayList<>();
        private final List<Vertex> roots = new ArrayList<>();
        private final Map<Vertex, Vertex> parent = new IdentityHashMap<>();

        public List<Vertex> pre() {
            return Collections.unmodifiableList(pre);
        }

        public List<Vertex> post() {
            return Collections.unmodifiableList(post);
        }

        public List<Vertex> roots() {
            return Collections.unmodifiableList(roots);
        }

        public Vertex parentOf(Vertex vertex) {
            return parent.get(vertex);
        }
    }

    /**
     * Start with the reachable part. If all is true, continue from remaining WHITE vertices.
     * A nonempty graph requires a start belonging to that graph; an empty graph uses null.
     * Each run resets colours, but keeps the graph's vertices, edges and labels intact.
     */
    public static Result traverse(AbstractGraph graph, Vertex start, boolean all) {
        requireStart(graph, start);
        for (Vertex vertex : graph.vertices()) {
            vertex.setColor(AbstractGraph.WHITE);
        }
        Result result = new Result();
        if (start != null) {
            result.roots.add(start);
            dfs(start, null, result);
        }
        if (all) {
            for (Vertex vertex : graph.vertices()) {
                if (vertex.getColor() == AbstractGraph.WHITE) {
                    result.roots.add(vertex);
                    dfs(vertex, null, result);
                }
            }
        }
        return result;
    }

    private static void dfs(Vertex vertex, Vertex caller, Result result) {
        vertex.setColor(AbstractGraph.GREY);
        result.parent.put(vertex, caller);
        result.pre.add(vertex); // PRE: the vertex has just been discovered.

        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == AbstractGraph.WHITE) {
                dfs(next, vertex, result);
                // The child finished. Continue this caller's neighbour iterator.
            }
        }

        result.post.add(vertex); // POST: every neighbour has been examined.
        vertex.setColor(AbstractGraph.BLACK);
        // A return resumes the caller; it is not another edge of the graph.
    }

    private static void requireStart(AbstractGraph graph, Vertex start) {
        if (graph.vertexCount() == 0 && start == null) {
            return;
        }
        for (Vertex vertex : graph.vertices()) {
            if (vertex == start) {
                return;
            }
        }
        throw new IllegalArgumentException("Start must belong to the graph");
    }

    private static List<String> labels(List<Vertex> vertices) {
        List<String> labels = new ArrayList<>();
        for (Vertex vertex : vertices) {
            labels.add(vertex.getLabel());
        }
        return labels;
    }

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        Vertex[] vertices = new Vertex[5];
        for (int i = 0; i < vertices.length; i++) {
            vertices[i] = graph.addVertex(String.valueOf(i));
        }
        // Same directed example as the advanced traversal lesson; 4 is isolated.
        vertices[0].addEdge(vertices[1]);
        vertices[0].addEdge(vertices[2]);
        vertices[0].addEdge(vertices[3]);
        vertices[1].addEdge(vertices[2]);
        vertices[2].addEdge(vertices[0]);
        vertices[3].addEdge(vertices[2]);

        Result reachable = traverse(graph, vertices[0], false);
        System.out.println("PRE: " + labels(reachable.pre()));
        System.out.println("POST: " + labels(reachable.post()));
        System.out.println("parent(2): " + reachable.parentOf(vertices[2]).getLabel());
        System.out.println("isolated WHITE: " + (vertices[4].getColor() == AbstractGraph.WHITE));

        Result complete = traverse(graph, vertices[0], true);
        System.out.println("ALL PRE: " + labels(complete.pre()));
        System.out.println("ALL POST: " + labels(complete.post()));
        System.out.println("roots: " + labels(complete.roots()));
        // On a directed graph, forest roots do not identify strongly connected components.
    }
}
