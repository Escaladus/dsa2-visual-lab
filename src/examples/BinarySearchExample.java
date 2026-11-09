public class BinarySearchExample {
    public static int search(int[] values, int target) {
        int low = 0, high = values.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (values[mid] == target) return mid;
            if (values[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{2, 4, 6, 8, 10}, 8));
        System.out.println(search(new int[]{2, 4, 6}, 5));
        System.out.println(search(new int[]{}, 5));
    }
}
