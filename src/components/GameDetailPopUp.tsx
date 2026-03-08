import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  PlayCircle,
  ShoppingCart,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Game } from '../types';
import { isUnavailable, displayName } from '../utils/inventory';
import { useThemeContext } from '../ThemeContext';

export default function GameDetailPopUp({
  game,
  onClose,
  onAdd,
  formatIDR,
}: {
  game: Game & { gameplayYoutubeUrl?: string; youtubeQuery?: string };
  onClose: () => void;
  onAdd: () => void;
  formatIDR: (n: number) => string;
}) {
  const theme = useThemeContext();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  React.useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [game]);

  const unavailable = isUnavailable(game.name);
  const shownName = displayName(game.name);

  // --- YouTube helpers ---
  const extractYouTubeId = (url?: string | null) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '').split('?')[0];
      const v = u.searchParams.get('v');
      if (v) return v;
      const segs = u.pathname.split('/').filter(Boolean);
      const i = segs.findIndex((s) => s === 'embed');
      if (i >= 0 && segs[i + 1]) return segs[i + 1];
      return null;
    } catch {
      return null;
    }
  };

  const toEmbedUrl = (url: string) => {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : url;
  };

  const fallbackQuery = game.youtubeQuery?.trim()
    ? game.youtubeQuery
    : `${shownName} gameplay`;

  const explicitVideoId = extractYouTubeId(game.gameplayYoutubeUrl || undefined);
  const explicitEmbed = explicitVideoId
    ? `https://www.youtube.com/embed/${explicitVideoId}`
    : game.gameplayYoutubeUrl
    ? toEmbedUrl(game.gameplayYoutubeUrl)
    : null;

  const videoSrc = explicitEmbed
    ? explicitEmbed
    : `https://www.youtube-nocookie.com/embed?rel=0&listType=search&list=${encodeURIComponent(
        fallbackQuery
      )}`;

  const videoThumb = explicitVideoId
    ? `https://i.ytimg.com/vi/${explicitVideoId}/hqdefault.jpg`
    : null;

  // --- Slides: video + screenshots (tanpa cover) ---
  const imageSlides = Array.isArray(game.screenshots) ? game.screenshots.filter(Boolean) : [];
  const slides: Array<{ type: 'video' | 'image'; src: string; thumb?: string }> = [
    { type: 'video', src: videoSrc, thumb: videoThumb || undefined },
    ...imageSlides.map((s) => ({ type: 'image' as const, src: s })),
  ];

  const total = slides.length;
  const current = slides[activeIndex];

  const goto = (n: number) => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + n + total) % total);
  };

  // --- Keyboard navigation ---
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      } else if (e.key === 'ArrowLeft') {
        goto(-1);
      } else if (e.key === 'ArrowRight') {
        goto(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, total, lightboxOpen]);

  // --- Swipe gesture (mobile) ---
  const touchStartX = React.useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) goto(-1);
      else goto(1);
    }
    touchStartX.current = null;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Media utama */}
        <div
          className="relative group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {current?.type === 'video' ? (
            <iframe
              className={`w-full aspect-video ${unavailable ? 'opacity-60' : ''}`}
              src={current.src}
              title={`${shownName} gameplay`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="relative w-full"
              aria-label="Buka gambar fullscreen"
            >
              <img
                src={current?.src}
                alt={shownName}
                className={`w-full aspect-video object-cover ${unavailable ? 'opacity-60' : ''}`}
                loading="lazy"
                decoding="async"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-xl bg-black/55 text-white text-[11px] md:text-xs font-semibold px-2.5 py-1 opacity-0 group-hover:opacity-100 transition">
                <Maximize2 className="w-4 h-4" /> Fullscreen
              </span>
            </button>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/60"
            aria-label="Tutup popup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev / Next (tampil mulai tablet/desktop) */}
          {total > 1 && (
            <>
              <button
                onClick={() => goto(-1)}
                aria-label="Sebelumnya"
                className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => goto(1)}
                aria-label="Berikutnya"
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Slide indicator */}
          {total > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-black/60 text-white text-[11px] md:text-xs font-semibold px-2 py-0.5">
                {activeIndex + 1} / {total}
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      i === activeIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="px-4 md:px-5 pt-2">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {slides.map((s, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={`${s.type}-${i}`}
                  onClick={() => setActiveIndex(i)}
                  className={`relative border rounded-xl overflow-hidden shrink-0 transition-all ${
                    isActive ? `ring-2 ${theme.ring} border-transparent scale-105` : `border-gray-200 hover:border-transparent hover:${theme.ring}`
                  }`}
                  aria-label={s.type === 'video' ? 'Video gameplay' : `Screenshot ${i}`}
                >
                  {s.type === 'video' ? (
                    <div className="relative w-28 h-16">
                      {s.thumb ? (
                        <img
                          src={s.thumb}
                          alt="Thumbnail video"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-white text-xs font-semibold">
                          ▶ Video
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex items-center justify-center p-2 rounded-full bg-black/60 text-white">
                          <PlayCircle className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={s.src}
                      className="w-28 h-16 object-cover"
                      loading="lazy"
                      decoding="async"
                      alt="Screenshot"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info game (jarak tipis) */}
        <div className="px-5 md:px-6 pt-4 pb-5">
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
            {shownName}{' '}
            <span className="text-gray-600 font-semibold">[{game.platform}]</span>
          </h3>
          <div className="mt-1 text-xs md:text-sm text-gray-600">
            Rilis {game.year} • Ukuran {game.size} • Build {game.build} • Player {game.players}
          </div>

          {game.description && (
            <p className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed">
              {game.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <a
              href={
                explicitVideoId
                  ? `https://www.youtube.com/watch?v=${explicitVideoId}`
                  : `https://www.youtube.com/results?search_query=${encodeURIComponent(fallbackQuery)}`
              }
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 text-sm font-semibold ${theme.text} hover:opacity-80 hover:underline transition-colors`}
            >
              <PlayCircle className="w-4 h-4" /> Buka di YouTube
            </a>
          </div>

          {/* Harga & CTA */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Harga</div>
              <div className="text-2xl font-extrabold truncate">{formatIDR(game.price)}</div>
            </div>
            <button
              onClick={() => {
                if (!unavailable) onAdd();
              }}
              disabled={unavailable}
              className={`inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold px-6 py-3 transition-all duration-300 ${
                unavailable
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : `${theme.bgSolid} text-white ${theme.bgSolidHover} shadow-sm hover:shadow-lg active:scale-[0.98]`
              }`}
            >
              {unavailable ? (
                <>Game Tidak Tersedia</>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Tambahkan ke Keranjang
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* LIGHTBOX fullscreen */}
      <AnimatePresence>
        {lightboxOpen && current?.type === 'image' && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              aria-label="Tutup lightbox"
              className="absolute top-4 right-4 z-[61] p-2 rounded-full bg-white/90 hover:bg-white shadow"
            >
              <Minimize2 className="w-5 h-5" />
            </button>

            {total > 1 && (
              <>
                <button
                  onClick={() => goto(-1)}
                  aria-label="Sebelumnya"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[61] w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow hidden sm:flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => goto(1)}
                  aria-label="Berikutnya"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[61] w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow hidden sm:flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="w-full h-full flex items-center justify-center p-4">
              <motion.img
                key={current.src}
                src={current.src}
                alt="Preview fullscreen"
                className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              />
            </div>

            {total > 0 && (
              <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1">
                <span className="inline-flex items-center rounded-md bg-white/15 text-white text-xs font-semibold px-2 py-0.5">
                  {activeIndex + 1} / {total}
                </span>
                <div className="hidden sm:flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Ke slide ${i + 1}`}
                      className={`w-2 h-2 rounded-full ${
                        i === activeIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
