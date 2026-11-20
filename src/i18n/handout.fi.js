export default {
  ui: {
    handout: 'Kurssimoniste',
    handoutPages: 's.',
    javaExamples: 'Java-esimerkit',
    javaNote:
      'Itsenäisiä esimerkkejä JDK 11:lle tai uudemmalle. Lataa tiedosto ja suorita alla oleva komento. Kurssin TRA-kirjastoa ei tarvita.',
    javaComparison: 'Lisämateriaali: itsenäiset JDK-versiot',
    javaComparisonNote:
      'TRA-esimerkit ovat yllä. Valinnaiset vertailut käyttävät taulukoita tai JDK-kokoelmia ja toimivat JDK 11+:lla ilman traj.jar-tiedostoa.',
    runJava: 'Suoritus',
    expectedOutput: 'Odotettu tuloste',
    downloadJava: 'Lataa .java',
    complexityLabel: 'Vaativuus ja oletukset',
  },
  group: 'Ulkoinen muisti',
  topics: [
    ['Listat, pino ja jono', 'ADT, ArrayList, LinkedList, ArrayDeque'],
    ['Set Javassa', 'Yhdiste, leikkaus, erotus, HashSet, TreeSet'],
    ['Map Javassa', 'Frekvenssit, entrySet, HashMap, TreeMap'],
    ['Painotetut lyhimmät polut', 'Dijkstra, Floyd–Warshall, negatiiviset painot'],
    ['Pienimmät virittävät puut', 'Prim, Kruskal, union–find'],
    ['Verkkoanalyysi ja virtaukset', 'Syklit, leikkaukset, sovitus, jäännösverkko'],
    ['Algoritmistrategiat', 'Ahneus, hajota ja hallitse, DP, tasoitettu vaativuus'],
    ['Merkkijonohaku', 'Naiivi, Rabin–Karp, automaatit, likimääräinen haku'],
    ['Tiedostot ja B-puut', 'Lohkot, ulkoinen lomitus, vakiomittaiset tietueet'],
  ],
  pages: {
    overview: {
      cards: [
        [
          'Kurssimoniste ja tämä oppimissivusto',
          'Kurssi käsittelee abstrakteja tietotyyppejä, aikavaativuutta, suunnattuja ja suuntaamattomia verkkoja, algoritmistrategioita, merkkijonoja ja ulkoista muistia. Jokainen aihe viittaa monisteen lukuihin. Esimerkit ovat itsenäisiä opetustoteutuksia tavallisella Javalla.',
        ],
      ],
    },
    complexity: {
      cards: [
        [
          'O, Ω ja Θ',
          'O on asymptoottinen yläraja, Ω alaraja ja Θ tarkka kasvuluokka. Merkinnät eivät itsessään tarkoita pahinta, parasta tai keskimääräistä tapausta: määrittele ensin, mitä suoritusaikafunktiota rajoitetaan.',
        ],
        [
          'Rekursio',
          'Puolitushaku: T(n) = T(n/2) + Θ(1) antaa Θ(log n). Lomitusjärjestäminen: T(n) = 2T(n/2) + Θ(n) antaa Θ(n log n). Laske sekä kutsujen määrä että kunkin kutsun työ.',
        ],
        [
          'Mittaaminen ja ekstrapolointi',
          'Mittaa riittävän suuria syötteitä JVM:n lämmittelyn jälkeen ja toista mittaus. Kun n kaksinkertaistuu, lineaarinen työ noin kaksinkertaistuu ja neliöllinen noin nelinkertaistuu. Mittaus tukee mallia mutta ei todista vaativuusrajaa.',
        ],
      ],
    },
    'sorted-lists': {
      cards: [
        [
          'Miksi toteutus käyttää iteraattoreita',
          'Toistuva `get(i)` LinkedList-listassa voi tehdä näennäisesti lineaarisesta lomituksesta neliöllisen. Ajettava esimerkki siirtää kahta iteraattoria, käsittelee molemmat loppuosat ja poistaa toistot sekä listojen sisältä että niiden väliltä. Syötteiden on oltava järjestettyjä ja ilman null-arvoja.',
        ],
      ],
    },
    'sets-maps': {
      cards: [
        [
          'ADT-merkintä ja Javan metodit',
          'Moniste kuvaa abstraktia joukkoa metodeilla `union` ja `member`. Javan Set käyttää jäsenyyden tarkistamiseen metodia `contains`. Tee yhdiste kopioimalla ensimmäinen joukko ja kutsumalla `addAll`. Leikkaus on `retainAll`, erotus `removeAll`. Nämä muuttavat vastaanottavaa kokoelmaa.',
        ],
        [
          'Toteutuksen valinta',
          'HashSet/HashMap tarjoavat odotusarvoisesti vakioaikaisen perushaun, kun hajautus jakaa avaimet hyvin, mutta eivät takaa läpikäyntijärjestystä. LinkedHashSet/LinkedHashMap säilyttävät lisäysjärjestyksen. TreeSet/TreeMap ylläpitävät avainjärjestystä O(log n) perusoperaatioilla.',
        ],
        [
          'Yhtäsuuruus ja vakaat avaimet',
          'Yhtäsuurilla olioilla on oltava sama hajautusarvo; sama hajautusarvo ei takaa yhtäsuuruutta. Älä muuta `equals`/`hashCode`-kenttiä olion ollessa hajautusrakenteen avaimena. Puurakenteiset kokoelmat tunnistavat saman arvon vertailutuloksesta nolla.',
        ],
      ],
    },
    trees: {
      cards: [
        [
          'Korkeus ja rekursion tila',
          'Korkeus lasketaan kaarina: tyhjä −1, lehti 0, n solmun ketju n − 1. Tasoja on h + 1. Läpikäynti vie Θ(n) aikaa ja epätyhjän puun pino O(h + 1) tilaa; tuloslistat lisäävät O(n). Null-kutsu lisää hetkeksi yhden kehyksen.',
        ],
        [
          'TRA:n binäärinen ja yleinen puu',
          '`BTree`/`BTreeNode` käyttävät vasenta ja oikeaa lasta; IN lajittelee vain hakupuussa. `Tree`/`TreeNode` käyttävät ensimmäistä lasta ja seuraavaa sisarusta. Todelliset rajapinnat ja esimerkit ovat avattavassa oppitunnissa.',
        ],
      ],
    },
    heap: {
      cards: [
        [
          'TRA-prioriteettijono',
          'Käytä eksplisiittistä importia `fi.uef.cs.tra.PriorityQueue`. Luokka perii JDK PriorityQueuen; vertailijalle tarvitaan `new PriorityQueue<>(11, comparator)`. Toistot säilyvät. Tyhjän jonon `peek`/`poll` palauttavat nullin; nullin lisääminen on kielletty.',
        ],
        [
          'Prioriteetti ja iterointi',
          'Käytä prioriteettijärjestykseen toistuvaa `poll`-kutsua; iteraattorin järjestystä ei määritellä. `contains`/`remove(Object)` vievät O(n). Olion prioriteetin muutos ei korjaa tavallista jonoa. Kuva esittää keon periaatteen; yksittäisellä jonolla voi olla toinen kelvollinen sisäinen järjestys.',
        ],
      ],
    },
    'graph-basics': {
      cards: [
        [
          'Vieruslista ja vierusmatriisi',
          'Olkoon V solmujen ja E kaarien määrä. Listat tarvitsevat O(V + E) tilaa ja luettelevat solmun naapurit ajassa O(deg(v)). Matriisi vie O(V²) tilaa, tarkistaa kaaren ajassa O(1) ja käy naapurit läpi ajassa O(V). DFS matriisiesityksellä vie siksi O(V²) aikaa.',
        ],
        [
          'Kurssin verkkorajapinta',
          'Pääesimerkit käyttävät pakettia `fi.uef.cs.tra`: luo `Graph` tai `DiGraph`, lisää solmut metodilla `addVertex` ja yhdistä palautetut `Vertex`-oliot metodilla `addEdge`. Lue `vertices()`, `neighbors()` ja `edges()`; `Edge.getWeight()` palauttaa float-painon.',
        ],
        [
          'Nimi, identiteetti ja väri',
          '`getLabel()` palauttaa näyttönimen: kahdella eri Vertex-oliolla voi olla sama nimi. `getColor()` ja `setColor(...)` tallentavat läpikäynnin tilan. Alusta värit erikseen arvoon `AbstractGraph.WHITE`; GREY ja BLACK käsitellään läpikäyntitunneilla.',
        ],
        [
          'Silmukat ja sallitut syötteet',
          'Silmukka yhdistää solmun itseensä. Tämä TRA-versio sallii sen `DiGraph`-verkossa, mutta `Graph` hylkää sen. Oppitunnin esimerkeissä ei ole rinnakkaisia kaaria. Eristettykin solmu kuuluu `vertices()`-joukkoon, ja sen naapurilista on tyhjä.',
        ],
      ],
    },
    'graph-dfs': {
      cards: [
        [
          'Koko DFS-metsä',
          'Yhdestä aloitussolmusta ei välttämättä saavuteta kaikkia solmuja. Käsittele koko verkko käymällä kaikki solmut läpi ja aloittamalla DFS jokaisesta käymättömästä solmusta. Vieruslistoilla aika on O(V + E). Hyvin syvä verkko voi vaatia oman pinon rekursion sijaan.',
        ],
      ],
    },
    'graph-bfs': {
      cards: [
        [
          'Polun palauttaminen ja saavuttamattomat solmut',
          'Tallenna löydettäessä `parent[next] = v`. Seuraa vanhempia tavoitteesta taaksepäin ja käännä tulos. Saavuttamattomaan tavoitteeseen ei ole polkua. BFS minimoi kaarien määrän; samat ei-negatiiviset kaaripainot tekevät poluista myös pienimmän painosumman polkuja.',
        ],
      ],
    },
    'graph-apps': {
      cards: [
        [
          'Suunta vaikuttaa yhtenäisyyteen',
          'Tavalliset yhtenäiset komponentit koskevat suuntaamattomia verkkoja. Suunnatussa verkossa erotetaan heikko yhtenäisyys ilman suuntia ja vahva yhtenäisyys, jossa jokaisesta solmusta pääsee jokaiseen. Yksi DFS-metsä ei laske vahvasti yhtenäisiä komponentteja.',
        ],
        [
          'Koko läpikäynti ei luo polkua',
          'TRA:n parent/root-tauluissa polku alkuperäisestä alusta on vain sen oman puun solmuilla. BFS:n myöhempien juurien etäisyys säilyy arvossa -1 (taulukossa ∞), vaikka niiden oma metsäsyvyys on nolla. Seuraa DiGraphin lähteviä naapureita: saavutettavuus yhteen suuntaan ei takaa paluuta.',
        ],
        [
          'Vaativuus ja tuloksen tarkistus',
          'TraComponentsExample ja TraTopologicalExample käyttävät omaa naapurijärjestystä: Θ(V + E) aikaa ja O(V) lisätilaa tuloksineen ja pinoineen. Värit alustetaan joka ajossa, rakenne säilyy. Tarkista polku oikeista kaarista, komponentit kattavuudesta ja yhtenäisyydestä sekä topologinen järjestys jokaisesta u→v-ehdosta yhden tarkan listan sijaan. Yhteinen animaatio valmistelee lajitellut naapurit erikseen.',
        ],
        [
          'Muita kurssin algoritmeja',
          'Painotettujen polkujen, pienimpien virittävien puiden ja verkkoanalyysin aiheissa käsitellään Dijkstraa, Floyd–Warshallia, Primiä, Kruskalia, leikkaussolmuja, sovitusta ja maksimivirtausta.',
        ],
      ],
    },
    'java-tools': {
      cards: [
        [
          'Turvallinen poisto Iteratorilla',
          'Kutsu `next` ennen `remove`-metodia ja poista enintään kerran kutakin `next`-kutsua kohti. Kun poistat muokattavasta ArrayList-listasta läpikäynnin aikana, käytä iteraattorin omaa `remove`-metodia. Foreach on kätevä ilman rakenteellisia muutoksia.',
        ],
        [
          'Comparable, Comparator ja geneerisyys',
          '`Comparable<T>` määrittää luonnollisen järjestyksen, `Comparator<T>` vaihtoehtoisia järjestyksiä. Käytä `Integer.compare`- tai `comparingInt`-vertailua vähennyslaskun sijaan, sillä vähennys voi ylivuotaa. Rajaus `<T extends Comparable<? super T>>` mahdollistaa tyyppiturvallisen vertailun geneerisessä koodissa.',
        ],
      ],
    },
    adts: {
      title: 'Listat, pino, jono ja ADT:n sopimus',
      intro:
        'Abstrakti tietotyyppi määrittää operaatiot ja niiden merkityksen. Toteutus määrää muistinkäytön ja operaatioiden kustannukset.',
      cards: [
        [
          'Lista ja taulukko',
          'Taulukon pituus on kiinteä ja indeksihaku O(1). ArrayList tarjoaa O(1) indeksihaun, tasoitetun O(1) lisäyksen loppuun ja O(n) lisäyksen tai poiston keskeltä. LinkedList-listan indeksihaku on O(n), mutta koko iterointi O(n).',
        ],
        [
          'Pino: LIFO',
          'Käytä `Deque<T>`-rajapintaa ja ArrayDequea: `push`, `peek`, `pop`. Viimeksi lisätty alkio poistuu ensin. Tyhjän pinon `pop` heittää poikkeuksen; `pollFirst` palauttaa nullin. ArrayDeque ei salli null-alkioita.',
        ],
        [
          'Jono: FIFO',
          'Lisää toisesta päästä metodeilla `addLast`/`offerLast` ja poista toisesta metodeilla `removeFirst`/`pollFirst`. ArrayDequen päihin lisääminen on tasoitetusti O(1). BFS tarvitsee FIFO-järjestyksen; prioriteettijono valitsee poistettavan alkion toisin.',
        ],
        [
          'Valitse ensin operaatiot',
          'List säilyttää jonojärjestyksen ja toistot, Set yksikäsitteisyyden, Map avain–arvoparit ja PriorityQueue mahdollistaa tärkeimmän alkion toistuvan valinnan. Ilmoitettu rajapinta kertoo algoritmin tarpeen.',
        ],
      ],
    },
    sets: {
      title: 'Set: jäsenyys ja joukko-operaatiot Javassa',
      intro:
        'Joukko sisältää kunkin loogisen alkion enintään kerran. Valitse toteutus haku- ja järjestysvaatimusten mukaan.',
      cards: [
        [
          'add, contains, remove',
          '`add(x)` palauttaa false, jos x on jo joukossa. `contains(x)` tarkistaa jäsenyyden ja `remove(x)` poistaa alkion. HashSet ei säilytä lisäys- eikä suuruusjärjestystä. Esimerkkien TreeSet tekee vain tulostusjärjestyksestä ennustettavan.',
        ],
        [
          'Yhdiste, leikkaus ja erotus',
          'A ∪ B sisältää kummankin joukon alkiot, A ∩ B yhteiset alkiot ja A \\ B vain A:han kuuluvat. Kopioi A muokattavaan HashSet-joukkoon ennen `addAll`-, `retainAll`- tai `removeAll`-kutsua, jotta alkuperäinen säilyy.',
        ],
        [
          'Järjestetyt joukot',
          'TreeSet tukee kyselyjä `floor`, `ceiling` ja `subSet`. Vertailija määrää yksikäsitteisyyden: pelkkä pituusvertailu pitää samanpituisia merkkijonoja samana arvona. Lisää tasatilanteen ratkaiseva vertailu, jos niiden pitää säilyä erillisinä.',
        ],
        [
          'Tavalliset virheet',
          '`Set.of` on muuttumaton eikä salli toistuvia argumentteja tai nulleja. `new HashSet<>(collection)` luo muokattavan joukon ja poistaa toistot. Käytä loogiseen yhtäsuuruuteen `equals`-metodia ja pidä hajautusavaimen identiteettikentät vakaina.',
        ],
      ],
    },
    maps: {
      title: 'Map: avaimet, arvot ja frekvenssien laskeminen',
      intro:
        'Map liittää kuhunkin erilliseen avaimeen yhden arvon. Usealla avaimella voi olla sama arvo.',
      cards: [
        [
          'Perusoperaatiot',
          '`put` lisää avain–arvoparin tai korvaa avaimen vanhan arvon. `get` lukee arvon ja `containsKey` tarkistaa avaimen olemassaolon. Nulleja sallivassa rakenteessa `get(key) == null` ei erota puuttuvaa avainta avaimeen liitetystä null-arvosta.',
        ],
        [
          'Laskeminen ja ryhmittely',
          'Laske frekvenssejä metodeilla `getOrDefault(key, 0)` tai `merge(key, 1, Integer::sum)`. `computeIfAbsent` sopii listan tai joukon luomiseen kullekin avaimelle, kuten vieruskartassa.',
        ],
        [
          'Läpikäynti entrySetillä',
          'Käytä `entrySet()`-näkymää, kun tarvitset sekä avaimen että arvon. Jos tarvitset vain toisen, käytä `keySet()`- tai `values()`-näkymää. HashMapin järjestystä ei määritellä; TreeMap järjestää avaimet ja LinkedHashMap säilyttää oletuksena lisäysjärjestyksen.',
        ],
        [
          'Map ja verkot',
          'TRA tallentaa solmut ja kaaret. Käytä `Map<Vertex, Integer>`-rakennetta lisälaskureille tai etäisyyksille ja `Map<Vertex, Vertex>`-rakennetta vanhemmille. `IdentityHashMap` erottaa eri solmuoliot, vaikka niiden nimet olisivat samat. Ajettava TRA-esimerkki laskee lähtevät naapurit; Map tallentaa verkon lisätiedot.',
        ],
      ],
    },
    'shortest-paths': {
      title: 'Dijkstra ja Floyd–Warshall',
      intro:
        'Käytä TRA:n oikeita Graph/DiGraph-, Vertex- ja Edge-olioita. Lyhin polku minimoi painosumman: Dijkstra yhdestä alusta, Floyd–Warshall kaikille pareille. BFS sopii, kun kaikkien kaarien painot ovat samat ja ei-negatiiviset.',
      cards: [
        [
          'Dijkstra: ei-negatiiviset painot',
          'Tarkista jokainen Edge-paino, myös saavuttamattomista osista: sen on oltava äärellinen ja ei-negatiivinen. Poimi pienin nykyinen etäisyys ja paranna etäisyyksiä lähteviä kaaria pitkin. TraDijkstraExample-esimerkissä A→B maksaa 10, mutta A→C→B maksaa 1 + 2 = 3; jatko B→D antaa 4. Negatiivinen paino rikkoo tämän metodin syötesopimuksen.',
        ],
        [
          'Prioriteetin päivitys TRA PriorityQueuella',
          'Tuo fi.uef.cs.tra.PriorityQueue ja käytä kapasiteetin ja vertailijan ottavaa konstruktoria. Lisää parannuksesta uusi muuttumaton (Vertex, distance) -tietue; ohita poistettu tietue, jos sen tallennettu etäisyys on vanhentunut. Vanhat B:10 ja D:9 eivät käynnistä uutta kaarien tutkimista. Tämä toteutus vie O(V + E log(E + 1)) aikaa ja O(V + E) lisätilaa. Jonossa olevan Vertex-kentän muuttaminen ei korjaa kekoa; decrease-key-operaatiota ei oleteta.',
        ],
        [
          'Floyd–Warshall: matriisi TRA-graafista',
          'Käy vertices(), anna ulkoiset identiteettipohjaiset indeksit ja kopioi lähtevien Edge-kaarien painot matriisiin. Diagonaalilla on nolla, puuttuvalla kaarella +∞. Kokeile kullakin välisolmulla k summaa d[i][k] + d[k][j]: k uloimpana, kaikki i/j mukana. TraFloydWarshallExample-esimerkissä A→B→C maksaa 5 − 2 = 3 ja voittaa suoran painon 10. Aika O(V³ + E), lisätila O(V²).',
        ],
        [
          'Negatiiviset kaaret ja syklit',
          'Floyd sallii äärelliset negatiiviset painot. Negatiivinen diagonaali paljastaa negatiivisen syklin; matemaattisesti äärellinen lyhin etäisyys puuttuu vain pareilta, joiden reitti voi kulkea tällaisen syklin kautta. Tämä esimerkki hylkää tarkoituksella koko tuloksen, jos missä tahansa, myös erillisessä osassa, on negatiivinen sykli. C→A painolla −4 sulkee syklin, jonka summa on −1. Negatiivinen suuntaamaton kaarikin sallii painon rajattoman pienentämisen edestakaisin kulkemalla. Hylkäyksessä ei palauteta osittaista matriisia tai polkua.',
        ],
        [
          'Äärettömyys ja oikeat polut',
          'Saavuttamaton etäisyys on Double.POSITIVE_INFINITY, tulosteessa INF, ja polku on tyhjä. Ohita äärettömät osapolut ennen Floyd-etäisyyksien yhteenlaskua. Dijkstra tallentaa vanhemmat, Floyd seuraavan askeleen matriisin. Käytä result.pathTo(target) tai result.path(from, to). Polku solmusta itseensä on [vertex], nolla kaarta. Vieraat kyselysolmut hylätään. Yhtä halvat polut voivat erota: tarkista kaaret ja summa yhden tarkan listan sijaan.',
        ],
        [
          'Painot, identiteetti ja laskenta',
          'Lue Edge.getWeight(), ei Vertex.getWeight(). Kirjoita addEdge(v, 5.0f): kokonaisluku toisena argumenttina valitsee TRA:ssa värin. Esimerkit tarkistavat äärelliset float-painot ja laskevat summat doublena; NaN ja molemmat äärettömyydet hylätään syötteestä. Laskenta on likimääräistä: 0.1f ei ole tarkka desimaalikymmenesosa. Opetuspainot ovat pieniä ja tarkasti esitettävissä. Molemmat algoritmit säilyttävät värit, nimiöt, Vertex.index-kentän ja rakenteen; samat nimet ovat eri olioita.',
        ],
      ],
    },
    mst: {
      title: 'Pienimmät virittävät puut: Prim ja Kruskal',
      intro:
        'Käytä TRA:n suuntaamatonta Graphia ja oikeita Edge-painoja. Yhtenäisestä syötteestä saadaan pienin virittävä puu, epäyhtenäisestä pienin virittävä metsä, yksi puu komponenttia kohti.',
      cards: [
        [
          'Prim',
          'Aloita saavuttamattomasta Vertexistä ja lisää sen rajakaaret TRA PriorityQueueen. Poimi kevyin kaari saavuttamattomaan päähän. Ohita jonokaari, kun molemmat päät on jo saavutettu. Jonon tyhjennyttyä aloita toisesta saavuttamattomasta solmusta. Edge.getEndPoint() ei aina ole uusi solmu: Graphissa ei ole nuolen suuntaa.',
        ],
        [
          'Kruskal ja union–find',
          'Kopioi Graph.edges(), joka luettelee jokaisen fyysisen suuntaamattoman Edge-kaaren kerran. Lajittele painon mukaan ja hyväksy kaari vain, kun union–find yhdistää eri joukot; muuten syntyisi sykli. Poluntiivistys ja rankin mukainen yhdistäminen muuttavat vain omia taulukoita. IdentityHashMap liittää oikeat Vertex-oliot ulkoisiin joukkoindekseihin ja säilyttää nimet sekä Vertex.index-kentän.',
        ],
        [
          'Puu, metsä ja eristetyt solmut',
          'Tuloksessa ovat vertices(), edges(), components() ja totalWeight(). V solmun ja C yhtenäisen komponentin virittävässä metsässä on V − C kaarta. Eristetty solmu on komponentti ilman valittuja kaaria. Tyhjä syöte antaa C = 0 ja painon 0; yksi solmu antaa C = 1 ja kaarettoman puun. isSpanningTree() on tosi vain epätyhjälle yhtenäiselle syötteelle.',
        ],
        [
          'Lue esimerkki',
          'A—B:1, B—C:2, A—C:5, C—D:1 antavat kolmen kaaren puun, jonka paino on 4. Lisää eristetty E ja F—G:-2: molemmat algoritmit palauttavat kolmen komponentin ja neljän kaaren metsän, paino 2. Negatiiviset kaaret sallitaan, koska metsä valitsee kaaret ilman syklejä; tehtävässä ei toisteta kulkuja etäisyyden pienentämiseksi.',
        ],
        [
          'MST ja lyhimpien polkujen puu',
          'Graafissa A—B:2, A—C:2, B—C:1 pienin virittävä puu painaa 3. A:sta alkava lyhimpien polkujen puu käyttää A—B:tä ja A—C:tä, yhteispaino 4, joten molemmat etäisyydet ovat 2. MST:n A-polku toiseen kohteeseen painaa 3. Tavoitteet eroavat: minimoi valittujen kaarien kokonaissumma tai etäisyydet yhdestä alusta.',
        ],
        [
          'Painot, tasatilanteet ja vaativuus',
          'Äärelliset negatiiviset ja nollapainot sallitaan; NaN ja molemmat äärettömyydet hylätään myös toisessa komponentissa. Yhtäsuuret painot voivat antaa eri minimimetsiä: Prim ja Kruskal eivät välttämättä valitse samoja kaaria tai järjestystä. Float-painot summataan doublena, laskenta on likimääräistä. Molemmat vievät O(V + E log(E + 1)) aikaa ja O(V + E) lisätilaa olettaen identiteettikuvauksen/-joukon odotetut O(1)-operaatiot. Tulos säilyttää oikeat Edge-viitteet vain luettavissa listoissa; graafin kentät säilyvät ja painot pysyvät samoina ajon aikana.',
        ],
      ],
    },
    'graph-analysis': {
      title: 'Syklit, yhtenäisyys, leikkaukset, sovitus ja virtaus',
      intro:
        'Tutki leikkauksia, suurinta kaksijakoista sovitusta ja virtausta oikeilla TRA-solmuilla ja -kaarilla. Algoritmien omat kuvaukset, osajako ja jäännöstietueet säilyttävät syötegraafin.',
      cards: [
        [
          'Suunnatut syklit ja topologinen järjestys',
          'Käytä valkoista käymättömille, harmaata aktiivisille ja mustaa valmiille solmuille. Kaari harmaaseen solmuun on paluukaari ja todistaa syklin. Käänteinen POST-järjestys on topologinen vain DAG:ssa; ajettava esimerkki hylkää syklit.',
        ],
        [
          'Kaariluokat ja vahva yhtenäisyys',
          'DFS erottaa puu-, paluu-, etenemis- ja ristikkäiskaaret. PRE/POST-ajat auttavat erottamaan jälkeläiset muista valmiista solmuista. Vahvan yhtenäisyyden tarkistamiseksi kaikkien solmujen on oltava saavutettavissa samasta alusta sekä verkossa että käänteisverkossa. Kaikkien vahvojen komponenttien löytäminen vaatii oman SCC-algoritmin.',
        ],
        [
          'Leikkaussolmut ja sillat',
          'TraGraphCutsExample ottaa Graphin ja käy DFS:llä kaikki komponentit. tin laskee vain saapumiset. low[v] on pienin tin, johon päästään alas DFS-alipuuta ja sitten enintään yhdellä ei-vanhempipaluukaarella. Lapsen palattua välitä low[child]; käydystä naapurista käytä tin[neighbour], ei sen low-arvoa. Muu kuin juuri v on leikkaussolmu, kun low[child] >= tin[v]; puukaari on silta, kun low[child] > tin[v]. Painot eivät vaikuta. Odotettu O(V + E) aika, O(V) lisätila.',
        ],
        [
          'Juuren lapset ja fyysinen vanhempikaari',
          'Ohita käänteisessä naapuruussuunnassa vain sama vanhempi-Edge. Juuri on leikkaussolmu vain vähintään kahdella DFS-lapsella, ei vain kahdella naapurilla. Kolmiossa 0–1–2, hännässä 1–3–4 ja eristetyssä 5:ssä juurella 0 on kaksi naapuria mutta yksi DFS-lapsi: leikkaussolmut 1/3, sillat 1–3/3–4. Tulos palauttaa oikeat Vertex/Edge-oliot. Tyhjyys ja epäyhtenäisyys tuetaan.',
        ],
        [
          'Kaksijakoinen verkko ja sovitus',
          'Anna Graph ja lista vasemman puolen eri syötesolmuista; oikea puoli on loput, myös eristetyt solmut. Jokaisen kaaren on ylitettävä jako tai syöte hylätään. Osajakoa ei löydetä automaattisesti. Vuorotteleva polku voi vaihtaa parit: L0 siirtyy R0:sta R1:een, jotta L1 saa R0:n. Jokainen vasen juuri tarvitsee uuden seen-tilan. Suurin tarkoittaa suurinta parimäärää; maksimaaliseen ei vain voi lisätä yhtä kaarta muuttamatta vanhoja pareja. Painot ohitetaan.',
        ],
        [
          'Maksimivirtaus ja jäännöskaaret',
          'TraMaxFlowExample ottaa DiGraphin ja eri syötesolmuina lähteen/nielun. TRA LinkedQueue -BFS löytää kasvattavan jäännöspolun; lisää pullonkaulan verran virtausta. Kunkin alkuperäisen Edgen virtaus pysyy nollan ja kapasiteetin välissä, välisolmuissa virtaus säilyy. Kun nielua ei saavuteta jäännösverkossa, saavutettu lähdepuoli määrittää minimileikkauksen. Palautetaan Edge-virtaukset ja leikkauskaaret/-kapasiteetti: esimerkin arvo 5 vastaa leikkauskapasiteettia 5.',
        ],
        [
          'Peruutus ei ole syötteen vastakkainen kaari',
          'Kukin fyysinen syöte-Edge saa oman eteenpäin/peruutusparin yksityisiin jäännöslistoihin. Oikeat vastakkaiset syötekaaret pysyvät erillisinä. Uudelleenreitityksessä BFS käyttää ensin s→a→x→t, sitten s→b→x→a→y→t: x→a peruu aiemman a→x-varauksen, vaikka x→a puuttuu DiGraphista. Lopullinen virtaus on 2, a→x:n virtaus 0. Syötekaaret, painot ja värit säilyvät.',
        ],
        [
          'Kapasiteetit, kyselyt ja vaativuus',
          'Virtaus lukee tallennetut float-Edge-painot kapasiteetteina: vain äärelliset kokonaisluvut [0, 1 000 000 000], myös saavuttamattomista osista. Kirjoita addEdge(v, 3.0f): kokonaislukuargumentti valitsee värin. Murto-, negatiiviset, ei-äärelliset ja ylisuuret arvot hylätään pyöristämättä; tarkistetut kapasiteetit/virtaukset käyttävät tarkkaa long-laskentaa ylivuototarkistuksin. Odotetut rajat: sovitus O(V + E + L·E) aika/O(V) tila, L = vasemman puolen koko; virtaus O(V + E + V·E²) aika/O(V + E) tila. Identiteettihaku oletetaan O(1):ksi. Vieraat kyselyoliot ovat virheitä; vapaalla sovitussolmulla partner on null. Tyhjyys käy leikkauksille/sovitukselle, mutta virtaus tarvitsee kaksi eri solmua. Vain luettavat tuloslistat viittaavat syöteolioihin.',
        ],
      ],
    },
    strategies: {
      title: 'Algoritmistrategiat ja tasoitettu aikavaativuus',
      intro:
        'Strategia ehdottaa tapaa rakentaa algoritmi. Oikeellisuus ja vaativuus on silti perusteltava kullekin ongelmalle erikseen.',
      cards: [
        [
          'Ahne valinta',
          'Valitse paras tämänhetkinen vaihtoehto, mutta todista valinnan turvallisuus. Kolikoilla 1, 3 ja 4 summalle 6 ahne menetelmä valitsee 4+1+1, vaikka optimi on 3+3. Dijkstralla ei-negatiivisilla painoilla ja virittävien puiden algoritmeilla on tarvittava perustelu.',
        ],
        [
          'Hajota ja hallitse',
          'Jaa ongelma, ratkaise osaongelmat ja yhdistä tulokset. Lomitusjärjestäminen on pääesimerkki. Samojen päällekkäisten osaongelmien toistuva ratkaiseminen voi tehdä naiivista rekursiosta kallista.',
        ],
        [
          'Dynaaminen ohjelmointi',
          'Tallenna päällekkäisten osaongelmien tulokset: muistava rekursio etenee ylhäältä alas, taulukointi riippuvuusjärjestyksessä alhaalta ylös. Kolikkoesimerkin aika on O(summa × kolikkolajien määrä) ja tila O(summa); mahdoton summa tunnistetaan.',
        ],
        [
          'Tasoitettu kustannus',
          'Analysoi koko operaatiosarja. Yksittäinen ArrayList-lisäys voi vaatia O(n) työtä koon kasvaessa, mutta n lisäystä vie yhteensä O(n) työtä: tasoitetusti O(1) lisäystä kohti. Kyse ei ole satunnaisten syötteiden jakaumasta.',
        ],
        [
          'Haun rajoittaminen',
          'Muista paras kokonainen ratkaisu ja karsi haara vain, kun kelvollinen raja todistaa, ettei se voi parantaa tulosta. Nykykustannuksen perusteella karsiminen on vaarallista, jos myöhemmät negatiiviset kaaret voivat pienentää kustannusta.',
        ],
        [
          'Satunnaistetut algoritmit',
          'Las Vegas tuottaa aina oikean tuloksen, mutta aika vaihtelee; Monte Carlo voi sallia rajatun virhetodennäköisyyden. Heuristiikka voi löytää hyödyllisiä ratkaisuja takaamatta optimaalisuutta. Toistettujen yritysten on aidosti käytettävä erilaisia valintoja.',
        ],
      ],
    },
    'string-matching': {
      title: 'Tarkka ja likimääräinen merkkijonohaku',
      intro:
        'Olkoon n tekstin ja m hakusanan pituus. Moniste vertaa eri tapoja hyödyntää aiempien vertailujen tietoa.',
      cards: [
        [
          'Naiivi haku ja Rabin–Karp',
          'Naiivi haku kokeilee jokaista kohtaa ja vie pahimmillaan O(nm) aikaa. Rabin–Karp päivittää liukuvaa hajautusarvoa ajassa O(1) siirtoa kohti. Hajautusosuma on tarkistettava merkeistä; törmäykset voivat aiheuttaa O(nm) pahimman tapauksen.',
        ],
        [
          'Automaatit ja Boyer–Moore',
          'Äärellinen automaatti koodaa täsmänneen alkuosan ja lukee tekstin kerran esikäsittelyn jälkeen. Boyer–Moore vertailee hakusanan lopusta ja ohittaa kohtia poikkeama- ja loppuosatiedon avulla. Esikäsittely ja aakkosto-oletukset vaikuttavat vaativuusväitteisiin.',
        ],
        [
          'Trie, loppuosapuu ja loppuosataulukko',
          'Trie indeksoi merkkijonojoukon alkuosien avulla. Loppuosapuu tai loppuosataulukko indeksoi tekstin loppuosat toistuvia osajonohakuja varten. Tässä nämä esitellään käsitteinä; Java-esimerkki toteuttaa naiivin haun, Rabin–Karpin ja likimääräisen haun.',
        ],
        [
          'Likimääräinen osajonohaku',
          'Dynaaminen ohjelmointi sallii lisäykset, poistot ja korvaukset. Aseta `D[0][j] = 0`, jotta osuma voi alkaa mistä tahansa tekstin kohdasta, ja `D[i][0] = i`. Viimeinen rivi kertoo muokkausetäisyydet kussakin kohdassa päättyviin osajonoihin. Tämä eroaa kahden kokonaisen merkkijonon vertailusta. Esimerkki palauttaa UTF-16-indeksit osumien jälkeisiin kohtiin.',
        ],
      ],
    },
    'external-memory': {
      title: 'Tiedostot, ulkoinen lomitus ja B-puut',
      intro:
        'Kun aineisto ei mahdu keskusmuistiin, laske myös lohkosiirrot ja erilliset haut CPU-operaatioiden lisäksi.',
      cards: [
        [
          'Lohkot, puskurointi ja paikallisuus',
          'Peräkkäiset luvut ja kirjoitukset vähentävät erillisiä hakuja. Puskuroi tietueita lohkoiksi; hajasaanti voi hallita kokonaisaikaa. Välimuistit vaikuttavat myös keskusmuistissa. Vuoden 2025 monisteen laiteajat ovat havainnollistavia, eivät yleisiä suorituskykytakuita.',
        ],
        [
          'Ulkoinen lomitusjärjestäminen',
          'Luo keskusmuistiin mahtuvia järjestettyjä jaksoja ja lomita niitä kierroksittain. Esimerkki lomittaa kaksi valmiiksi järjestettyä tiedostoa virtana; se ei ole kokonainen ulkoinen järjestäjä. Täysi toteutus tarvitsee myös jaksojen luonnin ja seuraavien lomituskierrosten hallinnan.',
        ],
        [
          'Vakiomittaiset tietueet',
          'Hajasaantitiedoston tavukohta on `headerBytes + index × recordBytes`. Käytä long-laskentaa, erota tietueindeksi tavuosoitteesta ja sulje tiedosto. Esimerkki luo ja poistaa oman väliaikaistiedostonsa.',
        ],
        [
          'Tiedostot kokoelmina',
          'Sarjatiedosto sopii läpikäyntiin. Järjestetty tiedosto sallii puolitushaun, mutta lisäykset ovat kalliita. Hajautus tukee suoraa hakua ilman avainjärjestystä. Ensisijaiset ja toissijaiset indeksit tarjoavat eri hakureittejä; vakiomittaisen osoituksen kaava ei sovellu suoraan vaihtelevanpituisiin tekstiriveihin.',
        ],
        [
          'B-puu ja B+ puu',
          'B-puun solmussa on useita järjestettyjä avaimia ja paljon lapsia; kaikki lehdet ovat samalla syvyydellä. Täyden solmun jakaminen pitää puun matalana ja vähentää lohkohakuja. B+ puussa tiedot ovat lehdissä ja sisäsolmut ohjaavat hakua. Tässä selitetään rakenne ilman levyä käyttävää B-puutoteutusta.',
        ],
      ],
    },
  },
  examples: {
    binarySearch: [
      'Puolitushaku',
      'Kokonainen haku, myös puuttuva arvo ja tyhjä taulukko.',
      'Järjestetty int-taulukko; O(log n) aikaa ja O(1) lisätilaa.',
    ],
    sortedUnion: [
      'Yhdiste kahdella iteraattorilla',
      'Käsittelee tyhjät listat, toistot ja molemmat loppuosat ilman järjestämistä tai Set/Map-rakenteita.',
      'Järjestetyt kokonaisluvut ilman nulleja; O(n + m) aikaa ja tulostilaa.',
    ],
    setOperations: [
      'HashSet-operaatiot',
      'Kopio ennen muutosta säilyttää alkuperäisen A:n. TreeSet tekee tulostuksesta määrätyn.',
      'Odotusarvoisesti O(n + m) näille hajautusjoukko-operaatioille; tulostuksen järjestäminen O(k log k).',
    ],
    orderedCollections: [
      'TreeSet ja TreeMap',
      'Aluehaut ja avainjärjestys; pelkkä pituusvertailu yhdistää tarkoituksella kaksi eri merkkijonoa.',
      'Peruslisäys ja -haku O(log n); alueen luettelu riippuu myös tuloksen koosta.',
    ],
    mapFrequency: [
      'Laskeminen HashMapilla',
      'Laskee toistuvat sanat, antaa oletusarvon, korvaa arvon ja käy avain–arvoparit läpi.',
      'Odotusarvoisesti O(n) hyvin jakautuvilla hajautusarvoilla; järjestetty tulostus lisää O(k log k).',
    ],
    equality: [
      'Olion identiteetti Set- ja Map-rakenteissa',
      'Kaksi Student-oliota samalla muuttumattomalla id:llä ovat samat nimestä riippumatta.',
      'equals/hashCode käyttävät samoja identiteettikenttiä; hajautustörmäyksiä voi tapahtua.',
    ],
    listDeque: [
      'Iterator, pino ja jono',
      'Poistaa parilliset luvut turvallisesti ja vertaa LIFO- ja FIFO-järjestystä, myös tyhjää poll-kutsua.',
      'Läpikäynti O(n); ArrayDequen päätyoperaatiot tasoitetusti O(1).',
    ],
    treeTraversal: [
      'Kolme puun läpikäyntijärjestystä',
      'Yksi rekursio kirjaa PRE-, IN- ja POST-järjestykset kolmessa käsittelykohdassa.',
      'O(n) aikaa, O(h) rekursiopinoa sekä tuloslistat.',
    ],
    priorityQueue: [
      'PriorityQueue ja Comparator',
      'Järjestää tehtävät prioriteetin ja id:n mukaan ja poistaa ne poll-metodilla iteroinnin sijaan.',
      'peek O(1); offer/poll O(log n).',
    ],
    mergeSort: [
      'Kokonainen lomitusjärjestäminen',
      'Rekursiivinen jako ja vakaa lomitus uudelleenkäytettävällä puskurilla.',
      'O(n log n) aikaa, O(n) puskuri ja O(log n) rekursiopino.',
    ],
    graphRepresentation: [
      'Verkko Map- ja Set-rakenteista',
      'Geneerinen suunnattu verkko, erilliset solmut, ulkoinen solmutieto ja solmun poisto.',
      'Kaaren lisäys odotusarvoisesti O(1); solmun poisto käy muiden solmujen naapurijoukot läpi.',
    ],
    dfs: [
      'DFS kaikkien komponenttien yli',
      'PRE ja POST verkolle, jossa on erillinen solmu; ulkosilmukka aloittaa DFS-metsän.',
      'Vieruslistat: O(V + E) aikaa ja O(V) työtilaa.',
    ],
    bfs: [
      'BFS ja polun palauttaminen',
      'Tallentaa etäisyydet ja vanhemmat; saavuttamattomaan kohteeseen palautetaan tyhjä polku.',
      'Painoton verkko; O(V + E) aikaa ja O(V) työtilaa.',
    ],
    components: [
      'Suuntaamattoman verkon komponentit',
      'Löytää kaksi yhdistettyä paria ja yhden erillisen solmun.',
      'Symmetriset vieruslistat; O(V + E) aikaa ja O(V) työtilaa.',
    ],
    topological: [
      'Syklin tunnistus ja topologinen järjestys',
      'Kolme DFS-väriä hylkää syklin; käänteinen POST järjestää DAG:n.',
      'O(V + E) aikaa ja O(V) työtilaa.',
    ],
    javaTools: [
      'Comparable, Comparator ja geneerinen metodi',
      'Luonnollinen nimijärjestys, vaihtoehtoinen pistejärjestys ja tyyppiturvallinen maksimi.',
      'Järjestäminen O(n log n); maksimi O(n).',
    ],
    dijkstra: [
      'Dijkstra ja vanhentuneet jonotietueet',
      'Muuttumattomat jonotietueet sallivat etäisyyksien parantamisen rikkomatta kekoa.',
      'Ei-negatiiviset int-painot; O(V + E log(E + 1)) aikaa ja O(V + E) työtilaa.',
    ],
    floyd: [
      'Floyd–Warshall',
      'Kaikkien parien etäisyydet, negatiivinen kaari, äärettömyyden käsittely ja negatiivisen syklin tunnistus.',
      'O(V³) aikaa, O(V²) tilaa; äärellisen syötepainon itseisarvo < INF / max(1, V).',
    ],
    mst: [
      'Prim ja Kruskal',
      'Molemmat palauttavat saman puupainon; Kruskal käyttää union–findia. Epäyhtenäinen syöte hylätään.',
      'Suuntaamaton verkko; O(V + E log(E + 1)) aikaa ja O(V + E) tilaa.',
    ],
    cuts: [
      'Leikkaussolmut ja sillat',
      'DFS:n löytö- ja low-arvot erottavat syklin hauraista yhteyksistä.',
      'Yksinkertainen suuntaamaton verkko symmetrisillä listoilla; O(V + E) läpikäynti sekä tulostuksen järjestäminen.',
    ],
    matching: [
      'Suurin kaksijakoinen sovitus',
      'Kasvattava polku siirtää aiemman parin, jotta toiselle vasemman puolen solmulle löytyy pari.',
      'Valmiiksi tunnetut puolet; O(L × (R + E)) aikaa ja O(L + R) työtilaa.',
    ],
    flow: [
      'Maksimivirtaus BFS:llä',
      'Päivittää eteen- ja taaksepäin kulkevat jäännöskapasiteetit ja palauttaa kokonaisvirtauksen.',
      'Ei-negatiiviset kokonaiskapasiteetit, lähde ≠ nielu; O(V² + VE²) aikaa ja O(V²) tilaa.',
    ],
    coinChange: [
      'Pienin kolikkomäärä dynaamisesti',
      'Löytää summalle 6 ratkaisun 3+3, tunnistaa mahdottoman summan ja käsittelee nollan.',
      'Positiiviset kolikkoarvot; O(S × C) aikaa ja O(S) tilaa summalle S ja C kolikkolajille.',
    ],
    strings: [
      'Kolme merkkijonohakua',
      'Naiivi haku, tarkistettu liukuva hajautus sekä muokkausetäisyyden osajonojen loppukohdat.',
      'Naiivi/Rabin–Karp pahimmillaan O(nm); likimääräinen haku O(nm) aikaa ja tilaa.',
    ],
    records: [
      'RandomAccessFile-tietueet',
      'Kirjoittaa lukumääräotsakkeen ja kolme int-tietuetta ja lukee tietueen 1 sen tavuosoitteesta.',
      'Vakiomittaiset 4 tavun tietueet; suora haku yhdellä seek- ja lukuoperaatiolla.',
    ],
    externalMerge: [
      'Kahden järjestetyn tiedoston lomitus',
      'Lomittaa järjestetyt jaksot virtoina lukijoilla ja kirjoittajalla. Väliaikaistiedostot siivotaan.',
      'O(n + m) peräkkäisiä operaatioita ja rajatut puskurit; jaksojen luonti ei sisälly.',
    ],
  },
}
