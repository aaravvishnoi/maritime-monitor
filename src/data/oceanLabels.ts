import { OceanLabel } from '../types';

export const OCEAN_LABELS: OceanLabel[] = [
  // Oceans
  { name: 'PACIFIC OCEAN', lat: 5, lon: -150, type: 'ocean' },
  { name: 'ATLANTIC OCEAN', lat: 15, lon: -30, type: 'ocean' },
  { name: 'INDIAN OCEAN', lat: -20, lon: 75, type: 'ocean' },
  { name: 'ARCTIC OCEAN', lat: 85, lon: 0, type: 'ocean' },
  { name: 'SOUTHERN OCEAN', lat: -60, lon: 0, type: 'ocean' },

  // Seas
  { name: 'Mediterranean Sea', lat: 36, lon: 15, type: 'sea' },
  { name: 'Caribbean Sea', lat: 15, lon: -73, type: 'sea' },
  { name: 'South China Sea', lat: 12, lon: 114, type: 'sea' },
  { name: 'Arabian Sea', lat: 16, lon: 63, type: 'sea' },
  { name: 'Bay of Bengal', lat: 15, lon: 88, type: 'sea' },
  { name: 'Red Sea', lat: 22, lon: 38, type: 'sea' },
  { name: 'Black Sea', lat: 43, lon: 34, type: 'sea' },
  { name: 'North Sea', lat: 56, lon: 4, type: 'sea' },
  { name: 'Baltic Sea', lat: 58, lon: 19, type: 'sea' },
  { name: 'Coral Sea', lat: -17, lon: 155, type: 'sea' },
  { name: 'Tasman Sea', lat: -38, lon: 160, type: 'sea' },
  { name: 'Bering Sea', lat: 58, lon: -175, type: 'sea' },
  { name: 'Sea of Japan', lat: 40, lon: 135, type: 'sea' },
  { name: 'Gulf of Guinea', lat: 2, lon: 3, type: 'sea' },
  { name: 'Gulf of Mexico', lat: 25, lon: -90, type: 'gulf' },
  { name: 'Persian Gulf', lat: 26.5, lon: 51, type: 'gulf' },
  { name: 'Gulf of Aden', lat: 12, lon: 48, type: 'gulf' },

  // Continents
  { name: 'AFRICA', lat: 5, lon: 22, type: 'continent' },
  { name: 'EUROPE', lat: 54, lon: 15, type: 'continent' },
  { name: 'ASIA', lat: 45, lon: 90, type: 'continent' },
  { name: 'NORTH AMERICA', lat: 48, lon: -100, type: 'continent' },
  { name: 'SOUTH AMERICA', lat: -15, lon: -58, type: 'continent' },
  { name: 'AUSTRALIA', lat: -25, lon: 134, type: 'continent' },
  { name: 'ANTARCTICA', lat: -80, lon: 0, type: 'continent' },
];
