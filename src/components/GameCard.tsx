import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, ShoppingCart } from 'lucide-react';
import { Game } from '../types';
import { isUnavailable, displayName } from '../utils/inventory';
import { useThemeContext } from '../ThemeContext';

export default function GameCard({
  game,
  onAdd,
  onOpen,
  formatIDR,
  fitContain = false,
  fixedHeights = true,
}: {
  game: Game;
  onAdd: () => void;
  onOpen: () => void;
  formatIDR: (n: number) => string;
  fitContain?: boolean;
  fixedHeights?: boolean;
}) {
  const [flash, setFlash] = React.useState(false);
  const unavailable = isUnavailable(game.name);
  const shownName = displayName(game.name);
  const theme = useThemeContext();

  React.useEffect(() => {
    let t: number | undefined;
    if (flash) t = window.setTimeout(() => setFlash(false), 1100);
    return () => { if (t) window.clearTimeout(t); };
  }, [flash]);

  function handleAdd() {
    if (unavailable) return;
    onAdd();
    setFlash(true);
  }

  const titleFixed = fixedHeights ? 'h-[2.7rem]' : '';
  const metaFixed = fixedHeights ? 'min-h-[3.2rem]' : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={unavailable ? {} : { y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full"
    >
      {/* Cover */}
      <button
        onClick={onOpen}
        className="block w-full relative flex-shrink-0"
        title="Lihat detail"
        aria-label={`Lihat detail ${shownName}`}
      >
        <div className={`relative w-full overflow-hidden aspect-[3/4] ${fitContain ? 'bg-gray-50' : 'bg-gray-100'}`}>
          <img
            src={game.cover}
            alt={shownName}
            loading="lazy"
            decoding="async"
            className={[
              'absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105',
              fitContain ? 'object-contain' : 'object-cover',
              unavailable ? 'opacity-60' : '',
            ].join(' ')}
          />
        </div>

        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md rounded-lg px-2.5 py-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
          <PlayCircle className="w-3.5 h-3.5" /> Preview
        </span>
      </button>

      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3
          className={[
            'text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 overflow-hidden',
            titleFixed,
          ].join(' ')}
          title={shownName}
        >
          {shownName}
        </h3>

        {/* META */}
        <div
          className={[
            'mt-0 text-[13px] text-gray-600 grid grid-cols-2 gap-y-0.5 gap-x-6',
            metaFixed,
          ].join(' ')}
        >
          {/* Ukuran */}
          <span className="truncate">
            <span className="hidden sm:inline">Ukuran: </span>
            <b className="text-gray-800">{game.size ?? '—'}</b>
          </span>

          {/* Rilis */}
          <span className="truncate">
            <span className="hidden sm:inline">Rilis: </span>
            <b className="text-gray-800">{game.year ?? '—'}</b>
          </span>

          {/* Build */}
          <span className="truncate">
            <span className="hidden sm:inline">Build: </span>
            <b className="text-gray-800">{game.build || '—'}</b>
          </span>

          {/* Player */}
          <span className="truncate">
            <span className="hidden sm:inline">Player: </span>
            <b className="text-gray-800">{game.players ?? '—'}</b>
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <div className="text-lg font-bold tracking-tight whitespace-nowrap text-gray-900">
            {formatIDR(game.price)}
          </div>

          <button
            onClick={handleAdd}
            disabled={unavailable}
            className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold px-3 py-2.5 transition-all duration-300
              ${unavailable
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : `${theme.bgSolid} text-white ${theme.bgSolidHover} shadow-sm hover:shadow-md active:scale-[0.98]`}`}
          >
            {unavailable ? (
              <>Game Tidak Tersedia</>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Tambah ke Keranjang
              </>
            )}
          </button>
        </div>
      </div>

      {/* Flash */}
      <AnimatePresence>
        {flash && !unavailable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-800/70 text-white grid place-items-center text-xs font-semibold"
          >
            sudah dimasukkan ke dalam keranjang
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
