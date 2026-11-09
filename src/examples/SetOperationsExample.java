import java.util.HashSet;
import java.util.Set;
import java.util.TreeSet;

public class SetOperationsExample {
    public static void main(String[] args) {
        Set<Integer> a = new HashSet<>(Set.of(1, 2, 3));
        Set<Integer> b = Set.of(3, 4);
        System.out.println(a.add(3));
        System.out.println(a.contains(2));

        Set<Integer> union = new HashSet<>(a);
        union.addAll(b);
        Set<Integer> intersection = new HashSet<>(a);
        intersection.retainAll(b);
        Set<Integer> difference = new HashSet<>(a);
        difference.removeAll(b);

        System.out.println(new TreeSet<>(union));
        System.out.println(new TreeSet<>(intersection));
        System.out.println(new TreeSet<>(difference));
        System.out.println(new TreeSet<>(a));
    }
}
