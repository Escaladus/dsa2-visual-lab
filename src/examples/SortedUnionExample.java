import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class SortedUnionExample {
    // Inputs: ascending lists of non-null integers. Duplicates are allowed.
    public static List<Integer> union(List<Integer> left, List<Integer> right) {
        Iterator<Integer> a = left.iterator();
        Iterator<Integer> b = right.iterator();
        Integer x = a.hasNext() ? a.next() : null;
        Integer y = b.hasNext() ? b.next() : null;
        List<Integer> result = new ArrayList<>();
        while (x != null && y != null) {
            int value;
            if (x < y) {
                value = x;
                x = a.hasNext() ? a.next() : null;
            } else if (y < x) {
                value = y;
                y = b.hasNext() ? b.next() : null;
            } else {
                value = x;
                x = a.hasNext() ? a.next() : null;
                y = b.hasNext() ? b.next() : null;
            }
            appendUnique(result, value);
        }
        while (x != null) {
            appendUnique(result, x);
            x = a.hasNext() ? a.next() : null;
        }
        while (y != null) {
            appendUnique(result, y);
            y = b.hasNext() ? b.next() : null;
        }
        return result;
    }

    private static void appendUnique(List<Integer> result, int value) {
        if (result.isEmpty() || result.get(result.size() - 1) != value) result.add(value);
    }

    public static void main(String[] args) {
        System.out.println(union(new java.util.LinkedList<>(List.of(1, 1, 3, 7)), List.of(2, 3, 3, 8)));
        System.out.println(union(List.of(), List.of(2, 2)));
        System.out.println(union(List.of(), List.of()));
    }
}
