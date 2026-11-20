export const graphBasicsTranslations = {
  en: {
    title: 'From a drawing to TRA code',
    intro:
      'The drawing, creation method and neighbour lists below describe the same DiGraph. Each letter names a Vertex object; each arrow is an Edge object.',
    drawing:
      'Directed graph: A to B with weight 5, A to C with weight 2, B to C with weight 1. D is isolated.',
    readDrawing:
      'Follow arrowheads. A reaches B and C directly; B reaches C. D exists in the graph even though no edge touches it. Numbers on edges are weights, not traversal distances.',
    neighbors: 'What neighbors() returns here',
    readNeighbors:
      'These are outgoing neighbours. B does not list A: no B→A edge was added. An empty list means no outgoing edges; C has incoming edges, while D is isolated.',
    construction: 'Create exactly this graph',
    source:
      'This method is taken directly from the downloadable TraGraphExample.java. Its main method calls it and prints the neighbour lists.',
    edgeWeight:
      '5.0f passes a float weight. addEdge(b, 5) would select the overload for an integer colour. Keep edge weights separate from vertex colours.',
    apiTitle: 'The TRA classes used here',
    apiClass: 'Class / Javadoc',
    apiUse: 'What it represents and how to use it',
    documentation:
      'Class names open the course Javadoc. Use the method signatures there; some introductory Javadoc examples use older spellings. The supplied JAR uses neighbors().',
    api: {
      Graph: 'An undirected graph. u.addEdge(v) once makes u and v neighbours in both directions.',
      DiGraph:
        'A directed graph. a.addEdge(b) creates A→B; a reverse arc requires its own insertion.',
      Vertex:
        'One vertex object. graph.addVertex("A") returns it; getLabel() reads its label, neighbors() enumerates outgoing neighbours, and addEdge(...) adds an edge from it.',
      Edge: 'One connection. addEdge(...) returns it. getStartPoint()/getEndPoint() read the stored endpoints; getWeight() reads its float weight.',
      AbstractGraph:
        'The common superclass of Graph and DiGraph. vertices() enumerates all vertices, vertexCount() counts them, and WHITE/GREY/BLACK name traversal colours.',
    },
  },
  ru: {
    title: 'От рисунка к коду TRA',
    intro:
      'Рисунок, метод создания и списки соседей ниже описывают один и тот же DiGraph. Каждая буква обозначает объект Vertex, каждая стрелка — объект Edge.',
    drawing:
      'Ориентированный граф: A в B с весом 5, A в C с весом 2, B в C с весом 1. D изолирована.',
    readDrawing:
      'Следуйте направлению стрелок. Из A есть прямые переходы в B и C, из B — в C. D существует в графе, хотя с ней не связано ни одного ребра. Числа у рёбер — веса, а не расстояния обхода.',
    neighbors: 'Что здесь возвращает neighbors()',
    readNeighbors:
      'Это исходящие соседи. В списке B нет A: ребро B→A не добавляли. Пустой список означает отсутствие исходящих рёбер; у C есть входящие рёбра, а D изолирована.',
    construction: 'Создание именно этого графа',
    source:
      'Этот метод взят непосредственно из скачиваемого TraGraphExample.java. Его main вызывает метод и печатает списки соседей.',
    edgeWeight:
      '5.0f передаёт вес типа float. Вызов addEdge(b, 5) выбрал бы перегрузку с целочисленным цветом. Вес ребра и цвет вершины — разные данные.',
    apiTitle: 'Классы TRA, которые здесь используются',
    apiClass: 'Класс / Javadoc',
    apiUse: 'Что представляет и как используется',
    documentation:
      'Название класса открывает Javadoc курса. Сверяйтесь с сигнатурами методов: некоторые вводные примеры Javadoc используют старое написание. В приложенном JAR метод называется neighbors().',
    api: {
      Graph:
        'Неориентированный граф. Один вызов u.addEdge(v) делает u и v соседями в обоих направлениях.',
      DiGraph:
        'Ориентированный граф. a.addEdge(b) создаёт A→B; обратное ребро добавляется отдельно.',
      Vertex:
        'Объект вершины. graph.addVertex("A") возвращает его; getLabel() читает метку, neighbors() перечисляет исходящих соседей, addEdge(...) добавляет ребро из этой вершины.',
      Edge: 'Объект ребра, который возвращает addEdge(...). getStartPoint()/getEndPoint() читают сохранённые концы, getWeight() — вес типа float.',
      AbstractGraph:
        'Общий родитель Graph и DiGraph. vertices() перечисляет все вершины, vertexCount() считает их, WHITE/GREY/BLACK обозначают цвета обхода.',
    },
  },
  fi: {
    title: 'Kuvasta TRA-koodiin',
    intro:
      'Kuva, luontimetodi ja naapurilistat kuvaavat samaa DiGraph-verkkoa. Jokainen kirjain tarkoittaa Vertex-oliota ja jokainen nuoli Edge-oliota.',
    drawing:
      'Suunnattu verkko: A:sta B:hen painolla 5, A:sta C:hen painolla 2 ja B:stä C:hen painolla 1. D on eristetty.',
    readDrawing:
      'Seuraa nuolten suuntaa. A:sta pääsee suoraan B:hen ja C:hen, B:stä C:hen. D kuuluu verkkoon, vaikka siihen ei liity yhtään kaarta. Kaarten luvut ovat painoja, eivät läpikäynnin etäisyyksiä.',
    neighbors: 'Mitä neighbors() palauttaa tässä',
    readNeighbors:
      'Listat sisältävät lähtevät naapurit. B:n listalla ei ole A:ta, koska kaarta B→A ei lisätty. Tyhjä lista tarkoittaa, ettei lähteviä kaaria ole: C:llä on tulevia kaaria, mutta D on eristetty.',
    construction: 'Luo juuri tämä verkko',
    source:
      'Metodi on otettu suoraan ladattavasta TraGraphExample.java-tiedostosta. Sen main kutsuu metodia ja tulostaa naapurilistat.',
    edgeWeight:
      '5.0f välittää float-painon. addEdge(b, 5) valitsisi kokonaislukuvärin ylikuormituksen. Kaaren paino ja solmun väri ovat eri tietoja.',
    apiTitle: 'Tässä käytetyt TRA-luokat',
    apiClass: 'Luokka / Javadoc',
    apiUse: 'Mitä se esittää ja miten sitä käytetään',
    documentation:
      'Luokan nimi avaa kurssin Javadocin. Tarkista metodien allekirjoitukset: joissakin Javadocin johdantoesimerkeissä on vanhoja kirjoitusasuja. Mukana tulevassa JARissa metodi on neighbors().',
    api: {
      Graph:
        'Suuntaamaton verkko. Yksi u.addEdge(v) tekee u:sta ja v:stä naapurit molempiin suuntiin.',
      DiGraph:
        'Suunnattu verkko. a.addEdge(b) luo kaaren A→B; vastakkaissuuntainen kaari lisätään erikseen.',
      Vertex:
        'Solmuolio. graph.addVertex("A") palauttaa sen; getLabel() lukee nimen, neighbors() luettelee lähtevät naapurit ja addEdge(...) lisää tästä solmusta lähtevän kaaren.',
      Edge: 'Kaariolio, jonka addEdge(...) palauttaa. getStartPoint()/getEndPoint() lukevat tallennetut päätepisteet ja getWeight() float-painon.',
      AbstractGraph:
        'Graphin ja DiGraphin yhteinen yläluokka. vertices() luettelee kaikki solmut, vertexCount() laskee ne ja WHITE/GREY/BLACK nimeävät läpikäynnin värit.',
    },
  },
}
