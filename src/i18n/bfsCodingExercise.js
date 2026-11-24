export const bfsCodingExerciseTranslations = {
  en: {
    title: 'Try it in Java: shortest BFS distances',
    intro:
      'Write one BFS method using the TRA queue and an external distance map. Download the task, edit Solution.java and run the local checker.',
    graph: 'Directed graph: 0 to 1 and 2; 1 and 2 to 3; vertex 4 is isolated. Start at 0.',
    task: 'Your task',
    description:
      'Return Map<Vertex, Integer> with the shortest number of outgoing edges from start to every reachable vertex. Include start with distance 0. Leave unreachable vertices out of the map.',
    example:
      'For the drawing, start = 0 → {0:0, 1:1, 2:1, 3:2}; vertex 4 is absent. From start = 3, return only {3:0}. Map iteration order does not matter.',
    download: 'Download task + library + checker (.zip)',
    instructions: 'How to solve and check',
    steps: [
      'Install JDK 11 or newer. Extract the ZIP and open bfs-distances in your IDE.',
      'Edit only Solution.java. Replace the TODO exception with a queue-based BFS; helpers are allowed.',
      'Save, open a terminal in that folder and run the command below. After a correction, run the same command again.',
    ],
    initial:
      'The untouched template reports unfinished work. After implementing the method, the checker shows which cases pass and explains failures. To start over, restore Solution.java from the ZIP.',
    files:
      'The ZIP contains Solution.java, Check.java, GraphChecks.java, the supplied traj.jar, and English and Finnish README files. No Maven or Gradle setup is needed.',
    contract: 'Conditions and useful library methods',
    rules: [
      'The directed unweighted graph may contain cycles, self-loops and equal labels, but no parallel edges. start is a valid non-null vertex.',
      'Colours can have arbitrary values. Do not read them as discovery marks or change any graph fields: record discovery in your new distance map.',
      'Return actual Vertex keys and integer hop distances. Unreachable vertices must be absent; -1 entries are not accepted.',
    ],
    api: [
      ['vertex.neighbors()', 'Outgoing neighbours of a TRA vertex.'],
      [
        'queue.offer(vertex) / queue.remove()',
        'Add at the tail, take from the head of TRA LinkedQueue.',
      ],
      ['distance.containsKey(vertex)', 'Has this actual vertex already been discovered?'],
      [
        'distance.put(next, value)',
        'Save a distance before enqueueing the newly discovered vertex.',
      ],
    ],
    checks: 'What the checker does',
    checking:
      'The checker compiles with --release 11 and the original traj.jar. Ten groups cover isolation, chains, shared neighbours, cycles, disconnection, direction, a shorter alternative, a self-loop, equal labels and 30 fixed-seed graphs. It compares against independent shortest-hop calculations and checks unchanged input fields. Each group has a fresh JVM and 5-second limit.',
    feedback:
      'A failure shows the graph, start, expected result and actual result. Compilation errors and stack overflows are explained separately. Every run is a fresh attempt; results never lock your code.',
    limits:
      'Passing cases do not prove that the code uses BFS or has the claimed complexity. Explain the algorithm separately; the timeout is not a benchmark.',
    hints: 'Need a hint?',
    hintItems: [
      ['What goes into the queue first?', 'Store distance[start] = 0, then enqueue start.'],
      [
        'How do I avoid duplicates?',
        'Save the neighbour distance before enqueueing. A map entry means the vertex is already discovered.',
      ],
      [
        'Which distance should a new neighbour receive?',
        'The current distance plus one. FIFO order processes nearer layers first.',
      ],
    ],
    after:
      'Write a few self-evaluation lines in the optional comment in Solution.java. You can retry indefinitely; there is no score to reset on the website.',
    template: 'Starter method — edit Solution.java in the downloaded folder',
    selfEvaluation: 'Optional: explain your solution',
    selfItems: [
      'Why does first discovery give a shortest hop distance?',
      'Why is each vertex enqueued at most once, including on cycles?',
      'What are time and queue/map memory costs for the reachable part?',
    ],
  },
  ru: {
    title: 'Попробуйте на Java: кратчайшие расстояния BFS',
    intro:
      'Напишите один метод BFS с очередью TRA и отдельной картой расстояний. Скачайте задание, измените Solution.java и запустите локальную проверку.',
    graph: 'Направленный граф: из 0 в 1 и 2; из 1 и 2 в 3; вершина 4 изолирована. Старт в 0.',
    task: 'Что нужно написать',
    description:
      'Верните Map<Vertex, Integer> с кратчайшим числом исходящих рёбер от start до каждой достижимой вершины. Включите start с расстоянием 0. Недостижимые вершины не добавляйте в карту.',
    example:
      'Для рисунка start = 0 → {0:0, 1:1, 2:1, 3:2}; вершины 4 в карте нет. При start = 3 верните только {3:0}. Порядок записей Map не важен.',
    download: 'Скачать задание, библиотеку и проверку (.zip)',
    instructions: 'Как выполнить и проверить',
    steps: [
      'Установите JDK 11 или новее. Распакуйте ZIP и откройте bfs-distances в IDE.',
      'Меняйте только Solution.java. Замените исключение TODO на BFS с очередью; можно добавлять вспомогательные методы.',
      'Сохраните файл, откройте терминал в этой папке и выполните команду ниже. После исправлений запускайте её снова.',
    ],
    initial:
      'Нетронутый шаблон сообщает, что решение ещё не написано. После реализации проверка покажет пройденные случаи и объяснит ошибки. Чтобы начать заново, возьмите исходный Solution.java из ZIP.',
    files:
      'В ZIP находятся Solution.java, Check.java, GraphChecks.java, приложенный traj.jar и README на английском и финском. Настраивать Maven или Gradle не требуется.',
    contract: 'Условия и нужные методы библиотеки',
    rules: [
      'Ориентированный невзвешенный граф может иметь циклы, петли и одинаковые метки, но не параллельные рёбра. start — допустимая вершина, не null.',
      'Цвета могут быть произвольными. Не используйте их для посещения и не меняйте поля графа: обнаружение храните в новой карте расстояний.',
      'Ключи — настоящие Vertex, значения — целые расстояния в рёбрах. Недостижимые должны отсутствовать; записи с -1 не принимаются.',
    ],
    api: [
      ['vertex.neighbors()', 'Исходящие соседи вершины TRA.'],
      [
        'queue.offer(vertex) / queue.remove()',
        'Добавить в конец и извлечь из начала TRA LinkedQueue.',
      ],
      ['distance.containsKey(vertex)', 'Эта конкретная вершина уже обнаружена?'],
      ['distance.put(next, value)', 'Сохранить расстояние до добавления новой вершины в очередь.'],
    ],
    checks: 'Как работает проверка',
    checking:
      'Проверка компилирует с --release 11 и исходным traj.jar. Десять групп: изоляция, цепочка, общий сосед, цикл, несвязность, направление, более короткий путь, петля, одинаковые метки и 30 графов с фиксированным seed. Проверяются кратчайшие расстояния независимым способом и сохранность полей входа. Каждая группа — новая JVM и лимит 5 секунд.',
    feedback:
      'При ошибке показываются граф, старт, ожидаемое и полученное значения. Ошибки компиляции и переполнение стека объясняются отдельно. Каждый запуск проверяет заново; результаты не блокируют ваш код.',
    limits:
      'Пройденные случаи не доказывают использование BFS и заявленную сложность. Обоснуйте алгоритм отдельно; лимит времени не является измерением скорости.',
    hints: 'Нужна подсказка?',
    hintItems: [
      [
        'Что первым положить в очередь?',
        'Сохраните distance[start] = 0, затем добавьте start в очередь.',
      ],
      [
        'Как избежать повторений?',
        'Сохраните расстояние до соседа перед добавлением. Запись в карте означает, что вершина уже обнаружена.',
      ],
      [
        'Какое расстояние получает новый сосед?',
        'Расстояние текущей вершины плюс один. FIFO обрабатывает ближние уровни раньше дальних.',
      ],
    ],
    after:
      'По желанию напишите несколько строк самооценки в комментарии Solution.java. Попытки не ограничены; на сайте нет оценки, которую нужно сбрасывать.',
    template: 'Шаблон — редактируйте Solution.java в скачанной папке',
    selfEvaluation: 'По желанию: обоснуйте решение',
    selfItems: [
      'Почему первое обнаружение даёт кратчайшее расстояние в рёбрах?',
      'Почему каждая вершина добавляется один раз, включая циклы?',
      'Каковы время и память очереди/карты для достижимой части?',
    ],
  },
  fi: {
    title: 'Kokeile Javalla: BFS:n lyhimmät etäisyydet',
    intro:
      'Kirjoita yksi BFS-metodi TRA-jonolla ja erillisellä etäisyyskartalla. Lataa tehtävä, muokkaa Solution.java ja suorita paikallinen tarkistin.',
    graph:
      'Suunnattu graafi: 0:sta solmuihin 1 ja 2; solmuista 1 ja 2 solmuun 3; solmu 4 on eristetty. Aloitus 0.',
    task: 'Mitä kirjoitetaan',
    description:
      'Palauta Map<Vertex, Integer>, jossa on lyhin lähtökaarien määrä start-solmusta jokaiseen saavutettavaan solmuun. Lisää start etäisyydellä 0. Jätä saavuttamattomat solmut pois kartasta.',
    example:
      'Kuvassa start = 0 → {0:0, 1:1, 2:1, 3:2}; solmu 4 puuttuu. Kun start = 3, palauta vain {3:0}. Map-alkioiden järjestys ei vaikuta.',
    download: 'Lataa tehtävä, kirjasto ja tarkistin (.zip)',
    instructions: 'Näin ratkaiset ja tarkistat',
    steps: [
      'Asenna JDK 11 tai uudempi. Pura ZIP ja avaa bfs-distances IDE:ssä.',
      'Muokkaa vain Solution.java. Korvaa TODO-poikkeus jonoon perustuvalla BFS:llä; apumetodit sallitaan.',
      'Tallenna, avaa pääte tähän kansioon ja suorita alla oleva komento. Suorita sama komento korjausten jälkeen.',
    ],
    initial:
      'Muuttamaton aloituspohja kertoo, ettei ratkaisua ole vielä kirjoitettu. Toteutuksen jälkeen tarkistin näyttää läpäistyt tapaukset ja selittää virheet. Aloita alusta palauttamalla alkuperäinen Solution.java ZIPistä.',
    files:
      'ZIP sisältää tiedostot Solution.java, Check.java, GraphChecks.java, mukana tulleen traj.jar-kirjaston sekä README-ohjeet englanniksi ja suomeksi. Mavenia tai Gradlea ei tarvitse määrittää.',
    contract: 'Ehdot ja tarvittavat kirjastometodit',
    rules: [
      'Suunnatussa painottomassa verkossa voi olla syklejä, silmukoita ja samoja nimiä, mutta ei rinnakkaiskaaria. start on kelvollinen solmu, ei null.',
      'Värit voivat olla mielivaltaisia. Älä käytä niitä vierailumerkkeinä äläkä muuta verkon kenttiä: tallenna löytyminen uuteen etäisyyskarttaan.',
      'Avaimet ovat oikeita Vertex-olioita ja arvot kokonaisia kaarietäisyyksiä. Saavuttamattomat puuttuvat; -1-merkintöjä ei hyväksytä.',
    ],
    api: [
      ['vertex.neighbors()', 'TRA-solmun lähtönaapurit.'],
      [
        'queue.offer(vertex) / queue.remove()',
        'Lisää loppuun ja poista alusta TRA LinkedQueue -jonossa.',
      ],
      ['distance.containsKey(vertex)', 'Onko tämä solmu jo löydetty?'],
      ['distance.put(next, value)', 'Tallenna etäisyys ennen uuden solmun lisäämistä jonoon.'],
    ],
    checks: 'Miten tarkistin toimii',
    checking:
      'Tarkistin kääntää --release 11 -asetuksella ja alkuperäisellä traj.jarilla. Kymmenen ryhmää: erillisyys, ketju, yhteinen naapuri, sykli, epäyhtenäisyys, suunta, lyhyempi polku, silmukka, samat nimet ja 30 kiinteän siemenen verkkoa. Se tarkistaa lyhimmät etäisyydet riippumattomasti ja syötteen kenttien säilymisen. Jokainen ryhmä saa uuden JVM:n ja 5 sekunnin rajan.',
    feedback:
      'Virheen yhteydessä näytetään graafi, aloitus sekä odotettu ja saatu arvo. Käännösvirheet ja pinon ylivuoto selitetään erikseen. Jokainen ajo tarkistaa uudelleen; tulokset eivät lukitse koodia.',
    limits:
      'Läpäisy ei todista BFS:n käyttöä tai ilmoitettua vaativuutta. Perustele algoritmi erikseen; aikaraja ei ole nopeusmittaus.',
    hints: 'Tarvitsetko vihjeen?',
    hintItems: [
      ['Mikä lisätään ensin jonoon?', 'Tallenna distance[start] = 0 ja lisää start jonoon.'],
      [
        'Miten toistot vältetään?',
        'Tallenna naapurin etäisyys ennen lisäämistä. Karttamerkintä tarkoittaa löydettyä solmua.',
      ],
      [
        'Minkä etäisyyden uusi naapuri saa?',
        'Nykyisen solmun etäisyyden plus yksi. FIFO käsittelee läheiset tasot ennen kaukaisia.',
      ],
    ],
    after:
      'Voit kirjoittaa muutaman itsearviointirivin Solution.java-tiedoston kommenttiin. Yrityksiä ei rajoiteta; sivulla ei ole nollattavaa pistemäärää.',
    template: 'Aloituspohja — muokkaa ladatun kansion Solution.java-tiedostoa',
    selfEvaluation: 'Vapaaehtoinen: perustele ratkaisusi',
    selfItems: [
      'Miksi ensimmäinen löytyminen antaa lyhimmän kaarietäisyyden?',
      'Miksi solmu lisätään vain kerran myös sykleissä?',
      'Mitkä ovat saavutettavan osan aika ja jonon/kartan muistimäärä?',
    ],
  },
}
