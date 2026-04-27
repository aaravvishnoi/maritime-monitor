import { PiracyZone } from '../types';

export const PIRACY_ZONES: PiracyZone[] = [
  {
    id: 'gulf-of-guinea',
    name: 'Gulf of Guinea',
    region: 'West Africa',
    riskLevel: 'extreme',
    coordinates: [
      [-5, -1], [10, -1], [10, 6], [3, 8], [-5, 5], [-5, -1],
    ],
    incidents: 57,
    notes: 'World\'s most dangerous waters. Crew kidnapping for ransom. Nigeria, Benin, Togo most affected.',
  },
  {
    id: 'red-sea',
    name: 'Red Sea / Bab el-Mandeb',
    region: 'Middle East',
    riskLevel: 'extreme',
    coordinates: [
      [32, 12], [44, 12], [46, 16], [44, 22], [38, 28], [32, 28], [32, 12],
    ],
    incidents: 74,
    notes: 'Houthi drone/missile attacks on commercial shipping since Oct 2023. Most major carriers rerouting.',
  },
  {
    id: 'somali-basin',
    name: 'Somali Basin / Gulf of Aden',
    region: 'East Africa',
    riskLevel: 'high',
    coordinates: [
      [45, 8], [57, 8], [57, 15], [50, 18], [43, 15], [45, 8],
    ],
    incidents: 12,
    notes: 'Reduced from peak years but risk persists. Hijacking for ransom.',
  },
  {
    id: 'malacca-region',
    name: 'Strait of Malacca',
    region: 'Southeast Asia',
    riskLevel: 'medium',
    coordinates: [
      [98, 1], [105, 1], [105, 6.5], [98, 6.5], [98, 1],
    ],
    incidents: 18,
    notes: 'Petty theft and robbery against anchored/slow vessels. Improving with regional cooperation.',
  },
  {
    id: 'sulu-celebes',
    name: 'Sulu / Celebes Sea',
    region: 'Southeast Asia',
    riskLevel: 'high',
    coordinates: [
      [118, 3], [125, 3], [125, 10], [118, 10], [118, 3],
    ],
    incidents: 22,
    notes: 'Abu Sayyaf Group kidnapping threat. Philippines/Malaysia/Indonesia trilateral patrols active.',
  },
  {
    id: 'strait-of-hormuz-zone',
    name: 'Strait of Hormuz Zone',
    region: 'Middle East',
    riskLevel: 'high',
    coordinates: [
      [55, 23.5], [59.5, 23.5], [59.5, 27.5], [55, 27.5], [55, 23.5],
    ],
    incidents: 9,
    notes: 'IRGCN vessel seizures. State-sponsored interference with commercial shipping.',
  },
];
