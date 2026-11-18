export const graphLearningTranslations = {
  ru: {
    tabs: { basic: 'Пошаговый обход', colors: 'Цвета вершин', edges: 'Типы рёбер DFS' },
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
  },
  en: {
    tabs: { basic: 'Step-by-step traversal', colors: 'Vertex colours', edges: 'DFS edge types' },
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
  },
}
