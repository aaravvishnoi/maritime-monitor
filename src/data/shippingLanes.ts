import { ShippingLane } from '../types';

export const SHIPPING_LANES: ShippingLane[] = [
  {
    id: 'trans-pacific-north',
    name: 'Trans-Pacific (Asia → N. America)',
    type: 'major',
    dailyVessels: 180,
    path: [
      [121, 31], [130, 34], [140, 37], [155, 42], [170, 46],
      [-175, 48], [-160, 47], [-145, 43], [-130, 38], [-118, 34],
    ],
  },
  {
    id: 'asia-europe-suez',
    name: 'Asia–Europe via Suez',
    type: 'major',
    dailyVessels: 150,
    path: [
      [104, 1], [90, 5], [75, 10], [60, 14], [50, 13],
      [45, 12], [44, 13], [43, 14], [35, 29], [32, 31],
      [28, 34], [20, 37], [12, 39], [5, 43], [2, 48], [4, 52],
    ],
  },
  {
    id: 'trans-atlantic',
    name: 'Trans-Atlantic (Europe ↔ N. America)',
    type: 'major',
    dailyVessels: 120,
    path: [
      [4, 52], [-5, 50], [-20, 47], [-40, 44],
      [-55, 42], [-65, 41], [-74, 41],
    ],
  },
  {
    id: 'cape-route',
    name: 'Cape of Good Hope Route',
    type: 'major',
    dailyVessels: 60,
    path: [
      [4, 52], [-6, 36], [-15, 18], [-17, 10],
      [0, -2], [15, -25], [18, -34], [28, -36],
      [40, -30], [55, -20], [70, -10], [85, 3],
      [104, 1],
    ],
  },
  {
    id: 'indian-ocean-east-africa',
    name: 'Indian Ocean (E. Africa → Asia)',
    type: 'major',
    dailyVessels: 80,
    path: [
      [39, -4], [50, 5], [60, 8], [65, 12],
      [72, 18], [78, 22], [80, 20],
    ],
  },
  {
    id: 'middle-east-asia',
    name: 'Middle East → Asia',
    type: 'major',
    dailyVessels: 100,
    path: [
      [56, 26], [63, 22], [68, 16], [73, 10],
      [80, 6], [90, 4], [104, 1],
    ],
  },
  {
    id: 'europe-west-africa',
    name: 'Europe → West Africa',
    type: 'secondary',
    dailyVessels: 45,
    path: [
      [4, 52], [-6, 36], [-17, 15], [-15, 5],
      [-3, 3], [3, 5],
    ],
  },
  {
    id: 'pacific-south',
    name: 'Trans-Pacific (Asia → S. America)',
    type: 'secondary',
    dailyVessels: 35,
    path: [
      [140, 35], [155, 28], [170, 18], [-170, 8],
      [-150, -5], [-130, -18], [-110, -25], [-80, -30], [-70, -33],
    ],
  },
  {
    id: 'europe-south-america',
    name: 'Europe → South America',
    type: 'secondary',
    dailyVessels: 40,
    path: [
      [4, 52], [-10, 45], [-20, 30], [-30, 15],
      [-38, 0], [-43, -15], [-46, -24],
    ],
  },
  {
    id: 'coastal-asia-pacific',
    name: 'Intra-Asia Pacific',
    type: 'secondary',
    dailyVessels: 250,
    path: [
      [121, 31], [122, 25], [120, 22], [114, 18],
      [110, 15], [107, 10], [104, 1], [104, -5],
      [107, -8], [115, -8],
    ],
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean Sea Routes',
    type: 'major',
    dailyVessels: 220,
    path: [
      [-6, 36], [2, 38], [12, 38], [18, 39],
      [25, 38], [30, 36], [32, 32],
    ],
  },
  {
    id: 'north-sea-baltic',
    name: 'North Sea / Baltic',
    type: 'secondary',
    dailyVessels: 300,
    path: [
      [4, 52], [8, 55], [10, 57], [18, 59],
      [22, 60], [25, 60],
    ],
  },
];
