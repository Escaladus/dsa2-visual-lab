public class MemoizedFibonacciExample {
    // Allocate a fresh cache once per top-level calculation.
    // Contract: 0 <= n <= 92, memo.length > n, initially all null.
    static long fibonacci(int n, Long[] memo) {
        if (n <= 1) return n;
        if (memo[n] != null) return memo[n];
        long left = fibonacci(n - 1, memo);
        long right = fibonacci(n - 2, memo);
        long value = left + right;
        memo[n] = value;
        return value;
    }

    public static void main(String[] args) {
        int n = 6;
        System.out.println(fibonacci(n, new Long[n + 1]));
        System.out.println(fibonacci(0, new Long[1]));
    }
}
