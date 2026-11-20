// Generated from TraTraversalExample.java. Edit the Java source, then run npm run sync:java-snippets.
export const traverseTraversalCode = `public static State traverse(AbstractGraph graph, List<Vertex> vertices, Vertex start,
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
}`

export const dfsTraversalCode = `static void dfs(Vertex v, State state) {
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
}`

export const bfsTraversalCode = `static void bfs(Vertex start, State state) {
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
}`

export const classifyTraversalCode = `static String classify(Vertex source, Vertex target, Edge edge, State state) {
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
}`

export const topologicalTraversalCode = `public static List<Vertex> topological(State state) {
    if (!state.directed || state.breadth) throw new IllegalArgumentException("directed DFS required");
    if (!state.cycle.isEmpty()) throw new IllegalArgumentException("cycle");
    for (Vertex v : state.vertices) {
        if (state.color.get(v) != BLACK) throw new IllegalArgumentException("full DFS required");
    }
    List<Vertex> result = new ArrayList<>(state.post);
    Collections.reverse(result);
    return result;
}`

export const traversalPreparationCode = `State(AbstractGraph graph, List<Vertex> vertices, Vertex start, boolean reverse) {
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
}`
