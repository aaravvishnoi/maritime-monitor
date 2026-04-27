import { MaritimeNews } from '../types';

const MOCK_NEWS: MaritimeNews[] = [
  {
    id: '1',
    title: 'Houthi Attacks Force Major Carriers to Extend Red Sea Avoidance',
    summary: 'CMA CGM, Maersk, and MSC confirm continued rerouting via Cape of Good Hope adding 10–14 days to Asia-Europe transit times as Houthi drone and missile attacks persist in the southern Red Sea.',
    source: 'Lloyd\'s List',
    category: 'incident',
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '2',
    title: 'IMO Adopts 2025 Greenhouse Gas Strategy — Net-Zero by 2050',
    summary: 'The International Maritime Organization has finalized its revised GHG Strategy at MEPC 83, committing the global fleet to net-zero emissions by 2050 with interim targets of 20% reduction by 2030.',
    source: 'IMO Press',
    category: 'regulation',
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'Gulf of Guinea: Three Crew Kidnapped from Chemical Tanker',
    summary: 'Armed pirates boarded the MV STELLAMARE off Benin, kidnapping three crew members before escaping into Nigerian waters. MDAT-GoG issued a GoG Watch.',
    source: 'BIMCO',
    category: 'piracy',
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: '4',
    title: 'Panama Canal Water Levels Recover — Restrictions Eased',
    summary: 'Panama Canal Authority (PCA) has raised the maximum daily draft allowance to 50 feet following sustained rainfall, partially easing transit restrictions that had reduced daily crossings to 24 vessels.',
    source: 'Panama Canal Authority',
    category: 'trade',
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: '5',
    title: 'EU Carbon Border Mechanism Expansion to Cover Maritime Fuels',
    summary: 'The European Commission has proposed extending the EU ETS maritime scope to include fuels bunkered in EU ports, affecting an estimated 8,000 vessel calls annually.',
    source: 'European Commission',
    category: 'regulation',
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
  {
    id: '6',
    title: 'Strait of Malacca: Record 90,000 Vessels Transited in 2025',
    summary: 'The Strait of Malacca reached a new annual transit record in 2025, with vessel traffic increasing 8% year-on-year driven by LNG carrier growth and container trade recovery.',
    source: 'Maritime Singapore',
    category: 'trade',
    publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '7',
    title: 'Iranian Navy Seizes Marshall Islands-Flagged Tanker in Hormuz',
    summary: 'IRGCN fast attack craft intercepted and seized the MT ADVANTAGE SWEET in the Strait of Hormuz. US 5th Fleet confirmed the incident; crew of 24 detained.',
    source: 'USNI News',
    category: 'incident',
    publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
  },
  {
    id: '8',
    title: 'Port of Los Angeles Reports Q1 2026 Container Volume Up 14%',
    summary: 'Front-loading ahead of potential tariff changes drove a 14% year-on-year increase in TEU throughput at the Port of Los Angeles in Q1 2026, the strongest quarter since 2021.',
    source: 'Port of Los Angeles',
    category: 'trade',
    publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: '9',
    title: 'MARPOL Annex VI: Scrubber Wastewater Discharge Restrictions Tightened',
    summary: 'Revised MARPOL Annex VI guidelines restrict open-loop scrubber discharge in waters within 50 nautical miles of coast, affecting an estimated 4,500 vessels operating scrubbers.',
    source: 'IMO',
    category: 'environment',
    publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: '10',
    title: 'Taiwan Strait Tensions: PLA Navy Exercises Disrupt Commercial Traffic',
    summary: 'Announced PLA naval exercises in the Taiwan Strait caused significant disruption to commercial shipping routes, with over 80 vessels rerouting through Luzon Strait.',
    source: 'Reuters Maritime',
    category: 'incident',
    publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
  },
  {
    id: '11',
    title: 'Collision in Singapore Strait — Small Bulker and Container Vessel',
    summary: 'A collision between the MV FORTUNE JADE and a 2,800-TEU feeder vessel in the Singapore Strait resulted in minor damage to both vessels. MPA Singapore has launched an investigation.',
    source: 'MPA Singapore',
    category: 'incident',
    publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: '12',
    title: 'CII Ratings: 30% of Global Fleet Rated D or E Under 2025 Framework',
    summary: 'Updated IMO Carbon Intensity Indicator data shows nearly a third of the global fleet rated D or E, triggering mandatory improvement plans. Tankers and bulk carriers most affected.',
    source: 'DNV Maritime',
    category: 'regulation',
    publishedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
];

export async function fetchMaritimeNews(): Promise<MaritimeNews[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_NEWS;
}
