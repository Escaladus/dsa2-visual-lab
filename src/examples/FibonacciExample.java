public class FibonacciExample {
    // Small non-negative n: this deliberately repeats subproblems.
    static long fibonacci(int n) {
        if (n <= 1) return n;
        long left = fibonacci(n - 1);
        long right = fibonacci(n - 2);
        return left + right;
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(4));
        System.out.println(fibonacci(0));
    }
}
