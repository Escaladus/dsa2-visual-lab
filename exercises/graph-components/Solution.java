import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import fi.uef.cs.tra.LinkedQueue;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Set;

/** Edit this file. Check with: java -Dfile.encoding=UTF-8 Check.java en */
public class Solution {
    /**
     * Find all connected components of a non-null undirected TRA Graph.
     * Return actual input Vertex objects, each exactly once, in nonempty groups.
     * Component and vertex order do not matter. An empty graph gives an empty list.
     * Include isolated vertices as singleton groups. Labels may repeat.
     * Do not change graph structure or vertex/edge fields; colours are arbitrary.
     * Use your own visited set. DFS or BFS and helper methods are allowed.
     */
    public static List<List<Vertex>> components(Graph graph) {
        // TODO: start a traversal from each vertex not yet in your visited set.
        throw new UnsupportedOperationException("TODO: implement components");
    }

    /* Optional self-evaluation after solving:
     * 1. Why does one traversal give exactly one connected component?
     * 2. Why are isolated vertices included, and cycles unable to repeat vertices?
     * 3. What are the time, working-memory and result-storage costs?
     */
}
