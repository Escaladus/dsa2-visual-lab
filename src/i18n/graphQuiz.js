export const graphQuizTranslations = {
  ru: {
    title: 'Проверь себя: DFS и BFS',
    intro:
      '12 заданий по зафиксированным состояниям графов. Определи продолжение, цвета, типы рёбер и подходящий алгоритм. После проверки доступны объяснение и классификация.',
    instructions:
      'Используй показанные граф, старт, область и возрастающий порядок соседей. Текущий учебный запуск выше не меняет условия теста. До проверки тип рассматриваемого ребра скрыт.',
    previous: 'Предыдущий вопрос',
    perfect: 'Все ответы верны: ты различаешь механизм обхода, цвета, рёбра и приложения.',
    practice:
      'Изучи объяснения ошибок и попробуй снова. Проверенные ответы нельзя менять, но к ним можно вернуться.',
    levels: [
      'Продолжение DFS',
      'GREY в DFS',
      'GREY в BFS',
      'PRE и POST',
      'Tree',
      'Back',
      'Forward',
      'Cross',
      'Родительское ребро',
      'Лес обхода',
      'Кратчайший путь',
      'Топологический порядок',
    ],
    questions: {
      resume: {
        title: 'Какого соседа dfs(0) рассмотрит следующим?',
        assumptions: 'dfs(1) полностью завершился; выполнение вернулось в dfs(0). 0: [1, 2].',
        choices: ['3', '1', '2', '0'],
        explanation: 'Сохранён i = 0. После возврата цикл увеличит его до 1 и прочитает next = 2.',
        feedback: [
          '3 был соседом 1, а сейчас продолжается кадр 0.',
          '1 уже обработан; перебор не начинается сначала.',
          'Следующий индекс 1 соответствует соседу 2.',
          '0 — текущая вершина, а не следующий сосед.',
        ],
      },
      dfsGrey: {
        title: 'Что означает GREY у ожидающего dfs(1)?',
        assumptions: 'dfs(1) собирается вызвать dfs(3), а dfs(0) ждёт его.',
        choices: [
          'Вершина обнаружена, но её соседи ещё не закончены',
          'Вершина ещё не обнаружена',
          'Все соседи завершены',
          'Вершина обязательно находится в очереди',
        ],
        explanation:
          'GREY означает незавершённый обход соседей. Ожидающий родитель остаётся GREY до завершения всех своих ветвей.',
        feedback: [
          'Ожидание ребёнка не завершает обработку родителя.',
          'Необнаруженная вершина была бы WHITE.',
          'После всех соседей вершина станет BLACK.',
          'В рекурсивном DFS используется стек, не очередь BFS.',
        ],
      },
      bfsGrey: {
        title: 'Какой цвет у 0 сразу после извлечения из очереди?',
        assumptions: 'BFS только что извлёк 0. Ни один её сосед ещё не рассмотрен.',
        choices: ['WHITE', 'BLACK', 'GREY', 'Зависит от числа соседей'],
        explanation:
          'Вершина остаётся GREY во время обработки. BLACK ставится после просмотра всех соседей, а не при извлечении.',
        feedback: [
          '0 уже обнаружена; обратно в WHITE цвет не меняется.',
          'Извлечение не означает, что соседи уже обработаны.',
          'Текущая извлечённая вершина остаётся GREY.',
          'Порядок событий одинаков: извлечь, обработать соседей, поставить BLACK.',
        ],
      },
      post: {
        title: 'Что означает POST для листа 3?',
        assumptions: 'Все соседи 3 рассмотрены; dfs(0) и dfs(1) ещё ожидают.',
        choices: [
          'Начало всего обхода',
          'Завершение обработки соседей вершины 3',
          'Завершение всех вершин графа',
          'Повторный вход в вершину 3',
        ],
        explanation:
          'POST записывается после всех соседей текущей вершины. Родительские вызовы ещё должны продолжить работу.',
        feedback: [
          'Вход фиксируется в PRE, а не в POST.',
          'Завершилась работа с соседями текущего листа.',
          'В стеке остались ожидающие родители.',
          'POST — событие завершения, не новый вызов.',
        ],
      },
      tree: {
        title: 'Какой тип получит ребро 0 → 1?',
        assumptions: 'DFS рассматривает соседнюю WHITE-вершину 1.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation: 'Ребро к WHITE-вершине вызывает первое обнаружение и становится древесным.',
        feedback: [
          'Будет создан новый дочерний вызов.',
          'Back ведёт к GREY-предку, а цель здесь WHITE.',
          'Forward ведёт к уже завершённому потомку.',
          'Cross ведёт к другой завершённой ветви.',
        ],
      },
      back: {
        title: 'Как классифицируется 2 → 0?',
        assumptions: 'Направленный DFS идёт по цепочке 0 → 1 → 2. Цель 0 имеет цвет GREY.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation: 'GREY-цель — активный предок. Ребро замыкает цикл 0 → 1 → 2 → 0.',
        feedback: [
          '0 уже обнаружена, поэтому новый ребёнок не создаётся.',
          'Переход возвращает к активному предку и доказывает цикл.',
          'Forward направлен к потомку, а не предку.',
          'Цель лежит в текущей ветви, а не в другой завершённой.',
        ],
      },
      forward: {
        title: 'Как классифицируется 0 → 2 после возврата из 1?',
        assumptions: '2 уже BLACK, tin[0] = 1, tin[2] = 3. Древесный путь к 2: 0 → 1 → 2.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation:
          '2 — завершённый потомок 0, но ребро 0 → 2 не создавало его вызов. Это forward.',
        feedback: [
          'Древесным было 1 → 2; повторное ребро к потомку не становится tree.',
          'У цели BLACK, а не GREY.',
          'Более поздний tin BLACK-цели указывает на потомка текущей вершины.',
          'tin[2] больше tin[0], и 2 входит в поддерево 0.',
        ],
      },
      cross: {
        title: 'Как классифицируется 3 → 2?',
        assumptions: '2 уже BLACK в завершённой ветви через 1. tin[3] = 6, tin[2] = 3.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation:
          'Цель завершена раньше обнаружения 3 и лежит в другой ветви. После полного обхода их интервалы не пересекаются.',
        feedback: [
          '2 уже обнаружена, нового вызова не будет.',
          'BLACK-цель не является активным GREY-предком.',
          'У цели более ранний tin; она не потомок 3.',
          'Это переход к другой, уже завершённой ветви.',
        ],
      },
      parent: {
        title: 'Доказывает ли ребро 1 → 0 цикл?',
        assumptions: 'Граф неориентированный. DFS пришёл из 0 в 1 по тому же физическому ребру.',
        choices: [
          'Да: любая GREY-цель доказывает цикл',
          'Нет: это обратная запись древесного ребра к родителю',
          'Да: у графа больше одной вершины',
          'Нет: в неориентированных графах вообще нет циклов',
        ],
        explanation:
          'Две записи смежности одного древесного ребра не образуют цикл. Нужно исключить непосредственное ребро к родителю.',
        feedback: [
          'Это правило без исключения родителя относится к направленному DFS.',
          'Мы возвращаемся по тому же ребру, а не замыкаем новый цикл.',
          'Количество вершин само по себе ничего не доказывает.',
          'Неориентированный треугольник содержит цикл.',
        ],
      },
      forest: {
        title: 'Что означают корни 2, 0 и 4 после полного DFS?',
        assumptions: 'Направленный DAG; старт 2, затем внешний цикл по вершинам.',
        choices: [
          'Три компоненты сильной связности',
          'Три компоненты слабой связности',
          'Три дерева леса обхода, не обязательно компоненты',
          'Ошибка: в DFS может быть только один корень',
        ],
        explanation:
          'Внешний цикл создаёт дерево для каждой оставшейся WHITE-вершины. В направленном графе лес зависит от старта и порядка; здесь DAG имеет пять SCC.',
        feedback: [
          'У DAG без петель каждая из пяти вершин — отдельная SCC.',
          'В этом графе слабых компонент две, а деревьев три.',
          'Корни характеризуют конкретный обход, а не определение связности.',
          'Для недостижимых из предыдущих корней вершин создаются новые деревья.',
        ],
      },
      shortest: {
        title: 'Какой обход гарантирует кратчайший путь 0 → 2?',
        assumptions: 'Направленный невзвешенный DAG. Есть пути 0 → 2 и 0 → 1 → 2.',
        choices: [
          'BFS: 0 → 2',
          'DFS: первый найденный путь всегда кратчайший',
          'Оба обязаны выбрать 0 → 1 → 2',
          'Ни один: нужны веса',
        ],
        explanation:
          'BFS обнаруживает вершины слоями расстояния. Первый найденный им путь имеет минимум рёбер: здесь одно ребро.',
        feedback: [
          '2 — непосредственный сосед 0 и получает расстояние 1.',
          'DFS сначала может углубиться через 1 и найти путь из двух рёбер.',
          'Прямое ребро 0 → 2 позволяет BFS получить более короткий путь.',
          'Для минимального числа рёбер веса не требуются.',
        ],
      },
      topological: {
        title: 'Можно ли выдать обратный POST как топологический порядок?',
        assumptions: 'Полный DFS направленного графа нашёл back edge и цикл 0 → 1 → 2 → 0.',
        choices: [
          'Да, после любого полного DFS',
          'Да, если все вершины BLACK',
          'Да, если выбрать другой старт',
          'Нет: граф с циклом не имеет топологического порядка',
        ],
        explanation:
          'Обратный POST даёт топологический порядок только для DAG. Обнаруженный цикл запрещает выдавать такой результат.',
        feedback: [
          'Сам факт завершения DFS не гарантирует отсутствие циклов.',
          'Циклический граф тоже можно полностью обработать и покрасить BLACK.',
          'Другой старт не удаляет рёбра цикла.',
          'Ограничения цикла невозможно удовлетворить линейным порядком.',
        ],
      },
    },
  },
  en: {
    title: 'Test yourself: DFS and BFS',
    intro:
      '12 tasks with fixed graph states. Identify continuations, colours, edge types and the right algorithm. Checking reveals the explanation and classification.',
    instructions:
      'Use the graph, start, scope and ascending neighbour order shown. The live traversal above does not change these questions. The inspected edge type is hidden until checking.',
    previous: 'Previous question',
    perfect: 'All correct: you distinguish traversal mechanics, colours, edges and applications.',
    practice:
      'Review the mistakes and retry. Checked answers stay fixed, but you can revisit them.',
    levels: [
      'DFS continuation',
      'DFS GREY',
      'BFS GREY',
      'PRE and POST',
      'Tree',
      'Back',
      'Forward',
      'Cross',
      'Parent edge',
      'Traversal forest',
      'Shortest path',
      'Topological order',
    ],
    questions: {
      resume: {
        title: 'Which neighbour will dfs(0) inspect next?',
        assumptions: 'dfs(1) has finished completely and control returned to dfs(0). 0: [1, 2].',
        choices: ['3', '1', '2', '0'],
        explanation: 'The saved i is 0. The loop increments it to 1 and reads next = 2.',
        feedback: [
          '3 was a neighbour of 1; frame 0 is now resuming.',
          '1 is already processed; scanning does not restart.',
          'The next index 1 selects neighbour 2.',
          '0 is the current vertex, not the next neighbour.',
        ],
      },
      dfsGrey: {
        title: 'What does GREY mean for the waiting dfs(1)?',
        assumptions: 'dfs(1) is about to call dfs(3), while dfs(0) waits.',
        choices: [
          'Discovered, but its neighbours are unfinished',
          'Not yet discovered',
          'All neighbours are finished',
          'It must be in a queue',
        ],
        explanation:
          'GREY marks unfinished neighbour processing. A waiting parent stays GREY until all its branches finish.',
        feedback: [
          'Waiting for a child does not finish the parent.',
          'An undiscovered vertex would be WHITE.',
          'After all neighbours it becomes BLACK.',
          'Recursive DFS uses a stack, not the BFS queue.',
        ],
      },
      bfsGrey: {
        title: 'What colour is 0 immediately after dequeueing?',
        assumptions: 'BFS has just removed 0. None of its neighbours has been examined.',
        choices: ['WHITE', 'BLACK', 'GREY', 'It depends on the number of neighbours'],
        explanation:
          'The vertex remains GREY while processing neighbours. BLACK is set after all neighbours, not on removal.',
        feedback: [
          '0 is already discovered; it does not turn WHITE again.',
          'Removal does not mean the neighbours are finished.',
          'The current removed vertex remains GREY.',
          'The sequence is remove, inspect neighbours, then BLACK.',
        ],
      },
      post: {
        title: 'What does POST for leaf 3 mean?',
        assumptions: 'All neighbours of 3 are examined; dfs(0) and dfs(1) are still waiting.',
        choices: [
          'The entire traversal starts',
          'Vertex 3’s neighbours are finished',
          'Every graph vertex is finished',
          'Vertex 3 is entered again',
        ],
        explanation:
          'POST follows all neighbours of the current vertex. Parent calls still need to resume.',
        feedback: [
          'Entry is PRE rather than POST.',
          'Neighbour processing for this leaf is complete.',
          'Waiting parents remain on the stack.',
          'POST is completion, not a new invocation.',
        ],
      },
      tree: {
        title: 'Which type will edge 0 → 1 receive?',
        assumptions: 'DFS inspects the neighbouring WHITE vertex 1.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation: 'An edge to WHITE causes first discovery and becomes a tree edge.',
        feedback: [
          'A new child invocation will be created.',
          'Back leads to a GREY ancestor; this target is WHITE.',
          'Forward leads to an already finished descendant.',
          'Cross leads to another finished branch.',
        ],
      },
      back: {
        title: 'How is 2 → 0 classified?',
        assumptions: 'Directed DFS follows 0 → 1 → 2. Target 0 is GREY.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation: 'The GREY target is an active ancestor. The edge closes cycle 0 → 1 → 2 → 0.',
        feedback: [
          '0 is already discovered, so no child is created.',
          'This reaches an active ancestor and proves a cycle.',
          'Forward leads to a descendant rather than an ancestor.',
          'The target belongs to the current branch, not a different finished one.',
        ],
      },
      forward: {
        title: 'How is 0 → 2 classified after 1 returns?',
        assumptions: '2 is BLACK, tin[0] = 1, tin[2] = 3. Its tree path is 0 → 1 → 2.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation:
          '2 is a finished descendant of 0, but edge 0 → 2 did not create its call. It is forward.',
        feedback: [
          '1 → 2 was the tree edge; another edge to the descendant is not tree.',
          'The target is BLACK, not GREY.',
          'A later tin for a BLACK target identifies a descendant of the current vertex.',
          'tin[2] exceeds tin[0], and 2 belongs to 0’s subtree.',
        ],
      },
      cross: {
        title: 'How is 3 → 2 classified?',
        assumptions: '2 is BLACK in the completed branch through 1. tin[3] = 6, tin[2] = 3.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation:
          'The target finished before 3 was discovered and belongs to another branch. Their completed intervals are disjoint.',
        feedback: [
          '2 was already discovered; there will be no child call.',
          'A BLACK target is not an active GREY ancestor.',
          'The target has an earlier tin and is not a descendant of 3.',
          'This reaches another, already completed branch.',
        ],
      },
      parent: {
        title: 'Does edge 1 → 0 prove a cycle?',
        assumptions: 'The graph is undirected. DFS reached 1 from 0 using this same physical edge.',
        choices: [
          'Yes: any GREY target proves a cycle',
          'No: this is the reverse record of the parent tree edge',
          'Yes: the graph has more than one vertex',
          'No: undirected graphs never have cycles',
        ],
        explanation:
          'Two adjacency records of one tree edge do not form a cycle. Exclude the immediate parent edge.',
        feedback: [
          'Without the parent exception this rule applies to directed DFS.',
          'This traverses the same edge backwards, not a new cycle.',
          'Vertex count alone proves nothing about cycles.',
          'An undirected triangle contains a cycle.',
        ],
      },
      forest: {
        title: 'What do roots 2, 0 and 4 mean after full DFS?',
        assumptions: 'Directed DAG; start 2, followed by an outer loop over vertices.',
        choices: [
          'Three strongly connected components',
          'Three weakly connected components',
          'Three traversal forest trees, not necessarily components',
          'An error: DFS can only have one root',
        ],
        explanation:
          'The outer loop starts a tree for each remaining WHITE vertex. In a directed graph the forest depends on start and order; this DAG has five SCCs.',
        feedback: [
          'Each of this DAG’s five vertices is its own SCC.',
          'There are two weak components here, but three traversal trees.',
          'Roots describe this traversal, not a connectivity definition.',
          'Vertices unreachable from earlier roots start new trees.',
        ],
      },
      shortest: {
        title: 'Which traversal guarantees the shortest path 0 → 2?',
        assumptions: 'Directed unweighted DAG. Paths include 0 → 2 and 0 → 1 → 2.',
        choices: [
          'BFS: 0 → 2',
          'DFS: its first path is always shortest',
          'Both must select 0 → 1 → 2',
          'Neither: weights are required',
        ],
        explanation:
          'BFS discovers vertices in distance layers. Its first path minimises the edge count: one edge here.',
        feedback: [
          '2 is an immediate neighbour of 0 and receives distance 1.',
          'DFS may first descend through 1 and find a two-edge path.',
          'The direct edge 0 → 2 lets BFS find a shorter path.',
          'Weights are unnecessary for minimising edge count.',
        ],
      },
      topological: {
        title: 'Can reversed POST be returned as a topological order?',
        assumptions: 'Full directed DFS found a back edge and cycle 0 → 1 → 2 → 0.',
        choices: [
          'Yes, after any full DFS',
          'Yes, when all vertices are BLACK',
          'Yes, after choosing another start',
          'No: a cyclic graph has no topological order',
        ],
        explanation:
          'Reversed POST gives a topological order only for a DAG. The detected cycle rules it out.',
        feedback: [
          'Completing DFS does not guarantee acyclicity.',
          'A cyclic graph can also be completely processed and BLACK.',
          'Another start does not remove the cycle’s edges.',
          'A linear order cannot satisfy all constraints around a cycle.',
        ],
      },
    },
  },
  fi: {
    title: 'Testaa osaamisesi: DFS ja BFS',
    intro:
      '12 tehtävää kiinteistä graafitiloista. Tunnista jatkokohdat, värit, kaarityypit ja sopiva algoritmi. Tarkistus näyttää selityksen ja luokittelun.',
    instructions:
      'Käytä näytettyä graafia, aloitusta, laajuutta ja nousevaa naapurijärjestystä. Yllä olevan läpikäynnin vaihe ei muuta tehtäviä. Tarkasteltavan kaaren tyyppi piilotetaan tarkistukseen asti.',
    previous: 'Edellinen kysymys',
    perfect: 'Kaikki oikein: erotat läpikäynnin mekanismin, värit, kaaret ja sovellukset.',
    practice:
      'Tutki virheet ja yritä uudelleen. Tarkistetut vastaukset säilyvät, mutta voit palata niihin.',
    levels: [
      'DFS:n jatkaminen',
      'DFS:n GREY',
      'BFS:n GREY',
      'PRE ja POST',
      'Tree',
      'Back',
      'Forward',
      'Cross',
      'Vanhempikaari',
      'Läpikäyntimetsä',
      'Lyhin polku',
      'Topologinen järjestys',
    ],
    questions: {
      resume: {
        title: 'Minkä naapurin dfs(0) tarkistaa seuraavaksi?',
        assumptions: 'dfs(1) on valmistunut kokonaan ja suoritus palasi dfs(0):aan. 0: [1, 2].',
        choices: ['3', '1', '2', '0'],
        explanation: 'Tallennettu i on 0. Silmukka kasvattaa sen arvoon 1 ja lukee next = 2.',
        feedback: [
          '3 oli solmun 1 naapuri; nyt jatkaa kehys 0.',
          '1 on jo käsitelty; läpikäynti ei ala alusta.',
          'Seuraava indeksi 1 valitsee naapurin 2.',
          '0 on nykyinen solmu, ei seuraava naapuri.',
        ],
      },
      dfsGrey: {
        title: 'Mitä odottavan dfs(1):n GREY tarkoittaa?',
        assumptions: 'dfs(1) on kutsumassa dfs(3):a ja dfs(0) odottaa.',
        choices: [
          'Löydetty, mutta naapurit ovat kesken',
          'Ei vielä löydetty',
          'Kaikki naapurit ovat valmiit',
          'Solmun on oltava jonossa',
        ],
        explanation:
          'GREY tarkoittaa keskeneräistä naapureiden käsittelyä. Odottava vanhempi pysyy GREY:nä kaikkien haarojensa valmistumiseen asti.',
        feedback: [
          'Lapsen odottaminen ei viimeistele vanhempaa.',
          'Löytämätön solmu olisi WHITE.',
          'Kaikkien naapureiden jälkeen väriksi tulee BLACK.',
          'Rekursiivinen DFS käyttää pinoa, ei BFS-jonoa.',
        ],
      },
      bfsGrey: {
        title: 'Mikä on solmun 0 väri heti jonosta poiston jälkeen?',
        assumptions: 'BFS poisti juuri solmun 0. Sen yhtään naapuria ei ole vielä tutkittu.',
        choices: ['WHITE', 'BLACK', 'GREY', 'Riippuu naapureiden määrästä'],
        explanation:
          'Solmu pysyy GREY:nä naapureiden käsittelyn ajan. BLACK asetetaan kaikkien naapureiden jälkeen, ei poistettaessa.',
        feedback: [
          '0 on jo löydetty eikä muutu takaisin WHITE:ksi.',
          'Poisto ei tarkoita naapureiden valmistumista.',
          'Nykyinen poistettu solmu pysyy GREY:nä.',
          'Järjestys on poisto, naapureiden tutkiminen ja BLACK.',
        ],
      },
      post: {
        title: 'Mitä lehden 3 POST tarkoittaa?',
        assumptions: 'Solmun 3 kaikki naapurit on tutkittu; dfs(0) ja dfs(1) odottavat vielä.',
        choices: [
          'Koko läpikäynti alkaa',
          'Solmun 3 naapurit ovat valmiit',
          'Kaikki graafin solmut ovat valmiit',
          'Solmuun 3 saavutaan uudelleen',
        ],
        explanation:
          'POST tulee nykyisen solmun kaikkien naapureiden jälkeen. Vanhempikutsujen pitää vielä jatkaa.',
        feedback: [
          'Saapuminen on PRE, ei POST.',
          'Tämän lehden naapureiden käsittely on valmis.',
          'Odottavat vanhemmat ovat yhä pinossa.',
          'POST on valmistuminen, ei uusi kutsu.',
        ],
      },
      tree: {
        title: 'Minkä tyypin kaari 0 → 1 saa?',
        assumptions: 'DFS tutkii WHITE-naapurisolmua 1.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation: 'Kaari WHITE-solmuun aiheuttaa ensimmäisen löytämisen ja muuttuu puukaareksi.',
        feedback: [
          'Uusi lapsikutsu luodaan.',
          'Back johtaa GREY-esivanhempaan; tämä kohde on WHITE.',
          'Forward johtaa jo valmistuneeseen jälkeläiseen.',
          'Cross johtaa toiseen valmistuneeseen haaraan.',
        ],
      },
      back: {
        title: 'Miten 2 → 0 luokitellaan?',
        assumptions: 'Suunnattu DFS kulkee 0 → 1 → 2. Kohde 0 on GREY.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation: 'GREY-kohde on aktiivinen esivanhempi. Kaari sulkee syklin 0 → 1 → 2 → 0.',
        feedback: [
          '0 on jo löydetty, joten lasta ei luoda.',
          'Siirtymä aktiiviseen esivanhempaan todistaa syklin.',
          'Forward johtaa jälkeläiseen, ei esivanhempaan.',
          'Kohde on nykyisessä haarassa, ei toisessa valmiissa haarassa.',
        ],
      },
      forward: {
        title: 'Miten 0 → 2 luokitellaan solmun 1 paluun jälkeen?',
        assumptions: '2 on BLACK, tin[0] = 1, tin[2] = 3. Puupolku on 0 → 1 → 2.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation:
          '2 on solmun 0 valmis jälkeläinen, mutta kaari 0 → 2 ei luonut sen kutsua. Tyyppi on forward.',
        feedback: [
          'Puukaari oli 1 → 2; toinen kaari jälkeläiseen ei ole tree.',
          'Kohde on BLACK, ei GREY.',
          'BLACK-kohteen myöhempi tin tarkoittaa nykyisen solmun jälkeläistä.',
          'tin[2] on suurempi kuin tin[0], ja 2 kuuluu 0:n alipuuhun.',
        ],
      },
      cross: {
        title: 'Miten 3 → 2 luokitellaan?',
        assumptions: '2 on BLACK valmiissa haarassa solmun 1 kautta. tin[3] = 6, tin[2] = 3.',
        choices: ['Tree', 'Back', 'Forward', 'Cross'],
        explanation:
          'Kohde valmistui ennen solmun 3 löytämistä ja kuuluu toiseen haaraan. Valmiit aikavälit ovat erilliset.',
        feedback: [
          '2 löydettiin jo, joten lapsikutsua ei tule.',
          'BLACK-kohde ei ole aktiivinen GREY-esivanhempi.',
          'Kohteella on aiempi tin eikä se ole 3:n jälkeläinen.',
          'Siirtymä johtaa toiseen, jo valmistuneeseen haaraan.',
        ],
      },
      parent: {
        title: 'Todistaako kaari 1 → 0 syklin?',
        assumptions:
          'Graafi on suuntaamaton. DFS tuli solmusta 0 solmuun 1 tätä samaa fyysistä kaarta.',
        choices: [
          'Kyllä: jokainen GREY-kohde todistaa syklin',
          'Ei: tämä on vanhempipuukaaren käänteinen merkintä',
          'Kyllä: graafissa on useampi kuin yksi solmu',
          'Ei: suuntaamattomissa graafeissa ei koskaan ole syklejä',
        ],
        explanation:
          'Yhden puukaaren kaksi vieruslistamerkintää eivät muodosta sykliä. Ohita välitön vanhempikaari.',
        feedback: [
          'Ilman vanhempipoikkeusta sääntö koskee suunnattua DFS:ää.',
          'Kuljemme samaa kaarta takaisin emmekä sulje uutta sykliä.',
          'Pelkkä solmumäärä ei todista syklejä.',
          'Suuntaamaton kolmio sisältää syklin.',
        ],
      },
      forest: {
        title: 'Mitä juuret 2, 0 ja 4 tarkoittavat koko DFS:n jälkeen?',
        assumptions: 'Suunnattu DAG; aloitus 2:sta, sitten ulompi silmukka solmujen yli.',
        choices: [
          'Kolme vahvasti yhtenäistä komponenttia',
          'Kolme heikosti yhtenäistä komponenttia',
          'Kolme läpikäyntimetsän puuta, eivät välttämättä komponentteja',
          'Virhe: DFS:ssä voi olla vain yksi juuri',
        ],
        explanation:
          'Ulompi silmukka aloittaa puun kustakin jäljellä olevasta WHITE-solmusta. Suunnatun graafin metsä riippuu alusta ja järjestyksestä; tässä DAG:ssa on viisi SCC:tä.',
        feedback: [
          'DAG:n jokainen viidestä solmusta on oma SCC:nsä.',
          'Heikkoja komponentteja on kaksi, mutta läpikäyntipuita kolme.',
          'Juuret kuvaavat tätä läpikäyntiä eivätkä yhtenäisyyden määritelmää.',
          'Aiempien juurten ulottumattomiin jäävät solmut aloittavat uudet puut.',
        ],
      },
      shortest: {
        title: 'Mikä läpikäynti takaa lyhimmän polun 0 → 2?',
        assumptions: 'Suunnattu painottamaton DAG. Polkuja ovat 0 → 2 ja 0 → 1 → 2.',
        choices: [
          'BFS: 0 → 2',
          'DFS: sen ensimmäinen polku on aina lyhin',
          'Molempien pitää valita 0 → 1 → 2',
          'Ei kumpikaan: tarvitaan painot',
        ],
        explanation:
          'BFS löytää solmut etäisyystasoittain. Sen ensimmäinen polku minimoi kaarimäärän: tässä yksi kaari.',
        feedback: [
          '2 on solmun 0 välitön naapuri ja saa etäisyyden 1.',
          'DFS voi ensin edetä solmun 1 kautta ja löytää kahden kaaren polun.',
          'Suora kaari 0 → 2 antaa BFS:lle lyhyemmän polun.',
          'Kaarimäärän minimointi ei vaadi painoja.',
        ],
      },
      topological: {
        title: 'Voiko käänteisen POST:n palauttaa topologisena järjestyksenä?',
        assumptions: 'Koko suunnattu DFS löysi paluukaaren ja syklin 0 → 1 → 2 → 0.',
        choices: [
          'Kyllä, jokaisen koko DFS:n jälkeen',
          'Kyllä, kun kaikki solmut ovat BLACK',
          'Kyllä, valitsemalla toisen aloituksen',
          'Ei: syklisellä graafilla ei ole topologista järjestystä',
        ],
        explanation:
          'Käänteinen POST antaa topologisen järjestyksen vain DAG:lle. Löydetty sykli estää tuloksen.',
        feedback: [
          'DFS:n valmistuminen ei takaa syklittömyyttä.',
          'Myös syklinen graafi voidaan käsitellä loppuun ja merkitä BLACK.',
          'Toinen aloitus ei poista syklin kaaria.',
          'Lineaarinen järjestys ei voi toteuttaa kaikkia syklin rajoitteita.',
        ],
      },
    },
  },
}
