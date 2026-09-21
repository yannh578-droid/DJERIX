const { MODEL, cors, handleOptions } = require('./_lib/djerix');

module.exports = async function handler(req, res) {
  cors(res);
  if (handleOptions(req, res)) return;
  res.status(200).json({
    ok: true,
    service: 'DJERIX AI',
    model: MODEL,
    keyConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
};
