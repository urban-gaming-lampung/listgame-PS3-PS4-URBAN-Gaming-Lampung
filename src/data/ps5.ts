import { Game } from '../types';

function hasYearToken(title: string): boolean {
  const t = title.toUpperCase();
  if (/(19|20)\d{2}/.test(t)) return true;         // 2019, 2026, dst
  if (/\b2K\d{2}\b/.test(t)) return true;          // 2K24, 2K25, dst
  if (/\b(1[5-9]|2[0-9])\b$/.test(t)) return true; // judul diakhiri 15..29 (MotoGP 25, EA FC 25)
  return false;
}

function computePrice(name: string, sizeGB: number | null): number | null {
  if (hasYearToken(name)) return 30000;
  if (sizeGB == null) return null;
  if (sizeGB >= 100) return 30000;
  if (sizeGB > 50) return 25000;
  if (sizeGB > 25) return 20000;
  if (sizeGB > 15) return 15000;
  if (sizeGB >= 5) return 10000;
  return 5000; // <5GB
}

export const ps5Games: Game[] = [
  {
    id: 'ps5-eafc26',
    platform: 'PS5 HEN',
    name: '/EA SPORTS FC 26',
    description:
      'Game sepak bola terbaru EA dengan peningkatan gameplay, mode karier, dan Ultimate Team. Cocok buat mabar maupun push rank.',
    size: '—',
    build: '—',
    genre: ['Olahraga', 'Sepak Bola'],
    year: 2026,
    players: '1-4',
    price: computePrice('EA SPORTS FC 26', null),
    cover:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/EA_Sports_FC_Logo.svg/1024px-EA_Sports_FC_Logo.svg.png',
    screenshots: [],
    youtubeQuery: 'EA SPORTS FC 26 PS5 gameplay',
  },
];
