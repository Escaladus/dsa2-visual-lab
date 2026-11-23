import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;

/** PRE: node, left, right. Requires traj.jar and Java 11+. */
public class TraTreePRE {
    /**
     * Print a proper binary subtree in node-left-right order; null prints nothing.
     * The tree is unchanged.
     */
    // lesson:start
    static void pre(BTreeNode<String> node) {
        if (node == null) {
            return; // Base case: no node here.
        }
        System.out.println(node.getElement());
        pre(node.getLeftChild());
        pre(node.getRightChild());
    }
    // lesson:end

    public static void main(String[] args) {
        BTreeNode<String> a = new BTreeNode<>("A");
        a.setLeftChild(new BTreeNode<>("B"));
        a.setRightChild(new BTreeNode<>("C"));
        BTree<String> tree = new BTree<>(a);
        pre(tree.getRoot());
    }
}
