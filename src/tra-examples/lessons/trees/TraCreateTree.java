import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;

/** Create a binary tree. Requires traj.jar and Java 11+. */
public class TraCreateTree {
    public static void main(String[] args) {
        // lesson:start
        BTreeNode<String> a = new BTreeNode<>("A");
        a.setLeftChild(new BTreeNode<>("B"));
        a.setRightChild(new BTreeNode<>("C"));
        BTree<String> tree = new BTree<>(a);
        System.out.println("Root: " + tree.getRoot().getElement());
        // lesson:end
    }
}
