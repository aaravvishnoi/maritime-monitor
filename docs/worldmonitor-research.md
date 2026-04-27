# WorldMonitor — Research Notes (Maritime Focus)
Date: 2026-04-26

---

## What is WorldMonitor?

World Monitor is an open-source, real-time situational-awareness platform. It aggregates 65+ external data sources onto an interactive 3D globe / flat map with 45+ toggleable layers and 60+ intelligence panels. The codebase is AGPL-3.0 licensed; commercial use requires a separate license.

- Live app: https://www.worldmonitor.app
- Primary repo: https://github.com/koala73/worldmonitor
- Docs: https://www.worldmonitor.app/docs/documentation
- Dev/API blog: https://www.worldmonitor.app/blog/posts/build-on-worldmonitor-developer-api-open-source/

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | TypeScript, React, Vite (SPA)                   |
| Maps        | deck.gl + MapLibre (WebGL2) / SVG fallback       |
| 3D Globe    | globe.gl, Three.js                              |
| Edge API    | 60+ Vercel Edge Functions                       |
| Relay/WS    | Node.js on Railway (WebSocket / OSINT polling)  |
| Desktop     | Tauri (Rust)                                    |
| Caching     | Redis                                           |
| Browser ML  | Transformers.js, ONNX Runtime Web               |
| Testing     | Vitest, Playwright                              |
| i18n        | i18next — 21 locales, RTL support               |

---

## API Architecture

- **Proto-first**: 92 proto files, 22 typed service domains
- **Base URL**: `api.worldmonitor.app/api/{domain}/v1/{rpc}`
- Auto-generated TypeScript clients + OpenAPI docs
- No API key required for public endpoints; free usage
- Multi-language via OpenAPI specs (Swift, Kotlin, Python, Go, Java)

---

## WorldMonitor Maritime Domain

| Domain       | Key Data                                               |
|--------------|--------------------------------------------------------|
| **Maritime** | Vessel positions, port status, dark vessel detection   |
| Military     | AIS vessels, naval bases, USNI reports                 |
| Conflict     | ACLED events, hotspot scoring (relevant to piracy)     |
| Climate      | Temperature anomalies, sea level                       |
| News         | RSS aggregation (shipping news feeds)                  |
| Intelligence | CII scores, convergence events                         |

### AIS Source
- Provider: **AISStream.io** (terrestrial receivers via WebSocket)
- Strong coverage: European waters, Atlantic, major ports
- Weak coverage: Middle East, open ocean, remote coasts (~50km shore range limit)

### Chokepoint Monitoring (built into WorldMonitor relay)
1. Strait of Hormuz
2. Suez Canal
3. Strait of Malacca
4. Bab el-Mandeb
5. Panama Canal
6. Taiwan Strait
7. South China Sea
8. Turkish Straits

Vessel classification at chokepoints uses MMSI prefixes, ship type codes, and name patterns.

### AIS Density Grid
- 2°×2° geographic cells, 30-minute rolling windows
- Produces traffic density heatmap → feeds convergence detection

### Ports: 62 strategic ports monitored worldwide

### Route Explorer (CMD+K)
- Full-screen workflow: origin → destination + commodity
- Resolves chokepoint exposures, alternative corridors, land bridges, country-level impact

---

## Our Project Data Scope

Three data categories defined. Greyed-out items = planned / lower priority.

### Earth Data
| Item                        | Priority  |
|-----------------------------|-----------|
| Ocean Names & Borders       | Active    |
| Continent Names & Borders   | Active    |
| Port Countries              | Active    |
| Latitudes and Longitudes    | Active    |
| Ocean Currents              | Active    |
| Bathymetric Contours        | Future    |
| Seabed Topography           | Future    |
| Marine Migration Routes     | Future    |
| Climate Change Impact Zones | Future    |

### Shipping Data
| Item                          | Priority  |
|-------------------------------|-----------|
| Vessel Traffic Density        | Active    |
| Shipping Routes and Lanes     | Active    |
| Major Ports                   | Active    |
| Major Harbors                 | Active    |
| Shipping News and Updates     | Active    |
| Piracy Prone Regions          | Active    |
| Maritime Accidents/Collisions | Active    |
| Marine Protected Areas (MPAs) | Future    |

### Vessel Data
| Item                           | Priority  |
|--------------------------------|-----------|
| Real-time Tracking Coordinates | Active    |
| Vessel Name and Type           | Active    |
| Flag State                     | Active    |
| Vessel Specifications          | Active    |
| Vessel Status and Speed        | Active    |
| Estimated Time of Arrival (ETA)| Active    |
| Previous and Future Port Calls | Active    |
| Vessel Rating and Reviews      | Active    |
| Maritime Regulations Compliance| Active    |

---

## Core Components (Relevant to Maritime Build)

| Component          | Role                                                    |
|--------------------|---------------------------------------------------------|
| App.ts             | Root orchestrator, global state                         |
| DataLoaderManager  | Parallel fetching, circuit breaker management           |
| MapContainer       | Renderer selection (DeckGLMap / MapComponent / Globe)   |
| PanelLayoutManager | Grid layout, drag-and-drop, panel gating                |
| MLWorker           | Off-thread summarisation                                |

### Map Renderers
- **DeckGLMap**: WebGL2, desktop performance
- **MapComponent**: SVG fallback, mobile/low-power
- **GlobeMap**: 3D globe option

---

## Relevant External Maritime APIs

| Service               | Notes                                              | URL                                |
|-----------------------|----------------------------------------------------|------------------------------------|
| AISStream.io          | WorldMonitor's AIS source (WebSocket)              | https://aisstream.io               |
| MarineTraffic         | Global AIS, port calls, vessel history             | https://marinetraffic.com          |
| VesselAPI             | Real-time AIS tracking                             | https://vesselapi.com              |
| Datalastic            | AIS + marine location API                          | https://datalastic.com             |
| Global Fishing Watch  | Open fishing/dark vessel API                       | https://globalfishingwatch.org     |
| FleetMon              | Live AIS with ship/port database                   | https://fleetmon.com               |
| NavAPI                | AIS positions, historical tracks                   | https://navapi.com                 |
| Lloyd's List          | Premium maritime intelligence                      | https://lloydslistintelligence.com |

---

## Licensing

- WorldMonitor source: **AGPL-3.0** — derivatives distributed/hosted publicly must also be AGPL-3.0 or obtain a commercial license
- Public API endpoints: free, no key required
