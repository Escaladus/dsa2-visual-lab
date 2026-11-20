import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.GraphException;
import fi.uef.cs.tra.LinkedQueue;
import fi.uef.cs.tra.PriorityQueue;
import fi.uef.cs.tra.Tree;
import fi.uef.cs.tra.TreeNode;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

/** Executable assumptions for the supplied binary, not a replacement TRA implementation. */
public class TraLibraryChecks {
    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }

    private static <E> List<E> list(Iterable<E> values) {
        List<E> result = new ArrayList<>();
        for (E value : values) result.add(value);
        return result;
    }

    private static void graphContracts() {
        DiGraph directed = new DiGraph();
        check(directed.isDiGraph() && directed.vertexCount() == 0, "Empty DiGraph");
        Vertex a = directed.addVertex("same");
        Vertex b = directed.addVertex("same");
        Vertex c = directed.addVertex("isolated");
        check(a != b && directed.vertexCount() == 3, "Labels do not merge vertices");
        Map<Vertex, Integer> ids = new IdentityHashMap<>();
        ids.put(a, 0);
        ids.put(b, 1);
        check(ids.size() == 2, "External identity IDs distinguish equal labels");

        Edge forward = a.addEdge(b);
        check(list(a.neighbors()).equals(Arrays.asList(b)), "Directed outgoing neighbours");
        check(list(b.neighbors()).isEmpty(), "No implicit reverse arc");
        check(list(c.neighbors()).isEmpty(), "An isolated vertex has no neighbours");
        check(list(a.edges()).get(0) == forward && list(b.edges()).isEmpty(), "Outgoing edges");
        check(forward.getStartPoint() == a && forward.getEndPoint() == b, "Directed endpoints");
        check(forward.goesOut(a) && !forward.goesOut(b), "Directed edge orientation");
        check(forward.getEndPoint(a) == b && forward.getEndPoint(b) == a,
                "getEndPoint(vertex) finds the other end; it does not enforce direction");
        check(forward.getEndPoint(c) == null, "An unrelated vertex is not an endpoint");
        a.addEdge(a);
        check(a.isAdjacent(a), "DiGraph accepts a self-loop");

        Graph undirected = new Graph();
        check(!undirected.isDiGraph() && undirected.vertexCount() == 0, "Empty Graph");
        Vertex u = undirected.addVertex("u");
        Vertex v = undirected.addVertex("v");
        Edge shared = u.addEdge(v);
        check(u.isAdjacent(v) && v.isAdjacent(u), "One addEdge supplies both directions");
        check(list(u.edges()).get(0) == shared && list(v.edges()).get(0) == shared,
                "Both adjacency entries refer to one physical edge");
        check(list(undirected.edges()).size() == 1, "Global edges enumerate physical edges once");
        check(shared.getEndPoint(u) == v && shared.getEndPoint(v) == u, "Undirected endpoints");
        boolean rejected = false;
        try {
            u.addEdge(u);
        } catch (GraphException expected) {
            rejected = true;
        }
        check(rejected, "This Graph implementation rejects self-loops");

        // Initialise deliberately: algorithms must not depend on constructor colours.
        for (Vertex vertex : directed.vertices()) vertex.setColor(AbstractGraph.WHITE);
        a.setColor(AbstractGraph.GREY);
        check(a.getColor() == AbstractGraph.GREY && b.getColor() == AbstractGraph.WHITE,
                "Vertex colours are mutable and independent");
        a.setColor(AbstractGraph.BLACK);
        check(a.getColor() == AbstractGraph.BLACK, "BLACK can mark completion");
        check(AbstractGraph.GREY == AbstractGraph.GRAY, "GREY and GRAY are aliases");
    }

    private static void weightContracts() {
        DiGraph graph = new DiGraph();
        Vertex root = graph.addVertex("root");
        Edge colour = root.addEdge(graph.addVertex("colour"), 5);
        Edge weight = root.addEdge(graph.addVertex("weight"), 5.0f);
        check(colour.getColor() == 5, "An int second argument selects the colour overload");
        check(Float.compare(weight.getWeight(), 5.0f) == 0, "A float selects the weight overload");
        weight.setWeight(-2.0f);
        check(Float.compare(weight.getWeight(), -2.0f) == 0, "Library permits negative weights");
        // Algorithms, rather than Edge, enforce restrictions such as Dijkstra's nonnegative weights.
    }

    private static void treeContracts() {
        BTree<Integer> binary = new BTree<>();
        check(binary.isEmpty() && binary.getRoot() == null, "Empty BTree root is null");
        BTreeNode<Integer> root = new BTreeNode<>(2);
        BTreeNode<Integer> left = new BTreeNode<>(1);
        BTreeNode<Integer> right = new BTreeNode<>(3);
        binary.setRoot(root);
        root.setLeftChild(left);
        root.setRightChild(right);
        check(binary.getRoot() == root && root.getElement() == 2, "BTree root and element");
        check(root.getLeftChild() == left && root.getRightChild() == right, "Binary children");
        check(left.getParent() == root && right.getParent() == root, "Child parent links");
        check(left.getLeftChild() == null && left.getRightChild() == null, "Leaf children are null");

        Tree<String> general = new Tree<>();
        check(general.isEmpty() && general.getRoot() == null, "Empty general Tree");
        TreeNode<String> parent = new TreeNode<>("parent");
        TreeNode<String> first = new TreeNode<>("first child");
        TreeNode<String> second = new TreeNode<>("second child");
        general.setRoot(parent);
        parent.setLeftChild(first);
        first.setRightSibling(second);
        check(parent.getLeftChild() == first && first.getRightSibling() == second,
                "General Tree uses first child and next sibling");
        check(first.getLeftChild() == null, "A right sibling is not a child");
    }

    private static void queueContracts() {
        LinkedQueue<String> fifo = new LinkedQueue<>();
        check(fifo.peek() == null && fifo.poll() == null, "Empty LinkedQueue");
        fifo.offer("a");
        fifo.offer("b");
        check(fifo.remove().equals("a") && fifo.remove().equals("b"), "LinkedQueue is FIFO");

        PriorityQueue<Integer> minimum = new PriorityQueue<>();
        check(minimum.peek() == null && minimum.poll() == null, "Empty TRA PriorityQueue");
        minimum.offer(3);
        minimum.offer(1);
        minimum.offer(3);
        check(minimum.peek() == 1 && minimum.size() == 3, "peek does not remove an element");
        check(minimum.poll() == 1 && minimum.poll() == 3 && minimum.poll() == 3,
                "Minimum first, duplicate values retained");
        check(minimum.isEmpty(), "poll removed all elements");

        // Unlike java.util.PriorityQueue, this TRA class has no comparator-only constructor.
        PriorityQueue<Integer> maximum = new PriorityQueue<>(11, Comparator.reverseOrder());
        maximum.offer(1);
        maximum.offer(3);
        check(maximum.poll() == 3, "TRA comparator constructor takes capacity and comparator");
    }

    public static void main(String[] args) {
        graphContracts();
        weightContracts();
        treeContracts();
        queueContracts();
        System.out.println("TRA contracts passed: graphs, identity, endpoints, colours, weights, trees, queues");
    }
}
