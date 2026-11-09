import supplement from './handout.en.js'
import { extendDictionary } from './extend.js'
import { sortingTranslations } from './sorting.js'

const base = {
  sorting: sortingTranslations.en,
  ui: {
    language: 'Language', topics: 'Topics', examples: 'React + Java examples',
    footer: 'Learning project • React/Vite • static site for GitHub Pages',
    description: 'DSA2 Visual Lab — interactive learning of data structures and algorithms',
    back: '← Back', next: 'Next step →', forward: 'Forward →', reset: 'Reset',
    play: '▶ Play', pause: 'Pause', step: 'Step', result: 'Result',
    start: 'Start', speed: 'Speed', empty: 'empty', order: 'Order',
    graph: 'Interactive graph', tree: 'Binary tree traversal',
    idle: 'not visited', visited: 'visited', current: 'current',
    dfsStack: 'DFS: call stack', bfsQueue: 'BFS: queue',
    dfsHint: 'PRE = enter a vertex. POST = finish its entire subtree/branch and return.',
    bfsHint: 'In an unweighted graph, the first distance found by BFS is already the shortest in number of edges.',
    adjacency: 'Show the adjacency list of this graph',
    root: 'Root', left: 'Left', right: 'Right',
    inputN: 'Set n =', name: 'Name', example: 'Example', operations: 'Operations for n=',
    complexityHint: 'Big O does not give an exact operation count. These numbers illustrate how quickly the amount of work grows.',
    algorithm: 'Algorithm', average: 'Average', idea: 'Idea',
    goDfs: 'Explore DFS →', goBfs: 'Explore BFS →',
  },
  groups: ['Fundamentals', 'Linear structures', 'Trees', 'Algorithms', 'Graphs', 'Java'],
  topics: [
    ['DSA2 roadmap', 'What to learn and why'],
    ['Time complexity', 'O(1), O(log n), O(n), O(n log n), O(n²)'],
    ['Sorted lists', 'Two pointers, union without sort/set/map'],
    ['Set, Map and hashing', 'equals/hashCode, uniqueness, lookup'],
    ['Trees and traversals', 'Preorder, inorder, postorder'],
    ['Heap and PriorityQueue', 'Minimum/maximum, insertion, removal'],
    ['Sorting', 'Bubble, insertion, merge, quick'],
    ['Graph fundamentals', 'Vertices, edges, adjacency list'],
    ['DFS + pre/post', 'Depth, recursion, stack, entry/exit events'],
    ['BFS', 'Breadth, queue, shortest unweighted paths'],
    ['Graph problems', 'Components, cycles, topological order'],
    ['Java tools for DSA2', 'Iterator, Comparable, Comparator, generics'],
  ],
  roadmap: [
    ['Complexity', 'Learn to see the cost of loops and operations.'],
    ['Linear structures', 'Two pointers, lists, sets and maps.'],
    ['Trees', 'Recursion and the three main traversal orders.'],
    ['Sorting', 'Why different approaches have different complexities.'],
    ['Graphs', 'Graph representation, DFS, BFS and their applications.'],
  ],
  pages: {
    overview: {
      title: 'Understand algorithms instead of memorising code',
      intro: 'Use this site as a learning roadmap: start with the idea, explore a visualisation, then study Java code and common mistakes.',
      cards: [
        ['The central idea', 'A data structure answers “how do we store it?”, an algorithm answers “how do we traverse, find or change it?”, and complexity analysis asks “how much work will it take as n grows?”.'],
        ['Special focus: graphs', 'Practise running an algorithm in your head: where you are, which vertices have been discovered/visited, what is on the stack or in the queue, and when PRE and POST events occur.'],
      ],
    },
    complexity: {
      title: 'Time complexity', intro: 'Compare how quickly the amount of work grows with the input size, rather than comparing seconds.',
      cards: [['How to read loops', [
        'One full loop over n elements → usually O(n).',
        'Two independent consecutive loops → O(n + n) = O(n).',
        'A nested loop with n × n iterations → O(n²).',
        'Halving the problem size at each step → O(log n).',
      ]]],
    },
    'sorted-lists': {
      title: 'Sorted lists and two pointers', intro: 'When both lists are already sorted, move through them from left to right instead of sorting the result again.',
      cards: [
        ['Union of two sorted lists', 'The idea resembles the merge phase of merge sort. Compare the current elements and advance the pointer with the smaller value. When values are equal, add the value once and advance both pointers.'],
        ['Complexity', 'O(n + m), because each pointer only moves forward.'],
        ['Why while uses &&', 'The main loop continues while both lists have a current element. Using `||` can make one index go out of bounds. After the main loop, append the remaining tail of either list.'],
      ],
    },
    'sets-maps': {
      title: 'Set, Map and hashing', intro: 'Hash-based structures provide fast lookup, but require a correct definition of object equality.',
      cards: [
        ['Set', 'Stores unique elements. Useful for “have I seen this before?” checks, such as `visited` in a graph.'],
        ['Map', 'Associates a key with a value: `vertex → distance`, `vertex → parent`, `id → object`.'],
        ['equals() and hashCode()', 'Objects that are equal according to `equals` must have the same `hashCode`. Otherwise, HashSet/HashMap may behave incorrectly.'],
      ],
    },
    trees: {
      title: 'Preorder, inorder and postorder', intro: 'The difference is when the current node is processed relative to its children.',
      cards: [
        ['PRE', 'Root → Left → Right. Process the node immediately on entry.'],
        ['IN', 'Left → Root → Right. For a BST, this produces keys in ascending order.'],
        ['POST', 'Left → Right → Root. Process the node only after its children.'],
      ],
    },
    heap: {
      title: 'Heap and PriorityQueue', intro: 'A heap guarantees fast access to the element with the highest priority without keeping all elements in sorted order.',
      cards: [
        ['Min-heap', 'Each parent has a value ≤ the values of its children. The minimum is at the root and can be accessed in O(1). Insertion and root removal require O(log n) work to restore the heap property.'],
        ['When to use it', 'Priority-based task queues, Dijkstra, and selecting the next minimum/maximum without sorting everything.'],
      ],
    },
    sorting: {
      title: 'Sorting', intro: 'Choose one of four algorithms and follow the sort step by step or automatically. Each starts with the same array so you can compare how they work.', cards: [],
    },
    'graph-basics': {
      title: 'What is a graph?', intro: 'A graph consists of vertices and edges between them. Focus on the neighbour relationships represented by the drawing.',
      cards: [
        ['Undirected graph', 'An edge A—B means that A is a neighbour of B and B is a neighbour of A.'],
        ['Directed graph', 'An edge A→B has a direction; a reverse connection may not exist.'],
        ['Adjacency list', 'For sparse graphs, this is usually more convenient than an adjacency matrix: it stores only the edges that actually exist.'],
      ],
    },
    'graph-dfs': {
      title: 'DFS: depth-first search + PRE/POST', intro: 'DFS goes as deep as possible, then backtracks. Recursive calls form an implicit stack.',
      cards: [
        ['The key idea behind PRE and POST', '`PRE(v)` occurs once, when we first enter `v`. DFS then explores its neighbours. `POST(v)` occurs only when no unexplored branches remain from `v`.'],
        ['How to picture recursion', 'Every active `dfs(v)` call is on the stack. When `dfs(w)` is called, `dfs(v)` waits. Once `w` finishes, the algorithm returns to `v` and continues with the next neighbour.'],
      ],
    },
    'graph-bfs': {
      title: 'BFS: breadth-first search', intro: 'BFS spreads in layers: distance 0, then all vertices at distance 1, then distance 2, and so on.',
      cards: [['Why visited is set when enqueuing', 'Waiting until removal from the queue could let several neighbours enqueue the same vertex. Mark it discovered/visited as soon as it is added.']],
    },
    'graph-apps': {
      title: 'What can you build with DFS/BFS?', intro: 'Many problems become easier once you understand the traversal itself.',
      cards: [
        ['Connected components', 'Start DFS/BFS from an unvisited vertex. Everything it reaches is one component. Repeat with another unvisited vertex.'],
        ['Shortest unweighted path', 'Use BFS with `parent` and `distance`. After reaching the target, reconstruct the path by following parent links backwards.'],
        ['Cycle detection', 'In an undirected graph, DFS must distinguish an edge back to the parent from an edge to another visited vertex.'],
        ['Topological order', 'Only for DAGs. With DFS, collect vertices in POST order, then reverse the result.'],
      ],
    },
    'java-tools': {
      title: 'Java tools you often meet in DSA2', intro: 'These tools make data structure implementations easier to work with.',
      cards: [
        ['Iterator', 'Traverse a collection without knowing its internal representation.'],
        ['Comparable', 'An object defines its own natural order through `compareTo`.'],
        ['Comparator', 'An external comparison strategy lets you sort the same type in different ways.'],
        ['Generics', '`List<T>`, `Graph<V>` and custom structures work with different types safely.'],
      ],
    },
  },
  complexityRows: [
    ['O(1)', 'Constant', 'ArrayList access by index'],
    ['O(log n)', 'Logarithmic', 'Binary search'],
    ['O(n)', 'Linear', 'One pass through a list'],
    ['O(n log n)', 'Linearithmic', 'Merge sort'],
    ['O(n²)', 'Quadratic', 'Two nested loops'],
  ],
  sortingIdeas: ['Swap adjacent elements', 'Insert into an already sorted prefix', 'Divide and merge', 'Pivot and partition'],
  messages: {
    dfsEnter: 'Enter {v}. This is a PRE event: the vertex is discovered before exploring its neighbours.',
    dfsSkip: '{next} has already been visited — skip edge {v}–{next}.',
    dfsEdge: 'From {v}, examine {next}. It has not been visited — go deeper.',
    dfsExit: 'All neighbours of {v} have been processed. This is a POST event: leave {v}.',
    bfsStart: 'Mark {start} as visited as soon as it is added to the queue.',
    bfsDequeue: 'Remove {v} from the front of the queue. Now examine all its neighbours.',
    bfsSkip: '{next} has already been discovered — do not enqueue it again.',
    bfsEnqueue: 'Discover {next} from {v}: distance = {distance}. Add {next} to the back of the queue.',
    sortStart: 'Initial array.', sortCompare: 'Compare {a} and {b}.',
    sortSwap: 'The left element is larger — swap them.', sortDone: 'Done: the array is sorted.',
    treePre: 'PRE: record {v} immediately on entry.',
    treeIn: 'IN: the left subtree of {v} is complete. Record {v}, then go right.',
    treePost: 'POST: both subtrees of {v} are complete. Now record {v}.',
  },
  code: { post: 'POST: all neighbours have been processed', takeA: 'take a', takeB: 'take b', takeOnce: 'take once' },
}

export default extendDictionary(base, supplement)
