export const graphCodingExerciseTranslations = {
  en: {
    title: 'Try it in Java: count reachable vertices',
    intro:
      'Write one recursive DFS method using the course library. Download the task, edit Solution.java in your IDE, and run the included checker on your computer.',
    graph: 'Directed graph: 0 to 1 and 2; 1 and 2 to 3; vertex 4 is isolated. Start at 0.',
    task: 'Your task',
    description:
      'Return the number of different vertices reachable from start by following outgoing edges. Count start itself, and count each vertex only once.',
    example:
      'For the graph shown: start = 0 → answer 4. Vertex 3 is counted once despite two paths to it. Vertex 4 cannot be reached. With start = 3, the answer is 1.',
    download: 'Download task + library + checker (.zip)',
    instructions: 'How to solve and check',
    steps: [
      'Install JDK 11 or newer. Download and extract the ZIP; open the dfs-reachable folder in your IDE.',
      'Edit only Solution.java. Replace the TODO exception with your recursive DFS; you may add helper methods.',
      'Save the file and open a terminal inside that folder. Run the command below. After fixing a mistake, run the same command again.',
    ],
    initial:
      'The untouched template reports unfinished work. After implementing the method, the checker shows which cases pass and explains failures. To start over, restore Solution.java from the ZIP.',
    files:
      'The ZIP contains Solution.java, Check.java, GraphChecks.java, the supplied traj.jar, and instructions in English, Russian and Finnish. No Maven or Gradle setup is needed.',
    contract: 'Conditions and useful library methods',
    rules: [
      'The graph is directed and unweighted, with possible cycles and self-loops, but no parallel edges. start is never null.',
      'The checker creates each graph and sets every vertex WHITE before calling your method. Mark reached vertices GREY or BLACK and leave unreachable vertices WHITE.',
      'Do not change vertices or edges. Labels may repeat. The order of neighbours does not affect the count.',
    ],
    api: [
      ['vertex.neighbors()', 'Outgoing neighbours; use in a for-each loop.'],
      ['vertex.getColor()', 'Read the current colour.'],
      ['vertex.setColor(AbstractGraph.GREY)', 'Mark a discovered vertex; BLACK is also accepted.'],
    ],
    checks: 'What the checker does',
    checking:
      'It compiles your saved method with the real traj.jar and runs 10 groups: isolated start, chain, branching, cycle, disconnected graph, direction, converging paths, self-loop, duplicate labels and 30 additional graphs. It checks counts, colours and unchanged structure. Each group has a fresh process and a 5-second time limit.',
    feedback:
      'A failure shows the graph, start, expected result and actual result. Compilation errors and stack overflows are explained separately. Every run is a fresh attempt; results never lock your code.',
    limits:
      'Checks verify these examples; they do not prove recursion or complexity. Review the method and justify its time and stack usage separately. The time limit is not a speed measurement.',
    hints: 'Need a hint?',
    hintItems: [
      [
        'Where to begin?',
        'The start is already one reachable vertex. The neighbours may lead to more vertices.',
      ],
      [
        'How to stop a cycle?',
        'Mark a vertex before following its neighbours, and skip vertices already marked. Do not reset colours in each recursive call.',
      ],
      [
        'What should a call return?',
        'Combine the contribution of this vertex with the results from previously undiscovered neighbours. The same vertex must not contribute twice.',
      ],
    ],
    after:
      'After solving: explain why a cycle terminates, why converging paths do not double-count, and how reachable vertices and examined adjacency entries determine time and maximum stack depth.',
    template: 'Starter method — edit Solution.java in the downloaded folder',
  },
  ru: {
    title: 'Попробуйте на Java: посчитайте достижимые вершины',
    intro:
      'Напишите один метод рекурсивного DFS с библиотекой курса. Скачайте задание, откройте Solution.java в IDE и запустите приложенную проверку на своём компьютере.',
    graph: 'Направленный граф: из 0 в 1 и 2; из 1 и 2 в 3; вершина 4 изолирована. Старт в 0.',
    task: 'Что нужно написать',
    description:
      'Метод возвращает количество разных вершин, до которых можно дойти из start по направлению рёбер. Сам start тоже считается. Каждую вершину учитывайте только один раз.',
    example:
      'Для графа на рисунке: start = 0 → ответ 4. Вершина 3 считается один раз, хотя к ней ведут два пути. До вершины 4 дойти нельзя. При start = 3 ответ равен 1.',
    download: 'Скачать задание, библиотеку и проверку (.zip)',
    instructions: 'Как выполнить и проверить',
    steps: [
      'Установите JDK 11 или новее. Скачайте и распакуйте ZIP, откройте папку dfs-reachable в IDE.',
      'Меняйте только Solution.java. Вместо исключения TODO напишите свой рекурсивный DFS; можно добавить вспомогательные методы.',
      'Сохраните файл и откройте терминал внутри этой папки. Выполните команду ниже. После исправления ошибки запускайте ту же команду снова.',
    ],
    initial:
      'Нетронутый шаблон сообщает, что решение ещё не написано. После реализации проверка покажет пройденные случаи и объяснит ошибки. Чтобы начать заново, возьмите исходный Solution.java из ZIP.',
    files:
      'В ZIP находятся Solution.java, Check.java, GraphChecks.java, приложенный traj.jar и инструкции на русском, финском и английском. Настраивать Maven или Gradle не требуется.',
    contract: 'Условия и нужные методы библиотеки',
    rules: [
      'Граф направленный, без весов и параллельных рёбер. Возможны циклы и петли. start никогда не равен null.',
      'Проверка сама создаёт граф и перед вызовом помечает все вершины WHITE. Найденные вершины помечайте GREY или BLACK, недостижимые оставляйте WHITE.',
      'Не меняйте вершины и рёбра. Метки вершин могут совпадать. Порядок соседей не влияет на количество.',
    ],
    api: [
      ['vertex.neighbors()', 'Исходящие соседи; можно перебирать циклом for-each.'],
      ['vertex.getColor()', 'Прочитать текущий цвет.'],
      ['vertex.setColor(AbstractGraph.GREY)', 'Пометить найденную вершину; BLACK тоже подходит.'],
    ],
    checks: 'Как работает проверка',
    checking:
      'Проверка компилирует сохранённый метод с настоящим traj.jar и запускает 10 групп: изолированный старт, цепочка, разветвление, цикл, несвязность, направление рёбер, сходящиеся пути, петля, одинаковые метки и 30 дополнительных графов. Проверяются количество, цвета и сохранность структуры. Каждая группа запускается в новом процессе с лимитом 5 секунд.',
    feedback:
      'При ошибке показываются граф, старт, ожидаемое и полученное значения. Ошибки компиляции и переполнение стека объясняются отдельно. Каждый запуск проверяет заново; результаты не блокируют ваш код.',
    limits:
      'Проверки подтверждают эти примеры, но не доказывают рекурсивность и сложность. Их нужно обосновать отдельно по коду. Ограничение времени не является замером скорости.',
    hints: 'Нужна подсказка?',
    hintItems: [
      [
        'С чего начать?',
        'Сам start — уже одна достижимая вершина. Через его соседей можно найти остальные.',
      ],
      [
        'Как не зациклиться?',
        'Помечайте вершину до обхода её соседей и пропускайте уже помеченные. Не сбрасывайте цвета в каждом рекурсивном вызове.',
      ],
      [
        'Что возвращает вызов?',
        'Объедините вклад текущей вершины и результаты ещё не обнаруженных соседей. Одна вершина не должна давать вклад дважды.',
      ],
    ],
    after:
      'После решения объясните, почему обход завершается на цикле, почему сходящиеся пути не дают повторного подсчёта и как достижимые вершины и просмотренные записи смежности определяют время и максимальный стек.',
    template: 'Шаблон — редактируйте Solution.java в скачанной папке',
  },
  fi: {
    title: 'Kokeile Javalla: laske saavutettavat solmut',
    intro:
      'Kirjoita yksi rekursiivinen DFS-metodi kurssikirjastolla. Lataa tehtävä, avaa Solution.java IDE:ssä ja suorita mukana tuleva tarkistin omalla koneellasi.',
    graph:
      'Suunnattu graafi: 0:sta solmuihin 1 ja 2; solmuista 1 ja 2 solmuun 3; solmu 4 on eristetty. Aloitus 0.',
    task: 'Mitä kirjoitetaan',
    description:
      'Palauta niiden eri solmujen lukumäärä, joihin pääsee start-solmusta kaarten suuntaan. Laske myös start mukaan. Laske kukin solmu vain kerran.',
    example:
      'Kuvan graafissa start = 0 → vastaus 4. Solmu 3 lasketaan kerran, vaikka siihen johtaa kaksi polkua. Solmuun 4 ei pääse. Kun start = 3, vastaus on 1.',
    download: 'Lataa tehtävä, kirjasto ja tarkistin (.zip)',
    instructions: 'Näin ratkaiset ja tarkistat',
    steps: [
      'Asenna JDK 11 tai uudempi. Lataa ja pura ZIP, avaa dfs-reachable-kansio IDE:ssä.',
      'Muokkaa vain Solution.java-tiedostoa. Korvaa TODO-poikkeus rekursiivisella DFS:llä; voit lisätä apumetodeja.',
      'Tallenna tiedosto ja avaa pääte tässä kansiossa. Suorita alla oleva komento. Korjattuasi virheen suorita sama komento uudelleen.',
    ],
    initial:
      'Muuttamaton aloituspohja kertoo, ettei ratkaisua ole vielä kirjoitettu. Toteutuksen jälkeen tarkistin näyttää läpäistyt tapaukset ja selittää virheet. Aloita alusta palauttamalla alkuperäinen Solution.java ZIPistä.',
    files:
      'ZIP sisältää tiedostot Solution.java, Check.java, GraphChecks.java, mukana tulleen traj.jar-kirjaston sekä ohjeet suomeksi, venäjäksi ja englanniksi. Mavenia tai Gradlea ei tarvitse määrittää.',
    contract: 'Ehdot ja tarvittavat kirjastometodit',
    rules: [
      'Graafi on suunnattu ja painottamaton, eikä siinä ole rinnakkaisia kaaria. Syklit ja silmukat ovat mahdollisia. start ei ole null.',
      'Tarkistin luo graafin ja asettaa kaikki solmut WHITE-väriin ennen kutsua. Merkitse löydetyt solmut GREY- tai BLACK-värillä ja jätä saavuttamattomat WHITE-väriin.',
      'Älä muuta solmuja tai kaaria. Solmuilla voi olla samat nimiöt. Naapurijärjestys ei vaikuta lukumäärään.',
    ],
    api: [
      ['vertex.neighbors()', 'Lähtevät naapurit; voidaan käydä läpi for-each-silmukalla.'],
      ['vertex.getColor()', 'Lue nykyinen väri.'],
      ['vertex.setColor(AbstractGraph.GREY)', 'Merkitse löydetty solmu; myös BLACK hyväksytään.'],
    ],
    checks: 'Miten tarkistin toimii',
    checking:
      'Tarkistin kääntää tallennetun metodin oikean traj.jar-kirjaston kanssa ja suorittaa 10 ryhmää: eristetty aloitus, ketju, haarautuminen, sykli, epäyhtenäisyys, kaarten suunta, yhdistyvät polut, silmukka, samat nimiöt ja 30 lisägraafia. Se tarkistaa lukumäärän, värit ja rakenteen säilymisen. Jokainen ryhmä saa uuden prosessin ja 5 sekunnin aikarajan.',
    feedback:
      'Virheen yhteydessä näytetään graafi, aloitus sekä odotettu ja saatu arvo. Käännösvirheet ja pinon ylivuoto selitetään erikseen. Jokainen ajo tarkistaa uudelleen; tulokset eivät lukitse koodia.',
    limits:
      'Testit vahvistavat nämä esimerkit, mutta eivät todista rekursiivisuutta tai vaativuutta. Perustele ne erikseen koodista. Aikaraja ei ole nopeusmittaus.',
    hints: 'Tarvitsetko vihjeen?',
    hintItems: [
      [
        'Mistä aloitetaan?',
        'start on jo yksi saavutettava solmu. Sen naapureiden kautta löytyy lisää solmuja.',
      ],
      [
        'Miten sykli pysäytetään?',
        'Merkitse solmu ennen naapureiden läpikäyntiä ja ohita jo merkityt solmut. Älä alusta värejä jokaisessa rekursiivisessa kutsussa.',
      ],
      [
        'Mitä kutsu palauttaa?',
        'Yhdistä nykyisen solmun osuus vielä löytämättömien naapureiden tuloksiin. Sama solmu ei saa kasvattaa määrää kahdesti.',
      ],
    ],
    after:
      'Ratkaistuasi perustele pysähtyminen syklissä, yhdistyvien polkujen kertalaskenta ja se, miten saavutettavat solmut ja tutkitut naapuruusmerkinnät määräävät ajan ja rekursiopinon enimmäiskoon.',
    template: 'Aloituspohja — muokkaa ladatun kansion Solution.java-tiedostoa',
  },
}
