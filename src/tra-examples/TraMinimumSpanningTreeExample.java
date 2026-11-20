import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.PriorityQueue;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Prim and Kruskal return minimum spanning forests of undirected TRA Graphs. JDK 11+. */
public class TraMinimumSpanningTreeExample {
    public static final class Result {
        private final List<Vertex> vertices;
        private final List<Edge> edges;
        private final int components;
        private final double totalWeight;

        private Result(List<Vertex> vertices, List<Edge> chosen, int components) {
            this.vertices = List.copyOf(vertices);
            this.edges = List.copyOf(chosen); // Actual input Edge references, not replacement edges.
            this.components = components;
            double sum = 0.0;
            for (Edge edge : chosen) sum += (double)edge.getWeight();
            this.totalWeight = sum;
        }

        public List<Vertex> vertices() { return vertices; }
        public List<Edge> edges() { return edges; }
        public int components() { return components; }
        public double totalWeight() { return totalWeight; }

        /** Empty input is an empty forest; a single vertex is a tree with zero edges. */
        public boolean isSpanningTree() {
            return !vertices.isEmpty() && components == 1;
        }
    }

    /**
     * Graph only: finite weights, including negative/zero weights. All input fields stay intact.
     * The lazy Edge queue costs O(V + E log(E + 1)) time and O(V + E) additional space.
     * Edge weights must remain fixed while they are in the queue.
     */
    public static Result prim(Graph graph) {
        validateWeights(graph);
        List<Vertex> vertices = vertices(graph);
        Set<Vertex> reached = Collections.newSetFromMap(new IdentityHashMap<Vertex, Boolean>());
        List<Edge> chosen = new ArrayList<>();
        PriorityQueue<Edge> queue = new PriorityQueue<>(11, Comparator.comparingDouble(Edge::getWeight));
        int components = 0;
        for (Vertex root : vertices) {
            if (reached.contains(root)) continue;
            components++; // Includes an isolated vertex: one component, no chosen edge.
            addBoundary(root, reached, queue);
            while (!queue.isEmpty()) {
                Edge edge = queue.poll();
                Vertex from = edge.getStartPoint();
                Vertex to = edge.getEndPoint();
                // Every queued edge had a reached endpoint. Both reached now means stale.
                if (reached.contains(from) && reached.contains(to)) continue;
                Vertex next = reached.contains(from) ? to : from;
                chosen.add(edge);
                addBoundary(next, reached, queue);
            }
        }
        return new Result(vertices, chosen, components);
    }

    /** Add only edges crossing from this newly reached vertex to an unreached endpoint. */
    private static void addBoundary(Vertex vertex, Set<Vertex> reached, PriorityQueue<Edge> queue) {
        reached.add(vertex);
        for (Edge edge : vertex.edges()) {
            Vertex next = edge.getEndPoint(vertex); // Other endpoint; Graph has no arrow direction.
            if (!reached.contains(next)) queue.offer(edge);
        }
    }

    /**
     * Global Graph.edges() lists each physical undirected Edge once. Sort a copy, not the input.
     * Sorting plus union-find costs O(V + E log(E + 1)) time and O(V + E) additional space.
     */
    public static Result kruskal(Graph graph) {
        validateWeights(graph);
        List<Vertex> vertices = vertices(graph);
        Map<Vertex, Integer> id = new IdentityHashMap<>();
        for (int i = 0; i < vertices.size(); i++) id.put(vertices.get(i), i);
        List<Edge> sorted = new ArrayList<>();
        for (Edge edge : graph.edges()) sorted.add(edge);
        sorted.sort(Comparator.comparingDouble(Edge::getWeight));

        DisjointSets sets = new DisjointSets(vertices.size());
        List<Edge> chosen = new ArrayList<>();
        int components = vertices.size();
        for (Edge edge : sorted) {
            int from = id.get(edge.getStartPoint());
            int to = id.get(edge.getEndPoint());
            if (sets.union(from, to)) { // Same set would close a cycle: reject that edge.
                chosen.add(edge);
                components--;
            }
        }
        return new Result(vertices, chosen, components);
    }

    /** Algorithm-owned integer sets; these do not replace TRA Vertex or Edge objects. */
    private static final class DisjointSets {
        private final int[] parent;
        private final int[] rank;

        DisjointSets(int size) {
            parent = new int[size];
            rank = new int[size];
            for (int i = 0; i < size; i++) parent[i] = i;
        }

        private int find(int vertex) {
            // Path compression changes only these private set links, not the graph.
            if (parent[vertex] != vertex) parent[vertex] = find(parent[vertex]);
            return parent[vertex];
        }

        boolean union(int first, int second) {
            int firstRoot = find(first);
            int secondRoot = find(second);
            if (firstRoot == secondRoot) return false;
            if (rank[firstRoot] < rank[secondRoot]) {
                int temporary = firstRoot;
                firstRoot = secondRoot;
                secondRoot = temporary;
            }
            parent[secondRoot] = firstRoot;
            if (rank[firstRoot] == rank[secondRoot]) rank[firstRoot]++;
            return true;
        }
    }

    private static List<Vertex> vertices(Graph graph) {
        List<Vertex> result = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) result.add(vertex);
        return result;
    }

    private static void validateWeights(Graph graph) {
        for (Edge edge : graph.edges()) {
            if (!Float.isFinite(edge.getWeight())) throw new IllegalArgumentException("non-finite weight");
        }
    }

    /** Optional disconnected part adds isolated E and the component F—G of weight -2. */
    public static Graph createExampleGraph(boolean disconnected) {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A"), b = graph.addVertex("B");
        Vertex c = graph.addVertex("C"), d = graph.addVertex("D");
        a.addEdge(b, 1.0f); // Float selects weight; an int second argument selects colour.
        b.addEdge(c, 2.0f);
        a.addEdge(c, 5.0f);
        c.addEdge(d, 1.0f);
        if (disconnected) {
            graph.addVertex("E");
            Vertex f = graph.addVertex("F"), g = graph.addVertex("G");
            f.addEdge(g, -2.0f);
        }
        return graph;
    }

    /** MST can differ from a shortest-path tree: A—B:2, A—C:2, B—C:1. */
    public static Graph createContrastGraph() {
        Graph graph = new Graph();
        Vertex a = graph.addVertex("A"), b = graph.addVertex("B"), c = graph.addVertex("C");
        a.addEdge(b, 2.0f);
        a.addEdge(c, 2.0f);
        b.addEdge(c, 1.0f);
        return graph;
    }

    private static void print(String name, Result result) {
        System.out.println(name + ": weight=" + result.totalWeight()
                + ", components=" + result.components() + ", tree=" + result.isSpanningTree());
        List<String> descriptions = new ArrayList<>();
        for (Edge edge : result.edges()) {
            descriptions.add(edge.getStartPoint().getLabel() + "-" + edge.getEndPoint().getLabel());
        }
        System.out.println("Edges: " + descriptions);
    }

    public static void main(String[] args) {
        Graph connected = createExampleGraph(false);
        print("Prim", prim(connected));
        print("Kruskal", kruskal(connected));
        Graph disconnected = createExampleGraph(true);
        print("Prim forest", prim(disconnected));
        print("Kruskal forest", kruskal(disconnected));
        print("Empty", prim(new Graph()));
        System.out.println("Contrast MST weight: " + kruskal(createContrastGraph()).totalWeight());
        // From A in the contrast graph, the shortest-path tree uses A—B and A—C, total 4.
        // An MST has total 3 and includes B—C; its A-path to one other vertex costs 3, not 2.
    }
}
