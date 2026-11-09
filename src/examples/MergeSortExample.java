import java.util.Arrays;

public class MergeSortExample {
    public static void sort(int[] values) {
        sort(values, new int[values.length], 0, values.length);
    }

    private static void sort(int[] a, int[] buffer, int from, int to) {
        if (to - from < 2) return;
        int mid = from + (to - from) / 2;
        sort(a, buffer, from, mid);
        sort(a, buffer, mid, to);
        int i = from, j = mid, k = from;
        while (i < mid && j < to) buffer[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i < mid) buffer[k++] = a[i++];
        while (j < to) buffer[k++] = a[j++];
        System.arraycopy(buffer, from, a, from, to - from);
    }

    public static void main(String[] args) {
        int[] values = {7, 3, 3, -1, 2};
        sort(values);
        System.out.println(Arrays.toString(values));
    }
}
