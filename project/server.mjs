import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5174;

// Allowlist of demo lab domains
const ALLOWLIST = [
  'testphp.vulnweb.com',
  'juice-shop.herokuapp.com',
  'juice-shop.github.io',
  'badssl.com'
];

app.use(cors());

app.get('/proxy', async (req, res) => {
  try {
    const target = req.query.url;
    if (!target || typeof target !== 'string') {
      return res.status(400).send('Missing url param');
    }

    const urlObj = new URL(target);
    if (!ALLOWLIST.includes(urlObj.hostname)) {
      return res.status(403).send('Domain not allowed');
    }

    const upstream = await fetch(target, { redirect: 'follow' });

    // Copy headers but strip frame-blocking
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (['x-frame-options', 'content-security-policy'].includes(lower)) return;
      res.setHeader(key, value);
    });

    // Force permissive frame headers for demo
    res.setHeader('X-Frame-Options', '');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' *");

    const body = await upstream.arrayBuffer();
    res.status(upstream.status).send(Buffer.from(body));
  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
