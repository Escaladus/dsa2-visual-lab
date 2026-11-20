import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/** Deletion, exhaustive matching and exhaustive min-cut references; no lesson algorithm reused. */
public class TraGraphAnalysisChecks {
    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    private static <T> Set<T> identitySet() {
        return Collections.newSetFromMap(new IdentityHashMap<T, Boolean>());
    }

    private static List<Vertex> vertices(AbstractGraph graph) {
        List<Vertex> result = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) result.add(vertex);
        return result;
    }

    private static List<Edge> edges(AbstractGraph graph) {
        List<Edge> result = new ArrayList<>();
        for (Edge edge : graph.edges()) result.add(edge);
        return result;
    }

    private static String snapshot(AbstractGraph graph) {
        List<Vertex> vertices = vertices(graph);
        StringBuilder out = new StringBuilder();
        for (Vertex v : vertices) out.append(v.getLabel()).append(':').append(v.getColor())
                .append(':').append(v.getIndex()).append(':').append(v.getWeight()).append(';');
        for (Edge e : graph.edges()) out.append(vertices.indexOf(e.getStartPoint())).append('>')
                .append(vertices.indexOf(e.getEndPoint())).append(':').append(e.getWeight())
                .append(':').append(e.getColor()).append(':').append(e.getLabel()).append(';');
        return out.toString();
    }

    private static void prepare(AbstractGraph graph) {
        int i = 0;
        for (Vertex v : graph.vertices()) {
            v.setColor(AbstractGraph.RED); v.setIndex(100 + i++); v.setWeight(-99.0f);
        }
        for (Edge e : graph.edges()) e.setColor(AbstractGraph.BLUE);
    }

    private static void rejects(Runnable action) {
        try { action.run(); }
        catch (IllegalArgumentException expected) { return; }
        throw new AssertionError("Invalid input/query must be rejected");
    }

    private static void readOnly(Runnable action) {
        try { action.run(); }
        catch (UnsupportedOperationException expected) { return; }
        throw new AssertionError("Result list must be read-only");
    }

    private static int components(Graph graph, Vertex omit, Edge removed) {
        Set<Vertex> seen = identitySet();
        int count = 0;
        for (Vertex root : graph.vertices()) {
            if (root == omit || !seen.add(root)) continue;
            count++;
            ArrayDeque<Vertex> queue = new ArrayDeque<>();
            queue.add(root);
            while (!queue.isEmpty()) {
                Vertex v = queue.remove();
                for (Edge edge : v.edges()) {
                    if (edge == removed) continue;
                    Vertex next = edge.getEndPoint(v);
                    if (next != omit && seen.add(next)) queue.add(next);
                }
            }
        }
        return count;
    }

    private static void cuts(Graph graph) {
        prepare(graph);
        String before = snapshot(graph);
        TraGraphCutsExample.Result result = TraGraphCutsExample.find(graph);
        int base = components(graph, null, null);
        Set<Vertex> actualCuts = identitySet(); actualCuts.addAll(result.articulation());
        Set<Edge> actualBridges = identitySet(); actualBridges.addAll(result.bridges());
        check(actualCuts.size() == result.articulation().size(), "Unique articulation objects");
        check(actualBridges.size() == result.bridges().size(), "Unique physical bridges");
        Set<Integer> times = new java.util.HashSet<>();
        for (Vertex v : graph.vertices()) {
            check(actualCuts.contains(v) == (components(graph, v, null) > base), "Cuts versus vertex deletion");
            int tin = result.discovery(v), low = result.low(v);
            check(tin > 0 && tin <= graph.vertexCount() && times.add(tin), "Unique discovery times");
            check(low > 0 && low <= tin, "Valid low bounds");
        }
        for (Edge edge : graph.edges()) {
            check(actualBridges.contains(edge) == (components(graph, null, edge) > base), "Bridges versus edge deletion");
        }
        check(actualCuts.stream().allMatch(vertices(graph)::contains), "Only input vertices returned");
        check(actualBridges.stream().allMatch(edges(graph)::contains), "Only actual input Edge objects returned");
        TraGraphCutsExample.find(graph);
        TraGraphCutsExample.find(new Graph());
        for (Vertex v : graph.vertices()) check(times.contains(result.discovery(v)), "Earlier times survive rerun");
        rejects(() -> result.discovery(new Graph().addVertex("same")));
        rejects(() -> result.low(null));
        if (!result.bridges().isEmpty()) readOnly(() -> result.bridges().remove(0));
        if (!result.articulation().isEmpty()) readOnly(() -> result.articulation().remove(0));
        check(snapshot(graph).equals(before), "Cuts preserve every input field");
    }

    private static int exhaustiveMatching(boolean[][] adjacent, int left, boolean[] used) {
        if (left == adjacent.length) return 0;
        int best = exhaustiveMatching(adjacent, left + 1, used);
        for (int r = 0; r < used.length; r++) {
            if (!adjacent[left][r] || used[r]) continue;
            used[r] = true;
            best = Math.max(best, 1 + exhaustiveMatching(adjacent, left + 1, used));
            used[r] = false;
        }
        return best;
    }

    private static void matching(Graph graph, List<Vertex> left) {
        prepare(graph);
        String before = snapshot(graph);
        List<Vertex> all = vertices(graph), right = new ArrayList<>(all); right.removeAll(left);
        boolean[][] adjacent = new boolean[left.size()][right.size()];
        for (int i = 0; i < left.size(); i++) {
            for (Vertex next : left.get(i).neighbors()) adjacent[i][right.indexOf(next)] = true;
        }
        TraBipartiteMatchingExample.Result result = TraBipartiteMatchingExample.match(graph, left);
        check(result.size() == exhaustiveMatching(adjacent, 0, new boolean[right.size()]), "Maximum, not merely maximal, matching");
        check(result.left().equals(left) && result.right().equals(right), "Supplied partition and isolated vertices");
        Set<Vertex> used = identitySet();
        Set<Edge> inputs = identitySet(); inputs.addAll(edges(graph));
        for (Edge e : result.edges()) {
            check(inputs.contains(e), "Matching uses actual Edge identity");
            Vertex a = e.getStartPoint(), b = e.getEndPoint();
            check(used.add(a) && used.add(b), "No vertex participates twice");
            check(result.partnerOf(a) == b && result.partnerOf(b) == a, "Symmetric partners");
        }
        for (Vertex v : all) check((result.partnerOf(v) != null) == used.contains(v), "Unmatched is null");
        List<Edge> saved = new ArrayList<>(result.edges());
        TraBipartiteMatchingExample.match(graph, left);
        check(result.edges().equals(saved), "Matching results survive another run");
        rejects(() -> result.partnerOf(new Graph().addVertex("same")));
        if (!result.edges().isEmpty()) readOnly(() -> result.edges().remove(0));
        check(snapshot(graph).equals(before), "Matching ignores weights and preserves input");
    }

    private static long minCut(DiGraph graph, List<Vertex> vertices, int source, int sink) {
        long best = Long.MAX_VALUE;
        for (int mask = 0; mask < (1 << vertices.size()); mask++) {
            if ((mask & (1 << source)) == 0 || (mask & (1 << sink)) != 0) continue;
            long sum = 0;
            for (Edge edge : graph.edges()) {
                int from = vertices.indexOf(edge.getStartPoint()), to = vertices.indexOf(edge.getEndPoint());
                if ((mask & (1 << from)) != 0 && (mask & (1 << to)) == 0) sum += (long)edge.getWeight();
            }
            best = Math.min(best, sum);
        }
        return best;
    }

    private static void flow(DiGraph graph, int source, int sink) {
        prepare(graph);
        List<Vertex> v = vertices(graph);
        String before = snapshot(graph);
        TraMaxFlowExample.Result result = TraMaxFlowExample.maxFlow(graph, v.get(source), v.get(sink));
        check(result.value() == minCut(graph, v, source, sink), "Flow equals independently enumerated minimum cut");
        long[] balance = new long[v.size()];
        Set<Vertex> side = identitySet(); side.addAll(result.sourceSide());
        check(side.contains(v.get(source)) && !side.contains(v.get(sink)), "Residual source side separates terminals");
        Set<Edge> cut = identitySet(); cut.addAll(result.cutEdges());
        long capacity = 0;
        for (Edge edge : graph.edges()) {
            long f = result.flowOn(edge), c = result.capacityOf(edge);
            check(c == (long)edge.getWeight() && f >= 0 && f <= c, "Physical edge capacity and nonnegative flow");
            int from = v.indexOf(edge.getStartPoint()), to = v.indexOf(edge.getEndPoint());
            balance[from] += f; balance[to] -= f;
            boolean crosses = side.contains(edge.getStartPoint()) && !side.contains(edge.getEndPoint());
            check(cut.contains(edge) == crosses, "Cut contains exactly original outward crossing edges");
            if (crosses) capacity += c;
        }
        for (int i = 0; i < v.size(); i++) {
            check(balance[i] == (i == source ? result.value() : i == sink ? -result.value() : 0), "Flow conservation");
        }
        check(capacity == result.cutCapacity() && capacity == result.value(), "Cut witness equals value");
        Map<Edge, Long> old = new IdentityHashMap<>();
        for (Edge edge : graph.edges()) old.put(edge, result.flowOn(edge));
        TraMaxFlowExample.maxFlow(graph, v.get(sink), v.get(source));
        for (Edge edge : graph.edges()) check(old.get(edge) == result.flowOn(edge), "Earlier edge flows survive repeat");
        DiGraph other = new DiGraph();
        Edge foreign = other.addVertex("same").addEdge(other.addVertex("same"), 1.0f);
        rejects(() -> result.flowOn(foreign)); rejects(() -> result.capacityOf(foreign));
        readOnly(() -> result.sourceSide().remove(0));
        check(snapshot(graph).equals(before), "Residual reversals never mutate the input graph");
    }

    private static void boundaries() {
        cuts(new Graph()); cuts(TraGraphCutsExample.createExampleGraph());
        Graph example = TraBipartiteMatchingExample.createExampleGraph();
        matching(example, vertices(example).subList(0, 2));
        matching(new Graph(), List.of());
        Graph invalid = new Graph(); Vertex a = invalid.addVertex("same"), b = invalid.addVertex("same"); a.addEdge(b);
        rejects(() -> TraBipartiteMatchingExample.match(invalid, List.of(a, a)));
        rejects(() -> TraBipartiteMatchingExample.match(invalid, List.of(new Graph().addVertex("same"))));
        rejects(() -> TraBipartiteMatchingExample.match(invalid, List.of()));
        rejects(() -> TraBipartiteMatchingExample.match(invalid, List.of(a, b)));
        flow(TraMaxFlowExample.createExampleGraph(), 0, 3);
        DiGraph reroute = TraMaxFlowExample.createReroutingGraph(); flow(reroute, 0, 5);
        List<Vertex> rv = vertices(reroute);
        TraMaxFlowExample.Result rr = TraMaxFlowExample.maxFlow(reroute, rv.get(0), rv.get(5));
        check(rr.reverseSteps() > 0 && rr.flowOn(rv.get(1).getEdge(rv.get(3))) == 0, "Real cancellation is exercised");
        check(rv.get(3).getEdge(rv.get(1)) == null, "Cancellation arc need not be an input edge");
        DiGraph antiparallel = new DiGraph(); Vertex s = antiparallel.addVertex("same"), t = antiparallel.addVertex("same");
        s.addEdge(t, 3.0f); Edge opposite = t.addEdge(s, 5.0f); flow(antiparallel, 0, 1);
        check(TraMaxFlowExample.maxFlow(antiparallel, s, t).flowOn(opposite) == 0, "Original reverse Edge is independent");
        DiGraph large = new DiGraph(); s = large.addVertex("same"); t = large.addVertex("same");
        for (int i = 0; i < 3; i++) { Vertex mid = large.addVertex("same"); s.addEdge(mid, 1_000_000_000.0f); mid.addEdge(t, 1_000_000_000.0f); }
        flow(large, 0, 1);
        check(TraMaxFlowExample.maxFlow(large, s, t).value() == 3_000_000_000L, "Long flow beyond int range");
        for (float bad : new float[]{-1, 0.5f, Float.NaN, Float.POSITIVE_INFINITY, Float.NEGATIVE_INFINITY, 1_000_000_064.0f}) {
            DiGraph graph = new DiGraph(); Vertex first = graph.addVertex("same"), last = graph.addVertex("same");
            graph.addVertex("unreachable").addEdge(last, bad);
            String before = snapshot(graph);
            rejects(() -> TraMaxFlowExample.maxFlow(graph, first, last));
            check(snapshot(graph).equals(before), "Invalid capacities rejected without mutation");
        }
        DiGraph terminals = new DiGraph(); Vertex first = terminals.addVertex("same"), last = terminals.addVertex("same");
        rejects(() -> TraMaxFlowExample.maxFlow(terminals, first, first));
        rejects(() -> TraMaxFlowExample.maxFlow(terminals, null, last));
        rejects(() -> TraMaxFlowExample.maxFlow(terminals, first, new DiGraph().addVertex("same")));
        rejects(() -> TraMaxFlowExample.maxFlow(new DiGraph(), null, null));
        flow(terminals, 0, 1);
    }

    public static void main(String[] args) {
        boundaries();
        Random random = new Random(2026112063L);
        for (int run = 0; run < 160; run++) {
            Graph graph = new Graph(); List<Vertex> v = new ArrayList<>();
            int n = random.nextInt(9);
            for (int i = 0; i < n; i++) v.add(graph.addVertex("same"));
            for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) {
                if (random.nextInt(4) == 0) v.get(j).addEdge(v.get(i), Float.NaN); // Topology ignores weights.
            }
            cuts(graph);
        }
        for (int run = 0; run < 160; run++) {
            Graph graph = new Graph(); List<Vertex> left = new ArrayList<>(), right = new ArrayList<>();
            int l = random.nextInt(6), r = random.nextInt(6);
            for (int i = 0; i < l; i++) left.add(graph.addVertex("same"));
            for (int i = 0; i < r; i++) right.add(graph.addVertex("same"));
            for (Vertex u : left) for (Vertex w : right) {
                if (random.nextInt(3) == 0) w.addEdge(u, Float.NaN);
            }
            matching(graph, left);
        }
        for (int run = 0; run < 160; run++) {
            DiGraph graph = new DiGraph(); List<Vertex> v = new ArrayList<>();
            int n = 2 + random.nextInt(6);
            for (int i = 0; i < n; i++) v.add(graph.addVertex("same"));
            for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) {
                if (random.nextInt(4) == 0) v.get(i).addEdge(v.get(j), (float)random.nextInt(8));
            }
            flow(graph, 0, n - 1); flow(graph, n - 1, 0);
        }
        System.out.println("TRA graph analysis passed: 160 cuts, 160 matching and 160 directed flow graphs plus boundaries");
    }
}
