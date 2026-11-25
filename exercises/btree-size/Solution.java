import fi.uef.cs.tra.BTreeNode;

/** Edit this file. Check with: java -Dfile.encoding=UTF-8 Check.java en */
public class Solution {
    /**
     * Count every node in a proper binary subtree.
     * node may be null or the root of an inner subtree, with a parent outside it.
     * @return 0 for null; otherwise the total node count, including node itself
     * Values may repeat or be null; they do not identify or count nodes.
     * Preserve every child/parent link, element reference and balance field.
     * Use recursion. You may add helpers; no graph or BST assumptions are needed.
     */
    public static int size(BTreeNode<?> node) {
        // TODO: handle null, then combine this node and both subtree sizes.
        throw new UnsupportedOperationException("TODO: implement size");
    }

    /* Optional: explain your base case and recursive step.
     * Why does the current node contribute one? Why add both subtrees?
     * What are the time and recursion-stack costs for n nodes and edge-height h?
     */
}
