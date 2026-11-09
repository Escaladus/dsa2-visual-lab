import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public class PriorityQueueExample {
    record Task(String id, int priority) {}

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
