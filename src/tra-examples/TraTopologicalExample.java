import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import static fi.uef.cs.tra.AbstractGraph.WHITE;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.BLACK;

/** Full directed DFS: reject a cycle before exposing reverse POST. Requires JDK 11+. */
public class TraTopologicalExample {
    /**
     * Returns every vertex exactly once, including isolated vertices, or throws on any cycle.
     * Each call resets vertex colours. Edges, weights and labels are not changed.
     * On failure colours may be WHITE/GREY/BLACK; no partial order is returned.
     */
    public static List<Vertex> sort(DiGraph graph) {
        for (Vertex vertex : graph.vertices()) vertex.setColor(WHITE);
        List<Vertex> post = new ArrayList<>();
        for (Vertex root : graph.vertices()) {
            if (root.getColor() == WHITE) dfs(root, post);
        }
        Collections.reverse(post); // Only reached after ALL components pass the cycle check.
        return post;
    }

    private static void dfs(Vertex vertex, List<Vertex> post) {
        vertex.setColor(GREY);
        for (Vertex next : vertex.neighbors()) { // DiGraph supplies outgoing neighbours only.
            if (next.getColor() == GREY) {
                throw new IllegalArgumentException("cycle"); // Also catches a self-loop.
            }
            if (next.getColor() == WHITE) dfs(next, post);
        }
        post.add(vertex); // POST: every descendant has finished.
        vertex.setColor(BLACK);
    }

    /** Same DAG / directed-cycle pair as the visualisation. Vertex 4 is isolated. */
    public static DiGraph createExampleGraph(boolean cyclic) {
        DiGraph graph = new DiGraph();
        Vertex[] vertices = new Vertex[5];
        for (int i = 0; i < vertices.length; i++) vertices[i] = graph.addVertex(String.valueOf(i));
        vertices[0].addEdge(vertices[1]);
        vertices[0].addEdge(vertices[2]);
        vertices[0].addEdge(vertices[3]);
        vertices[1].addEdge(vertices[2]);
        vertices[3].addEdge(vertices[2]);
        if (cyclic) vertices[2].addEdge(vertices[0]);
        return graph;
    }

    private static List<String> labels(List<Vertex> vertices) {
        List<String> result = new ArrayList<>();
        for (Vertex vertex : vertices) result.add(vertex.getLabel());
        return result;
    }

    public static void main(String[] args) {
        System.out.println("DAG order: " + labels(sort(createExampleGraph(false))));
        try {
            sort(createExampleGraph(true));
        } catch (IllegalArgumentException error) {
            System.out.println("Directed cycle: " + error.getMessage());
        }
        DiGraph loop = new DiGraph();
        Vertex vertex = loop.addVertex("loop");
        vertex.addEdge(vertex);
        try {
            sort(loop);
        } catch (IllegalArgumentException error) {
            System.out.println("Self-loop: " + error.getMessage());
        }
        System.out.println("Empty order: " + sort(new DiGraph()));
        // Reverse POST is not unique: another neighbour/root order may also be valid.
    }
}
