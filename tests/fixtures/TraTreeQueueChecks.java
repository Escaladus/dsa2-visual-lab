import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;
import fi.uef.cs.tra.PriorityQueue;
import fi.uef.cs.tra.Tree;
import fi.uef.cs.tra.TreeNode;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Checks actual TRA objects; no assumptions about a PriorityQueue's internal array. */
public class TraTreeQueueChecks {
    static PriorityQueue<Integer> queue;

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    static BTree<String> generated(int[] left, int[] right, String[] values) {
        BTree<String> tree = new BTree<>();
        List<BTreeNode<String>> nodes = new ArrayList<>();
        for (String value : values) nodes.add(new BTreeNode<>(value));
        if (nodes.isEmpty()) return tree;
        tree.setRoot(nodes.get(0));
        for (int i = 0; i < nodes.size(); i++) {
            if (left[i] >= 0) nodes.get(i).setLeftChild(nodes.get(left[i]));
            if (right[i] >= 0) nodes.get(i).setRightChild(nodes.get(right[i]));
        }
        return tree;
    }

    static void tree(BTree<String> tree) {
        // Preserve links and values while traversing. Identity matters when values repeat.
        Map<BTreeNode<String>, List<Object>> before = new IdentityHashMap<>();
        ArrayDeque<BTreeNode<String>> stack = new ArrayDeque<>();
        if (tree.getRoot() != null) stack.push(tree.getRoot());
        while (!stack.isEmpty()) {
            BTreeNode<String> node = stack.pop();
            check(!before.containsKey(node), "Fixture must be a proper tree");
            before.put(node, Arrays.asList(node.getElement(), node.getLeftChild(), node.getRightChild(), node.getParent()));
            for (BTreeNode<String> child : Arrays.asList(node.getLeftChild(), node.getRightChild())) {
                if (child != null) {
                    check(child.getParent() == node, "TRA parent link");
                    stack.push(child);
                }
            }
        }
        List<String> pre = new ArrayList<>(), in = new ArrayList<>(), post = new ArrayList<>();
        TraTreeExample.traverse(tree.getRoot(), pre, in, post);
        int size = TraTreeExample.size(tree.getRoot());
        int height = TraTreeExample.height(tree.getRoot());
        for (Map.Entry<BTreeNode<String>, List<Object>> entry : before.entrySet()) {
            BTreeNode<String> node = entry.getKey();
            check(entry.getValue().equals(Arrays.asList(node.getElement(), node.getLeftChild(), node.getRightChild(), node.getParent())), "Tree algorithms must preserve structure");
        }
        check(size == before.size(), "Size counts node identities, not distinct values");
        System.out.println(size + "|" + height + "|" + pre + "|" + in + "|" + post);
    }

    static void startQueue() {
        queue = TraPriorityQueueExample.createExampleQueue();
        printQueue(null);
    }

    static void operation(String kind, int value) {
        Object result;
        if (kind.equals("offer")) result = queue.offer(value);
        else if (kind.equals("peek")) result = queue.peek();
        else result = queue.poll();
        printQueue(result);
    }

    private static void printQueue(Object result) {
        int size = queue.size();
        Integer minimum = queue.peek();
        List<Integer> order = TraPriorityQueueExample.priorityOrder(queue);
        check(queue.size() == size && java.util.Objects.equals(minimum, queue.peek()), "Preview preserves queue");
        System.out.println(result + "|" + queue.peek() + "|" + size + "|" + order);
    }

    static void additionalContracts() {
        Tree<String> general = TraTreeExample.createGeneralTree();
        List<String> children = new ArrayList<>();
        for (TreeNode<String> child = general.getRoot().getLeftChild(); child != null; child = child.getRightSibling()) {
            check(child.getLeftChild() == null, "A sibling is not a child");
            children.add(child.getElement());
        }
        check(children.equals(Arrays.asList("X", "Y", "Z")), "General Tree has three sibling children");
        PriorityQueue<Integer> reverse = new PriorityQueue<>(4, Comparator.reverseOrder());
        reverse.offer(Integer.MIN_VALUE);
        reverse.offer(3);
        reverse.offer(3);
        reverse.offer(Integer.MAX_VALUE);
        check(TraPriorityQueueExample.priorityOrder(reverse).equals(Arrays.asList(Integer.MAX_VALUE, 3, 3, Integer.MIN_VALUE)), "Copy preserves comparator and duplicates");
        boolean rejected = false;
        try { reverse.offer(null); } catch (NullPointerException expected) { rejected = true; }
        check(rejected && reverse.size() == 4, "Null insertion is rejected without an element");
        // Only the multiset is checked: the iterator may happen to be sorted on some inputs.
        List<Integer> iterated = new ArrayList<>();
        for (Integer value : reverse) iterated.add(value);
        iterated.sort(Comparator.naturalOrder());
        check(iterated.equals(Arrays.asList(Integer.MIN_VALUE, 3, 3, Integer.MAX_VALUE)), "Iterator yields all elements");
        Comparator<TraPriorityQueueExample.Task> byPriority = Comparator.comparingInt(TraPriorityQueueExample.Task::priority).thenComparing(TraPriorityQueueExample.Task::id);
        PriorityQueue<TraPriorityQueueExample.Task> tasks = new PriorityQueue<>(4, byPriority);
        tasks.offer(new TraPriorityQueueExample.Task("Z", Integer.MAX_VALUE));
        tasks.offer(new TraPriorityQueueExample.Task("B", Integer.MIN_VALUE));
        tasks.offer(new TraPriorityQueueExample.Task("A", Integer.MIN_VALUE));
        check(tasks.poll().id().equals("A") && tasks.poll().id().equals("B") && tasks.poll().id().equals("Z"), "Comparator tie-break and extreme priorities");
    }
}
