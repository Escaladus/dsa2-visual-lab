import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;

/** POST: left, right, node. Requires traj.jar and Java 11+. */
public class TraTreePOST {
    /**
     * Print a proper binary subtree in left-right-node order; null prints nothing.
     * The tree is unchanged.
     */
    // lesson:start
    static void post(BTreeNode<String> node) {
        if (node == null) {
            return; // Base case: no node here.
        }
        post(node.getLeftChild());
        post(node.getRightChild());
        System.out.println(node.getElement());
    }
    // lesson:end

    public static void main(String[] args) {
        BTreeNode<String> a = new BTreeNode<>("A");
        a.setLeftChild(new BTreeNode<>("B"));
        a.setRightChild(new BTreeNode<>("C"));
        BTree<String> tree = new BTree<>(a);
        post(tree.getRoot());
    }
}
