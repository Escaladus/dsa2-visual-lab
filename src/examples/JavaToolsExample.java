import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** Small examples of Java collection and sorting utilities used in the course. */
public class JavaToolsExample {
    static final class Student implements Comparable<Student> {
        private final String name;
        private final int credits;

        Student(String name, int credits) {
            this.name = name;
            this.credits = credits;
        }

        public String name() {
            return name;
        }

        public int credits() {
            return credits;
        }
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
        System.out.println(students.stream().map(Student::name).collect(Collectors.toList()));
        students.sort(Comparator.comparingInt(Student::credits));
        System.out.println(students.stream().map(Student::name).collect(Collectors.toList()));
        System.out.println(maximum(List.of(2, 7, 3)));
    }
}
