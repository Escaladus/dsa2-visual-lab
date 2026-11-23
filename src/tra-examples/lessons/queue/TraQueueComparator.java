import fi.uef.cs.tra.PriorityQueue;
import java.util.Comparator;

/** PriorityQueue: choose another order. Requires traj.jar and Java 11+. */
public class TraQueueComparator {
    public static void main(String[] args) {
        // lesson:start
        PriorityQueue<Integer> queue = new PriorityQueue<>(11, Comparator.reverseOrder());
        queue.offer(2);
        queue.offer(5);
        queue.offer(7);
        while (!queue.isEmpty()) {
            System.out.println(queue.poll());
        }
        // lesson:end
    }
}
