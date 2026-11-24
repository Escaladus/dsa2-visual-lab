export const bfsPathExerciseTranslations = {
  en: {
    title: 'Task 2: BFS — find and return a shortest path',
    intro:
      'After finding BFS distances, return the actual route. Implement one method with TRA vertices, a queue and a parent map, then check it locally.',
    graph:
      'Directed diamond: 0 to 1 and 2, both to 3; vertex 4 is isolated. Start 0; target 3 is highlighted.',
    task: 'Your task',
    description:
      'Return the actual Vertex objects of a shortest path by number of edges, ordered from start to target and including both endpoints. Any shortest route is accepted.',
    example:
      'For start = 0, target = 3: [0, 1, 3] or [0, 2, 3] — both have 2 edges. For target = 4, return []. For start = target = 0, return [0]. Numbers identify the vertices in this drawing; return Vertex objects, not numbers or labels.',
    download: 'Download task + library + checker (.zip)',
    instructions: 'How to solve and check',
    steps: [
      'Use JDK 11 or newer. Extract the ZIP and open bfs-path in your IDE.',
      'Edit only Solution.java. Replace the TODO exception with BFS and parent-chain reconstruction. Helpers are allowed.',
      'Save and run the command below from that folder. Correct errors and run it again; every attempt starts fresh.',
    ],
    initial:
      'The untouched template reports unfinished work. After implementing the method, the checker shows which cases pass and explains failures. To start over, restore Solution.java from the ZIP.',
    files:
      'The ZIP contains Solution.java, Check.java, GraphChecks.java, the supplied traj.jar, and English and Finnish README files. No Maven or Gradle setup is needed.',
    contract: 'Conditions and useful library methods',
    rules: [
      'start and target are non-null vertices of the same directed graph. Each edge counts as one step; cycles, self-loops and equal labels are possible. No parallel edges.',
      'Do not change graph structure or any vertex/edge fields. Colours may be arbitrary. Record discovery and parents in your own map.',
      'Return original Vertex objects, in forward order, including both endpoints. Unreachable means an empty list, never null. start == target means [start].',
      'The checker accepts any valid shortest path; neighbour order and ties do not require one canonical list.',
    ],
    api: [
      ['vertex.neighbors()', 'Outgoing neighbours; follow the arrow direction.'],
      [
        'queue.offer(vertex) / queue.remove()',
        'Add to the tail, remove from the head of TRA LinkedQueue.',
      ],
      [
        'parent.containsKey(vertex)',
        'Has this actual vertex already been discovered? Initialise the start entry too.',
      ],
      ['parent.put(next, vertex)', 'Remember who discovered next, before enqueueing it.'],
      [
        'Collections.reverse(path)',
        'Turn the target-to-start parent chain into the requested forward route.',
      ],
    ],
    checks: 'What the checker does',
    checking:
      'The checker uses the real traj.jar and --release 11. Ten groups cover equal terminals, unreachable targets, chains, two valid shortest routes, a shorter direct route, cycles, disconnected graphs, direction, equal labels/self-loops and 36 fixed-seed graphs. It checks actual vertices, directed edges, endpoints, shortest length and unchanged input fields. Each group has a fresh JVM and a 5-second limit.',
    feedback:
      'A failure shows input edges, start, target and the returned vertex IDs where available. It explains a reversed route, a missing edge, a non-shortest route, foreign vertices or changed input. Compilation errors are reported separately; you can retry without limits.',
    limits:
      'Tests accept all valid shortest routes on these inputs. They do not prove BFS use or an asymptotic bound. Explain correctness and complexity in your own words; the timeout is not a speed measurement.',
    hints: 'Need a hint?',
    hintItems: [
      [
        'How do I record a parent?',
        'On first discovery set parent[next] = current. A parent-map entry also means discovered. Give start an entry with a null parent.',
      ],
      [
        'What if the target cannot be reached?',
        'After BFS, a missing target entry means return an empty list. If start equals target, the correct path contains start.',
      ],
      [
        'How do I return the forward route?',
        'Append target, then its parent, and continue until the start/null parent. The resulting list is backwards, so reverse it.',
      ],
    ],
    after:
      'Optionally write a few explanation lines in the Solution.java comment. Use the walkthrough after trying the task. Existing distance and DFS tasks remain available.',
    template: 'Starter method — edit Solution.java in the downloaded folder',
    selfEvaluation: 'Optional: explain your solution',
    selfItems: [
      'Why does first discovery of target give a shortest hop path?',
      'Why do the saved parent links lead back to start, and why reverse them?',
      'What are BFS time/memory and the extra cost of building a path of length k?',
    ],
    signature: 'public static List<Vertex> shortestPath(Vertex start, Vertex target)',
    pathExplanation:
      'Remember where each vertex was discovered from: its parent. After BFS, follow parents from target back to start, then reverse the list. This is called reconstructing the path.',
    walkthroughTitle: 'Walkthrough: from parents to the route',
    walkthrough: [
      'One valid BFS discovers 1 from 0 and 3 from 1: parent(1)=0, parent(3)=1.',
      'Read backwards from target 3: [3, 1, 0]. The null parent of 0 ends the chain.',
      'Reverse it to [0, 1, 3]. Three vertices make two edges.',
      'Discovering 3 from 2 instead gives [0, 2, 3], also correct. The checker checks the route properties rather than a fixed answer.',
    ],
    costNote:
      'For R discovered vertices and A examined neighbour entries, BFS takes expected O(R + A) time and O(R) extra memory. Reading and reversing a route containing k vertices takes O(k) time and O(k) result space. This excludes the input graph.',
  },
  ru: {
    title: 'Задание 2: BFS — найти и вернуть кратчайший путь',
    intro:
      'После расстояний BFS получите сам маршрут. Напишите один метод с вершинами TRA, очередью и картой родителей, затем проверьте его локально.',
    graph:
      'Ориентированный ромб: из 0 в 1 и 2, из обеих в 3; вершина 4 изолирована. Старт 0; цель 3 выделена.',
    task: 'Что нужно написать',
    description:
      'Верните настоящие объекты Vertex кратчайшего по числу рёбер пути, в порядке от start к target, включая оба конца. Принимается любой кратчайший маршрут.',
    example:
      'При start = 0, target = 3: [0, 1, 3] или [0, 2, 3] — оба пути содержат 2 ребра. Для target = 4 верните []. При start = target = 0 верните [0]. Номера обозначают вершины рисунка; возвращать нужно Vertex, а не числа или метки.',
    download: 'Скачать задание, библиотеку и проверку (.zip)',
    instructions: 'Как выполнить и проверить',
    steps: [
      'Используйте JDK 11 или новее. Распакуйте ZIP и откройте папку bfs-path в IDE.',
      'Меняйте только Solution.java. Замените исключение TODO на BFS и сборку пути по родителям. Можно добавить вспомогательные методы.',
      'Сохраните файл и выполните команду ниже из этой папки. После исправлений запускайте снова; каждая попытка начинается заново.',
    ],
    initial:
      'Нетронутый шаблон сообщает, что решение ещё не написано. После реализации проверка покажет пройденные случаи и объяснит ошибки. Чтобы начать заново, возьмите исходный Solution.java из ZIP.',
    files:
      'В ZIP находятся Solution.java, Check.java, GraphChecks.java, приложенный traj.jar и README на английском и финском. Настраивать Maven или Gradle не требуется.',
    contract: 'Условия и нужные методы библиотеки',
    rules: [
      'start и target не null и принадлежат одному ориентированному графу. Каждое ребро — один шаг; возможны циклы, петли и одинаковые метки. Параллельных рёбер нет.',
      'Не меняйте структуру графа и поля вершин/рёбер. Цвета могут быть произвольными. Храните обнаружение и родителей в собственной карте.',
      'Верните исходные Vertex в прямом порядке, включая оба конца. Недостижимость — пустой список, не null. При start == target нужен [start].',
      'Принимается любой правильный кратчайший путь. Порядок соседей и равные варианты не требуют одного фиксированного списка.',
    ],
    api: [
      ['vertex.neighbors()', 'Исходящие соседи; следуйте направлению стрелок.'],
      [
        'queue.offer(vertex) / queue.remove()',
        'Добавить в конец, извлечь из начала TRA LinkedQueue.',
      ],
      [
        'parent.containsKey(vertex)',
        'Эта конкретная вершина уже обнаружена? Для старта тоже нужна запись.',
      ],
      ['parent.put(next, vertex)', 'Запомнить, кто обнаружил next, до добавления в очередь.'],
      ['Collections.reverse(path)', 'Развернуть цепочку цель → старт в требуемый прямой маршрут.'],
    ],
    checks: 'Как работает проверка',
    checking:
      'Проверка использует настоящий traj.jar и --release 11. Десять групп: совпадение концов, недостижимость, цепочка, два правильных кратчайших пути, прямой короткий путь, цикл, несвязность, направление, одинаковые метки/петли и 36 графов с фиксированным seed. Проверяются настоящие вершины, направления рёбер, концы, минимальная длина и сохранность входа. Каждая группа — новая JVM и лимит 5 секунд.',
    feedback:
      'При ошибке показываются рёбра входа, start, target и номера возвращённых вершин, когда это возможно. Объясняются обратный порядок, отсутствующее ребро, некратчайший путь, чужие вершины и изменение входа. Ошибки компиляции выводятся отдельно; число попыток не ограничено.',
    limits:
      'Для этих входов принимаются все правильные кратчайшие маршруты. Проверки не доказывают использование BFS и асимптотику. Обоснуйте корректность и сложность своими словами; лимит времени не измеряет скорость.',
    hints: 'Нужна подсказка?',
    hintItems: [
      [
        'Как сохранить родителя?',
        'При первом обнаружении задайте parent[next] = current. Запись в карте одновременно отмечает обнаружение. Для start сохраните родителя null.',
      ],
      [
        'Что делать с недостижимой целью?',
        'После BFS отсутствие target в карте означает пустой список. Когда start совпадает с target, путь содержит start.',
      ],
      [
        'Как получить прямой маршрут?',
        'Добавьте target, затем его родителя и так до старта/родителя null. Список получается обратным, поэтому разверните его.',
      ],
    ],
    after:
      'По желанию напишите несколько строк обоснования в комментарии Solution.java. Откройте разбор после самостоятельной попытки. Прежние задания на расстояния и DFS сохранены.',
    template: 'Шаблон — редактируйте Solution.java в скачанной папке',
    selfEvaluation: 'По желанию: обоснуйте решение',
    selfItems: [
      'Почему первое обнаружение target даёт кратчайший путь в рёбрах?',
      'Почему сохранённые родители ведут к start и зачем разворачивать цепочку?',
      'Каковы время/память BFS и дополнительная стоимость сборки пути длины k?',
    ],
    signature: 'public static List<Vertex> shortestPath(Vertex start, Vertex target)',
    pathExplanation:
      'При обнаружении вершины запоминайте, откуда в неё пришли: её родителя. После BFS пройдите по родителям от цели к старту и разверните список. Это называют восстановлением пути.',
    walkthroughTitle: 'Разбор: от родителей к маршруту',
    walkthrough: [
      'Один правильный BFS обнаруживает 1 из 0 и 3 из 1: parent(1)=0, parent(3)=1.',
      'Читаем назад от цели 3: [3, 1, 0]. Родитель null у 0 завершает цепочку.',
      'Разворачиваем в [0, 1, 3]. Три вершины дают два ребра.',
      'Если 3 обнаружена из 2, получается [0, 2, 3] — тоже верно. Проверка оценивает свойства пути, а не совпадение с одним списком.',
    ],
    costNote:
      'Для R обнаруженных вершин и A просмотренных записей соседей BFS требует ожидаемое O(R + A) времени и O(R) дополнительной памяти. Чтение и разворот маршрута из k вершин требуют O(k) времени и O(k) памяти результата. Сам входной граф не учитывается.',
  },
  fi: {
    title: 'Tehtävä 2: BFS — etsi ja palauta lyhin polku',
    intro:
      'BFS-etäisyyksien jälkeen muodosta itse reitti. Kirjoita yksi metodi TRA-solmuilla, jonolla ja vanhempikartalla ja tarkista se paikallisesti.',
    graph:
      'Suunnattu vinoneliö: 0:sta solmuihin 1 ja 2, molemmista solmuun 3; solmu 4 on erillinen. Aloitus 0; kohde 3 on korostettu.',
    task: 'Mitä kirjoitetaan',
    description:
      'Palauta kaarimäärältään lyhimmän polun oikeat Vertex-oliot järjestyksessä start-solmusta target-solmuun, molemmat päät mukana. Mikä tahansa lyhin reitti hyväksytään.',
    example:
      'Kun start = 0 ja target = 3: [0, 1, 3] tai [0, 2, 3] — molemmissa on 2 kaarta. Kun target = 4, palauta []. Kun start = target = 0, palauta [0]. Numerot tarkoittavat kuvan solmuja; palauta Vertex-oliot, älä lukuja tai nimiä.',
    download: 'Lataa tehtävä, kirjasto ja tarkistin (.zip)',
    instructions: 'Näin ratkaiset ja tarkistat',
    steps: [
      'Käytä JDK 11:tä tai uudempaa. Pura ZIP ja avaa bfs-path-kansio IDE:ssä.',
      'Muokkaa vain Solution.java. Korvaa TODO-poikkeus BFS:llä ja vanhempiketjusta muodostettavalla polulla. Apumetodit sallitaan.',
      'Tallenna ja suorita alla oleva komento tästä kansiosta. Korjausten jälkeen suorita uudelleen; jokainen yritys alkaa alusta.',
    ],
    initial:
      'Muuttamaton aloituspohja kertoo, ettei ratkaisua ole vielä kirjoitettu. Toteutuksen jälkeen tarkistin näyttää läpäistyt tapaukset ja selittää virheet. Aloita alusta palauttamalla alkuperäinen Solution.java ZIPistä.',
    files:
      'ZIP sisältää tiedostot Solution.java, Check.java, GraphChecks.java, mukana tulleen traj.jar-kirjaston sekä README-ohjeet englanniksi ja suomeksi. Mavenia tai Gradlea ei tarvitse määrittää.',
    contract: 'Ehdot ja tarvittavat kirjastometodit',
    rules: [
      'start ja target eivät ole null ja kuuluvat samaan suunnattuun verkkoon. Jokainen kaari on yksi askel; syklit, silmukat ja samat nimet sallitaan. Ei rinnakkaiskaaria.',
      'Älä muuta verkon rakennetta tai solmujen/kaarien kenttiä. Värit voivat olla mielivaltaisia. Tallenna löytyminen ja vanhemmat omaan karttaan.',
      'Palauta alkuperäiset Vertex-oliot eteenpäin, molemmat päät mukana. Saavuttamaton tarkoittaa tyhjää listaa, ei null. Kun start == target, palauta [start].',
      'Mikä tahansa kelvollinen lyhin polku hyväksytään. Naapurijärjestys tai tasatilanne ei vaadi yhtä ennalta määrättyä listaa.',
    ],
    api: [
      ['vertex.neighbors()', 'Lähtönaapurit; seuraa nuolten suuntaa.'],
      [
        'queue.offer(vertex) / queue.remove()',
        'Lisää loppuun, poista alusta TRA LinkedQueue -jonossa.',
      ],
      [
        'parent.containsKey(vertex)',
        'Onko tämä solmu jo löydetty? Myös aloitukselle tarvitaan merkintä.',
      ],
      ['parent.put(next, vertex)', 'Tallenna next-solmun löytäjä ennen jonoon lisäämistä.'],
      ['Collections.reverse(path)', 'Käännä kohde → alku -ketju vaadituksi eteneväksi reitiksi.'],
    ],
    checks: 'Miten tarkistin toimii',
    checking:
      'Tarkistin käyttää oikeaa traj.jaria ja --release 11 -asetusta. Kymmenen ryhmää: samat päät, saavuttamattomuus, ketju, kaksi lyhintä polkua, lyhyempi suora polku, sykli, epäyhtenäisyys, suunta, samat nimet/silmukat ja 36 kiinteän siemenen verkkoa. Tarkistetaan oikeat solmut, kaarien suunnat, päät, minimipituus ja syötteen säilyminen. Jokainen ryhmä saa uuden JVM:n ja 5 sekunnin rajan.',
    feedback:
      'Virhe näyttää syötekaaret, start- ja target-arvot sekä palautetut solmunumerot, kun mahdollista. Se selittää väärän suunnan, puuttuvan kaaren, liian pitkän polun, vieraat solmut ja syötteen muutokset. Käännösvirheet näytetään erikseen; yrityksiä ei rajoiteta.',
    limits:
      'Näille syötteille hyväksytään kaikki kelvolliset lyhimmät reitit. Testit eivät todista BFS:n käyttöä tai asymptoottista vaativuutta. Perustele oikeellisuus ja vaativuus itse; aikaraja ei mittaa nopeutta.',
    hints: 'Tarvitsetko vihjeen?',
    hintItems: [
      [
        'Miten vanhempi tallennetaan?',
        'Aseta ensimmäisellä löytymisellä parent[next] = current. Karttamerkintä merkitsee myös löytymistä. Tallenna start-solmun vanhemmaksi null.',
      ],
      [
        'Entä saavuttamaton kohde?',
        'Jos target puuttuu kartasta BFS:n jälkeen, palauta tyhjä lista. Kun start on target, polku sisältää start-solmun.',
      ],
      [
        'Miten reitti käännetään eteenpäin?',
        'Lisää target, sitten sen vanhempi ja jatka alkuun/null-vanhempaan. Lista on takaperin, joten käännä se.',
      ],
    ],
    after:
      'Voit kirjoittaa muutaman perustelurivin Solution.java-tiedoston kommenttiin. Avaa esimerkin läpikäynti oman yrityksen jälkeen. Aiemmat etäisyys- ja DFS-tehtävät säilyvät.',
    template: 'Aloituspohja — muokkaa ladatun kansion Solution.java-tiedostoa',
    selfEvaluation: 'Vapaaehtoinen: perustele ratkaisusi',
    selfItems: [
      'Miksi target-solmun ensimmäinen löytyminen antaa lyhimmän kaaripolun?',
      'Miksi vanhemmat johtavat start-solmuun ja miksi ketju käännetään?',
      'Mitkä ovat BFS:n aika/muisti ja k-pituisen polun muodostamisen lisäkustannus?',
    ],
    signature: 'public static List<Vertex> shortestPath(Vertex start, Vertex target)',
    pathExplanation:
      'Tallenna löydettäessä, mistä solmu löydettiin: sen vanhempi. Seuraa BFS:n jälkeen vanhempia kohteesta alkuun ja käännä lista. Tätä kutsutaan polun palauttamiseksi.',
    walkthroughTitle: 'Esimerkin läpikäynti: vanhemmista reitiksi',
    walkthrough: [
      'Yksi kelvollinen BFS löytää 1:n 0:sta ja 3:n 1:stä: parent(1)=0, parent(3)=1.',
      'Lue kohteesta 3 taaksepäin: [3, 1, 0]. Solmun 0 null-vanhempi päättää ketjun.',
      'Käännä listaksi [0, 1, 3]. Kolme solmua muodostaa kaksi kaarta.',
      'Jos 3 löydetään 2:sta, saadaan [0, 2, 3], joka on myös oikein. Tarkistin arvioi polun ominaisuuksia eikä yhden listan vastaavuutta.',
    ],
    costNote:
      'Kun löydetään R solmua ja tutkitaan A naapurimerkintää, BFS vie odotetusti O(R + A) aikaa ja O(R) lisämuistia. k solmun reitin lukeminen ja kääntäminen vie O(k) aikaa ja O(k) tulosmuistia. Syöteverkkoa ei lasketa mukaan.',
  },
}
