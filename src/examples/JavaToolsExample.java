import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class JavaToolsExample {
    record Student(String name, int credits) implements Comparable<Student> {
        @Override public int compareTo(Student other) { return name.compareTo(other.name); }
    }

    static <T extends Comparable<? super T>> T maximum(List<T> values) {
        if (values.isEmpty()) throw new IllegalArgumentException("empty list");
        T best = values.get(0);
        for (T value : values) if (value.compareTo(best) > 0) best = value;
        return best;
    }

    public static void main(String[] args) {
        List<Student> students = new ArrayList<>(List.of(new Student("B", 3), new Student("A", 5)));
        students.sort(Comparator.naturalOrder());
        System.out.println(students.stream().map(Student::name).toList());
        students.sort(Comparator.comparingInt(Student::credits));
        System.out.println(students.stream().map(Student::name).toList());
        System.out.println(maximum(List.of(2, 7, 3)));
    }
}
