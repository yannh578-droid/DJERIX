const OpenAI = require('openai');

const MODEL = process.env.DJERIX_MODEL || 'gpt-5.6-luna';
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const BASE_INSTRUCTIONS = `
Tu es DJERIX, l'assistant IA de DJERIX Technologies.
Réponds dans la langue demandée par l'utilisateur (français ou anglais).
Sois clair, naturel, précis et utile. Ne prétends jamais avoir effectué une action que tu n'as pas effectuée.
`;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://yannh578-droid.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function handleOptions(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

function requireClient(res) {
  if (!client) {
    res.status(503).json({ error: 'La clé API DJERIX n’est pas configurée sur le serveur.' });
    return false;
  }
  return true;
}

async function generate(instructions, input, maxOutputTokens = 1400) {
  const response = await client.responses.create({
    model: MODEL,
    instructions: BASE_INSTRUCTIONS + '\n' + instructions,
    input,
    max_output_tokens: maxOutputTokens
  });
  return response.output_text || '';
}

module.exports = { MODEL, client, cors, handleOptions, requireClient, generate };
