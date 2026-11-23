import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Matching: move an existing pair. Requires traj.jar and Java 11+. */
public class TraMatchingStep {
    /**
     * Search from a left vertex in a known valid bipartition; owner maps right to left.
     * Use a fresh empty seen set for each new left root; an existing matching may be rearranged.
     * @return true if one pair is added; updates seen and, on success, owner
     */
    // lesson:start
    static boolean augment(Vertex left, Map<Vertex, Vertex> owner, Set<Vertex> seen) {
        for (Vertex right : left.neighbors()) {
            if (!seen.add(right)) {
                continue;
            }
            Vertex previous = owner.get(right);
            if (previous == null || augment(previous, owner, seen)) {
                owner.put(right, left); // Previous owner moved, or right was free.
                return true;
            }
        }
        return false;
    }
    // lesson:end

    public static void main(String[] args) {
        Graph graph = new Graph();
        Vertex l0 = graph.addVertex("L0");
        Vertex l1 = graph.addVertex("L1");
        Vertex r0 = graph.addVertex("R0");
        Vertex r1 = graph.addVertex("R1");
        l0.addEdge(r0);
        l0.addEdge(r1);
        l1.addEdge(r0);
        Map<Vertex, Vertex> owner = new IdentityHashMap<>();
        owner.put(r0, l0);
        Set<Vertex> seen = Collections.newSetFromMap(new IdentityHashMap<>());
        System.out.println("Added L1: " + augment(l1, owner, seen));
        for (Vertex right : List.of(r0, r1)) {
            System.out.println(owner.get(right).getLabel() + "-" + right.getLabel());
        }
    }
}
