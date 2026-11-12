import supplement from './handout.fi.js'
import { extendDictionary } from './extend.js'
import { sortingTranslations } from './sorting.js'
import { complexityQuizTranslations } from './complexityQuiz.js'
import { heapTranslations } from './heap.js'

const base = {
  heap: heapTranslations.fi,
  complexityQuiz: complexityQuizTranslations.fi,
  sorting: sortingTranslations.fi,
  ui: {
    language: 'Kieli', topics: 'Aiheet', examples: 'React- ja Java-esimerkit',
    footer: 'Tekijä:',
    courseCredit: 'Perustuu UEF:n Tietorakenteet ja algoritmit II -kurssin materiaaleihin.',
    description: 'DSA2 Visual Lab — opi tietorakenteita ja algoritmeja vuorovaikutteisesti',
    back: '← Takaisin', next: 'Seuraava askel →', forward: 'Eteenpäin →', reset: 'Aloita alusta',
    play: '▶ Käynnistä', pause: 'Tauko', step: 'Askel', result: 'Tulos',
    start: 'Aloitussolmu', speed: 'Nopeus', empty: 'tyhjä', order: 'Järjestys',
    graph: 'Vuorovaikutteinen verkko', tree: 'Binääripuun läpikäynti',
    idle: 'ei käyty', visited: 'käyty', current: 'nykyinen',
    dfsStack: 'DFS: kutsupino', bfsQueue: 'BFS: jono',
    dfsHint: 'PRE = saavutaan solmuun. POST = solmun koko alipuu tai haara on käsitelty ja palataan takaisin.',
    bfsHint: 'Painottomassa verkossa BFS:n ensimmäisenä löytämä etäisyys on jo lyhin kaarien määrällä mitattuna.',
    adjacency: 'Näytä verkon vieruslista',
    root: 'Juuri', left: 'Vasen alipuu', right: 'Oikea alipuu',
    inputN: 'Aseta n =', name: 'Nimi', example: 'Esimerkki', operations: 'Operaatioita, kun n=',
    complexityHint: 'Iso O ei kerro operaatioiden tarkkaa määrää. Luvut havainnollistavat, kuinka nopeasti algoritmin työmäärä kasvaa.',
    algorithm: 'Algoritmi', average: 'Keskimäärin', idea: 'Idea',
    goDfs: 'Tutki syvyyshakua →', goBfs: 'Tutki leveyshakua →',
  },
  groups: ['Perusteet', 'Lineaariset rakenteet', 'Puut', 'Algoritmit', 'Verkot', 'Java'],
  topics: [
    ['DSA2-oppimiskartta', 'Mitä opiskella ja miksi'],
    ['Aikavaativuus', 'O(1), O(log n), O(n), O(n log n), O(n²)'],
    ['Järjestetyt listat', 'Kaksi osoitinta, yhdiste ilman sort/set/map-operaatioita'],
    ['Set, Map ja hajautus', 'equals/hashCode, yksikäsitteisyys, haku'],
    ['Puut ja läpikäynnit', 'Esijärjestys, sisäjärjestys, jälkijärjestys'],
    ['Keko ja PriorityQueue', 'Minimi/maksimi, lisäys, poisto'],
    ['Lajittelualgoritmit', 'Kupla-, lisäys-, lomitus- ja pikalajittelu'],
    ['Verkkojen perusteet', 'Solmut, kaaret, vieruslista'],
    ['DFS + pre/post', 'Syvyys, rekursio, pino, saapuminen ja poistuminen'],
    ['BFS', 'Leveys, jono, lyhimmät polut painottomassa verkossa'],
    ['Verkko-ongelmat', 'Komponentit, syklit, topologinen järjestys'],
    ['DSA2:n Java-työkalut', 'Iterator, Comparable, Comparator, geneerisyys'],
  ],
  roadmap: [
    ['Aikavaativuus', 'Opi tunnistamaan silmukoiden ja operaatioiden kustannus.'],
    ['Lineaariset rakenteet', 'Kaksi osoitinta, listat, joukot ja hakurakenteet.'],
    ['Puut', 'Rekursio ja kolme keskeistä läpikäyntijärjestystä.'],
    ['Lajittelu', 'Miksi eri menetelmillä on eri aikavaativuus.'],
    ['Verkot', 'Verkon esitys, DFS, BFS ja niiden sovellukset.'],
  ],
  pages: {
    overview: {
      title: 'Ymmärrä algoritmi ulkoa opettelun sijaan',
      intro: 'Sivusto toimii oppimiskarttana: ensin idea, sitten visualisointi, lopuksi Java-koodi ja tavalliset virheet.',
      cards: [
        ['Kurssin keskeinen ajatus', 'Tietorakenne vastaa kysymykseen ”miten tieto tallennetaan?”, algoritmi kysymykseen ”miten tieto käydään läpi, löydetään tai muutetaan?” ja aikavaativuusanalyysi kysymykseen ”miten työmäärä kasvaa n:n mukana?”.'],
        ['Erityinen painopiste: verkot', 'Harjoittele algoritmin suorittamista mielessäsi: missä olet, mitkä solmut on löydetty tai käyty, mitä pinossa tai jonossa on ja milloin PRE- ja POST-tapahtumat syntyvät.'],
      ],
    },
    complexity: {
      title: 'Aikavaativuus', intro: 'Vertaa sekuntien sijaan sitä, kuinka nopeasti algoritmin työmäärä kasvaa syötteen koon mukana.',
      cards: [['Silmukoiden tulkitseminen', [
        'Yksi täysi silmukka n alkion yli → yleensä O(n).',
        'Kaksi erillistä peräkkäistä silmukkaa → O(n + n) = O(n).',
        'Sisäkkäiset silmukat, n × n kierrosta → O(n²).',
        'Ongelman koko puolittuu joka askeleella → O(log n).',
      ]]],
    },
    'sorted-lists': {
      title: 'Järjestetyt listat ja kaksi osoitinta', intro: 'Kun molemmat listat ovat jo järjestyksessä, kulje niitä vasemmalta oikealle. Tulosta ei tarvitse järjestää uudelleen.',
      cards: [
        ['Kahden järjestetyn listan yhdiste', 'Idea muistuttaa lomitusjärjestämisen lomitusvaihetta. Vertaa listojen nykyisiä alkioita ja siirrä vain pienemmän arvon osoitinta. Jos arvot ovat samat, lisää arvo kerran ja siirrä molempia osoittimia.'],
        ['Aikavaativuus', 'O(n + m), koska kumpikin osoitin liikkuu vain eteenpäin.'],
        ['Miksi while käyttää ehtoa &&', 'Pääsilmukka jatkuu, kun molemmissa listoissa on vielä nykyinen alkio. Ehto `||` voi viedä toisen indeksin listan ulkopuolelle. Lisää pääsilmukan jälkeen jäljellä olevan listan loppuosa.'],
      ],
    },
    'sets-maps': {
      title: 'Set, Map ja hajautus', intro: 'Hajautusrakenteet mahdollistavat nopean haun, mutta edellyttävät olioiden yhtäsuuruuden oikeaa määrittelyä.',
      cards: [
        ['Set', 'Tallentaa kunkin alkion vain kerran. Sopii ”onko tämä jo nähty?” -tarkistuksiin, kuten verkon `visited`-joukoksi.'],
        ['Map', 'Liittää avaimeen arvon: `vertex → distance`, `vertex → parent`, `id → object`.'],
        ['equals() ja hashCode()', 'Jos oliot ovat samat `equals`-vertailun perusteella, niillä on oltava sama `hashCode`. Muuten HashSet/HashMap voi toimia virheellisesti.'],
      ],
    },
    trees: {
      title: 'Esi-, sisä- ja jälkijärjestys', intro: 'Ero on siinä, milloin nykyinen solmu käsitellään suhteessa sen lapsiin.',
      cards: [
        ['PRE', 'Juuri → Vasen alipuu → Oikea alipuu. Käsittele solmu heti saapuessasi.'],
        ['IN', 'Vasen alipuu → Juuri → Oikea alipuu. Binäärihakupuussa avaimet saadaan nousevassa järjestyksessä.'],
        ['POST', 'Vasen alipuu → Oikea alipuu → Juuri. Käsittele solmu vasta lasten jälkeen.'],
      ],
    },
    heap: {
      title: 'Keko ja PriorityQueue', intro: 'Keko takaa nopean pääsyn tärkeimpään alkioon pitämättä kaikkia alkioita täysin järjestettyinä.',
      cards: [
        ['Minimikeko', 'Jokaisen vanhemman arvo on ≤ sen lasten arvot. Minimi on juuressa ja saadaan ajassa O(1). Lisäys ja juuren poisto vaativat O(log n) työtä kekoehdon palauttamiseksi.'],
        ['Milloin sitä tarvitaan', 'Prioriteettijonot, Dijkstran algoritmi sekä seuraavan minimin tai maksimin valinta järjestämättä kaikkea.'],
      ],
    },
    sorting: {
      title: 'Lajittelualgoritmit', intro: 'Valitse yksi neljästä algoritmista ja seuraa lajittelua askel kerrallaan tai automaattisesti. Kaikki aloittavat samasta taulukosta, joten niiden toimintaa on helppo verrata.', cards: [],
    },
    'graph-basics': {
      title: 'Mikä on verkko?', intro: 'Verkko koostuu solmuista ja niiden välisistä kaarista. Olennaista on solmujen naapuruusrakenne.',
      cards: [
        ['Suuntaamaton verkko', 'Kaari A—B tarkoittaa, että A on B:n naapuri ja B on A:n naapuri.'],
        ['Suunnattu verkko', 'Kaarella A→B on suunta. Vastakkaiseen suuntaan ei välttämättä ole yhteyttä.'],
        ['Vieruslista', 'Harvoille verkoille tämä on yleensä vierusmatriisia kätevämpi: tallennetaan vain olemassa olevat kaaret.'],
      ],
    },
    'graph-dfs': {
      title: 'DFS: syvyyshaku + PRE/POST', intro: 'Syvyyshaku etenee mahdollisimman syvälle ja peruuttaa sitten takaisin. Rekursiiviset kutsut muodostavat pinon.',
      cards: [
        ['PRE- ja POST-tapahtumien ydinajatus', '`PRE(v)` tapahtuu kerran, kun solmuun `v` saavutaan ensimmäisen kerran. Sitten DFS käy sen naapurit läpi. `POST(v)` tapahtuu vasta, kun solmusta `v` ei enää ole tutkimattomia haaroja.'],
        ['Rekursion hahmottaminen', 'Jokainen aktiivinen `dfs(v)`-kutsu on pinossa. Kun `dfs(w)` kutsutaan, `dfs(v)` jää odottamaan. Kun `w` valmistuu, algoritmi palaa solmuun `v` ja jatkaa seuraavaan naapuriin.'],
      ],
    },
    'graph-bfs': {
      title: 'BFS: leveyshaku', intro: 'Leveyshaku etenee kerroksittain: ensin etäisyys 0, sitten kaikki etäisyyden 1 solmut, sitten etäisyys 2 ja niin edelleen.',
      cards: [['Miksi visited asetetaan jo jonoon lisättäessä', 'Jos odotetaan jonosta poistamiseen asti, usea naapuri voi lisätä saman solmun jonoon. Merkitse solmu löydetyksi heti lisäyksen yhteydessä.']],
    },
    'graph-apps': {
      title: 'DFS:n ja BFS:n sovelluksia', intro: 'Moni ongelma helpottuu, kun ymmärrät itse läpikäynnin.',
      cards: [
        ['Yhtenäiset komponentit', 'Aloita DFS/BFS solmusta, jossa ei ole käyty. Kaikki sen saavuttamat solmut muodostavat yhden komponentin. Toista toisesta käymättömästä solmusta.'],
        ['Lyhin polku painottomassa verkossa', 'Käytä BFS:ää sekä `parent`- ja `distance`-tietoja. Kun tavoite saavutetaan, rakenna polku seuraamalla parent-linkkejä taaksepäin.'],
        ['Syklin tunnistus', 'Suuntaamattomassa verkossa DFS:n on erotettava vanhempaan palaava kaari kaaresta toiseen jo käytyyn solmuun.'],
        ['Topologinen järjestys', 'Vain suunnatuille syklittömille verkoille (DAG). Kerää DFS:n solmut POST-järjestyksessä ja käännä tulos.'],
      ],
    },
    'java-tools': {
      title: 'DSA2:ssa usein tarvittavat Java-työkalut', intro: 'Nämä työkalut helpottavat tietorakenteiden toteuttamista ja käyttöä.',
      cards: [
        ['Iterator', 'Käy kokoelma läpi tuntematta sen sisäistä toteutusta.'],
        ['Comparable', 'Olio määrittelee oman luonnollisen järjestyksensä `compareTo`-metodilla.'],
        ['Comparator', 'Ulkoinen vertailustrategia mahdollistaa saman tyypin järjestämisen eri tavoilla.'],
        ['Geneerisyys', '`List<T>`, `Graph<V>` ja omat tietorakenteet toimivat tyyppiturvallisesti eri tyyppien kanssa.'],
      ],
    },
  },
  complexityRows: [
    ['O(1)', 'Vakio', 'ArrayList-alkion haku indeksillä'],
    ['O(log n)', 'Logaritminen', 'Puolitushaku'],
    ['O(n)', 'Lineaarinen', 'Listan yksi läpikäynti'],
    ['O(n log n)', 'Lineaaris-logaritminen', 'Lomitusjärjestäminen'],
    ['O(n²)', 'Neliöllinen', 'Kaksi sisäkkäistä silmukkaa'],
  ],
  sortingIdeas: ['Vaihda vierekkäiset alkiot', 'Lisää järjestettyyn alkuosaan', 'Jaa ja lomita', 'Valitse jakoalkio ja osita'],
  messages: {
    dfsEnter: 'Saavutaan solmuun {v}. Tämä on PRE-tapahtuma: solmu löydetään ennen naapurien läpikäyntiä.',
    dfsSkip: 'Solmussa {next} on jo käyty — ohitetaan kaari {v}–{next}.',
    dfsEdge: 'Tarkastellaan solmusta {v} naapuria {next}. Siinä ei ole vielä käyty — jatketaan syvemmälle.',
    dfsExit: 'Solmun {v} kaikki naapurit on käsitelty. Tämä on POST-tapahtuma: poistutaan solmusta {v}.',
    bfsStart: 'Merkitään {start} käydyksi heti, kun se lisätään jonoon.',
    bfsDequeue: 'Poistetaan {v} jonon alusta. Tarkastellaan nyt sen kaikkia naapureita.',
    bfsSkip: 'Solmu {next} on jo löydetty — sitä ei lisätä jonoon uudelleen.',
    bfsEnqueue: 'Löydetään {next} solmusta {v}: etäisyys = {distance}. Lisätään {next} jonon loppuun.',
    sortStart: 'Alkuperäinen taulukko.', sortCompare: 'Verrataan arvoja {a} ja {b}.',
    sortSwap: 'Vasen alkio on suurempi — vaihdetaan alkiot keskenään.', sortDone: 'Valmis: taulukko on järjestetty.',
    treePre: 'PRE: kirjataan {v} heti solmuun saavuttaessa.',
    treeIn: 'IN: solmun {v} vasen alipuu on käsitelty. Kirjataan {v} ja siirrytään oikealle.',
    treePost: 'POST: solmun {v} molemmat alipuut on käsitelty. Kirjataan {v} vasta nyt.',
  },
  code: { post: 'POST: kaikki naapurit on käsitelty', takeA: 'ota a', takeB: 'ota b', takeOnce: 'ota kerran' },
}

export default extendDictionary(base, supplement)
