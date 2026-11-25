# IN traversal — TRA Java exercise

Write one recursive method in `Solution.java`:

```java
public static List<BTreeNode<?>> in(BTreeNode<?> node)
```

Return the subtree's **actual nodes** in **IN order: left, node, right**.
Processing a node means appending that node to the result list. The teaching
examples print element values; this exercise collects node references so equal
or null element values do not hide a traversal error.

## Small example

```text
        A
       / \
      B   C
     /
    D

in(A) = [D, B, A, C]
in(B) = [D, B]
in(C) = [C]
in(null) = []
```

Letters identify the pictured nodes. Return BTreeNode objects, not letters,
element values, copies or null children. IN follows the structure; it is sorted by key only when the tree satisfies the BST ordering invariant. This input is an arbitrary binary tree, not a promised BST.

## Contract

- `node` is null or the root of a proper binary subtree, with no cycles or shared
  child nodes. It may have a parent outside the subtree; follow only child links
  below the supplied node. For a whole TRA BTree, pass `tree.getRoot()`.
- Include every subtree node exactly once, in the specified order. Empty input
  gives an empty list, not null. Return only actual input BTreeNode references.
- Elements may repeat or be null; balance metadata is arbitrary. Neither is a
  node identifier or a traversal position.
- Preserve all child/parent links, element references, balance fields and the
  owning tree root. Every call returns only its traversal, with no accumulated
  results from previous attempts. Recursive helpers are allowed.

## Solve and check (JDK 11 or newer)

Extract this ZIP, open `btree-in` in your IDE and edit **only Solution.java**.
Replace the TODO exception with your recursive implementation. For completion,
add the supplied `traj.jar` as an IDE library. Save and run from that folder:

```bash
java -Dfile.encoding=UTF-8 Check.java en
```

Use `ru` or `fi` for Russian or Finnish feedback; English is the default. This
README is in English. The five files are Solution.java, Check.java,
TreeChecks.java, README.md and the original pinned traj.jar. No Maven, Gradle or
separate download is needed. Keep PRE, IN and POST in separate extracted folders:
each starter and checker implements just its own order.

The untouched starter reports `TODO: implement in`. Each run compiles the
current solution from scratch using `--release 11`. Save corrections and rerun
without an attempt limit. To start over, restore Solution.java from the ZIP.

## What is checked

Ten groups cover empty/leaf inputs, left/right chains, the drawing, balanced and
unequal branches, repeated values, an inner subtree with an outside parent, and
40 fixed-seed trees with null/repeated values. An independent iterative phase
walk over factory node indices computes the exact expected sequence. The checker
validates identity, membership, uniqueness, count, order and unchanged input.
Each method is called twice on the same objects. Each group gets a fresh JVM and
a five-second limit.

A failure shows child indices, queried root, call number, expected and returned
node IDs. It distinguishes missing/repeated/foreign nodes, null output, nodes
outside the subtree and the first incorrect position. Compilation errors, input
changes and stack overflow are separate. The diagnostic indices are not stored
in mutable element or balance fields. Passing cases do not prove recursion use
or asymptotic bounds; explain those separately. The timeout is not a benchmark.

## Hints — try first

1. Null is an empty subtree: the helper returns without appending anything.
2. Create one result ArrayList and pass it to a helper. Each call has its own
   node but appends to that same result list.
3. Append the current node **between the left and right child calls**. Complete the
   whole left subtree before starting the right subtree.

## Walkthrough

1. Descend from A through B to D, without appending A or B yet.
2. Append D after its missing left child, then return to B and append B.
3. B finishes and returns to A. Append A and then C, giving [D, B, A, C].

After a child returns, the waiting caller continues at its saved next action.
Returning control and appending a node are separate actions. Explain where the
append occurs in this order and why each actual node is included once.

With one output ArrayList and amortised O(1) appends, the standard recursive
solution takes Θ(n) time for n > 0, O(h + 1) stack for edge-height h, and O(n)
result storage. Empty input has constant cost. Copying/merging lists at every
recursive level can cost more; include that copying in your own analysis.
