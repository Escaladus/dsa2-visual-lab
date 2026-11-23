import fi.uef.cs.tra.DiGraph;
import fi.uef.cs.tra.Edge;
import fi.uef.cs.tra.Vertex;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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
        {{0, 1}, {1, 2}, {2, 3}},
        {{0, 1}, {0, 2}, {1, 3}, {2, 3}},
        {{0, 1}, {1, 2}, {2, 0}, {2, 3}},
        {{0, 1}, {1, 2}, {3, 4}, {4, 3}},
        {{0, 1}, {1, 2}},
        {{0, 1}, {1, 2}, {2, 3}, {0, 3}},
        {{0, 0}, {0, 1}},
        {{0, 1}, {1, 2}}
    };
    static final int[] SIZES = {1, 4, 5, 4, 6, 3, 4, 2, 4};
    static final String[][] NAMES = {
        {"isolated start", "изолированный старт", "erillinen aloitus"},
        {"chain", "цепочка", "ketju"},
        {"shared neighbour", "общий сосед", "yhteinen naapuri"},
        {"cycle", "цикл", "sykli"},
        {"disconnected graph", "несвязный граф", "epäyhtenäinen verkko"},
        {"edge direction", "направление рёбер", "kaarien suunta"},
        {"shorter alternative", "более короткий путь", "lyhyempi vaihtoehto"},
        {"self-loop", "петля", "silmukka"},
        {"equal labels", "одинаковые метки", "samat nimet"},
        {"30 reproducible graphs", "30 воспроизводимых графов", "30 toistettavaa verkkoa"}
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

    static void verify(int n, int[][] input, int start, boolean sameLabels) {
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
                + "; start=" + start;
        Map<Vertex, Integer> actual;
        try {
            actual = Solution.distances(vertices.get(start));
        } catch (Throwable error) {
            throw new AssertionError(context + "\n" + error.getClass().getSimpleName() + ": " + error.getMessage(), error);
        }
        require(actual != null, context + "\n" + text("Returned null; return a distance map.", "Возвращён null; нужна карта расстояний.", "Palautit null; palauta etäisyyskartta."));
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
        int[] expected = expected(n, input, start);
        int count = 0;
        for (int i = 0; i < n; i++) {
            Vertex vertex = vertices.get(i);
            if (expected[i] == 1000) {
                require(!actual.containsKey(vertex), context + "\n" + text("Unreachable vertex must be absent: ", "Недостижимая вершина должна отсутствовать: ", "Saavuttamattoman solmun on puututtava: ") + i);
            } else {
                count++;
                require(Integer.valueOf(expected[i]).equals(actual.get(vertex)), context + "\n"
                        + text("Wrong distance at vertex ", "Неверное расстояние до вершины ", "Väärä etäisyys solmuun ") + i
                        + ": " + text("expected ", "ожидалось ", "odotettu ") + expected[i]
                        + ", " + text("received ", "получено ", "saatu ") + actual.get(vertex));
            }
        }
        require(actual.size() == count, context + "\n" + text("Map contains foreign or extra keys.", "Карта содержит посторонние или лишние ключи.", "Kartassa on vieraita tai ylimääräisiä avaimia."));
    }

    public static void main(String[] args) {
        int test = Integer.parseInt(args[0]);
        language = args[1];
        try {
            if (test < 9) {
                verify(SIZES[test], INPUTS[test], test == 5 ? 2 : 0, test == 8);
            } else {
                Random random = new Random(11232026);
                for (int sample = 0; sample < 30; sample++) {
                    int n = 2 + random.nextInt(6);
                    List<int[]> edges = new ArrayList<>();
                    for (int from = 0; from < n; from++) {
                        for (int to = 0; to < n; to++) {
                            if (random.nextInt(4) == 0) edges.add(new int[]{from, to});
                        }
                    }
                    verify(n, edges.toArray(new int[0][]), random.nextInt(n), sample % 2 == 0);
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
