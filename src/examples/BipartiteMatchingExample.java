import java.util.Arrays;

/** Increase a bipartite matching by finding paths that can reassign existing partners. */
public class BipartiteMatchingExample {
    // graph[left] contains indices of allowed right-side vertices.
    public static int[] match(int[][] graph, int rightCount) {
        int[] owner = new int[rightCount];
        Arrays.fill(owner, -1);
        for (int left = 0; left < graph.length; left++) {
            // Only this augmenting-path search shares seen; the next left vertex starts fresh.
            augment(graph, left, new boolean[rightCount], owner);
        }
        return owner;
    }

    private static boolean augment(int[][] graph, int left, boolean[] seen, int[] owner) {
        for (int right : graph[left]) {
            if (seen[right]) continue;
            seen[right] = true;
            // Either use a free partner or move its current owner to another partner.
            if (owner[right] == -1 || augment(graph, owner[right], seen, owner)) {
                owner[right] = left;
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[] owner = match(new int[][]{{0, 1}, {0}}, 2);
        System.out.println(Arrays.toString(owner));
        System.out.println(Arrays.stream(owner).filter(value -> value != -1).count());
    }
}
