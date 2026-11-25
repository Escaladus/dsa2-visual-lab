import fi.uef.cs.tra.Graph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

/** Local checker. Students edit Solution.java only. */
public class GraphChecks {
    private static String language;

    private static String text(String en, String ru, String fi) {
        return "ru".equals(language) ? ru : "fi".equals(language) ? fi : en;
    }

    private static final int[][][] INPUTS = {
        {},
        {},
        {},
        {{0, 1}, {1, 2}, {2, 3}},
        {{0, 1}, {3, 4}},
        {{0, 1}, {1, 2}, {2, 0}, {3, 4}},
        {{0, 1}, {1, 2}, {2, 0}, {3, 4}, {4, 5}, {5, 3}, {2, 3}},
        {{1, 0}, {3, 4}, {1, 2}},
        {{0, 1}, {1, 2}, {3, 4}}
    };
    private static final int[] SIZES = {0, 1, 4, 4, 5, 6, 6, 5, 6};
    private static final String[][] NAMES = {
        {"empty graph", "пустой граф", "tyhjä verkko"},
        {"single vertex", "одна вершина", "yksi solmu"},
        {"all vertices isolated", "все вершины изолированы", "kaikki solmut erillisiä"},
        {"connected chain", "связная цепочка", "yhtenäinen ketju"},
        {"illustrated three components", "три компоненты с рисунка", "kuvan kolme komponenttia"},
        {"cycle, pair and isolated vertex", "цикл, пара и изолированная вершина", "sykli, pari ja erillinen solmu"},
        {"two cycles joined by a bridge", "два цикла соединены мостом", "kaksi sykliä yhdistetty sillalla"},
        {"undirected endpoint orientation", "порядок концов неориентированного ребра", "suuntaamattoman kaaren päätepistejärjestys"},
        {"equal labels", "одинаковые метки", "samat nimet"},
        {"40 reproducible graphs", "40 воспроизводимых графов", "40 toistettavaa verkkoa"}
    };

    private static void require(boolean value, String message) {
        if (!value) throw new AssertionError(message);
    }

    // Transitive closure is independent of either student traversal (DFS or BFS).
    private static boolean[][] connectivity(int n, int[][] edges) {
        boolean[][] connected = new boolean[n][n];
        for (int i = 0; i < n; i++) connected[i][i] = true;
        for (int[] edge : edges) {
            connected[edge[0]][edge[1]] = true;
            connected[edge[1]][edge[0]] = true;
        }
        for (int via = 0; via < n; via++) {
            for (int from = 0; from < n; from++) {
                for (int to = 0; to < n; to++) {
                    connected[from][to] |= connected[from][via] && connected[via][to];
                }
            }
        }
        return connected;
    }

    private static void verify(int n, int[][] input, boolean sameLabels) {
        Graph graph = new Graph();
        List<Vertex> vertices = new ArrayList<>();
        Map<Vertex, Integer> ids = new IdentityHashMap<>();
        for (int i = 0; i < n; i++) {
            Vertex vertex = graph.addVertex(sameLabels ? "X" : String.valueOf(i));
            vertex.setColor(40 + i); // This task has no WHITE precondition.
            vertex.setIndex(100 + i);
            vertex.setWeight(i + 0.5f);
            vertices.add(vertex);
            ids.put(vertex, i);
        }
        List<Edge> edges = new ArrayList<>();
        for (int i = 0; i < input.length; i++) {
            Edge edge = vertices.get(input[i][0]).addEdge(vertices.get(input[i][1]), 1.0f);
            edge.setColor(70 + i);
            edge.setLabel("E" + i);
            edges.add(edge);
        }
        String context = "\n" + text("Input: ", "Вход: ", "Syöte: ") + "V=" + n
                + "; " + text("undirected edges: ", "неориентированные рёбра: ", "suuntaamattomat kaaret: ")
                + Arrays.deepToString(input);
        List<List<Vertex>> actual;
        try {
            actual = Solution.components(graph);
        } catch (Throwable error) {
            throw new AssertionError(context + "\n" + error.getClass().getSimpleName() + ": " + error.getMessage(), error);
        }
        context += "\n" + text("Returned groups (vertex IDs): ", "Полученные группы (номера вершин): ", "Palautetut ryhmät (solmunumerot): ")
                + describe(actual, ids);
        verifyUnchanged(graph, vertices, edges, input, sameLabels, context);
        verifyPartition(actual, ids, connectivity(n, input), context);
    }

    private static void verifyUnchanged(Graph graph, List<Vertex> vertices, List<Edge> edges,
            int[][] input, boolean sameLabels, String context) {
        List<Vertex> afterVertices = new ArrayList<>();
        for (Vertex vertex : graph.vertices()) afterVertices.add(vertex);
        require(afterVertices.size() == vertices.size(), context + "\n"
                + text("Vertex count changed.", "Изменено число вершин.", "Solmumäärä muuttui."));
        for (int i = 0; i < vertices.size(); i++) {
            Vertex vertex = vertices.get(i);
            require(afterVertices.get(i) == vertex && vertex.getColor() == 40 + i
                    && vertex.getIndex() == 100 + i && vertex.getWeight() == i + 0.5f
                    && Objects.equals(vertex.getLabel(), sameLabels ? "X" : String.valueOf(i)),
                    context + "\n" + text("Input vertex fields changed at vertex ", "Изменены поля входной вершины ", "Syötesolmun kentät muuttuivat solmussa ") + i);
        }
        List<Edge> afterEdges = new ArrayList<>();
        for (Edge edge : graph.edges()) afterEdges.add(edge);
        require(afterEdges.size() == edges.size(), context + "\n"
                + text("Graph edges changed.", "Изменены рёбра графа.", "Verkon kaaret muuttuivat."));
        for (int i = 0; i < edges.size(); i++) {
            Edge edge = edges.get(i);
            require(afterEdges.contains(edge) && edge.getStartPoint() == vertices.get(input[i][0])
                    && edge.getEndPoint() == vertices.get(input[i][1]) && edge.getWeight() == 1.0f
                    && edge.getColor() == 70 + i && Objects.equals(edge.getLabel(), "E" + i),
                    context + "\n" + text("Input edge changed.", "Изменено входное ребро.", "Syötekaari muuttui."));
        }
    }

    private static void verifyPartition(List<?> groups, Map<Vertex, Integer> ids,
            boolean[][] connected, String context) {
        require(groups != null, context + "\n" + text(
                "Returned null; return an empty list for an empty graph.",
                "Возвращён null; для пустого графа нужен пустой список.",
                "Palautit null; palauta tyhjä lista tyhjälle verkolle."));
        int[] groupOf = new int[ids.size()];
        Arrays.fill(groupOf, -1);
        for (int group = 0; group < groups.size(); group++) {
            Object item = groups.get(group);
            require(item instanceof List<?>, context + "\n" + text(
                    "Each component must be a non-null list.", "Каждая компонента должна быть списком, не null.", "Jokaisen komponentin on oltava lista, ei null."));
            List<?> members = (List<?>) item;
            require(!members.isEmpty(), context + "\n" + text(
                    "Empty component: omit empty groups, including for an empty graph.",
                    "Пустая компонента: не добавляйте пустые группы, в том числе для пустого графа.",
                    "Tyhjä komponentti: älä lisää tyhjiä ryhmiä edes tyhjälle verkolle."));
            for (Object member : members) {
                require(member instanceof Vertex && ids.containsKey(member), context + "\n" + text(
                        "Use actual input Vertex objects, not labels, nulls or foreign vertices.",
                        "Нужны настоящие входные Vertex, а не метки, null или чужие вершины.",
                        "Käytä oikeita syötteen Vertex-olioita, älä nimiä, null-arvoja tai vieraita solmuja."));
                int id = ids.get(member);
                require(groupOf[id] == -1, context + "\n" + text(
                        "Repeated vertex: ", "Вершина повторяется: ", "Toistuva solmu: ") + id);
                groupOf[id] = group;
            }
        }
        for (int id = 0; id < groupOf.length; id++) {
            require(groupOf[id] != -1, context + "\n" + text(
                    "Missing vertex: ", "Пропущена вершина: ", "Puuttuva solmu: ") + id
                    + text(". Include isolated vertices too.", ". Включайте и изолированные вершины.", ". Lisää myös erilliset solmut."));
        }
        // Membership equivalence accepts every ordering, without sorting labels or IDs.
        for (int from = 0; from < groupOf.length; from++) {
            for (int to = from + 1; to < groupOf.length; to++) {
                boolean together = groupOf[from] == groupOf[to];
                require(connected[from][to] == together, context + "\n" + (connected[from][to]
                        ? text("Connected vertices were split into different components: ", "Связанные вершины разделены на разные компоненты: ", "Yhteydessä olevat solmut on jaettu eri komponentteihin: ")
                        : text("Disconnected vertices were merged into one component: ", "Несвязанные вершины объединены в одну компоненту: ", "Erilliset solmut on yhdistetty samaan komponenttiin: ")) + from + ", " + to);
            }
        }
    }

    // Limit feedback size for a broken solution; IDs never come from mutable labels/index.
    private static String describe(List<?> groups, Map<Vertex, Integer> ids) {
        if (groups == null) return "null";
        List<String> result = new ArrayList<>();
        for (int i = 0; i < Math.min(groups.size(), 12); i++) {
            Object group = groups.get(i);
            if (!(group instanceof List<?>)) {
                result.add(group == null ? "null" : "type");
                continue;
            }
            List<?> members = (List<?>) group;
            List<String> names = new ArrayList<>();
            for (int j = 0; j < Math.min(members.size(), 12); j++) {
                Object member = members.get(j);
                names.add(member == null ? "null" : ids.containsKey(member) ? ids.get(member).toString() : "foreign/type");
            }
            if (members.size() > 12) names.add("...");
            result.add(names.toString());
        }
        if (groups.size() > 12) result.add("...");
        return result.toString();
    }

    public static void main(String[] args) {
        int test = Integer.parseInt(args[0]);
        language = args[1];
        try {
            if (test < 9) {
                verify(SIZES[test], INPUTS[test], test == 8);
            } else {
                Random random = new Random(11252026);
                for (int sample = 0; sample < 40; sample++) {
                    int n = random.nextInt(9);
                    List<int[]> edges = new ArrayList<>();
                    for (int from = 0; from < n; from++) {
                        for (int to = from + 1; to < n; to++) {
                            if (random.nextInt(4) == 0) {
                                // Graph has no direction, even when stored endpoints are reversed.
                                edges.add(random.nextBoolean() ? new int[]{from, to} : new int[]{to, from});
                            }
                        }
                    }
                    verify(n, edges.toArray(new int[0][]), sample % 2 == 0);
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
