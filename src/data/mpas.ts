import { MPA } from '../types';

export const MPAS: MPA[] = [
  {
    id: 'gbr',
    name: 'Great Barrier Reef Marine Park',
    country: 'Australia',
    type: 'national-park',
    areaSqKm: 344400,
    coordinates: [
      [143.5, -10.5], [147.0, -10.5], [152.5, -15.0], [154.0, -20.0],
      [153.5, -24.5], [151.5, -24.5], [149.0, -22.0], [146.5, -18.5],
      [143.5, -14.5], [143.5, -10.5],
    ],
  },
  {
    id: 'papahanaumokuakea',
    name: 'Papahānaumokuākea Marine National Monument',
    country: 'USA',
    type: 'national-park',
    areaSqKm: 1508870,
    coordinates: [
      [-180, 25], [-162, 25], [-162, 30], [-167, 32], [-175, 30], [-180, 28], [-180, 25],
    ],
  },
  {
    id: 'ross-sea',
    name: 'Ross Sea Marine Protected Area',
    country: 'International (CCAMLR)',
    type: 'protected-zone',
    areaSqKm: 2060000,
    coordinates: [
      [160, -60], [-150, -60], [-150, -78], [-170, -85], [170, -85], [160, -78], [160, -60],
    ],
  },
  {
    id: 'chagos',
    name: 'Chagos Archipelago MPA',
    country: 'UK (BIOT)',
    type: 'reserve',
    areaSqKm: 640000,
    coordinates: [
      [70, -4], [74, -4], [74, -9], [70, -9], [70, -4],
    ],
  },
  {
    id: 'coral-sea',
    name: 'Coral Sea Marine Park',
    country: 'Australia',
    type: 'national-park',
    areaSqKm: 989842,
    coordinates: [
      [154, -12], [163, -12], [163, -24], [158, -28], [154, -24], [154, -12],
    ],
  },
  {
    id: 'galapagos',
    name: 'Galápagos Marine Reserve',
    country: 'Ecuador',
    type: 'reserve',
    areaSqKm: 133000,
    coordinates: [
      [-92.5, -2], [-89, -2], [-89, 2], [-92.5, 2], [-92.5, -2],
    ],
  },
  {
    id: 'revillagigedo',
    name: 'Revillagigedo Archipelago MNM',
    country: 'Mexico',
    type: 'sanctuary',
    areaSqKm: 147585,
    coordinates: [
      [-113, 17], [-109, 17], [-109, 20], [-113, 20], [-113, 17],
    ],
  },
  {
    id: 'pelagos',
    name: 'Pelagos Sanctuary (Mediterranean)',
    country: 'France/Italy/Monaco',
    type: 'sanctuary',
    areaSqKm: 87500,
    coordinates: [
      [6, 43], [10, 43], [12, 41], [9, 38], [5, 40], [4, 42], [6, 43],
    ],
  },
  {
    id: 'phoenix-islands',
    name: 'Phoenix Islands Protected Area',
    country: 'Kiribati',
    type: 'protected-zone',
    areaSqKm: 408250,
    coordinates: [
      [-176, -5], [-171, -5], [-171, -2], [-176, -2], [-176, -5],
    ],
  },
  {
    id: 'maldives-biosphere',
    name: 'Maldives Biosphere Reserve',
    country: 'Maldives',
    type: 'reserve',
    areaSqKm: 8920,
    coordinates: [
      [72.5, -1], [74, -1], [74, 8], [72.5, 8], [72.5, -1],
    ],
  },
];
