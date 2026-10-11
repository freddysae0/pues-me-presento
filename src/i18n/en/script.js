// Guion · English (en). Capa que se fusiona encima de src/data/script/actual.js + b.js (mismo esquema y deepMerge:
// objetos clave a clave; arrays y funciones (state, ctx) se reemplazan enteros). Lo que falte queda en español.
// Restricciones: cabecera de src/data/script/actual.js y src/i18n/README.md. Validar con: npm.cmd test
//
// Adaptación al inglés del guion efectivo (actual + b, «Sátira de argumentario»). Running gags: Dani's 7:00 talking
// points, Marisa (added to the group by mistake) translating them into plain speech, her notebook, Paco's six chairs
// and the gazpacho chant. Spanish names, places and invented parties stay; Spanish institutions get a word of context.

const PROPOSAL_DEFAULT = 'One thing, done properly, for starters.';

export default {
  // ------------------------------------------------------------------------------------------------ rivales
  rivals: {
    tech: { name: 'Fermín Aguardo', party: 'Patient Party' },
    populist: { name: 'Nuria Giro', party: 'Survive Another Election Party' },
    hard: { name: 'Covadonga del Muro', party: 'Fox' },
    moderator: 'Maite Escaleta',
  },

  foxDebate: {
    hallLine: 'I’ve left the horse double-parked. If they tow it, that’s ideology.',
    interruption: 'Excuse me! No apologies: either you let me speak or I get up and walk out. I’ve had plenty of practice walking out of governments.',
    round: {
      topic: 'Crime', role: 'hard',
      claim: 'The man who snatches handbags at the bus stop has been arrested eleven times. Eleven. And instead of judges, the Government opens an observatory. What would you do?',
      options: [
        'Make reoffending cost something: fast-track trials, and not back out the same door the same day. And judges, which cost money. We say so.',
        'Zero tolerance! And a horse for every neighbourhood!',
        'Let’s talk about the root causes. All eleven of them.',
      ],
      correct: 0,
    },
    reactions: {
      right: 'Well, well. That’s not the spineless centre-right talking. This once.',
      wrong: 'See? No apologies, faster thinking. You can borrow my horse.',
      timeout: 'While you’re thinking, hard-working early-rising Spain has already gone back to bed.',
    },
  },

  // ------------------------------------------------------------------------------------------------ menú
  menu: {
    ribbon: 'GENERAL ELECTION · TALKING POINTS INCLUDED',
    tagline: 'The other parties have advisers. You have a baker who translates.',
  },

  chapters: ['Pues me presento', 'HQ Is My Front Room', 'Down to the Street', 'Make It Go Viral', 'Taken Out of Context', 'The Final Rally'],

  // ------------------------------------------------------------------------------------------------ misiones
  missions: {
    phone: { title: 'A statement from the sofa', objective: 'Go to the phone by the sofa. Press E.' },
    call: { title: 'Round of consultations', objective: 'Use the laptop on the table to call your friends.' },
    register: { title: 'Duly constituted for all purposes', objective: 'Go to the folder on the desk and register the party.' },
    leave: { title: 'Making contact with reality', objective: 'Go out through the green door and down to the square.' },
    neighbor: { title: 'Listening exercise (a real one)', objective: 'Talk to Marisa by the bakery awning. Paco, on the bar terrace, has things to say too.' },
    program: { title: 'It won’t all fit in one decree', objective: 'Pick your first proposal on the noticeboard in the square.' },
    speech: { title: 'First public appearance, with a public', objective: 'Step up to the lectern spot and give your first speech.' },
    aftermath: { title: 'The bread queue does the analysis', objective: 'Go back to Marisa to hear what the bread queue is saying.' },
    hqBrief: { title: 'HQ is my front room', objective: 'Gather the team at the campaign table. Lola, Dani and Nico want a word too.' },
    video: { title: 'Make it go viral (with a message, ideally)', objective: 'Record a video on the mark by the bakery.' },
    crisis: { title: 'That’s not exactly what I said', objective: 'Face the crisis at the noticeboard. Might be worth hearing the team first.' },
    debate: { title: 'The community hall debate', objective: 'Join the debate with your rivals.' },
    finalPrep: { title: 'One last lap of the neighbourhood', objective: 'Choose on the map where to put your final push.' },
    finalSpeech: { title: 'The final rally, no coaches laid on', objective: 'Close the campaign in front of the crowd.' },
    election: { title: 'The night of the chairs', objective: 'Check the election result.' },
    complete: { title: 'Campaign complete', objective: 'The campaign is over.' },
  },

  travel: {
    hqBrief: { title: 'Official transfer', objective: 'HQ is on the ground floor of the building next to Paco’s bar. Go to the door and press E.', prompt: 'Doorway · Go into HQ', loading: 'ENTERING HQ…', sign: 'HQ' },
    video: { title: 'Out to the media (well, the square)', objective: 'Filming needs daylight and neighbours. Leave HQ by the door and head down to the square.', prompt: 'Door · Down to the square', loading: 'HEADING DOWN TO THE SQUARE…', sign: 'SQUARE' },
    crisis: { title: 'Emergency meeting, packed lunch', objective: 'Something’s on fire in the HQ group chat. Head back through the doorway by the bar.', prompt: 'Doorway · Back to HQ', loading: 'RUSHING BACK UP TO HQ…', sign: 'HQ' },
    debate: { title: 'Transfer to the community hall', objective: 'Leave HQ by the door. The lecterns are already up in the community hall.', prompt: 'Door · Go to the community hall', loading: 'ON THE WAY TO THE COMMUNITY HALL…', sign: 'HALL' },
    finalPrep: { title: 'Boots on the ground', objective: 'Leave the hall through the double doors. One week to go, and it’s won on the street.', prompt: 'Door · Back to the square', loading: 'BACK TO THE NEIGHBOURHOOD…', sign: 'SQUARE' },
    finalSpeech: { title: 'Public transport, like the average voter', objective: 'Go to the stop by the newsstand and take the 27 to the community hall.', prompt: 'Bus stop · Take the 27 to the hall', loading: 'THE 27 ARRIVES. LATE, BUT IT ARRIVES…', sign: 'BUS 27' },
  },

  // ------------------------------------------------------------------------------------------------ propuestas
  proposals: {
    shade: { title: 'Shade before a heat observatory', cost: '2 budget points', benefit: 'Trees, awnings, a fountain that works and the empty shop on the corner as a cool room for older people. No master plan: a gardener.', compromise: 'Parking spaces go, Paco’s terrace loses two tables and Marisa’s nephew is back to double-parking.' },
    parking: { title: 'Let the neighbourhood work', cost: '2 budget points', benefit: 'Loading bays with set hours, rotating spaces for local shops, bike racks for delivery riders and terrace licences in days, not quarters.', compromise: 'More cars in the square and another August in full sun. The bench will keep sizzling.' },
    festival: { title: 'Culture after eight', cost: '2 budget points', benefit: 'A stage for local bands, open-air summer cinema and a rehearsal space run by the residents’ association, not a foundation with a logo.', compromise: 'Noise two nights a week; first-floor neighbours get earplugs. Shade and loading bays go in the drawer.' },
    housing: { title: 'Neighbours back on the third floor', cost: '2 budget points', benefit: 'Building permits in weeks, homes on the empty lot on the corner, and letting out an empty flat stops being scary.', compromise: 'Building takes longer than announcing a rent cap. It won’t make the news, they’ll call you “the landlords’ friend” and the square still has no shade.' },
  },

  // ------------------------------------------------------------------------------------------------ videollamada
  friends: {
    lola: { role: 'Reads the Official Gazette for fun', line: 'I work at a tax adviser’s and read the Official State Gazette on the metro like crime fiction: the body’s always in the additional provisions. I’ll do your books.', choices: [
      { label: 'Treasurer. You decide when it’s a no.', reply: 'Deal. Rule one: nothing here is “funded by growth”. It’s funded by money, which is duller but actually exists.' },
      { label: 'Strategy. Someone has to read the small print.', reply: 'Done. The small print is where governments hide the important bits. The big print is for the poster.' },
    ] },
    dani: { role: 'Talks in threads', line: 'I make videos for a dental clinic and a gym. I’ve read every “ex-campaign adviser” thread in existence. You lot bring the ideas; I’ll give you the narrative.', choices: [
      { label: 'Comms. Narrative yes, hot air no.', reply: 'Deal. Every morning at 7:00, talking points in the group. Short, clear and without the word “resilience”. Well, almost without.' },
      { label: 'Spokesperson. You’ll have to answer questions.', reply: 'Press conferences with questions? Nobody does that any more. Fine: we’ll be vintage.' },
    ] },
    nico: { role: 'Knows the whole building', line: 'I do shifts at a warehouse and I know everyone in the building. I’ll mobilise. But if anyone says “cross-cutting” in a meeting, I’m off to buy crisps.', choices: [
      { label: 'Organisation. You set the schedule.', reply: 'Done. Twenty-minute meetings. If it runs longer, someone’s reading out talking points.' },
      { label: 'Events. We need your megaphone voice.', reply: 'When the bar won the Christmas lottery, the whole street came down in their slippers. Give me a reason like that and I’ll fill the square.' },
    ] },
  },

  call: {
    title: 'Round of consultations. On video call.',
    you: 'Has had an idea',
    next: 'Next brave soul',
    done: 'We’ve got a team. Dani has set up a group called “Talking Points 7:00”. And, by accident, he’s added Marisa from the bakery.',
    doneBabble: 'We’ve got a team.',
    finish: 'Head down to the square',
  },

  register: {
    eyebrow: 'FOUNDING · ONE-STOP SHOP',
    title: 'A name for the ballot paper.',
    stamp: 'PENDING CORRECTIONS',
    intro: 'Three fields. No digital certificate, no appointment, no Annex III. If this is a dream, nobody at the Ministry wake up.',
    defaultName: 'The Bench People',
    defaultSlogan: PROPOSAL_DEFAULT,
    submit: 'Register candidacy',
    toast: 'REGISTERED. Processed in zero working days. Nobody at the counter knows how it happened.',
  },

  program: {
    eyebrow: 'MANIFESTO · BUDGET: 2 POINTS',
    title: 'Prioritising: choosing, but in a tie.',
    intro: 'Only one proposal fits. The rest won’t be “scheduled” or “moved to a second phase”: they just won’t happen. The neighbourhood can tell the difference.',
    promisedBothNote: 'Marisa remembers you promised shade, parking and a flat for her nephew. No option pays for all that. −6 credibility when you commit.',
    toast: (state, ctx) => `Manifesto: ${ctx.proposal.title}. Now go and explain it at the lectern. With questions.`,
  },

  // ------------------------------------------------------------------------------------------------ primer discurso
  speech: {
    headings: ['Right. Well. Here we are.', 'What are you going to stand for?', 'The last line counts.'],
    parts: {
      opening: { title: '01 / Break the ice', prompt: 'Seven people. Two waiting for the bus, one popped out for bread and one filming in case you say “resilience”.', options: {
        listen: 'Before I speak, I’ve come to listen. Properly, not as a “listening exercise”.',
        joke: 'I’ll be brief. I say that as a politician, so get comfortable.',
        grand: 'Today we embark on a cross-cutting roadmap towards a new national horizon!',
      } },
      argument: { title: '02 / Say something concrete', prompt: 'Time to defend what you pinned on the board. Marisa has already got her notebook out.', options: {
        shade: 'Shade and a cool spot for older people, even if we lose parking. No master plan: trees.',
        parking: 'Let people who work here unload, even if the square stays treeless this summer.',
        festival: 'Culture and a space for the kids, with noise hours agreed and in writing.',
        housing: 'More homes: land, quick permits and letting without fear. Rents won’t drop on Monday; they drop by building.',
        everything: 'Trees, parking, festivals and a flat for everyone, free, by decree, on Monday!',
      } },
      close: { title: '03 / Know when to stop', prompt: 'Marisa checks her watch. It’s a watch that has seen a lot of campaigns.', options: {
        accountable: 'If we don’t deliver, ask us right here. And we’ll answer, which would be a first.',
        chant: 'Less traffic, more gazpacho!',
        forever: 'To conclude, and in the interests of brevity, my next twenty-seven strategic pillars…',
      } },
    },
    timing: { eyebrow: '04 / THE BIG FINISH', title: 'Now. With conviction.', button: 'And that’s why I’m standing!' },
    result: {
      eyebrow: 'THE NEIGHBOURHOOD HAS LISTENED',
      goodTitle: 'A round of applause. Not a paid one.',
      badTitle: 'Polite applause. On TV: “well received”.',
      coherent: 'You defended your proposal and said what it costs. In politics that has an odd name: telling the truth.',
      incoherent: 'Your speech doesn’t match the manifesto. On TV they call it “nuance”. In the bread queue, something else.',
      fine: 'Reach measures attention, not votes. The consequences depend on what you said.',
      button: 'Step down from the lectern',
    },
  },

  // ------------------------------------------------------------------------------------------------ diálogos
  dialogues: {
    neighbor: [
      { speaker: 'Marisa', text: 'You’re the new party, aren’t you? I’ve had your talking points: Dani added me to the group by mistake. I read them at five, with the first batch of loaves.' },
      { speaker: 'Marisa', text: 'My nephew does deliveries and has nowhere to stop. Thirty-four, still in his childhood bedroom. And the third floor’s been shut since that law came in. Where do you start?', choices: [
        { text: 'By listening to you. What keeps you up at night?', memory: 'listened', response: 'Me? Patience. My mum’s appointment is months away, and the waiting’s done in the sun.' },
        { text: 'With everything: shade, parking and a flat for your nephew.', memory: 'promisedBoth', response: 'On telly they call that a “comprehensive package of measures”. Round here, “we’ll see”. I’m writing it in the notebook.' },
        { text: 'By making some noise: a festival to put us on the map.', memory: 'spectacle', response: 'On the map? We’re on every holiday-let website: “authentic old-town barrio”. The only authentic thing left is me, and I close at two.' },
      ] },
      { speaker: 'Marisa', text: 'There’s the noticeboard. It stretches to one thing. One. And at the lectern, no “leveraging” and no “roadmaps”. Say either and I’ll throw a baguette at you.' },
    ],

    aftermath: state => {
      const m = state.memories, speech = state.speech || {};
      const memory = m.promisedBoth ? 'You promised me shade, parking and a flat for my nephew. Three things and not one date. Page twelve of the notebook.'
        : m.listened ? 'You listened to me earlier. Doesn’t sound like much, but the ones with laminated speeches never look up from the paper.'
        : m.spectacle ? 'The whole neighbourhood heard about the festival. The first floor are asking if the earplugs are in the manifesto or in a royal decree.'
        : 'Well, you’re down off the soapbox. Your legs shook less than last year’s fella. And last year’s fella brought a coachload of supporters.';
      const coherent = {
        shade: 'You said you’re swapping cars for shade. My nephew’s not speaking to you; my mum’s defending you. You picked a side. About time.',
        parking: 'You picked the van over the trees. My nephew’s buying you a pint. Me, come August, I’m sending my mum to wait for the bus in your front room.',
        festival: 'Culture till midnight and noise with a timetable. At least you didn’t call it “activating public space”.',
        housing: 'You said “build” and “it takes time”. Nobody says that at a lectern: they say “cap” and “now”. My nephew says it’s the first time anyone’s explained why there are no flats.',
      }[state.proposal];
      const result = speech.coherent ? (coherent || 'I don’t agree with all of it. But you said what it costs. At a lectern, that’s practically exotic.')
        : speech.picks?.[1] === 'everything' ? 'Trees, parking, festivals and flats by decree. Love, that’s not a manifesto: that’s an omnibus bill.'
        : 'The board said one thing and you said another. On telly they call it “nuance”. Round here, “changing your mind between the bakery and the bus”.';
      const closing = m.pacoLucia ? 'Paco tells me you found him a waitress. That’s not in any talking points. That’s in the bread queue, which is where people vote.'
        : (speech.reach || 0) >= 12 ? 'Dani says thousands have watched the video. Round here, twelve have. And all twelve are on the electoral roll. Your call who you’re talking to.'
        : 'Right. You’ve got a party, a team and a woman keeping an eye on you. Now you’re in politics.';
      return [{ speaker: 'Marisa', text: memory }, { speaker: 'Marisa', text: result }, { speaker: 'Marisa', text: closing }];
    },

    paco: {
      after: s => s.memories.chairs ? 'Paco: “Six chairs. The seventh is mine and it’s not up for negotiation.”' : s.memories.pacoLucia ? 'Paco: “The girl knows more about tortilla than I do already. Don’t tell her.”' : 'Paco: “Like I said: what it costs. And if you don’t know, say you don’t know.”',
      lines: [
        { speaker: 'Paco', text: 'Paco, bar La Última. More deals get done here than in Parliament, and every one of them goes Dutch. What can I get you?', choices: [
          { text: 'What would you ask of a new party?', memory: 'pacoHeard', response: 'I’ll tell you what: say what it costs. And if you don’t know, “I don’t know”. Never heard that on telly. It’d be trending, as my niece says.' },
          { text: 'Could you lend us chairs for the event?', memory: 'chairs', response: 'Six. It’s a loan, not a grant: they come back where they belong, and they come back clean.' },
          { text: 'How’s business?', memory: 'pacoRent', response: 'My rent’s up, the electric’s up, coffee’s up. Now some bloke on telly wants to cap the price of coffee. Fine, I’ll call it “seasonal coffee”. Like the flats.' },
        ] },
        { speaker: 'Paco', text: 'And look at that sign: “Waiter wanted”. Been up since Easter. It’s got more seniority than my coffee machine.', choices: [
          { text: 'Have you tried paying more?', memory: 'pacoWages', response: 'I have. I put coffee up ten cents and get a review: “daylight robbery”. If the taxman did it, they’d call it “redistribution”.' },
          { text: 'Young people just don’t want to work these days.', memory: 'pacoBlame', response: 'I used to say that, till a lad came in with three CVs and one question: “And where do I live?”. On what I pay, in the chair storeroom. Never came back.' },
          { text: 'Lucía, the student by the fountain, wants weekend work.', memory: 'pacoLucia', response: 'The one with notes in four colours? Send her over. Written contract and tortilla on the house. You’ve brought two people together without setting up a dialogue table. That’s new.' },
        ] },
        { speaker: 'Paco', text: 'Now, excuse me, the back table wants sangria at eleven in the morning. Now that’s a clear manifesto, and they deliver on it.' },
      ],
    },

    marisa: s => {
      const text = {
        program: 'The noticeboard, by the tree. One proposal. Pin up two and it’s a “package of measures”, and packages, love, someone always pays for.',
        speech: 'Get up on that soapbox before the bread goes cold and so do the people. And no “leveraging”.',
        video: 'Today’s talking points say “relatable tone”. How much more relatable? I can see you from the oven.',
        crisis: 'I’ve had that video from the church group, the gym group and my sister-in-law. When it reaches my sister-in-law, love, it’s official.',
        debate: 'Debate tonight. If I hear you say “the social majority”, I’ll throw a baguette from the stands.',
        finalPrep: 'Last lap. Drop by the bus stop: people waiting have time and they have complaints. Listen; they’ve been talking a while already.',
      }[s.mission] || 'Me, here, with my notebook. You get on with it. I’m watching.';
      return [{ speaker: 'Marisa', text }];
    },

    lola: {
      crisis: { after: 'Lola: “Still on today’s Gazette. Seventh final provision. The butler did it.”', lines: [
        { speaker: 'Lola', text: 'While you lot fight over the video, I read the Gazette. A decree bundles pensions and the clocks going back in one package. Ours is smaller: they’re going over our accounts with a magnifying glass.', choices: [
          { text: 'Publish them. All of them.', memory: 'lolaBooks', response: 'Down to the receipt for the sticky tape. If they catch us out, let it be a seven-cent rounding error. In its own document, not tucked in with the pensions.' },
          { text: 'Better to wait for it to blow over.', memory: 'lolaWait', response: 'In a ministry that’s called “no record exists”. Crises don’t blow over: they get filed. And someone unfiles them the week before the vote.' },
        ] },
      ] },
      default: { after: 'Lola: “New tab: ‘Things we’re not paying for’. Twelve rows. None of them says ‘pays for itself’.”', lines: [
        { speaker: 'Lola', text: 'I’ve opened the spreadsheet “Campaign_FINAL_v3”. Income: the group kitty and forty euros Dani owes us. He calls it “historic debt”.' },
        { speaker: 'Lola', text: 'Outgoings: pizzas, printing and an invoice for “narrative consultancy” signed by Dani’s cousin. Do I pay it?', choices: [
          { text: 'No chance. Everything invoiced, everything published.', memory: 'lolaReceipts', response: 'Thank you. If we make the news, let it be for being boring. Real transparency, not a portal that crashes the day you look for it.' },
          { text: 'Pay it, the cousin’s a nice lad.', memory: 'lolaCousin', response: 'Nice he is. I’m putting it in the tab “Contracts for mates, neighbourhood edition”. It’ll look lovely in a thread.' },
          { text: 'Hey, Lola… how are you making ends meet?', memory: 'lolaRent', response: 'I share a flat with two people studying for civil service exams. They learn laws that change before the exam. I pay, they summarise the Gazette. That’s why I’m here, OK?' },
        ] },
        { speaker: 'Lola', text: 'Right, to the table. Order: barbecue and four cheese. Dani proposed pineapple, but it didn’t make it through public consultation.' },
      ] },
    },

    dani: {
      crisis: { after: 'Dani: “Three drafts of the statement. All three start with ‘In light of the reports that have appeared’.”', lines: [
        { speaker: 'Dani', text: 'Four hundred comments: two hundred bots, a hundred from my mum defending you and a hundred from real, very angry people. The clip was posted by a Siesta’s Over channel.', choices: [
          { text: 'Answer the real ones, one by one.', memory: 'daniReply', response: 'One by one. No “we regret any misunderstanding”. Pass me a coffee. If you see me type “narrative”, take my phone off me.' },
          { text: 'Block everyone and post a meme.', memory: 'daniMeme', response: 'Done. Now the meme has more comments than the problem. Advisers call it “reframing”. My nan calls it “wriggling out of it”.' },
        ] },
      ] },
      default: { after: 'Dani: “Working on tomorrow’s talking points. Two hours torn between ‘committed to’ and ‘remain committed to’.”', lines: [
        { speaker: 'Dani', text: 'Your first talking points go out tomorrow. Listen: “Against the noise, neighbourhood. Against the narrative, facts. Against…”. OK, it’s come out a bit against-y.' },
        { speaker: 'Dani', text: 'I’ll film you explaining the manifesto. Official format, shirtsleeves, strolling round an industrial estate, or a filter and whatever song’s trending?', choices: [
          { text: 'No filter, no industrial estate. Let them see the eye bags.', memory: 'daniNoFilter', response: 'Brave. Eye bags are the last authentic thing on the internet. Not many likes, but from people who exist.' },
          { text: 'Filter and the trending song.', memory: 'daniTrend', response: 'That’s the spirit. Tomorrow nobody will know what you’re proposing, but everyone will know you dance like a minister at a village fête.' },
          { text: 'And how are you doing, with all those jobs?', memory: 'daniJobs', response: 'Three clients, and my mum asking when I’ll go “permanent-seasonal”, which to her sounds permanent. This is the only thing I do for free. And the only thing I want to do.' },
        ] },
        { speaker: 'Dani', text: 'One thing: I write the talking points, but Marisa corrects them. No idea how she got into the group. I don’t dare kick her out now.' },
      ] },
    },

    nico: {
      crisis: { after: 'Nico: “Setting up chairs. One folds itself up. That one’s not voting.”', lines: [
        { speaker: 'Nico', text: 'Ernesto came down, from the third floor. His flat’s been empty since the rent cap and he says the video calls him a speculator. Then he asked me to water his plants.', choices: [
          { text: 'Invite him to the building meeting. Let him tell his side.', memory: 'nicoInvite', response: 'OK. He says he’d let it if he knew he’d get it back. So: he’s got a flat, Marisa’s nephew hasn’t, and there’s a law in the middle. Funny, that.' },
          { text: 'Ignore him. He’s the enemy.', memory: 'nicoEnemy', response: 'Enemy? It’s Ernesto, from school. I’ve owed him a football since Year Seven. Dani calls him a “major property holder” in the talking points. He has one flat. Inherited.' },
        ] },
      ] },
      default: { after: 'Nico: “Off for more tape. This stuff sticks when it feels like it, like a coalition partner.”', lines: [
        { speaker: 'Nico', text: 'I’ve put up forty posters. Next to the Fox one there was a real horse, double-parked. I stuck one on it too. No complaints. Our first endorsement.' },
        { speaker: 'Nico', text: 'By the way, Reme says she’ll vote for whoever gets her a cardiology appointment before Christmas. What do I tell her?', choices: [
          { text: 'The truth: it won’t be fixed in a month, but we’ll fight for it.', memory: 'nicoTruth', response: 'I’ll tell her. She’ll do the face older ladies do when they hear the truth: half pity, half respect. The vote, we’ll see.' },
          { text: 'Tell her yes. Appointment in a week.', memory: 'nicoPromise', response: 'You’re promising in a week what the waiting list takes six months to do. Come December, Reme will remind you. With her walking stick.' },
          { text: 'Get her to come to the building meeting and tell everyone.', memory: 'nicoAssembly', response: 'Good idea. Folk in this block have spent years moaning, each on their own landing. Together they’re a residents’ committee: a coalition, but with a service charge.' },
        ] },
      ] },
    },
  },

  // ------------------------------------------------------------------------------------------------ cinemáticas
  cinematics: {
    intro: {
      banner: ['CHAPTER 1', 'Pues me presento'],
      tv: { headline: 'ELECTION!', ticker: 'BREAKING · PARLIAMENT DISSOLVED · STATEMENT, NO QUESTIONS' },
      subs: [
        [null, 'Sunday, 23:47. “Just one more video, then bed.”'],
        ['Newsreader (TV)', 'Breaking news: the Government has dissolved Parliament and called a general election. The PM gave a statement, no questions: “the answers are on the website”.'],
        ['Newsreader (TV)', 'The usual parties are already filming videos in shirtsleeves. One arrived on horseback. We’ll keep you posted. Or not.'],
        [null, 'BZZZ. Forty-three messages. “What if we stood?” “lol”. “No, seriously.”'],
        ['Tú', 'An election? Again? …Let’s see what the group says.'],
      ],
      toast: 'Your phone won’t stop buzzing. It’s on the side table by the sofa.',
    },
    plaza: {
      banner: ['THE NEIGHBOURHOOD', 'Down to the Street'],
      subs: [
        [null, 'The square: bakery, bar, a bench in the sun and more opinions per square metre than a TV panel show.'],
        ['Marisa', 'Well, if it isn’t the new party! Come here, I’ve got things to tell you.'],
        ['Paco', 'If you’re saving the neighbourhood, do it after coffee. And the coffee gets paid for; it’s not a policy.'],
      ],
    },
    hq: {
      banner: ['CHAPTER 2', 'HQ Is My Front Room'],
      subs: [
        [null, 'HQ: a front room, a folding table and two sockets. One works. The other is “being processed”.'],
        ['Lola', 'Welcome to HQ. The sofa is the press room; the fridge, the treasury. Audited.'],
        ['Dani', 'I’ve named the wifi “Cabinet Office”. We have structures now.'],
        ['Nico', 'Agenda: one, chairs. Two, who’s bringing ice. Three, the nation.'],
      ],
    },
    hall: {
      banner: ['CHAPTER 5', 'The Community Hall Debate'],
      subs: [
        [null, 'Community hall. Tonight: debate. Tomorrow: Zumba. Not much in it, by the look of things.'],
        ['moderator', 'Good evening. Several lecterns, one stopwatch and a jug of water nobody will open. First block: housing.'],
        ['tech', 'I come bearing common sense. And patience. Mostly patience: we’ve been waiting years for our turn.'],
        ['populist', 'In the face of the reactionary wave, we move forward. In whichever direction tonight requires.'],
      ],
    },
    victory: {
      banner: ['ELECTION NIGHT', 'Victory!'],
      verdict: 'OVER 48!',
      subs: [
        ['Reporter', 'With one hundred per cent counted, every party says it has won. For once, one of them is right.'],
        ['Tú', 'We’ve… won? Without talking points?'],
        ['Ana', 'Speech! But keep it short, Marisa opens at five!'],
      ],
    },
    defeat: {
      verdict: 'SHORT OF 48',
      subs: [
        ['Reporter', '…and the neighbourhood candidacy misses out. Every other party, mind you, says it won.'],
        ['Tú', 'Dani says it’s “a result that allows us to keep building”.'],
        ['Berto', 'Marisa’s already translated it: “you lost, love”. Listen, I’ll vote for you next time. If you remind me.'],
      ],
    },
  },

  // ------------------------------------------------------------------------------------------------ pantallas de campaña
  flow: {
    hq: {
      eyebrow: 'CHAPTER 2 · HQ IS MY FRONT ROOM', title: 'Executive committee: three people and a sofa.',
      intro: state => `7:00 talking points: “Prioritise strategic pillars”. Marisa’s reply in the group: “Pick one thing”. There’s time for one real priority; the rest goes to the group chat, where ideas go to die.${state.memories.nicoAssembly ? ' Nico has already stuck a meeting notice up in the entrance hall.' : ''}`,
      choices: {
        accounts: { title: 'Lola checks every cost', flavor: 'Budget on display, down to the receipt for the sticky tape. Not one line of “other expenses”. Less time for social media' },
        street: { title: 'Nico goes door to door', flavor: 'Landing by landing, using the lift repair levy as an excuse. No tablet, no survey: just doorbells' },
        content: { title: 'Dani sets up a little press office', flavor: 'Ring light, a green-sheet green screen and a wall spelling NARRATIVE in sticky notes' },
        tenants: { title: 'Residents’ meeting in the entrance hall', flavor: 'People who haven’t spoken since the damp business come down. Ernesto, with the empty flat, too. Nobody stacks the chairs' },
      },
    },
    video: {
      eyebrow: 'CHAPTER 4 · MAKE IT GO VIRAL', title: 'The mark’s down. The message isn’t.',
      intro: state => { const m = state.memories; return `7:00 talking points: “Relatable tone, clear message”. Marisa: “Talk like you talk”. Dani reckons you’ve got three seconds before they swipe. Reach opens doors; people can tell attention from support.${m.daniNoFilter ? ' No filter today.' : m.daniTrend ? ' Dani has already picked the song. Don’t ask.' : ''}`; },
      choices: {
        explain: { title: 'Explain the proposal and what it costs', flavor: 'One minute, static shot and a whiteboard from Lola with the small print written big' },
        chairs: { title: 'Paco’s chair dance', flavor: 'Choreography with borrowed chairs. Nobody knows what you’re proposing; everyone knows you fall over at second eleven' },
        neighbor: { title: 'Let Marisa talk', flavor: 'She talks about the heat, her rent going up and her mum’s appointment. You hold the phone and keep quiet' },
        debunk: { title: 'Debunk today’s hoax', flavor: 'A Siesta’s Over channel says you want to ban pavement terraces. You debunk it with the full, uncut shot, which is the secret weapon' },
      },
    },
    crisis: {
      eyebrow: 'CHAPTER 5 · CRISIS',
      title: (state, ctx) => ctx.contradiction ? 'Your “everything for everyone” got there before the press did.' : 'An edited clip got there before the truth did.',
      intro: (state, ctx) => `${ctx.contradiction
        ? 'Someone has posted the moment you promised everything at once. Trailer music, all-caps title and a caption: “MARISA TRANSLATES”. It wasn’t her. But she endorses it.'
        : 'A nine-second clip is doing the rounds, cut just before you explained the cost. Survive Another Election shares it with “This is what’s behind it”. The Patient Party, with “No comment”. Which is a comment.'}${state.memories.nicoPromise ? ' And Reme has phoned: still no appointment.' : ''} Current forecast: <b>${ctx.forecast.score}/100</b>. You need ${ctx.forecast.threshold}.`,
      choices: {
        admit: { title: 'Face it: admit the mistake and fix it', flavor: 'Video with no music and no “taken out of context”. With questions, which is practically a scandal' },
        team: { title: 'Publish costs and who’s responsible', flavor: 'Lola posts the accounts; Nico, who does what. Boring, checkable and hard to clip' },
        distract: { title: 'Give away an air fryer', flavor: 'To enter: follow the account, tag three friends and forget the whole thing. In the textbooks: “setting your own agenda”' },
        blame: { title: 'Blame the mud machine', flavor: 'Bots, the algorithm and “the sewers”. Works on your lot. Everyone else spots the trick: every party uses it' },
      },
    },
    debate: {
      eyebrow: 'CHAPTER 5 · THE DEBATE', title: 'Three rivals, a moderator and an unopened jug.',
      intro: (state, { rivals: { tech, populist, hard, moderator } }) => `On one side, ${populist.name}, of the ${populist.party}, with two sets of talking points: the morning one and the afternoon one. On the other, ${tech.name}, of the ${tech.party}, who promises to repeal things he never names. At the back, ${hard?.name || 'Covadonga del Muro'}, of Fox, who tried to ride in on a horse. ${moderator}: “What does your manifesto give up?”`,
      choices: {
        tradeoff: { title: 'Defend the specific trade-off', flavor: (state, { rivals }) => `You say what you lose and who you annoy. ${rivals.tech.name} asks for “a figure”. You give him one. He writes it down so he can repeal it` },
        attack: { title: (state, { rivals }) => `Dig out ${rivals.populist.name}’s old quotes`, flavor: 'You read out what she said two campaigns ago. Easy applause, easy headline, zero proposals. Her: “Only fools never change their minds”' },
        manage: { title: 'Take turns and calmly unpick the numbers', flavor: (state, { rivals }) => `${rivals.tech.name} promises tax cuts “from year two, if the inheritance allows”. You ask: year two of what? Silence. Water` },
        promise: { title: 'Promise to halve rents “by decree”', flavor: (state, { rivals }) => `The crowd applauds. ${rivals.populist.name} looks at you with professional envy. ${rivals.moderator}: “So noted”` },
      },
    },
    finalPrep: {
      eyebrow: 'CHAPTER 6 · FINAL LAP', title: 'There’s still some room.',
      intro: (state, ctx) => `Forecast: <b>${ctx.forecast.score}/100</b> (${ctx.forecast.winning ? 'above' : 'below'} the threshold). Two days to go. The official poll has you on “around zero”; it’s always right in favour of whoever paid for it. Talking points: “Mobilise the tactical vote”. Marisa: “Get people to turn up”. There’s only time for one thing, done properly.`,
      choices: {
        listen: { title: 'Visit the undecided', flavor: state => `The bus stop, the health centre queue and the lady with the handbag, who knows the man who stole it by now: they bump into each other at court every month${state.memories.nicoAssembly || state.memories.nicoInvite ? '. The building meeting wants you back' : ''}. You listen more than you talk` },
        receipts: { title: 'Publish the final budget', flavor: 'Lola prints it on A3: “transparency is also a font size”. No annexes that turn up in August' },
        volunteers: { title: 'Sort out volunteers and polling stations', flavor: state => `Nico hands out shifts, sandwiches and a map of polling stations drawn on a napkin${state.memories.pacoLucia ? '. Lucía, Paco’s waitress, signs up as a polling agent' : ''}. No supporters’ coaches: the regular bus will do` },
      },
    },
    finalSpeech: {
      eyebrow: 'CHAPTER 6 · THE FINAL RALLY', title: 'One line before the day of reflection.',
      intro: 'Folding chairs, a slowly deflating balloon and a local paper reporter who looks like it’s her third rally today. The other parties close with coaches and flags; here, there’s the gas-bottle delivery man. Consolidate what you’ve learnt, or promise everything all over again.',
      choices: {
        account: {
          title: state => ({
            shade: '“There will be shade and fewer cars. This is what we chose, this is what it costs, and we’ll answer for it here.”',
            parking: '“The neighbourhood will be able to work, even if it’s another summer without trees. This is what we chose, and we’ll answer for it here.”',
            festival: '“There will be culture and agreed noise. This is what we chose, this is what it costs, and we’ll answer for it here.”',
            housing: '“There will be more homes because we’ll build them, not because we announce them. It’ll take time. And we’ll answer for it here.”',
          }[state.proposal] || '“This is what we chose, this is what it costs, and we’ll answer for it here.”'),
          flavor: 'You say it without notes. Marisa opens her notebook and, for the first time, writes nothing down',
        },
        viral: { title: '“Less traffic, more gazpacho!”', flavor: 'Dani streams it live. People chant it. Nobody knows what it means. By midnight three parties have copied it' },
        everything: { title: '“Tomorrow there’ll be everything for everyone, by decree.”', flavor: (state, { rivals }) => `Huge applause. Lola hides her face behind the budget. ${rivals.populist.name} texts you: “Shall we talk?”` },
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ finales
  endings: {
    victory: {
      eyebrow: 'ELECTION NIGHT · VICTORY', title: 'More chairs than people.',
      text: state => `Marisa claps once. Lola asks who kept the receipts. The Patient Party and Survive Another Election have already rung twice: “What are you offering?”. At 7:00, Dani’s last talking points arrive: “We won”. Marisa replies: “That one I understand”. ${{
        shade: 'Tomorrow the hard part starts: explaining to the nephew’s van where it can park.',
        parking: 'Tomorrow the hard part starts: the first treeless August with your name on the plaque.',
        festival: 'Tomorrow the hard part starts: the first meeting with the first floor, who’ve brought earplugs for you.',
        housing: 'Tomorrow the hard part starts: the first permit. Ernesto asks if he can let the third floor before the term’s out.',
      }[state.proposal] || ''}`.trim(),
    },
    defeat: {
      eyebrow: 'ELECTION NIGHT · DEFEAT', title: 'A result that allows us to keep building.',
      reasons: {
        support: 'Not enough direct support: the neighbourhood saw you more on their phones than on their landings.',
        credibility: 'The contradictions weighed you down: the bread queue keeps no archive, but it has a memory.',
        organization: 'The team turned up in a muddle: one polling station with no agent and another with three.',
      },
    },
  },

  // ------------------------------------------------------------------------------------------------ minijuegos
  minigames: {
    viral: {
      eyebrow: 'MINIGAME · MAKE IT GO VIRAL', title: 'Rolling on the mark.', goWord: 'Action!',
      lanes: ['Wave', 'Arms up!', 'Clap', 'No record'],
      takes: {
        explain: 'Lola’s whiteboard, static shot, and every gesture underlines a cost.',
        chairs: 'The chair dance. Paco watches with his arms folded.',
        neighbor: 'Marisa talks about the heat; you keep the beat behind her, subtly. It shows.',
        debunk: 'You take the hoax apart with clear gestures: not this, this, and this costs.',
      },
      intro: (state, ctx) => `Phone on the tripod, neighbours watching and Dani counting in. ${ctx.take} Strike each pose when its icon hits the circle. Rhythm adds reach, not votes.`,
      titles: { great: 'Viral! Two parties have already offered you a place on their list.', ok: 'Shared in three WhatsApp groups. One is your mum’s.', bad: 'Forty views. Dani calls it “qualitative impact”.' },
      texts: { ok: 'Dani’s already adding yellow subtitles. The take’s a keeper: reach opens doors, but votes are won on the doorstep.', bad: 'You got lost between the wave and the clap. Retake it: for now, there’s “no record”.' },
    },
    duel: {
      eyebrow: 'MINIGAME · REBUTTAL DUEL', title: 'Five questions, one stopwatch.',
      intro: (state, ctx) => `${ctx.rounds} rebuttals. Pick the answer that stands for something concrete and owns its cost, before time runs out. Halfway through, someone will interrupt: ask for the floor.`,
      rounds: state => {
        const m = state.memories || {};
        const cost = {
          shade: 'Whoever double-parks, and two of the tables on Paco’s terrace. Shade in exchange for cars, plainly put.',
          parking: 'The bench in the sun: no trees again this summer. We chose to let the neighbourhood work.',
          festival: 'The first floor, two nights a week. With agreed hours and free earplugs, literally.',
          housing: 'The square, which stays shadeless, and our patience: building takes longer than one term. And they’ll call us “the landlords’ lot”.',
        }[state.proposal];
        return [
          { topic: 'Housing', role: 'populist', claim: 'Thanks to our law, rents in high-pressure areas have stabilised. The missing flats are being hidden by speculators.',
            options: ['If it’s “stabilised”, why has the third floor been empty for a year? Caps don’t make homes. Building does, even if it’s slower than a headline.', 'Well, we’ll cap it at half! And bread too!', 'You wear a colourful lapel pin. Everyone round here knows it.'], correct: 0 },
          { topic: 'Data', role: 'tech', claim: 'According to a report I haven’t brought, your proposal will sink the neighbourhood. This chart says so. The one with the red arrow.',
            options: ['And according to mine, your chart is a hoax. Statistical dead heat.', 'Well, data is relative. Like polls.', 'Show us your source. Here’s ours: Lola’s budget, page two, with a photo of the bench at five in the afternoon.'], correct: 2 },
          { topic: 'Your proposal', role: 'moderator', claim: 'Straight question: who loses out from your proposal? Golden minute. Well, ten bronze seconds.',
            options: ['Nobody. It’s a cross-cutting proposal with no losers, like an aftershave advert.', cost || 'Somebody, surely. We’ll name names once we know.', 'The usual suspects. They know who they are.'], correct: 1 },
          m.promisedBoth
            ? { topic: 'The promise', role: 'populist', claim: 'You promised a baker shade, parking and a flat for her nephew! That’s populism. And I speak from experience.',
                options: ['It’s true. I was wrong to promise everything; then we picked one thing and explained what it costs.', 'It was taken out of context. The context was me promising everything.', 'You promise everything too. Call it a draw.'], correct: 0 }
            : { topic: 'Health', role: 'tech', claim: 'And the health service? Or do you only care about your little square? We will manage. A lot. With management.',
                options: ['I promise no waiting lists by tomorrow. You have my word.', 'We care. That’s why we don’t promise what we don’t run: we’ll take Reme’s appointment to the council, by name and with a date.', 'We’ll repeal everything, like you. We’ll see what.'], correct: 1 },
        ];
      },
      interruptions: {
        populist: 'Excuse me! That’s the mud machine talking. And I say so without having heard all of it.',
        tech: 'If I may… as a newspaper said this morning… I’ll read you the whole thing…',
        moderator: 'You have ten seconds. Nine. So noted.',
        fallback: 'Excuse me, excuse me!',
      },
      floor: 'Let me finish, please. This isn’t a press conference.',
      floorBabble: 'Let me finish',
      reactions: {
        timeout: 'Time’s up. So noted. Next block.',
        quick: 'A concrete answer, on time. Unusual. Noted.',
        slow: 'Concrete, if a bit tight on time.',
        wrong: 'Thank you for proving my point. It’s going in the talking points.',
      },
      titles: { all: (state, { rivals }) => `${rivals.moderator} nods. And doesn’t say “so noted”.`, mid: 'You held your own. No crib sheet.', low: 'Tomorrow your rivals will say they won. Today, with good reason.' },
      text: 'The strategy you chose shapes the debate; the rebuttals decide whether you’re believed.',
    },
    chairs: {
      eyebrow: 'MINIGAME · SIX CHAIRS', title: 'A loan, not a grant.',
      intro: (state, ctx) => `The last assembly needs Paco’s six chairs, which are scattered around the neighbourhood. Walk over one to pick it up and carry it to the circle. One at a time: “backs vote too”, says Nico. You have ${ctx.time} seconds.`,
      hints: {
        start: 'Walk over a chair to pick it up.',
        carry: 'Now, to the yellow circle.',
        progress: (state, ctx) => `${ctx.delivered} of ${ctx.total}. On to the next.`,
        full: 'Circle complete!',
      },
      titles: { all: 'Six chairs in the circle. Paco approves.', mid: 'Half a circle. Everyone else standing and opining.', low: 'Paco collects the chairs himself. And has words.' },
      texts: { all: 'Nico writes the time on the napkin. This is what organising is: there’s a seat when people arrive.', other: 'The missing ones are still around the square. Try again: nobody saw a thing, except Paco.' },
    },
    rally: {
      eyebrow: 'MINIGAME · THE FINAL RALLY', title: 'Don’t lose the room.', goWord: 'Speak!', lane: 'Land the line',
      intro: 'Every line has a punchline. Hit it when the word reaches the circle: the crowd claps and attention goes up. Miss, and someone checks their phone. Or worse: boos.',
      phrases: state => {
        const own = {
          shade: ['This summer, the square will have', 'SHADE'], parking: ['If you work in this neighbourhood, you’ll be able to', 'UNLOAD'],
          festival: ['The kids get a venue and the square gets', 'CULTURE'], housing: ['You don’t announce homes: you', 'BUILD THEM'],
        }[state.proposal] || ['One thing, done properly, just to', 'START'];
        return [
          ['Good evening. Thank you for coming without a coach and with a', 'CHAIR'],
          ['I haven’t brought talking points: I’ve brought', 'ONE THING'],
          own,
          ['And yes: it has a cost. We’ve put it in', 'WRITING'],
          ['No observatory, no committee and no', 'LOGO'],
          ['Nobody here has told you this pays for', 'ITSELF'],
          ['If we don’t deliver, you know where to find the', 'BAKERY'],
          ['Tonight Marisa has nothing to', 'TRANSLATE'],
          ['On Sunday I’m not asking for faith: I’m asking you to', 'VOTE'],
          ['For whoever you like. Just don’t let it be decided by the', 'SOFA'],
          ['Thank you, neighbourhood. And now the chairs go back to', 'PACO'],
          ['And that’s why I’m', 'STANDING!'],
        ];
      },
      titles: { great: 'The room on its feet. Even the ones with chairs.', ok: 'Sincere applause and the odd yawn.', bad: 'A phone went off. It was the talking points.' },
      text: 'The crowd will remember how you said it; the decision you made decides what they remember.',
    },
  },
};
