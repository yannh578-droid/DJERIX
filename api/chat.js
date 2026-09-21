const { MODEL, cors, handleOptions, requireClient, generate } = require('./_lib/djerix');

module.exports = async function handler(req, res) {
  cors(res);
  if (handleOptions(req, res)) return;
  if (req.method === 'GET') return res.status(200).json({ ok: true, service: 'DJERIX AI', model: MODEL, keyConfigured: Boolean(process.env.OPENAI_API_KEY) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  try {
    if (!requireClient(res)) return;
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const language = req.body?.language === 'en' ? 'English' : 'French';
    const safeMessages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-20);
    if (!safeMessages.length) return res.status(400).json({ error: 'Aucun message fourni.' });
    const reply = await generate(`Réponds en ${language}.`, safeMessages.map(m => ({ role: m.role, content: m.content })));
    res.status(200).json({ reply });
  } catch (error) {
    console.error('DJERIX chat error', error);
    res.status(error?.status || 500).json({ error: error?.message || 'Impossible de contacter DJERIX.' });
  }
};
