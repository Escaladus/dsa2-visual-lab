import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Edmonds–Karp on a TRA DiGraph, with algorithm-owned paired residual entries. JDK 11+. */
public class TraMaxFlowExample {
    public static final long MAX_CAPACITY = 1_000_000_000L;

    // These are residual bookkeeping entries, not replacement input Edge/Graph classes.
    // Each input Edge gets its own pair, even when the opposite input Edge also exists.
    private static final class ResidualArc {
        final Vertex from;
        final Vertex to;
        final Edge original; // Null for the cancellation entry, which need not be a graph edge.
        ResidualArc reverse;
        long remaining;

        ResidualArc(Vertex from, Vertex to, long remaining, Edge original) {
            this.from = from; this.to = to;
            this.remaining = remaining; this.original = original;
        }
    }

    public static final class Result {
        private final List<Vertex> vertices;
        private final List<Edge> edges;
        private final List<Vertex> sourceSide;
        private final List<Edge> cutEdges;
        private final Map<Edge, Long> capacity = new IdentityHashMap<>();
        private final Map<Edge, Long> flow = new IdentityHashMap<>();
        private final long value;
        private final long cutCapacity;
        private final long reverseSteps;

        private Result(List<Vertex> vertices, List<Edge> edges, Map<Edge, Long> capacities,
                       Map<Edge, ResidualArc> forward, Map<Vertex, ResidualArc> reachable,
                       long value, long reverseSteps) {
            this.vertices = List.copyOf(vertices);
            this.edges = List.copyOf(edges);
            this.value = value;
            this.reverseSteps = reverseSteps;
            List<Vertex> side = new ArrayList<>();
            for (Vertex vertex : vertices) if (reachable.containsKey(vertex)) side.add(vertex);
            sourceSide = List.copyOf(side);
            List<Edge> cut = new ArrayList<>();
            long sum = 0;
            for (Edge edge : edges) {
                long limit = capacities.get(edge);
                capacity.put(edge, limit);
                flow.put(edge, limit - forward.get(edge).remaining);
                if (reachable.containsKey(edge.getStartPoint()) && !reachable.containsKey(edge.getEndPoint())) {
                    cut.add(edge);
                    sum = Math.addExact(sum, limit);
                }
            }
            cutEdges = List.copyOf(cut);
            cutCapacity = sum;
        }

        public List<Vertex> vertices() { return vertices; }
        public List<Edge> edges() { return edges; }
        public List<Vertex> sourceSide() { return sourceSide; }
        public List<Edge> cutEdges() { return cutEdges; }
        public long value() { return value; }
        public long cutCapacity() { return cutCapacity; }
        public long reverseSteps() { return reverseSteps; }
        public long flowOn(Edge edge) { return value(flow, edge); }
        public long capacityOf(Edge edge) { return value(capacity, edge); }

        private static long value(Map<Edge, Long> values, Edge edge) {
            if (!values.containsKey(edge)) throw new IllegalArgumentException("Foreign edge");
            return values.get(edge);
        }
    }

    /**
     * Distinct member source/sink are required. Stored float capacities must be finite integers
     * in [0, MAX_CAPACITY]. All input fields stay unchanged, including weights and colours.
     * Capacities/flows are exact longs after validation; no floating-point epsilon is used.
     */
    public static Result maxFlow(DiGraph graph, Vertex source, Vertex sink) {
        List<Vertex> vertices = new ArrayList<>();
        Map<Vertex, List<ResidualArc>> residual = new IdentityHashMap<>();
        for (Vertex vertex : graph.vertices()) {
            vertices.add(vertex);
            residual.put(vertex, new ArrayList<>());
        }
        if (source == sink || !residual.containsKey(source) || !residual.containsKey(sink)) {
            throw new IllegalArgumentException("Distinct source and sink must belong to the graph");
        }
        List<Edge> edges = new ArrayList<>();
        Map<Edge, Long> capacities = new IdentityHashMap<>();
        Map<Edge, ResidualArc> forward = new IdentityHashMap<>();
        for (Edge edge : graph.edges()) {
            double stored = edge.getWeight();
            if (!Double.isFinite(stored) || stored < 0 || stored > MAX_CAPACITY || stored != Math.rint(stored)) {
                throw new IllegalArgumentException("Capacity must be a finite integer in [0, 1000000000]");
            }
            long capacity = (long)stored;
            Vertex from = edge.getStartPoint(), to = edge.getEndPoint();
            ResidualArc out = new ResidualArc(from, to, capacity, edge);
            ResidualArc back = new ResidualArc(to, from, 0, null);
            out.reverse = back; back.reverse = out;
            residual.get(from).add(out); residual.get(to).add(back);
            edges.add(edge); capacities.put(edge, capacity); forward.put(edge, out);
        }

        long total = 0, reverseSteps = 0;
        while (true) {
            Map<Vertex, ResidualArc> parent = bfs(residual, source, sink);
            if (!parent.containsKey(sink)) {
                return new Result(vertices, edges, capacities, forward, parent, total, reverseSteps);
            }
            long amount = Long.MAX_VALUE;
            for (Vertex v = sink; v != source; v = parent.get(v).from) {
                amount = Math.min(amount, parent.get(v).remaining);
            }
            for (Vertex v = sink; v != source; v = parent.get(v).from) {
                ResidualArc arc = parent.get(v);
                arc.remaining -= amount;
                arc.reverse.remaining = Math.addExact(arc.reverse.remaining, amount);
                if (arc.original == null) reverseSteps++;
            }
            total = Math.addExact(total, amount);
        }
    }

    /** Fresh discovered map per BFS avoids clearing all V isolated vertices every round. */
    private static Map<Vertex, ResidualArc> bfs(Map<Vertex, List<ResidualArc>> residual,
                                               Vertex source, Vertex sink) {
        Map<Vertex, ResidualArc> parent = new IdentityHashMap<>();
        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        parent.put(source, null); // Mark before enqueueing, including this null-parent root.
        queue.offer(source);
        while (!queue.isEmpty() && !parent.containsKey(sink)) {
            Vertex vertex = queue.remove();
            for (ResidualArc arc : residual.get(vertex)) {
                if (arc.remaining <= 0 || parent.containsKey(arc.to)) continue;
                parent.put(arc.to, arc);
                queue.offer(arc.to);
            }
        }
        return parent;
    }

    public static DiGraph createExampleGraph() {
        DiGraph graph = new DiGraph();
        Vertex s = graph.addVertex("s"), a = graph.addVertex("a");
        Vertex b = graph.addVertex("b"), t = graph.addVertex("t");
        s.addEdge(a, 3.0f); s.addEdge(b, 2.0f); a.addEdge(b, 1.0f);
        a.addEdge(t, 2.0f); b.addEdge(t, 3.0f);
        return graph;
    }

    /** BFS first uses s→a→x→t, then needs cancellation x→a to reach total flow 2. */
    public static DiGraph createReroutingGraph() {
        DiGraph graph = new DiGraph();
        Vertex s = graph.addVertex("s"), a = graph.addVertex("a"), b = graph.addVertex("b");
        Vertex x = graph.addVertex("x"), y = graph.addVertex("y"), t = graph.addVertex("t");
        s.addEdge(a, 1.0f); s.addEdge(b, 1.0f); a.addEdge(x, 1.0f);
        a.addEdge(y, 1.0f); b.addEdge(x, 1.0f); x.addEdge(t, 1.0f); y.addEdge(t, 1.0f);
        return graph;
    }

    public static void main(String[] args) {
        DiGraph graph = createExampleGraph();
        List<Vertex> v = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) v.add(vertex);
        Result result = maxFlow(graph, v.get(0), v.get(3));
        List<String> side = new ArrayList<>();
        for (Vertex vertex : result.sourceSide()) side.add(vertex.getLabel());
        System.out.println("Flow: " + result.value());
        System.out.println("Cut capacity: " + result.cutCapacity());
        System.out.println("Source side: " + side);
        DiGraph reroute = createReroutingGraph();
        v.clear();
        for (Vertex vertex : reroute.vertices()) v.add(vertex);
        Result second = maxFlow(reroute, v.get(0), v.get(5));
        System.out.println("Rerouted flow: " + second.value());
        System.out.println("Reverse residual steps: " + second.reverseSteps());
        // getEdge is used only in this tiny console demonstration, outside the flow algorithm.
        System.out.println("Final a->x flow: " + second.flowOn(v.get(1).getEdge(v.get(3))));
    }
}
