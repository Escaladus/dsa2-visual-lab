import fi.uef.cs.tra.PriorityQueue;

/** PriorityQueue: remove the minimum. Requires traj.jar and Java 11+. */
public class TraQueuePoll {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        queue.offer(5);
        queue.offer(2);
        queue.offer(7);
        // lesson:start
        System.out.println("Removed: " + queue.poll());
        System.out.println("New minimum: " + queue.peek());
        System.out.println("Size: " + queue.size());
        // lesson:end
    }
}
