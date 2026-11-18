import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.List;

/** Basic operations on real TRA graph objects. Requires traj.jar and JDK 11+. */
public class TraGraphExample {
    private static List<String> labels(Iterable<Vertex> vertices) {
        List<String> labels = new ArrayList<>();
        for (Vertex vertex : vertices) {
            labels.add(vertex.getLabel());
        }
        return labels;
    }

    public static void main(String[] args) {
        DiGraph directed = new DiGraph();
        Vertex a = directed.addVertex("A");
        Vertex b = directed.addVertex("B");
        Vertex c = directed.addVertex("C");

        // Add an edge to its source vertex, not to the graph object.
        a.addEdge(b);
        b.addEdge(c);
        System.out.println("Directed vertices: " + directed.vertexCount());
        System.out.println("A neighbours: " + labels(a.neighbors()));
        System.out.println("A -> B: " + a.isAdjacent(b));
        System.out.println("B -> A: " + b.isAdjacent(a));

        // Traversal colours are mutable metadata stored in each Vertex.
        for (Vertex vertex : directed.vertices()) {
            vertex.setColor(AbstractGraph.WHITE);
        }
        a.setColor(AbstractGraph.GREY);
        System.out.println("A is GREY: " + (a.getColor() == AbstractGraph.GREY));
        a.setColor(AbstractGraph.BLACK);
        System.out.println("A is BLACK: " + (a.getColor() == AbstractGraph.BLACK));

        Graph undirected = new Graph();
        Vertex u = undirected.addVertex("U");
        Vertex v = undirected.addVertex("V");
        // Graph supplies both neighbour directions for one undirected edge.
        u.addEdge(v);
        System.out.println("U -> V: " + u.isAdjacent(v));
        System.out.println("V -> U: " + v.isAdjacent(u));
    }
}
