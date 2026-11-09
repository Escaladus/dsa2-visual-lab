import java.util.Arrays;

public class CoinChangeExample {
    public static int minimumCoins(int sum, int[] coins) {
        if (sum < 0) throw new IllegalArgumentException("negative sum");
        for (int coin : coins) if (coin <= 0) throw new IllegalArgumentException("nonpositive coin");
        int[] dp = new int[sum + 1];
        Arrays.fill(dp, sum + 1);
        dp[0] = 0;
        for (int value = 1; value <= sum; value++) {
            for (int coin : coins) {
                if (coin <= value) dp[value] = Math.min(dp[value], 1 + dp[value - coin]);
            }
        }
        return dp[sum] > sum ? -1 : dp[sum];
    }

    public static void main(String[] args) {
        System.out.println(minimumCoins(6, new int[]{1, 3, 4}));
        System.out.println(minimumCoins(3, new int[]{2}));
        System.out.println(minimumCoins(0, new int[]{2}));
    }
}
