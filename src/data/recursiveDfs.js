export const dfsCode = `static void dfs(int[][] graph, int v, boolean[] visited, List<Integer> pre, List<Integer> post) {
    visited[v] = true;
    pre.add(v);
    for (int i = 0; i < graph[v].length; i++) {
        int next = graph[v][i];
        if (!visited[next]) {
            dfs(graph, next, visited, pre, post);
        }
    }
    post.add(v);
}`

export const dfsDriverCode = `static Result traverse(int[][] graph, int start, boolean all) {
    boolean[] visited = new boolean[graph.length];
    List<Integer> pre = new ArrayList<>(), post = new ArrayList<>();
    if (graph.length > 0) dfs(graph, start, visited, pre, post);
    if (all) {
        for (int v = 0; v < graph.length; v++) {
            if (!visited[v]) dfs(graph, v, visited, pre, post);
        }
    }
    return new Result(pre, post);
}`

// Undirected graphs; neighbours and the outer loop use ascending vertex order.
export const dfsExamples = {
  branching: {
    graph: [[1, 2], [0, 3], [0], [1]],
    positions: [
      { x: 130, y: 48 },
      { x: 90, y: 145 },
      { x: 300, y: 145 },
      { x: 90, y: 250 },
    ],
  },
  cycle: {
    graph: [[1, 2], [0, 2, 3], [0, 1], [1]],
    positions: [
      { x: 100, y: 48 },
      { x: 225, y: 140 },
      { x: 65, y: 235 },
      { x: 335, y: 245 },
    ],
  },
  disconnected: {
    graph: [[1], [0], [], [4], [3]],
    positions: [
      { x: 65, y: 65 },
      { x: 175, y: 65 },
      { x: 325, y: 65 },
      { x: 110, y: 235 },
      { x: 280, y: 235 },
    ],
  },
}
