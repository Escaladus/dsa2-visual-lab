import fi.uef.cs.tra.Vertex;
import fi.uef.cs.tra.LinkedQueue;
import java.util.ArrayList;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Edit this file. Check with: java -Dfile.encoding=UTF-8 Check.java en */
public class Solution {
    /**
     * Find a shortest directed path by number of edges, using BFS.
     * start and target are non-null vertices belonging to the same graph.
     * @return actual Vertex objects ordered from start to target, including both;
     *         an empty list if unreachable; [start] when start == target
     * Any shortest path is accepted. Labels may repeat; they are not vertex IDs.
     * Do not change graph structure or any vertex/edge fields. Colours are arbitrary.
     * You may add helpers. Store parents when discovering vertices.
     */
    public static List<Vertex> shortestPath(Vertex start, Vertex target) {
        // TODO: run BFS, remember parents, then build the path in forward order.
        throw new UnsupportedOperationException("TODO: implement shortestPath");
    }

    /* Optional self-evaluation after solving:
     * 1. Why does the first discovery of target give a shortest path?
     * 2. Why do parent links lead back to start, and why reverse that chain?
     * 3. What are the traversal, path-building and extra-memory costs?
     */
}
