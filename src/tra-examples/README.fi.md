# Esimerkit TRA-kirjastolla — JDK 11+

Nämä ovat valmiita esimerkkejä paketilla fi.uef.cs.tra. TRA on graafi-/puuaiheiden päärajapinta, myös graafianalyysissä, sovituksessa ja virtauksessa. Aiemmat 31 JDK-esimerkkiä säilyvät; siirretyt versiot ovat lisävertailuja.

Pura ZIP. Pidä kuusitoista `.java`-tiedostoa ja `traj.jar` samassa kansiossa. Avaa pääte tässä kansiossa ja suorita mikä tahansa esimerkki:

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar TraGraphExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraGraphDataExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraRecursiveDfsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraDfsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraTraversalExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraBfsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraTreeExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraPriorityQueueExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraComponentsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraTopologicalExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraDijkstraExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraFloydWarshallExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraMinimumSpanningTreeExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraGraphCutsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraBipartiteMatchingExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraMaxFlowExample.java
```

Komennot toimivat Windowsissa, macOS:ssä ja Linuxissa. Lisää IDE:ssä `traj.jar` kirjastoksi. Jokainen tiedosto sisältää oman main-metodin ja apuluokat eikä riipu muista esimerkeistä. `expected-output.txt` sisältää tällä JARilla tarkistetun tulosteen.

- **TraGraphExample:** luo `DiGraph`/`Graph`, lisää solmut ja kaaret, käytä metodeja `vertices()`, `neighbors()`, `getColor()` ja `setColor()`. Suuntaamaton kaari lisätään kerran: Graph muodostaa molemmat naapuruussuunnat.
- **TraDfsExample:** rekursiivinen DFS, GREY/PRE saapuessa, POST/BLACK valmistuessa, kutsujan jatkuminen paluun jälkeen, vanhemmat ja juuret. `traverse(graph, start, false)` käy saavutettavan osan; `true` jatkaa jäljellä olevista WHITE-solmuista. Suunnatun metsän juuret eivät tarkoita vahvasti yhtenäisiä komponentteja.
- **TraBfsExample:** `LinkedQueue<Vertex>`, GREY ennen jonoon lisäämistä, BLACK naapureiden käsittelyn jälkeen, lyhimmät etäisyydet kaarten määrän mukaan ja vanhempipolku. Saavuttamattoman etäisyys on -1 ja polku tyhjä. Jonosta poistaminen ei itsessään muuta väriä BLACKiksi.

Molemmat läpikäyntimetodit ottavat `AbstractGraph`-argumentin ja toimivat sekä `DiGraph`- että `Graph`-luokalla. Epätyhjässä graafissa aloitussolmun on kuuluttava graafiin; tyhjälle graafille anna null. Jokainen ajo alustaa värit uudelleen. Vanhempi- ja etäisyystauluissa käytetään solmuolioita: samat nimiöt eivät yhdistä solmuja.

Tässä TRA-versiossa `DiGraph` sallii silmukat, mutta `Graph` hylkää ne kaarta lisättäessä.

Näytetyt PRE/POST- ja löytämisjärjestykset vastaavat mukana olevan JARin `neighbors()`-järjestystä. Eri naapurijärjestys voi muuttaa DFS:n vanhempia, läpikäyntilistoja ja valintaa yhtä lyhyiden BFS-polkujen välillä, mutta ei lyhimpiä etäisyyksiä. Lähdekoodin kommentit ja tuloste ovat yhteiset käyttöliittymän kolmelle kielelle.

Täysi DFS vie Θ(V + E) aikaa ja O(V) lisätilaa tuloksille ja pinolle. Saavutettavan osan DFS ja BFS vievät Θ(V + R + A_R), mukaan lukien värialustus ja BFS:n etäisyysalustus. R on saavutettavien solmujen määrä ja A_R tutkittujen lähtevien naapuruusmerkintöjen määrä. Syötegraafin tilaa ei lasketa lisätilaan. Naapureita ei lajitella eikä kaikkia vieruslistoja kopioida ennen läpikäyntiä.

Mukana tuleva `traj.jar` on muuttamaton (SHA-256 `589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423`). Se sisältää myös vanhan paketin `fi.joensuu.cs.tra`; esimerkit käyttävät johdonmukaisesti pakettia `fi.uef.cs.tra`. Kirjaston dokumentaatio on JARin sisällä hakemistossa `javadoc/fi/uef/cs/tra/`.

- **TraGraphDataExample:** tallenna lähtevien naapurien määrät rakenteeseen `Map<Vertex, Integer>`; TRA säilyttää verkon rakenteen. A/B/C/D-verkko vastaa pääoppituntia; kaksi X-nimistä solmua näyttävät identiteettiin perustuvat avaimet. Laskenta säilyttää värit ja rakenteen, vie odotetusti Θ(V + E) aikaa ja O(V) Map-lisätilaa.

Pääoppitunti näyttää kaaret A→B (5.0f), A→C (2.0f), B→C (1.0f) sekä eristetyn D:n. Kuvaa, naapurilistoja ja TraGraphExample.createDirectedGraph()-metodia verrataan todelliseen JARiin. addEdgen float-argumentti on paino, int-argumentti väri.

Perus-DFS käyttää **TraRecursiveDfsExample**-tiedostoa: oma TRA-naapuri-iteraattori ja erillinen IdentityHashMap visited, värejä muuttamatta. i laskee käsitellyt naapurit; next() siirtää iteraattoria jo ennen lapsikutsua. Lapsen palattua sama vanhemman iteraattori jatkuu. Koko läpikäynnin odotettu aika on Θ(V + E), saavutettavan osan visited-alustuksineen Θ(V + R + A_R); lisätila O(V). Opetusesimerkkien järjestys tarkistetaan mukana tulevalla JARilla eikä tarkoita nimien lajittelutakuuta.

**TraTraversalExample** on väri-, kaarityyppi- ja harjoittelunäkymien yhteinen lähde: vakaat identiteetti-ID:t, solmukuvaukset, fyysiset Edge-oliot, ajat, syklitodiste, polut ja topologinen järjestys, joka hylkää syklin, keskeneräisen DFS:n ja BFS:n. BFS käyttää TRA LinkedQueue -jonoa. Lajitellut naapurilistat valmistellaan eksplisiittisesti ajassa O(V + E + Σ d(v) log(d(v) + 1)) ja tilassa O(V + E). Sen jälkeen koko läpikäynnin ydin vie Θ(V + E), saavutettava osa Θ(R + A_R). Lisätila listoineen ja kaariluokkineen on yhteensä O(V + E); lajittelua ei lasketa lineaariseksi läpikäynniksi.

TraBfsExample luo saman A–H Graph -verkon kuin peruskuva ja tulostaa löytämisjärjestyksen, etäisyydet ja lyhimmän A–H-polun. Yleinen search tukee myös DiGraphia, saavuttamattomia kohteita ja tyhjää verkkoa. GREY ennen jonoon lisäämistä, BLACK kaikkien naapurien jälkeen; poistaminen ei yksin päätä käsittelyä.

**TraTreeExample** luo kuvan A–G BTree -puun ja täyttää PRE/IN/POST-listat yhdellä läpikäynnillä. Korkeus kaarina: tyhjä -1, lehti 0, n solmun ketju n-1. Kukin traverse/size/height vie Θ(n) aikaa; epätyhjän puun pino on O(h+1), lyhyt null-kutsu lisää yhden kehyksen (huippu h+2). Tulokset lisäävät O(n) tilaa. Tree/TreeNode käyttävät ensimmäistä lasta ja seuraavaa sisarusta: R:n lapset ovat X/Y/Z. BTree ei automaattisesti ole hakupuu/keko eikä ulkoisen muistin B-puu.

**TraPriorityQueueExample** tuo fi.uef.cs.tra.PriorityQueuen, käyttää opetuskeon arvoja, säilyttää toisen 3:n sekä näyttää poistamattoman peekin, poistavan pollin ja tyhjän jonon nullin. Nullin lisääminen on kielletty. Tehtävät käyttävät kapasiteettia ja vertailijaa. Iteraattori ei takaa lajittelua eikä kuvan tarkkaa järjestystä. priorityOrder kopioi ja poistaa muuttamatta alkuperäistä: O(n log n) aikaa ja O(n) tilaa. peek O(1), poll O(log n), offer amortoidusti O(log n) taulukon kasvatuksineen.

**TraComponentsExample** ottaa suuntaamattoman Graphin. Alusta värit kerran, käy kaikki solmut ja aloita DFS vain WHITE-solmusta: yksi tuloslista on yksi komponentti. Tehdas ja kuva sisältävät 0—1, eristetyn 2:n ja 3—4. Tyhjällä graafilla on nolla komponenttia. Erillinen koko graafin syklitarkistus ohittaa saman fyysisen vanhempi-Edge-kaaren: yksi kaari ei muodosta sykliä, kolmio muodostaa. Molemmat metodit päättävät kaikki juuret BLACKiksi ajassa Θ(V + E) ja O(V) lisätilassa tuloksineen ja pinoineen. Vain solmuvärit muuttuvat, kukin ajo luo uudet listat.

**TraTopologicalExample** ottaa DiGraphin ja kerää POST:n koko DFS:llä. Lähtevä kaari GREY-solmuun, myös silmukka, heittää `IllegalArgumentException("cycle")`-poikkeuksen. POST käännetään ja palautetaan vasta kaikkien juurien onnistuttua; eristetty solmu sisältyy tulokseen, tyhjä graafi antaa tyhjän järjestyksen. Sykli erillisessä osassa estää myös koko järjestyksen. Virheen jälkeen värit voivat olla WHITE/GREY/BLACK, mutta uusi ajo alustaa ne, eikä osittaista järjestystä palauteta. Aika Θ(V + E), lisätila O(V). Kaaret, painot ja nimiöt säilyvät. DAG- ja syklitehtaat vastaavat yhteistä visualisointia.

Vanhempipolkuihin ja syklin todistavaan polkuun käytetään sovellusten työtilassa **TraTraversalExample**-esimerkkiä. `path(state, target)` palauttaa polun alkuperäisestä alusta tai tyhjän listan saavuttamattomalle/vieraalle kohteelle; alku → alku sisältää nolla kaarta. DFS antaa löydetyn polun, BFS minimoi kaarimäärän. Koko metsä ei luo saavutettavuutta: muut juuret säilyttävät etäisyyden -1 alkuperäisestä alusta ja oman syvyyden nolla. DiGraphin naapurit ovat lähteviä, eikä sen metsä ole SCC-jako. Erilaiset kelvolliset polut, komponenttilistat ja topologiset järjestykset hyväksytään ominaisuuksien, ei yhden tarkan listan perusteella. Yhteinen animaatio valmistelee lajitellut naapurit erikseen edellä kuvatulla kustannuksella; kaksi uutta esimerkkiä eivät lajittele.

**TraDijkstraExample** ottaa Graphin/DiGraphin ja sen aloitussolmun (null vain tyhjälle). Kaikki Edge-painot tarkistetaan, myös saavuttamattomat: vain äärelliset ei-negatiiviset painot sallitaan. TRA PriorityQueue luodaan kapasiteetilla ja vertailijalla. Muuttumaton tietue sisältää Vertexin ja double-etäisyyden; parannus lisää uuden tietueen, vanhentunut ohitetaan. Jonossa olevan Vertexin kenttiä ei muuteta. Aika O(V + E log(E + 1)), lisätila O(V + E) tauluineen ja laiskoine jonotietueineen. A/B/C/D/E antaa etäisyydet 0/3/1/4/INF ja polun A→C→B→D; E on eristetty.

**TraFloydWarshallExample** ottaa Graphin/DiGraphin, liittää oikeisiin Vertex-olioihin ulkoiset indeksit ja muodostaa etäisyys-/seuraavan askeleen matriisit lähtevistä Edge-kaarista. Nolladiagonaali tarkoittaa tyhjää polkua, +∞ puuttumista/saavuttamattomuutta. Ulompi k-silmukka käsittelee välisolmut. Äärelliset negatiiviset painot sallitaan. Mikä tahansa laskettu negatiivinen diagonaali hylkää koko tuloksen poikkeuksella `IllegalArgumentException("negative cycle")`, myös erilliset negatiiviset syklit ja silmukat; osittaista matriisia/polkua ei palauteta. Matemaattisesti äärellinen minimi puuttuu vain vaikutuksen alaisilta pareilta; tässä valitaan koko tuloksen hylkäys. Negatiivinen suuntaamaton kaari mahdollistaa painon rajattoman pienentämisen edestakaisin kulkemalla ja hylätään myös. Aika O(V³ + E), lisätila O(V²). A→B:5, B→C:-2, A→C:10 antavat A→B→C:n painolla 3; D on eristetty.

Dijkstra: `distanceTo(target)` / `pathTo(target)`. Floyd: `distance(from, to)` / `path(from, to)`. Käytetään identiteettiä, ei nimeä tai Vertex.index-kenttää. Vieraat/null-kyselysolmut hylätään. Saavuttamattomuus on Double.POSITIVE_INFINITY (tulosteessa INF) ja tyhjä polku; solmusta itseensä etäisyys on 0 ja polussa yksi solmu, nolla kaarta. Polkukysely vie O(polun pituus); yhtä halvat eri polut sallitaan. Kaikki graafin kentät, myös värit, säilyvät, ja eri ajojen tulokset ovat riippumattomia.

Lukupolitiikka: Edge.getWeight()-metodin äärelliset float-arvot summataan doublena, parannuksia verrataan aidosti pienempinä ja Floydin äärettömät osapolut ohitetaan. Float.MAX_VALUE-summat pienissä graafeissa ovat äärellisiä doublena; 0.1f on silti binäärinen likiarvo. Liukulukulaskenta ei todista negatiivisen syklin puuttumista painojen lähes kumotessa toisensa; opetusesimerkit käyttävät pieniä tarkasti esitettävissä olevia arvoja. Testit käyttävät tarkkoja binäärimurtolukuja sekä mittakaava-/ULP-toleransseja etäisyyksille ja polkusummille. NaN ja molemmat äärettömyydet hylätään syötteestä. Kirjoita addEdge-kutsuun 5.0f: kokonaislukuargumentti valitsee värin. BFS on vertailu pienimmälle kaarimäärälle, ei mielivaltaiselle painosummalle.

**TraMinimumSpanningTreeExample** ottaa suuntaamattoman Graphin ja palauttaa Resultin: vertices(), edges(), components(), totalWeight(), isSpanningTree(). Lista sisältää oikeat syötteen Edge-viitteet, ei keinotekoisia käänteisiä tai aloituskaaria. Epäyhtenäinen syöte antaa pienimmän virittävän metsän: V solmua ja C komponenttia vaativat V-C valittua kaarta, eristetytkin solmut huomioidaan. Tyhjän graafin komponenttimäärä/paino on 0 eikä sitä kutsuta puuksi; yksi solmu on kaareton puu. Listat ovat vain luettavia, kukin ajo omistaa uuden tuloksen ja graafin kentät säilyvät. Oliot pysyvät syötteen muuttuvina olioina, joten tulos ei ole syväkopio.

Prim tallentaa rajakaaret TRA PriorityQueueen kapasiteetilla ja vertailijalla. Kaari, jonka molemmat päät on jo saavutettu, ohitetaan, ja komponentin jälkeen aloitetaan uudesta juuresta. Graphin päiden tallennussuunta ei merkitse mitään; painoja ei muuteta jonossa ollessa. Kruskal lajittelee Graph.edges()-kopion, jossa kukin fyysinen kaari esiintyy kerran, ja käyttää omia union-find-taulukoita poluntiivistyksellä/rankeilla sekä ulkoisia identiteettipohjaisia Vertex-indeksejä. Molemmat säilyttävät värit ja Vertex.index/weight-kentät. Aika on kummallakin O(V + E log(E + 1)), lisätila O(V + E), olettaen kuvauksen/joukon odotetut O(1)-operaatiot; Prim lisää kunkin fyysisen kaaren jonoon enintään kerran.

Äärelliset negatiiviset/nollapainot ja yhtäsuuret painot sallitaan; algoritmien ei tarvitse valita samoja kaaria tai järjestystä. NaN ja molemmat äärettömyydet hylätään koko graafista. Float-painot summataan doublena tavallisin pyöristyksin. Yhtenäinen esimerkki painaa 4; eristetty E ja F-G:-2 antavat kolme komponenttia, neljä kaarta ja painon 2. Graafissa A-B:2, A-C:2, B-C:1 MST painaa 3, mutta A:n lyhimpien polkujen puu valitsee kaksi painon 2 kaarta, summa 4. MST minimoi kaarisumman, ei etäisyyksiä alusta. Vanha JDK-esimerkki säilyy vertailuna ja hylkää epäyhtenäisen syötteen.

**TraGraphCutsExample** ottaa Graphin ja ohittaa painot. Koko DFS palauttaa oikeat leikkaus-Vertexit ja silta-Edget kaikista komponenteista. tin laskee saapumiset; low on varhaisin saapuminen puuta alas ja enintään yhtä ei-vanhempipaluukaarta pitkin. Käyty naapuri antaa tin-arvon, palaava lapsi low-arvon. Muu kuin juuri on leikkaussolmu, kun low[child] >= tin[v]; silta, kun low[child] > tin[v]; juuri tarvitsee kaksi DFS-lasta. Sama fyysinen parent Edge ohitetaan. Tyhjyys, eristys ja epäyhtenäisyys käyvät. Odotettu O(V + E) aika/O(V) tila; tulosten nimien lajittelu erikseen. Vieraat aikakyselysolmut hylätään.

**TraBipartiteMatchingExample** ottaa Graphin ja eksplisiittisen listan eri vasemman puolen syöte-Vertexeistä; oikea on loput. Jokainen kaari tarkistetaan osajaon yli, jakoa ei lasketa automaattisesti. Rekursiiviset vuorottelevat polut vaihtavat parit; uusi seen luodaan vasenta juurta kohti. Saadaan suurin parimäärä, ei vain maksimaalista joukkoa. Painot ohitetaan. Tulos antaa oikeat Edget, osalistat ja symmetrisen partnerOf-kyselyn: null vapaalle, virhe vieraalle solmulle. Odotettu O(V + E + L·E) aika/O(V) tila. L0:[R0,R1], L1:[R0] siirtää L0:n R1:een; eristetty R2 jää vapaaksi.

**TraMaxFlowExample** ottaa DiGraphin ja eri syötesolmuina lähteen/nielun; tyhjässä graafissa ei ole kelvollisia päitä. Opetustoteutus hyväksyy tallennetut float-Edge-kapasiteetit vain äärellisinä kokonaislukuina [0, 1 000 000 000]. Negatiiviset, murto-, ei-äärelliset ja ylisuuret arvot hylätään koko graafista pyöristämättä; sitten käytetään tarkkoja longeja ja tarkistettuja summia. Desimaaliluku on voinut pyöristyä float-tallennuksessa: tarkistus koskee tallennettua arvoa. Kirjoita addEdge(v, 3.0f), kokonaislukuargumentti valitsee värin. Kukin Edge saa oman eteenpäin/peruutusparin, myös oikeiden vastakkaisten kaarien tapauksessa. Peruutus ei vaadi syötekaarta eikä muuta syötettä. BFS käyttää TRA LinkedQueuea. Tulos antaa flowOn/capacityOf-kyselyt, valuen, sourceSiden, cutEdges/cutCapacityn ja peruutusaskelmäärän; vieraat Edget hylätään. Leikkauskapasiteetti vastaa virtausarvoa. Odotettu O(V + E + V·E²) aika/O(V + E) tila; uusi BFS-vanhempikuvaus ei alusta kaikkia eristettyjä solmuja joka kierroksella.

Kaikki kolme säilyttävät syötekentät/rakenteen, palauttavat oikeat oliot vain luettavissa listoissa ja riippumattomat uusinta-ajon tulokset. Vaativuudet olettavat identiteettihaun odotetun O(1)-ajan. Uudelleenreitityksen x→a peruu a→x:n, vaikka x→a puuttuu syötteestä; lopullinen virtaus on 2, a→x:n virtaus 0. SCC ja uudet ohjelmointitehtävät jäävät erillisiksi. Vanhat taulukko-/matriisiversiot säilyvät suljetuissa vertailuissa omine sopimuksineen ja kustannuksineen.
