# TRA-esimerkit: yksi asia kerrallaan — Java 11+

Jokainen tiedosto opettaa yhden toiminnon tai algoritmin vaiheen ja toimii itsenäisesti. Etene perusteista DFS/BFS:ään, sovelluksiin, puihin/jonoon, painotettuihin polkuihin/virittäviin puihin ja lopuksi analyysiin/virtaukseen. Sivulla näkyy ensin ydinkoodi; koko tiedosto ja komento avautuvat erikseen.

Pura ZIP ja avaa pääte `tra-graphs`-kansioon, jossa `traj.jar` on. Alla olevat komennot ovat suhteessa tähän kansioon ja toimivat Windowsissa, macOS:ssä ja Linuxissa. Laita yksittäin ladattu tiedosto JARin viereen ja suorita `java -Dfile.encoding=UTF-8 -cp traj.jar Filename.java`. Lisää IDE:ssä JAR kirjastoksi. Muita esimerkkitiedostoja ei tarvita.

Aihekansioiden `RUN.txt` sisältää juuresta suoritettavat komennot; `expected-output.txt` sisältää tarkistetun tulosteen. Java-kommentit ja tulosteet ovat englanniksi; sivun selitykset ovat suomeksi, venäjäksi ja englanniksi.

## Lähtöoletukset

- Yksinkertainen DFS käyttää vierailukarttaa; värioppitunti on erillinen. Värejä käyttävät menetelmät alustavat ne ennen kutsua ja saavat muuttaa niitä. Läpikäynnit säilyttävät verkon rakenteen.
- Naapurijärjestys riippuu mukana tulevasta JARista. Se voi muuttaa DFS-järjestystä ja yhtä lyhyen BFS-polun valintaa, mutta ei lyhimpiä etäisyyksiä. Samat nimet eivät yhdistä Vertex-olioita: kartat käyttävät identiteettiä.
- Ensimmäinen Dijkstra selaa solmut: odotettu O(V² + E) aikaa ja O(V) muistia; painot ovat äärellisiä ja ei-negatiivisia. Floyd muodostaa matriisin TRAsta, sallii negatiiviset painot ja hylkää negatiiviset syklit. Infinity tarkoittaa saavuttamattomuutta.
- Prim ja Kruskal ovat erillisiä. Prim käyttää TRA PriorityQueue -jonoa; ensimmäinen Kruskal näkyvää DSU:ta ilman rankia tai poluntiivistystä: odotettu O(V + E log(E + 1) + E·V), ei optimoidun DSU:n arvio. Painot ovat äärellisiä ja pysyviä; epäyhtenäinen syöte antaa metsän.
- tin/low, sillat ja nivelpisteet ovat erillisiä oppitunteja. Juurelle lasketaan DFS-lapset, ei astetta. Paritus olettaa tunnetun kelvollisen kaksijaon: kaikki kaaret ylittävät sen. Mielivaltaista jakoa ei lasketa eikä tarkisteta.
- Ennen koko virtausalgoritmia on kolme lyhyttä esimerkkiä; yksi vaihe ei ole maksimivirtausalgoritmi. Koko versio kuvaa TRAn jäännösmatriisiin ja käyttää TRA LinkedQueue -jonoa. Tallennetut float-kapasiteetit ovat äärellisiä kokonaislukuja [0, 1_000_000_000]. Matriisi muuttuu, verkko säilyy. Alkio yhdistää vastakkaisen kapasiteetin ja perumisen, joten tulos on kokonaisvirtaus/leikkaus, ei yksittäisten syötekaarien virtaukset. Matriisi-BFS antaa O(V² + E + V³·E) aikaa ja O(V²) muistia. Solmulista sisältää jokaisen solmun kerran; lähteen ja nielun indeksit ovat kelvolliset ja eri.
- Tyhjän binääripuun korkeus on -1, lehden 0. PRE, IN ja POST ovat eri metodeissa. Tree esitetään erillisessä esimerkissä ensimmäisen lapsen ja seuraavan sisaruksen avulla.
- TRAssa `addEdge(v, 5.0f)` asettaa painon, `addEdge(v, 5)` värin. Käytä fi.uef.cs.tra-pakettia. Map-arviot olettavat odotetun O(1)-identiteettihaun.

Alkuperäinen JAR säilyy muuttumattomana: SHA-256 `589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423`. Vanhojen visualisointien tekniset vertailutoteutukset jäävät repositorioon opiskelija-ZIPin ulkopuolelle.

## Esimerkkien järjestys

### basics

**Luo suuntaamaton verkko**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraCreateGraph.java
```

**Luo suunnattu verkko**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraCreateDirectedGraph.java
```

**Käy kaikki solmut läpi**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraListVertices.java
```

**Käy yhden solmun naapurit läpi**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraListNeighbors.java
```

**Lue kaaren paino**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraReadEdgeWeight.java
```

**Liitä solmuun tietoja**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/basics/TraVertexMap.java
```

### dfs

**Rekursiivinen DFS: käy solmussa**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraSimpleDfs.java
```

**DFS: miksi sykli pysähtyy**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsCycle.java
```

**DFS: saapuminen ja paluu (PRE / POST)**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsPrePost.java
```

**DFS väreillä WHITE, GREY ja BLACK**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraColourDfs.java
```

**DFS: saapumis- ja poistumisajat**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsTimes.java
```

**Suunnattu DFS: luokittele kaari**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/dfs/TraDfsEdgeTypes.java
```

### bfs

**BFS: läpikäynti jonolla**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraSimpleBfs.java
```

**BFS: miksi D lisätään jonoon vain kerran**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsDiscovery.java
```

**BFS: etäisyys kaarien määränä**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsDistances.java
```

**BFS: palauta polku**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/bfs/TraBfsPath.java
```

### applications

**DFS: jatka toisessa komponentissa**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraFullDfs.java
```

**Sykli suuntaamattomassa verkossa**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraUndirectedCycle.java
```

**Sykli suunnatussa verkossa**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraDirectedCycle.java
```

**DAG: käännä POST-järjestys**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/applications/TraTopologicalOrder.java
```

### trees

**Luo binääripuu**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraCreateTree.java
```

**Lue solmun lapset**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeChildren.java
```

**PRE: solmu, vasen, oikea**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreePRE.java
```

**IN: vasen, solmu, oikea**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeIN.java
```

**POST: vasen, oikea, solmu**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreePOST.java
```

**Laske puun solmut**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeSize.java
```

**Laske korkeus kaarina**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraTreeHeight.java
```

**Yleinen puu: lapset ja sisarukset**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/trees/TraGeneralTreeChildren.java
```

### queue

**PriorityQueue: lisää arvoja**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueOffer.java
```

**PriorityQueue: katso poistamatta**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueuePeek.java
```

**PriorityQueue: poista pienin**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueuePoll.java
```

**PriorityQueue: samat arvot sallitaan**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueDuplicates.java
```

**PriorityQueue: valitse toinen järjestys**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraQueueComparator.java
```

**Tehtävät: prioriteetti ja tasatilanne**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/queue/TraTaskPriority.java
```

### weighted

**Dijkstra: etäisyydet ei-negatiivisilla painoilla**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraDijkstraDistances.java
```

**Dijkstra: tallenna parantunut polku**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraDijkstraPath.java
```

**TRA-verkko → etäisyysmatriisi**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraGraphMatrix.java
```

**Floyd: kokeile yhtä välisolmua**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraFloydDistances.java
```

**Floyd: palauta polku**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/weighted/TraFloydPath.java
```

### mst

**Prim: kasvata puuta**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraPrim.java
```

**Erilliset joukot: ovatko päätesolmut jo yhteydessä?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraDisjointSets.java
```

**Kruskal: hyväksy kaaret luomatta sykliä**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/mst/TraKruskal.java
```

### analysis

**DFS: mitä tin ja low tarkoittavat**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraLowValues.java
```

**Silta: pääseekö lapsen alipuu takaisin?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraBridges.java
```

**Nivelpiste: entä jos solmu poistetaan?**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraArticulationPoints.java
```

**Paritus: siirrä olemassa oleva pari**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraMatchingStep.java
```

**Paritus: toista jokaiselle vasemmalle solmulle**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/analysis/TraMaximumMatching.java
```

### flow

**Virtaus: jäljellä oleva kapasiteetti**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraResidualCapacity.java
```

**Virtaus: lisää yhdelle tunnetulle polulle**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraAugmentFlow.java
```

**Virtaus: peru aiempi valinta**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraCancelFlow.java
```

**Maksimivirtaus: toista lisääviä polkuja**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraMaximumFlow.java
```

**Minimileikkaus: jäännösverkossa saavutettava puoli**

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar lessons/flow/TraMinimumCut.java
```
