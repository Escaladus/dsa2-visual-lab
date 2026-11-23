import fi.uef.cs.tra.PriorityQueue;

/** PriorityQueue: equal values are allowed. Requires traj.jar and Java 11+. */
public class TraQueueDuplicates {
    public static void main(String[] args) {
        // lesson:start
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        queue.offer(3);
        queue.offer(3);
        queue.offer(5);
        while (!queue.isEmpty()) {
            System.out.println(queue.poll());
        }
        // lesson:end
    }
}
