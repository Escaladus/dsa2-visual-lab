# DSA2 Visual Lab

Интерактивный учебный сайт на React/Vite для повторения DSA2. Основной акцент — визуальное понимание графов, DFS/BFS, PRE/POST порядка, деревьев и сложности алгоритмов.

## Языки

Сайт полностью доступен на финском (**Suomi**), русском (**Русский**) и английском (**English**). Переключатель находится в верхней части страницы на компьютере и телефоне. Выбор сохраняется в браузере; при первом посещении используется русский язык. Смена языка сохраняет открытую тему и текущий шаг визуализации.

Переводы интерфейса, всех тем и пояснений к алгоритмам находятся в `src/i18n/fi.js`, `src/i18n/ru.js` и `src/i18n/en.js`. Идентификаторы тем и логика алгоритмов общие для всех языков.

## Сверка с конспектом и Java-примеры

Материал сопоставлен с предоставленным `dsaII_handout.pdf` (UEF, осень 2025, 89 страниц). [Карта покрытия и уточнения](docs/HANDOUT_ALIGNMENT.md) показывают соответствие разделов и границы обзорного материала.

Теперь в проекте 21 тема и 26 самостоятельных `.java`-примеров: Set/Map, equals/hashCode, списки и очереди, обходы, сортировка слиянием, Dijkstra/Floyd, Prim/Kruskal, точки сочленения, matching, поток, динамическое программирование, строки и файлы. На страницах есть код, ожидаемый вывод, стоимость, условия и скачивание файла. Запуск скачанного примера:

```bash
java SetOperationsExample.java
```

Исходники находятся в `src/examples`, каталог — в `src/data/javaExamples.js`, ссылки на конспект — в `src/data/handout.js`. Переводы дополнений — в `src/i18n/handout.ru.js`, `handout.fi.js` и `handout.en.js`. PDF конспекта в сайт не включён.

## Что уже есть

- карта тем DSA2;
- интерактивная таблица Big O с подстановкой `n`;
- два указателя для объединения отсортированных списков;
- Set/Map и `equals/hashCode`;
- визуальный preorder/inorder/postorder дерева;
- Heap / PriorityQueue;
- пошаговые и автоматические визуализации bubble, insertion, merge и quick sort с буфером слияния и выделением опорного элемента;
- граф: adjacency list;
- интерактивный DFS с PRE/POST, стеком, visited и пошаговым объяснением;
- интерактивный BFS с очередью, visited и distance;
- компоненты связности, циклы, кратчайшие пути, topological order;
- Java: Iterator, Comparable, Comparator, generics.

## Запуск локально

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Проверка переводов, сообщений обходов и всех Java-примеров (для их компиляции нужен JDK 17+):

```bash
npm test
```

## GitHub Pages

1. Создайте новый GitHub repository.
2. Скопируйте туда содержимое этого проекта.
3. Выполните:

```bash
git init
git add .
git commit -m "Initial DSA2 Visual Lab"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPOSITORY.git
git push -u origin main
```

4. В GitHub откройте **Settings → Pages**.
5. В **Build and deployment → Source** выберите **GitHub Actions**.
6. Workflow `.github/workflows/deploy.yml` установит зависимости, соберёт и опубликует сайт автоматически.

`vite.config.js` сам определяет имя repository в GitHub Actions и выставляет правильный `base`, поэтому вручную менять путь для обычного project site не нужно.

## Как расширять

Каждая тема находится в `src/App.jsx`, интерактивные визуализаторы — в `src/components`, а алгоритмы обхода графа — в `src/utils/graphAlgorithms.js`.

Проект полностью статический: сервер и база данных не требуются.
