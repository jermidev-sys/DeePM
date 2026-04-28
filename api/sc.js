// Vercel serverless proxy для SoundCloud API v2 (обход CORS)
// Использование: /api/sc?path=search/tracks&q=...&client_id=...

export default async function handler(req, res) {
  try {
    const { path, ...rest } = req.query;
    if (!path) {
      res.status(400).json({ error: 'missing path' });
      return;
    }
    const qs = new URLSearchParams(rest).toString();
    const url = `https://api-v2.soundcloud.com/${path}${qs ? '?' + qs : ''}`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const text = await r.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', r.headers.get('content-type') || 'application/json');
    res.status(r.status).send(text);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: String(e) });
  }
}
