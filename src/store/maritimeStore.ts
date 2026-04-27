import { create } from 'zustand';
import { Vessel, Port, LayerVisibility, MaritimeNews } from '../types';
import { MOCK_VESSELS } from '../data/mockVessels';

interface MaritimeState {
  vessels: Map<string, Vessel>;
  selectedVessel: Vessel | null;
  selectedPort: Port | null;
  layers: LayerVisibility;
  news: MaritimeNews[];
  connectionStatus: 'disconnected' | 'connecting' | 'live' | 'demo';
  liveVesselCount: number;
  sidebarOpen: boolean;
  newsPanelOpen: boolean;

  flyToFn: ((lat: number, lng: number) => void) | null;

  // actions
  upsertVessel: (vessel: Vessel) => void;
  batchUpsertVessels: (batch: Vessel[]) => void;
  removeStaleVessels: (maxAgeMs?: number) => void;
  selectVessel: (vessel: Vessel | null) => void;
  selectPort: (port: Port | null) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setConnectionStatus: (status: MaritimeState['connectionStatus']) => void;
  setNews: (news: MaritimeNews[]) => void;
  setSidebarOpen: (open: boolean) => void;
  setNewsPanelOpen: (open: boolean) => void;
  loadMockVessels: () => void;
  registerFlyTo: (fn: (lat: number, lng: number) => void) => void;
}

export const useMaritimeStore = create<MaritimeState>((set, get) => ({
  vessels: new Map(),
  selectedVessel: null,
  selectedPort: null,
  flyToFn: null,
  layers: {
    vessels: true,
    ports: true,
    shippingLanes: true,
    piracyZones: true,
    trafficDensity: false,
    chokepoints: true,
    mpas: false,
    accidents: false,
    harbors: false,
    oceanLabels: false,
  },
  news: [],
  connectionStatus: 'disconnected',
  liveVesselCount: 0,
  sidebarOpen: true,
  newsPanelOpen: false,

  upsertVessel: (vessel) =>
    set((state) => {
      const next = new Map(state.vessels);
      next.set(vessel.mmsi, vessel);
      return { vessels: next, liveVesselCount: next.size };
    }),

  batchUpsertVessels: (batch) =>
    set((state) => {
      const next = new Map(state.vessels);
      for (const v of batch) next.set(v.mmsi, v);
      return { vessels: next, liveVesselCount: next.size };
    }),

  removeStaleVessels: (maxAgeMs = 600_000) =>
    set((state) => {
      const now = Date.now();
      const next = new Map(state.vessels);
      for (const [mmsi, v] of next) {
        if (now - v.lastUpdate > maxAgeMs) next.delete(mmsi);
      }
      return { vessels: next, liveVesselCount: next.size };
    }),

  selectVessel: (vessel) =>
    set({ selectedVessel: vessel, selectedPort: null }),

  selectPort: (port) =>
    set({ selectedPort: port, selectedVessel: null }),

  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setNews: (news) => set({ news }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setNewsPanelOpen: (open) => set({ newsPanelOpen: open }),

  loadMockVessels: () => {
    const map = new Map<string, Vessel>();
    for (const v of MOCK_VESSELS) map.set(v.mmsi, v);
    set({ vessels: map, liveVesselCount: map.size, connectionStatus: 'demo' });
  },

  registerFlyTo: (fn) => set({ flyToFn: fn }),
}));
