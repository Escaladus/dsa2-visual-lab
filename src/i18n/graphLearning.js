export const graphLearningTranslations = {
  ru: {
    tabs: {
      basic: 'Пошаговый обход',
      colors: 'Цвета вершин',
      edges: 'Типы рёбер DFS',
    },
    choose: 'Что изучаем',
    resume: 'После возврата: dfs({v}), следующий сосед i = {i}',
    initColors: 'Подготовлены цвета вершин. Все вершины пока WHITE.',
    intro:
      'Начни с движения по графу. Цвета и классификацию рёбер можно изучить отдельно — у каждого режима свой сохранённый шаг.',
    practice: 'Практика: задачи и сравнение DFS/BFS',
    colorsTitle: 'Как вершины меняют цвет',
    colorsIntro:
      'Следи за WHITE → GREY → BLACK. Жёлтая обводка обозначает текущую вершину. В BFS извлечённая вершина остаётся GREY до завершения просмотра соседей.',
    edgesTitle: 'Почему ребро получает свой тип',
    edgesIntro:
      'Просматривай направленные рёбра DFS: tree, back, forward и cross. Цвет вершины и времена tin/tout помогают объяснить решение.',
    bfsIntro:
      'Тот же граф A–H, что в TraBfsExample.java. Используются Vertex и LinkedQueue<Vertex>. Обнаружение происходит до добавления в очередь; после извлечения вершина остаётся GREY до просмотра всех соседей.',
    bfsJava: 'Java TRA: очередь и текущий шаг',
    preparation: 'Java TRA: подготовка порядка и общих данных',
    preparedOrder:
      'ID заданы явным списком объектов Vertex, а не метками. State перебирает исходящие edges(), сортирует их по ID соседей и сохраняет согласованные списки Vertex и Edge. i индексирует эти Java List, а не поле Vertex. Это исключает повторный линейный поиск getEdge(next). Подготовка требует O(V + E + Σ d(v) log(d(v) + 1)) времени и O(V + E) памяти; само ядро полного обхода после неё — Θ(V + E). Смена порядка не сортирует вершины по меткам.',
    queueEnds: 'Начало очереди слева → конец справа',
    processing: 'Обработка',
  },
  fi: {
    tabs: {
      basic: 'Vaiheittainen läpikäynti',
      colors: 'Solmujen värit',
      edges: 'DFS-kaarten tyypit',
    },
    choose: 'Opiskelun aihe',
    resume: 'Paluun jälkeen: dfs({v}), seuraava naapuri i = {i}',
    initColors: 'Solmujen värit on alustettu. Kaikki solmut ovat vielä WHITE.',
    intro:
      'Aloita graafin läpikäynnistä. Värit ja kaarten luokittelu ovat erillisiä näkymiä, joilla on omat tallennetut vaiheensa.',
    practice: 'Harjoittelu: tehtävät ja DFS/BFS-vertailu',
    colorsTitle: 'Miten solmujen värit muuttuvat',
    colorsIntro:
      'Seuraa muutosta WHITE → GREY → BLACK. Keltainen reunus osoittaa nykyisen solmun. BFS:ssä jonosta poistettu solmu pysyy GREY-tilassa, kunnes kaikki naapurit on käsitelty.',
    edgesTitle: 'Miksi kaari saa tietyn tyypin',
    edgesIntro:
      'Tutki suunnatun DFS:n tree-, back-, forward- ja cross-kaaria. Solmun väri ja ajat tin/tout selittävät luokittelun.',
    bfsIntro:
      'Sama A–H-verkko kuin TraBfsExample.java-tiedostossa: Vertex ja LinkedQueue<Vertex>. Löydä solmu ennen jonoon lisäämistä; poistettu solmu pysyy GREY-tilassa kaikkien naapurien käsittelyn ajan.',
    bfsJava: 'Java TRA: jono ja nykyinen vaihe',
    preparation: 'Java TRA: järjestyksen ja yhteisten tietojen valmistelu',
    preparedOrder:
      'Vertex-olioiden eksplisiittinen lista määrittää ID:t nimistä riippumatta. State käy lähtevät edges()-kaaret, lajittelee naapurin ID:n mukaan ja tallentaa vastaavat Vertex- ja Edge-listat. i indeksoi näitä Java List -listoja, ei Vertex-kenttää. Näin vältetään toistuva lineaarinen getEdge(next)-haku. Valmistelu vie O(V + E + Σ d(v) log(d(v) + 1)) aikaa ja O(V + E) tilaa; koko läpikäynnin ydin sen jälkeen on Θ(V + E). Järjestyksen kääntö ei lajittele nimiä.',
    queueEnds: 'Jonon alku vasemmalla → loppu oikealla',
    processing: 'Käsitellään',
  },
  en: {
    tabs: {
      basic: 'Step-by-step traversal',
      colors: 'Vertex colours',
      edges: 'DFS edge types',
    },
    choose: 'Learning view',
    resume: 'After returning: dfs({v}), next neighbour i = {i}',
    initColors: 'Vertex colours are ready. All vertices are still WHITE.',
    intro:
      'Start with movement through the graph. Explore colours and edge classification separately; each view keeps its own saved step.',
    practice: 'Practice: applications and DFS/BFS comparison',
    colorsTitle: 'How vertices change colour',
    colorsIntro:
      'Follow WHITE → GREY → BLACK. The yellow outline marks the current vertex. In BFS, a removed vertex stays GREY until all its neighbours have been examined.',
    edgesTitle: 'Why an edge receives its type',
    edgesIntro:
      'Examine directed DFS edges: tree, back, forward and cross. Vertex colours and tin/tout times explain the classification.',
    bfsIntro:
      'The same A–H graph as TraBfsExample.java, using Vertex and LinkedQueue<Vertex>. Discover before enqueueing; a removed vertex remains GREY until all its neighbours have been examined.',
    bfsJava: 'Java TRA: queue and current step',
    preparation: 'Java TRA: prepare order and shared data',
    preparedOrder:
      'Explicit Vertex objects define IDs, independently of their labels. State enumerates outgoing edges(), sorts by neighbour ID, and saves aligned Vertex and Edge lists. i indexes these Java Lists, not a Vertex field. This avoids repeated linear getEdge(next) lookups. Preparation takes O(V + E + Σ d(v) log(d(v) + 1)) time and O(V + E) space; the full traversal core afterwards is Θ(V + E). Reversing order does not sort by vertex label.',
    queueEnds: 'Queue front on the left → back on the right',
    processing: 'Processing',
  },
}
