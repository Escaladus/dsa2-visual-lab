import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** DFS/BFS on small unweighted graphs. The given neighbour order determines the traversal. */
public class GraphTraversalExample {
    static final int WHITE = 0;
    static final int GREY = 1;
    static final int BLACK = 2;

    // One shared state for the whole forest; recursive calls do not copy these arrays.
    static class State {
        final int[] color, parent, root, depth, distance, tin, tout;
        final List<Integer> pre = new ArrayList<>();
        final List<Integer> post = new ArrayList<>();
        final List<Integer> removed = new ArrayList<>();
        // BFS reuses the buffers, but its completion order is not recursive DFS POST.
        final List<Integer> discovered = pre;
        final List<Integer> completed = post;
        final Map<String, String> types = new LinkedHashMap<>();
        final List<Integer> cycle = new ArrayList<>();
        final boolean directed;
        final int start;
        boolean breadth;
        int clock;
        int neighborChecks;

        State(int vertices, int start, boolean directed) {
            this.start = start;
            this.directed = directed;
            color = new int[vertices];
            parent = new int[vertices];
            root = new int[vertices];
            depth = new int[vertices];
            distance = new int[vertices];
            tin = new int[vertices];
            tout = new int[vertices];
            Arrays.fill(parent, -1);
            Arrays.fill(root, -1);
            Arrays.fill(depth, -1);
            Arrays.fill(distance, -1);
        }
    }

    /** Traverse from start, then start new trees at undiscovered vertices if all is true. */
    static State traverse(int[][] graph, int start, boolean all, boolean directed, boolean breadth) {
        State state = new State(graph.length, start, directed);
        state.breadth = breadth;
        if (graph.length > 0) {
            if (breadth) {
                bfs(graph, start, state);
            } else {
                dfs(graph, start, state);
            }
        }
        if (all) {
            for (int v = 0; v < graph.length; v++) {
                if (state.color[v] == WHITE) {
                    if (breadth) {
                        bfs(graph, v, state);
                    } else {
                        dfs(graph, v, state);
                    }
                }
            }
        }
        return state;
    }

    /** A call keeps its own v/i/next; state and the graph are shared by every call. */
    static void dfs(int[][] graph, int v, State state) {
        if (state.parent[v] < 0) {
            state.root[v] = v;
            state.depth[v] = 0;
            state.distance[v] = v == state.start ? 0 : -1;
        }
        state.color[v] = GREY;
        state.tin[v] = ++state.clock;
        state.pre.add(v);
        for (int i = 0; i < graph[v].length; i++) {
            int next = graph[v][i];
            state.neighborChecks++;
            if (state.color[next] == WHITE) {
                state.parent[next] = v;
                state.root[next] = state.root[v];
                state.depth[next] = state.depth[v] + 1;
                state.distance[next] = state.root[v] == state.start ? state.depth[next] : -1;
                state.types.put(edgeKey(v, next, state.directed), "tree");
                dfs(graph, next, state);
            } else if (!state.directed && state.parent[v] == next) {
                // Two adjacency entries describe one physical parent edge, not a cycle.
            } else {
                state.types.putIfAbsent(edgeKey(v, next, state.directed), classify(v, next, state));
            }
        }
        state.post.add(v);
        state.tout[v] = ++state.clock;
        state.color[v] = BLACK;
    }

    /** Mark GREY before enqueueing, and BLACK only after examining every neighbour. */
    static void bfs(int[][] graph, int start, State state) {
        state.root[start] = start;
        state.depth[start] = 0;
        state.distance[start] = start == state.start ? 0 : -1;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        state.color[start] = GREY;
        state.discovered.add(start);
        queue.add(start);
        while (!queue.isEmpty()) {
            int v = queue.remove();
            state.removed.add(v);
            for (int i = 0; i < graph[v].length; i++) {
                int next = graph[v][i];
                state.neighborChecks++;
                if (state.color[next] != WHITE) continue;
                state.color[next] = GREY;
                state.parent[next] = v;
                state.root[next] = state.root[v];
                state.depth[next] = state.depth[v] + 1;
                state.distance[next] = state.root[v] == state.start ? state.depth[next] : -1;
                state.discovered.add(next);
                queue.add(next);
            }
            state.completed.add(v);
            state.color[v] = BLACK;
        }
    }

    static String edgeKey(int source, int target, boolean directed) {
        if (directed || source <= target) return source + ":" + target;
        return target + ":" + source;
    }

    /** WHITE is handled by dfs; this method classifies an already discovered neighbour. */
    static String classify(int source, int target, State state) {
        String key = edgeKey(source, target, state.directed);
        if (state.types.containsKey(key)) return state.types.get(key);

        String type;
        if (!state.directed || state.color[target] == GREY) {
            type = "back";
        } else if (state.tin[source] < state.tin[target]) {
            type = "forward";
        } else {
            type = "cross";
        }

        // Follow parents up to the GREY ancestor to construct one explicit cycle witness.
        if (type.equals("back") && state.cycle.isEmpty()) {
            List<Integer> branch = new ArrayList<>();
            for (int v = source; v != target; v = state.parent[v]) {
                branch.add(v);
            }
            Collections.reverse(branch);
            state.cycle.add(target);
            state.cycle.addAll(branch);
            state.cycle.add(target);
        }
        return type;
    }

    static List<Integer> path(State state, int target) {
        // Another forest root does not make the target reachable from the original start.
        if (state.root[target] != state.start) return List.of();
        List<Integer> result = new ArrayList<>();
        for (int v = target; v != -1; v = state.parent[v]) {
            result.add(v);
        }
        Collections.reverse(result);
        return result;
    }

    static List<Integer> topological(State state) {
        if (!state.directed || state.breadth) {
            throw new IllegalArgumentException("directed DFS required");
        }
        if (!state.cycle.isEmpty()) throw new IllegalArgumentException("cycle");
        for (int color : state.color) {
            if (color != BLACK) throw new IllegalArgumentException("full DFS required");
        }
        List<Integer> result = new ArrayList<>(state.post);
        Collections.reverse(result);
        return result;
    }

    public static void main(String[] args) {
        int[][] classes = {{1, 2, 3}, {2}, {0}, {2}, {}};
        int[][] dag = {{1, 2, 3}, {2}, {}, {2}, {}};
        State dfs = traverse(classes, 0, true, true, false);
        System.out.println(dfs.pre);
        System.out.println(dfs.post);
        System.out.println(dfs.types);
        System.out.println(dfs.cycle);
        State breadth = traverse(dag, 0, true, true, true);
        System.out.println(Arrays.toString(breadth.distance));
        System.out.println(path(breadth, 2));
        System.out.println(topological(traverse(dag, 0, true, true, false)));
    }
}
