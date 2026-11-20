import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/** Articulation vertices and physical bridge edges of an undirected TRA Graph. JDK 11+. */
public class TraGraphCutsExample {
    public static final class Result {
        private final List<Vertex> articulation;
        private final List<Edge> bridges;
        private final Map<Vertex, Integer> tin;
        private final Map<Vertex, Integer> low;

        private Result(Search state) {
            List<Vertex> cuts = new ArrayList<>();
            for (Vertex vertex : state.vertices) if (state.cuts.contains(vertex)) cuts.add(vertex);
            articulation = List.copyOf(cuts);
            bridges = List.copyOf(state.bridges);
            tin = Collections.unmodifiableMap(new IdentityHashMap<>(state.tin));
            low = Collections.unmodifiableMap(new IdentityHashMap<>(state.low));
        }

        public List<Vertex> articulation() { return articulation; }
        public List<Edge> bridges() { return bridges; }
        public int discovery(Vertex vertex) { return value(tin, vertex); }
        public int low(Vertex vertex) { return value(low, vertex); }

        private static int value(Map<Vertex, Integer> values, Vertex vertex) {
            if (!values.containsKey(vertex)) throw new IllegalArgumentException("Foreign vertex");
            return values.get(vertex);
        }
    }

    private static final class Search {
        final List<Vertex> vertices = new ArrayList<>();
        final Map<Vertex, Integer> tin = new IdentityHashMap<>();
        final Map<Vertex, Integer> low = new IdentityHashMap<>();
        final Set<Vertex> cuts = Collections.newSetFromMap(new IdentityHashMap<Vertex, Boolean>());
        final List<Edge> bridges = new ArrayList<>();
        int clock;
    }

    /** All components, including isolated vertices. Weights and every input field are untouched. */
    public static Result find(Graph graph) {
        Search state = new Search();
        for (Vertex vertex : graph.vertices()) {
            state.vertices.add(vertex);
            state.tin.put(vertex, 0);
            state.low.put(vertex, 0);
        }
        for (Vertex root : state.vertices) {
            if (state.tin.get(root) == 0) dfs(root, null, state);
        }
        return new Result(state);
    }

    private static void dfs(Vertex vertex, Edge parentEdge, Search state) {
        int entered = ++state.clock;
        state.tin.put(vertex, entered);
        state.low.put(vertex, entered);
        int children = 0;
        for (Edge edge : vertex.edges()) {
            if (edge == parentEdge) continue; // Same physical tree edge, seen from its other end.
            Vertex next = edge.getEndPoint(vertex);
            if (state.tin.get(next) == 0) {
                children++;
                dfs(next, edge, state);
                state.low.put(vertex, Math.min(state.low.get(vertex), state.low.get(next)));
                if (parentEdge != null && state.low.get(next) >= entered) state.cuts.add(vertex);
                if (state.low.get(next) > entered) state.bridges.add(edge);
            } else {
                // A non-tree edge contributes the neighbour's entry time, not its low value.
                state.low.put(vertex, Math.min(state.low.get(vertex), state.tin.get(next)));
            }
        }
        if (parentEdge == null && children > 1) state.cuts.add(vertex);
    }

    /** Triangle 0–1–2, tail 1–3–4 and isolated 5. */
    public static Graph createExampleGraph() {
        Graph graph = new Graph();
        Vertex[] v = new Vertex[6];
        for (int i = 0; i < v.length; i++) v[i] = graph.addVertex(String.valueOf(i));
        v[0].addEdge(v[1]); v[0].addEdge(v[2]); v[1].addEdge(v[2]);
        v[1].addEdge(v[3]); v[3].addEdge(v[4]);
        return graph;
    }

    public static void main(String[] args) {
        Graph graph = createExampleGraph();
        Result result = find(graph);
        List<String> cuts = new ArrayList<>();
        for (Vertex vertex : result.articulation()) cuts.add(vertex.getLabel());
        // Sorting is only for stable console presentation, not part of the DFS core.
        Set<String> bridges = new TreeSet<>();
        for (Edge edge : result.bridges()) {
            int a = Integer.parseInt(edge.getStartPoint().getLabel());
            int b = Integer.parseInt(edge.getEndPoint().getLabel());
            bridges.add(Math.min(a, b) + "-" + Math.max(a, b));
        }
        List<Integer> tin = new ArrayList<>(), low = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) {
            tin.add(result.discovery(vertex)); low.add(result.low(vertex));
        }
        System.out.println("Articulation: " + cuts);
        System.out.println("Bridges: " + bridges);
        System.out.println("tin: " + tin);
        System.out.println("low: " + low);
    }
}
