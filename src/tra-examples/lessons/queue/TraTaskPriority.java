import fi.uef.cs.tra.PriorityQueue;
import java.util.Comparator;

/** Tasks ordered by priority, then name. Requires traj.jar and Java 11+. */
public class TraTaskPriority {
    static class Task {
        final String name;
        final int priority;

        Task(String name, int priority) {
            this.name = name;
            this.priority = priority;
        }
    }

    public static void main(String[] args) {
        // lesson:start
        Comparator<Task> order = Comparator.comparingInt((Task task) -> task.priority)
                .thenComparing(task -> task.name);
        PriorityQueue<Task> tasks = new PriorityQueue<>(11, order);
        tasks.offer(new Task("B", 1));
        tasks.offer(new Task("A", 1));
        tasks.offer(new Task("C", 2));
        while (!tasks.isEmpty()) {
            Task task = tasks.poll();
            System.out.println(task.name + ": " + task.priority);
        }
        // lesson:end
    }
}
