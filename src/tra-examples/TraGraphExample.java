import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.List;

/** Basic operations on real TRA graph objects. Requires traj.jar and JDK 11+. */
public class TraGraphExample {
    /** The same A/B/C/D graph as the lesson drawing. D has no incident edges. */
    public static DiGraph createDirectedGraph() {
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        graph.addVertex("D");

        // A float argument is an edge weight.
        // An int argument here would mean colour.
        a.addEdge(b, 5.0f);
        a.addEdge(c, 2.0f);
        b.addEdge(c, 1.0f);
        return graph;
    }

    private static List<String> labels(Iterable<Vertex> vertices) {
        List<String> labels = new ArrayList<>();
        for (Vertex vertex : vertices) {
            labels.add(vertex.getLabel());
        }
        return labels;
    }

    public static void main(String[] args) {
        DiGraph directed = createDirectedGraph();
        System.out.println("Directed vertices: " + directed.vertexCount());
        // vertices() includes isolated vertices; neighbors() follows outgoing edges.
        for (Vertex vertex : directed.vertices()) {
            System.out.println(vertex.getLabel() + " neighbours: " + labels(vertex.neighbors()));
        }

        Vertex a = directed.firstVertex();
        Edge edge = a.edges().iterator().next();
        Vertex b = edge.getEndPoint(a);
        System.out.println("A -> B: " + a.isAdjacent(b));
        System.out.println("B -> A: " + b.isAdjacent(a));
        System.out.println("A -> B weight: " + edge.getWeight());

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
        System.out.println("U neighbours: " + labels(u.neighbors()));
        System.out.println("V neighbours: " + labels(v.neighbors()));
    }
}
