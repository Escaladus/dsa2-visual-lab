import fi.uef.cs.tra.BTreeNode;
import java.util.ArrayList;
import java.util.List;

/** Edit this file. Check with: java -Dfile.encoding=UTF-8 Check.java en */
public class Solution {
    /**
     * Return this proper binary subtree in PRE order: node, left, right.
     * node may be null or an inner subtree root with a parent outside it.
     * @return actual input BTreeNode objects in traversal order; empty list for null
     * Include each subtree node once, never null children or element values.
     * Values may repeat or be null; preserve all links, elements and balance fields.
     * Use recursion. A helper that appends to one result list is allowed.
     */
    public static List<BTreeNode<?>> pre(BTreeNode<?> node) {
        // TODO: collect actual nodes in PRE order, using the child links only.
        throw new UnsupportedOperationException("TODO: implement pre");
    }

    /* Optional: explain your solution.
     * When is the current node appended relative to its two child calls?
     * Where does the caller continue after a child returns?
     * What are time, recursion-stack space and result-list space costs?
     */
}
