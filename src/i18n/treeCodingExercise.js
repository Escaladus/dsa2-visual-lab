// Shared instructions keep the two one-method exercises consistent without combining their tasks.
const common = {
  en: {
    intro:
      'Write one recursive method using TRA BTreeNode. Download the small task, edit Solution.java in your IDE and run the local Java 11+ checker.',
    diagram:
      'Binary tree: A has left child B and right child C; B has left child D. Four nodes; longest downward path A—B—D has two edges.',
    task: 'Your task',
    download: 'Download task + library + checker (.zip)',
    instructions: 'How to solve and check',
    steps: [
      'Use JDK 11 or newer. Extract this task ZIP and open its folder in your IDE. Size and height have separate downloads.',
      'Edit only Solution.java. Replace the TODO exception with your recursive method; helper methods are allowed. Add traj.jar as an IDE library for completion.',
      'Save and run the command below from the extracted folder. Correct, save and rerun as often as needed.',
    ],
    initial:
      'The untouched starter reports TODO. After implementing it, the checker explains failures. Every run compiles the current solution from scratch. To restart, restore Solution.java from the ZIP.',
    files:
      'Five files: Solution.java, Check.java, TreeChecks.java, the supplied traj.jar and one English README. No Maven or Gradle setup is needed.',
    contract: 'Conditions and useful TRA methods',
    rules: [
      'node is null or the root of a proper binary subtree: no cycles or shared child nodes. It may have a parent outside the subtree. Work downwards from node only.',
      'Preserve the tree: child links, parent links, element references and balance fields. Values may repeat or be null; balance is arbitrary metadata, not a cached answer.',
      'Use the node structure, not its element values or labels. For a BTree, pass tree.getRoot(); an empty tree has a null root.',
    ],
    api: [
      ['tree.getRoot()', 'Root of a TRA BTree, or null when empty.'],
      [
        'node.getLeftChild() / node.getRightChild()',
        'Children of this BTreeNode; a missing child is null.',
      ],
      ['node == null', 'Test for an empty subtree before reading children.'],
    ],
    checks: 'What the checker does',
    checking:
      'The original traj.jar and --release 11 are used. Ten groups cover empty/leaf inputs, left/right chains, the drawing, balanced and unequal branches, repeated values, an inner subtree with an outside parent and 40 fixed-seed trees with null/repeated values. An independent iterative calculation supplies expected results. Each method is called twice on the same input; tree fields and links must stay unchanged. Each group has a fresh JVM and a five-second limit.',
    feedback:
      'Failures show child IDs, the queried subtree root, expected/actual values and the call number. Changed input nodes, TODO, compilation errors and stack overflow are explained separately. Attempts are unlimited.',
    limits:
      'Tests check results and input preservation, not whether the implementation is recursive or has a claimed asymptotic cost. Explain those properties separately; the time limit is not a benchmark.',
    hints: 'Need a hint?',
    after:
      'Try it yourself before opening the walkthrough. Optional reasoning can go in the comment in Solution.java. Each new check starts fresh; there is no website score to reset.',
    template: 'Starter — edit Solution.java in the downloaded folder',
    selfEvaluation: 'Optional: explain your solution',
    costNote:
      'For n > 0 nodes, the standard recursive solution takes Θ(n) time and O(h + 1) stack space for edge-height h. A null-child base call can add one short frame. An empty input takes Θ(1) time and space. The returned integer uses O(1) space; the input tree is excluded.',
  },
  ru: {
    intro:
      'Напишите один рекурсивный метод на TRA BTreeNode. Скачайте небольшое задание, измените Solution.java в IDE и запустите локальную проверку Java 11+.',
    diagram:
      'Бинарное дерево: у A левый ребёнок B и правый C; у B левый ребёнок D. Четыре узла; самый длинный путь вниз A—B—D содержит два ребра.',
    task: 'Что нужно написать',
    download: 'Скачать задание, библиотеку и проверку (.zip)',
    instructions: 'Как выполнить и проверить',
    steps: [
      'Используйте JDK 11 или новее. Распакуйте ZIP задания и откройте его папку в IDE. У размера и высоты отдельные скачивания.',
      'Меняйте только Solution.java. Замените исключение TODO своим рекурсивным методом; можно добавлять вспомогательные методы. Подключите traj.jar как библиотеку IDE для подсказок кода.',
      'Сохраните файл и выполните команду ниже из распакованной папки. Исправляйте, сохраняйте и запускайте снова без ограничений.',
    ],
    initial:
      'Исходный шаблон сообщает TODO. После реализации проверка объяснит ошибки. Каждый запуск заново компилирует текущее решение. Для начала с нуля возьмите Solution.java из ZIP.',
    files:
      'Пять файлов: Solution.java, Check.java, TreeChecks.java, приложенный traj.jar и один README на английском. Настраивать Maven или Gradle не требуется.',
    contract: 'Условия и нужные методы TRA',
    rules: [
      'node — null или корень корректного бинарного поддерева: без циклов и общих детей. У него может быть родитель вне поддерева. Двигайтесь только вниз от node.',
      'Сохраните дерево: связи детей и родителей, ссылки на элементы и поля balance. Значения могут повторяться или быть null; balance — произвольные данные, а не готовый ответ.',
      'Используйте структуру узлов, а не значения или метки. Для BTree передайте tree.getRoot(); у пустого дерева корень null.',
    ],
    api: [
      ['tree.getRoot()', 'Корень TRA BTree или null для пустого дерева.'],
      [
        'node.getLeftChild() / node.getRightChild()',
        'Дети этого BTreeNode; отсутствующий ребёнок — null.',
      ],
      ['node == null', 'Проверка пустого поддерева до обращения к детям.'],
    ],
    checks: 'Как работает проверка',
    checking:
      'Используются исходный traj.jar и --release 11. Десять групп: пустота/лист, левые/правые цепочки, рисунок, сбалансированные и неравные ветви, повторы значений, поддерево с внешним родителем и 40 деревьев с фиксированным seed и null/повторами. Ожидаемый ответ вычисляется независимым итеративным обходом. Метод вызывается дважды на одном входе; поля и связи должны сохраниться. У каждой группы новая JVM и лимит пять секунд.',
    feedback:
      'Ошибка показывает номера детей, корень выбранного поддерева, ожидаемое/полученное значение и номер вызова. Изменение узлов, TODO, ошибки компиляции и переполнение стека объясняются отдельно. Число попыток не ограничено.',
    limits:
      'Тесты проверяют результат и сохранность входа, но не доказывают рекурсивность или асимптотическую сложность. Обоснуйте их отдельно; лимит времени не измеряет эффективность.',
    hints: 'Нужна подсказка?',
    after:
      'Попробуйте самостоятельно, затем откройте разбор. Обоснование можно добавить в комментарий Solution.java. Каждая проверка начинается заново; на сайте нет результата, который нужно сбрасывать.',
    template: 'Шаблон — редактируйте Solution.java в скачанной папке',
    selfEvaluation: 'По желанию: объясните решение',
    costNote:
      'При n > 0 узлах стандартное рекурсивное решение требует Θ(n) времени и O(h + 1) стека при высоте h в рёбрах. Вызов для null-ребёнка может добавить один короткий кадр. Пустой вход требует Θ(1) времени и памяти. Возвращаемое число занимает O(1); входное дерево не учитывается.',
  },
  fi: {
    intro:
      'Kirjoita yksi rekursiivinen metodi TRA BTreeNode -luokalla. Lataa pieni tehtävä, muokkaa Solution.java IDE:ssä ja suorita paikallinen Java 11+ -tarkistin.',
    diagram:
      'Binääripuu: A:n vasen lapsi on B ja oikea C; B:n vasen lapsi on D. Neljä solmua; pisin alaspäin kulkeva polku A—B—D sisältää kaksi kaarta.',
    task: 'Mitä kirjoitetaan',
    download: 'Lataa tehtävä, kirjasto ja tarkistin (.zip)',
    instructions: 'Näin ratkaiset ja tarkistat',
    steps: [
      'Käytä JDK 11:tä tai uudempaa. Pura tehtävän ZIP ja avaa sen kansio IDE:ssä. Koolla ja korkeudella on erilliset lataukset.',
      'Muokkaa vain Solution.java. Korvaa TODO-poikkeus omalla rekursiivisella metodilla; apumetodit sallitaan. Lisää traj.jar IDE:n kirjastoksi kooditäydennystä varten.',
      'Tallenna ja suorita alla oleva komento puretusta kansiosta. Korjaa, tallenna ja suorita uudelleen ilman yritysrajaa.',
    ],
    initial:
      'Alkuperäinen pohja ilmoittaa TODO. Toteutuksen jälkeen tarkistin selittää virheet. Jokainen ajo kääntää nykyisen ratkaisun uudelleen. Aloita alusta palauttamalla Solution.java ZIPistä.',
    files:
      'Viisi tiedostoa: Solution.java, Check.java, TreeChecks.java, mukana tullut traj.jar ja yksi englanninkielinen README. Mavenia tai Gradlea ei tarvita.',
    contract: 'Ehdot ja tarvittavat TRA-metodit',
    rules: [
      'node on null tai kelvollisen binäärisen alipuun juuri: ei syklejä tai yhteisiä lapsia. Sillä voi olla vanhempi alipuun ulkopuolella. Kulje vain node-solmusta alaspäin.',
      'Säilytä puu: lapsi- ja vanhempilinkit, alkioviitteet ja balance-kentät. Arvot voivat toistua tai olla null; balance on mielivaltaista tietoa, ei valmis vastaus.',
      'Käytä solmurakennetta, älä arvoja tai nimiä. BTree-puulle anna tree.getRoot(); tyhjän puun juuri on null.',
    ],
    api: [
      ['tree.getRoot()', 'TRA BTree -puun juuri tai null tyhjälle puulle.'],
      [
        'node.getLeftChild() / node.getRightChild()',
        'Tämän BTreeNode-solmun lapset; puuttuva lapsi on null.',
      ],
      ['node == null', 'Tarkista tyhjä alipuu ennen lasten lukemista.'],
    ],
    checks: 'Miten tarkistin toimii',
    checking:
      'Alkuperäinen traj.jar ja --release 11 ovat käytössä. Kymmenen ryhmää: tyhjä/lehti, vasen/oikea ketju, kuva, tasapainoiset ja eripituiset haarat, toistuvat arvot, alipuu jolla on ulkopuolinen vanhempi sekä 40 kiinteän siemenen puuta null-/toistuvilla arvoilla. Riippumaton iteratiivinen läpikäynti laskee odotetun tuloksen. Metodia kutsutaan kahdesti samalla syötteellä; kentät ja linkit säilytetään. Jokaisella ryhmällä on uusi JVM ja viiden sekunnin raja.',
    feedback:
      'Virhe näyttää lasten numerot, kysytyn alipuun juuren, odotetun/saadun arvon ja kutsun numeron. Solmujen muutokset, TODO, käännösvirheet ja pinon ylivuoto selitetään erikseen. Yrityksiä ei rajoiteta.',
    limits:
      'Testit tarkistavat tuloksen ja syötteen säilymisen, mutta eivät todista rekursiivisuutta tai asymptoottista vaativuutta. Perustele ne erikseen; aikaraja ei mittaa tehokkuutta.',
    hints: 'Tarvitsetko vihjeen?',
    after:
      'Yritä itse ennen esimerkin läpikäyntiä. Perustelut voi lisätä Solution.java-kommenttiin. Jokainen tarkistus alkaa alusta; sivulla ei ole nollattavaa tulosta.',
    template: 'Aloituspohja — muokkaa ladatun kansion Solution.java-tiedostoa',
    selfEvaluation: 'Vapaaehtoinen: perustele ratkaisu',
    costNote:
      'Kun n > 0, tavallinen rekursiivinen ratkaisu vie Θ(n) aikaa ja O(h + 1) pinotilaa, kun korkeus h lasketaan kaarina. Null-lapsen perustapauskutsu voi lisätä yhden lyhyen kehyksen. Tyhjä syöte vie Θ(1) aikaa ja tilaa. Palautettu luku vie O(1) tilaa; syötepuuta ei lasketa mukaan.',
  },
}

const tasks = {
  size: {
    en: {
      title: 'Java task 1: count BTree nodes',
      description:
        'Implement size(node): count every node in this subtree, including node itself. Return 0 for null. Count nodes, not leaves, levels or distinct values.',
      example: 'For the drawing: size(A) = 4, size(B) = 2, size(C) = 1, size(null) = 0.',
      hintItems: [
        [
          'What is the base case?',
          'An empty subtree contains no nodes. Check node == null before reading children.',
        ],
        [
          'What do the recursive calls return?',
          'Ask for the size of the left subtree and the size of the right subtree. Each call counts its own part.',
        ],
        [
          'How do I combine them?',
          'Count the current node once and add both subtree counts. Do not share a running total between independent calls.',
        ],
      ],
      walkthroughTitle: 'Walkthrough: combine subtree counts',
      walkthrough: [
        'D and C are leaves: each contributes 1; their missing children contribute 0.',
        'B contains B and D, so its returned count is 2.',
        'A combines its own 1 with the returned counts 2 and 1: size(A) = 4.',
      ],
      selfItems: [
        'Why does each real node contribute exactly one?',
        'Why do we add both child results, and why does an empty subtree contribute zero?',
        'How many nodes and stack frames are needed for a chain versus a balanced tree?',
      ],
    },
    ru: {
      title: 'Задание Java 1: число узлов BTree',
      description:
        'Реализуйте size(node): посчитайте все узлы этого поддерева, включая сам node. Для null верните 0. Считайте узлы, а не листья, уровни или разные значения.',
      example: 'Для рисунка: size(A) = 4, size(B) = 2, size(C) = 1, size(null) = 0.',
      hintItems: [
        [
          'Какой базовый случай?',
          'У пустого поддерева нет узлов. Проверьте node == null до обращения к детям.',
        ],
        [
          'Что возвращают рекурсивные вызовы?',
          'Запросите размер левого и размер правого поддерева. Каждый вызов считает свою часть.',
        ],
        [
          'Как объединить результаты?',
          'Учтите текущий узел один раз и прибавьте оба размера. Не переносите общий счётчик между независимыми вызовами.',
        ],
      ],
      walkthroughTitle: 'Разбор: объединяем размеры поддеревьев',
      walkthrough: [
        'D и C — листья: каждый даёт 1; отсутствующие дети дают 0.',
        'В поддереве B находятся B и D, поэтому оно возвращает 2.',
        'A складывает свою 1 с возвращёнными размерами 2 и 1: size(A) = 4.',
      ],
      selfItems: [
        'Почему каждый настоящий узел учитывается ровно один раз?',
        'Почему складываем оба результата и почему пустое поддерево даёт ноль?',
        'Сколько узлов и кадров стека нужно для цепочки и для сбалансированного дерева?',
      ],
    },
    fi: {
      title: 'Java-tehtävä 1: BTree-solmujen määrä',
      description:
        'Toteuta size(node): laske tämän alipuun kaikki solmut, myös node itse. Palauta null-arvolle 0. Laske solmuja, älä lehtiä, tasoja tai eri arvoja.',
      example: 'Kuvassa: size(A) = 4, size(B) = 2, size(C) = 1, size(null) = 0.',
      hintItems: [
        [
          'Mikä on perustapaus?',
          'Tyhjässä alipuussa ei ole solmuja. Tarkista node == null ennen lasten lukemista.',
        ],
        [
          'Mitä rekursiiviset kutsut palauttavat?',
          'Pyydä vasemman ja oikean alipuun koot. Kukin kutsu laskee oman osansa.',
        ],
        [
          'Miten tulokset yhdistetään?',
          'Laske nykyinen solmu kerran ja lisää molemmat alipuiden koot. Älä jaa kertymää riippumattomien kutsujen välillä.',
        ],
      ],
      walkthroughTitle: 'Esimerkin läpikäynti: alipuiden koot yhteen',
      walkthrough: [
        'D ja C ovat lehtiä: kumpikin antaa 1; puuttuvat lapset antavat 0.',
        'B:n alipuu sisältää B:n ja D:n, joten se palauttaa 2.',
        'A yhdistää oman 1:n palautettuihin lukuihin 2 ja 1: size(A) = 4.',
      ],
      selfItems: [
        'Miksi jokainen oikea solmu lasketaan kerran?',
        'Miksi molemmat lapsitulokset lisätään ja tyhjä alipuu antaa nollan?',
        'Kuinka monta solmua ja pinokehystä ketju ja tasapainoinen puu tarvitsevat?',
      ],
    },
  },
  height: {
    en: {
      title: 'Java task 2: BTree height in edges',
      description:
        'Implement height(node): return the longest path from node down to a leaf, measured in edges. Empty subtree = −1; leaf = 0. Height is not the number of nodes or levels.',
      example:
        'For the drawing: height(A) = 2 along A—B—D; height(B) = 1, height(C) = 0, height(null) = −1. A three-node chain has height 2.',
      hintItems: [
        [
          'Why is null −1?',
          'A leaf has two empty children. Adding one to the larger empty height must give leaf height 0.',
        ],
        [
          'Which child result matters?',
          'Compute both child heights and choose the larger. Height follows the longest branch, not the sum of all branches.',
        ],
        [
          'What does the current node add?',
          'For a nonempty subtree, add one to the larger child height. This also handles a missing child correctly.',
        ],
      ],
      walkthroughTitle: 'Walkthrough: follow the longest branch',
      walkthrough: [
        'D and C are leaves with height 0; their empty children have height −1.',
        'B extends D’s path by one edge: height(B) = 1.',
        'A extends the longer child path (B: 1, C: 0) by one: height(A) = 2. There are 3 levels but 2 edges on the longest path.',
      ],
      selfItems: [
        'Why does choosing −1 for null make a leaf’s height zero?',
        'Why use the maximum instead of adding both child heights?',
        'Why is time Θ(n) even in a balanced tree of height Θ(log n), while stack space follows height?',
      ],
    },
    ru: {
      title: 'Задание Java 2: высота BTree в рёбрах',
      description:
        'Реализуйте height(node): верните длину самого длинного пути от node вниз до листа в рёбрах. Пустое поддерево = −1, лист = 0. Высота — не число узлов или уровней.',
      example:
        'Для рисунка: height(A) = 2 по пути A—B—D; height(B) = 1, height(C) = 0, height(null) = −1. У цепочки из трёх узлов высота 2.',
      hintItems: [
        [
          'Почему null даёт −1?',
          'У листа два пустых ребёнка. Прибавление единицы к большей пустой высоте должно дать высоту листа 0.',
        ],
        [
          'Какой результат ребёнка важен?',
          'Вычислите обе высоты и выберите большую. Высота идёт по самой длинной ветви, а не складывает все ветви.',
        ],
        [
          'Что добавляет текущий узел?',
          'Для непустого поддерева добавьте один к большей высоте детей. Это верно и при отсутствующем ребёнке.',
        ],
      ],
      walkthroughTitle: 'Разбор: выбираем самую длинную ветвь',
      walkthrough: [
        'D и C — листья с высотой 0; у их пустых детей высота −1.',
        'B удлиняет путь к D на одно ребро: height(B) = 1.',
        'A удлиняет больший путь ребёнка (B: 1, C: 0) на один: height(A) = 2. Уровней 3, но рёбер на самом длинном пути 2.',
      ],
      selfItems: [
        'Почему значение −1 для null даёт высоту листа ноль?',
        'Почему нужен максимум, а не сумма высот детей?',
        'Почему время Θ(n) даже у сбалансированного дерева высоты Θ(log n), а память стека зависит от высоты?',
      ],
    },
    fi: {
      title: 'Java-tehtävä 2: BTree-puun korkeus kaarina',
      description:
        'Toteuta height(node): palauta pisimmän node-solmusta alas lehteen kulkevan polun pituus kaarina. Tyhjä alipuu = −1, lehti = 0. Korkeus ei ole solmujen tai tasojen määrä.',
      example:
        'Kuvassa: height(A) = 2 polulla A—B—D; height(B) = 1, height(C) = 0, height(null) = −1. Kolmen solmun ketjun korkeus on 2.',
      hintItems: [
        [
          'Miksi null antaa −1?',
          'Lehdellä on kaksi tyhjää lasta. Yhden lisäämisen suurempaan tyhjään korkeuteen tulee antaa lehden korkeudeksi 0.',
        ],
        [
          'Kumpi lapsitulos merkitsee?',
          'Laske molemmat lapsikorkeudet ja valitse suurempi. Korkeus seuraa pisintä haaraa, ei laske haaroja yhteen.',
        ],
        [
          'Mitä nykyinen solmu lisää?',
          'Lisää epätyhjälle alipuulle yksi suurempaan lapsikorkeuteen. Tämä toimii myös puuttuvan lapsen tapauksessa.',
        ],
      ],
      walkthroughTitle: 'Esimerkin läpikäynti: pisin haara',
      walkthrough: [
        'D ja C ovat lehtiä, joiden korkeus on 0; niiden tyhjien lasten korkeus on −1.',
        'B pidentää polkua D:hen yhdellä kaarella: height(B) = 1.',
        'A pidentää pidempää lapsipolkua (B: 1, C: 0) yhdellä: height(A) = 2. Tasoja on 3, mutta pisimmällä polulla kaaria 2.',
      ],
      selfItems: [
        'Miksi null-arvon −1 antaa lehdelle korkeuden nolla?',
        'Miksi käytetään maksimia eikä lapsikorkeuksien summaa?',
        'Miksi aika on Θ(n) myös tasapainoisessa puussa, jonka korkeus on Θ(log n), mutta pinotila seuraa korkeutta?',
      ],
    },
  },
}

export const treeCodingExerciseTranslations = Object.fromEntries(
  Object.entries(tasks).map(([method, languages]) => [
    method,
    Object.fromEntries(
      Object.entries(languages).map(([language, labels]) => [
        language,
        {
          ...common[language],
          ...labels,
          signature: `public static int ${method}(BTreeNode<?> node)`,
        },
      ]),
    ),
  ]),
)
