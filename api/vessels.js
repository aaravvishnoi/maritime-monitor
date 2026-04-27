export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { lat, lon, radius = 100 } = req.query;
  if (!lat || !lon) { res.status(400).json({ error: 'lat and lon required' }); return; }

  const apiKey = process.env.VITE_DATADOCKED_API_KEY;
  const url = `https://datadocked.com/api/vessels_operations/get-vessels-by-area` +
    `?latitude=${lat}&longitude=${lon}&circle_radius=${radius}`;

  try {
    const upstream = await fetch(url, { headers: { 'x-api-key': apiKey } });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: String(err) });
  }
}
