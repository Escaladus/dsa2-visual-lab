import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapFrequencyExample {
    public static Map<String, Integer> frequencies(Iterable<String> words) {
        Map<String, Integer> counts = new HashMap<>();
        for (String word : words) {
            counts.merge(word, 1, Integer::sum);
        }
        return counts;
    }

    public static void main(String[] args) {
        Map<String, Integer> counts = frequencies(java.util.List.of("A", "B", "A"));
        System.out.println(new TreeMap<>(counts));
        System.out.println(counts.getOrDefault("C", 0));
        System.out.println(counts.containsKey("B"));
        counts.put("B", 5);
        for (Map.Entry<String, Integer> entry : new TreeMap<>(counts).entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
        }
    }
}
