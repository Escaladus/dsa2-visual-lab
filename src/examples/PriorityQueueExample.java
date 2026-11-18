import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

/** A priority queue returns a minimum element; its iteration order is not sorted. */
public class PriorityQueueExample {
    static final class Task {
        private final String id;
        private final int priority;

        Task(String id, int priority) {
            this.id = id;
            this.priority = priority;
        }

        public String id() {
            return id;
        }

        public int priority() {
            return priority;
        }
    }

    public static void main(String[] args) {
        PriorityQueue<Task> queue = new PriorityQueue<>(
            Comparator.comparingInt(Task::priority).thenComparing(Task::id));
        queue.offer(new Task("C", 3));
        queue.offer(new Task("A", 1));
        queue.offer(new Task("B", 2));
        System.out.println(queue.peek().id());
        List<String> order = new ArrayList<>();
        while (!queue.isEmpty()) order.add(queue.poll().id());
        System.out.println(order);
        System.out.println(queue.poll());
    }
}
