import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Vertex;
import java.util.Collections;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** Matching: repeat with each left vertex. Requires traj.jar and Java 11+. */
public class TraMaximumMatching {
    /**
     * Search from a left vertex in a known valid bipartition; owner maps right to left.
     * Use a fresh empty seen set for each new left root; an existing matching may be rearranged.
     * @return true if one pair is added; updates seen and, on success, owner
     */
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
        List<Vertex> left = List.of(l0, l1);
        // lesson:start
        int size = 0;
        for (Vertex vertex : left) {
            Set<Vertex> seen = Collections.newSetFromMap(new IdentityHashMap<>());
            if (augment(vertex, owner, seen)) {
                size++;
            }
        }
        // lesson:end
        System.out.println("Size: " + size);
        for (Vertex right : List.of(r0, r1)) {
            System.out.println(owner.get(right).getLabel() + "-" + right.getLabel());
        }
    }
}
