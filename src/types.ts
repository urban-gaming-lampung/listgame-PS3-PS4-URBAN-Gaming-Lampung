export type Platform = 'PS3 CFW/HEN' | 'PS4 HEN' | 'PS5 HEN' | 'Nintendo Switch' | 'PC';

// (opsional) Batasi pilihan genre supaya konsisten tombol filter:
export type Genre =
  | 'Aksi'
  | 'Petualangan'
  | 'Berantem'
  | 'Balapan'
  | 'Perang'
  | 'Anime'
  | 'Olahraga'
  | 'RPG'
  | 'Open World'
  | 'Horror'
  | 'Keluarga'
  | 'Simulasi'
  | 'Party'
  | 'FPS'
  | 'Platformer'
  | 'Shooter'
  | 'Sepak Bola';

export type Game = {
  id: string;
  platform: Platform;
  name: string;
  size: string;
  build: string;
  year: number;
  players: string;
  price: number;
  cover: string;
  screenshots?: string[];
  youtubeQuery?: string;
  description: string;

  // sekarang bisa string ATAU string[] (kompatibel dengan data lama)
  genre?: Genre | Genre[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  note?: string;
  cover?: string;
  description?: string;
};

export type CartItem = {
  id: string;
  name: string;
  platform: Platform | 'PRODUK';
  price: number;
  qty: number;
  cover?: string;
};
