import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;

/** Create an undirected graph. Requires traj.jar and Java 11+. */
public class TraCreateGraph {
    public static void main(String[] args) {
        // lesson:start
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A");
        Vertex b = graph.addVertex("B");
        a.addEdge(b); // One insertion gives both neighbour directions.
        System.out.println("A has B: " + a.isAdjacent(b));
        System.out.println("B has A: " + b.isAdjacent(a));
        // lesson:end
    }
}
