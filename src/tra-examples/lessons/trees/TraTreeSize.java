import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;

/** Count tree nodes. Requires traj.jar and Java 11+. */
public class TraTreeSize {
    /**
     * Count every node of a proper binary subtree; node may be null.
     * @return 0 for an empty subtree, otherwise the total node count
     * The tree is unchanged.
     */
    // lesson:start
    static int size(BTreeNode<?> node) {
        if (node == null) {
            return 0; // An empty subtree contributes no nodes.
        }
        int left = size(node.getLeftChild());
        int right = size(node.getRightChild());
        return 1 + left + right;
    }
    // lesson:end

    public static void main(String[] args) {
        BTreeNode<String> a = new BTreeNode<>("A");
        a.setLeftChild(new BTreeNode<>("B"));
        a.setRightChild(new BTreeNode<>("C"));
        BTree<String> tree = new BTree<>(a);
        System.out.println("Nodes: " + size(tree.getRoot()));
    }
}
