import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.List;
import static fi.uef.cs.tra.AbstractGraph.WHITE;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.BLACK;

/** Full DFS applications for an undirected TRA Graph. Requires JDK 11+. */
public class TraComponentsExample {
    /** Fresh lists on every run. Only vertex colours change; topology and labels stay intact. */
    public static List<List<Vertex>> components(Graph graph) {
        resetColors(graph);
        List<List<Vertex>> result = new ArrayList<>();
        for (Vertex root : graph.vertices()) {
            if (root.getColor() != WHITE) continue;
            List<Vertex> component = new ArrayList<>();
            collect(root, component);
            result.add(component);
        }
        return result;
    }

    /** Called only for a WHITE vertex; each recursive call keeps its own neighbour iterator. */
    private static void collect(Vertex vertex, List<Vertex> component) {
        vertex.setColor(GREY);
        component.add(vertex); // PRE: first discovery assigns this component.
        for (Vertex next : vertex.neighbors()) {
            if (next.getColor() == WHITE) collect(next, component);
        }
        vertex.setColor(BLACK);
    }

    /** Check every component, not just the part reachable from the first vertex. */
    public static boolean hasCycle(Graph graph) {
        resetColors(graph);
        boolean found = false;
        for (Vertex root : graph.vertices()) {
            if (root.getColor() == WHITE && cycleDfs(root, null)) found = true;
        }
        return found;
    }

    private static boolean cycleDfs(Vertex vertex, Edge parentEdge) {
        vertex.setColor(GREY);
        boolean found = false;
        for (Edge edge : vertex.edges()) {
            if (edge == parentEdge) continue; // Same physical tree edge, viewed backwards.
            Vertex next = edge.getEndPoint(vertex); // Other endpoint of this undirected edge.
            if (next.getColor() == WHITE) {
                if (cycleDfs(next, edge)) found = true;
            } else if (next.getColor() == GREY) {
                found = true; // A non-parent edge closes a path to an active ancestor.
            }
        }
        vertex.setColor(BLACK);
        return found; // Finish even after finding a cycle, so every vertex ends BLACK.
    }

    private static void resetColors(Graph graph) {
        for (Vertex vertex : graph.vertices()) vertex.setColor(WHITE);
    }

    /** Same disconnected fixture as the visualisation: 0—1, isolated 2, 3—4. */
    public static Graph createExampleGraph() {
        Graph graph = new Graph();
        Vertex[] vertices = new Vertex[5];
        for (int i = 0; i < vertices.length; i++) vertices[i] = graph.addVertex(String.valueOf(i));
        vertices[0].addEdge(vertices[1]);
        vertices[3].addEdge(vertices[4]);
        return graph;
    }

    private static List<List<String>> labels(List<List<Vertex>> components) {
        List<List<String>> result = new ArrayList<>();
        for (List<Vertex> component : components) {
            List<String> names = new ArrayList<>();
            for (Vertex vertex : component) names.add(vertex.getLabel());
            result.add(names);
        }
        return result;
    }

    public static void main(String[] args) {
        Graph graph = createExampleGraph();
        System.out.println("Components: " + labels(components(graph)));
        System.out.println("Cycle: " + hasCycle(graph));

        Graph triangle = new Graph();
        Vertex a = triangle.addVertex("A");
        Vertex b = triangle.addVertex("B");
        Vertex c = triangle.addVertex("C");
        a.addEdge(b);
        b.addEdge(c);
        c.addEdge(a);
        System.out.println("Triangle cycle: " + hasCycle(triangle));
        System.out.println("Empty components: " + components(new Graph()));
        // Graph rejects self-loops in this JAR. DiGraph cycles are a different lesson.
    }
}
