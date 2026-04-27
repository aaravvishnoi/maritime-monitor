import { useEffect } from 'react';
import { Header } from './components/UI/Header';
import { StatusBar } from './components/UI/StatusBar';
import { Sidebar } from './components/Sidebar/Sidebar';
import { GlobeContainer } from './components/Globe/GlobeContainer';
import { VesselDetailPanel } from './components/Panels/VesselDetailPanel';
import { PortDetailPanel } from './components/Panels/PortDetailPanel';
import { NewsPanel } from './components/Panels/NewsPanel';
import { useAIS } from './hooks/useAIS';
import { useMaritimeStore } from './store/maritimeStore';

export default function App() {
  useAIS();

  const { selectedVessel, selectedPort } = useMaritimeStore();

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar />
        <div className="flex-1 relative min-w-0">
          <GlobeContainer />
        </div>
        {selectedVessel && <VesselDetailPanel />}
        {selectedPort && !selectedVessel && <PortDetailPanel />}
        <NewsPanel />
      </div>
      <StatusBar />
    </div>
  );
}
