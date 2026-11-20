// Generated from TraTreeExample.java. Edit the Java source, then run npm run sync:java-snippets.
export const treeTraversalCode = `public static <E> void traverse(BTreeNode<E> node, List<E> pre, List<E> in, List<E> post) {
    if (node == null) return;
    pre.add(node.getElement());
    traverse(node.getLeftChild(), pre, in, post);
    in.add(node.getElement());
    traverse(node.getRightChild(), pre, in, post);
    post.add(node.getElement());
}`

export const treeCreationCode = `public static BTree<String> createExampleTree() {
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
}`

export const treeSizeCode = `public static int size(BTreeNode<?> node) {
    if (node == null) return 0;
    return 1 + size(node.getLeftChild()) + size(node.getRightChild());
}`

export const treeHeightCode = `public static int height(BTreeNode<?> node) {
    if (node == null) return -1;
    return 1 + Math.max(height(node.getLeftChild()), height(node.getRightChild()));
}`

export const generalTreeCode = `public static Tree<String> createGeneralTree() {
    TreeNode<String> r = new TreeNode<>("R");
    TreeNode<String> x = new TreeNode<>("X");
    TreeNode<String> y = new TreeNode<>("Y");
    TreeNode<String> z = new TreeNode<>("Z");
    Tree<String> tree = new Tree<>(r);
    r.setLeftChild(x);
    x.setRightSibling(y);
    y.setRightSibling(z);
    return tree;
}`
