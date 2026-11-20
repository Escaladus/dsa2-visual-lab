import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.IdentityHashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/** Basic recursive DFS using TRA iterators and separate visited data. JDK 11+. */
public class TraRecursiveDfsExample {
    public static final class Result {
        private final List<Vertex> pre;
        private final List<Vertex> post;

        Result(List<Vertex> pre, List<Vertex> post) {
            this.pre = List.copyOf(pre);
            this.post = List.copyOf(post);
        }

        public List<Vertex> pre() { return pre; }
        public List<Vertex> post() { return post; }
    }

    /** i counts completed neighbours; neighbors is this call's own iterator. */
    static void dfs(Vertex v, Map<Vertex, Boolean> visited, List<Vertex> pre, List<Vertex> post) {
        visited.put(v, true);
        pre.add(v);
        Iterator<Vertex> neighbors = v.neighborIterator();
        for (int i = 0; neighbors.hasNext(); i++) {
            Vertex next = neighbors.next();
            if (!visited.get(next)) {
                dfs(next, visited, pre, post);
            }
        }
        post.add(v);
    }

    /** vertices gives the explicit root order; it must contain every graph vertex once. */
    public static Result traverse(AbstractGraph graph, List<Vertex> vertices, Vertex start, boolean all) {
        Map<Vertex, Boolean> visited = initializeVisited(graph, vertices, start);
        List<Vertex> pre = new ArrayList<>(), post = new ArrayList<>();
        if (start != null) dfs(start, visited, pre, post);
        if (all) {
            for (Vertex v : vertices) {
                if (!visited.get(v)) dfs(v, visited, pre, post);
            }
        }
        return new Result(pre, post);
    }

    private static Map<Vertex, Boolean> initializeVisited(AbstractGraph graph, List<Vertex> vertices, Vertex start) {
        Map<Vertex, Boolean> visited = new IdentityHashMap<>();
        for (Vertex vertex : graph.vertices()) visited.put(vertex, false);
        Map<Vertex, Boolean> listed = new IdentityHashMap<>();
        for (Vertex vertex : vertices) {
            if (!visited.containsKey(vertex) || listed.put(vertex, true) != null) {
                throw new IllegalArgumentException("Root order must list graph vertices once");
            }
        }
        if (vertices.size() != visited.size()
                || (vertices.isEmpty() ? start != null : !visited.containsKey(start))) {
            throw new IllegalArgumentException("Invalid root order or start vertex");
        }
        return visited;
    }

    private static List<String> labels(List<Vertex> vertices) {
        List<String> result = new ArrayList<>();
        for (Vertex vertex : vertices) result.add(vertex.getLabel());
        return result;
    }

    public static void main(String[] args) {
        Graph graph = new Graph();
        List<Vertex> vertices = new ArrayList<>();
        for (int id = 0; id < 4; id++) vertices.add(graph.addVertex(String.valueOf(id)));
        // The supplied JAR enumerates this fixture in ascending neighbour order.
        vertices.get(0).addEdge(vertices.get(1));
        vertices.get(0).addEdge(vertices.get(2));
        vertices.get(1).addEdge(vertices.get(3));
        Result result = traverse(graph, vertices, vertices.get(0), false);
        System.out.println("PRE: " + labels(result.pre()));
        System.out.println("POST: " + labels(result.post()));
        // Colours are untouched: the colour lesson uses a different, explicit state model.
    }
}
