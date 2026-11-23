import fi.uef.cs.tra.PriorityQueue;

/** PriorityQueue: look without removing. Requires traj.jar and Java 11+. */
public class TraQueuePeek {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        queue.offer(5);
        queue.offer(2);
        queue.offer(7);
        // lesson:start
        System.out.println("First peek: " + queue.peek());
        System.out.println("Second peek: " + queue.peek());
        System.out.println("Size: " + queue.size());
        // lesson:end
    }
}
