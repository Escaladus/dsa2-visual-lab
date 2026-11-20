import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/** Property checks against independent closure/Kahn references, not one required listing. */
public class TraApplicationsChecks {
    private static void check(boolean condition, String description) {
        if (!condition) throw new AssertionError(description);
    }

    private static List<Vertex> vertices(AbstractGraph graph) {
        List<Vertex> result = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) result.add(vertex);
        return result;
    }

    private static boolean[][] adjacency(List<Vertex> vertices) {
        boolean[][] result = new boolean[vertices.size()][vertices.size()];
        for (int i = 0; i < vertices.size(); i++) {
            for (Vertex next : vertices.get(i).neighbors()) {
                int j = vertices.indexOf(next);
                check(j >= 0, "Every neighbour belongs to the graph");
                result[i][j] = true;
            }
        }
        return result;
    }

    private static String snapshot(AbstractGraph graph, List<Vertex> vertices) {
        StringBuilder result = new StringBuilder();
        for (Vertex vertex : graph.vertices()) {
            result.append(vertices.indexOf(vertex)).append(':').append(vertex.getLabel()).append(';');
        }
        for (Edge edge : graph.edges()) {
            result.append(vertices.indexOf(edge.getStartPoint())).append('>')
                  .append(vertices.indexOf(edge.getEndPoint())).append(':')
                  .append(edge.getWeight()).append(':').append(edge.getColor()).append(';');
        }
        return result.toString();
    }

    private static int[][] distances(boolean[][] edges) {
        int n = edges.length;
        int[][] result = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(result[i], 1000);
            result[i][i] = 0;
            for (int j = 0; j < n; j++) if (edges[i][j] && i != j) result[i][j] = 1;
        }
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    result[i][j] = Math.min(result[i][j], result[i][k] + result[k][j]);
                }
            }
        }
        return result;
    }

    private static boolean directedCycle(boolean[][] edges) {
        int[] indegree = new int[edges.length];
        for (boolean[] row : edges) {
            for (int j = 0; j < row.length; j++) if (row[j]) indegree[j]++;
        }
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        for (int i = 0; i < indegree.length; i++) if (indegree[i] == 0) queue.add(i);
        int removed = 0;
        while (!queue.isEmpty()) {
            int i = queue.remove();
            removed++;
            for (int j = 0; j < edges.length; j++) {
                if (edges[i][j] && --indegree[j] == 0) queue.add(j);
            }
        }
        return removed != edges.length;
    }

    private static void verifyOrder(List<Vertex> order, List<Vertex> vertices, boolean[][] edges) {
        Map<Vertex, Integer> position = new IdentityHashMap<>();
        check(order.size() == vertices.size(), "Order covers every vertex, including isolated roots");
        for (int i = 0; i < order.size(); i++) {
            check(vertices.contains(order.get(i)), "Order contains only graph vertices");
            check(position.put(order.get(i), i) == null, "No duplicate vertex in order");
        }
        for (int i = 0; i < edges.length; i++) {
            for (int j = 0; j < edges.length; j++) {
                if (edges[i][j]) check(position.get(vertices.get(i)) < position.get(vertices.get(j)),
                        "Every directed edge must point forward in a valid order");
            }
        }
    }

    private static void verifyPath(List<Vertex> path, Vertex start, Vertex target,
                                   List<Vertex> vertices, boolean[][] edges) {
        check(!path.isEmpty() && path.get(0) == start && path.get(path.size() - 1) == target,
                "Path endpoints use vertex identity");
        Map<Vertex, Boolean> seen = new IdentityHashMap<>();
        for (int i = 0; i < path.size(); i++) {
            check(seen.put(path.get(i), true) == null, "Parent path has no repeated vertex");
            if (i > 0) check(edges[vertices.indexOf(path.get(i - 1))][vertices.indexOf(path.get(i))],
                    "Path follows actual edges in the correct direction");
        }
    }

    private static void verifyWitness(TraTraversalExample.State state, List<Vertex> vertices,
                                      boolean[][] edges) {
        List<Vertex> cycle = state.cycle;
        if (cycle.isEmpty()) return;
        check(cycle.size() >= (state.directed ? 2 : 4), "Parent reversal is not an undirected cycle");
        check(cycle.get(0) == cycle.get(cycle.size() - 1), "Witness closes at the same vertex");
        Map<Vertex, Boolean> seen = new IdentityHashMap<>();
        for (int i = 1; i < cycle.size(); i++) {
            check(seen.put(cycle.get(i), true) == null, "Witness has no repeated interior vertex");
            check(edges[vertices.indexOf(cycle.get(i - 1))][vertices.indexOf(cycle.get(i))],
                    "Witness uses real directed/undirected edges");
        }
    }

    private static void verifyTraversals(AbstractGraph graph, List<Vertex> vertices,
                                         boolean[][] edges, int[][] distance, boolean cyclic) {
        for (int start : vertices.isEmpty() ? new int[]{-1} : new int[]{0, vertices.size() - 1}) {
            Vertex first = start < 0 ? null : vertices.get(start);
            for (boolean all : new boolean[]{false, true}) {
                for (boolean breadth : new boolean[]{false, true}) {
                    for (boolean reverse : new boolean[]{false, true}) {
                        TraTraversalExample.State state = TraTraversalExample.traverse(
                                graph, vertices, first, all, breadth, reverse);
                        check(new java.util.HashSet<>(state.pre).size() == state.pre.size(),
                                "Each vertex is discovered only once");
                        for (int target = 0; target < vertices.size(); target++) {
                            Vertex vertex = vertices.get(target);
                            List<Vertex> path = TraTraversalExample.path(state, vertex);
                            boolean reachable = distance[start][target] < 1000;
                            if (!reachable) {
                                check(path.isEmpty() && state.distance.get(vertex) == -1,
                                        "Later forest roots stay unreachable from the original start");
                            } else {
                                verifyPath(path, first, vertex, vertices, edges);
                                check(state.distance.get(vertex) == path.size() - 1, "Stored path length");
                                if (breadth) check(path.size() - 1 == distance[start][target],
                                        "BFS path is shortest; any equally short path is valid");
                            }
                            check(state.color.get(vertex) == (all || reachable ? AbstractGraph.BLACK : AbstractGraph.WHITE),
                                    "Completed reachable/full scope colours");
                            if (state.root.get(vertex) == vertex) check(state.depth.get(vertex) == 0,
                                    "Every forest root has its own depth zero");
                        }
                        check(TraTraversalExample.path(state, new DiGraph().addVertex("same")).isEmpty(),
                                "A foreign target with the same label is not reachable");
                        if (!breadth) {
                            verifyWitness(state, vertices, edges);
                            if (all) check(!state.cycle.isEmpty() == cyclic, "Whole-graph cycle decision");
                            if (all && graph.isDiGraph() && !cyclic) {
                                verifyOrder(TraTraversalExample.topological(state), vertices, edges);
                            }
                        }
                    }
                }
            }
        }
    }

    private static void verifyUndirected(Graph graph) {
        List<Vertex> vertices = vertices(graph);
        boolean[][] edges = adjacency(vertices);
        int[][] distance = distances(edges);
        String before = snapshot(graph, vertices);
        for (Vertex vertex : vertices) vertex.setColor(AbstractGraph.RED);
        List<List<Vertex>> components = TraComponentsExample.components(graph);
        int[] group = new int[vertices.size()];
        Arrays.fill(group, -1);
        for (int c = 0; c < components.size(); c++) {
            check(!components.get(c).isEmpty(), "No empty component");
            for (Vertex vertex : components.get(c)) {
                int v = vertices.indexOf(vertex);
                check(v >= 0 && group[v] == -1, "Components contain each input vertex once");
                group[v] = c;
            }
        }
        for (int i = 0; i < vertices.size(); i++) {
            check(group[i] >= 0 && vertices.get(i).getColor() == AbstractGraph.BLACK, "Component coverage");
            for (int j = 0; j < vertices.size(); j++) {
                check((group[i] == group[j]) == (distance[i][j] < 1000), "Exactly the connected partition");
            }
        }
        int edgeCount = 0;
        for (Edge ignored : graph.edges()) edgeCount++;
        boolean cyclic = edgeCount > vertices.size() - components.size(); // Forest edge-count property.
        for (Vertex vertex : vertices) vertex.setColor(AbstractGraph.RED);
        check(TraComponentsExample.hasCycle(graph) == cyclic, "Undirected cycle versus forest property");
        for (Vertex vertex : vertices) check(vertex.getColor() == AbstractGraph.BLACK, "Cycle scan completes all roots");
        List<List<Vertex>> again = TraComponentsExample.components(graph);
        check(again.equals(components) && again != components, "Repeat run with fresh result containers");
        for (int i = 0; i < again.size(); i++) check(again.get(i) != components.get(i), "Owned component lists");
        verifyTraversals(graph, vertices, edges, distance, cyclic);
        check(snapshot(graph, vertices).equals(before), "Colours may change; topology/labels/weights/edge colours stay intact");
    }

    private static void verifyDirected(DiGraph graph) {
        List<Vertex> vertices = vertices(graph);
        boolean[][] edges = adjacency(vertices);
        String before = snapshot(graph, vertices);
        boolean cyclic = directedCycle(edges);
        for (int repeat = 0; repeat < 2; repeat++) {
            if (repeat == 0) for (Vertex vertex : vertices) vertex.setColor(AbstractGraph.RED);
            try {
                List<Vertex> order = TraTopologicalExample.sort(graph);
                check(!cyclic, "Kahn finds a cycle, so DFS must not return any order");
                verifyOrder(order, vertices, edges);
                for (Vertex vertex : vertices) check(vertex.getColor() == AbstractGraph.BLACK, "Successful full DFS");
            } catch (IllegalArgumentException error) {
                check(cyclic && error.getMessage().equals("cycle"), "Only a real cycle rejects ordering");
            }
        }
        verifyTraversals(graph, vertices, edges, distances(edges), cyclic);
        check(snapshot(graph, vertices).equals(before), "Topological and path operations preserve graph structure");
    }

    private static void boundaryCases() {
        verifyUndirected(new Graph());
        verifyDirected(new DiGraph());
        Graph edge = new Graph();
        edge.addVertex("same").addEdge(edge.addVertex("same"));
        verifyUndirected(edge); // Parent reversal is not a two-edge cycle.
        DiGraph hidden = new DiGraph();
        List<Vertex> vertices = new ArrayList<>();
        for (int i = 0; i < 5; i++) vertices.add(hidden.addVertex("same"));
        vertices.get(0).addEdge(vertices.get(1));
        vertices.get(2).addEdge(vertices.get(3));
        Edge back = vertices.get(3).addEdge(vertices.get(2));
        TraTraversalExample.State partial = TraTraversalExample.traverse(hidden, vertices, vertices.get(0), false, false, false);
        check(partial.cycle.isEmpty(), "A reachable-only run can miss a cycle elsewhere");
        try {
            TraTraversalExample.topological(partial);
            throw new AssertionError("Incomplete DFS cannot claim a topological order");
        } catch (IllegalArgumentException expected) {
            check(expected.getMessage().equals("full DFS required"), "Reject partial coverage");
        }
        verifyDirected(hidden); // Full sorting must reject the disconnected cycle.
        vertices.get(3).removeEdge(back);
        verifyDirected(hidden); // A failed run does not poison the next run's colours.
        DiGraph selfLoop = new DiGraph();
        Vertex vertex = selfLoop.addVertex("same");
        vertex.addEdge(vertex);
        verifyDirected(selfLoop);
    }

    private static void printFactory(String name, AbstractGraph graph) {
        List<Vertex> vertices = vertices(graph);
        StringBuilder rows = new StringBuilder("[");
        for (int i = 0; i < vertices.size(); i++) {
            if (i > 0) rows.append(',');
            List<Integer> neighbors = new ArrayList<>();
            for (Vertex next : vertices.get(i).neighbors()) neighbors.add(Integer.valueOf(next.getLabel()));
            java.util.Collections.sort(neighbors);
            rows.append(neighbors);
        }
        System.out.println(name + "=" + rows.append(']'));
    }

    public static void main(String[] args) {
        boundaryCases();
        verifyUndirected(TraComponentsExample.createExampleGraph());
        verifyDirected(TraTopologicalExample.createExampleGraph(false));
        verifyDirected(TraTopologicalExample.createExampleGraph(true));
        Random random = new Random(20261120);
        for (int run = 0; run < 120; run++) {
            for (boolean directed : new boolean[]{false, true}) {
                AbstractGraph graph = directed ? new DiGraph() : new Graph();
                int count = run < 3 ? run : random.nextInt(9);
                List<Vertex> vertices = new ArrayList<>();
                for (int i = 0; i < count; i++) vertices.add(graph.addVertex("same"));
                for (int i = 0; i < count; i++) {
                    for (int j = directed ? 0 : i + 1; j < count; j++) {
                        // Half the directed fixtures are DAGs; others can contain loops/cycles.
                        if (directed && run % 2 == 0 && i >= j) continue;
                        if (random.nextInt(4) == 0) vertices.get(i).addEdge(vertices.get(j), (float)(i - j));
                    }
                }
                if (directed) verifyDirected((DiGraph)graph); else verifyUndirected((Graph)graph);
            }
        }
        printFactory("disconnected", TraComponentsExample.createExampleGraph());
        printFactory("dag", TraTopologicalExample.createExampleGraph(false));
        printFactory("directed", TraTopologicalExample.createExampleGraph(true));
        System.out.println("TRA applications passed: 240 generated graphs, boundaries, properties and repeat runs");
    }
}
