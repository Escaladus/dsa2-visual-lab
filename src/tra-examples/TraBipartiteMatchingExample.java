import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Maximum-cardinality matching for an explicitly partitioned TRA Graph. JDK 11+. */
public class TraBipartiteMatchingExample {
    public static final class Result {
        private final List<Vertex> left;
        private final List<Vertex> right;
        private final List<Edge> edges;
        private final Map<Vertex, Vertex> partner = new IdentityHashMap<>();

        private Result(List<Vertex> left, List<Vertex> right, Map<Vertex, Vertex> owner,
                       Map<Vertex, Edge> chosen) {
            this.left = List.copyOf(left);
            this.right = List.copyOf(right);
            for (Vertex v : left) partner.put(v, null);
            for (Vertex v : right) partner.put(v, null);
            List<Edge> selected = new ArrayList<>();
            for (Vertex v : right) {
                Vertex u = owner.get(v);
                if (u == null) continue;
                partner.put(u, v); partner.put(v, u);
                selected.add(chosen.get(v));
            }
            edges = List.copyOf(selected);
        }

        public List<Vertex> left() { return left; }
        public List<Vertex> right() { return right; }
        public List<Edge> edges() { return edges; }
        public int size() { return edges.size(); }
        public Vertex partnerOf(Vertex vertex) {
            if (!partner.containsKey(vertex)) throw new IllegalArgumentException("Foreign vertex");
            return partner.get(vertex); // Null means unmatched, not an invalid vertex.
        }
    }

    /**
     * left is a duplicate-free list of member vertices; right is its complement in Graph.
     * Every input edge must cross that supplied partition. This method does not choose the sides.
     * Weights are ignored: the objective is maximum cardinality, not maximum weight.
     */
    public static Result match(Graph graph, List<Vertex> left) {
        Set<Vertex> members = Collections.newSetFromMap(new IdentityHashMap<Vertex, Boolean>());
        for (Vertex vertex : graph.vertices()) members.add(vertex);
        Set<Vertex> leftSet = Collections.newSetFromMap(new IdentityHashMap<Vertex, Boolean>());
        for (Vertex vertex : left) {
            if (!members.contains(vertex) || !leftSet.add(vertex)) {
                throw new IllegalArgumentException("Left side must contain distinct graph vertices");
            }
        }
        List<Vertex> right = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) if (!leftSet.contains(vertex)) right.add(vertex);
        for (Edge edge : graph.edges()) {
            if (leftSet.contains(edge.getStartPoint()) == leftSet.contains(edge.getEndPoint())) {
                throw new IllegalArgumentException("Every edge must cross the supplied partition");
            }
        }
        Map<Vertex, Vertex> owner = new IdentityHashMap<>();
        Map<Vertex, Edge> chosen = new IdentityHashMap<>();
        for (Vertex vertex : left) {
            Set<Vertex> seen = Collections.newSetFromMap(new IdentityHashMap<Vertex, Boolean>());
            augment(vertex, seen, owner, chosen);
        }
        return new Result(left, right, owner, chosen);
    }

    private static boolean augment(Vertex left, Set<Vertex> seen, Map<Vertex, Vertex> owner,
                                   Map<Vertex, Edge> chosen) {
        for (Edge edge : left.edges()) {
            Vertex right = edge.getEndPoint(left);
            if (!seen.add(right)) continue;
            Vertex previous = owner.get(right);
            if (previous == null || augment(previous, seen, owner, chosen)) {
                owner.put(right, left); // Previous owner has moved; use this alternating path.
                chosen.put(right, edge);
                return true;
            }
        }
        return false;
    }

    /** L0:[R0,R1], L1:[R0], plus isolated R2: the second search must reassign L0. */
    public static Graph createExampleGraph() {
        Graph graph = new Graph();
        Vertex l0 = graph.addVertex("L0"), l1 = graph.addVertex("L1");
        Vertex r0 = graph.addVertex("R0"), r1 = graph.addVertex("R1");
        graph.addVertex("R2");
        l0.addEdge(r0); l0.addEdge(r1); l1.addEdge(r0);
        return graph;
    }

    public static void main(String[] args) {
        Graph graph = createExampleGraph();
        List<Vertex> v = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) v.add(vertex);
        Result result = match(graph, List.of(v.get(0), v.get(1)));
        List<String> pairs = new ArrayList<>();
        for (Vertex right : result.right()) {
            Vertex left = result.partnerOf(right);
            if (left != null) pairs.add(left.getLabel() + "-" + right.getLabel());
        }
        System.out.println("Size: " + result.size());
        System.out.println("Pairs: " + pairs);
        System.out.println("L0 partner: " + result.partnerOf(v.get(0)).getLabel());
        System.out.println("R2 unmatched: " + (result.partnerOf(v.get(4)) == null));
    }
}
