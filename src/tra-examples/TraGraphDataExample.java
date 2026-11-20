import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** TRA stores the graph; a Map stores separate data about its Vertex objects. JDK 11+. */
public class TraGraphDataExample {
    /** Count outgoing adjacency entries without changing colours, labels or edges. */
    public static Map<Vertex, Integer> outgoingCounts(AbstractGraph graph) {
        Map<Vertex, Integer> counts = new IdentityHashMap<>();
        for (Vertex vertex : graph.vertices()) {
            int count = 0;
            for (Vertex next : vertex.neighbors()) {
                count++;
            }
            counts.put(vertex, count);
        }
        return counts;
    }

    public static void main(String[] args) {
        // This file runs independently: no dependency on another example source.
        DiGraph graph = new DiGraph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        Vertex c = graph.addVertex("C");
        graph.addVertex("D");
        a.addEdge(b);
        a.addEdge(c);
        b.addEdge(c);

        Map<Vertex, Integer> counts = outgoingCounts(graph);
        List<String> display = new ArrayList<>();
        // Iterate the graph for display; IdentityHashMap has no iteration-order guarantee.
        for (Vertex vertex : graph.vertices()) {
            display.add(vertex.getLabel() + "=" + counts.get(vertex));
        }
        System.out.println("Outgoing counts: " + display);

        DiGraph repeatedLabels = new DiGraph();
        Vertex first = repeatedLabels.addVertex("X");
        Vertex second = repeatedLabels.addVertex("X");
        first.addEdge(second);
        Map<Vertex, Integer> separate = outgoingCounts(repeatedLabels);
        System.out.println("Same label: " + first.getLabel().equals(second.getLabel()));
        System.out.println("Different vertices: " + (first != second));
        System.out.println("Separate counts: " + separate.get(first) + " / " + separate.get(second));
        System.out.println("Map size: " + separate.size());
    }
}
