// Datos con texto · English (en): feed de unratito (src/data/feed.js) y móvil (src/data/phoneNews.js), por id.
// Secciones: feed: { hint, videos: { <id>: {…} } } · phone: { apps, notifications: { <id>: {…} }, policies: { <id>: {…} }, poll, policyHeadline }.
// Lo que falte queda en español. Ver src/i18n/README.md.
// Las funciones reciben (state, ctx) igual que en phoneNews.js; las utilidades de texto se repiten aquí
// para no importar módulos de datos desde la capa de idioma.

const handle = (name = '') => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const tag = (party = '') => party.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '');
const lower = (text = '') => (text ? text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, '') : '');
const fmt = n => (Math.round(n * 10) / 10).toFixed(1);

export default {
  feed: {
    hint: {
      swipe: 'Swipe',
      keys: 'Wheel, drag, S or Space',
      end: 'No more videos. Just this.',
    },
    videos: {
      trend: {
        caption: 'Day three rehearsing the trend. My mum has come in twice for the mop and knows the steps better than I do.',
        tags: ['trend', 'dancechallenge', 'rehearsal47', 'foryou'],
        sound: 'original sound · Street Party Remix (kitchen version)',
        sticker: 'POV: the dance needs 40 m² and the flat is 38',
        likes: '1.2M',
        comments: '8,431',
        shares: '22.9K',
        alt: 'A girl with a ponytail dances a trend in front of a ring light in a tiny kitchen, with her mum’s mop in the background.',
      },
      abuelo: {
        caption: 'My grandad found out the waterslide at the council pool is free for pensioners. He’s done 37 runs. He hasn’t let go of the newspaper.',
        tags: ['grandad', 'councilpool', 'activeretirement', 'socksandsandals'],
        sound: 'original sound · Beach Bar Pasodoble',
        sticker: 'Run no. 37. Not a hair out of place.',
        likes: '3.4M',
        comments: '41.7K',
        shares: '210K',
        alt: 'An older man with sunglasses, a moustache and socks with sandals slides down a giant waterslide on an inflatable ring, reading the newspaper with total seriousness, and drops into the pool.',
      },
      sixseven: {
        caption: 'Our maths teacher said “open your books at page 67” and lost the class forever. It’s been like this since Tuesday.',
        tags: ['67', 'sixseven', 'mathsclass', 'sorrymiss'],
        sound: 'original sound · six seven (sped up)',
        likes: '6.7M',
        comments: '67K',
        shares: '67K',
        alt: 'A kid with a backwards cap does the “6 7” gesture, moving his upturned palms up and down in front of a blackboard that says “p. 67”.',
      },
      news: {
        tag: 'BREAKING',
        title: ['Election', 'incoming.'],
        body: 'The Government has dissolved Parliament and called a general election. The usual parties are already filming videos in shirtsleeves.',
        caption: 'Top comment · @maripuri_63: “Again? I’ve still got the leaflets from the last one in my letterbox.”',
        tags: ['election', 'breaking', 'notagain'],
        sound: 'original sound · Breaking News Jingle',
        likes: '48.2K',
        comments: '3,104',
        shares: '9,870',
        aside: 'You’ve spent twenty minutes on “just one more”. And now this.',
        cta: '“Well, I’ve got a proposal”',
        alt: 'Breaking news: the parliament building with a ballot box and envelopes dropping into it. The Government dissolves Parliament and calls a general election.',
      },
    },
  },

  phone: {
    apps: {
      press: { label: 'The Neighbourhood Echo' },
      social: { label: 'unratito' },
      group: { label: 'This Is Serious' },
      neighbors: { label: 'Building 3 Neighbours' },
    },

    notifications: {
      // ---------------------------------------------------------------- antes de nada
      'start-news': { from: 'The Neighbourhood Echo', title: 'General election: the neighbourhood votes again',
        text: 'Parliament dissolved. At the market, the debate is what’s worse: another campaign or the price of eggs. The campaign wins, narrowly.' },
      'start-dani': { from: 'Dani',
        text: 'Have you seen the election news? Someone in this group should stand. Not me, I’ve got four jobs and not one contract.' },

      // ---------------------------------------------------------------- capítulo 1
      'phone-lola': { from: 'Lola',
        text: 'Just read “right then, I’m standing”. Tell me it’s a joke. I’ve opened a spreadsheet in case it isn’t.' },
      'call-lola-treasury': { from: 'Lola',
        text: 'State of the accounts: 43 euros, a pizza voucher and an invoice for everything. If we make the news, let it be for being boring.' },
      'call-lola-strategy': { from: 'Lola',
        text: 'I’ve done a SWOT. Weaknesses: us. Threats: also us. Strengths: I have felt-tips.' },
      'call-nico': { from: 'Nico',
        text: state => state.team?.nico?.job === 'Actos' ? 'First event confirmed: finding an event. Second event: chairs.' : 'Map of the neighbourhood with drawing pins: done. One pin left over and nobody knows which building it’s for.' },
      'register-press': { from: 'The Neighbourhood Echo', title: (s, { party }) => `“${party}” is born`,
        text: (s, { party }) => `A new party has registered in the neighbourhood. At the counter they asked whether “${party}” was a residents’ association. The founder’s answer: “Technically, also yes”.` },
      'register-tech': { from: (s, { rivals }) => `@${handle(rivals.tech.name)}`,
        text: (s, { rivals, party }) => `Welcome, “${party}”. When you want to manage something bigger than a stairwell, I’ll send you a chart. It goes up. It’s good. #${tag(rivals.tech.party)}` },
      'leave-neighbors': { from: 'Encarni (1st A)',
        text: 'Heads up: the one from the second floor has come down with a folder and a speech face. Either they’re standing for something or selling encyclopaedias.' },

      // ---------------------------------------------------------------- capítulo 2 · la plaza
      'neighbor-listened': { from: 'Marisa (haberdashery)',
        text: 'I told them at the greengrocer’s there’s one who listens before talking. They laughed, but they wrote your name down.' },
      'neighbor-both': { from: 'Marisa (haberdashery)',
        text: 'I hear you promised shade and parking at the same time. Paco wants to know if you can promise him a waiter too.' },
      'neighbor-spectacle': { from: '@square_live',
        text: 'Candidate putting on a show in the square: 34 views, 30 from their mum. The other four, Dani’s mum. #neighbourhood' },
      'program-press': { from: 'The Neighbourhood Echo', title: (s, { party }) => `“${party}” picks a proposal (just the one)`,
        text: (s, { proposal }) => proposal ? `“${proposal.title}”. What it costs, in their own words: ${lower(proposal.compromise)}. First time anyone has said so before polling day.` : 'Proposal presented. Cost included, oddly enough.' },
      'program-populist': { from: (s, { rivals }) => `@${handle(rivals.populist.name)}`,
        text: (s, { rivals }) => `What the new party is proposing, we proposed first. And the opposite, too. Only fools never change their minds. #${tag(rivals.populist.party)}` },
      'speech-coherent': { from: 'The Neighbourhood Echo', title: 'A speech with small print… read out loud',
        text: 'In the square, they said what their proposal costs and who it annoys. One resident clapped. Then looked around in case they were the only one. They weren’t.' },
      'speech-everything': { from: '@neighbourhood_clips',
        text: '“Everything for everyone!” Viral clip. Top comment: “And who pays?”. Most-liked reply: “Your cousin”.' },
      'speech-mixed': { from: '@neighbourhood_clips',
        text: 'Speech in the square: started with one proposal and finished with another. The lot at the bar have started a sweepstake on the third.' },
      'aftermath-dani': { from: 'Dani',
        text: s => s.reach >= 15 ? 'Stats: loads of people saw us. Two understood the proposal. It’s a start.' : 'Reach stats: your auntie, my auntie and a bot that sells sunglasses. We need more aunties.' },

      // ---------------------------------------------------------------- capítulo 3 · la sede
      'hq-accounts': { from: 'Lola',
        text: 'Accounts posted on the front-room door. One man read them all the way through. It was the gas-bottle delivery man, but it counts.' },
      'hq-street': { from: 'Nico',
        text: 'Street plan: every building, a doorbell. Every doorbell, a man who voted in 1982 and tells you all about it.' },
      'hq-content': { from: 'Dani',
        text: 'Content calendar ready: Monday proposal, Tuesday meme, Wednesday apologise for the meme.' },
      'hq-tenants': { from: 'Building 5 Assembly',
        text: 'Thanks for coming to the tenants’ meeting. You’re the first candidate who’s stayed until any other business.' },

      // ---------------------------------------------------------------- capítulo 4 · vídeo
      'video-explain': { from: '@unratito_trending',
        text: 'Video explaining a proposal with figures and no epic music. The algorithm doesn’t know what to do with it, so it’s showing it just in case.' },
      'video-chairs': { from: '@unratito_trending',
        text: 'The chair dance: number one trend in the neighbourhood. The proposal doesn’t appear, but the chairs look gorgeous.' },
      'video-neighbor': { from: 'Marisa (haberdashery)',
        text: 'Three people stopped me in the street about the video. One to vote for you and two to get their trousers taken up.' },
      'video-debunk': { from: 'The Neighbourhood Echo', title: 'Candidate debunks a hoax with… facts',
        text: 'The doctored clip said they wanted to ban pavement terraces. The reply video is one minute long and doesn’t shout. People are discussing it as a curiosity.' },
      'video-viral-score': { from: 'Dani',
        text: 'The video’s rhythm: nailed. My mum shared it in four groups and one was the church one.' },

      // ---------------------------------------------------------------- capítulo 5 · crisis
      'crisis-admit': { from: 'The Neighbourhood Echo', title: 'Politician admits a mistake. Experts urge calm',
        text: 'They admitted getting it wrong and explained how they’ll fix it. The pundits hadn’t prepared for that option and had to improvise.' },
      'crisis-team': { from: 'Lola',
        text: 'Team press conference: everyone said their bit and for once we were all saying the same thing. I’ve made a note in case it never happens again.' },
      'crisis-distract': { from: '@neighbourhood_clips',
        text: 'Nobody’s talking about the contradiction any more. Everybody’s talking about the dog in sunglasses from the new video. Mission accomplished, right?' },
      'crisis-blame': { from: 'Paco (bar)',
        text: 'You say it’s the algorithm’s fault and “the usual lot”. Round here at the bar, the usual lot is us, just so you know.' },

      // ---------------------------------------------------------------- capítulo 5 · debate
      'debate-tradeoff': { from: 'The Neighbourhood Echo', title: 'The debate in one line: “this costs this”',
        text: (s, { rivals }) => `${rivals.tech.name} asked for “a figure”. He got one. Party sources confirm they are studying it with a view to repealing it.` },
      'debate-attack': { from: '@debate_live',
        text: (s, { rivals }) => `${rivals.populist.name} gets owned with her own old quotes. Applause, memes and not one proposal. The neighbourhood had a whale of a time.` },
      'debate-manage': { from: 'The Neighbourhood Echo', title: '“Year two of what?”: the question that silenced the hall',
        text: (s, { rivals }) => `${rivals.tech.name} promised tax cuts “from year two”. Asked year two of what, he asked for water.` },
      'debate-promise': { from: '@debate_live',
        text: (s, { rivals }) => `Promising to halve rents “by decree”. ${rivals.populist.name} has already asked for your speechwriter’s number.` },
      'debate-duel': { from: 'Nico',
        text: 'Your debate comebacks: ten out of ten. My nan says you didn’t look nervous. Neither did she, and she watched the whole thing.' },

      // ---------------------------------------------------------------- capítulo 6 · última vuelta y mitin
      'prep-poll': { from: 'The Neighbourhood Echo', title: 'Neighbourhood poll: it’s tightening',
        text: (s, { poll }) => poll?.player ? (poll.winning ? `Your Cousin Polling puts “${poll.player.party}” ahead of ${poll.leader.party}. Margin of error: whatever it takes.` : `${poll.leader.party} is still ahead; “${poll.player.party}” trails by ${fmt(Math.max(0.1, poll.leader.share - poll.player.share))} points. Undecided: the usual lot, more than ever.`) : 'Poll published. Undecided: the usual lot.' },
      'prep-listen': { from: 'Marisa (haberdashery)',
        text: 'The lady at the bus stop says you’re the only one who asked her about the bus instead of her vote. She’s going to vote. For the bus.' },
      'prep-receipts': { from: 'Lola',
        text: 'A3 budget up in the square. A lady read it with her reading glasses on and said “now that’s more like it”. No idea which part.' },
      'prep-volunteers': { from: 'Nico',
        text: 'Volunteers per polling station: covered. Sandwiches: covered. The napkin map: with an oil stain right where polling station 3 should be.' },
      'final-account': { from: 'The Neighbourhood Echo', title: 'Campaign close with no coaches',
        text: 'Folding chairs, a punctured balloon and a speech that repeated the same proposal as on day one. In a campaign, that’s practically eccentric.' },
      'final-viral': { from: '@neighbourhood_clips',
        text: 'The rally’s closing line already has a remix. Nobody knows what the rally was about, but the remix is three hours long.' },
      'final-everything': { from: 'Lola',
        text: '“Everything for everyone, by decree.” I hid my face behind the budget. Literally. I’ve got ink on my nose.' },
      reflection: { from: 'Encarni (1st A)',
        text: 'Day of reflection. Reminder: no campaigning in the group. That said, everyone out tomorrow to vote for the one on the second floor.' },
      'election-won': { from: 'The Neighbourhood Echo', title: (s, { party }) => `“${party}” wins the neighbourhood`,
        text: 'Count night with folding chairs. The rivals have already announced they are “doing some soul-searching”, which in their language means a new logo.' },
      'election-lost': { from: 'The Neighbourhood Echo', title: 'Election night: the neighbourhood thinks it over',
        text: 'The new party doesn’t make it this time. Its team stacks the chairs and announces it’s standing at the next one. They mean it. Paco has already set the chairs aside.' },
    },

    policies: {
      // tech
      'tech-derogar': { topic: 'Manifesto', text: 'Repeal “everything before”. Whatever replaces it will be presented at a later phase.' },
      'tech-rent': { topic: 'Rent', text: 'Scrap rent caps so “the market can calm down on its own”. While it calms down, a committee.' },
      'tech-tourism': { topic: 'Tourism', text: 'Holiday-let licences through a one-stop shop. It opens one day a year and you need an appointment for the appointment.' },
      'tech-health': { topic: 'Health', text: 'End waiting lists by renaming them: they are now “patience pathways”.' },
      'tech-taxes': { topic: 'Tax', text: 'Tax cuts from year two, if the inheritance allows. The year is not specified.' },
      'tech-jobs': { topic: 'Jobs', text: 'Youth employment plan: unpaid internships on the campaign itself, with a certificate in “management”.' },
      // populist
      'pop-observatory': { topic: 'Housing', text: 'A rent observatory to observe, in great detail, how rents keep going up.' },
      'pop-transport': { topic: 'Transport', text: 'Free commuter trains for everyone, paid for by “those at the top”. Still to be announced: who they are.' },
      'pop-rent': { topic: 'Rent', text: 'Cap rents at half. If that fails, cap the cap. If that fails too, a cap observatory.' },
      'pop-health': { topic: 'Health', text: 'One ministry per waiting list. The list of ministries will also have a waiting list.' },
      'pop-pensions': { topic: 'Cost of living', text: 'Raise pensions and wages and cut every tax at the same time. The calculator is in for repairs.' },
      'pop-uturn': { topic: 'Manifesto', text: 'Defend the opposite of what she said in the debate, which is now exactly what the neighbourhood needs.' },
      // hard
      'hard-roundabout': { topic: 'Planning', text: 'Reconquer the roundabout on the industrial estate, occupied for years by roadworks.' },
      'hard-kiosks': { topic: 'Spending', text: 'Shut down every cushy publicly funded “beach bar”, except the real one on the beach, which is tradition and has a terrace.' },
      'hard-heat': { topic: 'Heat', text: 'Common sense against the heat: deny it by decree and hand out fans with flags on.' },
      'hard-horse': { topic: 'Crime', text: 'A horse for every neighbourhood. Councils pay for the feed, “no apologies”.' },
      'hard-housing': { topic: 'Housing', text: '“The solution to housing is getting married sooner.” Where the couple lives will be explained another day.' },
      'hard-agenda': { topic: 'Manifesto', text: 'Repeal the 2030 Agenda without reading it, just in case. And the 2031 calendar while we’re at it.' },
    },

    poll: {
      pollster: 'Your Cousin Polling',
      method: 'Neighbourhood survey: 400 interviews in the bread queue. Margin of error: whatever it takes.',
      noParty: 'You haven’t registered a party yet. Nobody in the bread queue is asking about you.',
      undecided: 'Undecided',
      threshold: 'Threshold to win',
    },

    policyHeadline: (rival, policy) => `${rival.party} proposes (${policy.topic.toLowerCase()})`,
  },
};
