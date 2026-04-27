# MaritimeMonitor

A focused maritime intelligence dashboard built on top of the WorldMonitor platform.

## Goal

Provide real-time, map-first situational awareness for maritime activity — vessels, ports, shipping lanes, piracy zones, and incidents — stripped of all non-maritime layers.

## Data Categories

### Earth Data
- Ocean Names & Borders
- Continent Names & Borders
- Port Countries
- Latitudes and Longitudes
- Ocean Currents
- _(Future)_ Bathymetric Contours
- _(Future)_ Seabed Topography
- _(Future)_ Marine Migration Routes
- _(Future)_ Climate Change Impact Zones

### Shipping Data
- Vessel Traffic Density
- Shipping Routes and Lanes
- Major Ports
- Major Harbors
- Shipping News and Updates
- Piracy Prone Regions
- Maritime Accidents and Collisions
- _(Future)_ Marine Protected Areas (MPAs)

### Vessel Data
- Real-time Tracking Coordinates
- Vessel Name and Type
- Flag State
- Vessel Specifications
- Vessel Status and Speed
- Estimated Time of Arrival (ETA)
- Previous and Future Port Calls
- Vessel Rating and Reviews
- Maritime Regulations Compliance

## Backbone

Built using [WorldMonitor](https://github.com/koala73/worldmonitor) as the foundation.
See `docs/worldmonitor-research.md` for full technical research.

## Structure

```
MaritimeMonitor/
├── PROJECT.md
├── docs/
│   └── worldmonitor-research.md   # Full WorldMonitor research + data scope
├── src/                            # Source code (TBD)
├── api/                            # API layer / edge functions (TBD)
└── assets/                         # Icons, map assets (TBD)
```
