import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.Iterator;
import java.util.List;

public class ListDequeExample {
    public static void main(String[] args) {
        List<Integer> values = new ArrayList<>(List.of(1, 2, 3, 4));
        Iterator<Integer> iterator = values.iterator();
        while (iterator.hasNext()) {
            if (iterator.next() % 2 == 0) iterator.remove();
        }
        System.out.println(values);

        Deque<String> stack = new ArrayDeque<>();
        stack.push("A");
        stack.push("B");
        System.out.println(stack.pop());

        Deque<String> queue = new ArrayDeque<>();
        queue.addLast("A");
        queue.addLast("B");
        System.out.println(queue.removeFirst());
        System.out.println(queue.pollFirst());
        System.out.println(queue.pollFirst());
    }
}
