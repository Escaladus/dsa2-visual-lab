import fi.uef.cs.tra.Tree;
import fi.uef.cs.tra.TreeNode;

/** General tree: children and siblings. Requires traj.jar and Java 11+. */
public class TraGeneralTreeChildren {
    public static void main(String[] args) {
        TreeNode<String> root = new TreeNode<>("R");
        TreeNode<String> x = new TreeNode<>("X");
        TreeNode<String> y = new TreeNode<>("Y");
        TreeNode<String> z = new TreeNode<>("Z");
        Tree<String> tree = new Tree<>(root);
        root.setLeftChild(x);
        x.setRightSibling(y);
        y.setRightSibling(z);
        // lesson:start
        for (TreeNode<String> child = tree.getRoot().getLeftChild();
                child != null; child = child.getRightSibling()) {
            System.out.println(child.getElement());
        }
        // lesson:end
    }
}
