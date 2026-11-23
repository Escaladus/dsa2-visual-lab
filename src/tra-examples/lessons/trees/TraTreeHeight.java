import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;

/** Compute height in edges. Requires traj.jar and Java 11+. */
public class TraTreeHeight {
    /**
     * Measure a proper binary subtree in edges; node may be null.
     * @return -1 for empty, 0 for a leaf, otherwise one plus the larger child height
     * The tree is unchanged.
     */
    // lesson:start
    static int height(BTreeNode<?> node) {
        if (node == null) {
            return -1; // A leaf has empty children: 1 + max(-1, -1) is 0.
        }
        int left = height(node.getLeftChild());
        int right = height(node.getRightChild());
        return 1 + Math.max(left, right);
    }
    // lesson:end

    public static void main(String[] args) {
        BTreeNode<String> a = new BTreeNode<>("A");
        a.setLeftChild(new BTreeNode<>("B"));
        a.setRightChild(new BTreeNode<>("C"));
        BTree<String> tree = new BTree<>(a);
        System.out.println("Height: " + height(tree.getRoot()));
    }
}
