export default {
  ui: {
    handout: 'Handout',
    materialAuthor: 'Author',
    handoutPages: 'pp.',
    javaExamples: 'Java examples',
    javaNote:
      'Standalone examples for JDK 11+. Download the file and run the command below. The course TRA library is not required.',
    javaComparison: 'Optional: standalone JDK versions',
    javaComparisonNote:
      'The TRA examples appear above. These optional comparisons use arrays or JDK collections and run with JDK 11+ without traj.jar.',
    runJava: 'Run',
    expectedOutput: 'Expected output',
    downloadJava: 'Download .java',
    complexityLabel: 'Cost and assumptions',
  },
  group: 'External memory',
  topics: [
    ['Lists, stacks and queues', 'ADT, ArrayList, LinkedList, ArrayDeque'],
    ['Set in Java', 'Union, intersection, difference, HashSet, TreeSet'],
    ['Map in Java', 'Frequencies, entrySet, HashMap, TreeMap'],
    ['Weighted shortest paths', 'Dijkstra, Floyd–Warshall, negative weights'],
    ['Minimum spanning trees', 'Prim, Kruskal, union–find'],
    ['Graph analysis and flow', 'Cycles, cuts, matching, residual network'],
    ['Algorithm strategies', 'Greedy, divide-and-conquer, DP, amortisation'],
    ['String matching', 'Naive, Rabin–Karp, automata, approximate matching'],
    ['Files and B-trees', 'Blocks, external merge, fixed-size records'],
  ],
  pages: {
    overview: {
      cards: [
        [
          'The handout and this study guide',
          'The course covers ADTs, complexity, directed and undirected graphs, algorithm strategies, strings and external memory. Each lesson identifies the relevant handout sections. The examples below are independent teaching implementations using standard Java.',
        ],
      ],
    },
    complexity: {
      cards: [
        [
          'O, Ω and Θ',
          'O is an asymptotic upper bound, Ω a lower bound, and Θ a tight bound. These symbols do not themselves mean worst, best or average case: first specify which running-time function is being bounded.',
        ],
        [
          'Recursion',
          'Binary search: T(n) = T(n/2) + Θ(1) gives Θ(log n). Merge sort: T(n) = 2T(n/2) + Θ(n) gives Θ(n log n). Count both the number of calls and the work in each call.',
        ],
        [
          'Measurement and extrapolation',
          'Measure large inputs after JVM warm-up and repeat the measurement. Doubling n suggests roughly 2× work for linear growth and 4× for quadratic growth. Measurements support a model; they do not prove a bound.',
        ],
      ],
    },
    'sorted-lists': {
      cards: [
        [
          'Why the implementation uses iterators',
          'Repeated `get(i)` on a LinkedList can make a seemingly linear merge quadratic. The runnable example advances two iterators, handles both remaining tails and suppresses duplicates within each input as well as between the inputs. Inputs must be sorted and contain no nulls.',
        ],
      ],
    },
    'sets-maps': {
      cards: [
        [
          'ADT notation versus Java methods',
          'The handout illustrates an abstract Set with `union` and `member`. Java Set has `contains` for membership; build a union by copying the first set and calling `addAll`. Intersection uses `retainAll`, difference uses `removeAll`. These operations modify the receiver.',
        ],
        [
          'Choose an implementation',
          'HashSet/HashMap provide expected constant-time basic lookup with well-distributed hashes, and no iteration order guarantee. LinkedHashSet/LinkedHashMap preserve insertion order. TreeSet/TreeMap maintain key order with O(log n) basic operations.',
        ],
        [
          'Equality and stable keys',
          'Equal objects must have equal hash codes; equal hash codes do not imply equal objects. Do not mutate fields used by `equals`/`hashCode` while an object is a hash key. Tree collections identify duplicates by a comparison result of zero.',
        ],
      ],
    },
    trees: {
      cards: [
        [
          'Height and recursion space',
          'Height counts edges: empty −1, leaf 0, chain of n nodes n − 1. Levels are h + 1. Traversal takes Θ(n) time and O(h + 1) stack for a nonempty tree, plus O(n) output lists. Null-base calls add one short frame.',
        ],
        [
          'Binary and general TRA trees',
          '`BTree`/`BTreeNode` use left and right children; IN is sorted only for a BST. `Tree`/`TreeNode` use first child and next sibling. See the expanded lesson for the real APIs and examples.',
        ],
      ],
    },
    heap: {
      cards: [
        [
          'The TRA priority queue',
          'Use an explicit `fi.uef.cs.tra.PriorityQueue` import. It extends JDK PriorityQueue; a custom comparator needs `new PriorityQueue<>(11, comparator)`. Equal values are retained. Empty `peek`/`poll` return null; inserting null is rejected.',
        ],
        [
          'Priority and iteration',
          'Use repeated `poll` for priority order; iterator order is unspecified. `contains`/`remove(Object)` take O(n). Mutating a queued priority does not repair an ordinary queue. The drawing illustrates a heap, while an individual queue may have another valid internal layout.',
        ],
      ],
    },
    'graph-basics': {
      cards: [
        [
          'Adjacency list versus matrix',
          'Let V be the vertex count and E the edge count. Lists use O(V + E) space and enumerate a vertex’s neighbors in O(deg(v)); a matrix uses O(V²) space, tests an edge in O(1), and scans neighbors in O(V). DFS with a matrix therefore costs O(V²).',
        ],
        [
          'The course graph API',
          'The main examples use `fi.uef.cs.tra`: create `Graph` or `DiGraph`, add vertices with `addVertex`, and connect their returned `Vertex` objects with `addEdge`. Read `vertices()`, `neighbors()` and `edges()`; `Edge.getWeight()` returns a float.',
        ],
        [
          'Labels, identity and colours',
          'A label from `getLabel()` is display data: two distinct Vertex objects may have the same label. `getColor()` and `setColor(...)` store traversal state. Initialise colours explicitly with `AbstractGraph.WHITE`; GREY and BLACK will be explained in the traversal lessons.',
        ],
        [
          'Loops and supported inputs',
          'A self-loop connects a vertex to itself. This TRA version permits it in `DiGraph`, but `Graph` rejects it. The lesson examples use no parallel edges. An isolated vertex still belongs to `vertices()` and has an empty neighbour list.',
        ],
      ],
    },
    'graph-dfs': {
      cards: [
        [
          'A full DFS forest',
          'A single starting vertex may not reach every vertex. To process the entire graph, loop over all vertices and start DFS from each unvisited one. Adjacency-list traversal costs O(V + E). Deep graphs may require an explicit stack to avoid recursion overflow.',
        ],
      ],
    },
    'graph-bfs': {
      cards: [
        [
          'Restore a path and handle unreachable vertices',
          'Keep `parent[next] = v` when discovering a vertex. Follow parents backwards from the target and reverse the result. An unreachable target has no path. BFS finds shortest paths by edge count; equal non-negative edge weights also make these minimum-weight paths.',
        ],
      ],
    },
    'graph-apps': {
      cards: [
        [
          'Direction changes connectivity',
          'Connected components apply directly to undirected graphs. For a directed graph, distinguish weak connectivity (ignore edge directions) from strong connectivity (each vertex can reach every other). A single DFS forest does not compute strongly connected components.',
        ],
        [
          'Full traversal does not create a path',
          'In the TRA parent/root maps, only vertices under the original start have a path from that start. Later BFS roots keep distance -1 (∞ in the table), even when their own forest depth is zero. Follow outgoing neighbours in DiGraph: reachability in one direction need not hold in reverse.',
        ],
        [
          'Cost and result checks',
          'TraComponentsExample and TraTopologicalExample use native neighbours: Θ(V + E) time, O(V) additional space, including outputs and stack. Colours reset per run; topology stays intact. Validate paths by their edges, components by coverage and connectivity, and topological orders by every u→v constraint, rather than requiring one exact listing. The shared animation prepares sorted neighbours separately.',
        ],
        [
          'Further course algorithms',
          'See the lessons on weighted shortest paths, minimum spanning trees, and graph analysis for Dijkstra, Floyd–Warshall, Prim, Kruskal, articulation points, matching and maximum flow.',
        ],
      ],
    },
    'java-tools': {
      cards: [
        [
          'Safe removal with Iterator',
          'Call `next` before `remove`, and remove at most once per `next`. For a mutable ArrayList, use the iterator’s own `remove` when removing during traversal. A foreach loop is convenient when structural modification is not needed.',
        ],
        [
          'Comparable, Comparator and generics',
          'Use `Comparable<T>` for a natural order and `Comparator<T>` for alternative orders. Prefer `Integer.compare` or `comparingInt` to subtraction, which can overflow. A bound such as `<T extends Comparable<? super T>>` lets generic code compare its values safely.',
        ],
      ],
    },
    adts: {
      title: 'Lists, stacks, queues and the ADT contract',
      intro:
        'An ADT specifies operations and their meaning. Its implementation determines memory use and operation costs.',
      cards: [
        [
          'List versus array',
          'An array has fixed length and O(1) indexed access. An ArrayList supports O(1) indexed access, amortised O(1) appends, and O(n) insertion/removal in the middle. A LinkedList has O(n) indexed access; traversing it with an iterator is O(n) in total.',
        ],
        [
          'Stack: LIFO',
          'Use `Deque<T>` with ArrayDeque: `push`, `peek`, `pop`. The most recently inserted element leaves first. Empty `pop` throws; `pollFirst` returns null. ArrayDeque does not permit null elements.',
        ],
        [
          'Queue: FIFO',
          'Use `addLast`/`offerLast` and `removeFirst`/`pollFirst` at opposite ends. ArrayDeque’s endpoint insertions are amortised O(1). BFS needs this FIFO behavior; a priority queue uses a different removal rule.',
        ],
        [
          'Choose operations before implementation',
          'Use List for sequence order and duplicates, Set for uniqueness, Map for key–value associations, and PriorityQueue for repeatedly choosing the highest-priority item. The declared interface expresses what the algorithm needs.',
        ],
      ],
    },
    sets: {
      title: 'Set: membership and set operations in Java',
      intro:
        'A set contains each logical element at most once. Choose its implementation according to lookup and ordering requirements.',
      cards: [
        [
          'add, contains, remove',
          '`add(x)` returns false when x is already present. `contains(x)` checks membership; `remove(x)` removes it. HashSet does not preserve insertion or sorted order. The printed examples use TreeSet only to make the output deterministic.',
        ],
        [
          'Union, intersection and difference',
          'A ∪ B contains elements from either set; A ∩ B contains common elements; A \\ B contains elements only in A. Copy A into a mutable HashSet before `addAll`, `retainAll` or `removeAll` to keep the original unchanged.',
        ],
        [
          'Ordered sets',
          'TreeSet adds range queries such as `floor`, `ceiling` and `subSet`. Its comparator determines uniqueness: comparing strings only by length treats all strings of the same length as one value. Add a tie-breaker when those strings should remain distinct.',
        ],
        [
          'Common mistakes',
          '`Set.of` is immutable and rejects duplicate arguments and nulls. `new HashSet<>(collection)` creates a mutable set and collapses duplicates. Use `equals` for logical equality and keep hash-key identity fields stable.',
        ],
      ],
    },
    maps: {
      title: 'Map: keys, values and frequency counting',
      intro:
        'A map associates one value with each distinct key. Several keys can have the same value.',
      cards: [
        [
          'Core operations',
          '`put` adds a mapping or replaces the old value for a key. `get` reads it; `containsKey` checks key presence. With maps permitting null values, `get(key) == null` does not distinguish an absent key from a key mapped to null.',
        ],
        [
          'Counting and grouping',
          'Use `getOrDefault(key, 0)` or `merge(key, 1, Integer::sum)` to count frequencies. `computeIfAbsent` is useful for creating a list or set for each key, as in an adjacency map.',
        ],
        [
          'Iterate with entrySet',
          'Use `entrySet()` when both keys and values are needed. Use `keySet()` or `values()` when only one side is needed. HashMap iteration order is unspecified; TreeMap orders keys, while LinkedHashMap preserves insertion order by default.',
        ],
        [
          'Map and graphs',
          'TRA stores the vertices and edges. Use `Map<Vertex, Integer>` for extra counts or distances and `Map<Vertex, Vertex>` for parents. `IdentityHashMap` keeps distinct vertex objects separate even if their labels match. The runnable TRA example counts outgoing neighbours; Map does not replace the graph.',
        ],
      ],
    },
    'shortest-paths': {
      title: 'Dijkstra and Floyd–Warshall',
      intro:
        'Use real TRA Graph/DiGraph, Vertex and Edge objects. Shortest means minimum total edge weight: Dijkstra answers from one start, Floyd–Warshall for all pairs. BFS remains suitable when all edge weights are equal and non-negative.',
      cards: [
        [
          'Dijkstra: non-negative weights',
          'Validate every Edge weight, including unreachable parts: it must be finite and non-negative. Extract the smallest current distance and relax outgoing edges. In TraDijkstraExample, A→B costs 10, but A→C→B costs 1 + 2 = 3; continuing B→D gives 4. A negative weight violates this method’s contract.',
        ],
        [
          'Priority updates with TRA PriorityQueue',
          'Import fi.uef.cs.tra.PriorityQueue and construct it with capacity plus comparator. Offer a new immutable (Vertex, distance) entry after an improvement; skip an extracted entry whose saved distance is no longer current. Old B:10 and D:9 entries do not trigger another scan. This implementation takes O(V + E log(E + 1)) time and O(V + E) additional space. Changing a queued Vertex field does not repair the heap; no decrease-key is assumed.',
        ],
        [
          'Floyd–Warshall: derive the matrix from TRA',
          'Enumerate vertices(), assign external identity-based indices, and copy outgoing Edge weights into a matrix. Use zero on the diagonal and +∞ where no edge exists. For each intermediate k, test d[i][k] + d[k][j], with k outermost and all i/j included. In TraFloydWarshallExample, A→B→C costs 5 − 2 = 3, beating the direct weight 10. Time O(V³ + E), additional space O(V²).',
        ],
        [
          'Negative edges and cycles',
          'Floyd allows finite negative edges. A negative diagonal reveals a negative cycle; mathematically, only pairs that can pass through such a cycle lose a finite shortest distance. This example deliberately rejects the whole result if any negative cycle exists, even in a disconnected part. Adding C→A with weight −4 closes a cycle of weight −1. A negative undirected edge also permits an unbounded back-and-forth walk. No partial matrix or path is returned on rejection.',
        ],
        [
          'Infinity and actual paths',
          'Unreachable distance is Double.POSITIVE_INFINITY, printed as INF; its path is empty. Skip infinite subpaths before adding Floyd distances. Dijkstra stores parent links; Floyd stores a next-hop matrix. Use result.pathTo(target) or result.path(from, to). A vertex to itself returns [vertex] with zero edges. Foreign query vertices are rejected. Equal-cost paths may differ, so check their edges and total weight rather than one listing.',
        ],
        [
          'Weights, identity and arithmetic',
          'Read Edge.getWeight(), not Vertex.getWeight(). Write addEdge(v, 5.0f): an int second argument selects colour in TRA. The examples validate finite float weights and accumulate in double; NaN and either infinity are invalid inputs. Floating-point arithmetic is approximate: 0.1f is not an exact decimal tenth. The teaching weights are small and exactly representable. Neither algorithm changes colours, labels, Vertex.index or topology; duplicate labels remain separate objects.',
        ],
      ],
    },
    mst: {
      title: 'Minimum spanning trees: Prim and Kruskal',
      intro:
        'Use undirected TRA Graph and real Edge weights. A connected input gives a minimum spanning tree; a disconnected input gives a minimum spanning forest, one tree per component.',
      cards: [
        [
          'Prim',
          'Start at an unreached Vertex and add its boundary edges to TRA PriorityQueue. Repeatedly take the lightest edge crossing to an unreached endpoint. Skip a queued edge when both endpoints are already reached. When the queue empties, start again at another unreached vertex. Do not assume Edge.getEndPoint() is always the new vertex: Graph has no arrow direction.',
        ],
        [
          'Kruskal and union–find',
          'Copy Graph.edges(), which lists each physical undirected Edge once, and sort by weight. Accept an edge only when union–find joins two different sets; otherwise it would close a cycle. Path compression and union by rank affect only private arrays. IdentityHashMap maps actual Vertex objects to external set indices, preserving labels and Vertex.index.',
        ],
        [
          'Tree, forest and isolated vertices',
          'The result contains vertices(), edges(), components() and totalWeight(). With V vertices and C connected components, a spanning forest has V − C edges. An isolated vertex is a component with no selected edge. Empty input gives C = 0 and weight 0; one vertex gives C = 1 and a zero-edge tree. isSpanningTree() is true only for nonempty connected input.',
        ],
        [
          'Read the example',
          'A—B:1, B—C:2, A—C:5, C—D:1 give an MST of weight 4 with three edges. Add isolated E and F—G:-2: both algorithms return a forest with three components, four edges and total weight 2. Negative edges are valid because a spanning forest selects edges without cycles; it is not a problem of repeating walks to reduce a distance.',
        ],
        [
          'MST versus shortest-path tree',
          'For A—B:2, A—C:2, B—C:1, an MST weighs 3. A shortest-path tree from A uses A—B and A—C, with total weight 4, so both target distances are 2. The MST’s route from A to one target costs 3. The objectives differ: minimise all chosen-edge weights versus distances from one start.',
        ],
        [
          'Weights, ties and costs',
          'Finite negative and zero weights are allowed; NaN and either infinity are rejected, even in another component. Equal weights may give different minimum forests; Prim and Kruskal need not select the same edges or order. Float weights accumulate in double, with approximate arithmetic. Both implementations take O(V + E log(E + 1)) time and O(V + E) extra space, assuming expected O(1) identity-map/set access. Results contain actual Edge references in read-only lists; all graph fields stay intact, and weights remain fixed during a run.',
        ],
      ],
    },
    'graph-analysis': {
      title: 'Cycles, connectivity, cuts, matching and flow',
      intro:
        'Use real TRA vertices and edges to study cuts, maximum bipartite matching and flow. Algorithm-owned maps, partitions and residual entries leave the input graph unchanged.',
      cards: [
        [
          'Directed cycles and topological order',
          'Use white (unseen), gray (active), and black (finished). An edge to gray is a back edge and proves a directed cycle. Reverse POST order is topological only for a DAG; the runnable example rejects a cycle.',
        ],
        [
          'Edge classes and strong connectivity',
          'DFS distinguishes tree, back, forward and cross edges; PRE/POST times help distinguish descendants from other finished vertices. To test strong connectivity, reach all vertices from one start in both the graph and its reverse. Finding all strongly connected components requires an SCC algorithm, not just this boolean check.',
        ],
        [
          'Articulation points and bridges',
          'TraGraphCutsExample accepts Graph and runs DFS over every component. tin counts entries only. low[v] is the earliest entry reachable down its DFS subtree and then through at most one non-parent back edge. After a child returns, propagate low[child]; for a visited neighbour use tin[neighbour], not its low. A non-root v is a cut vertex if low[child] >= tin[v]; the tree edge is a bridge if low[child] > tin[v]. Weights are irrelevant. Expected O(V + E) time and O(V) extra space.',
        ],
        [
          'Root children and the physical parent edge',
          'Skip only the identical parent Edge when examining the other adjacency direction. The DFS root is a cut vertex only with at least two DFS children, not merely two neighbours. In triangle 0–1–2 with tail 1–3–4 and isolated 5, root 0 has two neighbours but one DFS child: cuts are 1/3 and bridges 1–3/3–4. Results return real Vertex/Edge objects. Empty and disconnected graphs are supported.',
        ],
        [
          'Bipartite graphs and matching',
          'Pass Graph and a duplicate-free list of member vertices for the left side; the right side is the remaining vertices, including isolated ones. Every edge must cross that supplied partition, otherwise the method rejects it. This method does not discover the partition automatically. Alternating paths can reassign partners: L0 moves from R0 to R1 so L1 can take R0. Fresh seen state is required for each left root. Maximum means largest cardinality; maximal only means no single edge can be added without changing existing pairs. Weights are ignored.',
        ],
        [
          'Maximum flow and residual edges',
          'TraMaxFlowExample accepts DiGraph and distinct member source/sink. BFS with TRA LinkedQueue finds an augmenting residual path; add its bottleneck to the total. Each original Edge flow stays between zero and its capacity, and intermediate vertices conserve flow. When the sink is unreachable in the residual network, the reached source side defines a minimum cut. The example returns both per-Edge flow and cut edges/capacity: value 5 equals cut capacity 5.',
        ],
        [
          'Cancellation is not an input reverse edge',
          'Each physical input Edge gets its own forward/cancellation pair in private residual lists. This keeps actual opposite input arcs independent. In the rerouting example BFS first uses s→a→x→t, then s→b→x→a→y→t; x→a cancels the earlier a→x allocation although x→a is absent from DiGraph. Final flow is 2 and a→x carries 0. No input edge, weight or colour is changed.',
        ],
        [
          'Capacities, queries and costs',
          'Flow reads stored float Edge weights as capacities: only finite integers in [0, 1 000 000 000] are accepted, including unreachable parts. Write addEdge(v, 3.0f); an int argument selects colour. Fractional, negative, non-finite or oversized capacities are rejected without rounding; validated capacities and flows use exact long arithmetic with overflow checks. Expected bounds: matching O(V + E + L·E) time/O(V) space, L = left-side size; flow O(V + E + V·E²) time/O(V + E) space. Identity-map/set access is assumed O(1). Querying foreign objects is an error; an unmatched matching member has null partner. Empty cuts/matching are valid, but flow needs two distinct vertices. Result lists are read-only references to input objects.',
        ],
      ],
    },
    strategies: {
      title: 'Algorithm strategies and amortised analysis',
      intro:
        'A design strategy suggests a way to build an algorithm. Correctness and complexity still need to be established for the specific problem.',
      cards: [
        [
          'Greedy',
          'Choose the best current candidate, but prove it is safe. With coins 1, 3 and 4 and target 6, greedy uses 4+1+1 while the optimum is 3+3. Dijkstra with non-negative weights and MST algorithms have the required greedy justification.',
        ],
        [
          'Divide-and-conquer',
          'Split a problem, solve subproblems and combine their results. Merge sort is the main example. Recomputing the same overlapping subproblem repeatedly can make naive recursion expensive.',
        ],
        [
          'Dynamic programming',
          'Store overlapping subproblem results: memoisation is top-down; filling a table in dependency order is bottom-up. The coin-change example finds a minimum in O(sum × number of coin types) time and O(sum) space; it reports impossible targets.',
        ],
        [
          'Amortised cost',
          'Analyse a whole sequence of operations. An individual ArrayList append can require O(n) work for resizing, while n appends take O(n) total work: amortised O(1) per append. This is not a statement about a random input distribution.',
        ],
        [
          'Branch-and-bound',
          'Track the best complete solution and prune only when a valid bound proves a branch cannot improve it. Pruning by current cost is unsafe if later negative edges can reduce the cost.',
        ],
        [
          'Randomised algorithms',
          'Las Vegas algorithms always produce a correct result but have variable running time; Monte Carlo algorithms may allow a bounded error probability. A heuristic can find useful solutions without guaranteeing optimality. Repeated trials need genuinely different choices.',
        ],
      ],
    },
    'string-matching': {
      title: 'Exact and approximate string matching',
      intro:
        'Let n be the text length and m the pattern length. The handout compares several ways of reusing information between comparisons.',
      cards: [
        [
          'Naive and Rabin–Karp',
          'Naive matching tries each offset and has O(nm) worst-case time. Rabin–Karp updates a rolling hash in O(1) per shift. A hash match must still be checked against the characters; collisions can make the worst case O(nm).',
        ],
        [
          'Automata and Boyer–Moore',
          'A finite automaton encodes the matched prefix and reads the text once after preprocessing. Boyer–Moore compares from the pattern’s end and uses mismatch/suffix information to skip offsets. Preprocessing and alphabet assumptions matter to the complexity claims.',
        ],
        [
          'Tries, suffix trees and suffix arrays',
          'A trie indexes a collection by prefixes. A suffix tree or suffix array indexes suffixes of the text for repeated substring queries. These are conceptual summaries here; the Java example implements naive search, Rabin–Karp and approximate matching.',
        ],
        [
          'Approximate substring search',
          'Dynamic programming allows insertions, deletions and substitutions. Set `D[0][j] = 0` to allow a match to start anywhere in the text and `D[i][0] = i`. The final row gives edit distances to substrings ending at each position. This differs from comparing two entire strings. The example returns exclusive UTF-16 end indices.',
        ],
      ],
    },
    'external-memory': {
      title: 'Files, external merging and B-trees',
      intro:
        'When data does not fit in RAM, count block transfers and separate accesses as well as CPU operations.',
      cards: [
        [
          'Blocks, buffering and locality',
          'Sequential reads and writes reduce separate accesses. Buffer records in blocks; random access can dominate CPU cost. Cache effects also matter in main memory. The device timings in the 2025 handout are illustrative, not universal performance guarantees.',
        ],
        [
          'External merge sort',
          'Create sorted runs that fit in RAM, then merge them in passes. The example streams one merge of two already sorted files; it is not a complete external sorter. A full implementation must also generate runs and manage successive merge passes.',
        ],
        [
          'Fixed-size records',
          'A random-access file uses byte offsets: `headerBytes + index × recordBytes`. Use long arithmetic, distinguish record indices from byte addresses, and close the file. The example creates and removes its own temporary file.',
        ],
        [
          'Files as collections',
          'Sequential files suit scans. Sorted files allow binary search but make insertions expensive. Hashing supports direct lookup but loses key order. Primary and secondary indexes offer different access paths; fixed-size addressing does not apply directly to variable-length text records.',
        ],
        [
          'B-tree and B+ tree',
          'A B-tree node holds multiple ordered keys and many children; all leaves have the same depth. Splitting a full node keeps height low and reduces block accesses. B+ trees store data in leaves and use internal nodes for navigation. This lesson explains the structure; it does not provide a disk-backed B-tree implementation.',
        ],
      ],
    },
  },
  examples: {
    binarySearch: [
      'Binary search',
      'A complete search including absent values and an empty array.',
      'Sorted int array; O(log n) time and O(1) extra space.',
    ],
    sortedUnion: [
      'Union with two iterators',
      'Handles empty lists, duplicate values and both remaining tails without sorting or using Set/Map.',
      'Sorted non-null integers; O(n + m) time, O(n + m) output space.',
    ],
    setOperations: [
      'HashSet operations',
      'Copy before modifying; the original A remains unchanged. TreeSet makes printed order deterministic.',
      'Expected O(n + m) for these operations on hash sets; output sorting costs O(k log k).',
    ],
    orderedCollections: [
      'TreeSet and TreeMap',
      'Range queries and key order; the length-only comparator intentionally collapses two different strings.',
      'Basic insertion and lookup O(log n); range enumeration also depends on result size.',
    ],
    mapFrequency: [
      'Count with HashMap',
      'Counts repeated words, supplies a default, replaces a value and iterates over entries.',
      'Expected O(n) counting with well-distributed hashes; sorted output adds O(k log k).',
    ],
    equality: [
      'Object identity in Set and Map',
      'Two Student objects with the same immutable id are equal, regardless of name.',
      'equals/hashCode use the same identity fields; hashes may collide.',
    ],
    listDeque: [
      'Iterator, stack and queue',
      'Remove even elements safely, then compare LIFO and FIFO, including an empty poll.',
      'Traversal O(n); ArrayDeque endpoint operations amortised O(1).',
    ],
    treeTraversal: [
      'Three tree traversal orders',
      'A single recursive traversal records PRE, IN and POST at the three processing positions.',
      'O(n) time, O(h) recursion space plus the result lists.',
    ],
    priorityQueue: [
      'PriorityQueue with Comparator',
      'Order tasks by priority and id, then remove them with poll instead of relying on iterator order.',
      'peek O(1); offer/poll O(log n).',
    ],
    mergeSort: [
      'Complete merge sort',
      'Recursive splitting and stable merging with a reusable buffer.',
      'O(n log n) time, O(n) buffer and O(log n) recursive stack.',
    ],
    graphRepresentation: [
      'A graph built from Map and Set',
      'A generic directed graph, isolated vertices, external vertex data and vertex removal.',
      'Expected O(1) edge insertion; vertex removal scans all remaining vertex sets.',
    ],
    dfs: [
      'DFS over all components',
      'PRE and POST for a graph with an isolated vertex; the outer loop starts a DFS forest.',
      'Adjacency lists: O(V + E) time and O(V) working space.',
    ],
    bfs: [
      'BFS with path reconstruction',
      'Stores distances and parents; returns an empty path for an unreachable target.',
      'Unweighted graph; O(V + E) time and O(V) working space.',
    ],
    components: [
      'Undirected connected components',
      'Finds two connected pairs and one isolated vertex.',
      'Symmetric adjacency lists; O(V + E) time and O(V) working space.',
    ],
    topological: [
      'Cycle detection and topological sorting',
      'Three DFS colors reject a cycle; reverse POST gives an order for a DAG.',
      'O(V + E) time and O(V) working space.',
    ],
    javaTools: [
      'Comparable, Comparator and a generic method',
      'Natural name order, alternative credit order, and a type-safe maximum function.',
      'Sorting O(n log n); maximum O(n).',
    ],
    dijkstra: [
      'Dijkstra with stale-entry checks',
      'Uses immutable queue entries so improved distances do not corrupt the heap.',
      'Non-negative int weights; O(V + E log(E + 1)) time and O(V + E) working space.',
    ],
    floyd: [
      'Floyd–Warshall',
      'All-pairs distances, a negative edge, guarded infinity arithmetic and negative-cycle detection.',
      'O(V³) time, O(V²) space; finite input magnitudes < INF / max(1, V).',
    ],
    mst: [
      'Prim and Kruskal',
      'Both methods return the same MST weight; Kruskal uses union–find. Disconnected input is rejected.',
      'Undirected graph; O(V + E log(E + 1)) time, O(V + E) space.',
    ],
    cuts: [
      'Articulation points and bridges',
      'DFS discovery/low values distinguish a cycle from fragile connections.',
      'Simple undirected graph with symmetric lists; O(V + E) traversal, plus sorted demo output.',
    ],
    matching: [
      'Maximum bipartite matching',
      'An augmenting path reassigns the first match to make room for another left-side vertex.',
      'Known bipartition; O(L × (R + E)) time, O(L + R) working space.',
    ],
    flow: [
      'Maximum flow with BFS',
      'Updates forward and reverse residual capacities; returns the total flow.',
      'Non-negative integer capacities, source ≠ sink; O(V² + VE²) time, O(V²) space.',
    ],
    coinChange: [
      'Minimum coin count with DP',
      'Finds 3+3 for target 6, rejects an impossible target and handles sum zero.',
      'Positive coin values; O(S × C) time and O(S) space for target S and C coin types.',
    ],
    strings: [
      'Three string matching methods',
      'Naive search, verified rolling hashes, and edit-distance substring endpoints.',
      'Naive/Rabin–Karp: O(nm) worst case; approximate matching: O(nm) time and space.',
    ],
    records: [
      'RandomAccessFile records',
      'Writes a count header and three int records, then reads record 1 at its byte offset.',
      'Fixed 4-byte records; one seek and read for direct lookup.',
    ],
    externalMerge: [
      'Merge two sorted files',
      'Streams two sorted runs using readers and a writer. Temporary files are cleaned up.',
      'O(n + m) sequential operations and bounded buffers; run generation is not included.',
    ],
  },
}
