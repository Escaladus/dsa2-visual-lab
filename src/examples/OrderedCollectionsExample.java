import java.util.Comparator;
import java.util.TreeMap;
import java.util.TreeSet;

public class OrderedCollectionsExample {
    public static void main(String[] args) {
        TreeSet<Integer> values = new TreeSet<>(java.util.List.of(9, 2, 5, 2));
        System.out.println(values);
        System.out.println(values.floor(6));
        System.out.println(values.ceiling(6));
        System.out.println(values.subSet(2, true, 9, false));

        TreeMap<String, Integer> scores = new TreeMap<>();
        scores.put("B", 2);
        scores.put("A", 1);
        System.out.println(scores.firstEntry());

        TreeSet<String> byLength = new TreeSet<>(Comparator.comparingInt(String::length));
        byLength.add("AA");
        byLength.add("BB");
        System.out.println(byLength.size());
    }
}
