import fi.uef.cs.tra.PriorityQueue;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** TRA PriorityQueue values and return contracts; no assumptions about its internal layout. */
public class TraPriorityQueueExample {
    public static PriorityQueue<Integer> createExampleQueue() {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        // Same values as the initial teaching heap. Layout is not part of the queue contract.
        for (int value : new int[]{2, 5, 3, 9, 7, 6}) queue.offer(value);
        return queue;
    }

    /** Priority-order preview, preserving the original queue. O(n log n) time, O(n) space. */
    public static List<Integer> priorityOrder(PriorityQueue<Integer> queue) {
        PriorityQueue<Integer> copy = new PriorityQueue<>(queue);
        List<Integer> order = new ArrayList<>();
        while (!copy.isEmpty()) order.add(copy.poll());
        return order;
    }

    public static final class Task {
        private final String id;
        private final int priority;

        public Task(String id, int priority) {
            this.id = id;
            this.priority = priority;
        }

        public String id() { return id; }
        public int priority() { return priority; }
    }

    public static void main(String[] args) {
        PriorityQueue<Integer> queue = createExampleQueue();
        System.out.println("peek: " + queue.peek());
        System.out.println("Size after peek: " + queue.size());
        queue.offer(3); // The value 3 already exists; the duplicate is kept.
        System.out.println("Size after duplicate: " + queue.size());
        System.out.println("poll: " + queue.poll());
        List<Integer> removed = new ArrayList<>();
        while (!queue.isEmpty()) removed.add(queue.poll());
        System.out.println("Removal order: " + removed);
        System.out.println("Empty peek: " + queue.peek());
        System.out.println("Empty poll: " + queue.poll());

        // TRA requires capacity + comparator: it has no comparator-only constructor.
        Comparator<Task> order = Comparator.comparingInt(Task::priority).thenComparing(Task::id);
        PriorityQueue<Task> tasks = new PriorityQueue<>(11, order);
        tasks.offer(new Task("B", 1));
        tasks.offer(new Task("A", 1));
        tasks.offer(new Task("C", 2));
        List<String> ids = new ArrayList<>();
        while (!tasks.isEmpty()) ids.add(tasks.poll().id());
        System.out.println("Tasks (priority, then id): " + ids);
        // Iteration is not guaranteed to be sorted. Use poll or priorityOrder for ordering.
    }
}
