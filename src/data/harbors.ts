import { Harbor } from '../types';

export const HARBORS: Harbor[] = [
  // Europe — ferry & fishing
  { id: 'dover', name: 'Dover', country: 'United Kingdom', lat: 51.12, lon: 1.32, type: 'ferry' },
  { id: 'calais', name: 'Calais', country: 'France', lat: 50.96, lon: 1.85, type: 'ferry' },
  { id: 'holyhead', name: 'Holyhead', country: 'United Kingdom', lat: 53.31, lon: -4.63, type: 'ferry' },
  { id: 'bergen', name: 'Bergen', country: 'Norway', lat: 60.39, lon: 5.32, type: 'mixed' },
  { id: 'tromso', name: 'Tromsø', country: 'Norway', lat: 69.65, lon: 18.96, type: 'fishing' },
  { id: 'reykjavik', name: 'Reykjavík', country: 'Iceland', lat: 64.15, lon: -21.94, type: 'fishing' },
  { id: 'grimsby', name: 'Grimsby', country: 'United Kingdom', lat: 53.57, lon: -0.08, type: 'fishing' },
  { id: 'boulogne', name: 'Boulogne-sur-Mer', country: 'France', lat: 50.73, lon: 1.61, type: 'fishing' },
  { id: 'split', name: 'Split', country: 'Croatia', lat: 43.51, lon: 16.44, type: 'ferry' },
  { id: 'dubrovnik', name: 'Dubrovnik', country: 'Croatia', lat: 42.65, lon: 18.09, type: 'yacht' },
  { id: 'venice', name: 'Venice', country: 'Italy', lat: 45.44, lon: 12.33, type: 'mixed' },
  { id: 'monaco', name: 'Monaco', country: 'Monaco', lat: 43.74, lon: 7.42, type: 'yacht' },
  { id: 'bodrum', name: 'Bodrum', country: 'Turkey', lat: 37.03, lon: 27.43, type: 'yacht' },
  { id: 'santorini', name: 'Santorini (Fira)', country: 'Greece', lat: 36.42, lon: 25.43, type: 'ferry' },
  { id: 'cherbourg', name: 'Cherbourg', country: 'France', lat: 49.64, lon: -1.62, type: 'naval' },

  // North America
  { id: 'gloucester', name: 'Gloucester', country: 'USA', lat: 42.61, lon: -70.66, type: 'fishing' },
  { id: 'newport', name: 'Newport', country: 'USA', lat: 41.49, lon: -71.31, type: 'naval' },
  { id: 'key-west', name: 'Key West', country: 'USA', lat: 24.56, lon: -81.79, type: 'mixed' },
  { id: 'sitka', name: 'Sitka', country: 'USA', lat: 57.05, lon: -135.33, type: 'fishing' },
  { id: 'dutch-harbor', name: 'Dutch Harbor', country: 'USA', lat: 53.89, lon: -166.54, type: 'fishing' },
  { id: 'st-johns', name: "St. John's", country: 'Canada', lat: 47.56, lon: -52.71, type: 'fishing' },
  { id: 'prince-rupert', name: 'Prince Rupert', country: 'Canada', lat: 54.31, lon: -130.32, type: 'fishing' },

  // Asia-Pacific
  { id: 'hakodate', name: 'Hakodate', country: 'Japan', lat: 41.77, lon: 140.73, type: 'fishing' },
  { id: 'kushiro', name: 'Kushiro', country: 'Japan', lat: 42.98, lon: 144.37, type: 'fishing' },
  { id: 'jeju', name: 'Jeju', country: 'South Korea', lat: 33.51, lon: 126.53, type: 'ferry' },
  { id: 'phuket', name: 'Phuket', country: 'Thailand', lat: 7.88, lon: 98.40, type: 'yacht' },
  { id: 'langkawi', name: 'Langkawi', country: 'Malaysia', lat: 6.36, lon: 99.80, type: 'yacht' },
  { id: 'darwin', name: 'Darwin', country: 'Australia', lat: -12.47, lon: 130.85, type: 'naval' },
  { id: 'broome', name: 'Broome', country: 'Australia', lat: -17.96, lon: 122.24, type: 'fishing' },

  // Middle East & Africa
  { id: 'muscat', name: 'Muscat', country: 'Oman', lat: 23.62, lon: 58.59, type: 'mixed' },
  { id: 'berbera', name: 'Berbera', country: 'Somalia', lat: 10.44, lon: 45.02, type: 'fishing' },
  { id: 'walvis-bay', name: 'Walvis Bay', country: 'Namibia', lat: -22.96, lon: 14.50, type: 'fishing' },
  { id: 'toamasina', name: 'Toamasina', country: 'Madagascar', lat: -18.16, lon: 49.39, type: 'mixed' },
];
