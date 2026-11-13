import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

public class ExamplesChecks {
    private static final Random RANDOM = new Random(41);
    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
    private static void rejects(Runnable action, String message) {
        try { action.run(); } catch (IllegalArgumentException expected) { return; }
        throw new AssertionError(message);
    }

    private static void listsAndSorting() {
        for (int trial = 0; trial < 100; trial++) {
            int[] a = RANDOM.ints(RANDOM.nextInt(25), -5, 6).toArray();
            int[] expected = a.clone();
            Arrays.sort(expected);
            MergeSortExample.sort(a);
            check(Arrays.equals(a, expected), "merge sort");
            for (int target = -6; target <= 6; target++) {
                int found = BinarySearchExample.search(a, target);
                check(found == -1 ? Arrays.binarySearch(a, target) < 0 : a[found] == target, "binary search");
            }
            List<Integer> left = new LinkedList<>(Arrays.stream(a).boxed().toList());
            List<Integer> right = new ArrayList<>(RANDOM.ints(RANDOM.nextInt(20), -5, 6).sorted().boxed().toList());
            TreeSet<Integer> union = new TreeSet<>(left);
            union.addAll(right);
            check(SortedUnionExample.union(left, right).equals(new ArrayList<>(union)), "sorted union");
        }
        check(SortedUnionExample.union(List.of(1000, 1000), List.of(1000, 2000)).equals(List.of(1000, 2000)), "integer value equality");
        check(MapFrequencyExample.frequencies(List.of()).isEmpty(), "empty frequency map");
    }

    private static void traversals() {
        int[][] graph = {{1, 2}, {0, 3}, {0, 3}, {1, 2}, {}};
        BfsExample.Result bfs = BfsExample.search(graph, 0);
        check(Arrays.equals(bfs.distance(), new int[]{0, 1, 1, 2, -1}), "BFS distances");
        check(bfs.pathTo(0).equals(List.of(0)) && bfs.pathTo(4).isEmpty(), "BFS path boundaries");
        check(ComponentsExample.components(graph).size() == 2, "components");
        check(DfsExample.traverse(graph).pre().size() == 5, "DFS isolated vertex");
        check(DfsExample.traverse(new int[][]{}).pre().isEmpty(), "empty DFS");
        check(TopologicalExample.sort(new int[][]{}).isEmpty(), "empty DAG");
        rejects(() -> TopologicalExample.sort(new int[][]{{0}}), "self-loop cycle");
        int[][] dag = {{1, 2}, {3}, {3}, {}};
        List<Integer> order = TopologicalExample.sort(dag);
        for (int v = 0; v < dag.length; v++) for (int w : dag[v]) check(order.indexOf(v) < order.indexOf(w), "topological edge");
    }

    private static void shortestPaths() {
        for (int trial = 0; trial < 35; trial++) {
            int n = 1 + RANDOM.nextInt(7);
            List<List<DijkstraExample.Edge>> graph = new ArrayList<>();
            long[][] weights = new long[n][n];
            for (int v = 0; v < n; v++) {
                graph.add(new ArrayList<>());
                Arrays.fill(weights[v], FloydWarshallExample.INF);
                weights[v][v] = 0;
                for (int w = 0; w < n; w++) if (v != w && RANDOM.nextBoolean()) {
                    int weight = RANDOM.nextInt(10);
                    graph.get(v).add(new DijkstraExample.Edge(w, weight));
                    weights[v][w] = weight;
                }
            }
            long[][] all = FloydWarshallExample.distances(weights);
            for (int start = 0; start < n; start++) {
                long[] actual = DijkstraExample.distances(graph, start);
                for (int v = 0; v < n; v++) check(actual[v] == (all[start][v] == FloydWarshallExample.INF ? Long.MAX_VALUE : all[start][v]), "Dijkstra versus Floyd");
            }
        }
        long inf = FloydWarshallExample.INF;
        long[][] negative = {{0, inf, inf}, {-2, 0, inf}, {10, 3, 0}};
        check(FloydWarshallExample.distances(negative)[2][0] == 1, "Floyd must update destination zero");
        rejects(() -> FloydWarshallExample.distances(new long[][]{{0, -1}, {-1, 0}}), "negative cycle");
        rejects(() -> DijkstraExample.distances(List.of(List.of(new DijkstraExample.Edge(0, -1))), 0), "negative Dijkstra edge");
    }

    private static int componentCount(int[][] graph, int removedVertex, int edgeA, int edgeB) {
        boolean[] seen = new boolean[graph.length];
        int count = 0;
        for (int start = 0; start < graph.length; start++) {
            if (start == removedVertex || seen[start]) continue;
            count++;
            Deque<Integer> queue = new ArrayDeque<>();
            queue.add(start); seen[start] = true;
            while (!queue.isEmpty()) {
                int v = queue.remove();
                for (int w : graph[v]) {
                    if (w == removedVertex || seen[w] || v == edgeA && w == edgeB || v == edgeB && w == edgeA) continue;
                    seen[w] = true; queue.add(w);
                }
            }
        }
        return count;
    }

    private static int[][] adjacency(int n, List<MinimumSpanningTreeExample.Edge> edges) {
        List<List<Integer>> lists = new ArrayList<>();
        for (int v = 0; v < n; v++) lists.add(new ArrayList<>());
        for (MinimumSpanningTreeExample.Edge e : edges) { lists.get(e.from()).add(e.to()); lists.get(e.to()).add(e.from()); }
        return lists.stream().map(list -> list.stream().mapToInt(Integer::intValue).toArray()).toArray(int[][]::new);
    }

    private static void treesAndCuts() {
        for (int trial = 0; trial < 40; trial++) {
            int n = 2 + RANDOM.nextInt(4);
            List<MinimumSpanningTreeExample.Edge> edges = new ArrayList<>();
            for (int a = 0; a < n; a++) for (int b = a + 1; b < n; b++) {
                if (b == a + 1 || RANDOM.nextBoolean()) edges.add(new MinimumSpanningTreeExample.Edge(a, b, RANDOM.nextInt(12) - 4));
            }
            long best = Long.MAX_VALUE;
            for (int mask = 0; mask < 1 << edges.size(); mask++) {
                if (Integer.bitCount(mask) != n - 1) continue;
                List<MinimumSpanningTreeExample.Edge> selected = new ArrayList<>();
                long weight = 0;
                for (int e = 0; e < edges.size(); e++) if ((mask & 1 << e) != 0) { selected.add(edges.get(e)); weight += edges.get(e).weight(); }
                if (componentCount(adjacency(n, selected), -1, -1, -1) == 1) best = Math.min(best, weight);
            }
            check(MinimumSpanningTreeExample.kruskal(n, edges) == best, "Kruskal versus exhaustive MST");
            check(MinimumSpanningTreeExample.prim(n, edges) == best, "Prim versus exhaustive MST");
            int[][] graph = adjacency(n, edges);
            GraphCutsExample.Result cuts = GraphCutsExample.find(graph);
            int original = componentCount(graph, -1, -1, -1);
            for (int v = 0; v < n; v++) check(cuts.articulation().contains(v) == (componentCount(graph, v, -1, -1) > original), "articulation removal oracle");
            for (MinimumSpanningTreeExample.Edge e : edges) {
                check(cuts.bridges().contains(e.from() + "-" + e.to()) == (componentCount(graph, -1, e.from(), e.to()) > original), "bridge removal oracle");
            }
        }
        rejects(() -> MinimumSpanningTreeExample.kruskal(2, List.of()), "disconnected Kruskal");
        rejects(() -> MinimumSpanningTreeExample.prim(2, List.of()), "disconnected Prim");
        check(MinimumSpanningTreeExample.prim(0, List.of()) == 0, "empty MST");
        check(GraphCutsExample.find(new int[][]{{1, 2}, {0}, {0}, {}}).articulation().equals(List.of(0)), "DFS root cut with isolated vertex");
    }

    private static int bruteMatching(int[][] graph, int left, int used) {
        if (left == graph.length) return 0;
        int best = bruteMatching(graph, left + 1, used);
        for (int right : graph[left]) if ((used & 1 << right) == 0) best = Math.max(best, 1 + bruteMatching(graph, left + 1, used | 1 << right));
        return best;
    }

    private static void matchingAndFlow() {
        for (int trial = 0; trial < 60; trial++) {
            int l = RANDOM.nextInt(6), r = RANDOM.nextInt(5);
            int[][] graph = new int[l][];
            for (int v = 0; v < l; v++) {
                List<Integer> neighbors = new ArrayList<>();
                for (int w = 0; w < r; w++) if (RANDOM.nextBoolean()) neighbors.add(w);
                graph[v] = neighbors.stream().mapToInt(Integer::intValue).toArray();
            }
            int[] owner = BipartiteMatchingExample.match(graph, r);
            Set<Integer> usedLeft = new HashSet<>();
            for (int w = 0; w < r; w++) if (owner[w] != -1) {
                check(usedLeft.add(owner[w]), "matching must not reuse left vertex");
                final int right = w;
                check(Arrays.stream(graph[owner[w]]).anyMatch(value -> value == right), "matching edge must exist");
            }
            check(usedLeft.size() == bruteMatching(graph, 0, 0), "matching versus exhaustive oracle");

            int n = 2 + RANDOM.nextInt(5);
            int[][] capacity = new int[n][n];
            for (int a = 0; a < n; a++) for (int b = 0; b < n; b++) if (a != b) capacity[a][b] = RANDOM.nextInt(4);
            long minCut = Long.MAX_VALUE;
            for (int mask = 1; mask < 1 << n; mask++) {
                if ((mask & 1) == 0 || (mask & 1 << (n - 1)) != 0) continue;
                long cut = 0;
                for (int a = 0; a < n; a++) for (int b = 0; b < n; b++) if ((mask & 1 << a) != 0 && (mask & 1 << b) == 0) cut += capacity[a][b];
                minCut = Math.min(minCut, cut);
            }
            check(MaxFlowExample.maxFlow(capacity, 0, n - 1) == minCut, "max flow versus exhaustive min-cut");
        }
        rejects(() -> MaxFlowExample.maxFlow(new int[][]{{0}}, 0, 0), "source equals sink");
    }

    private static int editDistance(String a, String b) {
        int[][] d = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) d[i][0] = i;
        for (int j = 0; j <= b.length(); j++) d[0][j] = j;
        for (int i = 1; i <= a.length(); i++) for (int j = 1; j <= b.length(); j++) {
            d[i][j] = Math.min(d[i - 1][j] + 1, Math.min(d[i][j - 1] + 1, d[i - 1][j - 1] + (a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1)));
        }
        return d[a.length()][b.length()];
    }

    private static String randomString(int length) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < length; i++) result.append("abäx".charAt(RANDOM.nextInt(4)));
        return result.toString();
    }

    private static void stringsAndCoins() {
        for (int trial = 0; trial < 100; trial++) {
            String text = randomString(RANDOM.nextInt(12)), pattern = randomString(RANDOM.nextInt(6));
            check(StringMatchingExample.naive(text, pattern) == text.indexOf(pattern), "naive string search");
            check(StringMatchingExample.rabinKarp(text, pattern) == text.indexOf(pattern), "Rabin-Karp string search");
            int k = RANDOM.nextInt(3);
            List<Integer> expected = new ArrayList<>();
            for (int end = 0; end <= text.length(); end++) {
                int best = Integer.MAX_VALUE;
                for (int start = 0; start <= end; start++) best = Math.min(best, editDistance(pattern, text.substring(start, end)));
                if (best <= k) expected.add(end);
            }
            check(StringMatchingExample.approximateEnds(pattern, text, k).equals(expected), "approximate substring search versus exhaustive substrings");
        }
        check(CoinChangeExample.minimumCoins(6, new int[]{1, 3, 4}) == 2, "greedy counterexample");
        check(CoinChangeExample.minimumCoins(0, new int[]{}) == 0, "zero sum");
        check(CoinChangeExample.minimumCoins(5, new int[]{}) == -1, "no coin types");
        rejects(() -> CoinChangeExample.minimumCoins(6, new int[]{0}), "invalid zero coin");
    }

    private static void files() throws Exception {
        Path directory = Files.createTempDirectory("dsa2-merge-check-");
        Path left = directory.resolve("a"), right = directory.resolve("b"), result = directory.resolve("c");
        try {
            Files.write(left, List.of()); Files.write(right, List.of("-1", "2", "2"));
            ExternalMergeExample.merge(left, right, result);
            check(Files.readAllLines(result).equals(List.of("-1", "2", "2")), "external merge empty left and duplicates");
            Files.write(right, List.of());
            ExternalMergeExample.merge(left, right, result);
            check(Files.size(result) == 0, "external merge both empty");
        } finally {
            Files.deleteIfExists(left); Files.deleteIfExists(right); Files.deleteIfExists(result); Files.deleteIfExists(directory);
        }
    }

    private static void memoisedFibonacci() {
        long a = 0, b = 1;
        for (int n = 0; n <= 92; n++) {
            Long[] memo = new Long[n + 1];
            check(MemoizedFibonacciExample.fibonacci(n, memo) == a, "memoised Fibonacci " + n);
            if (n >= 2) {
                check(memo[n] == a, "computed value must be cached");
                check(MemoizedFibonacciExample.fibonacci(n, memo) == a, "reuse cached result");
            }
            long next = a + b;
            a = b;
            b = next;
        }
    }

    public static void main(String[] args) throws Exception {
        memoisedFibonacci();
        listsAndSorting(); traversals(); shortestPaths(); treesAndCuts(); matchingAndFlow(); stringsAndCoins(); files();
        System.out.println("All algorithm checks passed");
    }
}
