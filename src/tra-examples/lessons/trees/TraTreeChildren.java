import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;

/** Read a node’s children. Requires traj.jar and Java 11+. */
public class TraTreeChildren {
    public static void main(String[] args) {
        BTreeNode<String> a = new BTreeNode<>("A");
        a.setLeftChild(new BTreeNode<>("B"));
        a.setRightChild(new BTreeNode<>("C"));
        BTree<String> tree = new BTree<>(a);
        // lesson:start
        BTreeNode<String> left = tree.getRoot().getLeftChild();
        BTreeNode<String> right = tree.getRoot().getRightChild();
        System.out.println("Left: " + left.getElement());
        System.out.println("Right: " + right.getElement());
        System.out.println("B has no left child: " + (left.getLeftChild() == null));
        // lesson:end
    }
}
