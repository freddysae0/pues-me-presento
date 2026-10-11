// Datos con texto · Euskara (eu): feed de unratito (src/data/feed.js) y móvil (src/data/phoneNews.js), por id.
// Secciones: feed: { hint, videos: { <id>: {…} } } · phone: { apps, notifications: { <id>: {…} }, policies: { <id>: {…} }, poll, policyHeadline }.
// Lo que falte queda en español. Ver src/i18n/README.md.
//
// Las funciones replican las de src/data/phoneNews.js (mismas ramas). Utilidades locales para no importar
// src/i18n/index.js (evita la dependencia circular). Los @usuarios y `from` con función se dejan en la base.

const tag = (party = '') => party.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '');
const lower = (text = '') => (text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '') : '');
const fmt = n => (Math.round(n * 10) / 10).toFixed(1).replace('.', ',');

const PRESS = 'Auzoko Oihartzuna';
const MARISA = 'Marisa (mertzeria)';
const ENCARNI = 'Encarni (1. A)';

export default {
  feed: {
    hint: {
      swipe: 'Irristatu',
      keys: 'Gurpila, arrastatu, S edo Zuriunea',
      end: 'Ez dago bideo gehiagorik. Hau bakarrik.',
    },
    videos: {
      trend: {
        caption: 'Hirugarren eguna trend-a entseatzen. Ama bi aldiz sartu da fregonaren bila, eta jada nik baino hobeto dakizki pausoak.',
        tags: ['trend', 'dantzatxoa', 'entsegua47', 'zuretzat'],
        sound: 'jatorrizko soinua · Herriko Jaiak Remix (sukaldeko bertsioa)',
        sticker: 'POV: dantzak 40 m² eskatzen ditu eta pisuak 38 ditu',
        likes: '1,2 M',
        comments: '8.431',
        shares: '22,9 mila',
        alt: 'Isats-orrazkeradun neska bat trend bat dantzatzen ari da argi-uztai baten aurrean, sukalde txiki-txiki batean, atzean amaren fregona dagoela.',
      },
      abuelo: {
        caption: 'Aitonak jakin du udal igerilekuko txirristra doakoa dela erretiratuentzat. 37 jaitsiera daramatza. Ez du egunkaria askatu.',
        tags: ['aitona', 'udaligerilekua', 'erretiroaktiboa', 'galtzerdiaksandaliekin'],
        sound: 'jatorrizko soinua · Txiringitoko pasodoblea',
        sticker: '37. jaitsiera. Orrazkera ere ez zaio hautsi.',
        likes: '3,4 M',
        comments: '41,7 mila',
        shares: '210 mila',
        alt: 'Eguzkitako betaurrekoak, bibotea eta galtzerdiak sandaliekin dituen gizon heldu bat txirristra erraldoi batetik jaisten da flotagailu batean, egunkaria serio-serio irakurtzen, eta igerilekura erortzen da.',
      },
      sixseven: {
        caption: 'Matematikako irakasleak «ireki liburua 67. orrialdean» esan zuen eta betiko galdu zuen gela. Asteartetik horrela gaude.',
        tags: ['67', 'sixseven', 'matematikaeskola', 'barkatuirakasle'],
        sound: 'jatorrizko soinua · six seven (sped up)',
        likes: '6,7 M',
        comments: '67 mila',
        shares: '67 mila',
        alt: 'Txanoa atzekoz aurrera daraman mutiko bat «6 7» keinua egiten ari da, ahurrak gora begira eskuak gora eta behera mugituz, «67. or.» dioen arbel baten aurrean.',
      },
      news: {
        tag: 'AZKEN ORDUA',
        title: ['Hauteskundeak', 'datoz.'],
        body: 'Gobernuak Gorteak desegin eta hauteskunde orokorrak deitu ditu. Betiko alderdiak alkandora-mahuketan bideoak grabatzen ari dira jada.',
        caption: 'Iruzkin nabarmendua · @maripuri_63: «Berriro? Azkenekoen propaganda oraindik postontzian daukat».',
        tags: ['hauteskundeak', 'azkenordua', 'berriroere'],
        sound: 'jatorrizko soinua · Larrialdiko sintonia',
        likes: '48,2 mila',
        comments: '3.104',
        shares: '9.870',
        aside: 'Hogei minutu daramatzazu «bat gehiago eta utzi egingo diot» esaten. Eta orain, hau.',
        cta: '«Ba nik proposamen bat daukat»',
        alt: 'Azken orduko albistea: Kongresuaren eraikina, gutun-azalak erortzen zaizkion hautetsontzi batekin. Gobernuak Gorteak desegin eta hauteskunde orokorrak deitu ditu.',
      },
    },
  },

  phone: {
    apps: {
      press: { label: PRESS },
      social: { label: 'unratito' },
      group: { label: 'Hau serio doa' },
      neighbors: { label: 'Atari 3ko bizilagunak' },
    },

    notifications: {
      // ---------------------------------------------------------------- hasi aurretik
      'start-news': { from: PRESS, title: 'Hauteskunde orokorrak: auzoak berriro bozkatuko du',
        text: 'Gorteak desegin dituzte. Azokan eztabaidan ari dira zer den okerragoa: beste kanpaina bat ala arrautzen prezioa. Kanpainak irabazi du, gutxigatik.' },
      'start-dani': { text: 'Ikusi duzue hauteskundeena? Talde honetako norbait aurkeztu beharko litzateke. Ni ez, lau lan ditut eta bat bera ere ez kontraturekin.' },

      // ---------------------------------------------------------------- 1. kapitulua
      'phone-lola': { text: '«Pues me presento» irakurri berri dut. Esadazu txantxa dela. Kalkulu-orri bat ireki dut, badaezpada ere.' },
      'call-lola-treasury': { text: 'Kontuen egoera: 43 euro, pizzeria baten bonua eta gauza bakoitzaren faktura. Albistegietan ateratzen bagara, aspergarriak izateagatik izan dadila.' },
      'call-lola-strategy': { text: 'AMIA analisi bat egin dut. Ahuleziak: gu. Mehatxuak: gu ere bai. Indarguneak: errotuladoreak ditut.' },
      'call-nico': { text: state => state.team?.nico?.job === 'Actos' ? 'Lehen ekitaldia baieztatuta: ekitaldi bat aurkitzea. Bigarren ekitaldia: aulkiak.' : 'Auzoaren mapa txintxetekin eginda. Txintxeta bat soberan dago eta inork ez daki zein atarikoa den.' },
      'register-press': { from: PRESS, title: (s, { party }) => `Jaio da «${party}»`,
        text: (s, { party }) => `Alderdi berri bat erregistratu dute auzoan. Leihatilan galdetu zuten ea «${party}» auzo-elkarte bat zen. Sortzailearen erantzuna: «Teknikoki, hori ere bai».` },
      'register-tech': { text: (s, { rivals, party }) => `Ongi etorri, «${party}». Atari bat baino handiagoa den zerbait kudeatu nahi duzuenean, grafiko bat pasatuko dizuet. Gora doa. Ona da. #${tag(rivals.tech.party)}` },
      'leave-neighbors': { from: ENCARNI, text: 'Abisua: bigarrenekoa karpetarekin jaitsi da, hitzaldi bat ematera doanaren aurpegiarekin. Edo zerbaitetara aurkezten da edo entziklopediak saltzen ditu.' },

      // ---------------------------------------------------------------- 2. kapitulua · plaza
      'neighbor-listened': { from: MARISA, text: 'Frutadendan esan dut badagoela bat hitz egin aurretik entzuten duena. Barre egin dute, baina zure izena apuntatu dute.' },
      'neighbor-both': { from: MARISA, text: 'Kontatu didate itzala eta aparkalekua batera agindu zenituela. Pacok galdetzen du ea zerbitzari bat ere agin diezaiokezun.' },
      'neighbor-spectacle': { text: 'Hautagaia ikuskizuna egiten plazan: 34 ikustaldi, 30 bere amarenak. Beste lauak, Daniren amarenak. #auzoa' },
      'program-press': { from: PRESS, title: (s, { party }) => `«${party}»: proposamen bat aukeratu du (bakarra)`,
        text: (s, { proposal }) => proposal ? `«${proposal.title}». Zer kostatzen duen, haiek beraiek esanda: ${lower(proposal.compromise)}. Lehen aldia da norbaitek bozkatu aurretik kontatzen duena.` : 'Proposamena aurkeztuta. Kostua barne, gauza arraroa.' },
      'program-populist': { text: (s, { rivals }) => `Alderdi berriak proposatzen duena guk proposatu genuen lehenago. Eta kontrakoa ere bai. Zuzentzea jakintsuen kontua da. #${tag(rivals.populist.party)}` },
      'speech-coherent': { from: PRESS, title: 'Letra txikiko hitzaldi bat… ozen irakurria',
        text: 'Plazan esan zuen zer kostatzen duen bere proposamenak eta nor gogaitzen duen. Auzokide batek txalo egin zuen. Gero inguruan begiratu zuen, bakarra ote zen. Ez zen.' },
      'speech-everything': { text: '«Denetarik denontzat!» Klip birala. Iruzkin nabarmendua: «Eta nork ordaintzen du?». Like gehien dituen erantzuna: «Zure lehengusuak».' },
      'speech-mixed': { text: 'Hitzaldia plazan: proposamen batekin hasi eta beste batekin amaitu zuen. Tabernakoek porra bat egin dute hirugarrena asmatzeko.' },
      'aftermath-dani': { text: s => s.reach >= 15 ? 'Estatistikak: pila bat jendek ikusi gaitu. Bik ulertu dute proposamena. Hasiera bat da.' : 'Irismen-estatistikak: zure izeba, nire izeba eta eguzkitako betaurrekoak saltzen dituen bot bat. Izeba gehiagoren bila joan behar dugu.' },

      // ---------------------------------------------------------------- 3. kapitulua · egoitza
      'hq-accounts': { text: 'Kontuak egongelako atean argitaratuta. Gizon batek osorik irakurri ditu. Butanoarena zen, baina zenbatzen du.' },
      'hq-street': { text: 'Kale-plana: atari bakoitzeko, txirrin bat. Txirrin bakoitzeko, 1982an bozkatu zuen eta kontatu egiten dizun jaun bat.' },
      'hq-content': { text: 'Eduki-egutegia prest: astelehenean proposamena, asteartean memea, asteazkenean memeagatik barkamena eskatu.' },
      'hq-tenants': { from: 'Atari 5eko batzarra', text: 'Eskerrik asko maizterren bilerara etortzeagatik. Galde-eskeen txandara arte geratzen den lehen hautagaia zara.' },

      // ---------------------------------------------------------------- 4. kapitulua · bideoa
      'video-explain': { text: 'Proposamen bat zifrekin eta musika epikorik gabe azaltzen duen bideoa. Algoritmoak ez daki zer egin harekin eta erakutsi egiten du, badaezpada.' },
      'video-chairs': { text: 'Aulkien dantza: auzoko joera nagusia. Proposamena ez da agertzen, baina aulkiak ederrak ateratzen dira.' },
      'video-neighbor': { from: MARISA, text: 'Hiru lagunek gelditu naute kalean bideoagatik. Batek botoa emateko eta bik prakak laburtzeko.' },
      'video-debunk': { from: PRESS, title: 'Hautagai batek gezur bat gezurtatzen du… datuekin',
        text: 'Muntaketak zioen terrazak debekatu nahi zituela. Erantzun-bideoak minutu bat irauten du eta ez du oihurik egiten. Bitxikeria gisa komentatzen da.' },
      'video-viral-score': { text: 'Bideoaren erritmoa, iltzatuta. Amak lau taldetan partekatu du, eta bat parrokiakoa zen.' },

      // ---------------------------------------------------------------- 5. kapitulua · krisia
      'crisis-admit': { from: PRESS, title: 'Politikari batek akats bat onartu du. Adituek lasaitasuna eskatu dute',
        text: 'Oker ibili zela onartu eta nola konponduko duen azaldu zuen. Solasaldietako adituek ez zuten aukera hori prestatuta eta inprobisatu behar izan dute.' },
      'crisis-team': { text: 'Taldeko prentsaurrekoa: bakoitzak berea esan du eta behingoz gauza bera esaten genuen. Apuntatuta daukat, badaezpada ez bada errepikatzen.' },
      'crisis-distract': { text: 'Inork ez du jada kontraesanaz hitz egiten. Denek bideo berriko betaurrekodun txakurraz hitz egiten dute. Misioa beteta, ezta?' },
      'crisis-blame': { from: 'Paco (taberna)', text: 'Diozu errua algoritmoarena eta betikoena dela. Hemen tabernan betikoak gu gara, jakin ezazu.' },

      // ---------------------------------------------------------------- 5. kapitulua · eztabaida
      'debate-tradeoff': { from: PRESS, title: 'Eztabaida, esaldi batean: «honek hau kostatzen du»',
        text: (s, { rivals }) => `${rivals.tech.name} hautagaiak «datu bat» eskatu zuen. Eman zioten. Bere alderdiko iturriek baieztatu dute indargabetzeko aztertzen ari direla.` },
      'debate-attack': { text: (s, { rivals }) => `Zasta ${rivals.populist.name} hautagaiari hemerotekarekin. Txaloak, memeak eta proposamen bat bera ere ez. Auzoak primeran pasatu zuen.` },
      'debate-manage': { from: PRESS, title: '«Zein urtetatik?»: aretoa mutu utzi zuen galdera',
        text: (s, { rivals }) => `${rivals.tech.name} hautagaiak zergak jaistea agindu zuen «bigarren urtetik aurrera». Zein urtetatik galdetu zioten. Ura eskatu zuen.` },
      'debate-promise': { text: (s, { rivals }) => `Alokairua erdira «dekretuz» agintzea. ${rivals.populist.name} hautagaiak zure hitzaldiak idazten dituenaren telefonoa eskatu du jada.` },
      'debate-duel': { text: 'Eztabaidako erantzunak, hamarreko. Amonak dio ez zarela urduri jarri. Amona ere ez, eta osorik ikusi du.' },

      // ---------------------------------------------------------------- 6. kapitulua · azken itzulia eta mitina
      'prep-poll': { from: PRESS, title: 'Auzoko inkesta: estutzen ari da',
        text: (s, { poll }) => poll?.player ? (poll.winning ? `Zure Lehengusua Demoskopia institutuaren arabera, «${poll.player.party}» aurretik doa, eta atzetik ${poll.leader.party}. Errore-tartea: behar dena.` : `${poll.leader.party} aurretik doa oraindik; «${poll.player.party}» ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} puntura geratu da. Erabaki gabeak: betikoak, inoiz baino gehiago.`) : 'Inkesta argitaratuta. Erabaki gabeak: betikoak.' },
      'prep-listen': { from: MARISA, text: 'Busaren geltokikoak dio zu zarela botoaz galdetu beharrean autobusaz galdetu dion bakarra. Bozkatuko du. Autobusagatik.' },
      'prep-receipts': { text: 'Aurrekontua A3an plazan zintzilik. Andre batek hurbileko betaurrekoekin irakurri du eta «hau bai» esan du. Ez dakit zein zati.' },
      'prep-volunteers': { text: 'Boluntarioak hauteslekuka: beteta. Ogitartekoak: beteta. Ezpainzapiko mapa: olio-orban batekin, 3. hautesleku dagoen lekuan.' },
      'final-account': { from: PRESS, title: 'Kanpaina-itxiera autobusik gabe',
        text: 'Aulki tolesgarriak, puxika zulatu bat eta lehen eguneko proposamen bera errepikatzen zuen hitzaldi bat. Kanpainan, hori ia bitxikeria bat da.' },
      'final-viral': { text: 'Mitinaren amaierak remixa du jada. Inork ez daki zertaz zen mitina, baina remixak hiru ordu irauten du.' },
      'final-everything': { text: '«Denetarik denontzat, dekretuz». Aurpegia aurrekontuarekin estali dut. Literalki. Tinta daukat sudurrean.' },
      reflection: { from: ENCARNI, text: 'Hausnarketa-eguna. Gogorarazpena: ezin da kanpainarik egin taldean. Hori esanda, bihar denok bigarrenekoari botoa ematera.' },
      'election-won': { from: PRESS, title: (s, { party }) => `«${party}»: garaipena auzoan`,
        text: 'Zenbaketa-gaua aulki tolesgarriekin. Aurkariek iragarri dute «autokritika egiten» ari direla; haien hizkuntzan, logoa aldatzea.' },
      'election-lost': { from: PRESS, title: 'Hauteskunde-gaua: auzoak pentsatu egingo du',
        text: 'Alderdi berria ez da oraingoan iritsi. Taldeak aulkiak jaso eta hurrengoetara aurkeztuko dela iragarri du. Serio diote. Pacok aulkiak gorde ditu jada.' },
    },

    policies: {
      'tech-derogar': { topic: 'Programa', text: '«Aurreko guztia» indargabetu. Ondoren jarriko dutena geroagoko fase batean aurkeztuko da.' },
      'tech-rent': { topic: 'Alokairua', text: 'Alokairuaren mugak kendu, «merkatua bere kabuz lasai dadin». Lasaitzen den bitartean, batzorde bat.' },
      'tech-tourism': { topic: 'Turismoa', text: 'Turismo-pisuen lizentziak leihatila bakarraren bidez. Urtean egun bat irekitzen da eta hitzordurako hitzordua eskatu behar da.' },
      'tech-health': { topic: 'Osasuna', text: 'Itxaron-zerrendekin amaitu, izena aldatuta: orain «pazientzia-ibilbideak» dira.' },
      'tech-taxes': { topic: 'Zergak', text: 'Zergak jaitsi bigarren urtetik aurrera, herentziak uzten badu. Urtea ez da zehazten.' },
      'tech-jobs': { topic: 'Enplegua', text: 'Gazte-enplegurako plana: ordaindu gabeko praktikak kanpainan bertan, «kudeaketa» ziurtagiriarekin.' },
      'pop-observatory': { topic: 'Etxebizitza', text: 'Alokairuaren behatoki bat, xehetasun handiz behatzeko nola jarraitzen duen igotzen.' },
      'pop-transport': { topic: 'Garraioa', text: 'Aldiriko trenak doan denontzat, «goikoek» ordainduta. Oraindik ez dute esan nortzuk diren.' },
      'pop-rent': { topic: 'Alokairua', text: 'Alokairua erdira mugatu. Ez badu funtzionatzen, muga mugatu. Hori ere ez bada, mugaren behatoki bat.' },
      'pop-health': { topic: 'Osasuna', text: 'Ministerio bat itxaron-zerrenda bakoitzeko. Ministerioen zerrendak ere itxaron-zerrenda izango du.' },
      'pop-pensions': { topic: 'Bizitzaren kostua', text: 'Pentsioak eta soldatak igo eta zerga guztiak jaitsi, aldi berean. Kalkulagailua tailerrean dago.' },
      'pop-uturn': { topic: 'Programa', text: 'Eztabaidan esandakoaren kontrakoa defendatu, orain hori baita, hain zuzen, auzoak behar duena.' },
      'hard-roundabout': { topic: 'Hirigintza', text: 'Poligonoko biribilgunea birkonkistatu; urteak daramatza obra batzuek okupatuta.' },
      'hard-kiosks': { topic: 'Gastua', text: 'Txiringito publiko guztiak itxi, hondartzakoa izan ezik, tradizioa baita eta terraza baitu.' },
      'hard-heat': { topic: 'Beroa', text: 'Beroaren aurka, zentzu ona: dekretuz ukatu eta banderadun haizemaileak oparitu.' },
      'hard-horse': { topic: 'Segurtasuna', text: 'Zaldi bat auzo bakoitzeko. Pentsua udalek ordain dezatela, «konplexurik gabe».' },
      'hard-housing': { topic: 'Etxebizitza', text: '«Etxebizitzaren konponbidea lehenago ezkontzea da». Bikotea non biziko den beste egun batean azalduko da.' },
      'hard-agenda': { topic: 'Programa', text: '2030 Agenda indargabetu irakurri gabe, badaezpada. Eta 2031ko egutegia ere bai, jarrita gaudenez.' },
    },

    poll: {
      pollster: 'Zure Lehengusua Demoskopia',
      method: 'Auzoko inkesta: 400 elkarrizketa ogi-ilaran. Errore-tartea: behar dena.',
      noParty: 'Oraindik ez duzu alderdirik erregistratuta. Ogi-ilaran ez dizute zutaz galdetzen.',
      undecided: 'Erabaki gabeak',
      threshold: 'Irabazteko langa',
    },

    policyHeadline: (rival, policy) => `${rival.party} · proposamen berria (${policy.topic.toLowerCase()})`,
  },
};
