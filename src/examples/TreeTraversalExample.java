import java.util.ArrayList;
import java.util.List;

/** The position of processing relative to recursion defines pre-, in- and postorder. */
public class TreeTraversalExample {
    static final class Node {
        private final int value;
        private final Node left;
        private final Node right;

        Node(int value, Node left, Node right) {
            this.value = value;
            this.left = left;
            this.right = right;
        }

        public int value() {
            return value;
        }

        public Node left() {
            return left;
        }

        public Node right() {
            return right;
        }
    }

    static void traverse(Node node, List<Integer> pre, List<Integer> in, List<Integer> post) {
        if (node == null) return;
        pre.add(node.value());
        traverse(node.left(), pre, in, post);
        in.add(node.value());
        traverse(node.right(), pre, in, post);
        post.add(node.value());
    }

    public static void main(String[] args) {
        Node root = new Node(2, new Node(1, null, null), new Node(3, null, null));
        List<Integer> pre = new ArrayList<>(), in = new ArrayList<>(), post = new ArrayList<>();
        traverse(root, pre, in, post);
        System.out.println(pre);
        System.out.println(in);
        System.out.println(post);
    }
}
