import fi.uef.cs.tra.AbstractGraph;
import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Random;

/** Checker implementation, not a file the student needs to edit. */
public class GraphChecks {
    private static String language;

    private static final class Case {
        final String en;
        final String ru;
        final String fi;
        final int vertices;
        final int[][] edges;
        final int start;
        final boolean duplicateLabels;

        Case(String en, String ru, String fi, int vertices, int[][] edges, int start, boolean duplicateLabels) {
            this.en = en;
            this.ru = ru;
            this.fi = fi;
            this.vertices = vertices;
            this.edges = edges;
            this.start = start;
            this.duplicateLabels = duplicateLabels;
        }
    }

    private static String text(String en, String ru, String fi) {
        if ("ru".equals(language)) return ru;
        if ("fi".equals(language)) return fi;
        return en;
    }

    private static List<Case> cases() {
        return List.of(
            new Case("Isolated start", "Изолированный старт", "Eristetty aloitussolmu", 1, new int[][]{}, 0, false),
            new Case("Chain", "Цепочка", "Ketju", 4, new int[][]{{0,1},{1,2},{2,3}}, 0, false),
            new Case("Branching", "Разветвление", "Haarautuminen", 6, new int[][]{{0,1},{0,2},{1,3},{1,4}}, 0, false),
            new Case("Directed cycle", "Направленный цикл", "Suunnattu sykli", 4, new int[][]{{0,1},{1,2},{2,0},{2,3}}, 0, false),
            new Case("Disconnected graph", "Несвязный граф", "Epäyhtenäinen graafi", 5, new int[][]{{0,1},{2,3}}, 0, false),
            new Case("Edge direction", "Направление рёбер", "Kaarten suunta", 3, new int[][]{{0,1},{1,2}}, 2, false),
            new Case("Two paths to one vertex", "Два пути в одну вершину", "Kaksi polkua samaan solmuun", 4, new int[][]{{0,1},{0,2},{1,3},{2,3}}, 0, false),
            new Case("Self-loop", "Петля", "Silmukka", 2, new int[][]{{0,0},{0,1}}, 0, false),
            new Case("Equal labels, different vertices", "Одинаковые метки, разные вершины", "Samat nimiöt, eri solmut", 3, new int[][]{{0,1},{1,2}}, 0, true)
        );
    }

    // The independent reference reads the fixture's integer edges, not the student's colours.
    private static boolean[] reachable(Case test) {
        boolean[] seen = new boolean[test.vertices];
        var queue = new ArrayDeque<Integer>();
        queue.add(test.start);
        seen[test.start] = true;
        while (!queue.isEmpty()) {
            int vertex = queue.remove();
            for (int[] edge : test.edges) {
                if (edge[0] == vertex && !seen[edge[1]]) {
                    seen[edge[1]] = true;
                    queue.add(edge[1]);
                }
            }
        }
        return seen;
    }

    private static String structure(Vertex[] vertices) {
        var indices = new IdentityHashMap<Vertex, Integer>();
        for (int i = 0; i < vertices.length; i++) indices.put(vertices[i], i);
        var rows = new ArrayList<List<Integer>>();
        for (Vertex vertex : vertices) {
            var neighbors = new ArrayList<Integer>();
            for (Vertex next : vertex.neighbors()) neighbors.add(indices.getOrDefault(next, -1));
            neighbors.sort(Integer::compareTo);
            rows.add(neighbors);
        }
        return rows.toString();
    }

    private static boolean check(Case test) {
        return check(test, false);
    }

    private static boolean check(Case test, boolean quiet) {
        DiGraph graph = new DiGraph();
        Vertex[] vertices = new Vertex[test.vertices];
        for (int i = 0; i < vertices.length; i++) {
            vertices[i] = graph.addVertex(test.duplicateLabels ? "same" : "v" + i);
            vertices[i].setColor(AbstractGraph.WHITE);
        }
        for (int[] edge : test.edges) vertices[edge[0]].addEdge(vertices[edge[1]]);
        boolean[] expectedVisited = reachable(test);
        int expected = 0;
        for (boolean visited : expectedVisited) if (visited) expected++;
        String before = structure(vertices);
        int actual = Solution.reachableCount(vertices[test.start]);
        boolean resultCorrect = actual == expected;
        boolean colorsCorrect = true;
        for (int i = 0; i < vertices.length; i++) {
            int color = vertices[i].getColor();
            colorsCorrect &= expectedVisited[i]
                ? color == AbstractGraph.GREY || color == AbstractGraph.BLACK
                : color == AbstractGraph.WHITE;
        }
        boolean graphUnchanged = graph.vertexCount() == vertices.length && before.equals(structure(vertices));
        boolean passed = resultCorrect && colorsCorrect && graphUnchanged;
        if (!quiet || !passed) System.out.println((passed ? "PASS: " : "FAIL: ") + text(test.en, test.ru, test.fi));
        if (!passed) {
            System.out.println(text("Vertices: ", "Вершин: ", "Solmuja: ") + vertices.length
                + text("; start: ", "; старт: ", "; aloitus: ") + test.start
                + text("; directed edges: ", "; направленные рёбра: ", "; suunnatut kaaret: ") + Arrays.deepToString(test.edges));
            System.out.println(text("Expected: ", "Ожидалось: ", "Odotettu: ") + expected + text("; received: ", "; получено: ", "; saatu: ") + actual);
            if (!resultCorrect) System.out.println(text(
                "Include the start, follow outgoing edges, and count each reachable vertex once.",
                "Учтите старт, направление рёбер и каждую достижимую вершину ровно один раз.",
                "Laske aloitussolmu mukaan, seuraa lähteviä kaaria ja laske kukin saavutettava solmu kerran."));
            if (!colorsCorrect) System.out.println(text(
                "Mark reached vertices GREY or BLACK; leave unreachable vertices WHITE. Mark before recursive calls.",
                "Пометьте достигнутые вершины GREY или BLACK; недостижимые оставьте WHITE. Помечайте до рекурсивных вызовов.",
                "Merkitse saavutetut solmut GREY- tai BLACK-värillä ja jätä muut WHITE-väriin. Merkitse ennen rekursiivisia kutsuja."));
            if (!graphUnchanged) System.out.println(text("Do not change vertices or edges.", "Не изменяйте вершины и рёбра графа.", "Älä muuta graafin solmuja tai kaaria."));
        }
        return passed;
    }

    public static void main(String[] args) {
        int index = Integer.parseInt(args[0]);
        language = args[1];
        try {
            boolean passed;
            if (index < cases().size()) {
                passed = check(cases().get(index));
            } else {
                // Reproducible additional inputs, including cycles and isolated vertices.
                Random random = new Random(20261118);
                passed = true;
                for (int number = 0; number < 30; number++) {
                    int size = 1 + random.nextInt(12);
                    var edges = new ArrayList<int[]>();
                    for (int from = 0; from < size; from++) {
                        for (int to = 0; to < size; to++) {
                            if (random.nextInt(6) == 0) edges.add(new int[]{from, to});
                        }
                    }
                    Case test = new Case("Additional graph " + (number + 1), "Дополнительный граф " + (number + 1), "Lisägraafi " + (number + 1),
                        size, edges.toArray(int[][]::new), random.nextInt(size), false);
                    if (!check(test, true)) { passed = false; break; }
                }
                if (passed) System.out.println(text("PASS: 30 additional graphs", "PASS: 30 дополнительных графов", "PASS: 30 lisägraafia"));
            }
            if (!passed) System.exit(1);
        } catch (java.util.ConcurrentModificationException error) {
            System.out.println(text(
                "FAIL: The graph changed during traversal. Do not change vertices or edges.",
                "FAIL: Граф изменился во время обхода. Не меняйте вершины и рёбра.",
                "FAIL: Graafi muuttui läpikäynnin aikana. Älä muuta solmuja tai kaaria."));
            System.exit(1);
        } catch (StackOverflowError error) {
            System.out.println(text("FAIL: Stack overflow. Check that a vertex is marked before following its neighbours.",
                "FAIL: Переполнение стека. Проверьте, что вершина помечается до обхода соседей.",
                "FAIL: Pinon ylivuoto. Tarkista, että solmu merkitään ennen naapureiden läpikäyntiä."));
            System.exit(1);
        } catch (Throwable error) {
            System.out.println(text("FAIL: Method threw ", "FAIL: Метод выбросил ", "FAIL: Metodi heitti poikkeuksen ") + error.getClass().getSimpleName() + ": " + error.getMessage());
            System.out.println(text("Edit Solution.java and retry.", "Исправьте Solution.java и запустите проверку снова.", "Korjaa Solution.java ja suorita tarkistus uudelleen."));
            System.exit(1);
        }
    }
}
