# Lisää graafiesimerkkejä TRA-kirjastolla — JDK 11+

Nämä ovat valmiita ajettavia esimerkkejä kurssin paketilla `fi.uef.cs.tra`. Ne täydentävät sivuston aiempaa 31 esimerkkiä, jotka toimivat ilman ulkoisia Java-kirjastoja.

Pura ZIP. Pidä kolme `.java`-tiedostoa ja `traj.jar` samassa kansiossa. Avaa pääte tässä kansiossa ja suorita mikä tahansa esimerkki:

```bash
java -Dfile.encoding=UTF-8 -cp traj.jar TraGraphExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraDfsExample.java
java -Dfile.encoding=UTF-8 -cp traj.jar TraBfsExample.java
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
