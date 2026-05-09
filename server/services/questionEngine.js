// Dynamic question generator - creates fresh, viral questions every time

const behaviors = [
  'overthink everything',
  'disappear without warning',
  'become the unexpected leader',
  'panic completely calmly',
  'accidentally start a movement',
  'give unsolicited life advice',
  'stay suspiciously calm',
  'make it everyone\'s problem',
  'solve it in the most chaotic way',
  'document it for content',
  'convince everyone it\'s fine',
  'blame Mercury retrograde',
  'turn it into a debate',
  'ghost the entire situation',
  'start a spreadsheet nobody asked for'
];

const situations = [
  'a zombie apocalypse',
  'a group project deadline',
  'a 3am crisis',
  'an awkward silence',
  'a surprise job interview',
  'a first date going wrong',
  'a hackathon with no Wi-Fi',
  'a road trip with no maps',
  'a startup pitch gone sideways',
  'a power outage during finals',
  'a family dinner with drama',
  'a flat tire at midnight',
  'a surprise party that backfired',
  'a flight delay for 8 hours'
];

const archetypes = [
  'accidentally become famous',
  'survive as the last human',
  'get canonized by the internet',
  'end up on a documentary',
  'become the cult leader nobody wanted',
  'write a book about this later',
  'get their own podcast somehow',
  'found a startup from this',
  'be the main character everyone warned about'
];

const perceptionTemplates = [
  'Looks completely normal but is definitely {trait}?',
  'Acts like they have it together but secretly {behavior}?',
  'Could convince anyone that {opinion} is true?',
  'The type to {behavior} and somehow make it work?',
  'Most likely to {archetype}?'
];

const traits = [
  'plotting something massive',
  'running 47 mental tabs at once',
  'three decisions away from chaos',
  'dangerously good at reading people',
  'holding it all together with vibes',
  'one email away from snapping',
  'extremely chaotic but weirdly reliable',
  'too mysterious for their own good'
];

const opinions = [
  'everything happens for a reason',
  'they were right all along',
  'the group needs more chaos',
  'this is actually totally fine',
  'sleep is optional',
  'rules are just suggestions'
];

const fixedQuestions = [
  {
    text: 'Replies to texts with scientific precision or emotional poetry?',
    category: 'communication',
    options: ['Scientific precision', 'Emotional poetry', 'Depends on the moon phase', 'They just leave you on read']
  },
  {
    text: 'What\'s their actual energy at 2am?',
    category: 'social',
    options: ['Philosopher mode unlocked', 'Already asleep since 9pm', 'Texting their situationship', 'Peak productivity somehow']
  },
  {
    text: 'How would they handle suddenly becoming famous overnight?',
    category: 'personality',
    options: ['Immediately disappear from the internet', 'Monetize everything within 24hrs', 'Existential crisis first, profit later', 'Act like nothing happened']
  },
  {
    text: 'Their role in the friend group during a crisis?',
    category: 'social',
    options: ['The one who stays dangerously calm', 'The chaos coordinator', 'Emotional support provider', 'The one who vanishes and comes back with snacks']
  },
  {
    text: 'What does their browser history say about them?',
    category: 'personality',
    options: ['Unhinged research rabbit holes', 'Comfort content on repeat', 'Something nobody should see', 'Shockingly wholesome']
  },
  {
    text: 'If they had a warning label, what would it say?',
    category: 'personality',
    options: ['May cause existential questions', 'Dangerously convincing', 'Handle with emotional care', 'Do not give advice before coffee']
  },
  {
    text: 'How do they actually process bad news?',
    category: 'emotional',
    options: ['Laugh nervously then spiral later', 'Instantly solution-mode', 'Need 24hrs before responding', 'Somehow already knew']
  },
  {
    text: 'Their most dangerous quality?',
    category: 'personality',
    options: ['Giving confidence that should require a license', 'Making chaotic ideas sound completely reasonable', 'Being right just often enough to be dangerous', 'Knowing too much about everything']
  }
];

const generateDynamicQuestions = (count = 5) => {
  const generated = [];

  for (let i = 0; i < count; i++) {
    const rand = Math.random();

    if (rand < 0.4) {
      // Template: Most likely to {behavior} during {situation}?
      const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
      const situation = situations[Math.floor(Math.random() * situations.length)];
      generated.push({
        text: `Most likely to ${behavior} during ${situation}?`,
        category: 'situational',
        options: ['100% this', 'Only if forced', 'Would try and fail spectacularly', 'Somehow makes it everyone else\'s problem']
      });
    } else if (rand < 0.7) {
      // Perception template
      const template = perceptionTemplates[Math.floor(Math.random() * perceptionTemplates.length)];
      const trait = traits[Math.floor(Math.random() * traits.length)];
      const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
      const opinion = opinions[Math.floor(Math.random() * opinions.length)];
      const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];

      const text = template
        .replace('{trait}', trait)
        .replace('{behavior}', behavior)
        .replace('{opinion}', opinion)
        .replace('{archetype}', archetype);

      generated.push({
        text,
        category: 'perception',
        options: ['Painfully accurate', 'Not even close', 'More than they\'d admit', 'Only on Tuesdays']
      });
    } else {
      // Archetype question
      const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];
      generated.push({
        text: `If things went sideways, they would ${archetype}?`,
        category: 'archetype',
        options: ['Absolutely', 'Probably not intentionally', 'Only if it went viral', 'They\'d deny it but yes']
      });
    }
  }

  return generated;
};

const generateQuestionSet = () => {
  // Mix fixed + dynamic questions
  const shuffledFixed = [...fixedQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
  const dynamic = generateDynamicQuestions(4);
  const all = [...shuffledFixed, ...dynamic].sort(() => Math.random() - 0.5);
  return all.slice(0, 9).map((q, i) => ({ ...q, id: i + 1 }));
};

module.exports = { generateQuestionSet };
