# Kokeile Javalla: BFS:n lyhimmät etäisyydet — Java 11+

Palauta Map<Vertex, Integer>, jossa on lyhin lähtökaarien määrä start-solmusta jokaiseen saavutettavaan solmuun. Lisää start etäisyydellä 0. Jätä saavuttamattomat solmut pois kartasta.

Kuvassa start = 0 → {0:0, 1:1, 2:1, 3:2}; solmu 4 puuttuu. Kun start = 3, palauta vain {3:0}. Map-alkioiden järjestys ei vaikuta.

## Näin ratkaiset ja tarkistat

1. Asenna JDK 11 tai uudempi. Pura ZIP ja avaa bfs-distances IDE:ssä.
2. Muokkaa vain Solution.java. Korvaa TODO-poikkeus jonoon perustuvalla BFS:llä; apumetodit sallitaan.
3. Tallenna, avaa pääte tähän kansioon ja suorita alla oleva komento. Suorita sama komento korjausten jälkeen.

```bash
java -Dfile.encoding=UTF-8 Check.java fi
```

Muuttamaton aloituspohja kertoo, ettei ratkaisua ole vielä kirjoitettu. Toteutuksen jälkeen tarkistin näyttää läpäistyt tapaukset ja selittää virheet. Aloita alusta palauttamalla alkuperäinen Solution.java ZIPistä.

## Ehdot ja tarvittavat kirjastometodit

- Suunnatussa painottomassa verkossa voi olla syklejä, silmukoita ja samoja nimiä, mutta ei rinnakkaiskaaria. start on kelvollinen solmu, ei null.
- Värit voivat olla mielivaltaisia. Älä käytä niitä vierailumerkkeinä äläkä muuta verkon kenttiä: tallenna löytyminen uuteen etäisyyskarttaan.
- Avaimet ovat oikeita Vertex-olioita ja arvot kokonaisia kaarietäisyyksiä. Saavuttamattomat puuttuvat; -1-merkintöjä ei hyväksytä.

ZIP sisältää tiedostot Solution.java, Check.java, GraphChecks.java, mukana tulleen traj.jar-kirjaston sekä ohjeet suomeksi, venäjäksi ja englanniksi. Mavenia tai Gradlea ei tarvitse määrittää.

## Miten tarkistin toimii

Tarkistin kääntää --release 11 -asetuksella ja alkuperäisellä traj.jarilla. Kymmenen ryhmää: erillisyys, ketju, yhteinen naapuri, sykli, epäyhtenäisyys, suunta, lyhyempi polku, silmukka, samat nimet ja 30 kiinteän siemenen verkkoa. Se tarkistaa lyhimmät etäisyydet riippumattomasti ja syötteen kenttien säilymisen. Jokainen ryhmä saa uuden JVM:n ja 5 sekunnin rajan.

Virheen yhteydessä näytetään graafi, aloitus sekä odotettu ja saatu arvo. Käännösvirheet ja pinon ylivuoto selitetään erikseen. Jokainen ajo tarkistaa uudelleen; tulokset eivät lukitse koodia.

Läpäisy ei todista BFS:n käyttöä tai ilmoitettua vaativuutta. Perustele algoritmi erikseen; aikaraja ei ole nopeusmittaus.

## Vapaaehtoinen: perustele ratkaisusi

- Miksi ensimmäinen löytyminen antaa lyhimmän kaarietäisyyden?
- Miksi solmu lisätään vain kerran myös sykleissä?
- Mitkä ovat saavutettavan osan aika ja jonon/kartan muistimäärä?

Voit kirjoittaa muutaman itsearviointirivin Solution.java-tiedoston kommenttiin. Yrityksiä ei rajoiteta; sivulla ei ole nollattavaa pistemäärää.
