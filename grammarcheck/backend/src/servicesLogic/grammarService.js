// ============================================================
//  services/grammarService.js
//
//  Strategy:
//    1. If OPENAI_API_KEY is set → call GPT-4o-mini for rich analysis
//    2. Otherwise              → run a built-in rule-based checker
//
//  Both paths return the same shape:
//  {
//    corrected_text : string,
//    score          : number (0-100),
//    issues         : Issue[]
//  }
//
//  Issue shape:
//  {
//    type       : "grammar" | "spelling" | "punctuation" | "style",
//    message    : string,
//    offset     : number,
//    length     : number,
//    suggestion : string
//  }
// ============================================================

'use strict';

// ─────────────────────────────────────────────────────────────
//  SECTION A — OpenAI path
// ─────────────────────────────────────────────────────────────
async function checkWithOpenAI(text) {
  const OpenAI = require('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `You are a professional grammar and style editor.
Analyse the provided text and return a JSON object with EXACTLY this shape (no markdown, raw JSON only):
{
  "corrected_text": "<fully corrected version of the text>",
  "score": <integer 0-100 reflecting overall grammar quality>,
  "issues": [
    {
      "type": "<grammar|spelling|punctuation|style>",
      "message": "<short human-readable explanation>",
      "offset": <start character index in ORIGINAL text>,
      "length": <number of characters the issue spans in ORIGINAL text>,
      "suggestion": "<replacement text>"
    }
  ]
}
Rules:
- offset and length must reference the ORIGINAL text, not the corrected version.
- Score 100 means perfect; deduct points per issue severity.
- Return an empty issues array and score 100 if the text is already correct.
- Output ONLY valid JSON — no markdown fences, no extra keys.`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: text },
    ],
  });

  const raw = completion.choices[0].message.content;
  const result = JSON.parse(raw);

  // Validate / coerce types to be safe
  return {
    corrected_text: String(result.corrected_text ?? text),
    score:          Math.min(100, Math.max(0, Number(result.score ?? 70))),
    issues:         Array.isArray(result.issues) ? result.issues : [],
  };
}

// ─────────────────────────────────────────────────────────────
//  SECTION B — Rule-based checker (fallback / no API key)
// ─────────────────────────────────────────────────────────────

/**
 * Each rule is:
 * {
 *   type    : issue type,
 *   regex   : RegExp  (flags: 'gi' unless case-sensitive),
 *   message : string | (match) => string,
 *   suggest : string | (match) => string,
 * }
 */
const RULES = [
  // ── Spelling / common misspellings ──────────────────────────
  { type: 'spelling', regex: /\bteh\b/gi,          message: 'Possible spelling mistake', suggest: 'the' },
  { type: 'spelling', regex: /\brecieve\b/gi,       message: 'Possible spelling mistake', suggest: 'receive' },
  { type: 'spelling', regex: /\boccured\b/gi,       message: 'Possible spelling mistake', suggest: 'occurred' },
  { type: 'spelling', regex: /\bseperate\b/gi,      message: 'Possible spelling mistake', suggest: 'separate' },
  { type: 'spelling', regex: /\bdefinate\b/gi,      message: 'Possible spelling mistake', suggest: 'definite' },
  { type: 'spelling', regex: /\bdefinately\b/gi,    message: 'Possible spelling mistake', suggest: 'definitely' },
  { type: 'spelling', regex: /\bneccessary\b/gi,    message: 'Possible spelling mistake', suggest: 'necessary' },
  { type: 'spelling', regex: /\buntill\b/gi,        message: 'Possible spelling mistake', suggest: 'until' },
  { type: 'spelling', regex: /\bwether\b/gi,        message: 'Possible spelling mistake', suggest: 'whether' },
  { type: 'spelling', regex: /\bwich\b/gi,          message: 'Possible spelling mistake', suggest: 'which' },
  { type: 'spelling', regex: /\bthier\b/gi,         message: 'Possible spelling mistake', suggest: 'their' },
  { type: 'spelling', regex: /\baccidently\b/gi,    message: 'Possible spelling mistake', suggest: 'accidentally' },
  { type: 'spelling', regex: /\bbeggining\b/gi,     message: 'Possible spelling mistake', suggest: 'beginning' },
  { type: 'spelling', regex: /\bbeleive\b/gi,       message: 'Possible spelling mistake', suggest: 'believe' },
  { type: 'spelling', regex: /\bexistance\b/gi,     message: 'Possible spelling mistake', suggest: 'existence' },
  { type: 'spelling', regex: /\bforsee\b/gi,        message: 'Possible spelling mistake', suggest: 'foresee' },
  { type: 'spelling', regex: /\bgoverment\b/gi,     message: 'Possible spelling mistake', suggest: 'government' },
  { type: 'spelling', regex: /\bimmediately\b/gi,   message: 'Correct', suggest: 'immediately' },
  { type: 'spelling', regex: /\bimediately\b/gi,    message: 'Possible spelling mistake', suggest: 'immediately' },
  { type: 'spelling', regex: /\bindependent\b/gi,   message: 'Correct', suggest: 'independent' },
  { type: 'spelling', regex: /\bindependant\b/gi,   message: 'Possible spelling mistake', suggest: 'independent' },
  { type: 'spelling', regex: /\bknowledge\b/gi,     message: 'Correct', suggest: 'knowledge' },
  { type: 'spelling', regex: /\bknowlege\b/gi,      message: 'Possible spelling mistake', suggest: 'knowledge' },
  { type: 'spelling', regex: /\blibary\b/gi,        message: 'Possible spelling mistake', suggest: 'library' },
  { type: 'spelling', regex: /\bmaneger\b/gi,       message: 'Possible spelling mistake', suggest: 'manager' },
  { type: 'spelling', regex: /\boccasion\b/gi,      message: 'Correct', suggest: 'occasion' },
  { type: 'spelling', regex: /\boccasion\b/gi,      message: 'Correct', suggest: 'occasion' },
  { type: 'spelling', regex: /\bpersue\b/gi,        message: 'Possible spelling mistake', suggest: 'pursue' },
  { type: 'spelling', regex: /\bpriveledge\b/gi,    message: 'Possible spelling mistake', suggest: 'privilege' },
  { type: 'spelling', regex: /\bprivelege\b/gi,     message: 'Possible spelling mistake', suggest: 'privilege' },
  { type: 'spelling', regex: /\brecommend\b/gi,     message: 'Correct', suggest: 'recommend' },
  { type: 'spelling', regex: /\brecomend\b/gi,      message: 'Possible spelling mistake', suggest: 'recommend' },
  { type: 'spelling', regex: /\bsucceed\b/gi,       message: 'Correct', suggest: 'succeed' },
  { type: 'spelling', regex: /\bsuccede\b/gi,       message: 'Possible spelling mistake', suggest: 'succeed' },
  { type: 'spelling', regex: /\btomarrow\b/gi,      message: 'Possible spelling mistake', suggest: 'tomorrow' },
  { type: 'spelling', regex: /\btomorrow\b/gi,      message: 'Correct', suggest: 'tomorrow' },
  { type: 'spelling', regex: /\bwierd\b/gi,         message: 'Possible spelling mistake', suggest: 'weird' },
  { type: 'spelling', regex: /\bwritting\b/gi,      message: 'Possible spelling mistake', suggest: 'writing' },
  { type: 'spelling', regex: /\byesterday\b/gi,     message: 'Correct', suggest: 'yesterday' },
  { type: 'spelling', regex: /\byestarday\b/gi,     message: 'Possible spelling mistake', suggest: 'yesterday' },

  // ── Grammar ──────────────────────────────────────────────────
  { type: 'grammar', regex: /\ba\s+[aeiou]/gi,
    message: 'Use "an" before words starting with a vowel sound',
    suggest: (m) => m.replace(/\ba\s+/i, 'an ') },
  { type: 'grammar', regex: /\bi\s+(was|were|is|am|have|had|do|did|can|could|will|would|should|shall|may|might|must)\b/gi,
    message: 'The pronoun "I" should always be capitalised',
    suggest: (m) => m.replace(/^i\s/i, 'I ') },
  { type: 'grammar', regex: /\bcan not\b/gi,    message: '"Cannot" is one word',       suggest: 'cannot' },
  { type: 'grammar', regex: /\bshould of\b/gi,  message: 'Should be "should have"',    suggest: 'should have' },
  { type: 'grammar', regex: /\bwould of\b/gi,   message: 'Should be "would have"',     suggest: 'would have' },
  { type: 'grammar', regex: /\bcould of\b/gi,   message: 'Should be "could have"',     suggest: 'could have' },
  { type: 'grammar', regex: /\bmight of\b/gi,   message: 'Should be "might have"',     suggest: 'might have' },
  { type: 'grammar', regex: /\bmust of\b/gi,    message: 'Should be "must have"',      suggest: 'must have' },
  { type: 'grammar', regex: /\bits'\b/gi,       message: '"Its\'" is not standard; use "its" (possessive) or "it\'s" (it is)', suggest: "its" },
  { type: 'grammar', regex: /\byour\s+(going|coming|doing|making|taking|getting|giving)\b/gi,
    message: 'Did you mean "you\'re" (you are)?',
    suggest: (m) => m.replace(/^your\s/i, "you're ") },
  { type: 'grammar', regex: /\bthey're\s+(car|house|book|dog|idea|plan|work|job|team)\b/gi,
    message: 'Did you mean "their" (possessive)?',
    suggest: (m) => m.replace(/^they're\s/i, 'their ') },
  { type: 'grammar', regex: /\bthere\s+(going|coming|doing|making|eating|sleeping)\b/gi,
    message: 'Did you mean "they\'re" (they are)?',
    suggest: (m) => m.replace(/^there\s/i, "they're ") },
  { type: 'grammar', regex: /\bless\s+(\w+s)\b/gi,
    message: 'Use "fewer" for countable nouns',
    suggest: (m) => m.replace(/^less\s/i, 'fewer ') },
  { type: 'grammar', regex: /\bbetween\s+\w+\s+and\s+I\b/gi,
    message: 'Use "me" (object pronoun) after "between"',
    suggest: (m) => m.replace(/\bI$/, 'me') },
  { type: 'grammar', regex: /\balot\b/gi,       message: '"A lot" is two words',        suggest: 'a lot' },
  { type: 'grammar', regex: /\bnoone\b/gi,      message: '"No one" is two words',       suggest: 'no one' },
  { type: 'grammar', regex: /\beverytime\b/gi,  message: '"Every time" is two words',   suggest: 'every time' },
  { type: 'grammar', regex: /\binfact\b/gi,     message: '"In fact" is two words',      suggest: 'in fact' },
  { type: 'grammar', regex: /\batleast\b/gi,    message: '"At least" is two words',     suggest: 'at least' },
  { type: 'grammar', regex: /\bwho\s+I\s+(saw|met|called|know|like)\b/gi,
    message: 'Use "whom" as the object of a verb',
    suggest: (m) => m.replace(/^who\s/, 'whom ') },

  // ── Punctuation ───────────────────────────────────────────────
  { type: 'punctuation', regex: /\s,/g,           message: 'Remove space before comma',       suggest: (m) => m.trim() + ',' },
  { type: 'punctuation', regex: /\s\./g,           message: 'Remove space before period',      suggest: (m) => m.trim() + '.' },
  { type: 'punctuation', regex: /,{2,}/g,          message: 'Multiple commas in a row',        suggest: ',' },
  { type: 'punctuation', regex: /\.{4,}/g,         message: 'Use three dots for an ellipsis',  suggest: '...' },
  { type: 'punctuation', regex: /!{2,}/g,          message: 'Avoid multiple exclamation marks', suggest: '!' },
  { type: 'punctuation', regex: /\?{2,}/g,         message: 'Avoid multiple question marks',   suggest: '?' },
  { type: 'punctuation', regex: /[A-Z][^.!?]*[^.!?\s]\s{2,}[A-Z]/g,
    message: 'Consider ending the sentence with a period',
    suggest: (m) => m },  // informational

  // ── Style ─────────────────────────────────────────────────────
  { type: 'style', regex: /\bvery\s+very\b/gi,      message: 'Redundant "very very" — use a stronger adjective', suggest: 'very' },
  { type: 'style', regex: /\bbasically\b/gi,         message: '"Basically" is often filler — consider removing it', suggest: '' },
  { type: 'style', regex: /\bliterally\b/gi,         message: '"Literally" is often used incorrectly or as filler',  suggest: '' },
  { type: 'style', regex: /\bjust\s+just\b/gi,       message: 'Repeated "just"',                                    suggest: 'just' },
  { type: 'style', regex: /\bvery\s+unique\b/gi,     message: '"Unique" is absolute — "very unique" is redundant',   suggest: 'unique' },
  { type: 'style', regex: /\bmore\s+better\b/gi,     message: '"More better" is non-standard; use "better"',         suggest: 'better' },
  { type: 'style', regex: /\bmost\s+worst\b/gi,      message: '"Most worst" is non-standard; use "worst"',           suggest: 'worst' },
  { type: 'style', regex: /\bmost\s+best\b/gi,       message: '"Most best" is non-standard; use "best"',             suggest: 'best' },
  { type: 'style', regex: /\bdue to the fact that\b/gi, message: 'Wordy — consider "because"',                       suggest: 'because' },
  { type: 'style', regex: /\bin order to\b/gi,       message: '"In order to" can often be shortened to "to"',        suggest: 'to' },
  { type: 'style', regex: /\bat this point in time\b/gi, message: 'Wordy — consider "now" or "currently"',           suggest: 'currently' },
  { type: 'style', regex: /\bthe reason why is because\b/gi, message: 'Redundant — use "because" or "the reason is"', suggest: 'because' },
];

/**
 * Apply all rules to `text`, returning non-overlapping issues sorted by offset.
 */
function applyRules(text) {
  const issues = [];
  const usedRanges = [];   // [ [start, end], ... ] to avoid overlapping issues

  for (const rule of RULES) {
    let match;
    // Clone regex to reset lastIndex each rule
    const re = new RegExp(rule.regex.source, rule.regex.flags.includes('g') ? rule.regex.flags : rule.regex.flags + 'g');

    while ((match = re.exec(text)) !== null) {
      const offset = match.index;
      const length = match[0].length;
      const end    = offset + length;

      // Skip if this range overlaps with an already-recorded issue
      const overlaps = usedRanges.some(([s, e]) => offset < e && end > s);
      if (overlaps) continue;

      // Skip "correct" rules (they exist only to prevent false positives from earlier rules)
      const suggest = typeof rule.suggest === 'function'
        ? rule.suggest(match[0])
        : rule.suggest;

      if (suggest === match[0]) continue;  // no change → not really an issue

      usedRanges.push([offset, end]);
      issues.push({
        type:       rule.type,
        message:    typeof rule.message === 'function' ? rule.message(match[0]) : rule.message,
        offset,
        length,
        suggestion: suggest,
      });
    }
  }

  // Sort by position in text
  issues.sort((a, b) => a.offset - b.offset);
  return issues;
}

/**
 * Build corrected_text by applying all suggestions (right-to-left so offsets stay valid).
 */
function buildCorrectedText(text, issues) {
  if (!issues.length) return text;

  // Work right-to-left to preserve offsets
  const sorted = [...issues].sort((a, b) => b.offset - a.offset);
  let result = text;
  for (const issue of sorted) {
    if (!issue.suggestion && issue.suggestion !== '') continue;  // skip informational
    result =
      result.slice(0, issue.offset) +
      issue.suggestion +
      result.slice(issue.offset + issue.length);
  }
  return result;
}

/**
 * Score: start at 100, subtract per-issue penalties.
 * Grammar  → −8, Spelling → −6, Punctuation → −4, Style → −2
 * Minimum score is 0.
 */
function calculateScore(issues) {
  const penalties = { grammar: 8, spelling: 6, punctuation: 4, style: 2 };
  const total = issues.reduce((acc, i) => acc + (penalties[i.type] ?? 5), 0);
  return Math.max(0, 100 - total);
}

function checkWithRules(text) {
  const issues = applyRules(text);
  return {
    corrected_text: buildCorrectedText(text, issues),
    score:          calculateScore(issues),
    issues,
  };
}

// ─────────────────────────────────────────────────────────────
//  PUBLIC API
// ─────────────────────────────────────────────────────────────
async function checkGrammar(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error('Text cannot be blank');
  }
  if (trimmed.length > 10000) {
    throw new Error('Text exceeds the 10 000-character limit');
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      console.log('[grammarService] Using OpenAI path');
      return await checkWithOpenAI(trimmed);
    } catch (err) {
      console.warn('[grammarService] OpenAI call failed, falling back to rule-based:', err.message);
    }
  }

  console.log('[grammarService] Using rule-based path');
  return checkWithRules(trimmed);
}

module.exports = { checkGrammar };
