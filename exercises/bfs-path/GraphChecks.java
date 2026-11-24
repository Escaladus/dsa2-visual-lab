import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.IdentityHashMap;
import java.util.Set;
import java.util.Collections;
import java.util.Map;
import java.util.Random;

/** Local checker. Students edit Solution.java only. */
public class GraphChecks {
    static String language;

    static String text(String en, String ru, String fi) {
        return "ru".equals(language) ? ru : "fi".equals(language) ? fi : en;
    }

    static final int[][][] INPUTS = {
        {},
        {},
        {{0, 1}, {1, 2}, {2, 3}},
        {{0, 1}, {0, 2}, {1, 3}, {2, 3}},
        {{0, 1}, {1, 2}, {2, 3}, {0, 3}},
        {{0, 1}, {1, 2}, {2, 0}, {2, 3}},
        {{0, 1}, {1, 2}, {3, 4}, {4, 3}},
        {{0, 1}, {1, 2}},
        {{0, 0}, {0, 1}, {1, 1}, {1, 2}, {0, 3}, {3, 2}}
    };
    static final int[] SIZES = {1, 2, 4, 5, 4, 4, 6, 3, 5};
    static final int[] STARTS = {0, 0, 0, 0, 0, 0, 0, 2, 0};
    static final int[] TARGETS = {0, 1, 3, 3, 3, 3, 4, 0, 2};
    static final String[][] NAMES = {
        {"start equals target", "старт совпадает с целью", "aloitus on kohde"},
        {"unreachable target", "недостижимая цель", "saavuttamaton kohde"},
        {"chain", "цепочка", "ketju"},
        {"two shortest paths", "два кратчайших пути", "kaksi lyhintä polkua"},
        {"shorter direct path", "короткий прямой путь", "lyhyempi suora polku"},
        {"cycle", "цикл", "sykli"},
        {"disconnected graph", "несвязный граф", "epäyhtenäinen verkko"},
        {"edge direction", "направление рёбер", "kaarien suunta"},
        {"equal labels and self-loops", "одинаковые метки и петли", "samat nimet ja silmukat"},
        {"36 reproducible graphs", "36 воспроизводимых графов", "36 toistettavaa verkkoa"}
    };

    static void require(boolean value, String message) {
        if (!value) throw new AssertionError(message);
    }

    // All-pairs relaxation is independent of the queue algorithm students are learning.
    static int[] expected(int n, int[][] edges, int start) {
        int[][] distance = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(distance[i], 1000);
            distance[i][i] = 0;
        }
        for (int[] edge : edges) distance[edge[0]][edge[1]] = Math.min(distance[edge[0]][edge[1]], 1);
        for (int via = 0; via < n; via++) {
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    distance[from][to] = Math.min(distance[from][to], distance[from][via] + distance[via][to]);
                }
            }
        }
        return distance[start];
    }

    static void verify(int n, int[][] input, int start, int target, boolean sameLabels) {
        DiGraph graph = new DiGraph();
        List<Vertex> vertices = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            Vertex vertex = graph.addVertex(sameLabels ? "X" : String.valueOf(i));
            vertex.setColor(40 + i); // No WHITE precondition in this task.
            vertex.setIndex(100 + i);
            vertex.setWeight(i + 0.5f);
            vertices.add(vertex);
        }
        List<Edge> edges = new ArrayList<>();
        for (int i = 0; i < input.length; i++) {
            int[] ends = input[i];
            Edge edge = vertices.get(ends[0]).addEdge(vertices.get(ends[1]), 1.0f);
            edge.setColor(70 + i);
            edge.setLabel("E" + i);
            edges.add(edge);
        }
        String context = "\n" + text("Input edges: ", "Рёбра входа: ", "Syötekaaret: ") + Arrays.deepToString(input)
                + "; start=" + start + "; target=" + target;
        List<Vertex> actual;
        try {
            actual = Solution.shortestPath(vertices.get(start), vertices.get(target));
        } catch (Throwable error) {
            throw new AssertionError(context + "\n" + error.getClass().getSimpleName() + ": " + error.getMessage(), error);
        }
        require(actual != null, context + "\n" + text("Returned null; return an empty list for an unreachable target.", "Возвращён null; для недостижимой цели нужен пустой список.", "Palautit null; palauta tyhjä lista saavuttamattomalle kohteelle."));
        List<Vertex> afterVertices = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) afterVertices.add(vertex);
        require(afterVertices.size() == n, context + "\n" + text("Vertex count changed.", "Изменено число вершин.", "Solmumäärä muuttui."));
        for (int i = 0; i < n; i++) {
            Vertex vertex = vertices.get(i);
            require(afterVertices.get(i) == vertex && vertex.getColor() == 40 + i
                    && vertex.getIndex() == 100 + i && vertex.getWeight() == i + 0.5f
                    && vertex.getLabel().equals(sameLabels ? "X" : String.valueOf(i)),
                    context + "\n" + text("Input vertex fields changed at vertex ", "Изменены поля входной вершины ", "Syötesolmun kentät muuttuivat solmussa ") + i);
        }
        List<Edge> afterEdges = new ArrayList<>();
        for (Edge edge : graph.edges()) afterEdges.add(edge);
        require(afterEdges.size() == edges.size(), context + "\n" + text("Graph edges changed.", "Изменены рёбра графа.", "Verkon kaaret muuttuivat."));
        for (int i = 0; i < edges.size(); i++) {
            Edge edge = edges.get(i);
            require(afterEdges.contains(edge) && edge.getStartPoint() == vertices.get(input[i][0])
                    && edge.getEndPoint() == vertices.get(input[i][1]) && edge.getWeight() == 1.0f
                    && edge.getColor() == 70 + i && edge.getLabel().equals("E" + i),
                    context + "\n" + text("Input edge changed.", "Изменено входное ребро.", "Syötekaari muuttui."));
        }
        Map<Vertex, Integer> ids = new IdentityHashMap<>();
        for (int i = 0; i < n; i++) ids.put(vertices.get(i), i);
        context += "\n" + text("Returned path IDs: ", "Полученные номера вершин пути: ", "Palautetut polun solmunumerot: ") + describe(actual, ids);
        int shortest = expected(n, input, start)[target];
        if (shortest == 1000) {
            require(actual.isEmpty(), context + "\n" + text("Target is unreachable: expected an empty list.", "Цель недостижима: ожидался пустой список.", "Kohde on saavuttamaton: odotettu tyhjä lista."));
            return;
        }
        require(!actual.isEmpty(), context + "\n" + text("A path exists; expected a nonempty list.", "Путь существует; ожидался непустой список.", "Polku on olemassa; odotettu epätyhjä lista."));
        require(actual.size() <= n, context + "\n" + text("A shortest path cannot repeat vertices.", "Кратчайший путь не может повторять вершины.", "Lyhin polku ei voi toistaa solmuja."));
        Set<Vertex> seen = Collections.newSetFromMap(new IdentityHashMap<>());
        for (Object item : actual) {
            require(item instanceof Vertex && ids.containsKey(item), context + "\n" + text("Use actual input Vertex objects, not labels, nulls or foreign vertices.", "Нужны настоящие входные Vertex, а не метки, null или чужие вершины.", "Käytä oikeita syötteen Vertex-olioita, älä nimiä, null-arvoja tai vieraita solmuja."));
            Vertex vertex = (Vertex) item;
            require(seen.add(vertex), context + "\n" + text("Repeated vertex in the path.", "В пути повторяется вершина.", "Polussa on toistuva solmu."));
        }
        require(actual.get(0) == vertices.get(start) && actual.get(actual.size() - 1) == vertices.get(target),
                context + "\n" + text("Path must start at start and end at target. Did you reverse the parent chain?", "Путь должен идти от start к target. Вы развернули цепочку родителей?", "Polun tulee kulkea start-solmusta target-solmuun. Käänsitkö vanhempiketjun?"));
        for (int i = 1; i < actual.size(); i++) {
            Vertex previous = actual.get(i - 1);
            Vertex next = actual.get(i);
            require(previous.isAdjacent(next), context + "\n" + text("Missing directed edge: ", "Нет ориентированного ребра: ", "Puuttuva suunnattu kaari: ") + ids.get(previous) + "->" + ids.get(next));
        }
        require(actual.size() - 1 == shortest, context + "\n"
                + text("Path is not shortest: expected ", "Путь не кратчайший: ожидалось ", "Polku ei ole lyhin: odotettu ") + shortest
                + text(" edges, received ", " рёбер, получено ", " kaarta, saatu ") + (actual.size() - 1));
    }

    static String describe(List<?> path, Map<Vertex, Integer> ids) {
        List<String> names = new ArrayList<>();
        for (int i = 0; i < Math.min(path.size(), 20); i++) {
            Object item = path.get(i);
            names.add(item == null ? "null" : ids.containsKey(item) ? ids.get(item).toString() : "foreign/type");
        }
        if (path.size() > 20) names.add("...");
        return names.toString();
    }

    public static void main(String[] args) {
        int test = Integer.parseInt(args[0]);
        language = args[1];
        try {
            if (test < 9) {
                verify(SIZES[test], INPUTS[test], STARTS[test], TARGETS[test], test == 8);
            } else {
                Random random = new Random(11232026);
                for (int sample = 0; sample < 36; sample++) {
                    int n = 2 + random.nextInt(6);
                    List<int[]> edges = new ArrayList<>();
                    for (int from = 0; from < n; from++) {
                        for (int to = 0; to < n; to++) {
                            if (random.nextInt(4) == 0) edges.add(new int[]{from, to});
                        }
                    }
                    verify(n, edges.toArray(new int[0][]), random.nextInt(n), random.nextInt(n), sample % 2 == 0);
                }
            }
            System.out.println("PASS: " + text(NAMES[test][0], NAMES[test][1], NAMES[test][2]));
        } catch (Throwable error) {
            System.out.println(text("FAIL: ", "ОШИБКА: ", "VIRHE: ") + text(NAMES[test][0], NAMES[test][1], NAMES[test][2]));
            System.out.println(error.getMessage());
            System.exit(1);
        }
    }
}
