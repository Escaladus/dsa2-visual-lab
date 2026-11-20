import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.IdentityHashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import static fi.uef.cs.tra.AbstractGraph.WHITE;
import static fi.uef.cs.tra.AbstractGraph.GREY;
import static fi.uef.cs.tra.AbstractGraph.BLACK;

/** Colour DFS/BFS over real TRA vertices/edges, with an explicit teaching order. JDK 11+. */
public class TraTraversalExample {
    public static final class State {
        public final List<Vertex> vertices;
        public final Vertex start;
        public final boolean directed;
        public boolean breadth;
        public int clock;
        public int neighborChecks;
        public final Map<Vertex, Integer> id = new IdentityHashMap<>();
        public final Map<Vertex, Integer> color = new IdentityHashMap<>();
        public final Map<Vertex, Integer> depth = new IdentityHashMap<>();
        public final Map<Vertex, Integer> distance = new IdentityHashMap<>();
        public final Map<Vertex, Integer> tin = new IdentityHashMap<>();
        public final Map<Vertex, Integer> tout = new IdentityHashMap<>();
        public final Map<Vertex, Vertex> parent = new IdentityHashMap<>();
        public final Map<Vertex, Vertex> root = new IdentityHashMap<>();
        public final Map<Vertex, Edge> parentEdge = new IdentityHashMap<>();
        public final Map<Vertex, List<Vertex>> neighbors = new IdentityHashMap<>();
        public final Map<Vertex, List<Edge>> outgoingEdges = new IdentityHashMap<>();
        public final List<Vertex> pre = new ArrayList<>();
        public final List<Vertex> post = new ArrayList<>();
        public final List<Vertex> discovered = pre;
        public final List<Vertex> completed = post;
        public final List<Vertex> removed = new ArrayList<>();
        // In Graph, the two adjacency directions refer to the same physical Edge.
        public final Map<Edge, String> types = new LinkedHashMap<>();
        public final List<Vertex> cycle = new ArrayList<>();

        State(AbstractGraph graph, List<Vertex> vertices, Vertex start, boolean reverse) {
            this.vertices = List.copyOf(vertices);
            this.start = start;
            this.directed = graph.isDiGraph();
            for (Vertex vertex : graph.vertices()) color.put(vertex, WHITE);
            for (int i = 0; i < vertices.size(); i++) {
                Vertex vertex = vertices.get(i);
                if (!color.containsKey(vertex) || id.put(vertex, i) != null) {
                    throw new IllegalArgumentException("Vertex order must list graph vertices once");
                }
            }
            if (id.size() != color.size()
                    || (vertices.isEmpty() ? start != null : !id.containsKey(start))) {
                throw new IllegalArgumentException("Invalid vertex order or start");
            }
            for (Vertex vertex : vertices) {
                vertex.setColor(WHITE);
                parent.put(vertex, null);
                root.put(vertex, null);
                depth.put(vertex, -1);
                distance.put(vertex, -1);
                tin.put(vertex, 0);
                tout.put(vertex, 0);
                // getEdge(next) scans incident edges in this JAR. Save aligned Edge references
                // once, rather than repeating that scan for every neighbour during DFS.
                List<Edge> outgoing = new ArrayList<>();
                for (Edge edge : vertex.edges()) outgoing.add(edge);
                Comparator<Edge> order = Comparator.comparingInt(edge -> id.get(edge.getEndPoint(vertex)));
                if (reverse) order = order.reversed();
                outgoing.sort(order);
                List<Vertex> adjacent = new ArrayList<>();
                for (Edge edge : outgoing) adjacent.add(edge.getEndPoint(vertex));
                neighbors.put(vertex, List.copyOf(adjacent));
                outgoingEdges.put(vertex, List.copyOf(outgoing));
            }
        }

        void captureColors() {
            // Results survive a later run resetting the mutable Vertex colours.
            for (Vertex vertex : vertices) color.put(vertex, vertex.getColor());
        }
    }

    /** vertices defines stable IDs/root order; reverse changes only neighbour order. */
    public static State traverse(AbstractGraph graph, List<Vertex> vertices, Vertex start,
                                 boolean all, boolean breadth, boolean reverse) {
        State state = new State(graph, vertices, start, reverse);
        state.breadth = breadth;
        if (start != null) {
            if (breadth) {
                bfs(start, state);
            } else {
                dfs(start, state);
            }
        }
        if (all) {
            for (Vertex v : state.vertices) {
                if (v.getColor() == WHITE) {
                    if (breadth) {
                        bfs(v, state);
                    } else {
                        dfs(v, state);
                    }
                }
            }
        }
        state.captureColors();
        return state;
    }

    /** i indexes a prepared Java List, not a field or index supplied by Vertex. */
    static void dfs(Vertex v, State state) {
        if (state.parent.get(v) == null) {
            state.root.put(v, v);
            state.depth.put(v, 0);
            state.distance.put(v, v == state.start ? 0 : -1);
        }
        v.setColor(GREY);
        state.tin.put(v, ++state.clock);
        state.pre.add(v);
        for (int i = 0; i < state.neighbors.get(v).size(); i++) {
            Vertex next = state.neighbors.get(v).get(i);
            Edge edge = state.outgoingEdges.get(v).get(i);
            state.neighborChecks++;
            if (next.getColor() == WHITE) {
                state.parent.put(next, v);
                state.parentEdge.put(next, edge);
                state.root.put(next, state.root.get(v));
                state.depth.put(next, state.depth.get(v) + 1);
                state.distance.put(next, state.root.get(v) == state.start ? state.depth.get(next) : -1);
                state.types.put(edge, "tree");
                dfs(next, state);
            } else if (!state.directed && edge == state.parentEdge.get(v)) {
                // The reverse view of this physical tree edge is not a cycle.
            } else {
                state.types.putIfAbsent(edge, classify(v, next, edge, state));
            }
        }
        state.post.add(v);
        state.tout.put(v, ++state.clock);
        v.setColor(BLACK);
    }

    /** Mark before enqueue; the dequeued Vertex remains GREY until its neighbours finish. */
    static void bfs(Vertex start, State state) {
        state.root.put(start, start);
        state.depth.put(start, 0);
        state.distance.put(start, start == state.start ? 0 : -1);
        LinkedQueue<Vertex> queue = new LinkedQueue<>();
        start.setColor(GREY);
        state.discovered.add(start);
        queue.offer(start);
        while (!queue.isEmpty()) {
            Vertex v = queue.remove();
            state.removed.add(v);
            for (int i = 0; i < state.neighbors.get(v).size(); i++) {
                Vertex next = state.neighbors.get(v).get(i);
                state.neighborChecks++;
                if (next.getColor() != WHITE) continue;
                next.setColor(GREY);
                state.parent.put(next, v);
                state.root.put(next, state.root.get(v));
                state.depth.put(next, state.depth.get(v) + 1);
                state.distance.put(next, state.root.get(v) == state.start ? state.depth.get(next) : -1);
                state.discovered.add(next);
                queue.offer(next);
            }
            state.completed.add(v);
            v.setColor(BLACK);
        }
    }

    static String classify(Vertex source, Vertex target, Edge edge, State state) {
        if (state.types.containsKey(edge)) return state.types.get(edge);
        String type;
        if (!state.directed || target.getColor() == GREY) {
            type = "back";
        } else if (state.tin.get(source) < state.tin.get(target)) {
            type = "forward";
        } else {
            type = "cross";
        }
        if (type.equals("back") && state.cycle.isEmpty()) {
            List<Vertex> branch = new ArrayList<>();
            for (Vertex v = source; v != target; v = state.parent.get(v)) branch.add(v);
            Collections.reverse(branch);
            state.cycle.add(target);
            state.cycle.addAll(branch);
            state.cycle.add(target);
        }
        return type;
    }

    public static List<Vertex> path(State state, Vertex target) {
        if (!state.id.containsKey(target) || state.root.get(target) != state.start) return List.of();
        List<Vertex> result = new ArrayList<>();
        for (Vertex v = target; v != null; v = state.parent.get(v)) result.add(v);
        Collections.reverse(result);
        return result;
    }

    public static List<Vertex> topological(State state) {
        if (!state.directed || state.breadth) throw new IllegalArgumentException("directed DFS required");
        if (!state.cycle.isEmpty()) throw new IllegalArgumentException("cycle");
        for (Vertex v : state.vertices) {
            if (state.color.get(v) != BLACK) throw new IllegalArgumentException("full DFS required");
        }
        List<Vertex> result = new ArrayList<>(state.post);
        Collections.reverse(result);
        return result;
    }

    public static List<Integer> ids(State state, List<Vertex> vertices) {
        List<Integer> result = new ArrayList<>();
        for (Vertex vertex : vertices) result.add(state.id.get(vertex));
        return result;
    }

    public static Map<String, String> edgeDescriptions(State state) {
        Map<String, String> result = new LinkedHashMap<>();
        for (Map.Entry<Edge, String> entry : state.types.entrySet()) {
            int from = state.id.get(entry.getKey().getStartPoint());
            int to = state.id.get(entry.getKey().getEndPoint());
            String key = state.directed || from <= to ? from + ":" + to : to + ":" + from;
            result.put(key, entry.getValue());
        }
        return result;
    }

    public static void main(String[] args) {
        DiGraph graph = new DiGraph();
        List<Vertex> vertices = new ArrayList<>();
        for (int i = 0; i < 5; i++) vertices.add(graph.addVertex(String.valueOf(i)));
        vertices.get(0).addEdge(vertices.get(1));
        vertices.get(0).addEdge(vertices.get(2));
        vertices.get(0).addEdge(vertices.get(3));
        vertices.get(1).addEdge(vertices.get(2));
        Edge back = vertices.get(2).addEdge(vertices.get(0));
        vertices.get(3).addEdge(vertices.get(2));
        State dfs = traverse(graph, vertices, vertices.get(0), true, false, false);
        System.out.println(ids(dfs, dfs.pre));
        System.out.println(ids(dfs, dfs.post));
        System.out.println(edgeDescriptions(dfs));
        System.out.println(ids(dfs, dfs.cycle));

        // Removing 2→0 makes the same example a DAG. Vertex 4 remains isolated.
        vertices.get(2).removeEdge(back);
        State breadth = traverse(graph, vertices, vertices.get(0), true, true, false);
        List<Integer> distances = new ArrayList<>();
        for (Vertex vertex : vertices) distances.add(breadth.distance.get(vertex));
        System.out.println(distances);
        System.out.println(ids(breadth, path(breadth, vertices.get(2))));
        State dag = traverse(graph, vertices, vertices.get(0), true, false, false);
        System.out.println(ids(dag, topological(dag)));
    }
}
