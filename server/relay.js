// AIS Relay Server
// Maintains a persistent connection to AISStream.io and caches all vessels.
// Clients connect here instead of AISStream directly — they get an instant
// snapshot of every vessel seen since the relay started, plus a live stream.
//
// Usage: node server/relay.js
// Env:   VITE_AISSTREAM_API_KEY (read from .env automatically)

import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Load .env manually (no dotenv dep needed) ─────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const env = readFileSync(resolve(__dirname, '../.env'), 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
} catch { /* no .env — rely on real env vars */ }

const API_KEY = process.env.VITE_AISSTREAM_API_KEY || process.env.AISSTREAM_API_KEY;
const PORT    = Number(process.env.RELAY_PORT) || 3100;

if (!API_KEY || API_KEY === 'your_key_here') {
  console.error('[relay] No VITE_AISSTREAM_API_KEY set — exiting');
  process.exit(1);
}

// ── Vessel store ──────────────────────────────────────────────────────────────
const vessels = new Map(); // mmsi → compact vessel object

function cleanName(raw) {
  if (!raw) return undefined;
  return raw.replace(/[@_]+/g, ' ').replace(/\s+/g, ' ').trim() || undefined;
}

function parseMessage(msg) {
  const meta = msg.MetaData;
  if (!meta) return null;
  const mmsi = String(meta.MMSI);

  if (msg.MessageType === 'PositionReport' && msg.Message?.PositionReport) {
    const pr = msg.Message.PositionReport;
    const existing = vessels.get(mmsi) || {};
    return {
      ...existing,
      mmsi,
      name: cleanName(meta.ShipName) || existing.name || `Vessel ${mmsi}`,
      lat: pr.Latitude ?? meta.latitude,
      lon: pr.Longitude ?? meta.longitude,
      speed: pr.Sog ?? 0,
      heading: pr.TrueHeading ?? pr.Cog ?? 0,
      cog: pr.Cog ?? 0,
      navStatus: pr.NavigationalStatus ?? 15,
      typeCode: existing.typeCode ?? 0,
      lastUpdate: Date.now(),
    };
  }

  if (msg.MessageType === 'ShipStaticData' && msg.Message?.ShipStaticData) {
    const sd = msg.Message.ShipStaticData;
    const dim = sd.Dimension;
    const existing = vessels.get(mmsi) || {};
    return {
      ...existing,
      mmsi,
      name: cleanName(sd.Name) || cleanName(meta.ShipName) || existing.name || `Vessel ${mmsi}`,
      typeCode: sd.Type ?? existing.typeCode ?? 0,
      destination: sd.Destination?.trim() || existing.destination,
      callsign: sd.CallSign?.trim() || existing.callsign,
      imo: sd.ImoNumber ? String(sd.ImoNumber) : existing.imo,
      length: dim ? dim.A + dim.B : existing.length,
      beam:   dim ? dim.C + dim.D : existing.beam,
      draft:  sd.MaximumStaticDraught ?? existing.draft,
      lat: existing.lat ?? meta.latitude,
      lon: existing.lon ?? meta.longitude,
      speed: existing.speed ?? 0,
      heading: existing.heading ?? 0,
      cog: existing.cog ?? 0,
      navStatus: existing.navStatus ?? 15,
      lastUpdate: Date.now(),
    };
  }

  return null;
}

// ── Browser WebSocket clients ─────────────────────────────────────────────────
const clients = new Set();

function broadcast(vessel) {
  const payload = JSON.stringify({ type: 'vessel', vessel });
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) ws.send(payload);
  }
}

// ── AISStream connection ──────────────────────────────────────────────────────
let aisWs = null;
let reconnectTimer = null;
let reconnectDelay = 5_000;

function connectAIS() {
  console.log('[relay] Connecting to AISStream.io…');
  aisWs = new WebSocket('wss://stream.aisstream.io/v0/stream');

  aisWs.on('open', () => {
    console.log('[relay] AISStream connected');
    reconnectDelay = 5_000;
    aisWs.send(JSON.stringify({
      APIKey: API_KEY,
      BoundingBoxes: [[[-90, -180], [90, 180]]],
      FilterMessageTypes: ['PositionReport', 'ShipStaticData'],
    }));
  });

  aisWs.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const vessel = parseMessage(msg);
      if (!vessel) return;
      vessels.set(vessel.mmsi, vessel);
      broadcast(vessel);
    } catch { /* skip malformed */ }
  });

  aisWs.on('close', () => {
    console.log(`[relay] AISStream disconnected — retry in ${reconnectDelay / 1000}s`);
    reconnectTimer = setTimeout(() => {
      reconnectDelay = Math.min(reconnectDelay * 2, 60_000);
      connectAIS();
    }, reconnectDelay);
  });

  aisWs.on('error', () => aisWs.close());
}

// ── HTTP + WebSocket server ───────────────────────────────────────────────────
const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.url === '/api/vessels') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(Array.from(vessels.values())));
    return;
  }

  if (req.url === '/api/status') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      vessels: vessels.size,
      aisConnected: aisWs?.readyState === WebSocket.OPEN,
      clients: clients.size,
    }));
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[relay] Client connected (${clients.size} total)`);

  // Send full snapshot immediately so the client isn't empty
  ws.send(JSON.stringify({
    type: 'snapshot',
    vessels: Array.from(vessels.values()),
  }));

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[relay] Client disconnected (${clients.size} remaining)`);
  });
});

// ── Prune vessels not seen in 10 minutes ─────────────────────────────────────
setInterval(() => {
  const cutoff = Date.now() - 10 * 60_000;
  let pruned = 0;
  for (const [mmsi, v] of vessels) {
    if (v.lastUpdate < cutoff) { vessels.delete(mmsi); pruned++; }
  }
  if (pruned > 0) console.log(`[relay] Pruned ${pruned} stale vessels (${vessels.size} remaining)`);
}, 60_000);

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`[relay] Listening on http://localhost:${PORT}`);
  console.log(`[relay] Snapshot: http://localhost:${PORT}/api/vessels`);
  console.log(`[relay] Status:   http://localhost:${PORT}/api/status`);
});

connectAIS();
