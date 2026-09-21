const { cors, handleOptions, requireClient, generate } = require('./_lib/djerix');

module.exports = async function handler(req, res) {
  cors(res);
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée.' });
  try {
    if (!requireClient(res)) return;
    const { text, target = 'en' } = req.body || {};
    if (!text?.trim()) return res.status(400).json({ error: 'Texte manquant.' });
    const targetLanguage = target === 'en' ? 'English' : 'French';
    const reply = await generate(`Traduis le texte vers ${targetLanguage}. Retourne uniquement la traduction, sans introduction ni commentaire.`, text, 1800);
    res.status(200).json({ reply });
  } catch (error) {
    console.error('DJERIX translation error', error);
    res.status(error?.status || 500).json({ error: error?.message || 'Erreur de traduction.' });
  }
};
