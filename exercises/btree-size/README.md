# Count BTree nodes — TRA Java exercise

Write **one recursive method** in `Solution.java`:

```java
public static int size(BTreeNode<?> node)
```

Count all actual nodes in the supplied subtree, including its root. Return 0 for null. Do not count only leaves, levels or distinct element values.

## Small example

```text
        A
       / \
      B   C
     /
    D

size(A) = 4; size(B) = 2; size(C) = 1; size(null) = 0
```

## Contract

- `node` is null or the root of a proper binary subtree: no cycles or shared
  child nodes. It can be an inner subtree with a parent outside it. Follow only
  the child links below the given node.
- Use `node.getLeftChild()` and `node.getRightChild()`. For a TRA `BTree`, the
  argument is `tree.getRoot()`; an empty tree has a null root.
- Count/measure structure. Values may repeat or be null; neither element values
  nor the arbitrary `balance` metadata identify nodes or store the answer.
- Preserve child/parent links, element references and balance fields. Do not
  detach, replace or otherwise modify nodes. Helper methods are allowed.
- This is a binary-tree task, not a BST ordering or graph traversal task.

## Solve and check (JDK 11 or newer)

Extract this ZIP and open its `btree-size` folder in your IDE. Edit **only
`Solution.java`**, replacing the TODO exception with your method. Add the supplied
`traj.jar` as an IDE library for completion. Save, then run from that folder:

```bash
java -Dfile.encoding=UTF-8 Check.java en
```

Use `ru` or `fi` for Russian or Finnish checker messages; English is the default.
The README is in English. The five files are `Solution.java`, `Check.java`,
`TreeChecks.java`, `README.md` and the original pinned `traj.jar`. No Maven,
Gradle or separate download is needed. Size and height are independent tasks:
use each solution and checker from its own extracted folder.

The untouched starter reports `TODO: implement size`. Every run compiles the
current solution from scratch using `--release 11`. Correct, save and rerun
without an attempt limit. To start over, restore `Solution.java` from the ZIP.

## What is checked

Ten groups: empty subtree, leaf, left-only chain, right-only chain, the drawing,
balanced tree, unequal branch depths, repeated values, an inner subtree with an
outside parent, and 40 fixed-seed trees with repeated/null elements. Each method
is called twice on the same input to reveal stale accumulators. An independent
iterative calculation over the factory's node indices supplies expected values.
The checker preserves and compares all input nodes, including the part outside
the requested subtree. Each group has a fresh JVM and a five-second time limit.

Failures show the input's `[left, right]` child indices (`-1` means missing), the
queried root, expected/actual answers and call number. Input mutation, unfinished
TODO, compilation errors and stack overflow have separate feedback. Passing
cases do not prove recursion use or asymptotic bounds; explain those yourself.
The time limit detects nontermination rather than measuring efficiency.

## Hints — try first

1. An empty subtree contains zero nodes. Check `node == null` before reading children.
2. Recursively ask for the left and right subtree sizes. Each call counts its own part.
3. Count the current node once and add both results. Use local results rather than
   a running total that survives independent calls.

## Walkthrough of the drawing

1. D and C are leaves. Each contributes 1; missing children contribute 0.
2. B contains B and D, so it returns 2.
3. A combines its own 1 with the child counts 2 and 1, giving 4.

## Reasoning after solving

Explain your base case and how the two child results form the current result.
The standard recursive implementation visits every real node once: for `n > 0`,
time is Θ(n) and stack space is O(h + 1), where h is height in edges. A null-child
base call may add one short frame. Empty input takes Θ(1) time and space. The
returned integer uses O(1) space; the input tree is excluded. A chain can require
O(n) stack, while a balanced tree uses O(log(n + 1)) stack. Both still visit all
n nodes, so a balanced height calculation is not a logarithmic-time search.
