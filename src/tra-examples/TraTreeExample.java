import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;
import fi.uef.cs.tra.Tree;
import fi.uef.cs.tra.TreeNode;
import java.util.ArrayList;
import java.util.List;

/** Binary TRA trees: the same A–G structure as the drawing. Requires JDK 11+. */
public class TraTreeExample {
    public static BTree<String> createExampleTree() {
        BTreeNode<String> a = new BTreeNode<>("A");
        BTreeNode<String> b = new BTreeNode<>("B");
        BTreeNode<String> c = new BTreeNode<>("C");
        a.setLeftChild(b);
        a.setRightChild(c);
        b.setLeftChild(new BTreeNode<>("D"));
        b.setRightChild(new BTreeNode<>("E"));
        c.setLeftChild(new BTreeNode<>("F"));
        c.setRightChild(new BTreeNode<>("G"));
        return new BTree<>(a);
    }

    /** Each list records the same node at a different point relative to its children. */
    public static <E> void traverse(BTreeNode<E> node, List<E> pre, List<E> in, List<E> post) {
        if (node == null) return;
        pre.add(node.getElement());
        traverse(node.getLeftChild(), pre, in, post);
        in.add(node.getElement());
        traverse(node.getRightChild(), pre, in, post);
        post.add(node.getElement());
    }

    public static int size(BTreeNode<?> node) {
        if (node == null) return 0;
        return 1 + size(node.getLeftChild()) + size(node.getRightChild());
    }

    /** Height in edges: empty = -1, leaf = 0. A chain of n nodes has height n - 1. */
    public static int height(BTreeNode<?> node) {
        if (node == null) return -1;
        return 1 + Math.max(height(node.getLeftChild()), height(node.getRightChild()));
    }

    public static BTree<String> example(String name) {
        if (name.equals("balanced")) return createExampleTree();
        if (name.equals("empty")) return new BTree<>();
        BTreeNode<String> a = new BTreeNode<>("A");
        if (name.equals("single")) return new BTree<>(a);
        if (name.equals("chain")) {
            BTreeNode<String> b = new BTreeNode<>("B");
            BTreeNode<String> c = new BTreeNode<>("C");
            a.setLeftChild(b);
            b.setLeftChild(c);
            c.setLeftChild(new BTreeNode<>("D"));
            return new BTree<>(a);
        }
        throw new IllegalArgumentException("Unknown tree example");
    }

    /** General Tree uses first child / next sibling, not left child / right child. */
    public static Tree<String> createGeneralTree() {
        TreeNode<String> r = new TreeNode<>("R");
        TreeNode<String> x = new TreeNode<>("X");
        TreeNode<String> y = new TreeNode<>("Y");
        TreeNode<String> z = new TreeNode<>("Z");
        Tree<String> tree = new Tree<>(r);
        r.setLeftChild(x);
        x.setRightSibling(y);
        y.setRightSibling(z);
        return tree;
    }

    public static void main(String[] args) {
        BTree<String> tree = createExampleTree();
        List<String> pre = new ArrayList<>();
        List<String> in = new ArrayList<>();
        List<String> post = new ArrayList<>();
        traverse(tree.getRoot(), pre, in, post);
        System.out.println("PRE: " + pre);
        System.out.println("IN: " + in);
        System.out.println("POST: " + post);
        System.out.println("Nodes: " + size(tree.getRoot()));
        System.out.println("Height (edges): " + height(tree.getRoot()));
        System.out.println("Levels: " + (height(tree.getRoot()) + 1));
        System.out.println("Empty height: " + height(null));

        Tree<String> general = createGeneralTree();
        List<String> children = new ArrayList<>();
        for (TreeNode<String> child = general.getRoot().getLeftChild();
             child != null; child = child.getRightSibling()) {
            children.add(child.getElement());
        }
        System.out.println("General children of R: " + children);
    }
}
