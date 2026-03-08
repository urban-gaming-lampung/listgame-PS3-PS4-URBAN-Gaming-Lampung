import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import OtherProductsGrid from './components/OtherProductsGrid';
import Footer from './components/Footer';
import LatestGamesRow from './components/GameTerbaru';
import GameList from './components/GameLainnya';

import ModalsLayer from './components/ModalsLayer';
import { Promo } from './components/PromoModal';

import { CartItem, Game, Product } from './types';
import { ps3Games } from './data/ps3';
import { ps4Games } from './data/ps4';
import { ps5Games } from './data/ps5';
import { switchGames } from './data/switch';
import { getThemeForTab, ThemeProvider } from './ThemeContext';
import { pcGames } from './data/pc';
import { otherProducts } from './data/products';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
  isUnavailable,
  displayName,
  alphaCompareIgnoringSlash,
} from './utils/inventory';

const WHATSAPP_NUMBER = '6285709647790';
const STORE = {
  name: 'URBAN Gaming Lampung',
  address:
    'Jl. Imam Bonjol No.380, Segala Mider, Kec. Langkapura, Kota Bandar Lampung, Lampung 35118',
  mapsUrl: 'https://maps.app.goo.gl/5N2GSLRw9Dt2JkGp7',
} as const;

// ✅ UPDATED: tambah Nintendo Switch & PC, revisi nama PS
const TABS = ['PS3 CFW/HEN', 'PS4 HEN', 'PS5 HEN', 'Nintendo Switch', 'PC', 'Produk Lainnya'] as const;
type Tab = (typeof TABS)[number];

// ✅ helper: ambil angka dari "17.2 GB", "17,2GB", "17 GB", dll
function parseSizeGB(size: unknown): number {
  if (typeof size === 'number') return Number.isFinite(size) ? size : 0;
  if (typeof size === 'string') {
    const m = size.replace(',', '.').match(/(\d+(\.\d+)?)/);
    if (!m) return 0;
    const n = parseFloat(m[1]);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

const PROMOS: Promo[] = [
  {
    id: 'p5',
    minGames: 5,
    percent: 10,
    title: 'Promo 5 Game',
    subtitle: 'Diskon 10%',
    desc: 'Minimal beli 5 game dapat diskon 10% (PS3/PS4). Diskon otomatis dihitung di keranjang. Diskon hanya untuk item game (bukan Produk Lainnya).',
  },
  {
    id: 'p10',
    minGames: 10,
    percent: 15,
    title: 'Promo 10 Game',
    subtitle: 'Diskon 15%',
    desc: 'Minimal beli 10 game dapat diskon 15% (PS3/PS4). Diskon otomatis dihitung di keranjang. Diskon hanya untuk item game (bukan Produk Lainnya).',
  },
  {
    id: 'p15',
    minGames: 15,
    percent: 20,
    title: 'Promo 15 Game',
    subtitle: 'Diskon 20%',
    desc: 'Minimal beli 15 game dapat diskon 20% (PS3/PS4). Diskon otomatis dihitung di keranjang. Diskon hanya untuk item game (bukan Produk Lainnya).',
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function GridZoomFab({
  cols,
  min = 2,
  max = 5,
  onMinus,
  onPlus,
  hidden,
}: {
  cols: number;
  min?: number;
  max?: number;
  onMinus: () => void;
  onPlus: () => void;
  hidden?: boolean;
}) {
  if (hidden) return null;

  const canMinus = cols > min;
  const canPlus = cols < max;

  return (
    <div className="fixed z-[95] right-4 bottom-4 flex flex-col gap-2">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <div className="px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-gray-700">Zoom Grid</div>
          <div className="text-xs text-gray-500">{cols} kolom</div>
        </div>

        <div className="p-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onMinus}
            disabled={!canMinus}
            className={[
              'w-11 h-11 rounded-xl border border-gray-200 grid place-items-center text-lg font-bold',
              canMinus ? 'hover:bg-gray-50 active:scale-[0.98]' : 'opacity-40 cursor-not-allowed',
            ].join(' ')}
            aria-label="Zoom out grid"
            title="Zoom out"
          >
            −
          </button>

          <button
            type="button"
            onClick={onPlus}
            disabled={!canPlus}
            className={[
              'w-11 h-11 rounded-xl border border-gray-200 grid place-items-center text-lg font-bold',
              canPlus ? 'hover:bg-gray-50 active:scale-[0.98]' : 'opacity-40 cursor-not-allowed',
            ].join(' ')}
            aria-label="Zoom in grid"
            title="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-[11px] text-gray-500 text-right pr-1 select-none">2–5 kolom • semua layar</div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('PS4 HEN');
  const [sortBy, setSortBy] = useState(
    'abjad' as 'abjad' | 'harga-asc' | 'harga-desc' | 'rilis-new' | 'rilis-old'
  );
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selected, setSelected] = useState<Game | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ GRID ZOOM (2–5 kolom, semua ukuran layar)
  const [gridCols, setGridCols] = useState<number>(3);

  // ✅ PROMO MODAL STATE
  const [promoOpen, setPromoOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

  // ✅ WELCOME MARKETING POPUP STATE
  const [showWelcome, setShowWelcome] = useState(true);

  // ✅ UPDATED: gabungin semua console
  const games = useMemo(() => [...ps3Games, ...ps4Games, ...ps5Games, ...switchGames, ...pcGames], []);

  // ambil produk HOT dari Produk Lainnya (note ada 🔥)
  const hotProduct = useMemo(() => {
    return (
      otherProducts.find((p) => (p.note ?? '').includes('🔥')) ??
      otherProducts.find((p) => p.id === 'bd-jb-hen') ??
      otherProducts[0]
    );
  }, []);

  // load cart dari localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('urbanps_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  // save cart ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('urbanps_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // load grid cols dari localStorage
  useEffect(() => {
    try {
      const savedCols = localStorage.getItem('urbanps_grid_cols');
      if (savedCols) {
        const n = parseInt(savedCols, 10);
        if (Number.isFinite(n)) setGridCols(clamp(n, 2, 5));
      }
    } catch {}
  }, []);

  // save grid cols ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('urbanps_grid_cols', String(clamp(gridCols, 2, 5)));
    } catch {}
  }, [gridCols]);

  // popup Welcome Modal (sudah diatur state `showWelcome` nilai awalnya true,
  // sehingga otomatis terbuka saat halaman dimuat).


  const q = query.trim().toLowerCase();
  const match = (s: string) => displayName(s).toLowerCase().includes(q);

  const displayedGames = useMemo(() => {
    const filtered = games
      .filter((g) => g.platform === activeTab)
      .filter((g) => !q || match(g.name));

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'harga-asc':
          return a.price - b.price;
        case 'harga-desc':
          return b.price - a.price;
        case 'rilis-new':
          return b.year - a.year;
        case 'rilis-old':
          return a.year - b.year;
        default:
          return alphaCompareIgnoringSlash(a.name, b.name);
      }
    });
    return sorted;
  }, [activeTab, sortBy, games, q]);

  const filteredOtherProducts = useMemo(() => {
    if (!q) return otherProducts;
    return otherProducts.filter((p) => match(p.name));
  }, [q]);

  const cartCount = cart.reduce((acc, it) => acc + it.qty, 0);

  // ✅ TOTAL SIZE GAME (PS3 & PS4 dipisah)
  const totalSizePS3 = useMemo(() => {
    return cart.reduce((totalGB, it) => {
      if (it.platform !== 'PS3 CFW/HEN') return totalGB;
      const game = ps3Games.find((g) => g.id === it.id) as any;
      const sizeGB = parseSizeGB(game?.size);
      return totalGB + sizeGB * it.qty;
    }, 0);
  }, [cart]);

  const totalSizePS4 = useMemo(() => {
    return cart.reduce((totalGB, it) => {
      if (it.platform !== 'PS4 HEN') return totalGB;
      const game = ps4Games.find((g) => g.id === it.id) as any;
      const sizeGB = parseSizeGB(game?.size);
      return totalGB + sizeGB * it.qty;
    }, 0);
  }, [cart]);

  const { subtotal, discountPercent, discountAmount, total } = useMemo(() => {
    const sub = cart.reduce((s, it) => s + it.price * it.qty, 0);

    // Promo kamu spesifik PS3/PS4
    const countGames = cart.reduce((n, it) => n + (it.platform === 'PS3 CFW/HEN' || it.platform === 'PS4 HEN' ? it.qty : 0), 0);
    const subGames = cart.reduce(
      (s, it) => s + (it.platform === 'PS3 CFW/HEN' || it.platform === 'PS4 HEN' ? it.price * it.qty : 0),
      0
    );

    let percent = 0;
    if (countGames >= 15) percent = 20;
    else if (countGames >= 10) percent = 15;
    else if (countGames >= 5) percent = 10;

    const disc = Math.floor((subGames * percent) / 100);
    return { subtotal: sub, discountPercent: percent, discountAmount: disc, total: sub - disc };
  }, [cart]);

  function addToCart(game: Game) {
    if (isUnavailable(game.name)) {
      showQuickToast('Game Tidak Tersedia ❌');
      return;
    }
    const cleanName = displayName(game.name);
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === game.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [
        ...prev,
        {
          id: game.id,
          name: cleanName,
          platform: game.platform,
          price: game.price,
          qty: 1,
          cover: game.cover,
        },
      ];
    });
    showQuickToast('Ditambahkan ke keranjang ✅');
  }

  function addProductToCart(id: string, name: string, price: number) {
    if (isUnavailable(name)) {
      showQuickToast('Stok kosong ❌');
      return;
    }

    const cleanName = displayName(name);
    const prod = otherProducts.find((p) => p.id === id);
    const cover = prod?.cover;

    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1, name: cleanName };
        return copy;
      }
      return [...prev, { id, name: cleanName, platform: 'PRODUK', price, qty: 1, cover }];
    });

    showQuickToast('Ditambahkan ke keranjang ✅');
  }

  function formatIDR(v: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(v);
  }

  function showQuickToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 1900);
  }

  // ✅ PROMO MODAL HANDLERS
  function openPromo(p: Promo) {
    setSelectedPromo(p);
    setPromoOpen(true);
  }
  function openPromoList() {
    setSelectedPromo(null);
    setPromoOpen(true);
  }
  function closePromo() {
    setPromoOpen(false);
    setTimeout(() => setSelectedPromo(null), 160);
  }

  function handleCheckout() {
    if (cart.length === 0) {
      showQuickToast('Keranjang masih kosong ❗');
      return;
    }

    const lines: string[] = [];
    lines.push(
      `Halo Admin, saya kirim daftar pesanan dari https://fauzan388.github.io/listgame-PS3-PS4-URBAN-Gaming-Lampung/}:`
    );
    lines.push('');
    cart.forEach((it, i) => {
      const plat = it.platform ?? '-';
      const subtotal = it.price * it.qty;
      lines.push(`${i + 1}. ${displayName(it.name)} (${plat}) x${it.qty} — ${formatIDR(subtotal)}`);
    });
    lines.push('');
    if (discountPercent > 0) {
      lines.push(`Subtotal: ${formatIDR(subtotal)} | Diskon ${discountPercent}%: -${formatIDR(discountAmount)}`);
    } else {
      lines.push(`Subtotal: ${formatIDR(subtotal)}`);
    }
    lines.push(`Total: ${formatIDR(total)}`);
    lines.push('');
    lines.push('Invoice PDF akan terunduh otomatis, bisa di cek di folder download PC/HP Pembeli');

    const urlWA = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    try {
      window.open(urlWA, '_blank', 'noopener');
    } catch {}

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const now = new Date();
        const filename =
          `invoice-urban-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-` +
          `${String(now.getDate()).padStart(2, '0')}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}.pdf`;

        doc.setFontSize(16);
        doc.text(`Invoice — ${STORE.name}`, 14, 16);
        doc.setFontSize(10);
        doc.text(STORE.address, 14, 22, { maxWidth: 180 });
        doc.text(`Tanggal: ${now.toLocaleString('id-ID')}`, 14, 28);

        const rows = cart.map((it, i) => [
          String(i + 1),
          displayName(it.name),
          it.platform ?? '-',
          formatIDR(it.price),
          String(it.qty),
          formatIDR(it.price * it.qty),
        ]);

        const hasAutoTable =
          typeof (doc as any).autoTable === 'function' || typeof (doc as any).__autoTable === 'object';

        if (hasAutoTable) {
          // @ts-ignore
          doc.autoTable({
            startY: 34,
            head: [['No', 'Nama Item', 'Konsol/Produk', 'Harga', 'Qty', 'Subtotal']],
            body: rows,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [80, 80, 80] },
          });
        } else {
          let y = 34;
          doc.setFontSize(12);
          rows.forEach((r) => {
            doc.text(r.join(' | '), 14, y);
            y += 6;
          });
        }

        let yEnd = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 8 : 34 + rows.length * 6 + 8;

        doc.setFontSize(12);
        doc.text(`Subtotal: ${formatIDR(subtotal)}`, 14, yEnd);
        yEnd += 6;

        if (discountPercent > 0) {
          doc.text(`Diskon ${discountPercent}%: -${formatIDR(discountAmount)}`, 14, yEnd);
          yEnd += 6;
        }

        doc.text(`Total: ${formatIDR(total)}`, 14, yEnd);

        doc.save(filename);
      } catch (e) {
        console.error(e);
        showQuickToast('Gagal membuat PDF 😵');
      }
    }, 100);

    setShowCart(false);
  }

  function chatAdmin() {
    const url = `https://wa.me/${WHATSAPP_NUMBER}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const gridFabHidden = showCart || !!selected || promoOpen || !!selectedProduct || showWelcome;

  const theme = getThemeForTab(activeTab);

  return (
    <ThemeProvider theme={theme}>
    <div className={`min-h-screen bg-psGrayWhite text-psBlack font-sans ${theme.selectionBg} selection:text-white`}>
      {/* ✅ Tabs DIHAPUS dari App, karena sudah NYATU di Header.tsx */}
      <Header
        store={STORE}
        cartCount={cartCount}
        onCartClick={() => setShowCart(true)}
        tabs={TABS}
        active={activeTab}
        onChange={setActiveTab}
        query={query}
        setQuery={setQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onChatAdmin={chatAdmin}
        onOpenCart={() => setShowCart(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'Produk Lainnya' ? (
          <OtherProductsGrid
            products={filteredOtherProducts}
            onAdd={(p) => addProductToCart(p.id, p.name, p.price)}
            onOpen={(p) => setSelectedProduct(p)}
            formatIDR={formatIDR}
            gridCols={gridCols}
          />
        ) : (
          <>
            {/* Promo hanya buat PS3/PS4 sesuai rules kamu */}
            {(activeTab === 'PS3 CFW/HEN' || activeTab === 'PS4 HEN') && (
              <button
                type="button"
                onClick={openPromoList}
                className="mb-4 w-full rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-3 text-left hover:bg-gray-50 active:scale-[0.995] transition"
              >
                <div className="text-base md:text-lg font-extrabold">🔥 Promo Pembelian Game 🔥</div>
              </button>
            )}

            {/* Menampilkan game terbaru untuk semua platform game */}
            {!q && (
              <LatestGamesRow
                games={
                  activeTab === 'PS3 CFW/HEN' ? ps3Games :
                  activeTab === 'PS4 HEN' ? ps4Games :
                  activeTab === 'PS5 HEN' ? ps5Games :
                  activeTab === 'Nintendo Switch' ? switchGames :
                  pcGames
                }
                platform={activeTab as any}
                onAdd={(g) => addToCart(g)}
                onOpen={(g) => setSelected(g)}
                formatIDR={formatIDR}
              />
            )}

            <GameList
              games={displayedGames}
              onAdd={(g) => addToCart(g)}
              onOpen={(g) => setSelected(g)}
              formatIDR={formatIDR}
              title={
                activeTab === 'PS3 CFW/HEN'
                  ? 'Game PS3 Lainnya'
                  : activeTab === 'PS4 HEN'
                  ? 'Game PS4 Lainnya'
                  : activeTab === 'PS5 HEN'
                  ? 'Game PS5 Lainnya'
                  : activeTab === 'Nintendo Switch'
                  ? 'Game Nintendo Switch Lainnya'
                  : 'Game PC Lainnya'
              }
              gridCols={gridCols}
            />
          </>
        )}
      </main>

      <Footer />

      {/* ✅ Floating Zoom Button */}
      <GridZoomFab
        cols={gridCols}
        onMinus={() => setGridCols((c) => clamp(c - 1, 2, 5))}
        onPlus={() => setGridCols((c) => clamp(c + 1, 2, 5))}
        hidden={gridFabHidden}
      />

      {/* ✅ Semua modal pindah ke ModalsLayer */}
      <ModalsLayer
        selected={selected}
        onCloseSelected={() => setSelected(null)}
        onAddSelected={() => selected && addToCart(selected)}
        formatIDR={formatIDR}
        showCart={showCart}
        cart={cart}
        setCart={setCart}
        onCloseCart={() => setShowCart(false)}
        subtotal={subtotal}
        discountPercent={discountPercent}
        discountAmount={discountAmount}
        total={total}
        onCheckout={handleCheckout}
        totalSizePS3={totalSizePS3}
        totalSizePS4={totalSizePS4}
        selectedProduct={selectedProduct}
        onCloseSelectedProduct={() => setSelectedProduct(null)}
        onAddProduct={(p) => {
          addProductToCart(p.id, p.name, p.price);
          setSelectedProduct(null);
        }}
        promoOpen={promoOpen}
        promos={PROMOS}
        selectedPromo={selectedPromo}
        onSelectPromo={(p) => openPromo(p)}
        onBackToPromoList={() => setSelectedPromo(null)}
        onClosePromo={closePromo}
        onOpenCartFromPromo={() => {
          setShowCart(true);
          closePromo();
        }}
        showWelcome={showWelcome}
        onCloseWelcome={() => setShowWelcome(false)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] rounded-full bg-gray-900 text-white text-sm px-4 py-2 shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ThemeProvider>
  );
}
