import { bfsCodingExerciseTranslations as common } from './bfsCodingExercise.js'

export const componentsCodingExerciseTranslations = {
  en: {
    ...common.en,
    title: 'Try it in Java: connected components',
    intro:
      'A traversal from one start can miss part of a graph. Write one method that finds every connected component of an undirected TRA Graph, using DFS or BFS.',
    graph: 'Undirected graph: edge 0—1, isolated vertex 2, edge 3—4. Three components.',
    description:
      'Return a list of components. Each component is a nonempty list of actual Vertex objects connected by paths; it must contain the whole connected group. Include every input vertex exactly once.',
    signature: 'public static List<List<Vertex>> components(Graph graph)',
    example:
      'For the drawing: [[0, 1], [2], [3, 4]]. [[4, 3], [1, 0], [2]] is equally correct. Empty graph → []. Numbers identify the pictured vertices; return Vertex objects.',
    steps: [
      'Use JDK 11 or newer. Extract the ZIP and open graph-components in your IDE.',
      'Edit only Solution.java. Replace the TODO exception with DFS or BFS and an outer loop over all vertices. Helper methods are allowed.',
      'Save and run the command below from that folder. After corrections, run again; each attempt starts fresh.',
    ],
    files:
      'The ZIP contains Solution.java, Check.java, GraphChecks.java, the supplied traj.jar and one English README. No Maven or Gradle setup is needed.',
    rules: [
      'graph is a non-null undirected TRA Graph. It may be empty or disconnected and contain cycles, isolated vertices and equal labels. No loops or parallel edges.',
      'Do not change topology or any vertex/edge fields. Colours are arbitrary; use your own visited set or map keyed by actual Vertex objects.',
      'Return every input Vertex exactly once, in nonempty component lists. No nulls, empty groups, foreign vertices or copies. An empty graph returns an empty outer list.',
      'Component order and vertex order do not matter. Both DFS and BFS are accepted. These are undirected connected components, not strongly connected components.',
    ],
    api: [
      ['graph.vertices()', 'All vertices, including isolated ones: use this for the outer loop.'],
      ['vertex.neighbors()', 'Neighbours in either direction of an undirected edge.'],
      [
        'visited.add(vertex)',
        'Returns true only on first discovery. Mark before recursion or enqueueing.',
      ],
      [
        'Collections.newSetFromMap(new IdentityHashMap<>())',
        'Create your own visited set based on actual object identity, not labels or colours.',
      ],
      [
        'queue.offer(vertex) / queue.remove()',
        'Optional BFS: add at the tail, take from the head of TRA LinkedQueue.',
      ],
    ],
    checking:
      'Ten groups use the original traj.jar and --release 11: empty, singleton, all isolated, chain, pictured partition, cycle with other components, bridged cycles, stored endpoint order, equal labels, and 40 fixed-seed graphs. An independent undirected transitive closure checks coverage, uniqueness and membership. Input fields and physical edges must remain unchanged. Each group has a fresh JVM and a 5-second limit.',
    feedback:
      'Feedback shows vertex count, undirected edges and returned groups using diagnostic vertex IDs. It explains missing/repeated/foreign vertices, empty groups, splitting connected pairs, merging disconnected pairs and input changes. Compilation errors are separate; attempts are unlimited.',
    limits:
      'Any valid partition order is accepted for these inputs. Tests do not prove DFS/BFS use or asymptotic complexity. Explain correctness and costs yourself; the time limit is not a benchmark.',
    hintItems: [
      [
        'Why an outer loop?',
        'One traversal finds just one component. Loop over graph.vertices() and start a new traversal only at an unvisited vertex. Keep the visited set between traversals.',
      ],
      [
        'What goes into a component?',
        'Create a new list for each unvisited root. Mark before recursion or enqueueing, and collect each reached vertex through neighbors().',
      ],
      [
        'What about an isolated vertex?',
        'The root itself goes into its new component even if it has no neighbours. Save that list, then continue the outer loop.',
      ],
    ],
    after:
      'Try the method in your IDE, then open the walkthrough. You can retry indefinitely. Optional reasoning can go in the comment in Solution.java; existing traversal visualisations and tasks remain available.',
    selfItems: [
      'Why does one traversal find a whole component and never merge disconnected components?',
      'Why is every vertex included once, even on cycles or when isolated?',
      'What are total time, working memory and result-storage costs over the whole graph?',
    ],
    walkthroughTitle: 'Walkthrough: one traversal per component',
    walkthrough: [
      'Start at 0: find 0 and 1, forming [0, 1]. Keep both in the visited set.',
      'The outer loop skips visited 1, then starts at isolated 2: its component is [2].',
      'Start at 3: find 3 and 4, forming [3, 4]. Later skip already visited 4.',
      'Return all three lists. Different root/neighbour orders change the listing, but not the partition.',
    ],
    costNote:
      'With adjacency lists and expected O(1) visited-set operations, a full DFS or BFS takes expected O(V + E) time. Each undirected edge occurs in two neighbour lists. Worst-case working memory is O(V) for the visited set and stack/queue; result lists add O(V). The input graph is excluded.',
  },
  ru: {
    ...common.ru,
    title: 'Попробуйте на Java: компоненты связности',
    intro:
      'Обход из одной вершины может пропустить часть графа. Напишите один метод, который находит все компоненты связности неориентированного TRA Graph с помощью DFS или BFS.',
    graph: 'Неориентированный граф: ребро 0—1, изолированная вершина 2, ребро 3—4. Три компоненты.',
    description:
      'Верните список компонент. Каждая компонента — непустой список настоящих Vertex, связанных путями; в него должна входить вся связная группа. Включите каждую входную вершину ровно один раз.',
    signature: 'public static List<List<Vertex>> components(Graph graph)',
    example:
      'Для рисунка: [[0, 1], [2], [3, 4]]. [[4, 3], [1, 0], [2]] — тоже верно. Пустой граф → []. Числа обозначают вершины рисунка; возвращайте объекты Vertex.',
    steps: [
      'Используйте JDK 11 или новее. Распакуйте ZIP и откройте graph-components в IDE.',
      'Меняйте только Solution.java. Замените исключение TODO на DFS или BFS с внешним циклом по всем вершинам. Можно добавлять вспомогательные методы.',
      'Сохраните файл и выполните команду ниже из этой папки. После исправлений запускайте снова; каждая попытка начинается заново.',
    ],
    files:
      'В ZIP находятся Solution.java, Check.java, GraphChecks.java, приложенный traj.jar и один README на английском. Настраивать Maven или Gradle не требуется.',
    rules: [
      'graph — не null, неориентированный TRA Graph. Допустимы пустота, несвязность, циклы, изолированные вершины и одинаковые метки. Без петель и параллельных рёбер.',
      'Не меняйте структуру и поля вершин/рёбер. Цвета произвольны; храните посещение в своём Set или Map по настоящим объектам Vertex.',
      'Верните каждую входную Vertex ровно один раз в непустых списках компонент. Без null, пустых групп, чужих вершин и копий. Для пустого графа нужен пустой внешний список.',
      'Порядок компонент и вершин не важен. Подходят DFS и BFS. Это компоненты неориентированного графа, а не компоненты сильной связности.',
    ],
    api: [
      ['graph.vertices()', 'Все вершины, включая изолированные: основа внешнего цикла.'],
      ['vertex.neighbors()', 'Соседи в обе стороны неориентированного ребра.'],
      [
        'visited.add(vertex)',
        'Возвращает true только при первом обнаружении. Помечайте до рекурсии или добавления в очередь.',
      ],
      [
        'Collections.newSetFromMap(new IdentityHashMap<>())',
        'Собственный Set по идентичности объектов, а не меткам или цветам.',
      ],
      [
        'queue.offer(vertex) / queue.remove()',
        'Для варианта BFS: добавить в конец, извлечь из начала TRA LinkedQueue.',
      ],
    ],
    checking:
      'Десять групп с исходным traj.jar и --release 11: пустой граф, одна вершина, все изолированы, цепочка, рисунок, цикл с другими компонентами, циклы с мостом, порядок концов ребра, одинаковые метки и 40 графов с фиксированным seed. Независимое неориентированное транзитивное замыкание проверяет полноту, уникальность и принадлежность. Поля и настоящие рёбра должны сохраниться. У каждой группы новая JVM и лимит 5 секунд.',
    feedback:
      'Ошибка показывает число вершин, неориентированные рёбра и полученные группы с диагностическими номерами вершин. Объясняет пропуски, повторы, чужие вершины, пустые группы, разделение связанных пар, объединение несвязанных и изменение входа. Ошибки компиляции выводятся отдельно; число попыток не ограничено.',
    limits:
      'Для этих входов принимается любой правильный порядок разбиения. Проверки не доказывают использование DFS/BFS и асимптотическую сложность. Обоснуйте корректность и затраты сами; лимит времени не измеряет эффективность.',
    hintItems: [
      [
        'Зачем внешний цикл?',
        'Один обход находит одну компоненту. Пройдите по graph.vertices() и начинайте новый обход только из непосещённой вершины. Сохраняйте Set посещённых между обходами.',
      ],
      [
        'Что собирать в компоненту?',
        'Создайте новый список для каждого непосещённого корня. Помечайте до рекурсии или добавления в очередь, собирайте достигнутые через neighbors() вершины.',
      ],
      [
        'Как учесть изолированную вершину?',
        'Сам корень входит в новую компоненту даже без соседей. Сохраните этот список и продолжайте внешний цикл.',
      ],
    ],
    after:
      'Попробуйте написать метод в IDE, затем откройте разбор. Попытки не ограничены. Обоснование можно добавить в комментарий Solution.java; прежние визуализации и задания сохранены.',
    selfItems: [
      'Почему один обход находит целую компоненту и не объединяет несвязанные компоненты?',
      'Почему каждая вершина входит ровно один раз, в том числе при циклах и изоляции?',
      'Каковы суммарное время, рабочая память и память результата для всего графа?',
    ],
    walkthroughTitle: 'Разбор: один обход на компоненту',
    walkthrough: [
      'Начинаем из 0: находим 0 и 1, получаем [0, 1]. Обе остаются в Set посещённых.',
      'Внешний цикл пропускает посещённую 1, затем начинает обход из изолированной 2: её компонента — [2].',
      'Начинаем из 3: находим 3 и 4, получаем [3, 4]. Позже пропускаем уже посещённую 4.',
      'Возвращаем три списка. Другой порядок корней/соседей меняет запись, но не состав компонент.',
    ],
    costNote:
      'Со списками смежности и ожидаемым O(1) для операций Set полный DFS или BFS требует ожидаемое O(V + E) времени. Неориентированное ребро встречается в двух списках соседей. Рабочая память в худшем случае O(V) для Set и стека/очереди; списки результата добавляют O(V). Входной граф не учитывается.',
  },
  fi: {
    ...common.fi,
    title: 'Kokeile Javalla: yhtenäiset komponentit',
    intro:
      'Yhdestä aloitussolmusta tehty läpikäynti voi ohittaa osan verkosta. Kirjoita yksi metodi, joka löytää suuntaamattoman TRA Graph -verkon kaikki yhtenäiset komponentit DFS:llä tai BFS:llä.',
    graph: 'Suuntaamaton verkko: kaari 0—1, erillinen solmu 2, kaari 3—4. Kolme komponenttia.',
    description:
      'Palauta lista komponenteista. Kukin komponentti on epätyhjä lista poluilla toisiinsa yhdistyvistä oikeista Vertex-olioista; sen tulee sisältää koko yhtenäinen ryhmä. Lisää jokainen syötesolmu täsmälleen kerran.',
    signature: 'public static List<List<Vertex>> components(Graph graph)',
    example:
      'Kuvan tulos: [[0, 1], [2], [3, 4]]. Myös [[4, 3], [1, 0], [2]] on oikein. Tyhjä verkko → []. Numerot tarkoittavat kuvan solmuja; palauta Vertex-oliot.',
    steps: [
      'Käytä JDK 11:tä tai uudempaa. Pura ZIP ja avaa graph-components-kansio IDE:ssä.',
      'Muokkaa vain Solution.java. Korvaa TODO-poikkeus DFS:llä tai BFS:llä sekä kaikki solmut käsittelevällä ulommalla silmukalla. Apumetodit sallitaan.',
      'Tallenna ja suorita alla oleva komento tästä kansiosta. Korjausten jälkeen suorita uudelleen; jokainen yritys alkaa alusta.',
    ],
    files:
      'ZIP sisältää tiedostot Solution.java, Check.java, GraphChecks.java, mukana tulleen traj.jar-kirjaston ja yhden englanninkielisen READMEn. Mavenia tai Gradlea ei tarvita.',
    rules: [
      'graph on suuntaamaton TRA Graph, ei null. Tyhjyys, epäyhtenäisyys, syklit, erilliset solmut ja samat nimet sallitaan. Ei silmukoita tai rinnakkaiskaaria.',
      'Älä muuta rakennetta tai solmujen/kaarien kenttiä. Värit ovat mielivaltaisia; säilytä löytyminen omassa Setissä tai Mapissa oikeiden Vertex-olioiden perusteella.',
      'Palauta jokainen syötteen Vertex kerran epätyhjissä komponenttilistoissa. Ei null-arvoja, tyhjiä ryhmiä, vieraita solmuja tai kopioita. Tyhjä verkko palauttaa tyhjän ulomman listan.',
      'Komponenttien ja solmujen järjestyksellä ei ole väliä. DFS ja BFS hyväksytään. Kyse on suuntaamattoman verkon komponenteista, ei vahvasti yhtenäisistä komponenteista.',
    ],
    api: [
      ['graph.vertices()', 'Kaikki solmut, myös erilliset: ulomman silmukan perusta.'],
      ['vertex.neighbors()', 'Naapurit suuntaamattoman kaaren molempiin suuntiin.'],
      [
        'visited.add(vertex)',
        'Palauttaa true vain ensimmäisellä löytymisellä. Merkitse ennen rekursiota tai jonoon lisäämistä.',
      ],
      [
        'Collections.newSetFromMap(new IdentityHashMap<>())',
        'Oma joukko olioiden identiteetin, ei nimien tai värien perusteella.',
      ],
      [
        'queue.offer(vertex) / queue.remove()',
        'BFS-vaihtoehdossa: lisää loppuun, poista alusta TRA LinkedQueue -jonossa.',
      ],
    ],
    checking:
      'Kymmenen ryhmää alkuperäisellä traj.jarilla ja --release 11 -asetuksella: tyhjä, yksi solmu, kaikki erillisiä, ketju, kuva, sykli ja muut komponentit, sillalla yhdistetyt syklit, kaaren päätepistejärjestys, samat nimet ja 40 kiinteän siemenen verkkoa. Riippumaton suuntaamaton transitiivinen sulkeuma tarkistaa kattavuuden, ainutkertaisuuden ja jäsenyyden. Kentät ja oikeat kaaret säilytetään. Jokaisella ryhmällä on uusi JVM ja 5 sekunnin raja.',
    feedback:
      'Virhe näyttää solmumäärän, suuntaamattomat kaaret ja palautetut ryhmät diagnostisilla solmunumeroilla. Se selittää puuttuvat/toistuvat/vieraat solmut, tyhjät ryhmät, yhdistettyjen parien jakamisen, erillisten parien yhdistämisen ja syötteen muutokset. Käännösvirheet ovat erillisiä; yrityksiä ei rajoiteta.',
    limits:
      'Näille syötteille hyväksytään jokainen kelvollinen ryhmittelyjärjestys. Testit eivät todista DFS:n/BFS:n käyttöä tai asymptoottista vaativuutta. Perustele oikeellisuus ja kustannukset itse; aikaraja ei ole suorituskykymittaus.',
    hintItems: [
      [
        'Miksi ulompi silmukka?',
        'Yksi läpikäynti löytää yhden komponentin. Käy graph.vertices() läpi ja aloita uusi läpikäynti vain löytämättömästä solmusta. Säilytä löydettyjen joukko läpikäyntien välillä.',
      ],
      [
        'Mitä komponenttiin kerätään?',
        'Luo uusi lista jokaiselle löytämättömälle juurelle. Merkitse ennen rekursiota tai jonoon lisäämistä ja kerää neighbors()-kautta saavutetut solmut.',
      ],
      [
        'Entä erillinen solmu?',
        'Juuri itse kuuluu uuteen komponenttiin ilman naapureitakin. Tallenna lista ja jatka ulompaa silmukkaa.',
      ],
    ],
    after:
      'Yritä metodia IDE:ssä ja avaa sitten esimerkin läpikäynti. Yrityksiä ei rajoiteta. Perustelut voi kirjoittaa Solution.java-kommenttiin; aiemmat visualisoinnit ja tehtävät säilyvät.',
    selfItems: [
      'Miksi yksi läpikäynti löytää kokonaisen komponentin yhdistämättä erillisiä komponentteja?',
      'Miksi jokainen solmu esiintyy kerran myös sykleissä tai ollessaan erillinen?',
      'Mitkä ovat koko verkon aika, työmuisti ja tulosmuisti?',
    ],
    walkthroughTitle: 'Esimerkin läpikäynti: yksi haku komponenttia kohti',
    walkthrough: [
      'Aloita 0:sta: löydä 0 ja 1, tulos [0, 1]. Molemmat säilyvät löydettyjen joukossa.',
      'Ulompi silmukka ohittaa löydetyn 1:n ja aloittaa erillisestä 2:sta: komponentti on [2].',
      'Aloita 3:sta: löydä 3 ja 4, tulos [3, 4]. Ohita myöhemmin jo löydetty 4.',
      'Palauta kolme listaa. Eri juuri-/naapurijärjestys muuttaa listausta mutta ei komponenttien jäsenyyttä.',
    ],
    costNote:
      'Naapurilistoilla ja joukon odotetun O(1) operaatioilla koko DFS tai BFS vie odotetusti O(V + E) aikaa. Suuntaamaton kaari esiintyy kahdessa naapurilistassa. Työmuisti on pahimmillaan O(V) joukolle ja pinolle/jonolle; tuloslistat lisäävät O(V). Syöteverkkoa ei lasketa mukaan.',
  },
}
