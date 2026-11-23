# Примеры TRA: одна идея за раз — Java 11+

Каждый файл учит одной операции или одному шагу алгоритма и запускается независимо. Порядок: основы → DFS/BFS → применения → деревья/очередь → взвешенные пути/остовы → анализ/поток. На сайте сначала виден основной код; полный файл и команда раскрываются отдельно.

Распакуйте ZIP и откройте терминал в `tra-graphs`, рядом с `traj.jar`. Команды ниже используют пути от этой папки и подходят для Windows, macOS и Linux. Отдельно скачанный файл положите рядом с `traj.jar` и запустите `java -Dfile.encoding=UTF-8 -cp traj.jar Filename.java`. В IDE подключите JAR как библиотеку. Другие исходники примеров не требуются.

В тематических папках `RUN.txt` содержит команды от корня архива; `expected-output.txt` — проверенный вывод. Комментарии и вывод Java на английском, объяснения сайта на русском, финском и английском.

## Начальные условия

- Простой DFS использует карту посещений; урок цветов отдельный. Методы с цветами инициализируют их перед вызовом и могут менять их. Обходы сохраняют структуру графа.
- Порядок соседей зависит от приложенного JAR. Он может менять порядок DFS и выбор равного по длине пути BFS, но не кратчайшие расстояния. Одинаковые метки не объединяют Vertex: ключи карт различаются по идентичности.
- Первая Дейкстра выбирает вершины перебором: ожидаемое O(V² + E) времени и O(V) памяти; веса конечные и неотрицательные. Флойд строит матрицу из TRA, допускает отрицательные веса и отклоняет отрицательные циклы. Infinity означает недостижимость.
- Прим и Краскал разделены. У Прима — TRA PriorityQueue, у первого Краскала — явная DSU без рангов и сжатия путей: ожидаемое O(V + E log(E + 1) + E·V), а не оценка оптимизированной DSU. Веса конечные и неизменные; несвязный вход даёт лес.
- tin/low, мосты и точки сочленения разбираются отдельно. У корня считаются дети DFS, не степень. Паросочетание предполагает известные корректные доли: все рёбра между ними. Произвольное разбиение не вычисляется и не проверяется.
- Перед полным потоком идут три коротких примера; отдельный шаг не является алгоритмом максимального потока. Полная версия отображает TRA в матрицу остатков и использует TRA LinkedQueue. Сохранённые float-ёмкости — конечные целые [0, 1_000_000_000]. Меняется матрица, граф сохраняется. Ячейка объединяет встречную ёмкость и отмену, поэтому результат — общий поток/разрез, не потоки отдельных входных рёбер. Матричный BFS даёт O(V² + E + V³·E) времени и O(V²) памяти. Список содержит каждую вершину ровно один раз; индексы истока и стока допустимы и различны.
- Высота пустого бинарного дерева -1, листа 0. PRE, IN, POST имеют отдельные методы. Представление Tree через первого ребёнка и следующего соседа объясняется отдельно.
- В TRA `addEdge(v, 5.0f)` задаёт вес, `addEdge(v, 5)` — цвет. Везде используется fi.uef.cs.tra. Оценки карт предполагают ожидаемый O(1) поиска по идентичности.

Исходный JAR сохранён без изменений: SHA-256 `589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423`. Технические эталонные реализации для проверки прежних визуализаций остались в репозитории вне учебного ZIP.

## Порядок примеров

### basics

**Создать неориентированный граф**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraCreateGraph.java
```

**Создать ориентированный граф**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraCreateDirectedGraph.java
```

**Перебрать все вершины**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraListVertices.java
```

**Перебрать соседей одной вершины**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraListNeighbors.java
```

**Прочитать вес ребра**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraReadEdgeWeight.java
```

**Хранить данные о вершине**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraVertexMap.java
```

### dfs

**Рекурсивный DFS: посетить вершину**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraSimpleDfs.java
```

**DFS: почему цикл останавливается**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsCycle.java
```

**DFS: вход и возврат (PRE / POST)**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsPrePost.java
```

**DFS с WHITE, GREY и BLACK**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraColourDfs.java
```

**DFS: времена входа и выхода**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsTimes.java
```

**Ориентированный DFS: определить тип ребра**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsEdgeTypes.java
```

### bfs

**BFS: обход с очередью**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraSimpleBfs.java
```

**BFS: почему D попадает в очередь один раз**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsDiscovery.java
```

**BFS: расстояние по числу рёбер**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsDistances.java
```

**BFS: восстановить путь**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsPath.java
```

### applications

**DFS: продолжить в другой компоненте**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraFullDfs.java
```

**Цикл в неориентированном графе**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraUndirectedCycle.java
```

**Цикл в ориентированном графе**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraDirectedCycle.java
```

**DAG: развернуть порядок POST**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraTopologicalOrder.java
```

### trees

**Создать бинарное дерево**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraCreateTree.java
```

**Прочитать детей узла**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeChildren.java
```

**PRE: узел, левый, правый**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreePRE.java
```

**IN: левый, узел, правый**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeIN.java
```

**POST: левый, правый, узел**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreePOST.java
```

**Посчитать узлы дерева**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeSize.java
```

**Вычислить высоту в рёбрах**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeHeight.java
```

**Обычное дерево: дети и соседи**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraGeneralTreeChildren.java
```

### queue

**PriorityQueue: добавить значения**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueOffer.java
```

**PriorityQueue: посмотреть без удаления**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueuePeek.java
```

**PriorityQueue: удалить минимум**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueuePoll.java
```

**PriorityQueue: одинаковые значения разрешены**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueDuplicates.java
```

**PriorityQueue: задать другой порядок**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueComparator.java
```

**Задачи: приоритет и равные значения**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraTaskPriority.java
```

### weighted

**Дейкстра: расстояния с неотрицательными весами**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraDijkstraDistances.java
```

**Дейкстра: сохранить улучшенный путь**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraDijkstraPath.java
```

**Граф TRA → матрица расстояний**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraGraphMatrix.java
```

**Флойд: проверить промежуточную вершину**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraFloydDistances.java
```

**Флойд: восстановить путь**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraFloydPath.java
```

### mst

**Прим: наращивать дерево**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraPrim.java
```

**Непересекающиеся множества: концы уже связаны?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraDisjointSets.java
```

**Краскал: добавлять рёбра без циклов**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraKruskal.java
```

### analysis

**DFS: что означают tin и low**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraLowValues.java
```

**Мост: может ли поддерево вернуться?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraBridges.java
```

**Точка сочленения: что если удалить вершину?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraArticulationPoints.java
```

**Паросочетание: переназначить пару**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraMatchingStep.java
```

**Паросочетание: повторить для каждой левой вершины**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraMaximumMatching.java
```

### flow

**Поток: остаточная ёмкость**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraResidualCapacity.java
```

**Поток: увеличить по одному известному пути**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraAugmentFlow.java
```

**Поток: отменить прежнее решение**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraCancelFlow.java
```

**Максимальный поток: повторять увеличения**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraMaximumFlow.java
```

**Минимальный разрез: достижимая остаточная сторона**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraMinimumCut.java
```
