import fi.uef.cs.tra.Vertex;
import fi.uef.cs.tra.LinkedQueue;
import java.util.IdentityHashMap;
import java.util.Map;

/** Edit this file. Check with: java -Dfile.encoding=UTF-8 Check.java en */
public class Solution {
    /**
     * Find shortest distances in number of directed edges from a non-null start.
     * @return a new map keyed by actual Vertex objects: start -> 0;
     *         unreachable vertices must be absent, not mapped to -1 or Infinity
     * Do not change vertex fields, edges or graph structure. Colours are arbitrary.
     * Use BFS with a queue; you may add helpers. Equal labels can name different vertices.
     */
    public static Map<Vertex, Integer> distances(Vertex start) {
        // TODO: discover start, then process outgoing neighbours using a queue.
        throw new UnsupportedOperationException("TODO: implement distances");
    }

    /* Optional self-evaluation after solving:
     * 1. Why does the first discovered distance have the fewest edges?
     * 2. Why does each vertex enter the queue at most once, even on a cycle?
     * 3. What are the time and additional memory costs for the reachable subgraph?
     */
}
