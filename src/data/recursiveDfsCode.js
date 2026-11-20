// Generated from TraRecursiveDfsExample.java. Edit the Java source, then run npm run sync:java-snippets.
export const dfsCode = `static void dfs(Vertex v, Map<Vertex, Boolean> visited, List<Vertex> pre, List<Vertex> post) {
    visited.put(v, true);
    pre.add(v);
    Iterator<Vertex> neighbors = v.neighborIterator();
    for (int i = 0; neighbors.hasNext(); i++) {
        Vertex next = neighbors.next();
        if (!visited.get(next)) {
            dfs(next, visited, pre, post);
        }
    }
    post.add(v);
}`

export const dfsDriverCode = `public static Result traverse(AbstractGraph graph, List<Vertex> vertices, Vertex start, boolean all) {
    Map<Vertex, Boolean> visited = initializeVisited(graph, vertices, start);
    List<Vertex> pre = new ArrayList<>(), post = new ArrayList<>();
    if (start != null) dfs(start, visited, pre, post);
    if (all) {
        for (Vertex v : vertices) {
            if (!visited.get(v)) dfs(v, visited, pre, post);
        }
    }
    return new Result(pre, post);
}`
