import supplement from './handout.en.js'
import { extendDictionary } from './extend.js'
import { sortingTranslations } from './sorting.js'
import { complexityQuizTranslations } from './complexityQuiz.js'
import { heapTranslations } from './heap.js'
import { recursionTranslations } from './recursion.js'

const base = {
  recursion: recursionTranslations.en,
  examples: recursionTranslations.en.examples,
  heap: heapTranslations.en,
  complexityQuiz: complexityQuizTranslations.en,
  sorting: sortingTranslations.en,
  ui: {
    language: 'Language',
    topics: 'Topics',
    examples: 'React + Java examples',
    footer: 'Created by',
    courseCredit: 'Based on UEF Data Structures and Algorithms II course materials.',
    aiCredit: 'Developed with assistance from OpenAI Codex.',
    description: 'DSA2 Visual Lab — interactive learning of data structures and algorithms',
    back: '← Back',
    next: 'Next step →',
    forward: 'Forward →',
    reset: 'Reset',
    play: '▶ Play',
    pause: 'Pause',
    step: 'Step',
    result: 'Result',
    start: 'Start',
    speed: 'Speed',
    empty: 'empty',
    order: 'Order',
    graph: 'Interactive graph',
    tree: 'Binary tree traversal',
    idle: 'not visited',
    visited: 'visited',
    current: 'current',
    dfsStack: 'DFS: call stack',
    bfsQueue: 'BFS: queue',
    dfsHint: 'PRE = enter a vertex. POST = finish its entire subtree/branch and return.',
    bfsHint:
      'In an unweighted graph, the first distance found by BFS is already the shortest in number of edges.',
    adjacency: 'Show the adjacency list of this graph',
    root: 'Root',
    left: 'Left',
    right: 'Right',
    inputN: 'Set n =',
    name: 'Name',
    example: 'Example',
    operations: 'Operations for n=',
    complexityHint:
      'Big O does not give an exact operation count. These numbers illustrate how quickly the amount of work grows.',
    algorithm: 'Algorithm',
    average: 'Average',
    idea: 'Idea',
    goDfs: 'Explore DFS →',
    goBfs: 'Explore BFS →',
  },
  groups: ['Fundamentals', 'Linear structures', 'Trees', 'Algorithms', 'Graphs', 'Java'],
  topics: [
    ['DSA2 roadmap', 'What to learn and why'],
    ['Time complexity', 'O(1), O(log n), O(n), O(n log n), O(n²)'],
    recursionTranslations.en.topic,
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
    recursionTranslations.en.roadmap,
    ['Trees', 'Recursion and the three main traversal orders.'],
    ['Sorting', 'Why different approaches have different complexities.'],
    ['Graphs', 'Graph representation, DFS, BFS and their applications.'],
  ],
  pages: {
    recursion: recursionTranslations.en.page,
    overview: {
      title: 'Understand algorithms instead of memorising code',
      intro:
        'Use this site as a learning roadmap: start with the idea, explore a visualisation, then study Java code and common mistakes.',
      cards: [
        [
          'The central idea',
          'A data structure answers “how do we store it?”, an algorithm answers “how do we traverse, find or change it?”, and complexity analysis asks “how much work will it take as n grows?”.',
        ],
        [
          'Special focus: graphs',
          'Practise running an algorithm in your head: where you are, which vertices have been discovered/visited, what is on the stack or in the queue, and when PRE and POST events occur.',
        ],
      ],
    },
    complexity: {
      title: 'Time complexity',
      intro:
        'Compare how quickly the amount of work grows with the input size, rather than comparing seconds.',
      cards: [
        [
          'How to read loops',
          [
            'One full loop over n elements → usually O(n).',
            'Two independent consecutive loops → O(n + n) = O(n).',
            'A nested loop with n × n iterations → O(n²).',
            'Halving the problem size at each step → O(log n).',
          ],
        ],
      ],
    },
    'sorted-lists': {
      title: 'Sorted lists and two pointers',
      intro:
        'When both lists are already sorted, move through them from left to right instead of sorting the result again.',
      cards: [
        [
          'Union of two sorted lists',
          'The idea resembles the merge phase of merge sort. Compare the current elements and advance the pointer with the smaller value. When values are equal, add the value once and advance both pointers.',
        ],
        ['Complexity', 'O(n + m), because each pointer only moves forward.'],
        [
          'Why while uses &&',
          'The main loop continues while both lists have a current element. Using `||` can make one index go out of bounds. After the main loop, append the remaining tail of either list.',
        ],
      ],
    },
    'sets-maps': {
      title: 'Set, Map and hashing',
      intro:
        'Hash-based structures provide fast lookup, but require a correct definition of object equality.',
      cards: [
        [
          'Set',
          'Stores unique elements. Useful for “have I seen this before?” checks, such as `visited` in a graph.',
        ],
        [
          'Map',
          'Associates a key with a value: `vertex → distance`, `vertex → parent`, `id → object`.',
        ],
        [
          'equals() and hashCode()',
          'Objects that are equal according to `equals` must have the same `hashCode`. Otherwise, HashSet/HashMap may behave incorrectly.',
        ],
      ],
    },
    trees: {
      title: 'Preorder, inorder and postorder',
      intro:
        'Read and traverse a binary tree using TRA BTree and BTreeNode. PRE, IN and POST differ in when they process the current node.',
      cards: [
        ['PRE', 'Root → Left → Right. Process the node immediately on entry.'],
        ['IN', 'Left → Root → Right. For a BST, this produces keys in ascending order.'],
        ['POST', 'Left → Right → Root. Process the node only after its children.'],
      ],
    },
    heap: {
      title: 'Heap and PriorityQueue',
      intro:
        'A heap provides fast access to the highest-priority element. The Java example uses fi.uef.cs.tra.PriorityQueue; the drawing explains min-heap operations.',
      cards: [
        [
          'Min-heap',
          'Each parent is ≤ its children; the minimum is at the root. peek is O(1), heap repair for insertion/removal O(log n). Including occasional array growth, offer is amortised O(log n); poll is O(log n).',
        ],
        [
          'When to use it',
          'Priority-based task queues, Dijkstra, and selecting the next minimum/maximum without sorting everything.',
        ],
      ],
    },
    sorting: {
      title: 'Sorting',
      intro:
        'Choose one of four algorithms and follow the sort step by step or automatically. Each starts with the same array so you can compare how they work.',
      cards: [],
    },
    'graph-basics': {
      title: 'What is a graph?',
      intro:
        'A graph consists of vertices and edges. In this lesson, Graph and DiGraph from the TRA library store them as Vertex and Edge objects.',
      cards: [
        [
          'Undirected graph — Graph',
          'An edge A—B makes A and B neighbours of each other. With `Graph`, add it once using `a.addEdge(b)`; the library supplies both neighbour directions.',
        ],
        [
          'Directed graph — DiGraph',
          'An edge A→B has a direction. `a.addEdge(b)` creates it; `b.addEdge(a)` would create a separate reverse edge.',
        ],
        [
          'Read the neighbours',
          'Use `for (Vertex next : v.neighbors())` to enumerate outgoing neighbours. The iterable is not automatically sorted by label. `graph.vertices()` includes isolated vertices too.',
        ],
        [
          'BFS — breadth-first search',
          'BFS visits the starting vertex’s neighbours first, then the next layer of vertices. It uses a queue and finds shortest paths by number of edges in an unweighted graph.',
        ],
        [
          'DFS — depth-first search',
          'DFS follows one branch as deeply as possible, then returns to explore other branches. It uses recursion or a stack. Visited marks prevent processing the same vertex again.',
        ],
      ],
    },
    'graph-dfs': {
      title: 'DFS: depth-first search + PRE/POST',
      intro:
        'DFS goes as deep as possible, then backtracks. Recursive calls form an implicit stack.',
      cards: [
        [
          'The key idea behind PRE and POST',
          '`PRE(v)` occurs once, when we first enter `v`. DFS then explores its neighbours. `POST(v)` occurs only when no unexplored branches remain from `v`.',
        ],
        [
          'How to picture recursion',
          'Every active `dfs(v)` call is on the stack. When `dfs(w)` is called, `dfs(v)` waits. Once `w` finishes, the algorithm returns to `v` and continues with the next neighbour.',
        ],
      ],
    },
    'graph-bfs': {
      title: 'BFS: breadth-first search',
      intro:
        'BFS spreads in layers: distance 0, then all vertices at distance 1, then distance 2, and so on.',
      cards: [
        [
          'Why visited is set when enqueuing',
          'Waiting until removal from the queue could let several neighbours enqueue the same vertex. Mark it discovered/visited as soon as it is added.',
        ],
      ],
    },
    'graph-apps': {
      title: 'What can you build with DFS/BFS?',
      intro:
        'Apply DFS/BFS to real TRA Graph/DiGraph objects: paths, components, cycles and ordering.',
      cards: [
        [
          'Connected components',
          'For an undirected TRA `Graph`, reset WHITE once, then scan `vertices()`. Start DFS/BFS at each WHITE vertex: everything newly reached belongs to that component. An isolated vertex forms its own component; the empty graph has none.',
        ],
        [
          'Shortest unweighted path',
          'Keep `parent` when discovering a TRA `Vertex`. Follow parents from target to start, then reverse. DFS gives a found path; BFS gives a shortest path by edge count. An unreachable target returns an empty path; start → start has zero edges.',
        ],
        [
          'Cycle detection',
          'In `DiGraph`, an outgoing edge to a GREY ancestor proves a cycle, including a self-loop. In `Graph`, skip the same physical parent `Edge` viewed backwards. Scan every root to conclude the whole graph is acyclic.',
        ],
        [
          'Topological order',
          'For a `DiGraph`, run full DFS and check cycles. After every root finishes successfully, reverse POST. A cycle anywhere rejects the entire order; isolated vertices are included. Several valid orders may exist.',
        ],
      ],
    },
    'java-tools': {
      title: 'Java tools you often meet in DSA2',
      intro: 'These tools make data structure implementations easier to work with.',
      cards: [
        ['Iterator', 'Traverse a collection without knowing its internal representation.'],
        ['Comparable', 'An object defines its own natural order through `compareTo`.'],
        [
          'Comparator',
          'An external comparison strategy lets you sort the same type in different ways.',
        ],
        [
          'Generics',
          '`List<T>`, `Graph<V>` and custom structures work with different types safely.',
        ],
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
  sortingIdeas: [
    'Swap adjacent elements',
    'Insert into an already sorted prefix',
    'Divide and merge',
    'Pivot and partition',
  ],
  messages: {
    dfsEnter:
      'Enter {v}. This is a PRE event: the vertex is discovered before exploring its neighbours.',
    dfsSkip: '{next} has already been visited — skip edge {v}–{next}.',
    dfsEdge: 'From {v}, examine {next}. It has not been visited — go deeper.',
    dfsExit: 'All neighbours of {v} have been processed. This is a POST event: leave {v}.',
    bfsStart: 'Mark {start} as visited as soon as it is added to the queue.',
    bfsProcessed: 'All neighbours of {v} have been examined. Processing this vertex is complete.',
    bfsDequeue: 'Remove {v} from the front of the queue. Now examine all its neighbours.',
    bfsSkip: '{next} has already been discovered — do not enqueue it again.',
    bfsEnqueue:
      'Discover {next} from {v}: distance = {distance}. Add {next} to the back of the queue.',
    sortStart: 'Initial array.',
    sortCompare: 'Compare {a} and {b}.',
    sortSwap: 'The left element is larger — swap them.',
    sortDone: 'Done: the array is sorted.',
    treePre: 'PRE: record {v} immediately on entry.',
    treeIn: 'IN: the left subtree of {v} is complete. Record {v}, then go right.',
    treePost: 'POST: both subtrees of {v} are complete. Now record {v}.',
  },
  code: {
    post: 'POST: all neighbours have been processed',
    takeA: 'take a',
    takeB: 'take b',
    takeOnce: 'take once',
  },
}

export default extendDictionary(base, supplement)
