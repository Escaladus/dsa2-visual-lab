public class FactorialExample {
    // Input: 0 <= n <= 20, so the result fits in long.
    static long factorial(int n) {
        if (n <= 1) return 1;
        long child = factorial(n - 1);
        return n * child;
    }

    public static void main(String[] args) {
        System.out.println(factorial(4));
        System.out.println(factorial(0));
    }
}
