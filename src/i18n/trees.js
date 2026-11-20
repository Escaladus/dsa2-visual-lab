export const treeTranslations = {
  ru: {
    intro:
      'Рисунок и TraTreeExample.java используют одно дерево BTree<String>. Выберите PRE, IN или POST и следите за моментом обработки каждого узла.',
    example: 'Дерево',
    examples: {
      balanced: 'A–G: разветвлённое',
      single: 'Один узел',
      chain: 'Цепочка A–D',
      empty: 'Пустое дерево',
    },
    size: 'Узлов n',
    height: 'Высота h, рёбра',
    levels: 'Уровней',
    depth: 'Глубина узла',
    frames: 'Кадров с узлами',
    path: 'Путь активных вызовов',
    empty:
      'getRoot() возвращает null. Базовый случай сразу завершает обход; в результат ничего не добавляется.',
    frameNote:
      'Глубина корня — 0. Путь показывает незавершённые вызовы с реальными узлами. Короткие вызовы traverse(null) не выделены в отдельные шаги; в Java они временно добавляют ещё один кадр.',
    java: 'Java TRA: строка обработки узла',
    javaNote:
      'Метод взят из скачиваемого TraTreeExample.java. Он заполняет все три списка за один обход; выбранный режим показывает только соответствующие моменты записи.',
    explanation: 'Высота, стек и виды деревьев',
    creation: 'Создание дерева A–G',
    sizeHeight: 'Число узлов и высота',
    general: 'Tree: первый ребёнок и следующий сосед',
    points: [
      [
        'Что хранит BTree',
        'BTree<E> хранит корень, BTreeNode<E> — значение и связи с левым и правым ребёнком. getRoot(), getElement(), getLeftChild() и getRightChild() читают их. Отсутствующий корень или ребёнок — null.',
      ],
      [
        'Высота и глубина',
        'Глубина — число рёбер от корня до выбранного узла. Высота дерева — максимальная глубина: лист имеет h = 0, пустое дерево h = −1. Число уровней равно h + 1. В цепочке из n узлов h = n − 1.',
      ],
      [
        'Время и память',
        'Обход, подсчёт узлов и вычисление высоты по отдельности занимают Θ(n) времени. Для непустого дерева путь содержит не более h + 1 кадров с узлами, а с кратким null-вызовом пик достигает h + 2. Стек требует O(h + 1); пустой обход — O(1). Три списка результата добавляют O(n) памяти.',
      ],
      [
        'Бинарное дерево, BST и куча',
        'Бинарное дерево допускает не более двух детей. BST дополнительно упорядочивает ключи слева и справа: только тогда IN даёт сортировку. Дерево A–G не является BST. Куча требует полной формы и приоритета родителя относительно детей; одной бинарной формы недостаточно.',
      ],
      [
        'Произвольное дерево TRA',
        'В Tree<E>/TreeNode<E> getLeftChild() означает первого ребёнка, getRightSibling() — следующего соседа того же уровня детей. Пример R имеет детей X, Y и Z. Правого ребёнка здесь нет; правило IN бинарного дерева не переносится автоматически.',
      ],
      [
        'Похожее имя — другая структура',
        'TRA BTree — бинарное дерево в памяти. B-tree и B+ tree из раздела внешней памяти — многопутевые поисковые деревья и изучаются отдельно.',
      ],
    ],
    api: {
      BTree: 'Корень бинарного дерева: getRoot(), setRoot(), isEmpty().',
      BTreeNode: 'Значение и связи: getElement(), getLeftChild(), getRightChild(), getParent().',
      Tree: 'Корень произвольного дерева.',
      TreeNode: 'Первый ребёнок и следующий сосед: getLeftChild(), getRightSibling().',
    },
  },
  en: {
    intro:
      'The drawing and TraTreeExample.java use the same BTree<String>. Choose PRE, IN or POST and follow the point at which each node is processed.',
    example: 'Tree',
    examples: {
      balanced: 'A–G: branching',
      single: 'One node',
      chain: 'A–D chain',
      empty: 'Empty tree',
    },
    size: 'Nodes n',
    height: 'Height h, edges',
    levels: 'Levels',
    depth: 'Node depth',
    frames: 'Frames with nodes',
    path: 'Active call path',
    empty:
      'getRoot() returns null. The base case immediately ends traversal; nothing is added to the results.',
    frameNote:
      'Root depth is 0. The path shows unfinished calls with actual nodes. Short traverse(null) calls are not separate animation steps; in Java they temporarily add one more frame.',
    java: 'Java TRA: node-processing line',
    javaNote:
      'This method comes from the downloadable TraTreeExample.java. It fills all three lists in one traversal; the selected view shows only its corresponding append events.',
    explanation: 'Height, stack and types of trees',
    creation: 'Create the A–G tree',
    sizeHeight: 'Node count and height',
    general: 'Tree: first child and next sibling',
    points: [
      [
        'What BTree stores',
        'BTree<E> stores the root; BTreeNode<E> stores a value and left/right child links. Read them with getRoot(), getElement(), getLeftChild() and getRightChild(). A missing root or child is null.',
      ],
      [
        'Height and depth',
        'Depth counts edges from the root to the selected node. Tree height is the maximum depth: a leaf has h = 0 and an empty tree h = −1. Level count is h + 1. A chain of n nodes has h = n − 1.',
      ],
      [
        'Time and space',
        'Traversal, node counting and height calculation each take Θ(n) time. A nonempty tree has at most h + 1 active node frames; a short null call raises the peak to h + 2. Stack space is O(h + 1); an empty traversal is O(1). The three result lists add O(n) output space.',
      ],
      [
        'Binary tree, BST and heap',
        'A binary tree has at most two children per node. A BST also orders keys across left/right subtrees; only then does IN produce sorted output. The A–G example is not a BST. A heap needs a complete shape and parent priority relative to children; binary shape alone is insufficient.',
      ],
      [
        'General TRA tree',
        'In Tree<E>/TreeNode<E>, getLeftChild() means first child and getRightSibling() means next sibling in the child list. Example R has children X, Y and Z. That link is not a right child; binary IN has no automatic general-tree counterpart.',
      ],
      [
        'Similar name, different structure',
        'TRA BTree is an in-memory binary tree. The external-memory B-tree and B+ tree are multiway search trees studied separately.',
      ],
    ],
    api: {
      BTree: 'Binary root: getRoot(), setRoot(), isEmpty().',
      BTreeNode: 'Value and links: getElement(), getLeftChild(), getRightChild(), getParent().',
      Tree: 'Root of a general tree.',
      TreeNode: 'First child and next sibling: getLeftChild(), getRightSibling().',
    },
  },
  fi: {
    intro:
      'Kuva ja TraTreeExample.java käyttävät samaa BTree<String>-puuta. Valitse PRE, IN tai POST ja seuraa kunkin solmun käsittelyhetkeä.',
    example: 'Puu',
    examples: {
      balanced: 'A–G: haarautuva',
      single: 'Yksi solmu',
      chain: 'A–D-ketju',
      empty: 'Tyhjä puu',
    },
    size: 'Solmuja n',
    height: 'Korkeus h, kaarina',
    levels: 'Tasoja',
    depth: 'Solmun syvyys',
    frames: 'Solmullisia kehyksiä',
    path: 'Aktiivinen kutsupolku',
    empty:
      'getRoot() palauttaa nullin. Perustapaus päättää läpikäynnin heti; tuloksiin ei lisätä mitään.',
    frameNote:
      'Juuren syvyys on 0. Polku näyttää keskeneräiset kutsut, joilla on todellinen solmu. Lyhyet traverse(null)-kutsut eivät ole erillisiä animaatiovaiheita; Javassa ne lisäävät hetkeksi yhden kehyksen.',
    java: 'Java TRA: solmun käsittelyrivi',
    javaNote:
      'Metodi on ladattavasta TraTreeExample.java-tiedostosta. Se täyttää kaikki kolme listaa yhdellä läpikäynnillä; valittu näkymä näyttää vain vastaavat lisäyshetket.',
    explanation: 'Korkeus, pino ja puutyypit',
    creation: 'Luo A–G-puu',
    sizeHeight: 'Solmujen määrä ja korkeus',
    general: 'Tree: ensimmäinen lapsi ja seuraava sisarus',
    points: [
      [
        'Mitä BTree tallentaa',
        'BTree<E> tallentaa juuren; BTreeNode<E> arvon ja vasemman/oikean lapsen viitteet. Lue ne metodeilla getRoot(), getElement(), getLeftChild() ja getRightChild(). Puuttuva juuri tai lapsi on null.',
      ],
      [
        'Korkeus ja syvyys',
        'Syvyys laskee kaaret juuresta valittuun solmuun. Puun korkeus on suurin syvyys: lehden h = 0 ja tyhjän puun h = −1. Tasoja on h + 1. n solmun ketjussa h = n − 1.',
      ],
      [
        'Aika ja tila',
        'Läpikäynti, solmujen laskeminen ja korkeuden laskeminen vievät kukin Θ(n) aikaa. Epätyhjässä puussa on enintään h + 1 aktiivista solmullista kehystä; lyhyt null-kutsu nostaa huipun arvoon h + 2. Pinotila on O(h + 1); tyhjä läpikäynti O(1). Kolme tuloslistaa lisää O(n) tulostilaa.',
      ],
      [
        'Binääripuu, hakupuu ja keko',
        'Binääripuussa on enintään kaksi lasta solmua kohti. BST järjestää lisäksi avaimet vasemman ja oikean alipuun välillä; vasta silloin IN tuottaa lajitellun tuloksen. A–G-esimerkki ei ole BST. Keko tarvitsee täydellisen muodon ja vanhemman prioriteettiehdon; pelkkä binäärinen muoto ei riitä.',
      ],
      [
        'TRA:n yleinen puu',
        'Tree<E>/TreeNode<E>: getLeftChild() tarkoittaa ensimmäistä lasta ja getRightSibling() seuraavaa sisarusta lapsilistassa. Esimerkin R:n lapset ovat X, Y ja Z. Viite ei tarkoita oikeaa lasta; binääristä IN-sääntöä ei sovelleta automaattisesti yleiseen puuhun.',
      ],
      [
        'Samantapainen nimi, eri rakenne',
        'TRA BTree on muistissa oleva binääripuu. Ulkoisen muistin B-tree ja B+ tree ovat monihaaraisia hakupuita ja käsitellään erikseen.',
      ],
    ],
    api: {
      BTree: 'Binääripuun juuri: getRoot(), setRoot(), isEmpty().',
      BTreeNode: 'Arvo ja viitteet: getElement(), getLeftChild(), getRightChild(), getParent().',
      Tree: 'Yleisen puun juuri.',
      TreeNode: 'Ensimmäinen lapsi ja seuraava sisarus: getLeftChild(), getRightSibling().',
    },
  },
}
