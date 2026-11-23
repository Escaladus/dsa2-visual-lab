export const traJavaExampleTranslations = {
  en: {
    title: 'Java: one idea at a time',
    intro:
      'Short independent examples with the TRA library, for JDK 11+. Start with the main code; expand the complete file when you want to run it.',
    download: 'Download examples by topic + traj.jar (.zip)',
    setup:
      'Extract the ZIP and run commands from tra-graphs. For an individual download, put the Java file next to traj.jar. In an IDE, add traj.jar as a library.',
    input: 'Small input',
    code: 'Main code',
    explanation: 'Why it works',
    complete: 'Complete file and launch command',
    advanced: 'Next steps — after the basic examples',
    order:
      'Outputs use the supplied JAR’s neighbour order. Another order may change DFS order or the chosen path, but not BFS shortest distances. R is the reachable vertex count; A_R is the examined neighbour-entry count. Map costs assume expected O(1) identity lookup.',
    groups: {
      basics: 'Create and read a graph',
      dfs: 'Depth-first search (DFS)',
      bfs: 'Breadth-first search (BFS)',
      applications: 'Use graph traversal',
      trees: 'Trees: one operation at a time',
      queue: 'PriorityQueue: one operation at a time',
      weighted: 'Weighted shortest paths',
      mst: 'Minimum spanning trees',
      analysis: 'Analyse a graph',
      flow: 'Flow: from one edge to the full algorithm',
    },
    examples: {
      createGraph: [
        'Create an undirected graph',
        'Create two vertices and connect them with one edge.',
        'Two vertices and one edge: O(1) time and space.',
        'Add the edge once. Graph makes each endpoint a neighbour of the other.',
      ],
      createDirected: [
        'Create a directed graph',
        'Add A → B and check its direction.',
        'This fixed example: O(1) time and space.',
        'DiGraph stores the arrow A → B. It does not add B → A.',
      ],
      vertices: [
        'Visit every vertex',
        'Print vertices, including an isolated vertex.',
        'Θ(V) time; O(1) extra space.',
        'vertices() lists the graph vertices. A vertex does not need an edge to appear.',
      ],
      neighbors: [
        'Visit one vertex’s neighbours',
        'Print only A’s outgoing neighbours.',
        'Θ(outdegree(A)) time; O(1) extra space.',
        'This loop is not a full traversal: it examines one adjacency list. An incoming arrow does not make D an outgoing neighbour of A.',
      ],
      edgeWeight: [
        'Read an edge weight',
        'Create a weighted edge and read its endpoints and weight.',
        'Reading the saved Edge: O(1) time and space.',
        'Save the Edge returned by addEdge. Write 5.0f: the overload with an int second argument sets colour, not weight.',
      ],
      vertexMap: [
        'Attach data to a vertex',
        'Keep separate values for two vertices with the same label.',
        'Expected O(1) per map operation; O(V) for V entries.',
        'The Map keys are Vertex objects, not labels. IdentityHashMap keeps the two X vertices separate and leaves the graph unchanged.',
      ],
      simpleDfs: [
        'Recursive DFS: visit a vertex',
        'Visit the reachable part from A. The visited map starts with false for every vertex.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'Mark before recursion. A → B → D finishes first; execution then returns to A’s loop and continues with C. The visited map prevents cycling and leaves TRA colours untouched.',
      ],
      prePost: [
        'DFS: entry and return (PRE / POST)',
        'Print entry before children and completion after children. All visited values initially false.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'PRE A → PRE B → PRE D → POST D → POST B → PRE C → POST C → POST A. POST B happens after its child D; returning to A resumes the next neighbour, not the beginning of dfs(A).',
      ],
      colourDfs: [
        'DFS with WHITE, GREY and BLACK',
        'Show when a vertex becomes active and when it finishes. Initially all vertices are WHITE.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'WHITE: undiscovered. GREY: this call is active. BLACK: all neighbours processed. In A → B → D, all three calls are GREY until D finishes. This lesson changes Vertex colours.',
      ],
      dfsTimes: [
        'DFS: entry and exit times',
        'Use one clock for entry and exit events. All vertices start WHITE.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'A’s interval contains B’s and D’s intervals. Times count events, not positions in PRE/POST lists. Clock and maps are reset for every run.',
      ],
      edgeTypes: [
        'Directed DFS: classify one edge',
        'Classify outgoing edges using colour and entry time. Initially all vertices are WHITE.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'WHITE gives a tree edge; GREY gives a back edge. A BLACK target entered after the active vertex is its descendant (forward), otherwise cross. These four rules apply to directed DFS; a return from a method is not a graph edge.',
      ],
      simpleBfs: [
        'BFS: visit using a queue',
        'Visit the reachable part from A. Initially all vertices are WHITE.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'Queue: [A] → [B,C] → [C,D] → [D] → []. Mark GREY before offer so another edge cannot enqueue the same vertex again. After remove it stays GREY until its neighbours finish; then BLACK.',
      ],
      bfsDistance: [
        'BFS: distance in number of edges',
        'Find unweighted distances from A; E is unreachable.',
        'Expected Θ(R + A_R) time, O(R) space for reachable vertices; printing all vertices adds Θ(V).',
        'First discovery fixes a shortest distance: next = current + 1. Presence in the map also marks discovery. Unreachable vertices have no entry; getOrDefault displays -1. This does not minimise arbitrary edge weights.',
      ],
      bfsPath: [
        'BFS: reconstruct a path',
        'Follow the parent chain from D back to A, then reverse it.',
        'BFS expected Θ(R + A_R), O(R) space; path reconstruction O(path length) time and space.',
        'The full file builds parents with BFS. parent[A] = null ends the chain. D → B → A becomes [A,B,D]. An unreachable vertex returns an empty list. Parent keys are Vertex objects; labels are only for display.',
      ],
      fullDfs: [
        'DFS: continue in another component',
        'Start a new DFS for each remaining WHITE vertex.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'The outer loop reaches isolated C and the D–E component. In an undirected Graph, each new root starts a connected component. Directed DFS roots do not identify strongly connected components. The full file contains the simple dfs method.',
      ],
      undirectedCycle: [
        'Cycle in an undirected graph',
        'Detect a cycle while ignoring the physical edge used to enter the vertex. All colours start WHITE.',
        'O(V + E) time; O(V) recursion space.',
        'A–B alone is not a cycle: B sees the same parent Edge. The triangle is a cycle. The outer loop checks every component and stops when it finds one. Colours are changed.',
      ],
      directedCycle: [
        'Cycle in a directed graph',
        'Detect an edge to an active GREY ancestor. All vertices start WHITE.',
        'O(V + E) time; O(V) recursion space.',
        'C → A reaches GREY A and proves a cycle. Reaching BLACK would not prove a cycle. Do not skip the parent arrow in a directed graph. The outer loop also checks disconnected parts.',
      ],
      topologicalOrder: [
        'DAG: reverse the POST order',
        'Process every vertex, reject cycles and reverse the completion list.',
        'Full traversal Θ(V + E), O(V) extra space. Initialising visited also costs Θ(V).',
        'Append only after descendants finish. Reversing POST puts each source before its targets. A GREY target causes failure: cyclic graphs have no topological order. The full file includes the outer loop and reversal.',
      ],
      createTree: [
        'Create a binary tree',
        'Create root A with left child B and right child C.',
        'This three-node example: O(1) time and space.',
        'BTreeNode stores a node; BTree stores the root. Left and right are separate child positions.',
      ],
      treeChildren: [
        'Read a node’s children',
        'Read the two children of the root and detect a missing child.',
        'O(1) time and extra space.',
        'A missing child is null. Check it before calling getElement. B is a leaf because both child references are null.',
      ],
      treePre: [
        'PRE: node, left, right',
        'Print each node before its children.',
        'Θ(n) time, O(h + 1) stack space for a nonempty tree; h is height in edges.',
        'Processing before recursion gives A, B, C. A null child is the base case.',
      ],
      treeIn: [
        'IN: left, node, right',
        'Print each node between its two subtrees.',
        'Θ(n) time, O(h + 1) stack space for a nonempty tree; h is height in edges.',
        'Processing between recursive calls gives B, A, C. This is binary-tree IN, not graph POST.',
      ],
      treePost: [
        'POST: left, right, node',
        'Print each node after both subtrees finish.',
        'Θ(n) time, O(h + 1) stack space for a nonempty tree; h is height in edges.',
        'Processing after recursion gives B, C, A. The parent waits for both child calls to return.',
      ],
      treeSize: [
        'Count tree nodes',
        'Return one plus the sizes of the left and right subtrees.',
        'Θ(n) time; O(h + 1) stack space for a nonempty tree.',
        'For A, both children return 1, so the result is 1 + 1 + 1 = 3. An empty subtree returns 0.',
      ],
      treeHeight: [
        'Compute height in edges',
        'Take the longer child height and add one.',
        'Θ(n) time; O(h + 1) stack space for a nonempty tree.',
        'An empty tree has height -1; a leaf has 0. A has height 1 and two levels. Height is not the number of nodes.',
      ],
      generalTree: [
        'General tree: children and siblings',
        'List the three children of R using first child and next sibling.',
        'Θ(k) time for k children; O(1) extra space.',
        'Tree is not BTree: getLeftChild finds the first child; getRightSibling finds another child of the same parent. X, Y and Z are all children of R.',
      ],
      queueOffer: [
        'PriorityQueue: add values',
        'Insert three values and inspect the size and minimum.',
        'offer: O(log n); peek and size: O(1). Queue storage O(n). offer is amortised because an occasional array growth copies stored values.',
        'offer inserts a value. The smallest value has the highest priority in this integer queue; insertion order does not decide it.',
      ],
      queuePeek: [
        'PriorityQueue: look without removing',
        'Call peek twice and check that the queue size stays the same.',
        'O(1) time and extra space per peek.',
        'peek returns 2 each time. It reads the minimum without removing it: another peek has the same answer. An empty queue returns null.',
      ],
      queuePoll: [
        'PriorityQueue: remove the minimum',
        'Remove one value and inspect the new minimum.',
        'poll: O(log n); peek and size: O(1).',
        'poll returns and removes 2. The next minimum is 5 and size decreases by one. An empty queue returns null.',
      ],
      queueDuplicates: [
        'PriorityQueue: equal values are allowed',
        'Insert 3 twice and remove both copies.',
        'Each offer/poll: O(log n); draining n values: O(n log n). offer is amortised because an occasional array growth copies stored values.',
        'PriorityQueue is not a Set. Both copies are stored and each poll removes only one. Poll repeatedly for priority order; iteration need not be sorted.',
      ],
      queueComparator: [
        'PriorityQueue: choose another order',
        'Use a comparator to remove larger numbers first.',
        'Each offer/poll: O(log n); O(n) queue storage. offer is amortised because an occasional array growth copies stored values.',
        'TRA takes capacity and comparator together. reverseOrder changes which value is considered first. Use a separate comparator example before modelling tasks with priorities.',
      ],
      simpleDijkstra: [
        'Dijkstra: distances with nonnegative weights',
        'Choose the nearest unfinished vertex and relax its outgoing edges. Start belongs to graph; weights are finite and nonnegative.',
        'Expected O(V² + E) time, O(V) extra space for this scanning implementation.',
        'A → C → B costs 3, less than the direct edge of weight 5. The first version scans vertices to choose best: no priority queue is needed. D stays Infinity. Map keys are actual Vertex objects; the graph is unchanged.',
      ],
      dijkstraPath: [
        'Dijkstra: remember the improved path',
        'Update a parent only when its distance improves. Reuse the previous lesson’s scanning Dijkstra.',
        'Expected O(V² + E) time and O(V) space; reading a path O(path length).',
        'B first has parent A at cost 5; relaxing C → B changes it to C at cost 3. The full file includes all of Dijkstra and the parent-chain reader. Missing parent entry means unreachable, not a one-vertex path.',
      ],
      graphMatrix: [
        'TRA graph → distance matrix',
        'Assign indices to actual vertices and copy outgoing edge weights. The list contains every vertex once.',
        'Expected Θ(V² + E) time, O(V²) matrix space.',
        'Rows and columns follow [A,B,C]. The diagonal starts at 0 and missing edges at Infinity. This is preparation for Floyd, not all-pairs shortest paths yet. min preserves a negative self-loop for cycle detection.',
      ],
      simpleFloyd: [
        'Floyd: try one intermediate vertex',
        'Start with the previous lesson’s edge matrix and improve all pairs through via.',
        'Θ(V³ + E) time including matrix creation; O(V²) space.',
        'Through B, A → C improves from 9 to 5 + (-2) = 3. via is the outer loop: after it, permitted intermediate vertices include via. Negative weights are allowed; a negative diagonal rejects the result. The full file builds the TRA matrix too.',
      ],
      prim: [
        'Prim: grow one tree',
        'Take the cheapest edge crossing from the tree to an unvisited vertex. Weights are finite and fixed.',
        'O(V + E log(E + 1)) time; O(V + E) extra space including result.',
        'Choose A–B (1), then B–C (2): total 3. addBoundary marks one new vertex and queues crossing edges. The outer root loop also gives a forest on disconnected input; it changes colours but preserves topology and weights.',
      ],
      disjointSets: [
        'Disjoint sets: are endpoints already connected?',
        'Use a parent forest to test whether a proposed edge joins two sets.',
        'Expected O(V) worst-case time per find/union; O(V) parent space.',
        'Initially each Vertex is its own root. After joining A–B and B–C, A and C have the same root, so union(A,C) is false. This first DSU has no rank or path compression; it is intentionally explicit.',
      ],
      kruskal: [
        'Kruskal: accept edges without creating cycles',
        'Sort actual Edge objects by weight, then join their endpoint sets. Weights are finite.',
        'Expected O(V + E log(E + 1) + E·V) time with this simple DSU; O(V + E) space.',
        'Use the previous lesson’s simple DSU. A–B and B–C are accepted; A–C would close a cycle. Graph.edges() gives each undirected physical edge once. Disconnected graphs produce a forest. Input fields stay unchanged.',
      ],
      lowValues: [
        'DFS: what tin and low mean',
        'Compute entry numbers and the earliest entry reachable below a vertex using at most one non-parent back edge.',
        'Expected Θ(V + E) time and O(V) extra space, including recursion.',
        'Here tin counts entries only. Returning from a child uses low[child]; an already visited neighbour uses tin[neighbour]. Skip the identical physical parent Edge. The triangle reaches A again; D cannot bypass C.',
      ],
      bridges: [
        'Bridge: can the child subtree get back?',
        'After a child returns, test low[child] > tin[parent].',
        'Expected Θ(V + E) time and O(V) extra space, including recursion.',
        'C–D is a bridge; removing it separates D. Triangle edges have an alternative route. The strict > matters: reaching the parent itself is already an alternative. The full file contains the low DFS and checks all components.',
      ],
      articulation: [
        'Articulation point: what if the vertex disappears?',
        'Use the non-root low criterion and a separate root-child rule.',
        'Expected Θ(V + E) time and O(V) extra space, including recursion.',
        'C is an articulation point: removing it separates D. Non-root: some child has low[child] ≥ tin[v]. Root: at least two DFS children, not two graph neighbours. A has two neighbours but only one DFS child here.',
      ],
      matchingStep: [
        'Matching: move an existing pair',
        'Start with L0–R0 and find a place for L1. Edges must cross the declared left/right sides.',
        'One search: expected O(V + E) time, O(V) space.',
        'L1 needs occupied R0. Recursion moves L0 to R1, freeing R0 for L1. owner maps right vertices to left vertices. A fresh seen set prevents revisiting right vertices during this search. This is one augmentation, not the whole algorithm.',
      ],
      matching: [
        'Matching: repeat with each left vertex',
        'Find a maximum-cardinality matching in a known bipartite Graph. The supplied left list is a complete valid partition side.',
        'Expected O(V + E + L·E) time; O(V) space; L = left-side size.',
        'Start with no pairs. For every left vertex create a new seen set and try the previous lesson’s augmentation. Fresh search state allows rearranging older pairs; a greedy free-neighbour-only approach would miss the answer 2.',
      ],
      residualCapacity: [
        'Flow: remaining capacity',
        'Read a TRA edge capacity and subtract the flow already sent.',
        'O(1) time and space for this edge.',
        'Capacity 5 minus flow 3 leaves 2 forward. The 3 units already sent can be cancelled through a reverse residual transition. It is bookkeeping, not a new input edge. This is one edge, not maximum flow.',
      ],
      augmentFlow: [
        'Flow: augment one known path',
        'Send the bottleneck amount along s → A → t. This example starts with zero flow.',
        'For a known path of length k: O(k) time; residual matrix O(V²) storage.',
        'The path capacities are 3 and 2, so send min(3,2) = 2. Subtract 2 forward and add 2 backward for cancellation. These updates do not find paths or complete a maximum-flow algorithm. Matrix indices are [s,A,t].',
      ],
      cancelFlow: [
        'Flow: cancel an earlier decision',
        'Cancel one unit on A → X using the residual transition X → A.',
        'O(1) for this single cancellation.',
        'There is no X → A edge in the input. Its residual capacity is the amount previously sent on A → X. Cancelling frees the original forward capacity and allows a later path to reroute flow. This is a cancellation demonstration, not a complete network run.',
      ],
      maximumFlow: [
        'Maximum flow: repeat augmenting paths',
        'Combine residual BFS, bottleneck search and updates until no s–t path remains.',
        'Matrix BFS Edmonds–Karp: O(V² + E + V³·E) time, O(V²) space. BFS scans V² matrix entries per search.',
        'First study the three preceding flow examples. The full file maps actual TRA vertices to a residual matrix and uses TRA LinkedQueue. Stored capacities must be finite integers in [0,10⁹]. Matrix entries aggregate opposite capacity and cancellation, so they are not per-input-edge flow values. Only the auxiliary residual matrix changes; the graph stays intact. Source/sink are distinct valid indices.',
      ],
      minimumCut: [
        'Minimum cut: reachable residual side',
        'After maximum flow, find the residual vertices reachable from s and sum original capacities leaving that side.',
        'Matrix BFS Edmonds–Karp: O(V² + E + V³·E) time, O(V²) space. BFS scans V² matrix entries per search.',
        'The source side is {s}; the cut capacity is 3 + 2 = 5, equal to maximum flow. The cut is computed from original capacities, not residual values. The full file includes the complete previous algorithm. This is a cut of the chosen network; a different network may have several valid minimum cuts.',
      ],
      floydPath: [
        'Floyd: reconstruct a path',
        'After each improvement, remember the first hop. Then follow next hops to the target.',
        'Θ(V³ + E) time and O(V²) space for Floyd; O(path length) for reading a path.',
        'On improvement via, set next[from][to] = next[from][via]. The reader below follows that table. A missing entry means unreachable. The full file builds both tables and rejects negative cycles before any path is read.',
      ],
      taskPriority: [
        'Tasks: priority and a tie-breaker',
        'Order Task objects by numeric priority and then name. Smaller priority goes first.',
        'offer: amortised O(log n); poll: O(log n); queue storage O(n).',
        'Each Task has a name and a priority; its small class is in the complete file. A and B share priority 1, so the second comparison puts A first. The comparator defines the order; insertion order does not decide ties here.',
      ],
      dfsCycle: [
        'DFS: why a cycle stops',
        'Follow A → B → C → A with all visited values initially false.',
        'Θ(V + E) for a full traversal, O(V) map and recursion space.',
        'A is marked before calling B. When C sees A again, visited[A] is already true, so no fourth call is created. C returns, then B, then A.',
      ],
      bfsDiscovery: [
        'BFS: why D enters the queue once',
        'Use the directed diamond; initialise all vertex colours to WHITE.',
        'Θ(V + E) for a full traversal, O(V) queue space.',
        'B discovers D first and marks it GREY before adding it. When C sees D, D is already discovered even though it has not yet been removed. C skips it. D is processed once.',
      ],
    },
    contracts: {
      simpleDfs:
        'Input: non-null vertex; visited contains every graph vertex, initially false. Prints visits and updates only visited.',
      prePost:
        'Input: non-null vertex; visited contains every graph vertex, initially false. Prints visits and updates only visited.',
      dfsCycle:
        'Input: non-null vertex; visited contains every graph vertex, initially false. Prints visits and updates only visited.',
      colourDfs:
        'Input: non-null start, all colours WHITE. Prints traversal and changes reached vertex colours; structure stays intact.',
      simpleBfs:
        'Input: non-null start, all colours WHITE. Prints traversal and changes reached vertex colours; structure stays intact.',
      bfsDiscovery:
        'Input: non-null start, all colours WHITE. Prints traversal and changes reached vertex colours; structure stays intact.',
      dfsTimes:
        'Before traversal reset the clock, clear time maps and set colours WHITE. Updates times/colours and prints results.',
      edgeTypes:
        'Before traversal reset the clock, clear time maps and set colours WHITE. Updates times/colours and prints results.',
      bfsDistance:
        'Input: non-null start. Returns a new distance map: start = 0; unreachable vertices absent. Graph stays unchanged.',
      bfsPath:
        'The parent map comes from the preceding traversal. Returns path labels or an empty list when unreachable; reading a path does not change the map.',
      dijkstraPath:
        'The parent map comes from the preceding traversal. Returns path labels or an empty list when unreachable; reading a path does not change the map.',
      fullDfs:
        'Initialise colours once before the outer loop. Counts undirected components and changes colours; graph edges stay intact.',
      undirectedCycle:
        'Input: WHITE colours before the outer root loop. Returns whether a cycle exists; colours may be partially updated on early exit.',
      directedCycle:
        'Input: WHITE colours before the outer root loop. Returns whether a cycle exists; colours may be partially updated on early exit.',
      topologicalOrder:
        'Use a DiGraph with WHITE colours and an empty POST list. Reversing completed POST gives an order; a cycle rejects it. Changes colours and the list.',
      treePre:
        'Input: a binary subtree root or null. Prints the selected traversal order; the tree is unchanged.',
      treeIn:
        'Input: a binary subtree root or null. Prints the selected traversal order; the tree is unchanged.',
      treePost:
        'Input: a binary subtree root or null. Prints the selected traversal order; the tree is unchanged.',
      treeSize:
        'Input: a binary subtree root or null. Returns the node count, 0 for empty; tree unchanged.',
      treeHeight:
        'Input: a binary subtree root or null. Returns height in edges: empty = -1, leaf = 0; tree unchanged.',
      simpleDijkstra:
        'Start belongs to the DiGraph. Finite nonnegative weights only. Returns distances including Infinity for unreachable vertices; graph unchanged.',
      graphMatrix:
        'List every actual DiGraph vertex exactly once. Returns a new edge matrix; missing edges are Infinity. Graph unchanged.',
      simpleFloyd:
        'Input: a square edge-distance matrix. Updates it in place; negative cycles reject the result. TRA graph stays unchanged.',
      floydPath:
        'Read next only after successful Floyd. Valid vertex indices are required; unreachable returns an empty list. Path reading changes no tables.',
      prim: 'Input: undirected Graph, finite fixed weights. Returns actual forest edges; changes colours, preserves edges and weights.',
      disjointSets:
        'Each vertex initially points to itself in parent. find reads the representative; union joins sets and reports success, updating parent.',
      kruskal:
        'Input: undirected Graph with finite weights. Returns actual forest edges; input graph unchanged. Uses the preceding simple DSU.',
      lowValues:
        'Use an undirected Graph. Reset clock and clear all result maps/sets before the outer root loop. Changes only auxiliary data.',
      bridges:
        'Use an undirected Graph. Reset clock and clear all result maps/sets before the outer root loop. Changes only auxiliary data.',
      articulation:
        'Use an undirected Graph. Reset clock and clear all result maps/sets before the outer root loop. Changes only auxiliary data.',
      matchingStep:
        'Assume a valid known bipartition. owner maps right vertices to left; seen starts empty for each attempt. Success adds one pair, possibly rearranging older pairs.',
      matching:
        'Assume a valid known bipartition. owner maps right vertices to left; seen starts empty for each attempt. Success adds one pair, possibly rearranging older pairs.',
      maximumFlow:
        'Valid distinct source/sink indices; stored integer capacities in [0,10⁹]. Returns total flow or cut after updating only the residual matrix; graph unchanged.',
      minimumCut:
        'Valid distinct source/sink indices; stored integer capacities in [0,10⁹]. Returns total flow or cut after updating only the residual matrix; graph unchanged.',
    },
    traces: {
      dfsCycle: [
        'Visit A: mark A before descending; the active calls become A → B → C.',
        'C examines C → A. A is already visited, so skip this neighbour.',
        'No new call is made. C finishes, then B, then A; every vertex contributed once.',
      ],
      bfsDiscovery: [
        'After taking A, queue = [B, C]. Both are discovered.',
        'Take B: discover D and mark it before enqueueing. Queue = [C, D].',
        'Take C: D is already GREY, so skip it. Queue remains [D].',
        'Take D: finish its neighbours, mark BLACK. Queue = [].',
      ],
      fullDfs: [
        'The first root A visits A and B.',
        'C is still WHITE, so the outer loop starts a new component there.',
        'D is another WHITE root and visits E. Total: 3 components.',
      ],
    },
    traceTitle: 'Follow the state changes',
    setupTitle: 'Download and run',
  },
  ru: {
    title: 'Java: одна идея за раз',
    intro:
      'Короткие независимые примеры на TRA для JDK 11+. Сначала прочитайте основной код; полный файл раскройте, когда захотите запустить пример.',
    download: 'Скачать примеры по темам + traj.jar (.zip)',
    setup:
      'Распакуйте ZIP и выполняйте команды из tra-graphs. При скачивании отдельного файла положите его рядом с traj.jar. В IDE подключите traj.jar как библиотеку.',
    input: 'Маленький вход',
    code: 'Основной код',
    explanation: 'Почему это работает',
    complete: 'Полный файл и команда запуска',
    advanced: 'Следующие шаги — после базовых примеров',
    order:
      'Вывод использует порядок соседей приложенного JAR. Другой порядок может изменить порядок DFS или выбранный путь, но не кратчайшие расстояния BFS. R — число достижимых вершин, A_R — число просмотренных записей соседей. Оценки Map предполагают ожидаемый O(1) поиска по идентичности.',
    groups: {
      basics: 'Создание и чтение графа',
      dfs: 'Обход в глубину (DFS)',
      bfs: 'Обход в ширину (BFS)',
      applications: 'Применения обходов',
      trees: 'Деревья: одна операция за раз',
      queue: 'PriorityQueue: одна операция за раз',
      weighted: 'Кратчайшие пути с весами',
      mst: 'Минимальные остовные деревья',
      analysis: 'Анализ графа',
      flow: 'Поток: от одного ребра до полного алгоритма',
    },
    examples: {
      createGraph: [
        'Создать неориентированный граф',
        'Создайте две вершины и соедините одним ребром.',
        'Две вершины и одно ребро: O(1) времени и памяти.',
        'Ребро добавляется один раз. Graph делает каждую вершину соседом другой.',
      ],
      createDirected: [
        'Создать ориентированный граф',
        'Добавьте A → B и проверьте направление.',
        'Этот фиксированный пример: O(1) времени и памяти.',
        'DiGraph хранит стрелку A → B. Обратная стрелка B → A не добавляется.',
      ],
      vertices: [
        'Перебрать все вершины',
        'Выведите вершины, включая изолированную.',
        'Θ(V) времени; O(1) дополнительной памяти.',
        'vertices() перечисляет вершины графа. Отсутствие рёбер не исключает вершину из списка.',
      ],
      neighbors: [
        'Перебрать соседей одной вершины',
        'Выведите только исходящих соседей A.',
        'Θ(outdegree(A)) времени; O(1) дополнительной памяти.',
        'Это ещё не обход графа: цикл читает один список смежности. Входящая стрелка не делает D исходящим соседом A.',
      ],
      edgeWeight: [
        'Прочитать вес ребра',
        'Создайте взвешенное ребро и прочитайте концы и вес.',
        'Чтение сохранённого Edge: O(1) времени и памяти.',
        'Сохраните Edge, возвращённый addEdge. Пишите 5.0f: перегрузка со вторым аргументом int задаёт цвет, а не вес.',
      ],
      vertexMap: [
        'Хранить данные о вершине',
        'Сохраните разные значения для двух вершин с одинаковой меткой.',
        'Ожидаемое O(1) на операцию Map; O(V) памяти для V записей.',
        'Ключи Map — объекты Vertex, а не метки. IdentityHashMap различает две вершины X и не меняет граф.',
      ],
      simpleDfs: [
        'Рекурсивный DFS: посетить вершину',
        'Обойдите достижимую часть от A. В visited сначала false для каждой вершины.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'Помечаем до рекурсии. Сначала завершается A → B → D; затем выполнение возвращается в цикл A и продолжается с C. visited защищает от циклов и не меняет цвета TRA.',
      ],
      prePost: [
        'DFS: вход и возврат (PRE / POST)',
        'Выведите вход до потомков и завершение после них. Все visited изначально false.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'PRE A → PRE B → PRE D → POST D → POST B → PRE C → POST C → POST A. POST B происходит после D; возврат в A продолжает следующего соседа, а не запускает dfs(A) сначала.',
      ],
      colourDfs: [
        'DFS с WHITE, GREY и BLACK',
        'Покажите начало обработки и её завершение. Вначале все вершины WHITE.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'WHITE: ещё не обнаружена. GREY: вызов активен. BLACK: все соседи обработаны. При A → B → D все три вызова GREY до завершения D. Этот урок меняет цвета Vertex.',
      ],
      dfsTimes: [
        'DFS: времена входа и выхода',
        'Используйте один счётчик событий входа и выхода. Вначале все вершины WHITE.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'Интервал A содержит интервалы B и D. Времена считают события, а не позиции в PRE/POST. Счётчик и карты сбрасываются перед каждым запуском.',
      ],
      edgeTypes: [
        'Ориентированный DFS: определить тип ребра',
        'Определяйте тип исходящего ребра по цвету и времени входа. Вначале все вершины WHITE.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'WHITE даёт tree, GREY — back. BLACK-вершина, в которую вошли позже активной вершины, — её потомок (forward), иначе cross. Эти четыре правила относятся к ориентированному DFS; возврат метода не является ребром графа.',
      ],
      simpleBfs: [
        'BFS: обход с очередью',
        'Обойдите достижимую часть от A. Вначале все вершины WHITE.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'Очередь: [A] → [B,C] → [C,D] → [D] → []. Помечайте GREY до offer, чтобы другое ребро не добавило вершину повторно. После remove она остаётся GREY до завершения просмотра соседей, затем BLACK.',
      ],
      bfsDistance: [
        'BFS: расстояние по числу рёбер',
        'Найдите расстояния от A в невзвешенном графе; E недостижима.',
        'Ожидаемое Θ(R + A_R) времени, O(R) памяти для достижимых вершин; вывод всех вершин добавляет Θ(V).',
        'При первом обнаружении расстояние кратчайшее: сосед = текущая + 1. Наличие в карте одновременно отмечает обнаружение. У недостижимой вершины нет записи; getOrDefault выводит -1. Произвольные веса рёбер этот метод не минимизирует.',
      ],
      bfsPath: [
        'BFS: восстановить путь',
        'Пройдите по родителям от D к A, затем разверните список.',
        'BFS: ожидаемое Θ(R + A_R), O(R) памяти; восстановление пути — O(длины пути) времени и памяти.',
        'Полный файл строит родителей с BFS. parent[A] = null завершает цепочку. D → B → A становится [A,B,D]. Для недостижимой вершины возвращается пустой список. Ключи — Vertex, метки нужны только для вывода.',
      ],
      fullDfs: [
        'DFS: продолжить в другой компоненте',
        'Запускайте новый DFS для каждой оставшейся WHITE-вершины.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'Внешний цикл достигает изолированной C и компоненты D–E. В неориентированном Graph каждый новый корень начинает компоненту связности. Корни ориентированного DFS не определяют компоненты сильной связности. Простой dfs есть в полном файле.',
      ],
      undirectedCycle: [
        'Цикл в неориентированном графе',
        'Найдите цикл, пропуская физическое ребро входа в вершину. Все цвета вначале WHITE.',
        'O(V + E) времени; O(V) памяти стека.',
        'Одно A–B не является циклом: B видит то же родительское Edge. Треугольник является циклом. Внешний цикл проверяет все компоненты до обнаружения цикла. Цвета изменяются.',
      ],
      directedCycle: [
        'Цикл в ориентированном графе',
        'Найдите ребро к активному GREY-предку. Все вершины вначале WHITE.',
        'O(V + E) времени; O(V) памяти стека.',
        'C → A достигает GREY A и доказывает цикл. Переход в BLACK сам по себе не доказывает цикл. В ориентированном графе стрелку к родителю не пропускают. Внешний цикл проверяет и несвязные части.',
      ],
      topologicalOrder: [
        'DAG: развернуть порядок POST',
        'Обработайте все вершины, отклоните циклы и разверните список завершений.',
        'Полный обход Θ(V + E), O(V) дополнительной памяти. Инициализация посещений тоже занимает Θ(V).',
        'Добавляйте после завершения потомков. Обратный POST ставит начало каждого ребра раньше конца. GREY-цель вызывает отказ: у циклического графа нет топологического порядка. Внешний цикл и разворот есть в полном файле.',
      ],
      createTree: [
        'Создать бинарное дерево',
        'Создайте корень A с левым ребёнком B и правым C.',
        'Пример из трёх узлов: O(1) времени и памяти.',
        'BTreeNode хранит узел, BTree — корень дерева. Левый и правый ребёнок занимают разные позиции.',
      ],
      treeChildren: [
        'Прочитать детей узла',
        'Прочитайте двух детей корня и определите отсутствие ребёнка.',
        'O(1) времени и дополнительной памяти.',
        'Отсутствующий ребёнок — null. Проверяйте его перед getElement. B — лист, поскольку оба ребёнка null.',
      ],
      treePre: [
        'PRE: узел, левый, правый',
        'Выведите узел до его детей.',
        'Θ(n) времени, O(h + 1) памяти стека для непустого дерева; h — высота в рёбрах.',
        'Обработка до рекурсии даёт A, B, C. Ребёнок null — базовый случай.',
      ],
      treeIn: [
        'IN: левый, узел, правый',
        'Выведите узел между двумя поддеревьями.',
        'Θ(n) времени, O(h + 1) памяти стека для непустого дерева; h — высота в рёбрах.',
        'Обработка между рекурсивными вызовами даёт B, A, C. Это IN бинарного дерева, а не POST графа.',
      ],
      treePost: [
        'POST: левый, правый, узел',
        'Выведите узел после завершения обоих поддеревьев.',
        'Θ(n) времени, O(h + 1) памяти стека для непустого дерева; h — высота в рёбрах.',
        'Обработка после рекурсии даёт B, C, A. Родитель ждёт возврата обоих дочерних вызовов.',
      ],
      treeSize: [
        'Посчитать узлы дерева',
        'Верните единицу плюс размеры левого и правого поддеревьев.',
        'Θ(n) времени; O(h + 1) памяти стека для непустого дерева.',
        'Для A оба ребёнка возвращают 1, поэтому результат 1 + 1 + 1 = 3. Пустое поддерево возвращает 0.',
      ],
      treeHeight: [
        'Вычислить высоту в рёбрах',
        'Возьмите большую высоту ребёнка и прибавьте один.',
        'Θ(n) времени; O(h + 1) памяти стека для непустого дерева.',
        'Пустое дерево имеет высоту -1, лист — 0. Высота A равна 1, уровней два. Высота не равна числу узлов.',
      ],
      generalTree: [
        'Обычное дерево: дети и соседи',
        'Перечислите трёх детей R через первого ребёнка и следующего соседа.',
        'Θ(k) времени для k детей; O(1) дополнительной памяти.',
        'Tree отличается от BTree: getLeftChild даёт первого ребёнка, getRightSibling — следующего ребёнка того же родителя. X, Y и Z — дети R.',
      ],
      queueOffer: [
        'PriorityQueue: добавить значения',
        'Добавьте три значения и посмотрите размер и минимум.',
        'offer: O(log n); peek и size: O(1). Хранение очереди O(n). Оценка offer амортизированная: при увеличении массива иногда копируются сохранённые значения.',
        'offer добавляет значение. В этой целочисленной очереди наивысший приоритет у минимального значения, а не у добавленного первым.',
      ],
      queuePeek: [
        'PriorityQueue: посмотреть без удаления',
        'Вызовите peek дважды и убедитесь, что размер не меняется.',
        'O(1) времени и дополнительной памяти на peek.',
        'peek каждый раз возвращает 2. Он читает минимум и сохраняет его в очереди, поэтому повторный peek даёт тот же ответ. Для пустой очереди возвращает null.',
      ],
      queuePoll: [
        'PriorityQueue: удалить минимум',
        'Удалите одно значение и посмотрите новый минимум.',
        'poll: O(log n); peek и size: O(1).',
        'poll возвращает и удаляет 2. Новый минимум — 5, размер уменьшается на один. Для пустой очереди возвращает null.',
      ],
      queueDuplicates: [
        'PriorityQueue: одинаковые значения разрешены',
        'Добавьте 3 дважды и удалите обе копии.',
        'Каждый offer/poll: O(log n); удаление всех n значений: O(n log n). Оценка offer амортизированная: при увеличении массива иногда копируются сохранённые значения.',
        'PriorityQueue не является Set. Обе копии хранятся, каждый poll удаляет одну. Для порядка приоритетов используйте повторный poll; обычный перебор не обязан быть отсортирован.',
      ],
      queueComparator: [
        'PriorityQueue: задать другой порядок',
        'Используйте компаратор, чтобы сначала удалять большие числа.',
        'Каждый offer/poll: O(log n); O(n) памяти очереди. Оценка offer амортизированная: при увеличении массива иногда копируются сохранённые значения.',
        'TRA принимает ёмкость и компаратор вместе. reverseOrder меняет порядок значений. Сначала разберите такой компаратор, затем переходите к задачам с приоритетами.',
      ],
      simpleDijkstra: [
        'Дейкстра: расстояния с неотрицательными весами',
        'Выбирайте ближайшую необработанную вершину и улучшайте расстояния по её рёбрам. Старт принадлежит графу; веса конечные и неотрицательные.',
        'Ожидаемое O(V² + E) времени, O(V) дополнительной памяти для этой реализации с перебором.',
        'A → C → B стоит 3, меньше прямого ребра веса 5. Эта первая версия выбирает best перебором вершин: очередь приоритетов не требуется. D остаётся Infinity. Ключи — настоящие Vertex; граф не изменяется.',
      ],
      dijkstraPath: [
        'Дейкстра: сохранить улучшенный путь',
        'Обновляйте родителя только при улучшении расстояния. Используйте Дейкстру с перебором из предыдущего урока.',
        'Ожидаемое O(V² + E) времени и O(V) памяти; чтение пути O(длины пути).',
        'Сначала родитель B — A при цене 5; улучшение по C → B меняет его на C при цене 3. Полный файл содержит весь алгоритм и чтение цепочки родителей. Отсутствие записи означает недостижимость, а не путь из одной вершины.',
      ],
      graphMatrix: [
        'Граф TRA → матрица расстояний',
        'Назначьте индексы настоящим вершинам и скопируйте веса исходящих рёбер. Список содержит каждую вершину ровно один раз.',
        'Ожидаемое Θ(V² + E) времени, O(V²) памяти матрицы.',
        'Строки и столбцы следуют [A,B,C]. Диагональ начинается с 0, отсутствующие рёбра — Infinity. Это подготовка для Флойда, ещё не кратчайшие пути. min сохраняет отрицательную петлю для проверки цикла.',
      ],
      simpleFloyd: [
        'Флойд: проверить промежуточную вершину',
        'Начните с матрицы рёбер предыдущего урока и улучшайте все пары через via.',
        'Θ(V³ + E) времени с построением матрицы; O(V²) памяти.',
        'Через B расстояние A → C улучшается с 9 до 5 + (-2) = 3. via — внешний цикл: после него разрешённые промежуточные вершины включают via. Отрицательные веса допустимы; отрицательная диагональ отклоняет результат. В полном файле есть построение матрицы из TRA.',
      ],
      prim: [
        'Прим: наращивать дерево',
        'Выбирайте самое дешёвое ребро из дерева в непосещённую вершину. Веса конечные и неизменные.',
        'O(V + E log(E + 1)) времени; O(V + E) дополнительной памяти с результатом.',
        'Выбираем A–B (1), затем B–C (2): сумма 3. addBoundary отмечает новую вершину и добавляет граничные рёбра. Внешний цикл корней даёт лес на несвязном входе; цвета меняются, структура и веса сохраняются.',
      ],
      disjointSets: [
        'Непересекающиеся множества: концы уже связаны?',
        'Используйте лес родителей для проверки, соединяет ли ребро разные множества.',
        'Ожидаемое O(V) времени в худшем случае на find/union; O(V) памяти родителей.',
        'Сначала каждый Vertex — свой корень. После объединения A–B и B–C у A и C один корень, поэтому union(A,C) даёт false. В этой первой DSU нет рангов и сжатия путей: шаги показаны явно.',
      ],
      kruskal: [
        'Краскал: добавлять рёбра без циклов',
        'Отсортируйте настоящие Edge по весу и объединяйте множества их концов. Веса конечные.',
        'Ожидаемое O(V + E log(E + 1) + E·V) времени с этой простой DSU; O(V + E) памяти.',
        'Используем простую DSU из предыдущего урока. A–B и B–C принимаются; A–C замкнуло бы цикл. Graph.edges() перечисляет физическое неориентированное ребро один раз. Для несвязного графа получается лес. Поля входа сохраняются.',
      ],
      lowValues: [
        'DFS: что означают tin и low',
        'Вычислите номера входа и самый ранний вход, достижимый снизу не более чем через одно обратное ребро, отличное от родительского.',
        'Ожидаемое Θ(V + E) времени и O(V) дополнительной памяти со стеком.',
        'Здесь tin считает только входы. После ребёнка берём low[child], для уже посещённого соседа — tin[neighbour]. Пропускаем то же физическое родительское Edge. Треугольник возвращается к A; D не может обойти C.',
      ],
      bridges: [
        'Мост: может ли поддерево вернуться?',
        'После возврата ребёнка проверьте low[child] > tin[parent].',
        'Ожидаемое Θ(V + E) времени и O(V) дополнительной памяти со стеком.',
        'C–D — мост: удаление отделяет D. У рёбер треугольника есть обходной путь. Строгое > существенно: путь к самому родителю уже является обходом. Полный файл содержит DFS с low и проверяет все компоненты.',
      ],
      articulation: [
        'Точка сочленения: что если удалить вершину?',
        'Используйте условие low для некорневой вершины и отдельное правило детей корня.',
        'Ожидаемое Θ(V + E) времени и O(V) дополнительной памяти со стеком.',
        'C — точка сочленения: удаление отделяет D. Для некорня нужен ребёнок с low[child] ≥ tin[v]. Для корня — хотя бы два ребёнка DFS, не два соседа графа. У A два соседа, но здесь один ребёнок DFS.',
      ],
      matchingStep: [
        'Паросочетание: переназначить пару',
        'Начните с L0–R0 и найдите пару для L1. Рёбра должны соединять объявленные левую и правую доли.',
        'Один поиск: ожидаемое O(V + E) времени, O(V) памяти.',
        'L1 нужна занятая R0. Рекурсия перемещает L0 к R1, освобождая R0 для L1. owner хранит для правой вершины левую. Новый seen предотвращает повторное посещение правых вершин в этом поиске. Это одно увеличение, не весь алгоритм.',
      ],
      matching: [
        'Паросочетание: повторить для каждой левой вершины',
        'Найдите наибольшее по числу пар паросочетание в известном двудольном Graph. Переданный список левой доли полный и корректный.',
        'Ожидаемое O(V + E + L·E) времени; O(V) памяти; L — размер левой доли.',
        'Начните без пар. Для каждой левой вершины создайте новый seen и вызовите увеличение из прошлого урока. Новый поиск позволяет переназначить старые пары; жадный выбор только свободного соседа мог бы не получить ответ 2.',
      ],
      residualCapacity: [
        'Поток: остаточная ёмкость',
        'Прочитайте ёмкость ребра TRA и вычтите уже отправленный поток.',
        'O(1) времени и памяти для этого ребра.',
        'Ёмкость 5 минус поток 3 оставляет 2 вперёд. Отправленные 3 можно отменить обратным остаточным переходом. Это учёт потока, а не новое ребро входа. Здесь одно ребро, не максимальный поток.',
      ],
      augmentFlow: [
        'Поток: увеличить по одному известному пути',
        'Отправьте величину узкого места по s → A → t. Начальный поток здесь нулевой.',
        'Для известного пути длины k: O(k) времени; матрица остатков хранится в O(V²).',
        'Ёмкости пути 3 и 2, поэтому отправляем min(3,2) = 2. Вычитаем 2 вперёд и добавляем 2 назад для отмены. Эти обновления не ищут пути и не составляют полный алгоритм потока. Индексы матрицы [s,A,t].',
      ],
      cancelFlow: [
        'Поток: отменить прежнее решение',
        'Отмените единицу по A → X через остаточный переход X → A.',
        'O(1) для этой одной отмены.',
        'Во входе нет ребра X → A. Его остаточная ёмкость равна ранее отправленному по A → X потоку. Отмена освобождает исходную ёмкость и позволяет перенаправить поток позднее. Это демонстрация отмены, не полный запуск по сети.',
      ],
      maximumFlow: [
        'Максимальный поток: повторять увеличения',
        'Объедините остаточный BFS, поиск узкого места и обновления до исчезновения пути s–t.',
        'Эдмондс–Карп с матричным BFS: O(V² + E + V³·E) времени, O(V²) памяти. Каждый BFS просматривает до V² ячеек.',
        'Сначала разберите три предыдущих примера потока. Полный файл отображает настоящие TRA-вершины в матрицу остатков и использует TRA LinkedQueue. Сохранённые ёмкости — конечные целые [0,10⁹]. Ячейка объединяет встречную ёмкость и отмену, поэтому не является потоком отдельного входного ребра. Меняется только вспомогательная матрица, граф сохраняется. Исток/сток — разные допустимые индексы.',
      ],
      minimumCut: [
        'Минимальный разрез: достижимая остаточная сторона',
        'После максимального потока найдите остаточно достижимые из s вершины и сложите исходящие исходные ёмкости.',
        'Эдмондс–Карп с матричным BFS: O(V² + E + V³·E) времени, O(V²) памяти. Каждый BFS просматривает до V² ячеек.',
        'Сторона истока {s}; ёмкость разреза 3 + 2 = 5, равна максимальному потоку. Разрез считается по исходным ёмкостям, а не остаткам. Полный файл содержит весь предыдущий алгоритм. У другой сети может быть несколько минимальных разрезов.',
      ],
      floydPath: [
        'Флойд: восстановить путь',
        'При улучшении запоминайте первый переход. Затем следуйте по переходам к цели.',
        'Θ(V³ + E) времени и O(V²) памяти для Флойда; O(длины пути) для чтения пути.',
        'При улучшении через via задаём next[from][to] = next[from][via]. Метод ниже читает эту таблицу. Отсутствие записи означает недостижимость. Полный файл строит обе таблицы и отклоняет отрицательные циклы до чтения путей.',
      ],
      taskPriority: [
        'Задачи: приоритет и равные значения',
        'Упорядочьте Task по числовому приоритету, затем по имени. Меньшее значение приоритета идёт первым.',
        'offer: амортизированное O(log n); poll: O(log n); хранение очереди O(n).',
        'У Task есть имя и приоритет; небольшой класс находится в полном файле. У A и B одинаковый приоритет 1, поэтому второе сравнение ставит A первой. Порядок определяет компаратор, а не время добавления.',
      ],
      dfsCycle: [
        'DFS: почему цикл останавливается',
        'Пройдите A → B → C → A; вначале все visited равны false.',
        'Θ(V + E) для полного обхода, O(V) памяти карты и стека.',
        'A помечена до вызова B. Когда C снова видит A, visited[A] уже true: четвёртый вызов не создаётся. Возвращается C, затем B, затем A.',
      ],
      bfsDiscovery: [
        'BFS: почему D попадает в очередь один раз',
        'Используйте ориентированный ромб; вначале все вершины WHITE.',
        'Θ(V + E) для полного обхода, O(V) памяти очереди.',
        'B первой обнаруживает D и помечает GREY до добавления. Когда C видит D, та уже обнаружена, хотя ещё не извлечена из очереди. C пропускает её. D обрабатывается один раз.',
      ],
    },
    contracts: {
      simpleDfs:
        'Вход: вершина не null; в visited есть все вершины, изначально false. Печатает обход и меняет только visited.',
      prePost:
        'Вход: вершина не null; в visited есть все вершины, изначально false. Печатает обход и меняет только visited.',
      dfsCycle:
        'Вход: вершина не null; в visited есть все вершины, изначально false. Печатает обход и меняет только visited.',
      colourDfs:
        'Вход: start не null, все цвета WHITE. Печатает обход и меняет цвета достигнутых вершин; структура сохраняется.',
      simpleBfs:
        'Вход: start не null, все цвета WHITE. Печатает обход и меняет цвета достигнутых вершин; структура сохраняется.',
      bfsDiscovery:
        'Вход: start не null, все цвета WHITE. Печатает обход и меняет цвета достигнутых вершин; структура сохраняется.',
      dfsTimes:
        'Перед обходом сбросьте счётчик, очистите карты времён и задайте WHITE. Меняет времена/цвета и печатает результат.',
      edgeTypes:
        'Перед обходом сбросьте счётчик, очистите карты времён и задайте WHITE. Меняет времена/цвета и печатает результат.',
      bfsDistance:
        'Вход: start не null. Возвращает новую карту расстояний: start = 0; недостижимых вершин нет. Граф сохраняется.',
      bfsPath:
        'Карта родителей получена предыдущим обходом. Возвращает метки пути или пустой список для недостижимой цели; чтение пути не меняет карту.',
      dijkstraPath:
        'Карта родителей получена предыдущим обходом. Возвращает метки пути или пустой список для недостижимой цели; чтение пути не меняет карту.',
      fullDfs:
        'Инициализируйте цвета один раз до внешнего цикла. Считает компоненты неориентированного графа и меняет цвета; рёбра сохраняются.',
      undirectedCycle:
        'Вход: WHITE до внешнего цикла корней. Возвращает наличие цикла; при раннем выходе цвета могут быть обработаны частично.',
      directedCycle:
        'Вход: WHITE до внешнего цикла корней. Возвращает наличие цикла; при раннем выходе цвета могут быть обработаны частично.',
      topologicalOrder:
        'Нужен DiGraph с цветами WHITE и пустым POST. Обратный завершённый POST даёт порядок; цикл вызывает отказ. Меняет цвета и список.',
      treePre:
        'Вход: корень бинарного поддерева или null. Печатает выбранный порядок; дерево сохраняется.',
      treeIn:
        'Вход: корень бинарного поддерева или null. Печатает выбранный порядок; дерево сохраняется.',
      treePost:
        'Вход: корень бинарного поддерева или null. Печатает выбранный порядок; дерево сохраняется.',
      treeSize:
        'Вход: корень бинарного поддерева или null. Возвращает число узлов, 0 для пустого; дерево сохраняется.',
      treeHeight:
        'Вход: корень бинарного поддерева или null. Возвращает высоту в рёбрах: пустое = -1, лист = 0; дерево сохраняется.',
      simpleDijkstra:
        'Старт принадлежит DiGraph. Веса конечные и неотрицательные. Возвращает расстояния с Infinity для недостижимых; граф сохраняется.',
      graphMatrix:
        'Перечислите каждый настоящий Vertex графа DiGraph ровно один раз. Возвращает новую матрицу рёбер; отсутствующие — Infinity. Граф сохраняется.',
      simpleFloyd:
        'Вход: квадратная матрица расстояний по рёбрам. Обновляет её на месте; отрицательный цикл отклоняет результат. Граф TRA сохраняется.',
      floydPath:
        'Читайте next только после успешного Флойда. Нужны допустимые индексы; недостижимость даёт пустой список. Чтение пути не меняет таблицы.',
      prim: 'Вход: неориентированный Graph, конечные неизменные веса. Возвращает настоящие рёбра леса; меняет цвета, сохраняет рёбра и веса.',
      disjointSets:
        'Сначала каждая вершина указывает на себя в parent. find читает представителя; union объединяет множества и сообщает успех, меняя parent.',
      kruskal:
        'Вход: неориентированный Graph с конечными весами. Возвращает настоящие рёбра леса; граф сохраняется. Использует предыдущую простую DSU.',
      lowValues:
        'Используйте неориентированный Graph. До внешнего цикла сбросьте счётчик и очистите карты/наборы результата. Меняет только вспомогательные данные.',
      bridges:
        'Используйте неориентированный Graph. До внешнего цикла сбросьте счётчик и очистите карты/наборы результата. Меняет только вспомогательные данные.',
      articulation:
        'Используйте неориентированный Graph. До внешнего цикла сбросьте счётчик и очистите карты/наборы результата. Меняет только вспомогательные данные.',
      matchingStep:
        'Предполагается известное корректное разбиение на доли. owner хранит правую → левую; seen пуст перед каждой попыткой. Успех добавляет пару, возможно переназначая прежние.',
      matching:
        'Предполагается известное корректное разбиение на доли. owner хранит правую → левую; seen пуст перед каждой попыткой. Успех добавляет пару, возможно переназначая прежние.',
      maximumFlow:
        'Допустимые разные индексы истока/стока; сохранённые целые ёмкости [0,10⁹]. Возвращает поток или разрез после изменения только матрицы остатков; граф сохраняется.',
      minimumCut:
        'Допустимые разные индексы истока/стока; сохранённые целые ёмкости [0,10⁹]. Возвращает поток или разрез после изменения только матрицы остатков; граф сохраняется.',
    },
    traces: {
      dfsCycle: [
        'Вход в A: помечаем A до спуска; активные вызовы становятся A → B → C.',
        'C рассматривает C → A. A уже посещена, поэтому пропускаем соседа.',
        'Нового вызова нет. Завершается C, затем B, затем A; каждая вершина учтена один раз.',
      ],
      bfsDiscovery: [
        'После извлечения A очередь [B, C]. Обе вершины уже обнаружены.',
        'Извлекаем B: обнаруживаем D и помечаем до добавления. Очередь [C, D].',
        'Извлекаем C: D уже GREY, пропускаем. Очередь остаётся [D].',
        'Извлекаем D: завершаем её соседей, помечаем BLACK. Очередь [].',
      ],
      fullDfs: [
        'Первый корень A посещает A и B.',
        'C всё ещё WHITE: внешний цикл начинает с неё новую компоненту.',
        'D — ещё один WHITE-корень, от него достигается E. Итого 3 компоненты.',
      ],
    },
    traceTitle: 'Проследите изменения состояния',
    setupTitle: 'Скачать и запустить',
  },
  fi: {
    title: 'Java: yksi asia kerrallaan',
    intro:
      'Lyhyitä itsenäisiä TRA-esimerkkejä JDK 11:lle ja uudemmille. Lue ensin ydinkoodi; avaa koko tiedosto, kun haluat suorittaa esimerkin.',
    download: 'Lataa esimerkit aiheittain + traj.jar (.zip)',
    setup:
      'Pura ZIP ja suorita komennot tra-graphs-kansiosta. Jos lataat yhden tiedoston, laita se traj.jar-tiedoston viereen. Lisää IDE:ssä traj.jar kirjastoksi.',
    input: 'Pieni syöte',
    code: 'Ydinkoodi',
    explanation: 'Miksi tämä toimii',
    complete: 'Koko tiedosto ja suorituskomento',
    advanced: 'Seuraavat askeleet — perusteiden jälkeen',
    order:
      'Tulostus käyttää mukana tulevan JARin naapurijärjestystä. Toinen järjestys voi muuttaa DFS-järjestystä tai valittua polkua, mutta ei BFS:n lyhimpiä etäisyyksiä. R on saavutettavien solmujen määrä; A_R tutkittujen naapurimerkintöjen määrä. Map-arviot olettavat odotetun O(1)-identiteettihaun.',
    groups: {
      basics: 'Verkon luominen ja lukeminen',
      dfs: 'Syvyyssuuntainen läpikäynti (DFS)',
      bfs: 'Leveyssuuntainen läpikäynti (BFS)',
      applications: 'Läpikäyntien sovellukset',
      trees: 'Puut: yksi toiminto kerrallaan',
      queue: 'PriorityQueue: yksi toiminto kerrallaan',
      weighted: 'Painotetut lyhimmät polut',
      mst: 'Pienimmät virittävät puut',
      analysis: 'Verkon analysointi',
      flow: 'Virtaus: yhdestä kaaresta koko algoritmiin',
    },
    examples: {
      createGraph: [
        'Luo suuntaamaton verkko',
        'Luo kaksi solmua ja yhdistä ne yhdellä kaarella.',
        'Kaksi solmua ja yksi kaari: O(1) aikaa ja muistia.',
        'Lisää kaari kerran. Graph tekee kummastakin solmusta toisen naapurin.',
      ],
      createDirected: [
        'Luo suunnattu verkko',
        'Lisää A → B ja tarkista sen suunta.',
        'Tämä kiinteä esimerkki: O(1) aikaa ja muistia.',
        'DiGraph tallentaa kaaren A → B. Vastakkaista kaarta B → A ei lisätä.',
      ],
      vertices: [
        'Käy kaikki solmut läpi',
        'Tulosta solmut, myös erillinen solmu.',
        'Θ(V) aikaa; O(1) lisämuistia.',
        'vertices() luettelee verkon solmut. Solmu näkyy, vaikka sillä ei ole kaaria.',
      ],
      neighbors: [
        'Käy yhden solmun naapurit läpi',
        'Tulosta vain A:n lähtönaapurit.',
        'Θ(outdegree(A)) aikaa; O(1) lisämuistia.',
        'Tämä ei ole koko verkon läpikäynti: silmukka lukee yhden vieruslistan. Tulokaari ei tee D:stä A:n lähtönaapuria.',
      ],
      edgeWeight: [
        'Lue kaaren paino',
        'Luo painotettu kaari ja lue sen päätesolmut sekä paino.',
        'Tallennetun Edge-olion lukeminen: O(1) aikaa ja muistia.',
        'Tallenna addEdge-metodin palauttama Edge. Kirjoita 5.0f: int-argumentin ylikuormitus asettaa värin, ei painoa.',
      ],
      vertexMap: [
        'Liitä solmuun tietoja',
        'Tallenna eri arvot kahdelle samannimiselle solmulle.',
        'Odotettu O(1) yhtä Map-operaatiota kohti; O(V) muistia V alkiolle.',
        'Map-avaimet ovat Vertex-olioita, eivät nimiä. IdentityHashMap erottaa kaksi X-solmua eikä muuta verkkoa.',
      ],
      simpleDfs: [
        'Rekursiivinen DFS: käy solmussa',
        'Käy A:sta saavutettava osa läpi. Aluksi visited on false jokaiselle solmulle.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'Merkitse ennen rekursiota. Ensin valmistuu A → B → D; suoritus palaa A:n silmukkaan ja jatkaa C:hen. visited estää kiertämisen eikä muuta TRA-värejä.',
      ],
      prePost: [
        'DFS: saapuminen ja paluu (PRE / POST)',
        'Tulosta saapuminen ennen lapsia ja valmistuminen lasten jälkeen. Kaikki visited-arvot ovat aluksi false.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'PRE A → PRE B → PRE D → POST D → POST B → PRE C → POST C → POST A. POST B tapahtuu D:n jälkeen; paluu A:han jatkaa seuraavasta naapurista eikä aloita dfs(A):ta uudestaan.',
      ],
      colourDfs: [
        'DFS väreillä WHITE, GREY ja BLACK',
        'Näytä, milloin solmu aktivoituu ja milloin se valmistuu. Aluksi kaikki solmut ovat WHITE.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'WHITE: löytämättä. GREY: kutsu on aktiivinen. BLACK: kaikki naapurit käsitelty. Ketjussa A → B → D kaikki kolme kutsua ovat GREY, kunnes D valmistuu. Tämä oppitunti muuttaa Vertex-värejä.',
      ],
      dfsTimes: [
        'DFS: saapumis- ja poistumisajat',
        'Käytä yhtä laskuria saapumiselle ja poistumiselle. Aluksi kaikki solmut ovat WHITE.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'A:n aikaväli sisältää B:n ja D:n aikavälit. Ajat laskevat tapahtumia, eivät PRE/POST-listojen paikkoja. Laskuri ja taulukot nollataan joka ajossa.',
      ],
      edgeTypes: [
        'Suunnattu DFS: luokittele kaari',
        'Luokittele lähtökaaret värin ja saapumisajan avulla. Aluksi kaikki solmut ovat WHITE.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'WHITE antaa puukaaren, GREY paluukaaren. Aktiivista solmua myöhemmin löydetty BLACK-kohde on sen jälkeläinen (etenemiskaari), muuten ristikkäiskaari. Säännöt koskevat suunnattua DFS:ää; metodista palaaminen ei ole verkon kaari.',
      ],
      simpleBfs: [
        'BFS: läpikäynti jonolla',
        'Käy A:sta saavutettava osa läpi. Aluksi kaikki solmut ovat WHITE.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'Jono: [A] → [B,C] → [C,D] → [D] → []. Merkitse GREY ennen offer-kutsua, jotta toinen kaari ei lisää solmua uudestaan. remove-kutsun jälkeen solmu pysyy GREY, kunnes sen naapurit on käsitelty; sitten BLACK.',
      ],
      bfsDistance: [
        'BFS: etäisyys kaarien määränä',
        'Etsi painottomat etäisyydet A:sta; E ei ole saavutettavissa.',
        'Odotettu Θ(R + A_R) aikaa, O(R) muistia saavutettaville solmuille; kaikkien solmujen tulostus lisää Θ(V).',
        'Ensimmäinen löytyminen määrää lyhimmän etäisyyden: naapuri = nykyinen + 1. Map-merkintä merkitsee myös löytymistä. Saavuttamattomalla solmulla ei ole merkintää; getOrDefault näyttää -1. Menetelmä ei minimoi mielivaltaisia kaaripainoja.',
      ],
      bfsPath: [
        'BFS: palauta polku',
        'Seuraa vanhempia D:stä A:han ja käännä lista.',
        'BFS: odotettu Θ(R + A_R), O(R) muistia; polun palautus O(polun pituus) aikaa ja muistia.',
        'Koko tiedosto muodostaa vanhemmat BFS:llä. parent[A] = null päättää ketjun. D → B → A muuttuu poluksi [A,B,D]. Saavuttamaton kohde palauttaa tyhjän listan. Avaimet ovat Vertex-olioita, nimet vain tulostusta varten.',
      ],
      fullDfs: [
        'DFS: jatka toisessa komponentissa',
        'Aloita uusi DFS jokaisesta jäljellä olevasta WHITE-solmusta.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'Ulkosilmukka tavoittaa erillisen C:n sekä D–E-komponentin. Suuntaamattomassa Graph-verkossa uusi juuri aloittaa yhtenäisen komponentin. Suunnatun DFS:n juuret eivät määritä vahvasti yhtenäisiä komponentteja. Yksinkertainen dfs on koko tiedostossa.',
      ],
      undirectedCycle: [
        'Sykli suuntaamattomassa verkossa',
        'Etsi sykli ohittamalla fyysinen kaari, jota pitkin solmuun tultiin. Kaikki värit ovat aluksi WHITE.',
        'O(V + E) aikaa; O(V) pinomuistia.',
        'Pelkkä A–B ei ole sykli: B näkee saman vanhemman Edge-olion. Kolmio on sykli. Ulkosilmukka tarkistaa kaikki komponentit, kunnes sykli löytyy. Värit muuttuvat.',
      ],
      directedCycle: [
        'Sykli suunnatussa verkossa',
        'Etsi kaari aktiiviseen GREY-esivanhempaan. Kaikki solmut ovat aluksi WHITE.',
        'O(V + E) aikaa; O(V) pinomuistia.',
        'C → A tavoittaa GREY-solmun A ja todistaa syklin. BLACK-kohde ei yksin todista sykliä. Suunnatussa verkossa vanhempaan johtavaa kaarta ei ohiteta. Ulkosilmukka tarkistaa myös erilliset osat.',
      ],
      topologicalOrder: [
        'DAG: käännä POST-järjestys',
        'Käsittele jokainen solmu, hylkää syklit ja käännä valmistumislista.',
        'Koko läpikäynti Θ(V + E), O(V) lisämuistia. Vierailutiedon alustus vie myös Θ(V) aikaa.',
        'Lisää vasta jälkeläisten valmistuttua. Käänteinen POST asettaa jokaisen kaaren lähtösolmun ennen kohdetta. GREY-kohde aiheuttaa virheen: syklisellä verkolla ei ole topologista järjestystä. Ulkosilmukka ja kääntö ovat koko tiedostossa.',
      ],
      createTree: [
        'Luo binääripuu',
        'Luo juuri A, vasen lapsi B ja oikea lapsi C.',
        'Tämä kolmen solmun esimerkki: O(1) aikaa ja muistia.',
        'BTreeNode tallentaa solmun, BTree puun juuren. Vasen ja oikea lapsi ovat eri paikkoja.',
      ],
      treeChildren: [
        'Lue solmun lapset',
        'Lue juuren kaksi lasta ja tunnista puuttuva lapsi.',
        'O(1) aikaa ja lisämuistia.',
        'Puuttuva lapsi on null. Tarkista se ennen getElement-kutsua. B on lehti, koska molemmat lapsiviitteet ovat null.',
      ],
      treePre: [
        'PRE: solmu, vasen, oikea',
        'Tulosta solmu ennen sen lapsia.',
        'Θ(n) aikaa, O(h + 1) pinomuistia epätyhjälle puulle; h on korkeus kaarina.',
        'Käsittely ennen rekursiota antaa A, B, C. null-lapsi on perustapaus.',
      ],
      treeIn: [
        'IN: vasen, solmu, oikea',
        'Tulosta solmu sen kahden alipuun välissä.',
        'Θ(n) aikaa, O(h + 1) pinomuistia epätyhjälle puulle; h on korkeus kaarina.',
        'Käsittely rekursiivisten kutsujen välissä antaa B, A, C. Tämä on binääripuun IN, ei verkon POST.',
      ],
      treePost: [
        'POST: vasen, oikea, solmu',
        'Tulosta solmu molempien alipuiden valmistuttua.',
        'Θ(n) aikaa, O(h + 1) pinomuistia epätyhjälle puulle; h on korkeus kaarina.',
        'Käsittely rekursion jälkeen antaa B, C, A. Vanhempi odottaa molempien lapsikutsujen paluuta.',
      ],
      treeSize: [
        'Laske puun solmut',
        'Palauta yksi sekä vasemman ja oikean alipuun koot.',
        'Θ(n) aikaa; O(h + 1) pinomuistia epätyhjälle puulle.',
        'A:n molemmat lapset palauttavat 1, joten tulos on 1 + 1 + 1 = 3. Tyhjä alipuu palauttaa 0.',
      ],
      treeHeight: [
        'Laske korkeus kaarina',
        'Valitse lasten suurempi korkeus ja lisää yksi.',
        'Θ(n) aikaa; O(h + 1) pinomuistia epätyhjälle puulle.',
        'Tyhjän puun korkeus on -1, lehden 0. A:n korkeus on 1 ja tasoja on kaksi. Korkeus ei ole solmujen määrä.',
      ],
      generalTree: [
        'Yleinen puu: lapset ja sisarukset',
        'Luettele R:n kolme lasta ensimmäisen lapsen ja seuraavan sisaruksen avulla.',
        'Θ(k) aikaa k lapselle; O(1) lisämuistia.',
        'Tree eroaa BTree-puusta: getLeftChild antaa ensimmäisen lapsen, getRightSibling saman vanhemman seuraavan lapsen. X, Y ja Z ovat R:n lapsia.',
      ],
      queueOffer: [
        'PriorityQueue: lisää arvoja',
        'Lisää kolme arvoa ja tarkista koko sekä pienin arvo.',
        'offer: O(log n); peek ja size: O(1). Jonon tallennus O(n). offer-arvio on tasoitettu: taulukon kasvatus kopioi joskus tallennetut arvot.',
        'offer lisää arvon. Tässä kokonaislukujonossa pienin arvo saa suurimman prioriteetin, ei ensimmäiseksi lisätty.',
      ],
      queuePeek: [
        'PriorityQueue: katso poistamatta',
        'Kutsu peek kahdesti ja varmista, että koko pysyy samana.',
        'O(1) aikaa ja lisämuistia yhtä peek-kutsua kohti.',
        'peek palauttaa joka kerta 2. Se lukee pienimmän poistamatta sitä, joten uusi peek antaa saman vastauksen. Tyhjä jono palauttaa null.',
      ],
      queuePoll: [
        'PriorityQueue: poista pienin',
        'Poista yksi arvo ja tarkista uusi pienin arvo.',
        'poll: O(log n); peek ja size: O(1).',
        'poll palauttaa ja poistaa arvon 2. Seuraava pienin on 5 ja koko pienenee yhdellä. Tyhjä jono palauttaa null.',
      ],
      queueDuplicates: [
        'PriorityQueue: samat arvot sallitaan',
        'Lisää 3 kahdesti ja poista molemmat kappaleet.',
        'Jokainen offer/poll: O(log n); n arvon poistaminen: O(n log n). offer-arvio on tasoitettu: taulukon kasvatus kopioi joskus tallennetut arvot.',
        'PriorityQueue ei ole Set. Molemmat kappaleet tallennetaan ja kukin poll poistaa yhden. Käytä toistuvaa poll-kutsua prioriteettijärjestykseen; iterointi ei takaa järjestystä.',
      ],
      queueComparator: [
        'PriorityQueue: valitse toinen järjestys',
        'Käytä vertailijaa poistaaksesi suuremmat luvut ensin.',
        'Jokainen offer/poll: O(log n); O(n) jonon muistia. offer-arvio on tasoitettu: taulukon kasvatus kopioi joskus tallennetut arvot.',
        'TRA ottaa kapasiteetin ja vertailijan yhdessä. reverseOrder vaihtaa arvojen järjestyksen. Opiskele tämä vertailija ennen priorisoitujen tehtävien mallintamista.',
      ],
      simpleDijkstra: [
        'Dijkstra: etäisyydet ei-negatiivisilla painoilla',
        'Valitse lähin keskeneräinen solmu ja paranna etäisyyksiä sen lähtökaarilla. Aloitussolmu kuuluu verkkoon; painot ovat äärellisiä ja ei-negatiivisia.',
        'Odotettu O(V² + E) aikaa, O(V) lisämuistia tässä solmuja selaavassa toteutuksessa.',
        'A → C → B maksaa 3, vähemmän kuin suora kaari 5. Ensimmäinen versio valitsee best-solmun käymällä solmut läpi: prioriteettijonoa ei tarvita. D jää Infinity-arvoon. Avaimet ovat oikeita Vertex-olioita; verkko ei muutu.',
      ],
      dijkstraPath: [
        'Dijkstra: tallenna parantunut polku',
        'Päivitä vanhempi vain etäisyyden parantuessa. Käytä edellisen oppitunnin solmuja selaavaa Dijkstraa.',
        'Odotettu O(V² + E) aikaa ja O(V) muistia; polun lukeminen O(polun pituus).',
        'B:n vanhempi on ensin A kustannuksella 5; C → B vaihtaa vanhemmaksi C:n kustannuksella 3. Koko tiedosto sisältää Dijkstran sekä vanhempiketjun lukemisen. Puuttuva merkintä tarkoittaa saavuttamattomuutta, ei yhden solmun polkua.',
      ],
      graphMatrix: [
        'TRA-verkko → etäisyysmatriisi',
        'Anna oikeille solmuille indeksit ja kopioi lähtökaarien painot. Lista sisältää jokaisen solmun kerran.',
        'Odotettu Θ(V² + E) aikaa, O(V²) matriisimuistia.',
        'Rivit ja sarakkeet seuraavat järjestystä [A,B,C]. Diagonaali alkaa nollasta, puuttuvat kaaret Infinity-arvosta. Tämä on Floydin valmistelu, ei vielä lyhimmät polut. min säilyttää negatiivisen silmukan syklin tarkistusta varten.',
      ],
      simpleFloyd: [
        'Floyd: kokeile yhtä välisolmua',
        'Aloita edellisen oppitunnin kaarimatriisista ja paranna kaikki parit via-solmun kautta.',
        'Θ(V³ + E) aikaa matriisin muodostus mukaan lukien; O(V²) muistia.',
        'B:n kautta A → C paranee arvosta 9 arvoon 5 + (-2) = 3. via on ulkosilmukka: sen jälkeen sallitut välisolmut sisältävät via-solmun. Negatiiviset painot sallitaan; negatiivinen diagonaali hylkää tuloksen. Koko tiedosto muodostaa myös TRA-matriisin.',
      ],
      prim: [
        'Prim: kasvata puuta',
        'Valitse halvin kaari puusta käymättömään solmuun. Painot ovat äärellisiä ja pysyviä.',
        'O(V + E log(E + 1)) aikaa; O(V + E) lisämuistia tulos mukaan lukien.',
        'Valitse A–B (1), sitten B–C (2): summa 3. addBoundary merkitsee uuden solmun ja lisää rajan ylittävät kaaret jonoon. Ulompi juurisilmukka antaa metsän epäyhtenäisellä syötteellä; värit muuttuvat, rakenne ja painot säilyvät.',
      ],
      disjointSets: [
        'Erilliset joukot: ovatko päätesolmut jo yhteydessä?',
        'Tarkista vanhempimetsällä, yhdistääkö ehdotettu kaari kaksi joukkoa.',
        'Odotettu O(V) pahimman tapauksen aika find/union-operaatiolle; O(V) vanhempimuistia.',
        'Aluksi jokainen Vertex on oma juurensa. A–B- ja B–C-yhdistämisten jälkeen A:lla ja C:llä on sama juuri, joten union(A,C) on false. Tässä ensimmäisessä DSU:ssa ei ole rankia eikä poluntiivistystä; vaiheet ovat näkyvissä.',
      ],
      kruskal: [
        'Kruskal: hyväksy kaaret luomatta sykliä',
        'Järjestä oikeat Edge-oliot painon mukaan ja yhdistä niiden päätesolmujen joukot. Painot ovat äärellisiä.',
        'Odotettu O(V + E log(E + 1) + E·V) aikaa tällä yksinkertaisella DSU:lla; O(V + E) muistia.',
        'Käytä edellisen oppitunnin yksinkertaista DSU:ta. A–B ja B–C hyväksytään; A–C sulkisi syklin. Graph.edges() luettelee fyysisen suuntaamattoman kaaren kerran. Epäyhtenäinen verkko tuottaa metsän. Syötteen kentät säilyvät.',
      ],
      lowValues: [
        'DFS: mitä tin ja low tarkoittavat',
        'Laske saapumisnumerot ja aikaisin saapuminen, joka saavutetaan alapuolelta enintään yhdellä muulla kuin vanhemman paluukaarella.',
        'Odotettu Θ(V + E) aikaa ja O(V) lisämuistia rekursio mukaan lukien.',
        'Tässä tin laskee vain saapumiset. Lapsesta palatessa käytetään low[child], jo vieraillulle naapurille tin[neighbour]. Ohita sama fyysinen vanhemman Edge. Kolmio pääsee takaisin A:han; D ei voi ohittaa C:tä.',
      ],
      bridges: [
        'Silta: pääseekö lapsen alipuu takaisin?',
        'Tarkista lapsen palattua low[child] > tin[parent].',
        'Odotettu Θ(V + E) aikaa ja O(V) lisämuistia rekursio mukaan lukien.',
        'C–D on silta: sen poistaminen erottaa D:n. Kolmion kaarilla on vaihtoehtoinen reitti. Tiukka > on tärkeä: paluu vanhempaan on jo vaihtoehto. Koko tiedosto sisältää low-DFS:n ja tarkistaa kaikki komponentit.',
      ],
      articulation: [
        'Nivelpiste: entä jos solmu poistetaan?',
        'Käytä muun kuin juuren low-ehtoa ja erillistä juuren lapsisääntöä.',
        'Odotettu Θ(V + E) aikaa ja O(V) lisämuistia rekursio mukaan lukien.',
        'C on nivelpiste: poistaminen erottaa D:n. Muulle kuin juurelle tarvitaan lapsi, jolla low[child] ≥ tin[v]. Juurelle tarvitaan vähintään kaksi DFS-lasta, ei kahta verkon naapuria. A:lla on kaksi naapuria mutta tässä yksi DFS-lapsi.',
      ],
      matchingStep: [
        'Paritus: siirrä olemassa oleva pari',
        'Aloita parista L0–R0 ja etsi pari L1:lle. Kaarien tulee yhdistää määritellyt vasen ja oikea puoli.',
        'Yksi haku: odotettu O(V + E) aikaa, O(V) muistia.',
        'L1 tarvitsee varatun R0:n. Rekursio siirtää L0:n R1:een ja vapauttaa R0:n L1:lle. owner liittää oikeaan solmuun vasemman solmun. Uusi seen estää oikean solmun toistuvan käsittelyn tässä haussa. Tämä on yksi lisäys, ei koko algoritmi.',
      ],
      matching: [
        'Paritus: toista jokaiselle vasemmalle solmulle',
        'Etsi mahdollisimman suuri paritus tunnetussa kaksijakoisessa Graph-verkossa. Annettu vasemman puolen lista on täydellinen ja kelvollinen.',
        'Odotettu O(V + E + L·E) aikaa; O(V) muistia; L = vasemman puolen koko.',
        'Aloita ilman pareja. Luo jokaiselle vasemmalle solmulle uusi seen ja kokeile edellisen oppitunnin lisäystä. Uusi hakutila sallii vanhojen parien siirron; pelkkä vapaan naapurin ahne valinta voisi ohittaa vastauksen 2.',
      ],
      residualCapacity: [
        'Virtaus: jäljellä oleva kapasiteetti',
        'Lue TRA-kaaren kapasiteetti ja vähennä jo lähetetty virtaus.',
        'O(1) aikaa ja muistia tälle kaarelle.',
        'Kapasiteetti 5 miinus virtaus 3 jättää eteenpäin 2. Lähetetyt 3 voidaan perua vastakkaisella jäännössiirtymällä. Se on virtauksen kirjanpitoa, ei uusi syötekaari. Tämä on yksi kaari, ei maksimivirtaus.',
      ],
      augmentFlow: [
        'Virtaus: lisää yhdelle tunnetulle polulle',
        'Lähetä pullonkaulan määrä polkua s → A → t. Alkuvirtaus on tässä nolla.',
        'Tunnetulle k-pituiselle polulle O(k) aikaa; jäännösmatriisi vie O(V²) muistia.',
        'Polun kapasiteetit ovat 3 ja 2, joten lähetä min(3,2) = 2. Vähennä 2 eteenpäin ja lisää 2 taakse perumista varten. Päivitykset eivät etsi polkuja eivätkä muodosta koko maksimivirtausalgoritmia. Matriisin indeksit ovat [s,A,t].',
      ],
      cancelFlow: [
        'Virtaus: peru aiempi valinta',
        'Peru yksi yksikkö kaarella A → X jäännössiirtymän X → A avulla.',
        'O(1) tälle yhdelle perumiselle.',
        'Syötteessä ei ole kaarta X → A. Sen jäännöskapasiteetti on aiemmin A → X -kaarella lähetetty määrä. Peruminen vapauttaa alkuperäisen kapasiteetin ja sallii virtauksen uudelleenohjauksen. Tämä näyttää perumisen, ei koko verkon ajoa.',
      ],
      maximumFlow: [
        'Maksimivirtaus: toista lisääviä polkuja',
        'Yhdistä jäännös-BFS, pullonkaulan haku ja päivitykset, kunnes s–t-polkua ei enää ole.',
        'Matriisi-BFS:n Edmonds–Karp: O(V² + E + V³·E) aikaa, O(V²) muistia. BFS tutkii enintään V² alkiota haussa.',
        'Opiskele ensin kolme edellistä virtausesimerkkiä. Koko tiedosto kuvaa oikeat TRA-solmut jäännösmatriisiin ja käyttää TRA LinkedQueue -jonoa. Tallennetut kapasiteetit ovat äärellisiä kokonaislukuja [0,10⁹]. Matriisin alkio yhdistää vastakkaisen kapasiteetin ja perumisen, joten se ei ole yksittäisen syötekaaren virtausarvo. Vain apumatriisi muuttuu; verkko säilyy. Lähde ja nielu ovat eri kelvolliset indeksit.',
      ],
      minimumCut: [
        'Minimileikkaus: jäännösverkossa saavutettava puoli',
        'Etsi maksimivirtauksen jälkeen s:stä jäännösverkossa saavutettavat solmut ja summaa puolelta poistuvat alkuperäiset kapasiteetit.',
        'Matriisi-BFS:n Edmonds–Karp: O(V² + E + V³·E) aikaa, O(V²) muistia. BFS tutkii enintään V² alkiota haussa.',
        'Lähteen puoli on {s}; leikkauksen kapasiteetti 3 + 2 = 5 on sama kuin maksimivirtaus. Leikkaus lasketaan alkuperäisistä kapasiteeteista, ei jäännösarvoista. Koko tiedosto sisältää edellisen algoritmin kokonaan. Toisella verkolla voi olla useita minimileikkauksia.',
      ],
      floydPath: [
        'Floyd: palauta polku',
        'Muista parannuksen yhteydessä ensimmäinen askel. Seuraa sitten askelia kohteeseen.',
        'Θ(V³ + E) aikaa ja O(V²) muistia Floydille; O(polun pituus) polun lukemiseen.',
        'Parannuksessa via-solmun kautta asetetaan next[from][to] = next[from][via]. Alla oleva metodi lukee taulukkoa. Puuttuva merkintä tarkoittaa saavuttamattomuutta. Koko tiedosto muodostaa molemmat taulukot ja hylkää negatiiviset syklit ennen polkujen lukemista.',
      ],
      taskPriority: [
        'Tehtävät: prioriteetti ja tasatilanne',
        'Järjestä Task-oliot ensin numeroprioriteetin, sitten nimen mukaan. Pienempi prioriteetti tulee ensin.',
        'offer: tasoitettu O(log n); poll: O(log n); jonon tallennus O(n).',
        'Task sisältää nimen ja prioriteetin; pieni luokka on koko tiedostossa. A:lla ja B:llä on prioriteetti 1, joten toinen vertailu asettaa A:n ensin. Vertailija määrää järjestyksen, ei lisäysjärjestys.',
      ],
      dfsCycle: [
        'DFS: miksi sykli pysähtyy',
        'Seuraa A → B → C → A; aluksi kaikki visited-arvot ovat false.',
        'Θ(V + E) koko läpikäynnille, O(V) kartta- ja pinomuistia.',
        'A merkitään ennen B:n kutsua. Kun C näkee A:n uudelleen, visited[A] on jo true eikä neljättä kutsua synny. C palaa, sitten B ja lopuksi A.',
      ],
      bfsDiscovery: [
        'BFS: miksi D lisätään jonoon vain kerran',
        'Käytä suunnattua vinoneliötä; aluksi kaikki solmut ovat WHITE.',
        'Θ(V + E) koko läpikäynnille, O(V) jonon muistia.',
        'B löytää D:n ensin ja merkitsee sen GREY ennen jonoon lisäämistä. Kun C näkee D:n, se on jo löydetty, vaikka sitä ei ole vielä poistettu jonosta. C ohittaa sen. D käsitellään kerran.',
      ],
    },
    contracts: {
      simpleDfs:
        'Syöte: solmu ei ole null; visited sisältää kaikki solmut, aluksi false. Tulostaa läpikäynnin ja muuttaa vain visited-karttaa.',
      prePost:
        'Syöte: solmu ei ole null; visited sisältää kaikki solmut, aluksi false. Tulostaa läpikäynnin ja muuttaa vain visited-karttaa.',
      dfsCycle:
        'Syöte: solmu ei ole null; visited sisältää kaikki solmut, aluksi false. Tulostaa läpikäynnin ja muuttaa vain visited-karttaa.',
      colourDfs:
        'Syöte: start ei ole null, kaikki värit WHITE. Tulostaa läpikäynnin ja muuttaa saavutettujen solmujen värejä; rakenne säilyy.',
      simpleBfs:
        'Syöte: start ei ole null, kaikki värit WHITE. Tulostaa läpikäynnin ja muuttaa saavutettujen solmujen värejä; rakenne säilyy.',
      bfsDiscovery:
        'Syöte: start ei ole null, kaikki värit WHITE. Tulostaa läpikäynnin ja muuttaa saavutettujen solmujen värejä; rakenne säilyy.',
      dfsTimes:
        'Nollaa laskuri, tyhjennä aikakartat ja aseta WHITE ennen läpikäyntiä. Päivittää ajat/värit ja tulostaa tulokset.',
      edgeTypes:
        'Nollaa laskuri, tyhjennä aikakartat ja aseta WHITE ennen läpikäyntiä. Päivittää ajat/värit ja tulostaa tulokset.',
      bfsDistance:
        'Syöte: start ei ole null. Palauttaa uuden etäisyyskartan: start = 0; saavuttamattomat puuttuvat. Verkko säilyy.',
      bfsPath:
        'Vanhempikartta saadaan edeltävästä läpikäynnistä. Palauttaa polun nimet tai tyhjän listan saavuttamattomalle; lukeminen ei muuta karttaa.',
      dijkstraPath:
        'Vanhempikartta saadaan edeltävästä läpikäynnistä. Palauttaa polun nimet tai tyhjän listan saavuttamattomalle; lukeminen ei muuta karttaa.',
      fullDfs:
        'Alusta värit kerran ennen ulkosilmukkaa. Laskee suuntaamattomat komponentit ja muuttaa värejä; kaaret säilyvät.',
      undirectedCycle:
        'Syöte: WHITE ennen juurisilmukkaa. Palauttaa, onko sykliä; aikainen paluu voi jättää värit osittain päivitettyiksi.',
      directedCycle:
        'Syöte: WHITE ennen juurisilmukkaa. Palauttaa, onko sykliä; aikainen paluu voi jättää värit osittain päivitettyiksi.',
      topologicalOrder:
        'Käytä DiGraphia, WHITE-värejä ja tyhjää POST-listaa. Valmiin POSTin kääntö antaa järjestyksen; sykli hylkää sen. Muuttaa värejä ja listaa.',
      treePre: 'Syöte: binäärialipuun juuri tai null. Tulostaa valitun järjestyksen; puu säilyy.',
      treeIn: 'Syöte: binäärialipuun juuri tai null. Tulostaa valitun järjestyksen; puu säilyy.',
      treePost: 'Syöte: binäärialipuun juuri tai null. Tulostaa valitun järjestyksen; puu säilyy.',
      treeSize:
        'Syöte: binäärialipuun juuri tai null. Palauttaa solmumäärän, tyhjälle 0; puu säilyy.',
      treeHeight:
        'Syöte: binäärialipuun juuri tai null. Palauttaa korkeuden kaarina: tyhjä = -1, lehti = 0; puu säilyy.',
      simpleDijkstra:
        'Aloitussolmu kuuluu DiGraphiin. Painot ovat äärellisiä ja ei-negatiivisia. Palauttaa etäisyydet, saavuttamattomalle Infinity; verkko säilyy.',
      graphMatrix:
        'Luettele jokainen DiGraphin oikea Vertex kerran. Palauttaa uuden kaarimatriisin; puuttuvat ovat Infinity. Verkko säilyy.',
      simpleFloyd:
        'Syöte: neliömuotoinen kaarietäisyysmatriisi. Päivittää sen paikallaan; negatiivinen sykli hylkää tuloksen. TRA-verkko säilyy.',
      floydPath:
        'Lue next vasta onnistuneen Floydin jälkeen. Indeksien on oltava kelvollisia; saavuttamaton palauttaa tyhjän listan. Lukeminen ei muuta taulukoita.',
      prim: 'Syöte: suuntaamaton Graph, äärelliset pysyvät painot. Palauttaa metsän oikeat kaaret; muuttaa värejä, säilyttää kaaret ja painot.',
      disjointSets:
        'Aluksi jokainen solmu osoittaa itseensä parent-kartassa. find lukee edustajan; union yhdistää joukot ja kertoo onnistumisen, muuttaen parentia.',
      kruskal:
        'Syöte: suuntaamaton Graph äärellisillä painoilla. Palauttaa metsän oikeat kaaret; verkko säilyy. Käyttää edeltävää yksinkertaista DSU:ta.',
      lowValues:
        'Käytä suuntaamatonta Graphia. Nollaa laskuri ja tyhjennä tuloskartat/-joukot ennen juurisilmukkaa. Muuttaa vain aputietoja.',
      bridges:
        'Käytä suuntaamatonta Graphia. Nollaa laskuri ja tyhjennä tuloskartat/-joukot ennen juurisilmukkaa. Muuttaa vain aputietoja.',
      articulation:
        'Käytä suuntaamatonta Graphia. Nollaa laskuri ja tyhjennä tuloskartat/-joukot ennen juurisilmukkaa. Muuttaa vain aputietoja.',
      matchingStep:
        'Oletetaan tunnettu kelvollinen kaksijako. owner kuvaa oikean vasempaan; seen on tyhjä ennen yritystä. Onnistuminen lisää parin, ehkä siirtäen vanhoja pareja.',
      matching:
        'Oletetaan tunnettu kelvollinen kaksijako. owner kuvaa oikean vasempaan; seen on tyhjä ennen yritystä. Onnistuminen lisää parin, ehkä siirtäen vanhoja pareja.',
      maximumFlow:
        'Kelvolliset eri lähde/nieluindeksit; tallennetut kokonaiskapasiteetit [0,10⁹]. Palauttaa virtauksen tai leikkauksen päivitettyään vain jäännösmatriisin; verkko säilyy.',
      minimumCut:
        'Kelvolliset eri lähde/nieluindeksit; tallennetut kokonaiskapasiteetit [0,10⁹]. Palauttaa virtauksen tai leikkauksen päivitettyään vain jäännösmatriisin; verkko säilyy.',
    },
    traces: {
      dfsCycle: [
        'Saavu A:han ja merkitse se ennen laskeutumista; aktiiviset kutsut ovat A → B → C.',
        'C tutkii kaaren C → A. A:ssa on jo käyty, joten naapuri ohitetaan.',
        'Uutta kutsua ei synny. C valmistuu, sitten B ja A; kukin solmu osallistui kerran.',
      ],
      bfsDiscovery: [
        'A:n poistamisen jälkeen jono = [B, C]. Molemmat on löydetty.',
        'Poista B: löydä D ja merkitse ennen lisäämistä. Jono = [C, D].',
        'Poista C: D on jo GREY, joten ohita se. Jono pysyy [D].',
        'Poista D: käsittele naapurit ja merkitse BLACK. Jono = [].',
      ],
      fullDfs: [
        'Ensimmäinen juuri A vierailee A:ssa ja B:ssä.',
        'C on yhä WHITE, joten ulkosilmukka aloittaa siitä uuden komponentin.',
        'D on toinen WHITE-juuri ja saavuttaa E:n. Yhteensä 3 komponenttia.',
      ],
    },
    traceTitle: 'Seuraa tilan muutoksia',
    setupTitle: 'Lataa ja suorita',
  },
}
