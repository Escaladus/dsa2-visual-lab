export const recursionReviewTranslations = {
  ru: {
    title: 'Проверь себя: рекурсия и DFS',
    intro:
      '15 вопросов: от базового случая до стека, обхода графа и сложности. После проверки есть объяснение; к прошлым вопросам можно вернуться без изменения уже проверенных ответов.',
    instructions:
      'Анализируй показанный Java-код и условия вопроса. Вызовы выполняются последовательно; кэш используется только там, где явно показан memo. Порядок соседей задан массивами.',
    previous: 'Предыдущий вопрос',
    perfect: 'Все ответы верны! Ты проследил вызовы, возвраты, DFS и затраты времени и памяти.',
    practice:
      'Разбери ошибки ниже и проверь рассуждения в визуализации. Новая попытка сбросит ответы.',
    levels: [
      'Результат',
      'Порядок возвратов',
      'Базовый случай',
      'Дерево вызовов',
      'Поиск ошибки',
      'Продолжение',
      'Стек',
      'Следующий сосед',
      'visited',
      'POST',
      'Область обхода',
      'Время и стек',
      'Мемоизация',
      'Полный DFS',
      'Подготовка памяти',
    ],
    questions: {
      value: {
        feedback: [
          '4 — аргумент начального вызова; нужно выполнить все умножения.',
          'Факториал перемножает числа, а не складывает их: 4 + 3 + 2 + 1 здесь не вычисляется.',
          '24 получается после всех возвратов и умножений.',
          '4 × 4 не соответствует рекурсивной цепочке 4 × 3 × 2 × 1.',
        ],
      },
      'first-return': {
        feedback: [
          'factorial(4) ждёт вложенные вызовы и завершится последним.',
          'factorial(1) сразу попадает в базовый случай.',
          'factorial(3) ещё ждёт factorial(2), который ждёт factorial(1).',
          'Вызовы вложены: возвращается сначала самый глубокий, затем его родители.',
        ],
      },
      base: {
        feedback: [
          'Это проверка, позволяющая вернуть ответ без нового вызова.',
          'При n > 1 метод создаёт вложенный вызов, а не останавливается.',
          'n * n — выражение умножения, а не условие остановки.',
          'n * child вычисляется после возврата ребёнка; это не проверка базового случая.',
        ],
      },
      calls: {
        feedback: [
          'Нужно считать и повторные вызовы с одинаковыми аргументами.',
          'Дерево для fibonacci(4) содержит и левую, и правую ветви каждого небазового вызова: всего 9 узлов.',
          'Каждый из девяти узлов — отдельный вызов.',
          'Дерево не полное бинарное до одного уровня: базовые случаи обрывают разные ветви на разной глубине.',
        ],
      },
      bug: {
        feedback: [
          'Нет конечной цепочки из n вызовов: аргумент остаётся тем же.',
          'В коде нет базового случая с return 0.',
          'Чтобы вернуть n, нужна соответствующая строка return; вместо неё создаётся новый вызов.',
          'Без достижимого условия остановки стек переполнится.',
        ],
      },
      resume: {
        title: 'Где продолжится factorial(4)?',
        assumptions: 'factorial(3) только что вернул 6 в ожидающий factorial(4).',
        choices: [
          'Заново с первой строки factorial(4)',
          'Записать child = 6, затем вернуть 4 × 6 = 24',
          'Сразу вернуть 6 вызывающей программе',
          'Заменить собственный n = 4 на n = 3',
        ],
        explanation:
          'Родитель сохраняет n = 4 и место продолжения. Возврат завершает присваивание child = 6, после чего выполняется return n * child. Метод не начинается заново.',
        feedback: [
          'Возврат продолжает приостановленный вызов после вложенного вызова, не запускает его заново.',
          'Сохранённые переменные и продолжение дают 24.',
          '6 — результат ребёнка; родитель ещё должен умножить его на свой n = 4.',
          'У каждого кадра собственный n. Аргумент ребёнка не изменяет аргумент родителя.',
        ],
      },
      stack: {
        title: 'Что сейчас находится в стеке?',
        assumptions:
          'Начат fibonacci(4). Первая левая цепочка дошла до входа в fibonacci(1), до его возврата. Укажи только аргументы кадров fibonacci сверху вниз; кадр main не учитывай.',
        choices: ['4 → 3 → 2 → 1', '1 → 2 → 3 → 4', 'Только 1', 'Все девять вызовов дерева'],
        explanation:
          'Новый кадр fibonacci(1) лежит сверху. Под ним ждут fibonacci(2), fibonacci(3) и fibonacci(4). Правые ветви пока не выполнялись, поэтому в стеке четыре кадра.',
        feedback: [
          'Это порядок от дна к вершине; в вопросе нужен порядок сверху вниз.',
          'Сверху последний вызов, ниже — ожидающие родители.',
          'Ожидающие родители остаются в стеке со своими переменными.',
          'Дерево сохраняет все вызовы за всё выполнение; стек содержит только одновременно незавершённые.',
        ],
      },
      'dfs-next': {
        title: 'Какого соседа проверит dfs(0) после возврата?',
        assumptions:
          'Обход начат из 0. Вызов dfs(1) полностью завершился, включая dfs(3), и управление вернулось в dfs(0). Порядок соседей: 0: [1, 2].',
        explanation:
          'В dfs(0) сохранён i = 0. После возврата из dfs(1) цикл увеличит i до 1 и прочитает next = 2. Перебор не начинается сначала.',
        feedback: [
          '3 — сосед вершины 1; его обработка уже закончилась.',
          'Следующий элемент списка соседей вершины 0 — 2.',
          '1 уже обработан; цикл переходит к следующей позиции.',
          '0 — текущая вершина, а не следующий элемент её списка соседей.',
        ],
      },
      'dfs-skip': {
        title: 'Почему переход 2 → 0 пропускается?',
        assumptions:
          'Циклический граф, старт 0. Цепочка вызовов: dfs(0) → dfs(1) → dfs(2). В dfs(2) рассматривается next = 0. v0 обозначает объект вершины 0.',
        choices: [
          '0 меньше 2',
          'Вершина 0 уже записана в POST',
          'visited.get(v0) уже true',
          'В графе нет циклов',
        ],
        explanation:
          'dfs(0) пометил visited.get(v0) до перехода к соседям. Условие !visited.get(v0) ложно, поэтому новый вызов не создаётся. dfs(0) пока ждёт и ещё не попал в POST.',
        feedback: [
          'Номера вершин не определяют, разрешён ли рекурсивный переход.',
          'POST добавляется при завершении dfs(0); сейчас этот кадр ещё ожидает.',
          'Общая пометка visited предотвращает повторный вход, в том числе по циклу.',
          'В графе есть цикл 0–1–2–0; именно visited позволяет его безопасно обойти.',
        ],
      },
      'dfs-post': {
        title: 'В каком порядке заполняется POST?',
        assumptions:
          'Старт 0, обход достижимой части. Соседи рассматриваются в порядке массивов. PRE — вход, POST — завершение вызова.',
        choices: ['3 → 1 → 2 → 0', '0 → 1 → 3 → 2', '3 → 2 → 1 → 0', '0 → 2 → 1 → 3'],
        explanation:
          'Сначала заканчивается лист 3, затем его родитель 1. После возврата в 0 обходится 2, и последним завершается 0. POST: 3 → 1 → 2 → 0.',
        feedback: [
          'POST записывает завершения: ребёнок раньше родителя.',
          'Это PRE, порядок входа в вершины.',
          '2 начнёт выполняться только после полного завершения 1.',
          'Начальный вызов 0 завершится последним; порядок соседей также должен сохраняться.',
        ],
      },
      'dfs-scope': {
        title: 'Каким будет PRE для traverse(graph, vertices, vertices.get(2), false)?',
        assumptions: 'Вершина 2 изолирована. all = false означает обход только достижимой части.',
        choices: ['0 → 1', '2 → 0 → 1 → 3 → 4', 'Пустой список', 'Только 2'],
        explanation:
          'Сначала вызывается dfs(2), поэтому PRE содержит 2. Соседей у неё нет; внешний цикл отключён. Другие компоненты не обходятся.',
        feedback: [
          'Старт явно задан как 2, а не 0.',
          'Такой порядок получился бы при all = true, с внешним циклом после стартового вызова.',
          'Изолированная стартовая вершина всё равно посещается и добавляется в PRE.',
          'Только вершина 2 достижима из себя в этом графе.',
        ],
      },
      'fib-cost': {
        title: 'Как растут время и память наивного Фибоначчи?',
        assumptions:
          'Рассматривай рост n, стоимость операций long — O(1), переполнение значений и ограничения машины не моделируем. Дополнительная память — память алгоритма, без истории визуализации. φ = (1 + √5) / 2.',
        choices: [
          'Время Θ(n), стек Θ(n)',
          'Время Θ(φⁿ), стек Θ(φⁿ)',
          'Время Θ(φⁿ), стек Θ(n)',
          'Время Θ(n), стек O(1)',
        ],
        explanation:
          'T(n) = T(n − 1) + T(n − 2) + Θ(1): повторные подзадачи дают Θ(φⁿ) времени. Ветви выполняются последовательно; одновременно живёт одна цепочка глубины Θ(n).',
        feedback: [
          'Без кэша одинаковые подзадачи многократно пересчитываются; время не линейно.',
          'Всё дерево не хранится в стеке одновременно. После возврата дочерние кадры удаляются.',
          'Экспоненциальное число вызовов сочетается с линейным пиком стека.',
          'Повторная работа даёт экспоненциальное время, а незавершённые родители требуют линейного стека.',
        ],
      },
      'memo-cost': {
        title: 'Что меняет один общий кэш memo?',
        assumptions:
          'Новый Long[n + 1] создаётся один раз перед fibonacci(n, memo). Все вызовы используют тот же массив. Модель операций — O(1); анализируем рост n без числового переполнения.',
        choices: [
          'Время Θ(n); стек и кэш вместе Θ(n)',
          'Время Θ(n); память Θ(n²)',
          'Время Θ(φⁿ); память Θ(n)',
          'Время и память O(1)',
        ],
        explanation:
          'Каждое небазовое значение вычисляется один раз, повторы читают кэш. Подготовка кэша и общее время — Θ(n). Один кэш Θ(n) и стек Θ(n) складываются, а не перемножаются.',
        feedback: [
          'Один общий кэш устраняет повторную работу, сохраняя линейную глубину первой цепочки.',
          'Массив memo не копируется в каждый кадр: передаётся значение ссылки на общий массив.',
          'Попадание в кэш не создаёт дочерних вызовов, поэтому экспоненциальная работа исчезает.',
          'Первое вычисление ещё обходит Θ(n) подзадач и выделяет n + 1 ячеек.',
        ],
      },
      'dfs-cost': {
        title: 'Какова сложность полного рекурсивного DFS?',
        assumptions:
          'Вызван traverse(graph, vertices, start, true). Граф задан списками смежности: V вершин, E рёбер. Добавление в ArrayList — амортизированно O(1). Память включает стек, visited и PRE/POST, исключая входной граф и историю визуализации. Для identity-карты предполагается ожидаемое O(1) на операцию. ',
        choices: [
          'Время Θ(V), память O(V), независимо от E',
          'Время Θ(V + E), память O(V)',
          'Время Θ(V × E), память O(V²)',
          'Время Θ(V + E), память O(1)',
        ],
        explanation:
          'Внешний цикл рассматривает V вершин, DFS читает каждую запись соседей один раз. Для неориентированного графа их 2E. Стек, visited и два результата занимают суммарно O(V).',
        feedback: [
          'Нужно прочитать и записи соседей; число рёбер влияет на время.',
          'Суммируются посещения вершин и чтения соседей; память вспомогательных структур линейна.',
          'Все рёбра не перебираются заново для каждой вершины: каждый список читается один раз.',
          'visited содержит V ячеек, а стек в худшем случае достигает V кадров.',
        ],
      },
      'dfs-setup': {
        title: 'Делает ли изолированный старт весь traverse константным?',
        assumptions:
          'Вызван traverse(graph, vertices, vertices.get(2), false). Показан пример из 5 вершин; для оценки рассматривай аналогичные графы с растущим V и изолированной вершиной 2. Учитывай подготовку visited, а не только dfs(2).',
        choices: [
          'Да: время и память O(1)',
          'Время Θ(log V), память O(V)',
          'Нет: время Θ(V), память Θ(V)',
          'Время Θ(V²), память Θ(V)',
        ],
        explanation:
          'Ядро dfs(2) делает постоянную работу, но traverse создаёт запись visited=false для каждого объекта Vertex. Ожидаемое время и память подготовки — Θ(V), даже если посещена одна вершина. Внешний цикл здесь не выполняется.',
        feedback: [
          'Посещение одной вершины не отменяет подготовку visited для всех V вершин.',
          'Деления пополам нет: требуется запись для каждой вершины.',
          'Верно: подготовка карты занимает ожидаемое линейное время и линейную память.',
          'Вложенного перебора всех пар нет: visited инициализируется один раз.',
        ],
      },
    },
  },
  en: {
    title: 'Test yourself: recursion and DFS',
    intro:
      '15 questions, from base cases to the stack, graph traversal and complexity. Check each answer for an explanation; revisit earlier questions without changing checked answers.',
    instructions:
      'Analyse the Java code and assumptions shown. Calls run sequentially; caching applies only where memo is explicitly shown. Arrays define the neighbour order.',
    previous: 'Previous question',
    perfect: 'All correct! You traced calls, returns and DFS, and analysed time and space.',
    practice:
      'Review the mistakes below and check your reasoning in the visualisation. A new attempt clears your answers.',
    levels: [
      'Result',
      'Return order',
      'Base case',
      'Call tree',
      'Find the bug',
      'Continuation',
      'Stack',
      'Next neighbour',
      'visited',
      'POST',
      'Traversal scope',
      'Time and stack',
      'Memoisation',
      'Full DFS',
      'Memory setup',
    ],
    questions: {
      value: {
        feedback: [
          '4 is the initial argument; all multiplications still need to execute.',
          'Factorial multiplies the values; this code does not compute 4 + 3 + 2 + 1.',
          '24 follows from all the returns and multiplications.',
          '4 × 4 does not match the recursive chain 4 × 3 × 2 × 1.',
        ],
      },
      'first-return': {
        feedback: [
          'factorial(4) waits for its nested calls and finishes last.',
          'factorial(1) reaches the base case immediately.',
          'factorial(3) still waits for factorial(2), which waits for factorial(1).',
          'Calls are nested: the deepest returns before its parents.',
        ],
      },
      base: {
        feedback: [
          'This condition returns an answer without another call.',
          'For n > 1 the method makes a nested call rather than stopping.',
          'n * n is a multiplication expression, not a stopping condition.',
          'n * child runs after the child returns; it is not a base-case test.',
        ],
      },
      calls: {
        feedback: [
          'Repeated invocations with equal arguments must also be counted.',
          'Both subtrees of each non-base call are needed: the full tree has 9 nodes.',
          'Each of the nine nodes is a separate invocation.',
          'This is not a complete binary tree with leaves at one level: base cases stop branches at different depths.',
        ],
      },
      bug: {
        feedback: [
          'There is no finite chain of n calls: the argument never changes.',
          'There is no base case with return 0 in the code.',
          'Returning n requires a corresponding return statement; this one starts another call.',
          'Without a reachable stopping condition the stack overflows.',
        ],
      },
      resume: {
        title: 'Where does factorial(4) resume?',
        assumptions: 'factorial(3) has just returned 6 to the waiting factorial(4).',
        choices: [
          'Restart factorial(4) from its first line',
          'Assign child = 6, then return 4 × 6 = 24',
          'Immediately return 6 to the calling program',
          'Replace its own n = 4 with n = 3',
        ],
        explanation:
          'The parent keeps n = 4 and its continuation. The return completes child = 6, then return n * child executes. The method does not restart.',
        feedback: [
          'A return resumes the suspended call after its nested call; it does not restart it.',
          'Saved variables and the continuation produce 24.',
          '6 is the child result; the parent still needs to multiply it by its own n = 4.',
          'Each frame has its own n. The child argument does not change the parent argument.',
        ],
      },
      stack: {
        title: 'What is on the stack now?',
        assumptions:
          'fibonacci(4) has followed its first left chain to entry into fibonacci(1), before that call returns. List only fibonacci arguments from top to bottom; exclude main.',
        choices: ['4 → 3 → 2 → 1', '1 → 2 → 3 → 4', 'Only 1', 'All nine invocations in the tree'],
        explanation:
          'The newest frame, fibonacci(1), is on top. fibonacci(2), fibonacci(3) and fibonacci(4) wait below it. Right branches have not run yet, so four frames are present.',
        feedback: [
          'That is bottom-to-top order; the question asks for top to bottom.',
          'The latest call is on top, with waiting parents below it.',
          'Waiting parents remain on the stack with their own variables.',
          'The tree records all invocations over time; the stack contains only simultaneously unfinished calls.',
        ],
      },
      'dfs-next': {
        title: 'Which neighbour does dfs(0) check after the return?',
        assumptions:
          'Start at 0. dfs(1) has finished completely, including dfs(3), and control has returned to dfs(0). Neighbour order: 0: [1, 2].',
        explanation:
          'dfs(0) saved i = 0. After dfs(1) returns, its loop increments i to 1 and reads next = 2. It does not restart the neighbour scan.',
        feedback: [
          '3 is a neighbour of vertex 1; its processing has already finished.',
          'The next entry in vertex 0’s neighbour list is 2.',
          '1 has been processed; the loop moves to the next position.',
          '0 is the current vertex, not the next entry in its neighbour list.',
        ],
      },
      'dfs-skip': {
        title: 'Why is the transition 2 → 0 skipped?',
        assumptions:
          'Cyclic graph, start 0. The call chain is dfs(0) → dfs(1) → dfs(2). dfs(2) is considering next = 0. v0 denotes the object for vertex 0.',
        choices: [
          '0 is smaller than 2',
          'Vertex 0 is already in POST',
          'visited.get(v0) is already true',
          'The graph has no cycles',
        ],
        explanation:
          'dfs(0) marked visited.get(v0) before visiting neighbours. !visited.get(v0) is false, so no new call is created. dfs(0) is still waiting and has not entered POST yet.',
        feedback: [
          'Vertex numbers do not determine whether a recursive transition is allowed.',
          'POST is updated when dfs(0) finishes; this frame is still waiting.',
          'The shared visited mark prevents re-entry, including around a cycle.',
          'The graph contains the cycle 0–1–2–0; visited makes traversal terminate safely.',
        ],
      },
      'dfs-post': {
        title: 'In what order is POST filled?',
        assumptions:
          'Start at 0, traverse the reachable part. Read neighbours in the shown native neighbour order. PRE records entry; POST records completion.',
        choices: ['3 → 1 → 2 → 0', '0 → 1 → 3 → 2', '3 → 2 → 1 → 0', '0 → 2 → 1 → 3'],
        explanation:
          'Leaf 3 finishes first, then its parent 1. Back at 0, vertex 2 is traversed, and 0 finishes last. POST: 3 → 1 → 2 → 0.',
        feedback: [
          'POST records completion: a child finishes before its parent.',
          'That is PRE, the order of entry into vertices.',
          '2 starts only after 1 has finished completely.',
          'The initial call 0 finishes last; the fixed neighbour order must also be respected.',
        ],
      },
      'dfs-scope': {
        title: 'What is PRE for traverse(graph, vertices, vertices.get(2), false)?',
        assumptions:
          'Vertex 2 is isolated. all = false means only the reachable part is traversed.',
        choices: ['0 → 1', '2 → 0 → 1 → 3 → 4', 'An empty list', 'Only 2'],
        explanation:
          'dfs(2) is called first, so PRE contains 2. It has no neighbours and the outer loop is disabled. Other components are not traversed.',
        feedback: [
          'The start is explicitly 2, not 0.',
          'This order would occur with all = true, using the outer loop after the starting call.',
          'An isolated starting vertex is still visited and added to PRE.',
          'Only vertex 2 is reachable from itself in this graph.',
        ],
      },
      'fib-cost': {
        title: 'How do naive Fibonacci time and space grow?',
        assumptions:
          'Analyse growth in n with O(1) long operations; ignore numeric overflow and machine limits. Auxiliary space is for the algorithm, excluding visualisation history. φ = (1 + √5) / 2.',
        choices: [
          'Time Θ(n), stack Θ(n)',
          'Time Θ(φⁿ), stack Θ(φⁿ)',
          'Time Θ(φⁿ), stack Θ(n)',
          'Time Θ(n), stack O(1)',
        ],
        explanation:
          'T(n) = T(n − 1) + T(n − 2) + Θ(1): repeated subproblems give Θ(φⁿ) time. Branches run sequentially; only one chain of depth Θ(n) is live at once.',
        feedback: [
          'Without a cache equal subproblems are recomputed many times; time is not linear.',
          'The whole tree is not on the stack at once. Child frames are removed after returning.',
          'An exponential total number of calls coexists with a linear peak stack.',
          'Repeated work gives exponential time, while unfinished parents need a linear stack.',
        ],
      },
      'memo-cost': {
        title: 'What changes with one shared memo cache?',
        assumptions:
          'A fresh Long[n + 1] is created once before fibonacci(n, memo). All calls use the same array. Operations cost O(1); analyse growth in n, ignoring numeric overflow.',
        choices: [
          'Time Θ(n); stack and cache together Θ(n)',
          'Time Θ(n); space Θ(n²)',
          'Time Θ(φⁿ); space Θ(n)',
          'Time and space O(1)',
        ],
        explanation:
          'Each non-base result is computed once; repeats read the cache. Cache setup and total time are Θ(n). One Θ(n) cache and a Θ(n) stack add together rather than multiply.',
        feedback: [
          'One shared cache removes repeated work while the first chain still has linear depth.',
          'memo is not copied into every frame: calls receive reference values pointing to the shared array.',
          'A cache hit creates no child calls, removing exponential work.',
          'The first computation still visits Θ(n) subproblems and allocates n + 1 slots.',
        ],
      },
      'dfs-cost': {
        title: 'What is the complexity of a full recursive DFS?',
        assumptions:
          'Call traverse(graph, vertices, start, true). Adjacency lists contain V vertices and E edges. ArrayList append is amortised O(1). Include stack, visited and PRE/POST in space; exclude the input graph and visualisation history. Identity-map operations are assumed to take expected O(1) time. ',
        choices: [
          'Time Θ(V), space O(V), regardless of E',
          'Time Θ(V + E), space O(V)',
          'Time Θ(V × E), space O(V²)',
          'Time Θ(V + E), space O(1)',
        ],
        explanation:
          'The outer loop checks V vertices and DFS reads each neighbour entry once. An undirected graph has 2E entries. Stack, visited and both result lists together need O(V) space.',
        feedback: [
          'Neighbour entries also need reading; the edge count affects time.',
          'Vertex visits and neighbour reads add up; auxiliary structures use linear space.',
          'All edges are not rescanned for every vertex: each adjacency list is read once.',
          'visited has V slots, and the stack can reach V frames in the worst case.',
        ],
      },
      'dfs-setup': {
        title: 'Does an isolated start make all of traverse constant?',
        assumptions:
          'Call traverse(graph, vertices, vertices.get(2), false). The shown example has 5 vertices; for asymptotic analysis consider similar graphs with growing V and isolated vertex 2. Include visited setup, not just dfs(2).',
        choices: [
          'Yes: time and space O(1)',
          'Time Θ(log V), space O(V)',
          'No: time Θ(V), space Θ(V)',
          'Time Θ(V²), space Θ(V)',
        ],
        explanation:
          'The dfs(2) core does constant work, but traverse creates a visited=false entry for every Vertex object. Setup takes expected Θ(V) time and Θ(V) space even if one vertex is visited. The outer loop does not run here.',
        feedback: [
          'Visiting one vertex does not remove visited setup for all V vertices.',
          'There is no halving: every vertex needs an entry.',
          'Correct: map setup takes expected linear time and linear space.',
          'No nested scan of every pair occurs: visited is initialised once.',
        ],
      },
    },
  },
  fi: {
    title: 'Testaa osaamisesi: rekursio ja DFS',
    intro:
      '15 kysymystä perustapauksista pinoon, graafin läpikäyntiin ja vaativuuteen. Jokaisen tarkistuksen jälkeen saat selityksen. Voit palata aiempiin kysymyksiin muuttamatta tarkistettuja vastauksia.',
    instructions:
      'Tutki näytettyä Java-koodia ja kysymyksen oletuksia. Kutsut suoritetaan peräkkäin; välimuistia käytetään vain, kun memo on mukana. Taulukot määräävät naapureiden järjestyksen.',
    previous: 'Edellinen kysymys',
    perfect:
      'Kaikki oikein! Seurasit kutsuja, paluita ja DFS:ää sekä analysoit ajan ja muistin käyttöä.',
    practice:
      'Tutki virheet alta ja tarkista päättelysi visualisoinnissa. Uusi yritys tyhjentää vastaukset.',
    levels: [
      'Tulos',
      'Paluujärjestys',
      'Perustapaus',
      'Kutsupuu',
      'Etsi virhe',
      'Jatkaminen',
      'Pino',
      'Seuraava naapuri',
      'visited',
      'POST',
      'Läpikäynnin laajuus',
      'Aika ja pino',
      'Välitulosten tallennus',
      'Koko DFS',
      'Muistin alustus',
    ],
    questions: {
      value: {
        feedback: [
          '4 on ensimmäisen kutsun argumentti; kertolaskut pitää vielä suorittaa.',
          'Kertoma kertoo luvut; koodi ei laske summaa 4 + 3 + 2 + 1.',
          '24 saadaan kaikkien paluiden ja kertolaskujen jälkeen.',
          '4 × 4 ei vastaa rekursiivista ketjua 4 × 3 × 2 × 1.',
        ],
      },
      'first-return': {
        feedback: [
          'factorial(4) odottaa sisempiä kutsuja ja valmistuu viimeisenä.',
          'factorial(1) saavuttaa perustapauksen heti.',
          'factorial(3) odottaa vielä factorial(2):ta, joka odottaa factorial(1):tä.',
          'Kutsut ovat sisäkkäisiä: syvin palaa ennen vanhempiaan.',
        ],
      },
      base: {
        feedback: [
          'Tämä ehto palauttaa vastauksen ilman uutta kutsua.',
          'Kun n > 1, metodi tekee sisemmän kutsun eikä pysähdy.',
          'n * n on kertolauseke, ei pysähtymisehto.',
          'n * child suoritetaan lapsen palattua; se ei testaa perustapausta.',
        ],
      },
      calls: {
        feedback: [
          'Myös samalla argumentilla tehdyt toistuvat kutsut pitää laskea.',
          'Jokaisen muun kuin perustapauksen molemmat alipuut tarvitaan: puussa on yhteensä 9 solmua.',
          'Jokainen yhdeksästä solmusta on erillinen kutsu.',
          'Puu ei ole täysi binääripuu, jonka lehdet ovat samalla tasolla: perustapaukset katkaisevat haarat eri syvyyksillä.',
        ],
      },
      bug: {
        feedback: [
          'Kutsuketjussa ei ole vain n kutsua: argumentti ei muutu.',
          'Koodissa ei ole perustapausta, jossa suoritettaisiin return 0.',
          'Arvon n palauttamiseen tarvitaan sitä vastaava return-lause; tässä tehdään uusi kutsu.',
          'Ilman saavutettavaa pysähtymisehtoa pino vuotaa yli.',
        ],
      },
      resume: {
        title: 'Mistä factorial(4) jatkaa?',
        assumptions: 'factorial(3) on juuri palauttanut arvon 6 odottavalle factorial(4):lle.',
        choices: [
          'Aloittaa factorial(4):n ensimmäiseltä riviltä',
          'Asettaa child = 6 ja palauttaa 4 × 6 = 24',
          'Palauttaa heti arvon 6 kutsuvalle ohjelmalle',
          'Korvaa oman arvonsa n = 4 arvolla n = 3',
        ],
        explanation:
          'Vanhempi säilyttää arvon n = 4 ja jatkokohdan. Paluu täydentää sijoituksen child = 6, minkä jälkeen suoritetaan return n * child. Metodi ei ala alusta.',
        feedback: [
          'Paluu jatkaa keskeytynyttä kutsua sisemmän kutsun jälkeen, ei alusta.',
          'Säilytetyt muuttujat ja jatkokohta tuottavat arvon 24.',
          '6 on lapsen tulos; vanhemman pitää vielä kertoa se omalla arvollaan n = 4.',
          'Jokaisella kehyksellä on oma n. Lapsen argumentti ei muuta vanhemman argumenttia.',
        ],
      },
      stack: {
        title: 'Mitä pinossa on nyt?',
        assumptions:
          'fibonacci(4) on edennyt ensimmäistä vasenta ketjua fibonacci(1):n alkuun ennen sen paluuta. Luettele vain fibonacci-kehysten argumentit ylhäältä alas; älä laske main-kehystä.',
        choices: ['4 → 3 → 2 → 1', '1 → 2 → 3 → 4', 'Vain 1', 'Kaikki puun yhdeksän kutsua'],
        explanation:
          'Uusin kehys fibonacci(1) on ylimpänä. Sen alla odottavat fibonacci(2), fibonacci(3) ja fibonacci(4). Oikeita haaroja ei ole vielä suoritettu, joten kehyksiä on neljä.',
        feedback: [
          'Tämä järjestys on pohjalta huipulle; kysymys pyytää järjestystä ylhäältä alas.',
          'Uusin kutsu on ylimpänä ja odottavat vanhemmat sen alla.',
          'Odottavat vanhemmat säilyvät pinossa omine muuttujineen.',
          'Puu tallentaa kaikki suorituksen kutsut; pinossa ovat vain samanaikaisesti keskeneräiset kutsut.',
        ],
      },
      'dfs-next': {
        title: 'Minkä naapurin dfs(0) tarkistaa paluun jälkeen?',
        assumptions:
          'Aloitus 0:sta. dfs(1) on valmistunut kokonaan, myös dfs(3), ja suoritus on palannut dfs(0):aan. Naapurijärjestys: 0: [1, 2].',
        explanation:
          'dfs(0) säilytti arvon i = 0. dfs(1):n paluun jälkeen silmukka kasvattaa i:n arvoon 1 ja lukee next = 2. Naapureiden käsittely ei ala alusta.',
        feedback: [
          '3 on solmun 1 naapuri; sen käsittely on jo valmis.',
          'Solmun 0 naapurilistan seuraava alkio on 2.',
          '1 on jo käsitelty; silmukka siirtyy seuraavaan kohtaan.',
          '0 on nykyinen solmu, ei sen naapurilistan seuraava alkio.',
        ],
      },
      'dfs-skip': {
        title: 'Miksi siirtymä 2 → 0 ohitetaan?',
        assumptions:
          'Syklinen graafi, aloitus 0:sta. Kutsuketju on dfs(0) → dfs(1) → dfs(2). dfs(2) tarkastelee naapuria next = 0. v0 tarkoittaa solmun 0 oliota.',
        choices: [
          '0 on pienempi kuin 2',
          'Solmu 0 on jo POST-listassa',
          'visited.get(v0) on jo true',
          'Graafissa ei ole syklejä',
        ],
        explanation:
          'dfs(0) merkitsi visited.get(v0):n ennen naapureihin siirtymistä. !visited.get(v0) on epätosi, joten uutta kutsua ei synny. dfs(0) odottaa vielä eikä ole POST-listassa.',
        feedback: [
          'Solmujen numerot eivät määrää rekursiivisen siirtymän sallittavuutta.',
          'POST päivitetään dfs(0):n valmistuessa; tämä kehys odottaa vielä.',
          'Yhteinen visited-merkintä estää uuden kutsun jo käytyyn solmuun, myös syklin kautta.',
          'Graafissa on sykli 0–1–2–0; visited mahdollistaa päättyvän läpikäynnin.',
        ],
      },
      'dfs-post': {
        title: 'Missä järjestyksessä POST täyttyy?',
        assumptions:
          'Aloitus 0:sta, vain saavutettava osa. Naapurit luetaan taulukoiden järjestyksessä. PRE kirjaa aloituksen, POST valmistumisen.',
        choices: ['3 → 1 → 2 → 0', '0 → 1 → 3 → 2', '3 → 2 → 1 → 0', '0 → 2 → 1 → 3'],
        explanation:
          'Lehti 3 valmistuu ensin, sitten sen vanhempi 1. Palattuaan 0:aan suoritus käy solmussa 2, ja 0 valmistuu viimeisenä. POST: 3 → 1 → 2 → 0.',
        feedback: [
          'POST kirjaa valmistumiset: lapsi ennen vanhempaa.',
          'Tämä on PRE eli solmuihin saapumisen järjestys.',
          '2 aloittaa vasta, kun 1 on kokonaan valmis.',
          'Alkukutsu 0 valmistuu viimeisenä; myös annettua naapurijärjestystä pitää noudattaa.',
        ],
      },
      'dfs-scope': {
        title: 'Mikä on PRE kutsulle traverse(graph, vertices, vertices.get(2), false)?',
        assumptions:
          'Solmu 2 on eristetty. all = false tarkoittaa vain saavutettavan osan läpikäyntiä.',
        choices: ['0 → 1', '2 → 0 → 1 → 3 → 4', 'Tyhjä lista', 'Vain 2'],
        explanation:
          'Ensin kutsutaan dfs(2), joten PRE sisältää arvon 2. Naapureita ei ole, ja ulompi silmukka on poistettu käytöstä. Muita komponentteja ei käydä läpi.',
        feedback: [
          'Aloitussolmuksi on annettu 2, ei 0.',
          'Tämä järjestys syntyisi arvolla all = true, jolloin ulompi silmukka jatkaa alkukutsun jälkeen.',
          'Myös eristetyssä aloitussolmussa käydään, ja se lisätään PRE-listaan.',
          'Tässä graafissa solmusta 2 saavutetaan vain solmu 2 itse.',
        ],
      },
      'fib-cost': {
        title: 'Miten naiivin Fibonaccin aika ja muisti kasvavat?',
        assumptions:
          'Tutki n:n kasvua O(1)-hintaisilla long-operaatioilla; lukuarvojen ylivuotoa ja koneen rajoja ei mallinneta. Lisämuisti koskee algoritmia, ei visualisoinnin historiaa. φ = (1 + √5) / 2.',
        choices: [
          'Aika Θ(n), pino Θ(n)',
          'Aika Θ(φⁿ), pino Θ(φⁿ)',
          'Aika Θ(φⁿ), pino Θ(n)',
          'Aika Θ(n), pino O(1)',
        ],
        explanation:
          'T(n) = T(n − 1) + T(n − 2) + Θ(1): toistuvat osaongelmat antavat ajan Θ(φⁿ). Haarat suoritetaan peräkkäin; kerrallaan elää yksi Θ(n)-syvyinen ketju.',
        feedback: [
          'Ilman välimuistia samat osaongelmat lasketaan monta kertaa; aika ei ole lineaarinen.',
          'Koko puu ei ole pinossa yhtä aikaa. Lapsikehykset poistetaan paluun jälkeen.',
          'Eksponentiaalinen kutsumäärä yhdistyy lineaariseen pinon huippukokoon.',
          'Toistuva työ antaa eksponentiaalisen ajan, ja odottavat vanhemmat tarvitsevat lineaarisen pinon.',
        ],
      },
      'memo-cost': {
        title: 'Mitä yksi yhteinen memo-välimuisti muuttaa?',
        assumptions:
          'Uusi Long[n + 1] luodaan kerran ennen kutsua fibonacci(n, memo). Kaikki kutsut käyttävät samaa taulukkoa. Operaatiot maksavat O(1); tutki n:n kasvua ilman lukuarvojen ylivuotoa.',
        choices: [
          'Aika Θ(n); pino ja välimuisti yhteensä Θ(n)',
          'Aika Θ(n); muisti Θ(n²)',
          'Aika Θ(φⁿ); muisti Θ(n)',
          'Aika ja muisti O(1)',
        ],
        explanation:
          'Jokainen muu kuin perustapaus lasketaan kerran; toistot lukevat välimuistia. Alustus ja kokonaisaika ovat Θ(n). Yksi Θ(n)-välimuisti ja Θ(n)-pino lasketaan yhteen, ei kerrota.',
        feedback: [
          'Yhteinen välimuisti poistaa toistuvan työn, mutta ensimmäisen ketjun syvyys on yhä lineaarinen.',
          'memo-taulukkoa ei kopioida joka kehykseen: kutsut saavat viitearvon yhteiseen taulukkoon.',
          'Välimuistiosuma ei luo lapsikutsuja, joten eksponentiaalinen työ poistuu.',
          'Ensimmäinen laskenta käy yhä Θ(n) osaongelmaa ja varaa n + 1 paikkaa.',
        ],
      },
      'dfs-cost': {
        title: 'Mikä on koko rekursiivisen DFS:n vaativuus?',
        assumptions:
          'Kutsu traverse(graph, vertices, start, true). Vieruslistoissa on V solmua ja E kaarta. ArrayList-lisäys on amortisoidusti O(1). Muisti sisältää pinon, visited-taulukon ja PRE/POST-listat, ei syötegraafia eikä visualisoinnin historiaa. Identiteettikuvauksen operaation oletetaan vievän odotetusti O(1) aikaa. ',
        choices: [
          'Aika Θ(V), muisti O(V), E:stä riippumatta',
          'Aika Θ(V + E), muisti O(V)',
          'Aika Θ(V × E), muisti O(V²)',
          'Aika Θ(V + E), muisti O(1)',
        ],
        explanation:
          'Ulompi silmukka tarkistaa V solmua, ja DFS lukee jokaisen naapurimerkinnän kerran. Suuntaamattomassa graafissa merkintöjä on 2E. Pino, visited ja molemmat tuloslistat tarvitsevat yhteensä O(V) muistia.',
        feedback: [
          'Myös naapurimerkinnät pitää lukea; kaarien määrä vaikuttaa aikaan.',
          'Solmukäynnit ja naapurimerkintöjen lukeminen summataan; apurakenteet tarvitsevat lineaarisen muistin.',
          'Kaikkia kaaria ei käydä uudelleen läpi jokaisessa solmussa: kukin lista luetaan kerran.',
          'visited sisältää V paikkaa, ja pino voi pahimmillaan kasvaa V kehykseen.',
        ],
      },
      'dfs-setup': {
        title: 'Tekeekö eristetty aloitussolmu koko traverse-kutsusta vakioaikaisen?',
        assumptions:
          'Kutsu traverse(graph, vertices, vertices.get(2), false). Esimerkissä on 5 solmua; asymptoottisessa tarkastelussa ajattele vastaavia graafeja, joissa V kasvaa ja solmu 2 on eristetty. Laske mukaan visited-alustus, älä vain dfs(2):ta.',
        choices: [
          'Kyllä: aika ja muisti O(1)',
          'Aika Θ(log V), muisti O(V)',
          'Ei: aika Θ(V), muisti Θ(V)',
          'Aika Θ(V²), muisti Θ(V)',
        ],
        explanation:
          'dfs(2):n ydin tekee vakiomäärän työtä, mutta traverse luo visited=false-merkinnän jokaiselle Vertex-oliolle. Alustus vie odotetusti Θ(V) aikaa ja Θ(V) tilaa, vaikka käydään vain yksi solmu. Ulompaa silmukkaa ei suoriteta.',
        feedback: [
          'Yhden solmun käynti ei poista kaikkien V solmun visited-alustusta.',
          'Puolittamista ei ole: jokainen solmu tarvitsee merkinnän.',
          'Oikein: kuvauksen alustus vie odotetusti lineaarisen ajan ja tilan.',
          'Kaikkia pareja ei käydä läpi: visited alustetaan kerran.',
        ],
      },
    },
  },
}
