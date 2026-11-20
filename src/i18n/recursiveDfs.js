export const recursiveDfsTranslations = {
  ru: {
    expandCode: 'Расширить код',
    restoreLayout: 'Обычный вид',
    title: 'Рекурсивный DFS: вызов, ожидание, продолжение',
    intro:
      'Следи за одной рекурсивной функцией: она помечает вершину, обходит ещё не посещённых соседей и возвращает управление родителю. Числового результата у dfs нет — меняются общие visited, PRE и POST.',
    example: 'Учебный граф',
    start: 'Стартовая вершина',
    scope: 'Область обхода',
    reachable: 'Из стартовой вершины',
    all: 'Весь граф',
    examples: {
      branching: [
        'Разветвление',
        'При старте из 0: 0 → 1 → 3, затем возврат к 0 и переход к соседу 2.',
      ],
      cycle: [
        'Цикл',
        'Треугольник 0 — 1 — 2 — 0. Рёбра к уже посещённым вершинам пропускаются без повторной рекурсии.',
      ],
      disconnected: [
        'Несвязный граф',
        'Есть компоненты {0, 1}, {2} и {3, 4}. Вершина 2 изолирована. Сравни два режима обхода.',
      ],
    },
    order:
      'В этих примерах рёбра добавлены так, что приложенный JAR перечисляет соседей по возрастанию ID. Это не общая гарантия сортировки neighbors(). Сначала идёт старт, затем явный список остальных корней.',
    graph: 'Граф',
    calls: 'Дерево вызовов',
    rightView: 'Представление обхода',
    code: 'Выполняемая строка Java',
    stack: 'Кадры dfs',
    recursiveOnly:
      'В стеке показаны только рекурсивные кадры dfs. Внешний traverse остаётся ждать их завершения.',
    shared: 'Общие данные',
    visited: 'visited: посещение',
    pre: 'PRE: порядок входа',
    post: 'POST: порядок выхода',
    visitedEntry: 'Вершина {v}: visited = {value}',
    none: '—',
    nextIndex: 'После возврата: продолжить тот же итератор, i = {i}',
    localNote:
      'v и next — ссылки на объекты Vertex этого вызова; i — число уже обработанных соседей. У каждого кадра свой Iterator<Vertex>. next() передвигает итератор при выборе соседа; после возврата ребёнка i увеличивается, и тот же итератор продолжает работу.',
    resume: 'Продолжение',
    resumeDfs: 'dfs({v}) #{call}: продолжить после вызова ребёнка, затем цикл с i = {i}',
    resumeDriver: 'traverse: строка {line}',
    control: 'возврат управления',
    active: 'Текущий шаг',
    discovered: 'Посещена',
    finished: 'Обработка завершена',
    edge: 'Проверяем ребро {from} → {to}',
    returnEdge: 'Возврат управления {from} → {to}',
    graphLabel: 'Учебный граф рекурсивного DFS',
    timeline: 'Шаг рекурсивного DFS',
    playback: 'Управление рекурсивным DFS',
    finish: 'К результату',
    reset: 'С начала',
    step: 'Шаг {current} / {total}',
    callsCount: 'Вызовов dfs: {count}',
    depth: 'Максимум кадров dfs: {depth}',
    lesson: 'Почему этот DFS работает',
    points: [
      [
        'Общее состояние и собственные переменные',
        'Java копирует значения ссылок: все кадры используют общие visited, pre и post. visited — IdentityHashMap<Vertex, Boolean>, поэтому одинаковые метки не объединяют вершины. У каждого вызова собственные ссылки v/next, счётчик i и итератор neighbors.',
      ],
      [
        'Сначала помечаем, затем вызываем',
        'visited.put(v, true) выполняется до чтения соседей. Проверка visited.get(next) пропускает уже обнаруженные вершины, включая переходы по циклу. Цвета Vertex этот базовый пример не меняет.',
      ],
      [
        'Ожидание и продолжение цикла',
        'Родитель ждёт на строке dfs(next, ...), сохраняя свой итератор, i и next. После возврата увеличивается i и проверяется neighbors.hasNext(). Тот же вызов продолжается, а не запускается заново.',
      ],
      [
        'Где условие завершения?',
        'Когда neighbors.hasNext() возвращает false, соседи закончились. Выполняется POST и метод возвращает управление. Новые вызовы открывают только ещё не посещённые вершины конечного графа.',
      ],
      [
        'PRE, POST и void',
        'PRE записывается при входе после пометки вершины; POST — после обработки всех соседей. Затем кадр снимается со стека. void возвращает управление, а не число; списки и visited уже содержат результат работы.',
      ],
      [
        'Одна компонента или весь граф',
        'Один dfs(start) посещает только достижимые вершины. Для остальных traverse запускает новые корневые вызовы. В дереве вызовов появится несколько корней — лес вызовов.',
      ],
    ],
    walkthrough: 'Разбери пример с разветвлением',
    show: 'Показать момент',
    moments: {
      mark: [
        'Вход в 0',
        'Сначала помечаем visited.get(v0). PRE ещё будет записан следующим шагом.',
      ],
      descend: [
        '1 ждёт 3',
        'dfs(0) ждёт dfs(1), а dfs(1) вызывает dfs(3). В каждом кадре сохранены свои i и next.',
      ],
      finishLeaf: [
        'Завершение вершины 3',
        'Единственный сосед 1 уже посещён. Соседи закончились, записываем POST для 3. Кадр ещё находится в стеке до возврата.',
      ],
      return: [
        'Возврат 3 → 1',
        'dfs(3) завершён и снят со стека. Управление возвращается в ожидающий dfs(1) к месту вызова ребёнка.',
      ],
      resume: [
        'Продолжение dfs(0)',
        'Родитель ждёт на строке dfs(next, ...), сохраняя свой итератор, i и next. После возврата увеличивается i и проверяется neighbors.hasNext(). Тот же вызов продолжается, а не запускается заново.',
      ],
      nextNeighbor: [
        'Следующий сосед — 2',
        'Родитель не перезапущен: теперь его i = 1, и из neighbors.next() выбран сосед 2.',
      ],
      done: [
        'Порядок входа и выхода',
        'PRE = [0, 1, 3, 2], POST = [3, 1, 2, 0]. Все четыре рекурсивных кадра завершились.',
      ],
    },
    adjacency: 'Списки смежности и порядок соседей',
    recursionLink: 'К объяснению рекурсии →',
    messages: {
      ready: 'Начнём с вершины {start}. Следующий шаг подготовит общие структуры.',
      initializeVisited:
        'Создаём общую IdentityHashMap: для каждого объекта Vertex начальное значение visited равно false.',
      initializeOrders:
        'Создаём общие списки pre и post. Рекурсивные вызовы будут дописывать в эти же списки.',
      start: 'traverse вызывает dfs({start}) и ждёт завершения рекурсии.',
      enter: 'Входим в dfs({v}), вызов №{call}. Создан кадр с собственным v = {v}.',
      mark: 'Помечаем объект вершины {v} в visited до обхода соседей, чтобы не войти в него повторно по циклу.',
      pre: 'PRE: записываем вход в вершину {v}.',
      loop: 'dfs({v}): проверяем neighbors.hasNext(). Уже обработано i = {i}, всего соседей на рисунке {length}.',
      neighbor:
        'dfs({v}): neighbors.next() выбрал вершину {next}; счётчик обработанных соседей пока i = {i}.',
      skip: 'Ребро {v} → {next}: объект соседа уже помечен в visited. Пропускаем без нового вызова.',
      check: 'Ребро {v} → {next}: сосед ещё не посещён. Можно создать дочерний вызов.',
      wait: 'dfs({v}) ждёт dfs({next}), сохраняя свой итератор и i = {i}.',
      resume:
        'Возвращаемся в dfs({v}) после dfs({next}). Пока i = {i}; далее цикл увеличит i до {nextI}, а не начнётся заново.',
      post: 'Все соседи вершины {v} рассмотрены. POST: записываем выход; кадр пока остаётся в стеке.',
      return:
        'dfs({v}) завершён и снят со стека. Управление возвращается в ожидающий dfs({parent}) к месту вызова ребёнка.',
      returnRoot:
        'Корневой dfs({v}) завершён. Управление возвращается внешнему traverse, а не другой вершине.',
      rootResume: 'traverse продолжает работу после завершения корневого dfs({v}).',
      all: 'Включён обход всего графа: внешний цикл найдёт ещё не посещённые вершины.',
      reachable:
        'Режим стартовой вершины: обойдена её достижимая часть; другие компоненты не запускаем.',
      outerLoop: 'Внешний цикл traverse рассматривает вершину {v}.',
      rootSkip: 'Вершина {v} уже посещена. Внешний цикл не создаёт повторный вызов.',
      root: 'Вершина {v} ещё не посещена. Начинаем новый корневой вызов для её компоненты.',
      done: 'Обход завершён: посещено {count} из {total} вершин. Стек рекурсивных вызовов пуст.',
      iterator:
        'dfs({v}) создаёт собственный Iterator<Vertex>; ни один другой кадр не двигает этот итератор.',
      advance:
        'dfs({v}): сосед с номером {i} обработан; увеличиваем i до {nextI} и продолжаем свой итератор.',
    },
  },
  en: {
    expandCode: 'Expand code',
    restoreLayout: 'Standard layout',
    title: 'Recursive DFS: call, wait, resume',
    intro:
      'Follow one recursive function: it marks a vertex, visits unseen neighbours and returns control to its caller. dfs returns no number; the shared visited, PRE and POST structures change.',
    example: 'Teaching graph',
    start: 'Starting vertex',
    scope: 'Traversal scope',
    reachable: 'From the starting vertex',
    all: 'Whole graph',
    examples: {
      branching: [
        'Branching',
        'Starting at 0: 0 → 1 → 3, then return to 0 and move to neighbour 2.',
      ],
      cycle: [
        'Cycle',
        'Triangle 0 — 1 — 2 — 0. Edges to visited vertices are skipped without repeated recursion.',
      ],
      disconnected: [
        'Disconnected graph',
        'Components are {0, 1}, {2} and {3, 4}. Vertex 2 is isolated. Compare the two traversal modes.',
      ],
    },
    order:
      'These fixtures insert edges so the supplied JAR enumerates neighbours in ascending ID order. This is not a general sorting guarantee of neighbors(). Visit the selected start first, then the explicit root list.',
    graph: 'Graph',
    calls: 'Call tree',
    rightView: 'Traversal view',
    code: 'Executing Java line',
    stack: 'dfs frames',
    recursiveOnly:
      'The stack shows recursive dfs frames only. The outer traverse call keeps waiting for them.',
    shared: 'Shared state',
    visited: 'visited: discovery',
    pre: 'PRE: entry order',
    post: 'POST: exit order',
    visitedEntry: 'Vertex {v}: visited = {value}',
    none: '—',
    nextIndex: 'After return: continue the same iterator, i = {i}',
    localNote:
      'v and next are this call’s Vertex references; i counts completed neighbours. Each frame owns an Iterator<Vertex>. next() advances it when selecting a neighbour; after the child returns, i increases and that same iterator continues.',
    resume: 'Continuation',
    resumeDfs: 'dfs({v}) #{call}: resume after the child call, then the loop with i = {i}',
    resumeDriver: 'traverse: line {line}',
    control: 'returning control',
    active: 'Current step',
    discovered: 'Visited',
    finished: 'Processing complete',
    edge: 'Inspect edge {from} → {to}',
    returnEdge: 'Return control {from} → {to}',
    graphLabel: 'Teaching graph for recursive DFS',
    timeline: 'Recursive DFS step',
    playback: 'Recursive DFS playback',
    finish: 'Jump to result',
    reset: 'Start over',
    step: 'Step {current} / {total}',
    callsCount: 'dfs calls: {count}',
    depth: 'Maximum dfs frames: {depth}',
    lesson: 'Why this DFS works',
    points: [
      [
        'Shared state and local variables',
        'Java copies reference values: every frame shares visited, pre and post. visited is an IdentityHashMap<Vertex, Boolean>, so equal labels do not merge vertices. Each call owns its v/next references, i counter and neighbors iterator.',
      ],
      [
        'Mark first, recurse second',
        'visited.put(v, true) runs before reading neighbours. visited.get(next) skips discovered vertices, including around a cycle. This basic example leaves Vertex colours unchanged.',
      ],
      [
        'Waiting and resuming the loop',
        'The parent waits at dfs(next, ...), keeping its iterator, i and next. After the return, i increases and neighbors.hasNext() is tested. That same call continues rather than restarting.',
      ],
      [
        'Where does the call stop?',
        'When neighbors.hasNext() is false, no neighbours remain. Record POST and return control. New calls discover only previously unseen vertices of the finite graph.',
      ],
      [
        'PRE, POST and void',
        'PRE is recorded on entry after marking the vertex; POST after all neighbours have been processed. The frame then leaves the stack. void returns control, not a number; the lists and visited already contain the output.',
      ],
      [
        'One component or the whole graph',
        'One dfs(start) visits only reachable vertices. For the others, traverse launches new root calls. The call tree then has multiple roots: a call forest.',
      ],
    ],
    walkthrough: 'Walk through the branching example',
    show: 'Show moment',
    moments: {
      mark: ['Enter 0', 'Mark visited.get(v0) first. PRE will be recorded in the next step.'],
      descend: [
        '1 waits for 3',
        'dfs(0) waits for dfs(1), and dfs(1) calls dfs(3). Each frame keeps its own i and next.',
      ],
      finishLeaf: [
        'Finish vertex 3',
        'Its only neighbour, 1, is already visited. No neighbours remain, so record POST for 3. The frame stays on the stack until the return.',
      ],
      return: [
        'Return 3 → 1',
        'dfs(3) has finished and left the stack. Control resumes waiting dfs(1) at the child-call site.',
      ],
      resume: [
        'Resume dfs(0)',
        'The parent waits at dfs(next, ...), keeping its iterator, i and next. After the return, i increases and neighbors.hasNext() is tested. That same call continues rather than restarting.',
      ],
      nextNeighbor: [
        'Next neighbour: 2',
        'The caller has not restarted: now its i = 1, and neighbors.next() selects neighbour 2.',
      ],
      done: [
        'Entry and exit order',
        'PRE = [0, 1, 3, 2], POST = [3, 1, 2, 0]. All four recursive frames have finished.',
      ],
    },
    adjacency: 'Adjacency lists and neighbour order',
    recursionLink: 'Recursion explained →',
    messages: {
      ready: 'Start at vertex {start}. The next step prepares the shared structures.',
      initializeVisited:
        'Create one shared IdentityHashMap: visited initially maps each Vertex object to false.',
      initializeOrders:
        'Create shared pre and post lists. Recursive calls append to these same lists.',
      start: 'traverse calls dfs({start}) and waits for the recursion to finish.',
      enter: 'Enter dfs({v}), call #{call}. Create a frame with its own v = {v}.',
      mark: 'Mark Vertex {v} in visited before scanning neighbours, preventing re-entry around a cycle.',
      pre: 'PRE: record entry into vertex {v}.',
      loop: 'dfs({v}): test neighbors.hasNext(). Completed count i = {i}; the drawing has {length} neighbours.',
      neighbor:
        'dfs({v}): neighbors.next() selected vertex {next}; the completed-neighbour count is still i = {i}.',
      skip: 'Edge {v} → {next}: the neighbour object is already marked in visited. Skip it without a new call.',
      check: 'Edge {v} → {next}: the neighbour is unseen. A child call can be created.',
      wait: 'dfs({v}) waits for dfs({next}), keeping its own iterator and i = {i}.',
      resume:
        'Resume dfs({v}) after dfs({next}). i is still {i}; next the loop increments i to {nextI} instead of restarting.',
      post: 'All neighbours of vertex {v} have been considered. POST records exit; the frame remains on the stack for now.',
      return:
        'dfs({v}) has finished and left the stack. Control resumes waiting dfs({parent}) at the child-call site.',
      returnRoot:
        'Root dfs({v}) has finished. Control returns to the outer traverse method, not another vertex.',
      rootResume: 'traverse resumes after root dfs({v}) has finished.',
      all: 'Whole graph mode: the outer loop will find vertices that are still unseen.',
      reachable:
        'Starting-vertex mode: its reachable portion is complete; do not start other components.',
      outerLoop: 'The outer traverse loop considers vertex {v}.',
      rootSkip: 'Vertex {v} is already visited. The outer loop creates no repeated call.',
      root: 'Vertex {v} is unseen. Start a new root call for its component.',
      done: 'Traversal complete: {count} of {total} vertices visited. The recursive call stack is empty.',
      iterator:
        'dfs({v}) creates its own Iterator<Vertex>; other frames do not advance this iterator.',
      advance:
        'dfs({v}): neighbour number {i} is complete; increment i to {nextI} and continue this iterator.',
    },
  },
  fi: {
    expandCode: 'Laajenna koodia',
    restoreLayout: 'Tavallinen näkymä',
    title: 'Rekursiivinen DFS: kutsu, odotus ja jatkaminen',
    intro:
      'Seuraa yhtä rekursiivista funktiota: se merkitsee solmun, käy käymättömät naapurit läpi ja palauttaa suorituksen kutsujalle. dfs ei palauta lukua; yhteiset visited, PRE ja POST muuttuvat.',
    example: 'Opetusgraafi',
    start: 'Aloitussolmu',
    scope: 'Läpikäynnin laajuus',
    reachable: 'Aloitussolmusta',
    all: 'Koko graafi',
    examples: {
      branching: [
        'Haarautuminen',
        'Aloitussolmusta 0: 0 → 1 → 3, sitten paluu solmuun 0 ja siirtyminen naapuriin 2.',
      ],
      cycle: [
        'Sykli',
        'Kolmio 0 — 1 — 2 — 0. Kaaret käytyihin solmuihin ohitetaan ilman toistuvaa rekursiota.',
      ],
      disconnected: [
        'Epäyhtenäinen graafi',
        'Komponentit ovat {0, 1}, {2} ja {3, 4}. Solmu 2 on eristetty. Vertaa kahta läpikäyntitapaa.',
      ],
    },
    order:
      'Näissä esimerkeissä kaaret lisätään niin, että mukana tuleva JAR luettelee naapurit kasvavassa ID-järjestyksessä. neighbors() ei yleisesti takaa lajittelua. Valittu aloitus käsitellään ensin, sitten eksplisiittinen juurilista.',
    graph: 'Graafi',
    calls: 'Kutsupuu',
    rightView: 'Läpikäynnin näkymä',
    code: 'Suoritettava Java-rivi',
    stack: 'dfs-kehykset',
    recursiveOnly:
      'Pinossa näkyvät vain rekursiiviset dfs-kehykset. Ulompi traverse-kutsu odottaa niiden valmistumista.',
    shared: 'Yhteinen tila',
    visited: 'visited: käydyt solmut',
    pre: 'PRE: saapumisjärjestys',
    post: 'POST: poistumisjärjestys',
    visitedEntry: 'Solmu {v}: visited = {value}',
    none: '—',
    nextIndex: 'Paluun jälkeen: jatka samaa iteraattoria, i = {i}',
    localNote:
      'v ja next ovat tämän kutsun Vertex-viitteet; i laskee käsitellyt naapurit. Jokaisella kehyksellä on oma Iterator<Vertex>. next() siirtää iteraattoria naapuria valittaessa; lapsen palattua i kasvaa ja sama iteraattori jatkaa.',
    resume: 'Jatkokohta',
    resumeDfs: 'dfs({v}) #{call}: jatka lapsikutsun jälkeen, sitten silmukka arvolla i = {i}',
    resumeDriver: 'traverse: rivi {line}',
    control: 'suorituksen paluu',
    active: 'Nykyinen vaihe',
    discovered: 'Käyty',
    finished: 'Käsittely valmis',
    edge: 'Tutkitaan kaarta {from} → {to}',
    returnEdge: 'Suorituksen paluu {from} → {to}',
    graphLabel: 'Rekursiivisen DFS:n opetusgraafi',
    timeline: 'Rekursiivisen DFS:n vaihe',
    playback: 'Rekursiivisen DFS:n ohjaus',
    finish: 'Siirry tulokseen',
    reset: 'Alusta',
    step: 'Vaihe {current} / {total}',
    callsCount: 'dfs-kutsuja: {count}',
    depth: 'Eniten dfs-kehyksiä: {depth}',
    lesson: 'Miksi tämä DFS toimii',
    points: [
      [
        'Yhteinen tila ja paikalliset muuttujat',
        'Java kopioi viitearvot: visited, pre ja post ovat yhteisiä. visited on IdentityHashMap<Vertex, Boolean>, joten samannimiset solmut eivät yhdisty. Jokaisella kutsulla on omat v/next-viitteensä, i-laskurinsa ja neighbors-iteraattorinsa.',
      ],
      [
        'Ensin merkintä, sitten rekursio',
        'visited.put(v, true) suoritetaan ennen naapurien lukemista. visited.get(next) ohittaa löydetyt solmut myös syklissä. Tämä perusesimerkki säilyttää Vertex-oliot väreineen.',
      ],
      [
        'Odottaminen ja silmukan jatkaminen',
        'Vanhempi odottaa kohdassa dfs(next, ...) säilyttäen iteraattorin, i:n ja nextin. Paluun jälkeen i kasvaa ja neighbors.hasNext() tarkistetaan. Sama kutsu jatkuu alkamisen sijaan alusta.',
      ],
      [
        'Missä kutsu päättyy?',
        'Kun neighbors.hasNext() on false, naapureita ei enää ole. Kirjaa POST ja palauta suoritus. Uudet kutsut löytävät vain aiemmin käymättömiä äärellisen verkon solmuja.',
      ],
      [
        'PRE, POST ja void',
        'PRE kirjataan saapuessa solmun merkinnän jälkeen; POST kaikkien naapurien käsittelyn jälkeen. Kehys poistuu sitten pinosta. void palauttaa suorituksen, ei lukua; tulos on jo listoissa ja visited-taulukossa.',
      ],
      [
        'Yksi komponentti vai koko graafi',
        'Yksi dfs(start) käy vain saavutettavat solmut. Muille traverse käynnistää uusia juurikutsuja. Kutsupuussa on silloin useita juuria eli kutsumetsä.',
      ],
    ],
    walkthrough: 'Tutki haarautuva esimerkki',
    show: 'Näytä hetki',
    moments: {
      mark: [
        'Saapuminen solmuun 0',
        'Merkitään ensin visited.get(v0). PRE kirjataan vasta seuraavassa vaiheessa.',
      ],
      descend: [
        '1 odottaa solmua 3',
        'dfs(0) odottaa kutsua dfs(1), ja dfs(1) kutsuu dfs(3):a. Jokaisella kehyksellä on oma i ja next.',
      ],
      finishLeaf: [
        'Solmu 3 valmistuu',
        'Sen ainoa naapuri 1 on jo käyty. Naapurit loppuivat, joten kirjataan solmun 3 POST. Kehys jää pinoon paluuseen asti.',
      ],
      return: [
        'Paluu 3 → 1',
        'dfs(3) päättyi ja poistui pinosta. Suoritus palaa odottavaan dfs(1)-kutsuun lapsikutsun kohdalle.',
      ],
      resume: [
        'Jatketaan kutsua dfs(0)',
        'Vanhempi odottaa kohdassa dfs(next, ...) säilyttäen iteraattorin, i:n ja nextin. Paluun jälkeen i kasvaa ja neighbors.hasNext() tarkistetaan. Sama kutsu jatkuu alkamisen sijaan alusta.',
      ],
      nextNeighbor: [
        'Seuraava naapuri: 2',
        'Kutsuja ei aloittanut alusta: nyt i = 1, ja neighbors.next() valitsee naapuriksi solmun 2.',
      ],
      done: [
        'Saapumis- ja poistumisjärjestys',
        'PRE = [0, 1, 3, 2], POST = [3, 1, 2, 0]. Kaikki neljä rekursiivista kehystä ovat valmistuneet.',
      ],
    },
    adjacency: 'Vieruslistat ja naapurien järjestys',
    recursionLink: 'Rekursion selitykseen →',
    messages: {
      ready: 'Aloitetaan solmusta {start}. Seuraava vaihe valmistelee yhteiset rakenteet.',
      initializeVisited:
        'Luo yhteinen IdentityHashMap: jokaisen Vertex-olion visited-arvo on aluksi false.',
      initializeOrders:
        'Luodaan yhteiset pre- ja post-listat. Rekursiiviset kutsut lisäävät näihin samoihin listoihin.',
      start: 'traverse kutsuu dfs({start}) ja odottaa rekursion päättymistä.',
      enter: 'Saavutaan kutsuun dfs({v}), kutsu #{call}. Luodaan kehys, jonka oma v = {v}.',
      mark: 'Merkitse Vertex {v} visited-kuvaukseen ennen naapureita, jotta sykli ei aiheuta uutta sisäänmenoa.',
      pre: 'PRE: kirjataan saapuminen solmuun {v}.',
      loop: 'dfs({v}): tarkista neighbors.hasNext(). Käsiteltyjä i = {i}; kuvassa naapureita on {length}.',
      neighbor:
        'dfs({v}): neighbors.next() valitsi solmun {next}; käsiteltyjen laskuri on vielä i = {i}.',
      skip: 'Kaari {v} → {next}: naapuriolio on jo merkitty visited-kuvaukseen. Ohita ilman uutta kutsua.',
      check: 'Kaari {v} → {next}: naapuri on käymätön. Lapsikutsu voidaan luoda.',
      wait: 'dfs({v}) odottaa kutsua dfs({next}) säilyttäen oman iteraattorin ja arvon i = {i}.',
      resume:
        'Jatketaan kutsua dfs({v}) kutsun dfs({next}) jälkeen. i on yhä {i}; seuraavaksi silmukka kasvattaa sen arvoon {nextI}, eikä ala alusta.',
      post: 'Kaikki solmun {v} naapurit on tutkittu. POST kirjaa poistumisen; kehys on vielä pinossa.',
      return:
        'dfs({v}) päättyi ja poistui pinosta. Suoritus palaa odottavaan dfs({parent})-kutsuun lapsikutsun kohdalle.',
      returnRoot:
        'Juurikutsu dfs({v}) valmistui. Suoritus palaa ulompaan traverse-metodiin, ei toiseen solmuun.',
      rootResume: 'traverse jatkuu juurikutsun dfs({v}) valmistuttua.',
      all: 'Koko graafi: ulompi silmukka löytää vielä käymättömät solmut.',
      reachable:
        'Aloitussolmun tila: sen saavutettava osa on valmis; muita komponentteja ei aloiteta.',
      outerLoop: 'Ulompi traverse-silmukka tarkastelee solmua {v}.',
      rootSkip: 'Solmu {v} on jo käyty. Ulompi silmukka ei luo uutta kutsua.',
      root: 'Solmu {v} on käymätön. Aloitetaan uusi juurikutsu sen komponentille.',
      done: 'Läpikäynti valmis: {count}/{total} solmua käyty. Rekursiivinen kutsupino on tyhjä.',
      iterator: 'dfs({v}) luo oman Iterator<Vertex>-iteraattorin; muut kehykset eivät siirrä sitä.',
      advance:
        'dfs({v}): naapuri numero {i} on käsitelty; kasvata i arvoon {nextI} ja jatka omaa iteraattoria.',
    },
  },
}
