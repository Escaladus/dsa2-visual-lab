import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class EqualityExample {
    static final class Student {
        private final int id;
        private final String name;

        Student(int id, String name) { this.id = id; this.name = name; }

        @Override public boolean equals(Object other) {
            return this == other || other instanceof Student student && id == student.id;
        }

        @Override public int hashCode() { return Objects.hash(id); }
    }

    public static void main(String[] args) {
        Student a = new Student(7, "Aino");
        Student b = new Student(7, "Anna");
        Set<Student> students = new HashSet<>();
        students.add(a);
        students.add(b);
        Map<Student, Integer> credits = new HashMap<>();
        credits.put(a, 5);
        System.out.println(a.equals(b));
        System.out.println(a.hashCode() == b.hashCode());
        System.out.println(students.size());
        System.out.println(credits.get(b));
    }
}
