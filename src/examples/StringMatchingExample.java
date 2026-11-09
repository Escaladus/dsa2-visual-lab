import java.util.ArrayList;
import java.util.List;

public class StringMatchingExample {
    public static int naive(String text, String pattern) {
        for (int offset = 0; offset <= text.length() - pattern.length(); offset++) {
            int i = 0;
            while (i < pattern.length() && text.charAt(offset + i) == pattern.charAt(i)) i++;
            if (i == pattern.length()) return offset;
        }
        return -1;
    }

    public static int rabinKarp(String text, String pattern) {
        int n = text.length(), m = pattern.length();
        if (m == 0) return 0;
        if (m > n) return -1;
        long base = 257, modulus = 1_000_000_007, power = 1, wanted = 0, hash = 0;
        for (int i = 0; i < m; i++) {
            wanted = (wanted * base + pattern.charAt(i)) % modulus;
            hash = (hash * base + text.charAt(i)) % modulus;
            if (i < m - 1) power = power * base % modulus;
        }
        for (int offset = 0; offset <= n - m; offset++) {
            if (hash == wanted && text.regionMatches(offset, pattern, 0, m)) return offset;
            if (offset < n - m) {
                hash = (hash - text.charAt(offset) * power % modulus + modulus) % modulus;
                hash = (hash * base + text.charAt(offset + m)) % modulus;
            }
        }
        return -1;
    }

    // End positions are exclusive UTF-16 indices. D[0][j] = 0 allows any text prefix.
    public static List<Integer> approximateEnds(String pattern, String text, int maxErrors) {
        int m = pattern.length(), n = text.length();
        int[][] d = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) d[i][0] = i;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                int cost = pattern.charAt(i - 1) == text.charAt(j - 1) ? 0 : 1;
                d[i][j] = Math.min(d[i - 1][j - 1] + cost,
                    Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1));
            }
        }
        List<Integer> ends = new ArrayList<>();
        for (int j = 0; j <= n; j++) if (d[m][j] <= maxErrors) ends.add(j);
        return ends;
    }

    public static void main(String[] args) {
        System.out.println(naive("xxabay", "aba"));
        System.out.println(rabinKarp("xxabay", "aba"));
        System.out.println(approximateEnds("cat", "xxcutyy", 1));
    }
}
