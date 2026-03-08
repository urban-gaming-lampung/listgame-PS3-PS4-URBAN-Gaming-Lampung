import React, { useEffect, useMemo, useState } from 'react';
import GameCard from './GameCard';
import { Game, Genre } from '../types';
import { useThemeContext } from '../ThemeContext';

const ALPHABET_GROUPS = [
  { label: 'A - C', letters: ['a', 'b', 'c'] },
  { label: 'D - F', letters: ['d', 'e', 'f'] },
  { label: 'G - I', letters: ['g', 'h', 'i'] },
  { label: 'J - L', letters: ['j', 'k', 'l'] },
  { label: 'M - O', letters: ['m', 'n', 'o'] },
  { label: 'P - R', letters: ['p', 'q', 'r'] },
  { label: 'S - U', letters: ['s', 't', 'u'] },
  { label: 'V - Z', letters: ['v', 'w', 'x', 'y', 'z'] },
];

type AlphaFilter = 'Semua' | (typeof ALPHABET_GROUPS)[number]['label'] | 'Game Tidak Tersedia';

type SortOption =
  | 'Abjad (A-Z)'
  | 'Harga Terendah'
  | 'Harga Tertinggi'
  | 'Rilis Paling Baru'
  | 'Rilis Paling Lama';

type ViewMode = 'grid' | 'row' | 'compact';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Desktop-like canvas scaling (ONLY when enabled)
 * - Inner rendered at fixed desktopWidth
 * - On small screens, it scales down to fit viewport
 * - Height compensated so layout doesn't leave empty space
 */
function DesktopScaled({
  enabled,
  desktopWidth,
  children,
}: {
  enabled: boolean;
  desktopWidth: number;
  children: React.ReactNode;
}) {
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = React.useState(1);
  const [scaledHeight, setScaledHeight] = React.useState<number | null>(null);

  // ✅ hitung scale berdasarkan lebar wrapper real (bukan window)
  React.useEffect(() => {
    if (!enabled) {
      setScale(1);
      return;
    }

    const calc = () => {
      const outer = outerRef.current;
      if (!outer) return;

      const available = outer.clientWidth; // ini udah kena padding container
      const nextScale = available < desktopWidth ? available / desktopWidth : 1;

      // kecilin dikit biar gak kena rounding/scrollbar 1-2px (biang kepotong)
      setScale(Math.min(1, nextScale) - 0.001);
    };

    calc();

    const ro = new ResizeObserver(() => calc());
    if (outerRef.current) ro.observe(outerRef.current);

    window.addEventListener('resize', calc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, [enabled, desktopWidth]);

  // ✅ update tinggi supaya wrapper gak nyisain ruang kosong
  React.useEffect(() => {
    if (!enabled) {
      setScaledHeight(null);
      return;
    }
    const el = innerRef.current;
    if (!el) return;

    const updateHeight = () => setScaledHeight(el.scrollHeight * scale);

    updateHeight();

    const ro = new ResizeObserver(() => updateHeight());
    ro.observe(el);

    return () => ro.disconnect();
  }, [enabled, scale]);

  if (!enabled) return <>{children}</>;

  return (
    <div ref={outerRef} style={{ width: '100%', overflow: 'hidden', height: scaledHeight ?? undefined }}>
      <div
        ref={innerRef}
        style={{
          width: desktopWidth,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function IconButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const theme = useThemeContext();
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className={[
        'h-10 w-10 rounded-xl border flex items-center justify-center transition-all duration-300',
        active ? `${theme.bgSolid} text-white ${theme.ring} shadow-sm border-transparent` : `bg-white text-gray-500 border-gray-200 hover:border-transparent hover:${theme.text}`,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2" y="11" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="11" y="11" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function RowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="14" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2" y="8" width="14" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="2" y="13" width="14" height="3" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CompactIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 4h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function GameLainnya({
  games,
  onAdd,
  onOpen,
  formatIDR,
  title = 'Game Lainnya',
  gridCols = 3,
}: {
  games: Game[];
  onAdd: (game: Game) => void;
  onOpen: (game: Game) => void;
  formatIDR: (n: number) => string;
  title?: string;
  gridCols?: number;
}) {
  const theme = useThemeContext();
  const GENRES: readonly ('Semua Genre' | Genre)[] = [
    'Semua Genre',
    'Aksi',
    'Petualangan',
    'Berantem',
    'Balapan',
    'Perang',
    'Anime',
    'Olahraga',
    'RPG',
    'Open World',
  ];

  const SORTS: readonly SortOption[] = [
    'Abjad (A-Z)',
    'Harga Terendah',
    'Harga Tertinggi',
    'Rilis Paling Baru',
    'Rilis Paling Lama',
  ];

  const [activeGenre, setActiveGenre] = useState<(typeof GENRES)[number]>('Semua Genre');
  const [activeAlpha, setActiveAlpha] = useState<AlphaFilter>('Semua');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeSort, setActiveSort] = useState<SortOption>('Abjad (A-Z)');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const cols = clamp(gridCols, 2, 5);

  // ✅ Mobile detector (sm breakpoint)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640); // tailwind sm
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ✅ Mobile filter panels (hide by default)
  const [mobileGenreOpen, setMobileGenreOpen] = useState(false);
  const [mobileAlphaOpen, setMobileAlphaOpen] = useState(false);

  // kalau pindah ke desktop: paksa panel dianggap "open" secara UX (karena desktop tampil always)
  useEffect(() => {
    if (!isMobile) {
      setMobileGenreOpen(true);
      setMobileAlphaOpen(true);
    } else {
      // di mobile default tertutup
      setMobileGenreOpen(false);
      setMobileAlphaOpen(false);
    }
  }, [isMobile]);

  // ✅ Desktop canvas width auto based on columns (prevents cut off on cols=5)
  const CARD_MIN_W = 250;
  const GAP = 16; // gap-4
  const desktopCanvasWidth = useMemo(() => {
    const w = cols * CARD_MIN_W + (cols - 1) * GAP;
    return Math.max(1024, Math.min(1600, w));
  }, [cols]);

  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

  const hasGenre = (g: Game, target: Genre) => {
    if (!g.genre) return false;
    const arr = Array.isArray(g.genre) ? g.genre : [g.genre];
    return arr.map(norm).includes(norm(target));
  };

  const getGameName = (g: Game) => {
    const anyG = g as any;
    return String(anyG?.name ?? anyG?.title ?? anyG?.judul ?? '').trim();
  };

  const firstLetter = (g: Game) => {
    const name = getGameName(g);
    if (!name) return '#';
    const ch = name[0].toLowerCase();
    return /[a-z]/.test(ch) ? ch : '#';
  };

  const toNumberLoose = (v: unknown) => {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
      const cleaned = v.replace(/[^\d.-]/g, '');
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : NaN;
    }
    return NaN;
  };

  const getPrice = (g: Game) => {
    const anyG = g as any;
    const candidates = [
      anyG?.price,
      anyG?.harga,
      anyG?.priceIDR,
      anyG?.hargaIDR,
      anyG?.price_idr,
      anyG?.harga_idr,
      anyG?.cost,
      anyG?.biaya,
    ];
    for (const c of candidates) {
      const n = toNumberLoose(c);
      if (Number.isFinite(n)) return n;
    }
    return Number.POSITIVE_INFINITY;
  };

  const getReleaseTime = (g: Game) => {
    const anyG = g as any;
    const candidates = [
      anyG?.releaseDate,
      anyG?.rilis,
      anyG?.release,
      anyG?.tanggalRilis,
      anyG?.date,
      anyG?.year,
      anyG?.tahun,
    ];

    for (const c of candidates) {
      if (c == null) continue;

      if (typeof c === 'number' && Number.isFinite(c)) {
        if (c > 10_000_000_000) return c;
        if (c >= 1970 && c <= 2500) return new Date(c, 0, 1).getTime();
        return c;
      }

      if (typeof c === 'string') {
        const s = c.trim();
        if (!s) continue;

        if (/^\d{4}$/.test(s)) {
          const y = Number(s);
          if (y >= 1970 && y <= 2500) return new Date(y, 0, 1).getTime();
        }

        const t = Date.parse(s);
        if (!Number.isNaN(t)) return t;
      }
    }

    return 0;
  };

  const getImage = (g: Game) => {
    const anyG = g as any;
    return (
      anyG?.image ??
      anyG?.img ??
      anyG?.cover ??
      anyG?.coverUrl ??
      anyG?.cover_url ??
      anyG?.thumbnail ??
      anyG?.thumb ??
      anyG?.poster ??
      anyG?.banner ??
      ''
    );
  };

  const getGenresText = (g: Game) => {
    const anyG = g as any;
    const raw = anyG?.genre ?? anyG?.genres ?? anyG?.kategori ?? anyG?.category;
    if (!raw) return '';
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr
      .map((x: any) => String(x).trim())
      .filter(Boolean)
      .join(' • ');
  };

  const compareBySort = (a: Game, b: Game) => {
    const nameA = getGameName(a);
    const nameB = getGameName(b);

    if (activeSort === 'Abjad (A-Z)') {
      return nameA.localeCompare(nameB, 'id', { sensitivity: 'base' });
    }

    if (activeSort === 'Harga Terendah') {
      const pa = getPrice(a);
      const pb = getPrice(b);
      if (pa !== pb) return pa - pb;
      return nameA.localeCompare(nameB, 'id', { sensitivity: 'base' });
    }

    if (activeSort === 'Harga Tertinggi') {
      const pa = getPrice(a);
      const pb = getPrice(b);
      if (pa !== pb) return pb - pa;
      return nameA.localeCompare(nameB, 'id', { sensitivity: 'base' });
    }

    if (activeSort === 'Rilis Paling Baru') {
      const ra = getReleaseTime(a);
      const rb = getReleaseTime(b);
      if (ra !== rb) return rb - ra;
      return nameA.localeCompare(nameB, 'id', { sensitivity: 'base' });
    }

    const ra = getReleaseTime(a);
    const rb = getReleaseTime(b);
    if (ra !== rb) return ra - rb;
    return nameA.localeCompare(nameB, 'id', { sensitivity: 'base' });
  };

  const filteredGames = useMemo(() => {
    if (activeGenre === 'Semua Genre') return games;
    return games.filter((g) => hasGenre(g, activeGenre as Genre));
  }, [games, activeGenre]);

  const groupedGames = useMemo(() => {
    const sorted = [...filteredGames].sort(compareBySort);

    const baseGroups = ALPHABET_GROUPS.map((group) => ({
      label: group.label as AlphaFilter,
      games: sorted.filter((g) => group.letters.includes(firstLetter(g))),
    }));

    const others = sorted.filter((g) => firstLetter(g) === '#');
    const all = [...baseGroups, { label: 'Game Tidak Tersedia' as AlphaFilter, games: others }];

    if (activeAlpha === 'Semua') return all;
    return all.filter((g) => g.label === activeAlpha);
  }, [filteredGames, activeAlpha, activeSort]);

  const alphaChips = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of ALPHABET_GROUPS) counts[g.label] = 0;
    counts['Game Tidak Tersedia'] = 0;

    for (const g of filteredGames) {
      const fl = firstLetter(g);
      const found = ALPHABET_GROUPS.find((gr) => gr.letters.includes(fl));
      if (found) counts[found.label]++;
      else counts['Game Tidak Tersedia']++;
    }

    return [
      { label: 'Semua' as AlphaFilter, count: filteredGames.length, disabled: filteredGames.length === 0 },
      ...ALPHABET_GROUPS.map((g) => ({
        label: g.label as AlphaFilter,
        count: counts[g.label],
        disabled: counts[g.label] === 0,
      })),
      { label: 'Game Tidak Tersedia' as AlphaFilter, count: counts['Game Tidak Tersedia'], disabled: counts['Game Tidak Tersedia'] === 0 },
    ];
  }, [filteredGames]);

  useEffect(() => {
    setCollapsed((prev) => {
      const next = { ...prev };
      for (const g of groupedGames) {
        if (next[g.label] === undefined) next[g.label] = g.games.length === 0;
      }
      return next;
    });
  }, [groupedGames]);

  const RowItem = ({ g, compact }: { g: Game; compact?: boolean }) => {
    const name = getGameName(g) || 'Untitled';
    const price = getPrice(g);
    const priceText = Number.isFinite(price) && price !== Number.POSITIVE_INFINITY ? formatIDR(price) : '-';
    const genresText = getGenresText(g);
    const img = getImage(g);

    if (compact) {
      return (
        <div className="w-full rounded-xl border bg-white px-3 py-2 flex items-center gap-3">
          <button className="flex-1 min-w-0 text-left" onClick={() => onOpen(g)} title="Buka detail" type="button">
            <div className="text-sm font-semibold leading-tight truncate">{name}</div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{genresText || '—'}</div>
          </button>

          <div className="text-right shrink-0">
            <div className="text-sm font-semibold">{priceText}</div>
            <button
              type="button"
              onClick={() => onAdd(g)}
              className="mt-1 rounded-lg border px-2 py-1 text-xs bg-white border-gray-200"
            >
              + Add
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full rounded-2xl border bg-white p-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onOpen(g)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
          title="Buka detail"
        >
          <div className="h-14 w-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
            {img ? <img src={img} alt={name} className="h-full w-full object-cover" /> : <span className="text-xs text-gray-400">No Img</span>}
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">{name}</div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{genresText || '—'}</div>
          </div>
        </button>

        <div className="text-right shrink-0">
          <div className="font-semibold">{priceText}</div>
          <button
            type="button"
            onClick={() => onAdd(g)}
            className="mt-1 rounded-xl border px-3 py-2 text-sm bg-white border-gray-200"
          >
            + Add
          </button>
        </div>
      </div>
    );
  };

  const GenrePanel = () => (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((g) => (
        <button
          key={g}
          onClick={() => {
            setActiveGenre(g);
            setActiveAlpha('Semua');
            if (isMobile) setMobileGenreOpen(false); // auto close di mobile biar enak
          }}
          className={[
            'rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-300',
            g === activeGenre ? `${theme.bgSolid} text-white border-transparent shadow-sm` : `bg-white text-gray-600 border-gray-200 hover:border-transparent hover:${theme.text}`,
          ].join(' ')}
        >
          {g}
        </button>
      ))}
    </div>
  );

  const AlphaPanel = () => (
    <div className="flex flex-wrap gap-2">
      {alphaChips.map((chip) => (
        <button
          key={chip.label}
          disabled={chip.disabled}
          onClick={() => {
            setActiveAlpha(chip.label);
            if (isMobile) setMobileAlphaOpen(false); // auto close di mobile
          }}
          className={[
            'rounded-xl border px-3 py-1.5 text-sm font-medium transition-all duration-300',
            chip.disabled ? 'opacity-40 cursor-not-allowed' : '',
            chip.label === activeAlpha ? `${theme.bgSolid} text-white border-transparent shadow-sm` : `bg-white text-gray-600 border-gray-200 hover:border-transparent hover:${theme.text}`,
          ].join(' ')}
        >
          {chip.label} ({chip.count})
        </button>
      ))}
    </div>
  );

  return (
    <section className="w-full">
      {/* Title */}
      <div className="mt-8 mb-4 flex items-end justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="text-sm text-gray-500">{filteredGames.length} game</span>
      </div>

      {/* Filters */}
      <div className="bg-white border-b pb-3">
        {/* Mobile: toggle buttons */}
        {isMobile && (
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setMobileGenreOpen((v) => !v)}
              className="flex-1 rounded-xl border px-3 py-2 text-sm bg-white border-gray-200 flex items-center justify-between"
            >
              <span className="font-medium">Pilih By Genre</span>
              <span className="text-gray-500 flex items-center gap-2">
                <span className="text-xs">{activeGenre}</span>
                <Chevron open={mobileGenreOpen} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileAlphaOpen((v) => !v)}
              className="flex-1 rounded-xl border px-3 py-2 text-sm bg-white border-gray-200 flex items-center justify-between"
            >
              <span className="font-medium">Pilih By Abjad</span>
              <span className="text-gray-500 flex items-center gap-2">
                <span className="text-xs">{activeAlpha}</span>
                <Chevron open={mobileAlphaOpen} />
              </span>
            </button>
          </div>
        )}

        {/* Genre */}
        {!isMobile ? (
          <GenrePanel />
        ) : (
          mobileGenreOpen && (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <GenrePanel />
            </div>
          )
        )}

        {/* Alphabet */}
        {!isMobile ? (
          <div className="mt-3">
            <AlphaPanel />
          </div>
        ) : (
          mobileAlphaOpen && (
            <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
              <AlphaPanel />
            </div>
          )
        )}

        {/* Expand / Collapse */}
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              const next: Record<string, boolean> = {};
              groupedGames.forEach((g) => (next[g.label] = false));
              setCollapsed(next);
            }}
            className="flex-1 rounded-xl border px-3 py-2 text-sm bg-white border-gray-200"
          >
            Expand all
          </button>
          <button
            onClick={() => {
              const next: Record<string, boolean> = {};
              groupedGames.forEach((g) => (next[g.label] = true));
              setCollapsed(next);
            }}
            className="flex-1 rounded-xl border px-3 py-2 text-sm bg-white border-gray-200"
          >
            Collapse all
          </button>
        </div>

        {/* Sort + View */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700 font-medium">Urutkan</span>
            <span className="text-xs text-gray-500">{activeSort}</span>
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortOption)}
              className="flex-1 rounded-xl border px-3 py-2 text-sm bg-white border-gray-200 outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <IconButton active={viewMode === 'grid'} onClick={() => setViewMode('grid')} title="Grid view">
                <GridIcon />
              </IconButton>
              <IconButton active={viewMode === 'row'} onClick={() => setViewMode('row')} title="List (baris) view">
                <RowIcon />
              </IconButton>
              <IconButton active={viewMode === 'compact'} onClick={() => setViewMode('compact')} title="Compact list view">
                <CompactIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div className="mt-6">
        {groupedGames.map((group) => {
          const isClosed = collapsed[group.label];

          return (
            <div key={group.label} className="mb-6">
              <button
                onClick={() => setCollapsed((p) => ({ ...p, [group.label]: !p[group.label] }))}
                className="w-full flex justify-between items-center rounded-xl border px-4 py-3 bg-white"
              >
                <span className="font-semibold">{group.label}</span>
                <span className="text-sm text-gray-500">{isClosed ? 'Buka' : 'Tutup'}</span>
              </button>

              {!isClosed && (
                <>
                  {viewMode === 'grid' && (
                    <div className="mt-4">
                      {/* ✅ Desktop vibe ONLY on mobile, desktop stays full width */}
                      <DesktopScaled enabled={isMobile && cols >= 3} desktopWidth={desktopCanvasWidth}>
                        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                          {group.games.map((g) => (
                            <GameCard
                              key={g.id}
                              game={g}
                              onAdd={() => onAdd(g)}
                              onOpen={() => onOpen(g)}
                              formatIDR={formatIDR}
                            />
                          ))}
                        </div>
                      </DesktopScaled>
                    </div>
                  )}

                  {viewMode === 'row' && (
                    <div className="mt-4 flex flex-col gap-3">
                      {group.games.map((g) => (
                        <RowItem key={g.id} g={g} />
                      ))}
                    </div>
                  )}

                  {viewMode === 'compact' && (
                    <div className="mt-4 flex flex-col gap-2">
                      {group.games.map((g) => (
                        <RowItem key={g.id} g={g} compact />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
