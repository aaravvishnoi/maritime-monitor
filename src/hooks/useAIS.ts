import { useEffect, useRef } from 'react';
import { RelayService } from '../services/relayService';
import { AISStreamService } from '../services/aisStream';
import { DataDockedService } from '../services/dataDockedService';
import { useMaritimeStore } from '../store/maritimeStore';

const RELAY_WS  = import.meta.env.VITE_RELAY_WS_URL  || 'ws://localhost:3100';
const RELAY_API = import.meta.env.VITE_RELAY_HTTP_URL || 'http://localhost:3100/api/status';

async function relayIsUp(): Promise<boolean> {
  try {
    const res = await fetch(RELAY_API, { signal: AbortSignal.timeout(1_500) });
    return res.ok;
  } catch {
    return false;
  }
}

export function useAIS() {
  const { upsertVessel, batchUpsertVessels, setConnectionStatus } = useMaritimeStore();
  const relayRef   = useRef<RelayService    | null>(null);
  const streamRef  = useRef<AISStreamService | null>(null);
  const dockedRef  = useRef<DataDockedService | null>(null);

  useEffect(() => {
    const streamKey = import.meta.env.VITE_AISSTREAM_API_KEY;
    const dockedKey = import.meta.env.VITE_DATADOCKED_API_KEY;

    // Always seed with mock vessels immediately so the map is never empty.
    // Live data from AISStream / DataDocked will overwrite them as it arrives.
    useMaritimeStore.getState().loadMockVessels();

    void (async () => {
      // ── Try the local relay first ─────────────────────────────────────────
      const useRelay = await relayIsUp();

      if (useRelay) {
        const svc = new RelayService(
          (batch) => batchUpsertVessels(batch),
          (status) => setConnectionStatus(status),
          RELAY_WS,
        );
        relayRef.current = svc;
        svc.connect();
        console.info('[AIS] Using local relay — instant snapshot mode');
      } else {
        // ── Relay not running — connect directly to AISStream ──────────────
        if (streamKey && streamKey !== 'your_key_here') {
          const svc = new AISStreamService(
            streamKey,
            (v) => upsertVessel(v),
            (status) => setConnectionStatus(status),
          );
          streamRef.current = svc;
          svc.connect();
          console.info('[AIS] Using direct AISStream connection');
        }
      }

      // ── DataDocked satellite AIS always runs alongside ────────────────────
      if (dockedKey && dockedKey !== 'your_key_here') {
        const svc = new DataDockedService(dockedKey, (v) => upsertVessel(v));
        dockedRef.current = svc;
        svc.start(10 * 60_000);
      }
    })();

    // Prune vessels not seen in 10 minutes
    const pruneInterval = setInterval(() => {
      useMaritimeStore.getState().removeStaleVessels(600_000);
    }, 60_000);

    return () => {
      relayRef.current?.disconnect();
      streamRef.current?.disconnect();
      dockedRef.current?.stop();
      clearInterval(pruneInterval);
    };
  }, []);
}
