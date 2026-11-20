export const traJavaExampleTranslations = {
  en: {
    title: 'Additional Java examples with the TRA library',
    primaryTitle: 'Java examples with the TRA library',
    primaryIntro:
      'The main examples use fi.uef.cs.tra on JDK 11+. Download the ZIP with the sources and traj.jar, then extract them into one folder.',
    intro:
      'Ready-to-run examples for JDK 11+ using fi.uef.cs.tra from the supplied traj.jar. Download the ZIP with the examples and the library, then extract it into one folder.',
    basicOrder:
      'Neighbour lists follow the supplied JAR’s native order. No label sorting is implied. Vertex labels can repeat; maps use vertex identity for separate data.',
    download: 'Download TRA examples + traj.jar (.zip)',
    setup:
      'Run each command from the extracted folder, with the .java file next to traj.jar. In an IDE, add traj.jar as a library. Each example can run independently.',
    order:
      'Short examples use the supplied JAR’s native order; TraTraversalExample explicitly prepares lists sorted by stable ID. Another neighbour order can change DFS PRE/POST and parents; BFS still finds shortest distances. Both Graph and DiGraph are supported. In the complexity formulas, R is the number of reachable vertices and A_R is the number of neighbour entries examined from them.',
    examples: {
      graph: [
        'Create a graph and use Vertex',
        'Create the A/B/C/D graph from the drawing, read its outgoing neighbours and edge weights, and change vertex colours. D is isolated. The separate U—V example shows how Graph supplies both neighbour directions with one insertion.',
        'Enumerating vertices takes Θ(V); enumerating a vertex’s neighbours takes Θ(deg(v)). The printed neighbour list uses O(deg(v)) additional space.',
      ],
      graphData: [
        'TRA vertices as Map keys',
        'Store each vertex’s outgoing-neighbour count in Map<Vertex, Integer>. Graph topology stays in TRA; IdentityHashMap keeps two vertices named X separate. Iterate vertices() for display instead of assuming a Map order.',
        'Expected Θ(V + E) time for all counts and O(V) additional map space, using expected constant-time identity-map operations. Graph storage and printed strings are separate.',
      ],
      dfs: [
        'Short colour DFS: native TRA neighbour order',
        'Mark GREY before recursion, record PRE on entry, continue the caller’s neighbour loop after a child returns, then record POST and mark BLACK. Choose the reachable part or the whole graph. In a directed graph, forest roots do not identify strongly connected components.',
        'Full traversal: Θ(V + E) time and O(V) additional space for results and stack. Reachable-only mode: Θ(V + R + A_R), including the initial WHITE reset; graph storage is excluded.',
      ],
      bfs: [
        'BFS A–H: TRA queue, distances and a path',
        'Use LinkedQueue<Vertex>, mark GREY before enqueueing, and mark BLACK after examining neighbours. Parent links restore an unweighted shortest path. Unreachable distance is -1 and its path is empty.',
        'Θ(V + R + A_R) time, including initial colours and distances; O(V) additional space for maps, results and queue. For a full reachable graph, Θ(V + E).',
      ],
      recursiveDfs: [
        'Basic DFS: an owned iterator and visited',
        'Vertex and neighborIterator(), a separate identity-keyed visited map, PRE/POST and parent continuation. Leaves graph colours unchanged. Native order for the teaching fixtures is checked against the supplied JAR.',
        'Expected Θ(V + E) for full traversal, Θ(V + R + Aᵣ) for reachable traversal including visited setup; O(V) space assuming expected O(1) map operations.',
      ],
      traversal: [
        'DFS/BFS: colours, times and Edge classes',
        'Graph/DiGraph, Vertex colours, parents, tin/tout, physical Edge objects, LinkedQueue and full forests. Neighbour order is prepared explicitly by stable ID; labels may repeat.',
        'Core after preparation: Θ(V + E); preparation O(V + E + Σ d(v) log(d(v) + 1)). Additional space O(V + E), including ordered lists and edge results.',
      ],
      tree: [
        'Binary and general TRA trees',
        'Build the same A–G tree as the drawing, collect PRE/IN/POST, count nodes and height. Also construct a general Tree whose root R has three children X/Y/Z. Try example("empty"), example("single") and example("chain").',
        'Each traversal, size or height call takes Θ(n) time. Nonempty stack O(h + 1), empty O(1); output lists add O(n). h counts edges, with empty −1 and leaf 0.',
      ],
      priorityQueue: [
        'TRA PriorityQueue: peek, poll and duplicates',
        'Use the initial teaching values, add another 3 and compare peek with poll. Empty results are null. A capacity-plus-comparator constructor orders tasks by priority, then ID. Iteration is not used as a sorted preview.',
        'peek O(1); offer amortised O(log n), poll O(log n); storage O(n). The priorityOrder preview copies and polls: O(n log n) time and O(n) space.',
      ],
      components: [
        'Graph: components and undirected cycles',
        'Full DFS groups the same 0—1, isolated 2, 3—4 graph as the drawing. A separate cycle check skips the same physical parent Edge, so a single edge is not a cycle; a triangle is. Each run resets colours once and preserves topology.',
        'Each full operation takes Θ(V + E) time and O(V) additional space, including component lists and the recursion stack. Empty input returns no components and no cycle.',
      ],
      dijkstra: [
        'Dijkstra: TRA Edge weights and a minimum queue',
        'Graph/DiGraph, identity-keyed distances and parents, and TRA PriorityQueue with immutable entries. From A the best route to D is A → C → B → D, weight 4; E is unreachable. The old B:10 and D:9 entries are skipped. Negative or non-finite weights anywhere in the input are rejected.',
        'O(V + E log(E + 1)) time and O(V + E) additional space for this lazy queue, including input validation. A path query takes O(path length). No decrease-key or mutable Vertex priority is assumed.',
      ],
      floyd: [
        'Floyd–Warshall: a matrix derived from TRA',
        'Assign external identity-based indices to vertices and read real outgoing Edge weights. Keep a next-hop matrix to reconstruct paths. A → B → C costs 5 − 2 = 3; D is isolated. A negative cycle anywhere rejects the whole result, including cycles in disconnected parts; no partial matrix is returned.',
        'O(V³ + E) time, including matrix construction, and O(V²) additional space. A path query takes O(path length). Empty graph gives an empty result; a source-to-itself path has zero edges.',
      ],
      mst: [
        'Prim and Kruskal: real TRA edges and a spanning forest',
        'Both methods accept an undirected Graph and return actual chosen Edge references, vertices, component count and total weight. Prim uses TRA PriorityQueue and a new root per component; Kruskal sorts a copy of Graph.edges() and joins external identity-indexed sets. The connected example weighs 4; adding isolated E and F—G:-2 gives three components and weight 2.',
        'Each method: O(V + E log(E + 1)) time and O(V + E) additional space, assuming expected O(1) identity-map/set access. Finite negative/zero weights and ties are allowed; NaN and infinities are rejected. Accumulation uses double.',
      ],
      cuts: [
        'Articulation vertices and bridges: TRA tin/low DFS',
        'Full Graph traversal with identity-keyed tin/low values and the physical parent Edge exception. The 0–1–2 triangle with tail 1–3–4 and isolated 5 returns cuts 1/3 and actual bridge edges 1–3/3–4. Root children use a separate rule. Input weights are ignored.',
        'Expected O(V + E) time and O(V) additional space, including recursion and outputs. Console bridge-label sorting is separate presentation work. Foreign time queries are rejected; each run preserves input fields and earlier results.',
      ],
      matching: [
        'Maximum bipartite matching: real Vertex partners and Edge pairs',
        'Supply a distinct member list for the left side; the right side is its graph complement. Validate every edge crosses the partition, then find alternating augmenting paths with fresh seen state per left root. L0 moves from R0 to R1 so L1 can take R0; isolated R2 remains unmatched. Weights do not affect cardinality.',
        'Expected O(V + E + L·E) time and O(V) additional space, L = left-side size. Read-only lists contain actual input objects; partnerOf returns null for an unmatched member and rejects a foreign vertex.',
      ],
      flow: [
        'Edmonds–Karp: TRA capacities and paired residual entries',
        'DiGraph with distinct member source/sink. Stored Edge weights must be finite integers from 0 to 1,000,000,000; validated capacities and flows use long. Each actual Edge has its own forward/cancellation pair, so opposite input arcs stay independent. The second example cancels a→x through x→a, which is not an input edge.',
        'Expected O(V + E + V·E²) time and O(V + E) additional space. TRA LinkedQueue performs BFS. Results include per-Edge flow, residual source side and an equal-capacity minimum cut. Invalid capacities, terminals and foreign Edge queries are rejected.',
      ],
      topological: [
        'DiGraph: reverse POST only after a full cycle check',
        'Build the same DAG as the drawing, including isolated 4. Full DFS rejects a GREY neighbour, including a self-loop. Reverse POST is returned only on success; any cycle in any part rejects the entire order. Empty input returns an empty order.',
        'Θ(V + E) time and O(V) additional space for POST and stack. On a cycle, no partial order is returned; colours may show the interrupted traversal.',
      ],
    },
    treeNote:
      'BTree is binary, Tree uses first-child/next-sibling links. Height here counts edges. These are different from external-memory B-trees. PRE/IN/POST output lists are counted separately from recursion stack space.',
    queueNote:
      'This example imports the TRA PriorityQueue. Its iterator does not promise sorted output or the precise layout of the teaching heap. Repeated poll calls determine removal order; peek preserves the queue.',
    applicationsNote:
      'Components belong to undirected Graph; a DiGraph traversal forest is not an SCC decomposition. Native-order component/topological examples are linear. The shared TraTraversalExample prepares sorted neighbours separately and supplies the animation, cycle witness and parent paths. BFS minimises edge count; DFS supplies any found path. Full traversal does not make other roots reachable from the original start. Different valid paths and topological orders are possible.',
    weightedNote:
      'Weights come from Edge.getWeight() (float); distances use double and +∞ for unreachable pairs, printed as INF. Paths use Vertex identity, so equal labels do not merge vertices. Both examples preserve graph fields and accept Graph or DiGraph; foreign query vertices are rejected. Finite floating-point values are approximate, not exact decimal arithmetic. BFS below is an unweighted comparison and minimises edge count, not general total weight.',
    mstNote:
      'A forest with V vertices and C components has V − C chosen edges, including coverage of isolated vertices. Empty input has C = 0 and is not called a tree; one vertex is a zero-edge tree. Equal weights may give different minimum forests with the same mathematical total. Result lists are read-only and contain the real input objects; both algorithms preserve graph fields. Edge weights stay fixed during each run. An MST minimises total chosen-edge weight, not distances from a start. The optional old JDK example below only accepts connected input.',
    analysisNote:
      'Cuts and matching accept undirected Graph; flow accepts DiGraph. Auxiliary maps, partition data and residual entries belong to the algorithms and refer to real TRA objects. Residual cancellation never inserts or changes an input edge. Colours, labels, indices, weights and topology are preserved. Bounds assume expected O(1) identity-map/set access. Flow capacities use the stored float value, not an exact decimal input; fractional/out-of-range values are rejected rather than rounded. Empty cuts/matching are valid; flow requires two distinct graph vertices. SCC decomposition remains outside this addition.',
  },
  ru: {
    title: 'Дополнительные Java-примеры с библиотекой TRA',
    primaryTitle: 'Java-примеры с библиотекой TRA',
    primaryIntro:
      'Основные примеры используют fi.uef.cs.tra на JDK 11+. Скачайте ZIP с исходниками и traj.jar, затем распакуйте их в одну папку.',
    intro:
      'Готовые примеры для JDK 11+ используют пакет fi.uef.cs.tra из предоставленного traj.jar. Скачайте ZIP с примерами и библиотекой, затем распакуйте в одну папку.',
    basicOrder:
      'Списки соседей следуют порядку приложенного JAR. Сортировка по меткам не предполагается. Метки вершин могут повторяться; Map связывает отдельные данные с объектами вершин.',
    download: 'Скачать примеры TRA и traj.jar (.zip)',
    setup:
      'Выполняйте команды из распакованной папки: файл .java и traj.jar должны лежать рядом. В IDE добавьте traj.jar как библиотеку. Каждый пример запускается отдельно.',
    order:
      'Короткие примеры используют естественный порядок JAR; TraTraversalExample явно готовит списки, отсортированные по стабильным ID. Другой порядок соседей может изменить PRE/POST и родителей DFS; BFS всё равно находит кратчайшие расстояния. Поддерживаются Graph и DiGraph. В формулах сложности R — число достижимых вершин, A_R — число просмотренных записей соседства этих вершин.',
    examples: {
      graph: [
        'Создание графа и работа с Vertex',
        'Создание графа A/B/C/D с рисунка, чтение исходящих соседей и весов рёбер, изменение цветов. D изолирована. Отдельный пример U—V показывает, как Graph обеспечивает оба направления соседства одним добавлением.',
        'Перебор вершин занимает Θ(V), соседей одной вершины — Θ(deg(v)). Список соседей для вывода требует O(deg(v)) дополнительной памяти.',
      ],
      graphData: [
        'Вершины TRA как ключи Map',
        'Сохранение числа исходящих соседей каждой вершины в Map<Vertex, Integer>. Структура графа остаётся в TRA; IdentityHashMap различает две вершины X. Для вывода перебираются vertices(), порядок Map не предполагается.',
        'Ожидаемое Θ(V + E) времени для всех счётчиков и O(V) дополнительной памяти Map при ожидаемом постоянном времени операций по идентичности. Хранение графа и строки вывода учитываются отдельно.',
      ],
      dfs: [
        'Короткий цветной DFS: естественный порядок TRA',
        'Пометка GREY до рекурсии, PRE при входе, продолжение цикла родителя после возврата ребёнка, затем POST и BLACK. Можно обойти достижимую часть или весь граф. Корни леса направленного обхода не обозначают компоненты сильной связности.',
        'Полный обход: Θ(V + E) времени и O(V) дополнительной памяти под результаты и стек. Достижимая часть: Θ(V + R + A_R), включая начальную установку WHITE; хранение входного графа не учитывается.',
      ],
      bfs: [
        'BFS A–H: очередь TRA, расстояния и путь',
        'LinkedQueue<Vertex>, GREY до добавления в очередь и BLACK после просмотра соседей. Родительские ссылки восстанавливают кратчайший путь по числу рёбер. Для недостижимой вершины расстояние -1 и пустой путь.',
        'Θ(V + R + A_R) времени, включая начальные цвета и расстояния; O(V) дополнительной памяти под таблицы, результаты и очередь. Если достижим весь граф — Θ(V + E).',
      ],
      recursiveDfs: [
        'Базовый DFS: собственный итератор и visited',
        'Vertex и neighborIterator(), отдельная IdentityHashMap visited, PRE/POST и продолжение родителя. Цвета графа сохраняются. Порядок этих учебных графов проверен на приложенном JAR.',
        'Ожидаемое Θ(V + E) для полного обхода, Θ(V + R + Aᵣ) для достижимой части с подготовкой visited; O(V) памяти при ожидаемом O(1) операций карты.',
      ],
      traversal: [
        'DFS/BFS: цвета, времена и классы Edge',
        'Graph/DiGraph, цвета Vertex, родители, tin/tout, физические объекты Edge, LinkedQueue и полный лес. Порядок соседей явно готовится по стабильным ID; метки могут совпадать.',
        'Ядро после подготовки: Θ(V + E); подготовка O(V + E + Σ d(v) log(d(v) + 1)). Дополнительная память O(V + E), включая упорядоченные списки и результаты рёбер.',
      ],
      tree: [
        'Бинарное и произвольное дерево TRA',
        'Создание дерева A–G с рисунка, PRE/IN/POST, число узлов и высота. Дополнительно Tree с корнем R и тремя детьми X/Y/Z. Можно вызвать example("empty"), example("single") и example("chain").',
        'Каждый обход, size или height занимает Θ(n) времени. Стек непустого дерева O(h + 1), пустого O(1); списки результата добавляют O(n). h — число рёбер, пустое −1, лист 0.',
      ],
      priorityQueue: [
        'TRA PriorityQueue: peek, poll и повторы',
        'Начальные значения учебной кучи, добавление второй 3 и различие peek/poll. Пустые результаты — null. Конструктор с ёмкостью и компаратором упорядочивает задачи по приоритету и ID. Итератор не используется как сортированный просмотр.',
        'peek O(1); offer амортизированно O(log n), poll O(log n); хранение O(n). Просмотр priorityOrder копирует очередь и вызывает poll: O(n log n) времени и O(n) памяти.',
      ],
      components: [
        'Graph: компоненты и неориентированные циклы',
        'Полный DFS группирует тот же граф 0—1, изолированная 2, 3—4, что на рисунке. Отдельная проверка циклов исключает то же физическое родительское Edge: одиночное ребро не образует цикл, треугольник образует. Каждый запуск один раз сбрасывает цвета и сохраняет структуру.',
        'Каждая полная операция занимает Θ(V + E) времени и O(V) дополнительной памяти, включая списки компонент и стек. Пустой граф не имеет компонент и циклов.',
      ],
      dijkstra: [
        'Дейкстра: веса Edge TRA и минимальная очередь',
        'Graph/DiGraph, таблицы расстояний и родителей по идентичности, TRA PriorityQueue с неизменяемыми записями. От A до D лучший путь A → C → B → D с весом 4; E недостижима. Старые записи B:10 и D:9 пропускаются. Отрицательные и неконечные веса отклоняются во всём входе.',
        'O(V + E log(E + 1)) времени и O(V + E) дополнительной памяти для этой ленивой очереди с проверкой входа. Запрос пути — O(длины пути). Decrease-key и изменение приоритета Vertex не предполагаются.',
      ],
      floyd: [
        'Флойд–Уоршелл: матрица из графа TRA',
        'Внешние индексы по идентичности вершин и настоящие веса исходящих Edge. Матрица next хранит следующий шаг пути. A → B → C имеет вес 5 − 2 = 3; D изолирована. Отрицательный цикл в любой части запрещает весь результат, включая несвязные части; частичная матрица не возвращается.',
        'O(V³ + E) времени с построением матрицы и O(V²) дополнительной памяти. Запрос пути — O(длины пути). Пустой граф даёт пустой результат; путь из вершины в себя содержит ноль рёбер.',
      ],
      mst: [
        'Прим и Краскал: настоящие Edge TRA и остовный лес',
        'Оба метода принимают неориентированный Graph и возвращают выбранные настоящие Edge, вершины, число компонент и общий вес. Прим использует TRA PriorityQueue и новый корень для каждой компоненты; Краскал сортирует копию Graph.edges() и объединяет внешние множества с индексами по идентичности. Связный пример весит 4; добавление изолированной E и F—G:-2 даёт три компоненты и вес 2.',
        'Каждый метод: O(V + E log(E + 1)) времени и O(V + E) дополнительной памяти при ожидаемом O(1) операций карт/множеств по идентичности. Конечные отрицательные/нулевые веса и повторы допустимы; NaN и бесконечности отклоняются. Сумма хранится в double.',
      ],
      cuts: [
        'Точки сочленения и мосты: DFS TRA с tin/low',
        'Полный обход Graph с tin/low по идентичности и исключением физического родительского Edge. Треугольник 0–1–2 с хвостом 1–3–4 и изолированной 5 даёт точки 1/3 и настоящие мосты 1–3/3–4. Для детей корня отдельное правило. Веса входа игнорируются.',
        'Ожидаемое O(V + E) времени и O(V) дополнительной памяти со стеком и результатами. Сортировка подписей мостов в консоли — отдельная работа вывода. Чужие вершины запросов времени отклоняются; вход и прошлые результаты сохраняются.',
      ],
      matching: [
        'Наибольшее двудольное паросочетание: партнёры Vertex и пары Edge',
        'Передай список разных вершин левой доли; правая — остальные вершины Graph. Каждое ребро должно соединять разные доли. Увеличивающие пути используют новое seen для каждого левого корня. L0 перемещается с R0 на R1, чтобы L1 заняла R0; изолированная R2 остаётся свободной. Веса не влияют на количество пар.',
        'Ожидаемое O(V + E + L·E) времени и O(V) дополнительной памяти, L — размер левой доли. Списки только для чтения содержат настоящие объекты; partnerOf возвращает null для свободной вершины и отклоняет чужую.',
      ],
      flow: [
        'Эдмондс–Карп: ёмкости TRA и парные остаточные переходы',
        'DiGraph с разными принадлежащими ему истоком/стоком. Сохранённые веса Edge — конечные целые от 0 до 1 000 000 000; проверенные ёмкости и потоки хранятся в long. У каждого Edge отдельная пара прямого/отменяющего переходов, поэтому входные рёбра противоположных направлений независимы. Второй пример отменяет a→x через x→a, которого нет во входе.',
        'Ожидаемое O(V + E + V·E²) времени и O(V + E) дополнительной памяти. BFS использует TRA LinkedQueue. Результат содержит поток по Edge, остаточную сторону истока и минимальный разрез той же ёмкости. Некорректные ёмкости, исток/сток и чужие Edge отклоняются.',
      ],
      topological: [
        'DiGraph: обратный POST только после полной проверки циклов',
        'Создание того же DAG, что на рисунке, с изолированной 4. Полный DFS отклоняет GREY-соседа, включая петлю. Обратный POST возвращается только при успехе; цикл в любой части запрещает весь порядок. Пустой вход даёт пустой порядок.',
        'Θ(V + E) времени и O(V) дополнительной памяти под POST и стек. При цикле частичный порядок не возвращается; цвета могут отражать прерванный обход.',
      ],
    },
    treeNote:
      'BTree — бинарное дерево, Tree связывает первого ребёнка и следующего соседа. Высота здесь считается в рёбрах. B-деревья внешней памяти — другая структура. Списки PRE/IN/POST учитываются отдельно от стека рекурсии.',
    queueNote:
      'Пример импортирует PriorityQueue из TRA. Итератор не гарантирует сортировку или расположение как на учебном рисунке. Порядок удаления определяется последовательными poll; peek сохраняет очередь.',
    applicationsNote:
      'Компоненты относятся к неориентированному Graph; лес обхода DiGraph не является разбиением на SCC. Примеры компонент и топосортировки с естественным порядком линейны. Общий TraTraversalExample отдельно готовит сортированных соседей и служит источником анимации, свидетельства цикла и родительских путей. BFS минимизирует число рёбер, DFS даёт найденный путь. Полный обход не делает другие корни достижимыми из начального старта. Возможны разные правильные пути и топологические порядки.',
    weightedNote:
      'Вес берётся из Edge.getWeight() (float); расстояния хранятся в double, +∞ означает недостижимость и печатается как INF. Пути используют идентичность Vertex: одинаковые метки не объединяют вершины. Оба примера сохраняют поля графа, принимают Graph/DiGraph и отклоняют чужие вершины запросов. Вычисления с плавающей точкой приближённые, а не точная десятичная арифметика. BFS ниже дан для сравнения: он минимизирует число рёбер, а не произвольную сумму весов.',
    mstNote:
      'У леса с V вершинами и C компонентами V − C выбранных рёбер; изолированные вершины тоже учитываются. У пустого графа C = 0, он не называется деревом; одна вершина — дерево без рёбер. Равные веса могут давать разные минимальные леса с одинаковой математической суммой. Списки результата доступны только для чтения и содержат настоящие входные объекты; оба алгоритма сохраняют поля графа. Веса Edge не меняются во время запуска. MST минимизирует сумму выбранных рёбер, а не расстояния от старта. Старый JDK-пример ниже принимает только связный вход.',
    analysisNote:
      'Мосты и паросочетание принимают неориентированный Graph, поток — DiGraph. Вспомогательные карты, доли и остаточные переходы принадлежат алгоритмам и ссылаются на настоящие объекты TRA. Отмена потока не добавляет и не меняет входные рёбра. Цвета, метки, индексы, веса и структура сохраняются. Оценки предполагают ожидаемое O(1) карт/множеств по идентичности. Ёмкости читаются как сохранённые float, а не точные десятичные числа; дробные/слишком большие значения отклоняются без округления. Пустой вход допустим для мостов/паросочетания; потоку нужны две разные вершины графа. Разбиение на SCC не входит в дополнение.',
  },
  fi: {
    title: 'Lisää Java-esimerkkejä TRA-kirjastolla',
    primaryTitle: 'Java-esimerkit TRA-kirjastolla',
    primaryIntro:
      'Pääesimerkit käyttävät pakettia fi.uef.cs.tra JDK 11+:lla. Lataa lähdekoodit ja traj.jar ZIPinä ja pura ne samaan kansioon.',
    intro:
      'Valmiit JDK 11+ -esimerkit käyttävät mukana tulevan traj.jar-tiedoston pakettia fi.uef.cs.tra. Lataa esimerkit ja kirjasto ZIPinä ja pura ne samaan kansioon.',
    basicOrder:
      'Naapurilistat noudattavat mukana tulevan JARin omaa järjestystä. Nimiä ei oleteta lajitelluiksi. Solmuilla voi olla sama nimi; Map liittää erilliset lisätiedot solmuolioihin.',
    download: 'Lataa TRA-esimerkit ja traj.jar (.zip)',
    setup:
      'Suorita komennot puretussa kansiossa: .java-tiedosto ja traj.jar ovat rinnakkain. Lisää IDE:ssä traj.jar kirjastoksi. Jokainen esimerkki toimii itsenäisesti.',
    order:
      'Lyhyet esimerkit käyttävät JARin omaa järjestystä; TraTraversalExample valmistelee vakaan ID:n mukaan lajitellut listat. Eri naapurijärjestys voi muuttaa DFS:n PRE/POST-järjestystä ja vanhempia; BFS löytää silti lyhimmät etäisyydet. Graph ja DiGraph ovat tuettuja. Vaativuuskaavoissa R on saavutettavien solmujen määrä ja A_R niistä tutkittujen naapuruusmerkintöjen määrä.',
    examples: {
      graph: [
        'Graafin luominen ja Vertex-operaatiot',
        'Luo kuvan A/B/C/D-verkko, lue lähtevät naapurit ja kaaripainot sekä muuta värejä. D on eristetty. Erillinen U—V-esimerkki näyttää, kuinka Graph muodostaa molemmat naapuruussuunnat yhdellä lisäyksellä.',
        'Solmujen läpikäynti vie Θ(V) ja yhden solmun naapureiden läpikäynti Θ(deg(v)). Tulostettava naapurilista käyttää O(deg(v)) lisätilaa.',
      ],
      graphData: [
        'TRA-solmut Mapin avaimina',
        'Tallenna kunkin solmun lähtevien naapurien määrä rakenteeseen Map<Vertex, Integer>. TRA säilyttää verkon rakenteen; IdentityHashMap erottaa kaksi X-nimistä solmua. Tulostus käy läpi vertices()-joukon eikä oleta Mapille järjestystä.',
        'Odotettu Θ(V + E) aika kaikille laskureille ja O(V) lisätilaa Mapille, kun identiteettikuvauksen operaatiot vievät odotetusti vakioajan. Verkon tallennus ja tulostusmerkkijonot lasketaan erikseen.',
      ],
      dfs: [
        'Lyhyt väri-DFS: TRA:n oma naapurijärjestys',
        'Merkitse GREY ennen rekursiota ja kirjaa PRE saapuessa. Lapsen palattua kutsuja jatkaa omaa naapurisilmukkaansa; lopuksi kirjataan POST ja merkitään BLACK. Käy saavutettava osa tai koko graafi. Suunnatun metsän juuret eivät tarkoita vahvasti yhtenäisiä komponentteja.',
        'Koko läpikäynti: Θ(V + E) aikaa ja O(V) lisätilaa tuloksille ja pinolle. Saavutettava osa: Θ(V + R + A_R), mukaan lukien WHITE-alustus; syötegraafin tilaa ei lasketa mukaan.',
      ],
      bfs: [
        'BFS A–H: TRA-jono, etäisyydet ja polku',
        'Käytä LinkedQueue<Vertex>-jonoa, merkitse GREY ennen jonoon lisäämistä ja BLACK naapureiden käsittelyn jälkeen. Vanhempiviitteet muodostavat lyhimmän polun kaarten määrän mukaan. Saavuttamattoman solmun etäisyys on -1 ja polku tyhjä.',
        'Θ(V + R + A_R) aikaa, mukaan lukien väri- ja etäisyysalustus; O(V) lisätilaa tauluille, tuloksille ja jonolle. Kun koko graafi on saavutettava, aika on Θ(V + E).',
      ],
      recursiveDfs: [
        'Perus-DFS: oma iteraattori ja visited',
        'Vertex ja neighborIterator(), erillinen identiteettipohjainen visited-kuvaus, PRE/POST ja vanhemman jatkuminen. Solmujen värit säilyvät. Opetusesimerkkien oma järjestys tarkistetaan mukana tulevalla JARilla.',
        'Odotettu Θ(V + E) koko läpikäynnille, Θ(V + R + Aᵣ) saavutettavalle osalle visited-alustuksineen; O(V) tilaa olettaen kuvauksen odotetut O(1)-operaatiot.',
      ],
      traversal: [
        'DFS/BFS: värit, ajat ja Edge-luokat',
        'Graph/DiGraph, Vertex-värit, vanhemmat, tin/tout, fyysiset Edge-oliot, LinkedQueue ja kokonaiset metsät. Naapurijärjestys valmistellaan vakaan ID:n mukaan; nimet voivat toistua.',
        'Ydin valmistelun jälkeen: Θ(V + E); valmistelu O(V + E + Σ d(v) log(d(v) + 1)). Lisätila O(V + E), mukaan lukien järjestetyt listat ja kaaritulokset.',
      ],
      tree: [
        'TRA:n binäärinen ja yleinen puu',
        'Luo kuvan A–G-puu, PRE/IN/POST sekä solmujen määrä ja korkeus. Lisäksi yleinen Tree, jonka R-juurella on lapset X/Y/Z. Kokeile example("empty"), example("single") ja example("chain").',
        'Kukin läpikäynti, size tai height vie Θ(n) aikaa. Epätyhjän puun pino O(h + 1), tyhjän O(1); tuloslistat lisäävät O(n). h lasketaan kaarina: tyhjä −1, lehti 0.',
      ],
      priorityQueue: [
        'TRA PriorityQueue: peek, poll ja toistot',
        'Opetuskeon alkuarvot, toisen 3:n lisäys ja peek/poll-ero. Tyhjä palauttaa nullin. Kapasiteetti ja vertailija järjestävät tehtävät prioriteetin ja ID:n mukaan. Iteraattoria ei käytetä lajiteltuna esikatseluna.',
        'peek O(1); offer amortoidusti O(log n), poll O(log n); tallennus O(n). priorityOrder-esikatselu kopioi ja poistaa: O(n log n) aikaa ja O(n) tilaa.',
      ],
      components: [
        'Graph: komponentit ja suuntaamattomat syklit',
        'Koko DFS ryhmittelee saman graafin kuin kuva: 0—1, eristetty 2 ja 3—4. Erillinen syklitarkistus ohittaa saman fyysisen vanhempi-Edge-kaaren: yksi kaari ei muodosta sykliä, kolmio muodostaa. Kukin ajo alustaa värit kerran ja säilyttää rakenteen.',
        'Kukin kokonainen operaatio vie Θ(V + E) aikaa ja O(V) lisätilaa, mukaan lukien komponenttilistat ja rekursiopino. Tyhjässä graafissa ei ole komponentteja eikä syklejä.',
      ],
      dijkstra: [
        'Dijkstra: TRA:n Edge-painot ja minimijono',
        'Graph/DiGraph, identiteettipohjaiset etäisyys- ja vanhempitaulut sekä TRA PriorityQueue muuttumattomilla tietueilla. Paras A–D-polku on A → C → B → D, paino 4; E on saavuttamaton. Vanhat B:10- ja D:9-tietueet ohitetaan. Negatiiviset ja ei-äärelliset painot hylätään koko syötteestä.',
        'O(V + E log(E + 1)) aikaa ja O(V + E) lisätilaa tälle laiskalle jonolle syötetarkistuksineen. Polkukysely vie O(polun pituus). Decrease-key-operaatiota tai Vertex-prioriteetin muuttamista ei oleteta.',
      ],
      floyd: [
        'Floyd–Warshall: matriisi TRA-graafista',
        'Anna solmuille ulkoiset identiteettipohjaiset indeksit ja lue oikeiden lähtevien Edge-kaarien painot. Seuraavan askeleen matriisi palauttaa polut. A → B → C painaa 5 − 2 = 3; D on eristetty. Negatiivinen sykli missä tahansa, myös erillisessä osassa, hylkää koko tuloksen; osittaista matriisia ei palauteta.',
        'O(V³ + E) aikaa matriisin muodostuksineen ja O(V²) lisätilaa. Polkukysely vie O(polun pituus). Tyhjä graafi antaa tyhjän tuloksen; solmusta itseensä kulkeva polku sisältää nolla kaarta.',
      ],
      mst: [
        'Prim ja Kruskal: oikeat TRA-kaaret ja virittävä metsä',
        'Molemmat ottavat suuntaamattoman Graphin ja palauttavat oikeat valitut Edge-viitteet, solmut, komponenttimäärän ja kokonaispainon. Prim käyttää TRA PriorityQueuea ja uutta juurta komponenttia kohti; Kruskal lajittelee Graph.edges()-kopion ja yhdistää ulkoiset identiteettipohjaisesti indeksoidut joukot. Yhtenäinen esimerkki painaa 4; eristetty E ja F—G:-2 antavat kolme komponenttia ja painon 2.',
        'Kumpikin: O(V + E log(E + 1)) aikaa ja O(V + E) lisätilaa olettaen identiteettikuvauksen/-joukon odotetut O(1)-operaatiot. Äärelliset negatiiviset/nollapainot ja yhtäsuuret painot sallitaan; NaN ja äärettömyydet hylätään. Summa lasketaan doublena.',
      ],
      cuts: [
        'Leikkaussolmut ja sillat: TRA:n tin/low-DFS',
        'Koko Graphin läpikäynti identiteettipohjaisilla tin/low-arvoilla ja fyysisen vanhempi-Edge-kaaren ohituksella. Kolmio 0–1–2, häntä 1–3–4 ja eristetty 5 antavat leikkaussolmut 1/3 ja oikeat sillat 1–3/3–4. Juuren lapsille on erillinen sääntö. Syötepainot ohitetaan.',
        'Odotettu O(V + E) aika ja O(V) lisätila pinoineen ja tuloksineen. Konsolin siltanimien lajittelu on erillistä esitystyötä. Vieraat aikakyselysolmut hylätään; syöte ja aiemmat tulokset säilyvät.',
      ],
      matching: [
        'Suurin kaksijakoinen sovitus: Vertex-parit ja oikeat Edge-kaaret',
        'Anna vasemman puolen erilliset syötesolmut listana; oikea puoli on Graphin loppuosa. Jokaisen kaaren on ylitettävä jako. Kasvattavat polut käyttävät uutta seen-tilaa vasenta juurta kohti. L0 siirtyy R0:sta R1:een, jotta L1 saa R0:n; eristetty R2 jää vapaaksi. Painot eivät vaikuta parimäärään.',
        'Odotettu O(V + E + L·E) aika ja O(V) lisätila, L = vasemman puolen koko. Vain luettavat listat sisältävät oikeat oliot; partnerOf palauttaa nullin vapaalle solmulle ja hylkää vieraan.',
      ],
      flow: [
        'Edmonds–Karp: TRA-kapasiteetit ja jäännösparit',
        'DiGraph ja eri syötesolmuina lähde/nielu. Tallennetut Edge-painot ovat äärellisiä kokonaislukuja väliltä 0–1 000 000 000; tarkistetut kapasiteetit ja virtaukset ovat long-arvoja. Kukin Edge saa oman eteenpäin/peruutusparin, joten vastakkaiset syötekaaret pysyvät erillisinä. Toinen esimerkki peruu a→x:n siirtymällä x→a, jota syötteessä ei ole.',
        'Odotettu O(V + E + V·E²) aika ja O(V + E) lisätila. BFS käyttää TRA LinkedQueuea. Tulos sisältää Edge-kohtaisen virtauksen, jäännösverkon lähdepuolen ja yhtä suuren minimileikkauksen. Virheelliset kapasiteetit, päät ja vieraat Edge-kyselyt hylätään.',
      ],
      topological: [
        'DiGraph: käänteinen POST vasta koko syklitarkistuksen jälkeen',
        'Luo kuvan DAG ja eristetty 4. Koko DFS hylkää GREY-naapurin, myös silmukan. Käänteinen POST palautetaan vain onnistuttaessa; sykli missä tahansa estää koko järjestyksen. Tyhjä syöte antaa tyhjän järjestyksen.',
        'Θ(V + E) aikaa ja O(V) lisätilaa POST:lle ja pinolle. Syklin tapauksessa osittaista järjestystä ei palauteta; värit voivat kuvata keskeytynyttä läpikäyntiä.',
      ],
    },
    treeNote:
      'BTree on binääripuu; Tree liittää ensimmäisen lapsen ja seuraavan sisaruksen. Korkeus lasketaan tässä kaarina. Ulkoisen muistin B-puut ovat eri rakenne. PRE/IN/POST-listat lasketaan erikseen rekursiopinosta.',
    queueNote:
      'Esimerkki tuo PriorityQueuen TRA:sta. Iteraattori ei takaa lajittelua eikä opetuskuvan tarkkaa rakennetta. Toistuvat poll-kutsut määräävät poistumisjärjestyksen; peek säilyttää jonon.',
    applicationsNote:
      'Komponentit koskevat suuntaamatonta Graphia; DiGraphin läpikäyntimetsä ei ole SCC-jako. Oman järjestyksen komponentti- ja topologiaesimerkit ovat lineaarisia. Yhteinen TraTraversalExample valmistelee lajitellut naapurit erikseen ja tuottaa animaation, syklin todistavan polun ja vanhempipolut. BFS minimoi kaarimäärän, DFS antaa löydetyn polun. Koko läpikäynti ei tee muista juurista saavutettavia alkuperäisestä alusta. Erilaiset kelvolliset polut ja topologiset järjestykset ovat mahdollisia.',
    weightedNote:
      'Painot luetaan Edge.getWeight()-metodista (float); etäisyydet ovat double-arvoja ja +∞ tarkoittaa saavuttamatonta, tulosteessa INF. Polut käyttävät Vertex-identiteettiä, joten samat nimet eivät yhdistä solmuja. Molemmat esimerkit säilyttävät graafin kentät, tukevat Graphia/DiGraphia ja hylkäävät vieraat kyselysolmut. Liukulukulaskenta on likimääräistä, ei tarkkaa desimaalilaskentaa. Alla oleva BFS on painoton vertailu: se minimoi kaarimäärän, ei mielivaltaista painosummaa.',
    mstNote:
      'V solmun ja C komponentin metsässä on V − C valittua kaarta; eristetytkin solmut lasketaan. Tyhjän graafin C = 0 eikä sitä kutsuta puuksi; yksi solmu on kaareton puu. Samat painot voivat antaa eri minimimetsiä samalla matemaattisella summalla. Tuloslistat ovat vain luettavia ja sisältävät oikeat syöteoliot; molemmat algoritmit säilyttävät graafin kentät. Edge-painoja ei muuteta ajon aikana. MST minimoi valittujen kaarien summan, ei etäisyyksiä aloitussolmusta. Alla oleva vanha JDK-esimerkki hyväksyy vain yhtenäisen syötteen.',
    analysisNote:
      'Leikkaukset ja sovitus ottavat suuntaamattoman Graphin, virtaus DiGraphin. Apukuvaukset, osajako ja jäännöstietueet kuuluvat algoritmeille ja viittaavat oikeisiin TRA-olioihin. Peruutus ei lisää tai muuta syötekaaria. Värit, nimet, indeksit, painot ja rakenne säilyvät. Vaativuudet olettavat kuvauksen/joukon odotetun O(1)-ajan. Kapasiteetti luetaan tallennettuna float-arvona, ei tarkkana desimaalina; murtoluvut/ylisuuret arvot hylätään pyöristämättä. Tyhjä syöte käy leikkauksille/sovitukselle; virtaus tarvitsee kaksi eri graafisolmua. SCC-jako ei kuulu lisäykseen.',
  },
}
