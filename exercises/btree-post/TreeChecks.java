import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.IdentityHashMap;
import java.util.Random;

/** Local checker. Students edit Solution.java only. */
public class TreeChecks {
    private static String language;

    private static String text(String en, String ru, String fi) {
        return "ru".equals(language) ? ru : "fi".equals(language) ? fi : en;
    }

    private static final int[][][] INPUTS = {
        {},
        {{-1, -1}},
        {{1, -1}, {2, -1}, {3, -1}, {-1, -1}},
        {{-1, 1}, {-1, 2}, {-1, 3}, {-1, -1}},
        {{1, 2}, {3, -1}, {-1, -1}, {-1, -1}},
        {{1, 2}, {3, 4}, {5, 6}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}},
        {{1, 2}, {-1, -1}, {-1, 3}, {4, -1}, {-1, 5}, {6, -1}, {-1, -1}},
        {{1, 2}, {3, 4}, {5, 6}, {-1, -1}, {-1, -1}, {-1, -1}, {-1, -1}},
        {{1, 2}, {3, -1}, {-1, -1}, {-1, -1}}
    };
    private static final String[][] NAMES = {
        {"empty subtree", "пустое поддерево", "tyhjä alipuu"},
        {"single leaf", "один лист", "yksi lehti"},
        {"left-only chain", "цепочка левых детей", "vasempien lasten ketju"},
        {"right-only chain", "цепочка правых детей", "oikeiden lasten ketju"},
        {"illustrated tree", "дерево с рисунка", "kuvan puu"},
        {"balanced tree", "сбалансированное дерево", "tasapainoinen puu"},
        {"unequal branch depths", "ветви разной глубины", "eri syvyiset haarat"},
        {"repeated values", "повторяющиеся значения", "toistuvat arvot"},
        {"inner subtree with an outside parent", "поддерево с внешним родителем", "alipuu jolla on ulkopuolinen vanhempi"},
        {"40 reproducible trees with null/repeated values", "40 воспроизводимых деревьев с null и повторами", "40 toistettavaa puuta null- ja toistuvilla arvoilla"}
    };

    private static void require(boolean value, String message) {
        if (!value) throw new AssertionError(message);
    }

    // Independent iterative oracle: factory IDs and explicit phases, no student recursion.
    private static List<Integer> expected(int[][] children, int root) {
        List<Integer> order = new ArrayList<>();
        ArrayDeque<int[]> pending = new ArrayDeque<>();
        if (root >= 0) pending.push(new int[]{root, 0});
        while (!pending.isEmpty()) {
            int[] item = pending.pop();
            int id = item[0];
            int phase = item[1]; // 0: before left, 1: between children, 2: after right.
            if (phase == 2) order.add(id);
            if (phase == 2) continue;
            pending.push(new int[]{id, phase + 1});
            int child = children[id][phase];
            if (child >= 0) pending.push(new int[]{child, 0});
        }
        return order;
    }

    /** Snapshot every input node, including nodes outside the queried subtree. */
    private static final class Snapshot {
        final BTreeNode<?> node;
        final BTreeNode<?> left;
        final BTreeNode<?> right;
        final BTreeNode<?> parent;
        final Object element;
        final int balance;

        Snapshot(BTreeNode<?> node) {
            this.node = node;
            left = node.getLeftChild();
            right = node.getRightChild();
            parent = node.getParent();
            element = node.getElement();
            balance = node.getBalance();
        }

        boolean unchanged() {
            return node.getLeftChild() == left && node.getRightChild() == right
                    && node.getParent() == parent && node.getElement() == element
                    && node.getBalance() == balance;
        }
    }

    private static void verify(int[][] children, int root, int values) {
        List<BTreeNode<String>> nodes = new ArrayList<>();
        for (int i = 0; i < children.length; i++) {
            // TRA checks element runtime types when linking children: keep each tree uniform.
            String element = values == 0 ? "N" + i : values == 1 ? "X" : null;
            BTreeNode<String> node = new BTreeNode<>(element);
            node.setBalance(47 + i); // Arbitrary metadata, not a traversal position.
            nodes.add(node);
        }
        for (int i = 0; i < children.length; i++) {
            if (children[i][0] >= 0) nodes.get(i).setLeftChild(nodes.get(children[i][0]));
            if (children[i][1] >= 0) nodes.get(i).setRightChild(nodes.get(children[i][1]));
        }
        BTree<String> tree = nodes.isEmpty() ? new BTree<>() : new BTree<>(nodes.get(0));
        BTreeNode<?> originalRoot = tree.getRoot();
        List<Snapshot> snapshots = new ArrayList<>();
        for (BTreeNode<?> node : nodes) snapshots.add(new Snapshot(node));
        String context = "\n" + text("Input child IDs [left, right]: ", "Номера детей входа [левый, правый]: ", "Syötteen lasten numerot [vasen, oikea]: ")
                + Arrays.deepToString(children) + "\n"
                + text("Queried root ID: ", "Номер корня поддерева: ", "Kysytyn juuren numero: ") + root
                + text(" (-1 means null)", " (-1 означает null)", " (-1 tarkoittaa null-arvoa)");
        Map<BTreeNode<?>, Integer> ids = new IdentityHashMap<>();
        for (int i = 0; i < nodes.size(); i++) ids.put(nodes.get(i), i);
        List<Integer> wanted = expected(children, root);
        // Repeat on the same objects to expose an accumulating result list.
        for (int attempt = 1; attempt <= 2; attempt++) {
            String callContext = context + "\n" + text("Call: ", "Вызов: ", "Kutsu: ") + attempt;
            List<BTreeNode<?>> actual;
            try {
                actual = Solution.post(root < 0 ? null : nodes.get(root));
            } catch (StackOverflowError error) {
                throw new AssertionError(callContext + "\n" + text(
                        "Stack overflow: check the null base case and that recursion moves to children.",
                        "Переполнение стека: проверьте базовый случай null и переход рекурсии к детям.",
                        "Pinon ylivuoto: tarkista null-perustapaus ja rekursion siirtyminen lapsiin."), error);
            } catch (Throwable error) {
                throw new AssertionError(callContext + "\n" + error.getClass().getSimpleName() + ": " + error.getMessage(), error);
            }
            String feedback = callContext + "\n" + text("Expected node IDs: ", "Ожидаемые номера узлов: ", "Odotetut solmunumerot: ") + wanted
                    + "\n" + text("Returned node IDs: ", "Полученные номера узлов: ", "Palautetut solmunumerot: ") + describe(actual, ids);
            require(tree.getRoot() == originalRoot, feedback + "\n" + text(
                    "Input tree root changed.", "Изменён корень входного дерева.", "Syötepuun juuri muuttui."));
            for (int i = 0; i < snapshots.size(); i++) {
                require(snapshots.get(i).unchanged(), feedback + "\n" + text(
                        "Input node changed (children/parent/element/balance), ID: ",
                        "Изменён входной узел (дети/родитель/элемент/balance), номер: ",
                        "Syötesolmu muuttui (lapset/vanhempi/alkio/balance), numero: ") + i);
            }
            verifyOrder(actual, wanted, ids, feedback);
        }
    }

    private static void verifyOrder(List<?> actual, List<Integer> wanted,
            Map<BTreeNode<?>, Integer> ids, String context) {
        require(actual != null, context + "\n" + text(
                "Returned null; an empty subtree needs an empty list.",
                "Возвращён null; для пустого поддерева нужен пустой список.",
                "Palautit null; tyhjä alipuu tarvitsee tyhjän listan."));
        boolean[] inSubtree = new boolean[ids.size()];
        for (int id : wanted) inSubtree[id] = true;
        boolean[] seen = new boolean[ids.size()];
        List<Integer> received = new ArrayList<>();
        for (Object item : actual) {
            require(item instanceof BTreeNode<?> && ids.containsKey(item), context + "\n" + text(
                    "Return actual input BTreeNode objects, not elements, null children or new copies.",
                    "Верните настоящие входные BTreeNode, а не элементы, null-детей или новые копии.",
                    "Palauta oikeat syötteen BTreeNode-oliot, älä alkioita, null-lapsia tai uusia kopioita."));
            int id = ids.get(item);
            require(!seen[id], context + "\n" + text("Repeated node ID: ", "Повторяется узел: ", "Toistuva solmunumero: ") + id);
            require(inSubtree[id], context + "\n" + text(
                    "Node outside the queried subtree, ID: ", "Узел вне выбранного поддерева, номер: ", "Solmu kysytyn alipuun ulkopuolelta, numero: ") + id);
            seen[id] = true;
            received.add(id);
        }
        require(received.size() == wanted.size(), context + "\n" + text(
                "Missing nodes: expected ", "Пропущены узлы: ожидалось ", "Puuttuvia solmuja: odotettu ") + wanted.size()
                + text(", received ", ", получено ", ", saatu ") + received.size());
        for (int i = 0; i < wanted.size(); i++) {
            require(wanted.get(i).equals(received.get(i)), context + "\n" + text(
                    "Wrong order at position ", "Неверный порядок в позиции ", "Väärä järjestys kohdassa ") + i
                    + text(": expected node ", ": ожидался узел ", ": odotettu solmu ") + wanted.get(i)
                    + text(", received node ", ", получен узел ", ", saatu solmu ") + received.get(i)
                    + "\nPOST: left, right, node.");
        }
    }

    // Do not call node.toString(): diagnostics must also handle null/repeated payloads safely.
    private static String describe(List<?> actual, Map<BTreeNode<?>, Integer> ids) {
        if (actual == null) return "null";
        List<String> result = new ArrayList<>();
        for (int i = 0; i < Math.min(actual.size(), 48); i++) {
            Object item = actual.get(i);
            result.add(item == null ? "null" : ids.containsKey(item) ? ids.get(item).toString() : "foreign/type");
        }
        if (actual.size() > 48) result.add("...");
        return result.toString();
    }

    private static int[][] randomTree(int n, Random random) {
        int[][] children = new int[n][2];
        for (int[] pair : children) Arrays.fill(pair, -1);
        List<int[]> slots = new ArrayList<>();
        if (n > 0) {
            slots.add(new int[]{0, 0});
            slots.add(new int[]{0, 1});
        }
        for (int node = 1; node < n; node++) {
            int[] slot = slots.remove(random.nextInt(slots.size()));
            children[slot[0]][slot[1]] = node;
            slots.add(new int[]{node, 0});
            slots.add(new int[]{node, 1});
        }
        return children;
    }

    public static void main(String[] args) {
        int test = Integer.parseInt(args[0]);
        language = args[1];
        try {
            if (test < 9) {
                verify(INPUTS[test], test == 0 ? -1 : test == 8 ? 1 : 0, test == 7 ? 1 : 0);
            } else {
                Random random = new Random(11252027);
                for (int sample = 0; sample < 40; sample++) {
                    int n = sample == 0 ? 0 : sample == 1 ? 1 : sample == 2 ? 4 : random.nextInt(41);
                    int[][] children = randomTree(n, random);
                    verify(children, n == 0 ? -1 : 0, sample % 2 == 0 ? 2 : 1);
                    if (n > 1) verify(children, 1 + random.nextInt(n - 1), sample % 2 == 0 ? 2 : 1);
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
