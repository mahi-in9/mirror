const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parseGeminiResponse } = require('../utils/parseGeminiResponse');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ANALYSIS_PROMPT = (userName, responses) => `
You are Mirror AI — a brutally honest, funny, and psychologically sharp personality analyzer.

Analyze the following anonymous friend responses about "${userName}" and generate their social perception profile.

RESPONSES:
${JSON.stringify(responses, null, 2)}

Return ONLY valid JSON. No markdown. No explanations. No code blocks. No preamble.

Required structure (all fields mandatory):
{
  "archetype": "Two-word label like 'Chaos Philosopher', 'Silent Menace', 'Emotional Support Villain', 'Corporate Survivor', 'Midnight Thinker', 'Dangerous Motivator', 'Accidental Leader', 'Certified Cryptid', 'Main Character Energy', 'Vibes Only Strategist'",
  "summary": "2-3 sentence witty but accurate summary of how friends perceive this person. Make it specific, funny, and slightly roasting.",
  "consensus": [
    "X% of friends think you [specific funny insight]",
    "The majority believe you [another insight]",
    "Almost everyone agrees you [third insight]"
  ],
  "traits": {
    "chaos": <number 0-100>,
    "trust": <number 0-100>,
    "humor": <number 0-100>,
    "mystery": <number 0-100>,
    "intelligence": <number 0-100>,
    "emotionalUnpredictability": <number 0-100>
  },
  "quotes": [
    "Short anonymous-style quote about them (max 12 words)",
    "Another quote",
    "Third quote",
    "Fourth quote"
  ],
  "shareCardText": "One punchy viral line for their share card (max 15 words, make it meme-worthy)",
  "socialEnergy": <number 0-100, 100=extremely social, 0=certified hermit>,
  "mostCommonPerception": "The #1 thing everyone seems to agree on about this person"
}

Make it:
- Funny but psychologically accurate
- Internet-culture aware
- Slightly roasting but not mean
- Gen Z tone
- Emotionally resonant
`;

const analyzeResponses = async (userName, responses) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = ANALYSIS_PROMPT(userName, responses);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = parseGeminiResponse(text);
    return parsed;
  } catch (err) {
    console.error('Gemini error:', err.message);
    return getFallbackReport(userName);
  }
};

const getFallbackReport = (userName) => ({
  archetype: 'Mysterious Entity',
  summary: `${userName} exists in a category that defies easy labeling. Their friends collectively gave up trying to explain them and just said "you know how they are."`,
  consensus: [
    '100% of friends agree they\'re impossible to fully explain',
    'The majority gave up trying to predict their next move',
    'Almost everyone has a story that starts with "okay so this one time..."'
  ],
  traits: {
    chaos: 65,
    trust: 70,
    humor: 72,
    mystery: 80,
    intelligence: 75,
    emotionalUnpredictability: 60
  },
  quotes: [
    'A lot is going on behind those eyes.',
    'Chaotic but somehow always right.',
    'You\'d follow them into a bad decision.',
    'Equal parts danger and comfort.'
  ],
  shareCardText: 'Certified mysterious. Dangerously reliable.',
  socialEnergy: 60,
  mostCommonPerception: 'Impossible to predict, surprisingly trustworthy'
});

module.exports = { analyzeResponses };
