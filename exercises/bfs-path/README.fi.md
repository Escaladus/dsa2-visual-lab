# Tehtävä 2: BFS — etsi ja palauta lyhin polku — Java 11+

BFS-etäisyyksien jälkeen muodosta itse reitti. Kirjoita yksi metodi TRA-solmuilla, jonolla ja vanhempikartalla ja tarkista se paikallisesti.

```java
public static List<Vertex> shortestPath(Vertex start, Vertex target)
```

Palauta kaarimäärältään lyhimmän polun oikeat Vertex-oliot järjestyksessä start-solmusta target-solmuun, molemmat päät mukana. Mikä tahansa lyhin reitti hyväksytään.

Tallenna löydettäessä, mistä solmu löydettiin: sen vanhempi. Seuraa BFS:n jälkeen vanhempia kohteesta alkuun ja käännä lista. Tätä kutsutaan polun palauttamiseksi.

Kun start = 0 ja target = 3: [0, 1, 3] tai [0, 2, 3] — molemmissa on 2 kaarta. Kun target = 4, palauta []. Kun start = target = 0, palauta [0]. Numerot tarkoittavat kuvan solmuja; palauta Vertex-oliot, älä lukuja tai nimiä.

## Näin ratkaiset ja tarkistat

1. Käytä JDK 11:tä tai uudempaa. Pura ZIP ja avaa bfs-path-kansio IDE:ssä.
2. Muokkaa vain Solution.java. Korvaa TODO-poikkeus BFS:llä ja vanhempiketjusta muodostettavalla polulla. Apumetodit sallitaan.
3. Tallenna ja suorita alla oleva komento tästä kansiosta. Korjausten jälkeen suorita uudelleen; jokainen yritys alkaa alusta.

```bash
java -Dfile.encoding=UTF-8 Check.java fi
```

Muuttamaton aloituspohja kertoo, ettei ratkaisua ole vielä kirjoitettu. Toteutuksen jälkeen tarkistin näyttää läpäistyt tapaukset ja selittää virheet. Aloita alusta palauttamalla alkuperäinen Solution.java ZIPistä.

## Ehdot ja tarvittavat kirjastometodit

- start ja target eivät ole null ja kuuluvat samaan suunnattuun verkkoon. Jokainen kaari on yksi askel; syklit, silmukat ja samat nimet sallitaan. Ei rinnakkaiskaaria.
- Älä muuta verkon rakennetta tai solmujen/kaarien kenttiä. Värit voivat olla mielivaltaisia. Tallenna löytyminen ja vanhemmat omaan karttaan.
- Palauta alkuperäiset Vertex-oliot eteenpäin, molemmat päät mukana. Saavuttamaton tarkoittaa tyhjää listaa, ei null. Kun start == target, palauta [start].
- Mikä tahansa kelvollinen lyhin polku hyväksytään. Naapurijärjestys tai tasatilanne ei vaadi yhtä ennalta määrättyä listaa.

ZIP sisältää tiedostot Solution.java, Check.java, GraphChecks.java, mukana tulleen traj.jar-kirjaston sekä README-ohjeet englanniksi ja suomeksi. Mavenia tai Gradlea ei tarvitse määrittää.

## Tarvitsetko vihjeen?

### Miten vanhempi tallennetaan?

Aseta ensimmäisellä löytymisellä parent[next] = current. Karttamerkintä merkitsee myös löytymistä. Tallenna start-solmun vanhemmaksi null.

### Entä saavuttamaton kohde?

Jos target puuttuu kartasta BFS:n jälkeen, palauta tyhjä lista. Kun start on target, polku sisältää start-solmun.

### Miten reitti käännetään eteenpäin?

Lisää target, sitten sen vanhempi ja jatka alkuun/null-vanhempaan. Lista on takaperin, joten käännä se.

## Esimerkin läpikäynti: vanhemmista reitiksi

1. Yksi kelvollinen BFS löytää 1:n 0:sta ja 3:n 1:stä: parent(1)=0, parent(3)=1.
2. Lue kohteesta 3 taaksepäin: [3, 1, 0]. Solmun 0 null-vanhempi päättää ketjun.
3. Käännä listaksi [0, 1, 3]. Kolme solmua muodostaa kaksi kaarta.
4. Jos 3 löydetään 2:sta, saadaan [0, 2, 3], joka on myös oikein. Tarkistin arvioi polun ominaisuuksia eikä yhden listan vastaavuutta.

Kun löydetään R solmua ja tutkitaan A naapurimerkintää, BFS vie odotetusti O(R + A) aikaa ja O(R) lisämuistia. k solmun reitin lukeminen ja kääntäminen vie O(k) aikaa ja O(k) tulosmuistia. Syöteverkkoa ei lasketa mukaan.

## Miten tarkistin toimii

Tarkistin käyttää oikeaa traj.jaria ja --release 11 -asetusta. Kymmenen ryhmää: samat päät, saavuttamattomuus, ketju, kaksi lyhintä polkua, lyhyempi suora polku, sykli, epäyhtenäisyys, suunta, samat nimet/silmukat ja 36 kiinteän siemenen verkkoa. Tarkistetaan oikeat solmut, kaarien suunnat, päät, minimipituus ja syötteen säilyminen. Jokainen ryhmä saa uuden JVM:n ja 5 sekunnin rajan.

Virhe näyttää syötekaaret, start- ja target-arvot sekä palautetut solmunumerot, kun mahdollista. Se selittää väärän suunnan, puuttuvan kaaren, liian pitkän polun, vieraat solmut ja syötteen muutokset. Käännösvirheet näytetään erikseen; yrityksiä ei rajoiteta.

Näille syötteille hyväksytään kaikki kelvolliset lyhimmät reitit. Testit eivät todista BFS:n käyttöä tai asymptoottista vaativuutta. Perustele oikeellisuus ja vaativuus itse; aikaraja ei mittaa nopeutta.

## Vapaaehtoinen: perustele ratkaisusi

- Miksi target-solmun ensimmäinen löytyminen antaa lyhimmän kaaripolun?
- Miksi vanhemmat johtavat start-solmuun ja miksi ketju käännetään?
- Mitkä ovat BFS:n aika/muisti ja k-pituisen polun muodostamisen lisäkustannus?

Voit kirjoittaa muutaman perustelurivin Solution.java-tiedoston kommenttiin. Avaa esimerkin läpikäynti oman yrityksen jälkeen. Aiemmat etäisyys- ja DFS-tehtävät säilyvät.
