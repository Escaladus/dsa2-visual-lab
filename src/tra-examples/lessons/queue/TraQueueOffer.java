import fi.uef.cs.tra.PriorityQueue;

/** PriorityQueue: add values. Requires traj.jar and Java 11+. */
public class TraQueueOffer {
    public static void main(String[] args) {
        // lesson:start
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        queue.offer(5);
        queue.offer(2);
        queue.offer(7);
        System.out.println("Size: " + queue.size());
        System.out.println("Minimum: " + queue.peek());
        // lesson:end
    }
}
