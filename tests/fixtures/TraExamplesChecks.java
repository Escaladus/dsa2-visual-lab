import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/** Independent integer-graph checks for the additional TRA examples. */
public class TraExamplesChecks {
    private static void check(boolean condition, String description) {
        if (!condition) throw new AssertionError(description);
    }

    private static void rejects(Runnable action) {
        try {
            action.run();
        } catch (IllegalArgumentException expected) {
            return;
        }
        throw new AssertionError("Foreign or missing start must be rejected");
    }

    private static List<Integer> indices(List<Vertex> list, Map<Vertex, Integer> index) {
        List<Integer> values = new ArrayList<>();
        for (Vertex vertex : list) values.add(index.get(vertex));
        return values;
    }

    private static int[][] adjacency(Vertex[] vertices, Map<Vertex, Integer> index) {
        int[][] graph = new int[vertices.length][];
        for (int v = 0; v < vertices.length; v++) {
            List<Integer> neighbors = new ArrayList<>();
            for (Vertex next : vertices[v].neighbors()) neighbors.add(index.get(next));
            graph[v] = neighbors.stream().mapToInt(Integer::intValue).toArray();
        }
        return graph;
    }

    // An iterative reference preserves each caller's next-neighbour position.
    private static void dfs(int[][] graph, int start, boolean all, int[] parent,
                            List<Integer> pre, List<Integer> post, List<Integer> roots) {
        boolean[] visited = new boolean[graph.length];
        int[] next = new int[graph.length];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int pass = -1; pass < graph.length; pass++) {
            if (pass >= 0 && !all) break;
            int root = pass < 0 ? start : pass;
            if (root < 0 || visited[root]) continue;
            roots.add(root);
            pre.add(root);
            visited[root] = true;
            stack.push(root);
            while (!stack.isEmpty()) {
                int vertex = stack.peek();
                if (next[vertex] == graph[vertex].length) {
                    post.add(stack.pop());
                } else {
                    int child = graph[vertex][next[vertex]++];
                    if (!visited[child]) {
                        visited[child] = true;
                        parent[child] = vertex;
                        pre.add(child);
                        stack.push(child);
                    }
                }
            }
        }
    }

    private static void verify(AbstractGraph graph, Vertex[] vertices) {
        Map<Vertex, Integer> index = new IdentityHashMap<>();
        for (int v = 0; v < vertices.length; v++) index.put(vertices[v], v);
        int[][] input = adjacency(vertices, index);
        for (Vertex vertex : vertices) vertex.setColor(AbstractGraph.RED);
        Map<Vertex, Integer> counts = TraGraphDataExample.outgoingCounts(graph);
        check(counts.size() == vertices.length, "One count per vertex, even with duplicate labels");
        for (int v = 0; v < vertices.length; v++) {
            check(counts.get(vertices[v]) == input[v].length, "Outgoing count matches graph topology");
            check(vertices[v].getColor() == AbstractGraph.RED, "Counting must preserve colours");
        }
        check(Arrays.deepEquals(input, adjacency(vertices, index)), "Counting must preserve edges");
        for (int start = 0; start < Math.max(1, vertices.length); start++) {
            Vertex first = vertices.length == 0 ? null : vertices[start];
            for (boolean all : new boolean[]{false, true}) {
                for (Vertex vertex : vertices) vertex.setColor(AbstractGraph.RED);
                TraRecursiveDfsExample.Result basic = TraRecursiveDfsExample.traverse(graph, Arrays.asList(vertices), first, all);
                int[] basicParents = new int[vertices.length]; Arrays.fill(basicParents, -1);
                List<Integer> basicPre = new ArrayList<>(), basicPost = new ArrayList<>();
                dfs(input, vertices.length == 0 ? -1 : start, all, basicParents, basicPre, basicPost, new ArrayList<>());
                check(indices(basic.pre(), index).equals(basicPre), "Basic TRA PRE");
                check(indices(basic.post(), index).equals(basicPost), "Basic TRA POST");
                for (Vertex vertex : vertices) check(vertex.getColor() == AbstractGraph.RED, "Basic visited map leaves colours intact");

                for (Vertex vertex : vertices) vertex.setColor(AbstractGraph.RED);
                List<Integer> pre = new ArrayList<>();
                List<Integer> post = new ArrayList<>();
                List<Integer> roots = new ArrayList<>();
                int[] parent = new int[vertices.length];
                Arrays.fill(parent, -1);
                dfs(input, vertices.length == 0 ? -1 : start, all, parent, pre, post, roots);
                TraDfsExample.Result result = TraDfsExample.traverse(graph, first, all);
                check(indices(result.pre(), index).equals(pre), "DFS PRE and caller continuation");
                check(indices(result.post(), index).equals(post), "DFS POST");
                check(indices(result.roots(), index).equals(roots), "DFS forest roots");
                for (int v = 0; v < vertices.length; v++) {
                    check(result.parentOf(vertices[v]) == (parent[v] < 0 ? null : vertices[parent[v]]), "DFS parent identity");
                    check(vertices[v].getColor() == (pre.contains(v) ? AbstractGraph.BLACK : AbstractGraph.WHITE), "DFS final colours");
                }
                List<Integer> saved = indices(result.pre(), index);
                TraDfsExample.traverse(graph, first, all);
                check(indices(result.pre(), index).equals(saved), "DFS results survive another run");
            }

            int[] distance = new int[vertices.length];
            Arrays.fill(distance, -1);
            Deque<Integer> queue = new ArrayDeque<>();
            List<Integer> discovered = new ArrayList<>();
            if (vertices.length > 0) {
                distance[start] = 0;
                queue.add(start);
                discovered.add(start);
            }
            while (!queue.isEmpty()) {
                int vertex = queue.remove();
                for (int child : input[vertex]) {
                    if (distance[child] < 0) {
                        distance[child] = distance[vertex] + 1;
                        discovered.add(child);
                        queue.add(child);
                    }
                }
            }
            TraBfsExample.Result result = TraBfsExample.search(graph, first);
            check(indices(result.discovered(), index).equals(discovered), "BFS discovers each vertex once");
            for (int v = 0; v < vertices.length; v++) {
                check(result.distanceTo(vertices[v]) == distance[v], "BFS shortest distance");
                check(vertices[v].getColor() == (distance[v] < 0 ? AbstractGraph.WHITE : AbstractGraph.BLACK), "BFS final colours");
                List<Integer> path = indices(result.pathTo(vertices[v]), index);
                if (distance[v] < 0) {
                    check(path.isEmpty(), "Unreachable path is empty");
                } else {
                    check(path.size() == distance[v] + 1 && path.get(0) == start && path.get(path.size() - 1) == v, "BFS path length and endpoints");
                    for (int i = 1; i < path.size(); i++) {
                        boolean exists = false;
                        for (int child : input[path.get(i - 1)]) exists |= child == path.get(i);
                        check(exists, "BFS path follows edge direction");
                        check(result.parentOf(vertices[path.get(i)]) == vertices[path.get(i - 1)], "BFS path follows parent identities");
                    }
                }
            }
            TraBfsExample.search(graph, first);
            check(indices(result.discovered(), index).equals(discovered), "BFS old results survive another run");
            check(Arrays.deepEquals(adjacency(vertices, index), input), "Traversals preserve graph edges");
        }
        Vertex foreign = new DiGraph().addVertex("foreign");
        rejects(() -> TraDfsExample.traverse(graph, foreign, true));
        rejects(() -> TraBfsExample.search(graph, foreign));
        if (vertices.length > 0) {
            rejects(() -> TraDfsExample.traverse(graph, null, true));
            rejects(() -> TraBfsExample.search(graph, null));
        }
    }

    private static void printLessonGraph() {
        DiGraph graph = TraGraphExample.createDirectedGraph();
        List<String> vertices = new ArrayList<>();
        List<String> edges = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) vertices.add("\"" + vertex.getLabel() + "\"");
        for (Edge edge : graph.edges()) {
            edges.add("{\"from\":\"" + edge.getStartPoint().getLabel()
                    + "\",\"to\":\"" + edge.getEndPoint().getLabel()
                    + "\",\"weight\":" + edge.getWeight() + "}");
        }
        System.out.println("{\"vertices\":[" + String.join(",", vertices)
                + "],\"edges\":[" + String.join(",", edges) + "]}");
    }

    private static void extendedContracts() {
        DiGraph graph = new DiGraph();
        List<Vertex> vertices = new ArrayList<>();
        for (int i = 0; i < 5; i++) vertices.add(graph.addVertex("same"));
        vertices.get(0).addEdge(vertices.get(1));
        vertices.get(0).addEdge(vertices.get(2));
        vertices.get(1).addEdge(vertices.get(2));
        Edge back = vertices.get(2).addEdge(vertices.get(0));
        TraTraversalExample.State cyclic = TraTraversalExample.traverse(graph, vertices, vertices.get(0), true, false, false);
        rejects(() -> TraTraversalExample.topological(cyclic));
        check(!cyclic.cycle.isEmpty(), "Real TRA cycle witness");
        for (int i = 1; i < cyclic.cycle.size(); i++) {
            check(cyclic.cycle.get(i - 1).isAdjacent(cyclic.cycle.get(i)), "Witness follows real arcs");
        }
        Map<Vertex, Integer> oldColors = new IdentityHashMap<>(cyclic.color);
        List<Vertex> oldPre = new ArrayList<>(cyclic.pre);
        TraTraversalExample.State isolated = TraTraversalExample.traverse(graph, vertices, vertices.get(3), false, true, false);
        check(isolated.pre.size() == 1 && isolated.distance.get(vertices.get(3)) == 0, "Isolated BFS start");
        check(cyclic.color.equals(oldColors) && cyclic.pre.equals(oldPre), "Earlier results survive colour resets");
        check(TraTraversalExample.path(isolated, vertices.get(0)).isEmpty(), "Unreachable TRA path");
        rejects(() -> TraTraversalExample.topological(isolated));
        vertices.get(2).removeEdge(back);
        TraTraversalExample.State dag = TraTraversalExample.traverse(graph, vertices, vertices.get(0), true, false, true);
        List<Vertex> order = TraTraversalExample.topological(dag);
        for (Edge edge : graph.edges()) {
            check(order.indexOf(edge.getStartPoint()) < order.indexOf(edge.getEndPoint()), "Every TRA DAG arc respects order");
        }
        TraTraversalExample.State partial = TraTraversalExample.traverse(graph, vertices, vertices.get(2), false, false, false);
        rejects(() -> TraTraversalExample.topological(partial));
        TraTraversalExample.State bfs = TraTraversalExample.traverse(graph, vertices, vertices.get(0), true, true, false);
        check(bfs.distance.get(vertices.get(2)) == 1, "BFS shortest direct path");
        check(bfs.distance.get(vertices.get(3)) == -1 && bfs.depth.get(vertices.get(3)) == 0,
                "Other forest roots do not gain distance from original start");
        rejects(() -> TraTraversalExample.topological(bfs));
        Vertex foreign = new DiGraph().addVertex("same");
        rejects(() -> TraTraversalExample.traverse(graph, vertices, foreign, false, false, false));
        rejects(() -> TraRecursiveDfsExample.traverse(graph, vertices, foreign, false));
        List<Vertex> duplicate = new ArrayList<>(vertices);
        duplicate.set(1, duplicate.get(0));
        rejects(() -> TraTraversalExample.traverse(graph, duplicate, vertices.get(0), false, false, false));
        rejects(() -> TraRecursiveDfsExample.traverse(graph, duplicate, vertices.get(0), false));
    }

    public static void main(String[] args) {
        printLessonGraph();
        extendedContracts();
        Random random = new Random(20261118);
        for (boolean directed : new boolean[]{true, false}) {
            for (int test = 0; test < 40; test++) {
                AbstractGraph graph = directed ? new DiGraph() : new Graph();
                int count = test < 3 ? test : random.nextInt(9);
                Vertex[] vertices = new Vertex[count];
                for (int v = 0; v < count; v++) {
                    vertices[v] = graph.addVertex(test % 3 == 0 ? "same" : String.valueOf(v));
                }
                for (int from = 0; from < count; from++) {
                    // TRA Graph rejects self-loops; DiGraph permits them.
                    for (int to = directed ? 0 : from + 1; to < count; to++) {
                        if (random.nextInt(4) == 0) vertices[from].addEdge(vertices[to]);
                    }
                }
                verify(graph, vertices);
            }
        }
        System.out.println("All TRA graph checks passed");
    }
}
