import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.DJERIX_MODEL || 'gpt-5.6-luna';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(ROOT_DIR));

const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

const BASE_INSTRUCTIONS = `
Tu es DJERIX, l'assistant IA de DJERIX Technologies.
Réponds dans la langue demandée par l'utilisateur (français ou anglais).
Sois clair, naturel, précis et utile. Ne prétends jamais avoir effectué une action que tu n'as pas effectuée.
`;

function requireClient(res) {
  if (!client) {
    res.status(503).json({ error: 'La clé API de DJERIX n’est pas configurée sur le serveur.' });
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

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'DJERIX AI', keyConfigured: Boolean(apiKey), model: MODEL });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!requireClient(res)) return;
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const language = req.body.language === 'en' ? 'English' : 'French';
    const safeMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20);
    if (!safeMessages.length) return res.status(400).json({ error: 'Aucun message fourni.' });
    const reply = await generate(
      `Réponds en ${language}.`,
      safeMessages.map(m => ({ role: m.role, content: m.content }))
    );
    res.json({ reply });
  } catch (error) {
    console.error('DJERIX API error:', { status: error?.status, code: error?.code, message: error?.message });
    res.status(error?.status || 500).json({ error: error?.message || 'Impossible de contacter DJERIX pour le moment.' });
  }
});

app.post('/api/writing', async (req, res) => {
  try {
    if (!requireClient(res)) return;
    const { text, action, language = 'fr' } = req.body || {};
    if (!text?.trim()) return res.status(400).json({ error: 'Texte manquant.' });
    const lang = language === 'en' ? 'English' : 'French';
    const tasks = {
      improve: language === 'en' ? 'Improve this text with a clear, natural and professional style.' : 'Améliore ce texte avec un style clair, naturel et professionnel.',
      summarize: language === 'en' ? 'Summarize this text while preserving the essential ideas.' : 'Résume ce texte en conservant les idées essentielles.',
      correct: language === 'en' ? 'Correct grammar, spelling and phrasing without changing the meaning.' : 'Corrige la grammaire, l’orthographe et la formulation sans changer le sens.'
    };
    const instruction = tasks[action] || tasks.improve;
    const reply = await generate(`Effectue la tâche suivante en ${lang}: ${instruction}\nRetourne uniquement le texte final.`, text);
    res.json({ reply });
  } catch (error) {
    console.error('DJERIX writing error:', error);
    res.status(error?.status || 500).json({ error: error?.message || 'Erreur de rédaction.' });
  }
});

app.post('/api/translate', async (req, res) => {
  try {
    if (!requireClient(res)) return;
    const { text, target = 'en' } = req.body || {};
    if (!text?.trim()) return res.status(400).json({ error: 'Texte manquant.' });
    const targetLanguage = target === 'en' ? 'English' : 'French';
    const reply = await generate(
      `Translate the text into ${targetLanguage}. Return only the translation, with no introduction or commentary.`,
      text,
      1800
    );
    res.json({ reply });
  } catch (error) {
    console.error('DJERIX translation error:', error);
    res.status(error?.status || 500).json({ error: error?.message || 'Erreur de traduction.' });
  }
});

app.listen(PORT, () => console.log(`DJERIX est lancé sur http://localhost:${PORT}`));
