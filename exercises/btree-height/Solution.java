import fi.uef.cs.tra.BTreeNode;

/** Edit this file. Check with: java -Dfile.encoding=UTF-8 Check.java en */
public class Solution {
    /**
     * Measure the height of a proper binary subtree in edges.
     * node may be null or the root of an inner subtree, with a parent outside it.
     * @return -1 for null, 0 for a leaf; otherwise the longest downward path in edges
     * Values may repeat or be null; they do not identify or count nodes.
     * Preserve every child/parent link, element reference and balance field.
     * Use recursion. You may add helpers; no graph or BST assumptions are needed.
     */
    public static int height(BTreeNode<?> node) {
        // TODO: handle null, then combine the left and right subtree heights.
        throw new UnsupportedOperationException("TODO: implement height");
    }

    /* Optional: explain your base case and recursive step.
     * Why is the empty height -1? Why use the larger child height?
     * What are the time and recursion-stack costs for n nodes and edge-height h?
     */
}
