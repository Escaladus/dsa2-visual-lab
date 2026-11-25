import fi.uef.cs.tra.BTree;
import fi.uef.cs.tra.BTreeNode;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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

    // Independent oracle: visit factory indices iteratively, never call the student method.
    private static int expected(int[][] children, int root) {
        int count = 0;
        int height = -1;
        ArrayDeque<int[]> pending = new ArrayDeque<>();
        if (root >= 0) pending.add(new int[]{root, 0});
        while (!pending.isEmpty()) {
            int[] item = pending.remove();
            count++;
            height = Math.max(height, item[1]);
            for (int child : children[item[0]]) {
                if (child >= 0) pending.add(new int[]{child, item[1] + 1});
            }
        }
        return count;
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
            node.setBalance(47 + i); // Metadata is arbitrary, not a cached size or height.
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
        int wanted = expected(children, root);
        // Two calls on the same objects expose an unreset accumulator and stale state.
        for (int attempt = 1; attempt <= 2; attempt++) {
            int actual;
            try {
                actual = Solution.size(root < 0 ? null : nodes.get(root));
            } catch (StackOverflowError error) {
                throw new AssertionError(context + "\n" + text(
                        "Stack overflow: check the null base case and that recursion moves to children.",
                        "Переполнение стека: проверьте базовый случай null и переход рекурсии к детям.",
                        "Pinon ylivuoto: tarkista null-perustapaus ja rekursion siirtyminen lapsiin."), error);
            } catch (Throwable error) {
                throw new AssertionError(context + "\n" + error.getClass().getSimpleName() + ": " + error.getMessage(), error);
            }
            require(tree.getRoot() == originalRoot, context + "\n" + text(
                    "Input tree root changed.", "Изменён корень входного дерева.", "Syötepuun juuri muuttui."));
            for (int i = 0; i < snapshots.size(); i++) {
                require(snapshots.get(i).unchanged(), context + "\n" + text(
                        "Input node changed (children/parent/element/balance), ID: ",
                        "Изменён входной узел (дети/родитель/элемент/balance), номер: ",
                        "Syötesolmu muuttui (lapset/vanhempi/alkio/balance), numero: ") + i);
            }
            require(actual == wanted, context + "\n" + text("Call: ", "Вызов: ", "Kutsu: ") + attempt
                    + "; " + text("expected ", "ожидалось ", "odotettu ") + wanted
                    + text(", received ", ", получено ", ", saatu ") + actual + "\n" + text("Count nodes, including the root and both subtrees; null contributes zero.", "Считайте узлы, включая корень и оба поддерева; null даёт ноль.", "Laske solmut, myös juuri ja molemmat alipuut; null antaa nollan."));
        }
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
