import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Graph;
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
        for (int start = 0; start < Math.max(1, vertices.length); start++) {
            Vertex first = vertices.length == 0 ? null : vertices[start];
            for (boolean all : new boolean[]{false, true}) {
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

    public static void main(String[] args) {
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
