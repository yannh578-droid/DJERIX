const { cors, handleOptions, requireClient, generate } = require('./_lib/djerix');

module.exports = async function handler(req, res) {
  cors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
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
    res.status(200).json({ reply });
  } catch (error) {
    console.error('DJERIX writing error', error);
    res.status(error?.status || 500).json({ error: error?.message || 'Erreur de rédaction.' });
  }
};
