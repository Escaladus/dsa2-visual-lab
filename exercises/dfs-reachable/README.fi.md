# Tehtävä 1: montako solmua on saavutettavissa?

Kirjoita tiedostoon `Solution.java` yksi rekursiivinen DFS-metodi:

```java
public static int reachableCount(Vertex start)
```

Palauta niiden **eri solmujen lukumäärä, joihin pääsee start-solmusta kaarten suuntaan**. Laske myös start mukaan. Eri solmuilla voi olla sama nimiö: laske solmut, älä eri nimiöitä.

## Esimerkki

Suunnatut kaaret: `0→1, 0→2, 1→3, 2→3`. Solmu `4` on eristetty.

- Aloitus `0`: vastaus **4**. Solmu `3` lasketaan vain kerran, vaikka siihen johtaa kaksi polkua. Solmuun `4` ei pääse.
- Aloitus `3`: vastaus **1**, koska lähteviä kaaria ei ole.

## Ehdot

- `start` ei ole null. Graafi on pieni, suunnattu ja painottamaton. Siinä voi olla syklejä ja silmukoita, mutta ei rinnakkaisia kaaria.
- Tarkistin luo graafin ja asettaa kaikkien solmujen väriksi `AbstractGraph.WHITE` ennen metodin kutsua. Älä alusta värejä uudelleen rekursiivisissa kutsuissa.
- Merkitse löydetyt solmut värillä `AbstractGraph.GREY` tai `AbstractGraph.BLACK`. Jätä saavuttamattomat WHITE-väriin. Tässä tehtävässä riittää vierailumerkintä; täydellistä kolmen värin käsittelyä ei vaadita.
- Käytä rekursiivista DFS:ää. Voit lisätä apumetodeja. Älä muuta solmuja tai kaaria. Nimiöt eivät välttämättä ole yksilöllisiä.
- Palauta kokonaisluku. Tarkistus lukee palautusarvon, ei konsolitulostusta. Naapurijärjestys ei vaikuta vastaukseen.

## Suoritus ja tarkistus

Tarvitset **JDK 11:n tai uudemman**. Pura ZIP ensin. Avaa pääte **kansiossa `dfs-reachable`**, jossa `Check.java`, `GraphChecks.java`, `Solution.java` ja `traj.jar` ovat rinnakkain.

```bash
java -Dfile.encoding=UTF-8 Check.java fi
```

Muut palautekielet: `java -Dfile.encoding=UTF-8 Check.java en` ja `java -Dfile.encoding=UTF-8 Check.java ru`.

Muokkaa vain `Solution.java`, tallenna ja suorita sama komento uudelleen. Aloituspohja heittää tarkoituksella TODO-poikkeuksen: ensimmäinen ajo varmistaa ympäristön toiminnan ja kertoo, ettei ratkaisua ole vielä tehty. Tulokset eivät estä uusia yrityksiä. Aloita tyhjästä palauttamalla alkuperäinen `Solution.java` ZIP-paketista.

Tarkistin kääntää tallennetun ratkaisun mukana tulevan JARin kanssa. Tarkistusryhmiä on 10: eristetty aloitus, ketju, haarautuminen, sykli, epäyhtenäisyys, kaarten suunta, kaksi polkua samaan solmuun, silmukka, samat nimiöt sekä 30 toistettavaa lisägraafia. Jokainen ryhmä saa oman prosessin, 5 sekuntia sekä rajatun keon ja pinon. Käännösvirhe, poikkeus, aikaraja, väärä lukumäärä, väärät värit ja graafin muuttaminen selitetään erikseen. Väliaikaiset käännöstiedostot poistetaan; vanhaa ratkaisua ei ajeta käännösvirheen jälkeen.

IDE:ssä lisää `traj.jar` kirjastoksi, muokkaa `Solution.java` ja suorita `Check.main`. Aseta tehtäväkansio työhakemistoksi.

## Tarvittavat kirjastometodit

Käytä pakettia `fi.uef.cs.tra.*`, älä vanhaa pakettia `fi.joensuu.cs.tra`, joka on myös tässä JARissa.

```java
vertex.neighbors()                    // lähtevät naapurit, Iterable<Vertex>
vertex.getColor()                     // nykyinen väri
vertex.setColor(AbstractGraph.GREY)    // tämän solmun merkintä
```

Mukana oleva `traj.jar` on muuttamaton. SHA-256: `589c64b49dd8fa77fa1fb9f99d252bf475c180be437a70d81208f4e9f70f3423`.
Dokumentaatio löytyy myös JARista: `javadoc/fi/uef/cs/tra/`.

## Ratkaisun jälkeen

Perustele merkinnän ajankohta, pysähtyminen syklissä ja miksi samaan solmuun johtavat polut eivät aiheuta moninkertaista laskentaa. Esitä aika saavutettavien solmujen määrän R ja tutkittujen lähtevien naapuruusmerkintöjen A_R avulla. Arvioi rekursiopinon enimmäiskoko. Tarkistin luo graafin ja alustaa WHITE-värit ennen metodiasi.

Testit vahvistavat palautusarvon, värit ja rakenteen säilymisen rajallisilla esimerkeillä. Ne eivät todista rekursiivisuutta, oikeellisuutta kaikilla syötteillä tai vaativuusrajaa. Rekursio tarkastetaan koodista ja vaativuus perustellaan erikseen. Aikaraja pysäyttää jumittuneen ratkaisun, eikä se ole tehokkuusmittaus.
