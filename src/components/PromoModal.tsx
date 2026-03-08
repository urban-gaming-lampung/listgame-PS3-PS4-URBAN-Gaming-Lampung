import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Promo = {
  id: 'p5' | 'p10' | 'p15';
  minGames: number;
  percent: number;
  title: string;
  subtitle: string;
  desc: string;
};

type Props = {
  open: boolean;
  promos: Promo[];
  selectedPromo: Promo | null;
  onSelectPromo: (p: Promo) => void;
  onBackToList: () => void;
  onClose: () => void;
  onOpenCart: () => void;
};

export default function PromoModal({
  open,
  promos,
  selectedPromo,
  onSelectPromo,
  onBackToList,
  onClose,
  onOpenCart,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="promo-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center"
          aria-modal="true"
          role="dialog"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/40" />

          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="relative w-full sm:w-[460px] mx-3 mb-3 sm:mb-0 rounded-2xl bg-white shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-extrabold">🔥 Promo Pembelian Game 🔥</div>

                {!selectedPromo && <div className="text-xs text-gray-600 mt-0.5">Pilih promo di bawah ini</div>}

                {selectedPromo && (
                  <div className="text-xs text-gray-600 mt-0.5">
                    Minimal {selectedPromo.minGames} game • Diskon {selectedPromo.percent}%
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedPromo && (
                  <button
                    type="button"
                    onClick={onBackToList}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50"
                  >
                    Kembali
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-sm hover:bg-gray-50"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="px-4 py-3">
              {/* VIEW 1: list tombol promo */}
              {!selectedPromo ? (
                <div className="space-y-2">
                  {promos.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectPromo(p)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-left hover:bg-gray-50 active:scale-[0.99] transition"
                    >
                      isi <b>{p.minGames}</b> game <span className="text-gray-500">diskon</span> <b>{p.percent}%</b>
                      <div className="text-[11px] text-gray-500 mt-0.5">Tap untuk detail</div>
                    </button>
                  ))}
                </div>
              ) : (
                /* VIEW 2: detail promo */
                <>
                  <div className="text-sm text-gray-800 leading-relaxed">{selectedPromo.desc}</div>

                  <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-3 text-sm">
                    <div className="font-semibold">Cara dapet diskon:</div>
                    <ul className="list-disc pl-5 mt-1 text-gray-700 space-y-1">
                      <li>
                        Masukkan minimal <b>{selectedPromo.minGames}</b> game PS3/PS4 ke keranjang
                      </li>
                      <li>Diskon otomatis muncul di keranjang</li>
                      <li>Diskon hanya untuk item game (bukan Produk Lainnya)</li>
                    </ul>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={onOpenCart}
                      className="flex-1 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-95"
                    >
                      Buka Keranjang
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                      Oke
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
