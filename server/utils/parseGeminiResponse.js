const DEFAULT_REPORT = {
  archetype: 'Undefined Chaos Agent',
  summary: 'Your friends tried to describe you and collectively gave up. That itself says a lot.',
  consensus: [
    '89% agree you\'re hard to categorize',
    'Most think you operate on a different frequency',
    'Almost everyone has a story about you that starts with "okay so..."'
  ],
  traits: {
    chaos: 65,
    trust: 70,
    humor: 68,
    mystery: 75,
    intelligence: 72,
    emotionalUnpredictability: 60
  },
  quotes: [
    'Chaotic but somehow reliable.',
    'Too much going on in there.',
    'You\'d trust them with your life but not your secrets.',
    'Equal parts confusing and comforting.'
  ],
  shareCardText: 'Officially unclassifiable. Dangerously lovable.',
  socialEnergy: 58,
  mostCommonPerception: 'The one who somehow makes chaos look intentional'
};

const cleanRawText = (text) => {
  // Remove markdown code fences
  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  // Find the first { and last }
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return cleaned;
};

const validateSchema = (obj) => {
  const required = ['archetype', 'summary', 'consensus', 'traits', 'quotes', 'shareCardText'];
  return required.every(key => key in obj);
};

const sanitizeTraits = (traits) => {
  const keys = ['chaos', 'trust', 'humor', 'mystery', 'intelligence', 'emotionalUnpredictability'];
  const result = {};
  keys.forEach(k => {
    const val = Number(traits?.[k]);
    result[k] = isNaN(val) ? 50 : Math.max(0, Math.min(100, val));
  });
  return result;
};

const parseGeminiResponse = (rawText) => {
  try {
    const cleaned = cleanRawText(rawText);
    const parsed = JSON.parse(cleaned);

    if (!validateSchema(parsed)) {
      console.warn('Gemini response missing required fields, using defaults for missing');
      return { ...DEFAULT_REPORT, ...parsed, traits: sanitizeTraits(parsed.traits || {}) };
    }

    return {
      archetype: String(parsed.archetype || DEFAULT_REPORT.archetype).slice(0, 50),
      summary: String(parsed.summary || DEFAULT_REPORT.summary).slice(0, 500),
      consensus: Array.isArray(parsed.consensus) ? parsed.consensus.slice(0, 5).map(c => String(c).slice(0, 200)) : DEFAULT_REPORT.consensus,
      traits: sanitizeTraits(parsed.traits),
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes.slice(0, 6).map(q => String(q).slice(0, 100)) : DEFAULT_REPORT.quotes,
      shareCardText: String(parsed.shareCardText || DEFAULT_REPORT.shareCardText).slice(0, 200),
      socialEnergy: Math.max(0, Math.min(100, Number(parsed.socialEnergy) || 55)),
      mostCommonPerception: String(parsed.mostCommonPerception || DEFAULT_REPORT.mostCommonPerception).slice(0, 200)
    };
  } catch (err) {
    console.error('Failed to parse Gemini response:', err.message);
    console.error('Raw text was:', rawText?.slice(0, 300));
    return DEFAULT_REPORT;
  }
};

module.exports = { parseGeminiResponse };
