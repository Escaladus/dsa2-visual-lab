import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;

/** IN: left, node, right. Requires traj.jar and Java 11+. */
public class TraTreeIN {
    /**
     * Print a proper binary subtree in left-node-right order; null prints nothing.
     * The tree is unchanged.
     */
    // lesson:start
    static void in(BTreeNode<String> node) {
        if (node == null) {
            return; // Base case: no node here.
        }
        in(node.getLeftChild());
        System.out.println(node.getElement());
        in(node.getRightChild());
    }
    // lesson:end

    public static void main(String[] args) {
        BTreeNode<String> a = new BTreeNode<>("A");
        a.setLeftChild(new BTreeNode<>("B"));
        a.setRightChild(new BTreeNode<>("C"));
        BTree<String> tree = new BTree<>(a);
        in(tree.getRoot());
    }
}
