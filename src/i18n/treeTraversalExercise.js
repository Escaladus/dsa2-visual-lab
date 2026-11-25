import { treeCodingExerciseTranslations } from './treeCodingExercise.js'

const base = treeCodingExerciseTranslations.size
const common = {
  en: {
    ...base.en,
    intro:
      'Write one recursive traversal using TRA BTreeNode. Return the visited nodes in a list. Each order has its own short starter and download; edit only Solution.java.',
    steps: [
      'Use JDK 11 or newer. Extract the chosen PRE, IN or POST ZIP and open its folder in your IDE. Keep each task in its own folder.',
      ...base.en.steps.slice(1),
    ],
    rules: [
      ...base.en.rules.slice(0, 2),
      'Return actual input BTreeNode objects, once each, in the specified order. Return [] for null. Do not return element values, new copies, null children or nodes outside the supplied subtree.',
      'Each call returns only its own traversal; do not keep accumulating earlier results. Helpers are allowed. For a whole BTree pass tree.getRoot().',
    ],
    api: [
      ...base.en.api,
      [
        'result.add(node)',
        'Record this actual node at the correct position relative to its child calls.',
      ],
    ],
    checking:
      'Ten groups use the original traj.jar and --release 11: empty, leaf, left/right chains, the drawing, balanced/unequal branches, repeated values, an inner subtree and 40 fixed-seed trees with null/repeated values. An independent iterative phase walk computes expected node IDs. Identity, membership, uniqueness, exact order and unchanged input are checked. Each method is called twice; each group has a fresh JVM and a five-second limit.',
    feedback:
      'Feedback shows child IDs, the requested root, expected and returned node IDs and the call number. It distinguishes missing/repeated/foreign nodes, null results, outside-subtree nodes and the first incorrect position. Input mutation, compilation errors and stack overflow are separate. Retries are unlimited.',
    costNote:
      'For n > 0, appending each node once to one ArrayList takes Θ(n) total time with amortised O(1) appends, O(h + 1) recursion stack and O(n) result space. Empty input has constant cost. Copying/merging a new list at every recursive call may cost more; analyse those copies separately. Tests do not prove recursion or these bounds.',
  },
  ru: {
    ...base.ru,
    intro:
      'Напишите один рекурсивный обход на TRA BTreeNode и верните посещённые узлы в списке. У каждого порядка свой короткий шаблон и ZIP; меняйте только Solution.java.',
    steps: [
      'Используйте JDK 11 или новее. Распакуйте выбранный ZIP PRE, IN или POST и откройте его папку в IDE. Храните задания в отдельных папках.',
      ...base.ru.steps.slice(1),
    ],
    rules: [
      ...base.ru.rules.slice(0, 2),
      'Верните настоящие входные BTreeNode ровно по одному в заданном порядке. Для null верните []. Не возвращайте значения элементов, копии, null-детей или узлы вне выбранного поддерева.',
      'Каждый вызов возвращает только свой обход; не накапливайте результаты прежних запусков. Можно добавлять вспомогательные методы. Для целого BTree передайте tree.getRoot().',
    ],
    api: [
      ...base.ru.api,
      ['result.add(node)', 'Записать именно этот узел в нужном месте относительно вызовов детей.'],
    ],
    checking:
      'Десять групп с исходным traj.jar и --release 11: пустота, лист, левые/правые цепочки, рисунок, сбалансированные/неравные ветви, повторы, внутреннее поддерево и 40 деревьев с фиксированным seed и null/повторами. Независимый итеративный обход по фазам вычисляет ожидаемые номера узлов. Проверяются идентичность, принадлежность, уникальность, точный порядок и сохранность входа. Метод вызывается дважды; у каждой группы новая JVM и лимит пять секунд.',
    feedback:
      'Вывод показывает номера детей, выбранный корень, ожидаемые/полученные номера узлов и номер вызова. Различает пропуски, повторы, чужие узлы, результат null, выход за поддерево и первую неверную позицию. Изменение входа, ошибки компиляции и переполнение стека объясняются отдельно. Попытки не ограничены.',
    costNote:
      'При n > 0 добавление каждого узла один раз в один ArrayList требует Θ(n) суммарного времени при амортизированном O(1) для add, O(h + 1) стека и O(n) памяти результата. Пустой вход имеет постоянную стоимость. Копирование/слияние нового списка в каждом рекурсивном вызове может стоить дороже; учитывайте копии отдельно. Тесты не доказывают рекурсивность или эти оценки.',
  },
  fi: {
    ...base.fi,
    intro:
      'Kirjoita yksi rekursiivinen läpikäynti TRA BTreeNode -luokalla ja palauta käydyt solmut listassa. Jokaisella järjestyksellä on oma lyhyt pohja ja ZIP; muokkaa vain Solution.java.',
    steps: [
      'Käytä JDK 11:tä tai uudempaa. Pura valitsemasi PRE-, IN- tai POST-ZIP ja avaa sen kansio IDE:ssä. Säilytä tehtävät erillisissä kansioissa.',
      ...base.fi.steps.slice(1),
    ],
    rules: [
      ...base.fi.rules.slice(0, 2),
      'Palauta oikeat syötteen BTreeNode-oliot kerran kukin annetussa järjestyksessä. Palauta null-arvolle []. Älä palauta alkioarvoja, kopioita, null-lapsia tai solmuja kysytyn alipuun ulkopuolelta.',
      'Jokainen kutsu palauttaa vain oman läpikäyntinsä; älä kerää aiempien ajojen tuloksia mukaan. Apumetodit sallitaan. Koko BTree-puulle anna tree.getRoot().',
    ],
    api: [
      ...base.fi.api,
      ['result.add(node)', 'Tallenna tämä oikea solmu oikeassa kohdassa lapsikutsuihin nähden.'],
    ],
    checking:
      'Kymmenen ryhmää alkuperäisellä traj.jarilla ja --release 11 -asetuksella: tyhjä, lehti, vasen/oikea ketju, kuva, tasapainoiset/eripituiset haarat, toistot, sisäinen alipuu ja 40 kiinteän siemenen puuta null-/toistuvilla arvoilla. Riippumaton iteratiivinen vaiheittainen läpikäynti laskee odotetut solmunumerot. Tarkistetaan identiteetti, jäsenyys, ainutkertaisuus, täsmällinen järjestys ja syötteen säilyminen. Metodia kutsutaan kahdesti; jokaisella ryhmällä on uusi JVM ja viiden sekunnin raja.',
    feedback:
      'Palaute näyttää lasten numerot, kysytyn juuren, odotetut/saadut solmunumerot ja kutsun numeron. Se erottaa puuttuvat/toistuvat/vieraat solmut, null-tuloksen, alipuun ulkopuoliset solmut ja ensimmäisen väärän kohdan. Syötteen muutokset, käännösvirheet ja pinon ylivuoto selitetään erikseen. Yrityksiä ei rajoiteta.',
    costNote:
      'Kun n > 0, jokaisen solmun lisääminen kerran yhteen ArrayList-listaan vie yhteensä Θ(n) aikaa amortisoidulla O(1) add-operaatiolla, O(h + 1) pinotilaa ja O(n) tulostilaa. Tyhjän syötteen kustannus on vakio. Uuden listan kopiointi/yhdistäminen jokaisessa rekursiivisessa kutsussa voi maksaa enemmän; analysoi kopiot erikseen. Testit eivät todista rekursiivisuutta tai näitä rajoja.',
  },
}

const tasks = {
  pre: {
    en: {
      title: 'Java task 3: PRE — node, left, right',
      description:
        'Return the subtree nodes in PRE order: record the current node first, then traverse the whole left subtree, then the whole right subtree. The list contains nodes, not their element values.',
      example:
        'For the drawing: pre(A) = [A, B, D, C]; pre(B) = [B, D]; pre(C) = [C]; pre(null) = []. Letters identify pictured nodes.',
      hintItems: [
        [
          'What happens at null?',
          'There is no node to append. Return from the helper without adding anything.',
        ],
        [
          'Where is the list created?',
          'Create one result list in pre and pass it to a recursive helper. Each helper call appends to that same result.',
        ],
        [
          'When do I append?',
          'Append the current node before both child calls. Finish the left subtree before starting the right.',
        ],
      ],
      walkthroughTitle: 'Walkthrough: append before descending',
      walkthrough: [
        'At A, append A, then call the helper for B: [A].',
        'At B, append B; at its left child D, append D. D finishes and control returns to B: [A, B, D].',
        'B continues with its missing right child, then returns to A. A now visits C and appends C: [A, B, D, C].',
      ],
      selfItems: [
        'Why does each subtree root appear before all its descendants?',
        'Where does A continue after the call for B finishes?',
        'Why is time linear with one shared output list, and how do stack and result storage differ?',
      ],
    },
    ru: {
      title: 'Задание Java 3: PRE — узел, слева, справа',
      description:
        'Верните узлы поддерева в порядке PRE: сначала запишите текущий узел, затем обойдите всё левое поддерево, затем всё правое. В списке нужны узлы, а не значения элементов.',
      example:
        'Для рисунка: pre(A) = [A, B, D, C]; pre(B) = [B, D]; pre(C) = [C]; pre(null) = []. Буквы обозначают узлы рисунка.',
      hintItems: [
        [
          'Что происходит при null?',
          'Узла для добавления нет. Вернитесь из вспомогательного метода, ничего не добавляя.',
        ],
        [
          'Где создать список?',
          'Создайте один список результата в pre и передайте его рекурсивному помощнику. Все вызовы добавляют в этот же список.',
        ],
        [
          'Когда добавлять узел?',
          'До обоих вызовов детей. Полностью завершите левое поддерево перед переходом к правому.',
        ],
      ],
      walkthroughTitle: 'Разбор: добавляем до спуска',
      walkthrough: [
        'В A добавляем A, затем вызываем помощника для B: [A].',
        'В B добавляем B; у его левого ребёнка D добавляем D. D заканчивает, управление возвращается B: [A, B, D].',
        'B продолжает с отсутствующим правым ребёнком, затем возвращается A. Теперь A посещает C и добавляет C: [A, B, D, C].',
      ],
      selfItems: [
        'Почему корень каждого поддерева записан раньше всех его потомков?',
        'Где A продолжает выполнение после завершения вызова для B?',
        'Почему время линейно при одном общем списке и чем отличаются стек и память результата?',
      ],
    },
    fi: {
      title: 'Java-tehtävä 3: PRE — solmu, vasen, oikea',
      description:
        'Palauta alipuun solmut PRE-järjestyksessä: tallenna nykyinen solmu, käy koko vasen alipuu ja sitten koko oikea alipuu. Listaan tulevat solmut, eivät niiden alkioarvot.',
      example:
        'Kuvassa: pre(A) = [A, B, D, C]; pre(B) = [B, D]; pre(C) = [C]; pre(null) = []. Kirjaimet tarkoittavat kuvan solmuja.',
      hintItems: [
        ['Mitä null tekee?', 'Lisättävää solmua ei ole. Palaa apumetodista lisäämättä mitään.'],
        [
          'Missä lista luodaan?',
          'Luo yksi tuloslista pre-metodissa ja välitä se rekursiiviselle apumetodille. Kaikki kutsut lisäävät samaan listaan.',
        ],
        [
          'Milloin solmu lisätään?',
          'Ennen molempia lapsikutsuja. Viimeistele koko vasen alipuu ennen oikeaa.',
        ],
      ],
      walkthroughTitle: 'Esimerkin läpikäynti: lisää ennen laskeutumista',
      walkthrough: [
        'Lisää A ja kutsu apumetodia B:lle: [A].',
        'Lisää B; lisää sen vasen lapsi D. D valmistuu ja ohjaus palaa B:hen: [A, B, D].',
        'B jatkaa puuttuvalla oikealla lapsellaan ja palaa A:han. A käy nyt C:ssä ja lisää C:n: [A, B, D, C].',
      ],
      selfItems: [
        'Miksi kunkin alipuun juuri tulee ennen kaikkia jälkeläisiään?',
        'Mistä A jatkaa B:n kutsun päätyttyä?',
        'Miksi aika on lineaarinen yhdellä yhteisellä listalla ja miten pino ja tulosmuisti eroavat?',
      ],
    },
  },
  in: {
    en: {
      title: 'Java task 4: IN — left, node, right',
      description:
        'Return the subtree nodes in IN order: traverse the whole left subtree, record the current node, then traverse the whole right subtree. IN is not a sorting algorithm for an arbitrary binary tree.',
      example:
        'For the drawing: in(A) = [D, B, A, C]; in(B) = [D, B]; in(C) = [C]; in(null) = []. This tree is not assumed to be a BST.',
      hintItems: [
        ['What happens at null?', 'Return from the helper without appending a missing node.'],
        [
          'How do I collect all nodes?',
          'Create one list in in and pass it to a recursive helper; every real node is appended once.',
        ],
        [
          'Where is the append line?',
          'Between the left and right recursive calls. A child finishes its entire subtree before the caller continues.',
        ],
      ],
      walkthroughTitle: 'Walkthrough: append after the left subtree',
      walkthrough: [
        'From A descend to B and then D before appending either A or B. D has no left child, so append D: [D].',
        'D finishes; B continues by appending B and processing its missing right child: [D, B].',
        'B returns to A. Append A, then visit and append C: [D, B, A, C]. The append position gives IN order, without sorting values.',
      ],
      selfItems: [
        'Why must the whole left subtree finish before appending its parent?',
        'When does IN give sorted keys, and why is that not promised for this arbitrary tree?',
        'Why should child calls append to one list rather than repeatedly copy sublists?',
      ],
    },
    ru: {
      title: 'Задание Java 4: IN — слева, узел, справа',
      description:
        'Верните узлы в порядке IN: обойдите всё левое поддерево, запишите текущий узел, затем обойдите всё правое. Для произвольного бинарного дерева IN не является сортировкой.',
      example:
        'Для рисунка: in(A) = [D, B, A, C]; in(B) = [D, B]; in(C) = [C]; in(null) = []. Не предполагается, что это BST.',
      hintItems: [
        ['Что происходит при null?', 'Вернитесь из помощника, не добавляя отсутствующий узел.'],
        [
          'Как собрать все узлы?',
          'Создайте один список в in и передайте его рекурсивному помощнику; каждый настоящий узел добавляется один раз.',
        ],
        [
          'Где поставить добавление?',
          'Между рекурсивными вызовами слева и справа. Ребёнок завершает всё своё поддерево, прежде чем родитель продолжит.',
        ],
      ],
      walkthroughTitle: 'Разбор: добавляем после левого поддерева',
      walkthrough: [
        'Из A спускаемся к B, затем к D, ещё не добавляя A или B. У D нет левого ребёнка, поэтому добавляем D: [D].',
        'D заканчивает; B продолжает добавлением B и обработкой отсутствующего правого ребёнка: [D, B].',
        'B возвращается A. Добавляем A, затем посещаем и добавляем C: [D, B, A, C]. Порядок создаёт место добавления, без сортировки значений.',
      ],
      selfItems: [
        'Почему всё левое поддерево завершается до добавления родителя?',
        'Когда IN даёт отсортированные ключи и почему этого нельзя обещать для произвольного дерева?',
        'Почему лучше добавлять в один список, чем многократно копировать списки поддеревьев?',
      ],
    },
    fi: {
      title: 'Java-tehtävä 4: IN — vasen, solmu, oikea',
      description:
        'Palauta solmut IN-järjestyksessä: käy koko vasen alipuu, tallenna nykyinen solmu ja käy koko oikea alipuu. IN ei ole mielivaltaisen binääripuun lajittelualgoritmi.',
      example:
        'Kuvassa: in(A) = [D, B, A, C]; in(B) = [D, B]; in(C) = [C]; in(null) = []. Puuta ei oleteta hakupuuksi (BST).',
      hintItems: [
        ['Mitä null tekee?', 'Palaa apumetodista lisäämättä puuttuvaa solmua.'],
        [
          'Miten kaikki solmut kerätään?',
          'Luo yksi lista in-metodissa ja välitä se rekursiiviselle apumetodille; jokainen oikea solmu lisätään kerran.',
        ],
        [
          'Missä lisäys tehdään?',
          'Vasemman ja oikean rekursiivisen kutsun välissä. Lapsi viimeistelee koko alipuunsa ennen vanhemman jatkamista.',
        ],
      ],
      walkthroughTitle: 'Esimerkin läpikäynti: lisää vasemman alipuun jälkeen',
      walkthrough: [
        'Laskeudu A:sta B:hen ja D:hen lisäämättä vielä A:ta tai B:tä. D:llä ei ole vasenta lasta, joten lisää D: [D].',
        'D valmistuu; B jatkaa lisäämällä B:n ja käsittelemällä puuttuvan oikean lapsen: [D, B].',
        'B palaa A:han. Lisää A ja käy sitten C:ssä ja lisää C: [D, B, A, C]. Lisäyskohta tuottaa IN-järjestyksen ilman arvojen lajittelua.',
      ],
      selfItems: [
        'Miksi koko vasen alipuu valmistuu ennen vanhemman lisäämistä?',
        'Milloin IN tuottaa lajitellut avaimet ja miksi sitä ei luvata mielivaltaiselle puulle?',
        'Miksi lisätään yhteen listaan eikä kopioida alipuiden listoja toistuvasti?',
      ],
    },
  },
  post: {
    en: {
      title: 'Java task 5: POST — left, right, node',
      description:
        'Return the subtree nodes in POST order: finish the whole left subtree, then the whole right subtree, then record the current node. Returning control to a parent does not append that parent automatically.',
      example:
        'For the drawing: post(A) = [D, B, C, A]; post(B) = [D, B]; post(C) = [C]; post(null) = []. Letters identify pictured nodes.',
      hintItems: [
        [
          'What happens at null?',
          'The helper returns without appending anything. A real leaf is still appended once.',
        ],
        [
          'How do calls share the result?',
          'Pass one list from post to a helper. It contains the output, while each recursive frame keeps its own node.',
        ],
        [
          'When do I append the parent?',
          'Only after both child calls return. Do not confuse a child returning with processing the parent.',
        ],
      ],
      walkthroughTitle: 'Walkthrough: append after both child calls',
      walkthrough: [
        'A waits while B visits D. D has no children; append D after both empty-child calls: [D].',
        'B continues with its missing right child, then appends B: [D, B]. A next visits C; append C: [D, B, C].',
        'Both child calls of A have finished. Append A last: [D, B, C, A]. Returning from each child resumes the waiting parent at its saved place.',
      ],
      selfItems: [
        'Why is every descendant recorded before its subtree root?',
        'What is the difference between returning control and appending a node?',
        'Which space belongs to the active call stack, and which belongs to the result list?',
      ],
    },
    ru: {
      title: 'Задание Java 5: POST — слева, справа, узел',
      description:
        'Верните узлы в порядке POST: завершите всё левое поддерево, затем всё правое, затем запишите текущий узел. Возврат управления родителю сам по себе не добавляет его в результат.',
      example:
        'Для рисунка: post(A) = [D, B, C, A]; post(B) = [D, B]; post(C) = [C]; post(null) = []. Буквы обозначают узлы рисунка.',
      hintItems: [
        [
          'Что происходит при null?',
          'Помощник возвращается без добавления. Настоящий лист всё равно добавляется один раз.',
        ],
        [
          'Как вызовы делят результат?',
          'Передайте один список из post помощнику. В нём хранится результат, а у каждого кадра свой node.',
        ],
        [
          'Когда добавлять родителя?',
          'Только после возврата обоих вызовов детей. Возврат ребёнка и обработка родителя — отдельные действия.',
        ],
      ],
      walkthroughTitle: 'Разбор: добавляем после обоих вызовов',
      walkthrough: [
        'A ждёт, пока B посещает D. У D нет детей; добавляем D после обоих пустых вызовов: [D].',
        'B продолжает с отсутствующим правым ребёнком, затем добавляет B: [D, B]. A далее посещает C; добавляем C: [D, B, C].',
        'Оба вызова детей A завершены. Добавляем A последним: [D, B, C, A]. Возврат каждого ребёнка продолжает ожидающего родителя с сохранённого места.',
      ],
      selfItems: [
        'Почему каждый потомок записан до корня своего поддерева?',
        'Чем отличается возврат управления от добавления узла в список?',
        'Какая память относится к активному стеку, а какая — к списку результата?',
      ],
    },
    fi: {
      title: 'Java-tehtävä 5: POST — vasen, oikea, solmu',
      description:
        'Palauta solmut POST-järjestyksessä: viimeistele koko vasen alipuu, sitten koko oikea alipuu ja tallenna vasta sitten nykyinen solmu. Ohjauksen paluu vanhemmalle ei lisää sitä automaattisesti tulokseen.',
      example:
        'Kuvassa: post(A) = [D, B, C, A]; post(B) = [D, B]; post(C) = [C]; post(null) = []. Kirjaimet tarkoittavat kuvan solmuja.',
      hintItems: [
        [
          'Mitä null tekee?',
          'Apumetodi palaa lisäämättä mitään. Oikea lehti lisätään silti kerran.',
        ],
        [
          'Miten kutsut jakavat tuloksen?',
          'Välitä yksi lista post-metodista apumetodille. Lista säilyttää tuloksen, mutta kullakin kehyksellä on oma node.',
        ],
        [
          'Milloin vanhempi lisätään?',
          'Vasta molempien lapsikutsujen palattua. Lapsen paluu ja vanhemman käsittely ovat eri tapahtumia.',
        ],
      ],
      walkthroughTitle: 'Esimerkin läpikäynti: lisää molempien kutsujen jälkeen',
      walkthrough: [
        'A odottaa, kun B käy D:ssä. D:llä ei ole lapsia; lisää D molempien tyhjien kutsujen jälkeen: [D].',
        'B jatkaa puuttuvalla oikealla lapsella ja lisää sitten B:n: [D, B]. A käy seuraavaksi C:ssä; lisää C: [D, B, C].',
        'A:n molemmat lapsikutsut ovat valmiit. Lisää A viimeisenä: [D, B, C, A]. Lapsen paluu jatkaa odottavaa vanhempaa tallennetusta kohdasta.',
      ],
      selfItems: [
        'Miksi jokainen jälkeläinen tallennetaan ennen alipuun juurta?',
        'Miten ohjauksen palautuminen eroaa solmun lisäämisestä listaan?',
        'Mikä muisti kuuluu aktiiviselle pinolle ja mikä tuloslistalle?',
      ],
    },
  },
}

export const treeTraversalExerciseTranslations = Object.fromEntries(
  Object.entries(tasks).map(([method, languages]) => [
    method,
    Object.fromEntries(
      Object.entries(languages).map(([language, labels]) => [
        language,
        {
          ...common[language],
          ...labels,
          signature: `public static List<BTreeNode<?>> ${method}(BTreeNode<?> node)`,
        },
      ]),
    ),
  ]),
)
