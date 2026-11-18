export const traJavaExampleTranslations = {
  en: {
    title: 'Additional Java examples with the TRA library',
    intro:
      'Ready-to-run examples for JDK 11+ using fi.uef.cs.tra from the supplied traj.jar. Download the ZIP with all three examples and the library, then extract it into one folder.',
    download: 'Download TRA examples + traj.jar (.zip)',
    setup:
      'Run each command from the extracted folder, with the .java file next to traj.jar. In an IDE, add traj.jar as a library. Each example can run independently.',
    order:
      'The displayed traversal orders match neighbors() in the supplied JAR. Another neighbour order can change DFS PRE/POST and parents; BFS still finds shortest distances. Graph and DiGraph are both supported by the traversal methods. In the complexity formulas, R is the number of reachable vertices and A_R is the number of neighbour entries examined from them.',
    examples: {
      graph: [
        'Create a graph and use Vertex',
        'Create DiGraph and Graph, add vertices and edges, inspect outgoing neighbours, and change vertex colours. A directed edge has one direction; Graph supplies both neighbour directions for an undirected edge.',
        'Enumerating vertices takes Θ(V); enumerating a vertex’s neighbours takes Θ(deg(v)). The printed neighbour list uses O(deg(v)) additional space.',
      ],
      dfs: [
        'Recursive DFS: colours, PRE/POST and a traversal forest',
        'Mark GREY before recursion, record PRE on entry, continue the caller’s neighbour loop after a child returns, then record POST and mark BLACK. Choose the reachable part or the whole graph. In a directed graph, forest roots do not identify strongly connected components.',
        'Full traversal: Θ(V + E) time and O(V) additional space for results and stack. Reachable-only mode: Θ(V + R + A_R), including the initial WHITE reset; graph storage is excluded.',
      ],
      bfs: [
        'BFS: TRA queue, distances and a shortest path',
        'Use LinkedQueue<Vertex>, mark GREY before enqueueing, and mark BLACK after examining neighbours. Parent links restore an unweighted shortest path. Unreachable distance is -1 and its path is empty.',
        'Θ(V + R + A_R) time, including initial colours and distances; O(V) additional space for maps, results and queue. For a full reachable graph, Θ(V + E).',
      ],
    },
  },
  ru: {
    title: 'Дополнительные Java-примеры с библиотекой TRA',
    intro:
      'Готовые примеры для JDK 11+ используют пакет fi.uef.cs.tra из предоставленного traj.jar. Скачайте ZIP со всеми тремя примерами и библиотекой, затем распакуйте в одну папку.',
    download: 'Скачать примеры TRA и traj.jar (.zip)',
    setup:
      'Выполняйте команды из распакованной папки: файл .java и traj.jar должны лежать рядом. В IDE добавьте traj.jar как библиотеку. Каждый пример запускается отдельно.',
    order:
      'Показанные порядки обхода соответствуют neighbors() в приложенном JAR. Другой порядок соседей может изменить PRE/POST и родителей DFS; BFS всё равно находит кратчайшие расстояния. Методы обхода поддерживают и Graph, и DiGraph. В формулах сложности R — число достижимых вершин, A_R — число просмотренных записей соседства этих вершин.',
    examples: {
      graph: [
        'Создание графа и работа с Vertex',
        'Создание DiGraph и Graph, добавление вершин и рёбер, просмотр исходящих соседей и изменение цветов. Направленное ребро действует в одну сторону; для неориентированного ребра Graph обеспечивает обе записи соседства.',
        'Перебор вершин занимает Θ(V), соседей одной вершины — Θ(deg(v)). Список соседей для вывода требует O(deg(v)) дополнительной памяти.',
      ],
      dfs: [
        'Рекурсивный DFS: цвета, PRE/POST и лес обхода',
        'Пометка GREY до рекурсии, PRE при входе, продолжение цикла родителя после возврата ребёнка, затем POST и BLACK. Можно обойти достижимую часть или весь граф. Корни леса направленного обхода не обозначают компоненты сильной связности.',
        'Полный обход: Θ(V + E) времени и O(V) дополнительной памяти под результаты и стек. Достижимая часть: Θ(V + R + A_R), включая начальную установку WHITE; хранение входного графа не учитывается.',
      ],
      bfs: [
        'BFS: очередь TRA, расстояния и кратчайший путь',
        'LinkedQueue<Vertex>, GREY до добавления в очередь и BLACK после просмотра соседей. Родительские ссылки восстанавливают кратчайший путь по числу рёбер. Для недостижимой вершины расстояние -1 и пустой путь.',
        'Θ(V + R + A_R) времени, включая начальные цвета и расстояния; O(V) дополнительной памяти под таблицы, результаты и очередь. Если достижим весь граф — Θ(V + E).',
      ],
    },
  },
  fi: {
    title: 'Lisää Java-esimerkkejä TRA-kirjastolla',
    intro:
      'Valmiit JDK 11+ -esimerkit käyttävät mukana tulevan traj.jar-tiedoston pakettia fi.uef.cs.tra. Lataa kaikki kolme esimerkkiä ja kirjasto ZIPinä ja pura ne samaan kansioon.',
    download: 'Lataa TRA-esimerkit ja traj.jar (.zip)',
    setup:
      'Suorita komennot puretussa kansiossa: .java-tiedosto ja traj.jar ovat rinnakkain. Lisää IDE:ssä traj.jar kirjastoksi. Jokainen esimerkki toimii itsenäisesti.',
    order:
      'Näytetyt läpikäyntijärjestykset vastaavat mukana tulevan JARin neighbors()-järjestystä. Eri naapurijärjestys voi muuttaa DFS:n PRE/POST-järjestystä ja vanhempia; BFS löytää silti lyhimmät etäisyydet. Läpikäyntimetodit tukevat sekä Graph- että DiGraph-luokkaa. Vaativuuskaavoissa R on saavutettavien solmujen määrä ja A_R niistä tutkittujen naapuruusmerkintöjen määrä.',
    examples: {
      graph: [
        'Graafin luominen ja Vertex-operaatiot',
        'Luo DiGraph ja Graph, lisää solmut ja kaaret, tutki lähtevät naapurit ja muuta värejä. Suunnattu kaari toimii yhteen suuntaan; suuntaamattomalle kaarelle Graph muodostaa molemmat naapuruussuunnat.',
        'Solmujen läpikäynti vie Θ(V) ja yhden solmun naapureiden läpikäynti Θ(deg(v)). Tulostettava naapurilista käyttää O(deg(v)) lisätilaa.',
      ],
      dfs: [
        'Rekursiivinen DFS: värit, PRE/POST ja läpikäyntimetsä',
        'Merkitse GREY ennen rekursiota ja kirjaa PRE saapuessa. Lapsen palattua kutsuja jatkaa omaa naapurisilmukkaansa; lopuksi kirjataan POST ja merkitään BLACK. Käy saavutettava osa tai koko graafi. Suunnatun metsän juuret eivät tarkoita vahvasti yhtenäisiä komponentteja.',
        'Koko läpikäynti: Θ(V + E) aikaa ja O(V) lisätilaa tuloksille ja pinolle. Saavutettava osa: Θ(V + R + A_R), mukaan lukien WHITE-alustus; syötegraafin tilaa ei lasketa mukaan.',
      ],
      bfs: [
        'BFS: TRA-jono, etäisyydet ja lyhin polku',
        'Käytä LinkedQueue<Vertex>-jonoa, merkitse GREY ennen jonoon lisäämistä ja BLACK naapureiden käsittelyn jälkeen. Vanhempiviitteet muodostavat lyhimmän polun kaarten määrän mukaan. Saavuttamattoman solmun etäisyys on -1 ja polku tyhjä.',
        'Θ(V + R + A_R) aikaa, mukaan lukien väri- ja etäisyysalustus; O(V) lisätilaa tauluille, tuloksille ja jonolle. Kun koko graafi on saavutettava, aika on Θ(V + E).',
      ],
    },
  },
}
