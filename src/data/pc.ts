import { Game } from '../types';

function hasYearToken(title: string): boolean {
  const t = title.toUpperCase();
  if (/(19|20)\d{2}/.test(t)) return true;        // 2019, 2025, dst
  if (/\b2K\d{2}\b/.test(t)) return true;         // 2K24, 2K25, dst
  if (/\b(1[5-9]|2[0-9])\b$/.test(t)) return true; // judul diakhiri 15..29 
  return false;
}

function computePrice(name: string, sizeGB: number | null): number {
  if (hasYearToken(name)) return 30000;
  if (sizeGB == null) return 5000;
  if (sizeGB >= 100) return 30000;
  if (sizeGB > 50) return 25000;
  if (sizeGB > 25) return 20000;
  if (sizeGB > 15) return 15000;
  if (sizeGB >= 5) return 10000;
  return 5000; // <5GB
}

export const pcGames: Game[] = [
  {
    id: 'pc-clair-obscur',
    platform: 'PC',
    name: 'Clair Obscur Expedition 33',
    description: 'Game RPG turn-based revolusioner dengan visual memukau menggunakan Unreal Engine 5.',
    size: '60 GB',
    build: '—',
    genre: ['RPG', 'Petualangan'],
    year: 2025,
    players: '1 P',
    price: computePrice('Clair Obscur Expedition 33', 60),
    cover: 'https://cdn.akamai.steamstatic.com/steam/apps/2801990/header.jpg',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/2801990/ss_1.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/2801990/ss_2.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/2801990/ss_3.jpg',
    ],
    youtubeQuery: 'Clair Obscur Expedition 33 PC gameplay',
  },
  {
    id: 'pc-dirt-rally-2',
    platform: 'PC',
    name: 'DiRT Rally 2.0',
    description: 'Rasakan simulasi balap reli off-road paling otentik dan menantang.',
    size: '100 GB',
    build: '—',
    genre: ['Balapan'],
    year: 2019,
    players: '1 P',
    price: computePrice('DiRT Rally 2.0', 100),
    cover: 'https://cdn.akamai.steamstatic.com/steam/apps/690790/header.jpg',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/690790/ss_1.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/690790/ss_2.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/690790/ss_3.jpg',
    ],
    youtubeQuery: 'DiRT Rally 2.0 PC gameplay',
  },
  {
    id: 'pc-gow-ragnarok',
    platform: 'PC',
    name: 'God of War Ragnark',
    description: 'Petualangan epik Kratos dan Atreus kini hadir di PC dengan grafis yang ditingkatkan dan dukungan ultrawide.',
    size: '190 GB',
    build: '—',
    genre: ['Aksi', 'Petualangan'],
    year: 2024,
    players: '1 P',
    price: computePrice('God of War Ragnark', 190),
    cover: 'https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/2322010/ss_1.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/2322010/ss_2.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/2322010/ss_3.jpg',
    ],
    youtubeQuery: 'God of War Ragnarok PC gameplay',
  },
  {
    id: 'pc-spiderman-2',
    platform: 'PC',
    name: "Marvel's Spider-Man 2",
    description: 'Mainkan Peter Parker dan Miles Morales dalam petualangan terbaru mereka di New York City.',
    size: '250 GB',
    build: '—',
    genre: ['Aksi', 'Open World'],
    year: 2024,
    players: '1 P',
    price: computePrice("Marvel's Spider-Man 2", 250),
    cover: 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/1c7b75d8ed9271516546560dda116fb015e8da73b9278ffc.png',
    screenshots: [
      'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/ss_1.jpg',
      'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/ss_2.jpg',
      'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/ss_3.jpg',
    ],
    youtubeQuery: 'Marvels Spider-Man 2 PC gameplay',
  },
  {
    id: 'pc-re-requiem',
    platform: 'PC',
    name: 'Resident Evil Requiem',
    description: 'Modifikasi ambisius dan overhaul horor survival untuk pengalaman Resident Evil yang tak terlupakan.',
    size: '60 GB',
    build: '—',
    genre: ['Petualangan', 'Aksi'],
    year: 2024,
    players: '1 P',
    price: computePrice('Resident Evil Requiem', 60),
    cover: 'https://cdn.akamai.steamstatic.com/steam/apps/3328/header.jpg',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/3328/ss_1.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/3328/ss_2.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/3328/ss_3.jpg',
    ],
    youtubeQuery: 'Resident Evil Requiem PC gameplay',
  },
  {
    id: 'pc-ride-6',
    platform: 'PC',
    name: 'RIDE 6',
    description: 'Game balap motor simulasi terbaik dengan ratusan motor dan sirkuit dari seluruh dunia.',
    size: '60 GB',
    build: '—',
    genre: ['Balapan'],
    year: 2024,
    players: '1 P',
    price: computePrice('RIDE 6', 60),
    cover: 'https://cdn.akamai.steamstatic.com/steam/apps/1650010/header.jpg',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/1650010/ss_1.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/1650010/ss_2.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/1650010/ss_3.jpg',
    ],
    youtubeQuery: 'RIDE 6 PC gameplay',
  },
  {
    id: 'pc-tekken-8',
    platform: 'PC',
    name: 'TEKKEN 8',
    description: 'Pertarungan ikonik berlanjut dengan visual mutakhir Unreal Engine 5 dan mekanik agresif baru.',
    size: '100 GB',
    build: '—',
    genre: ['Berantem'],
    year: 2024,
    players: '1-2 P',
    price: computePrice('TEKKEN 8', 100),
    cover: 'https://cdn.akamai.steamstatic.com/steam/apps/1778820/header.jpg',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/1778820/ss_1.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/1778820/ss_2.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/1778820/ss_3.jpg',
    ],
    youtubeQuery: 'TEKKEN 8 PC gameplay',
  },
  {
    id: 'pc-naruto-connections',
    platform: 'PC',
    name: 'NARUTO X BORUTO Ultimate Ninja STORM CONNECTIONS',
    description: 'Koleksi epik menceritakan kembali sejarah Naruto dan Sasuke dengan roster karakter terbesar.',
    size: '30 GB',
    build: '—',
    genre: ['Berantem', 'Anime'],
    year: 2023,
    players: '1-2 P',
    price: computePrice('NARUTO X BORUTO Ultimate Ninja STORM CONNECTIONS', 30),
    cover: 'https://cdn.akamai.steamstatic.com/steam/apps/1020790/header.jpg',
    screenshots: [
      'https://cdn.akamai.steamstatic.com/steam/apps/1020790/ss_1.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/1020790/ss_2.jpg',
      'https://cdn.akamai.steamstatic.com/steam/apps/1020790/ss_3.jpg',
    ],
    youtubeQuery: 'NARUTO X BORUTO Ultimate Ninja STORM CONNECTIONS PC gameplay',
  },
  {
    id: 'pc-eafc26',
    platform: 'PC',
    name: 'EA FC 26',
    description: 'Penerus FIFA resmi dengan lisensi klub, mode Ultimate Team, Career, dll.',
    size: '55 GB',
    build: '—',
    year: 2025, 
    players: '1-4P',
    genre: ['Olahraga'],
    price: computePrice('EA FC 26', 41.0),
    cover: 'https://dlpsgame.com/wp-content/uploads/2025/09/3-6.jpg',
    screenshots: [
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3405690/d01fbbd32769bd7cd70215dedd22e4ffb7bc42bc/ss_d01fbbd32769bd7cd70215dedd22e4ffb7bc42bc.600x338.jpg?t=1759332156',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3405690/b2bcda2e36966161937db451509f9922901b6145/ss_b2bcda2e36966161937db451509f9922901b6145.600x338.jpg?t=1759332156',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3405690/2048e95987d01af065fdcb67c380e7a0e53df069/ss_2048e95987d01af065fdcb67c380e7a0e53df069.600x338.jpg?t=1759332156'
    ],
    youtubeQuery: 'EA FC 26 PC gameplay',
  },
  {
    id: 'pc-pes2026-monster',
    platform: 'PC',
    name: 'e-football PES 2026 Monster Patch Summer',
    description: 'Mod community Monster Patch untuk eFootball/PES 2026, update klub & kits Summer.',
    size: '60 GB',
    build: '—',
    year: 2026,
    players: '1-4P',
    genre: ['Olahraga'],
    price: computePrice('e-football PES 2026 Monster PatchSummer', 40.0),
    cover: 'https://i.ibb.co.com/V0wBR2Cg/4.jpg',
    screenshots: [
      'https://i.ibb.co.com/Kp8yQPyg/Screenshot-24.png',
      'https://i.ibb.co.com/QjfF0Wt7/Screenshot-28.png',
      'https://scontent.fcgk33-1.fna.fbcdn.net/v/t39.30808-6/534220165_1823694435018206_7992519571919325746_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE79BsAPr6Mn98U888_s1jhqasQGehgB_CpqxAZ6GAH8N5-oSia4RJGxPZ1cY5nT070cE3aWUCiY3GtjE9j_Ur6&_nc_ohc=cXPyunqL9J4Q7kNvwE-PlFp&_nc_oc=AdnarqY_YDobcHeEmH2xX_qTv_8RPSgEAsZeNocOi0E_eqN8wtjhTJoDyoiy81HOBuY&_nc_zt=23&_nc_ht=scontent.fcgk33-1.fna&_nc_gid=KX3Kp21f6T9aq1bGO_lT2A&oh=00_Afait7EUb8qzqbqHFuuEOHYRBa3UNYLwxM87AlJ8QwyNsw&oe=68C7315F',
      'https://i.ibb.co.com/pvCBdncv/Screenshot-31.png',
    ],
    youtubeQuery: 'PES 2026 Monster Patch PC gameplay',
  },
  {
    id: 'pc-nba2k26-standard',
    platform: 'PC',
    name: 'NBA 2K26',
    description: 'Game basket simulasi dengan fitur MyCAREER, MyTEAM, MyNBA, The W dan teknologi ProPLAY™ untuk gerakan realistis.',
    size: '100 GB',
    build: '—',
    year: 2025,
    players: '1-4P',
    genre: ['Olahraga'],
    price: computePrice('NBA 2K26 Standard Edition', 70.0),
    cover: 'https://dlpsgame.com/wp-content/uploads/2025/09/1-6.jpg',
    screenshots: [
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3472040/01e6e3303fb15a4abd013403ee80ae89b08e493a/ss_01e6e3303fb15a4abd013403ee80ae89b08e493a.600x338.jpg?t=1757351541',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3472040/1c03f2ef9f5a77a360fbf8ba27319be4d2ff6629/ss_1c03f2ef9f5a77a360fbf8ba27319be4d2ff6629.600x338.jpg?t=1757351541',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3472040/dc8acb92de608bd8e4468aee8cb64db7eed61027/ss_dc8acb92de608bd8e4468aee8cb64db7eed61027.600x338.jpg?t=1757351541',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3472040/5cc8a288be2f322da786b9a9f5d410e6e76e465f/ss_5cc8a288be2f322da786b9a9f5d410e6e76e465f.600x338.jpg?t=1757351541',
    ],
    youtubeQuery: 'NBA 2K26 PC gameplay',
  },
  {
    id: 'pc-f124',
    platform: 'PC',
    name: 'F1 24',
    description: 'Simulator balap resmi Formula 1 edisi 2024, dengan Career, MyTeam, dan lisensi FIA.',
    size: '55 GB',
    build: '—',
    year: 2024,
    players: '1P',
    genre: ['Balapan'],
    price: computePrice('F1 24', 55.0),
    cover: 'https://1.bp.blogspot.com/-GiG288VMUAY/Zl-54pY2Y8I/AAAAAAAAAyQ/LcSUrNqAPa0pgR6tAV0cRY-TeAvQBA4pwCNcBGAsYHQ/s0/2.jpg',
    screenshots: [
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2488620/fdd8ef6ba735ff768f1c022950773b287794a601/ss_fdd8ef6ba735ff768f1c022950773b287794a601.600x338.jpg?t=1748912330',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2488620/ef2ffcbbe719f986d6f00512c49ebee93588639c/ss_ef2ffcbbe719f986d6f00512c49ebee93588639c.600x338.jpg?t=1748912330',
      'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2488620/26aac4ac6a0da02a01c3ad9cc020666238998ca8/ss_26aac4ac6a0da02a01c3ad9cc020666238998ca8.600x338.jpg?t=1748912330'
    ],
    youtubeQuery: 'F1 24 PC gameplay',
  }
];
