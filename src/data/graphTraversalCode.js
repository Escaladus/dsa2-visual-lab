// Generated from GraphTraversalExample.java. Edit the Java source, then run npm run sync:java-snippets.
export const traverseTraversalCode = `static State traverse(int[][] graph, int start, boolean all, boolean directed, boolean breadth) {
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
}`

export const dfsTraversalCode = `static void dfs(int[][] graph, int v, State state) {
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
}`

export const bfsTraversalCode = `static void bfs(int[][] graph, int start, State state) {
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
}`

export const classifyTraversalCode = `static String classify(int source, int target, State state) {
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
}`

export const topologicalTraversalCode = `static List<Integer> topological(State state) {
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
}`
