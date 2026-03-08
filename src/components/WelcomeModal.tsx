/// <reference types="vite/client" />
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Gamepad2 } from 'lucide-react';
import { useThemeContext } from '../ThemeContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function WelcomeModal({ open, onClose }: Props) {
  const theme = useThemeContext();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="welcome-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          /* Ditambahkan p-4 (padding) agar di HP layarnya tidak benar-benar mentok ke ujung */
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            /* KUNCI BARU: 
               - max-w-[calc(92dvh*9/16)]: Lebar maksimal dihitung dari 92% tinggi layar.
               - rounded-2xl sm:rounded-[2rem]: Mengembalikan sudut melengkung.
            */
            className="relative w-full max-w-[calc(92dvh*9/16)] aspect-[9/16] bg-gray-900 overflow-hidden rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 text-white border border-white/20 hover:bg-black/60 hover:scale-105 backdrop-blur-md transition-all active:scale-95 shadow-xl"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* FULL BACKGROUND IMAGE */}
            <div className="absolute inset-0 z-0 bg-black">
              <img
                src={`${import.meta.env.BASE_URL}promo-indo.jpg`}
                alt="Promo Game Subtitle Indonesia"
                className="w-full h-full object-cover"
              />
              {/* Gradient terang di tengah */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
            </div>

            {/* CONTENT OVERLAY */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 pb-8 sm:pb-10">

              {/* === BAGIAN ATAS: Tags & Title === */}
              <div className="mt-2 sm:mt-4 pr-12">
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <span className="bg-red-600 font-bold text-[10px] sm:text-xs uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1 shadow-[0_0_10px_rgba(220,38,38,0.5)] text-white">
                    <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" /> GAME TERBARU
                  </span>
                  <span className={`${theme.bgSolid} font-bold text-[10px] sm:text-xs uppercase tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-md shadow-md text-white border border-white/10`}>
                    PS4 HEN
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-5xl font-black leading-tight text-white tracking-tight drop-shadow-2xl">
                  MOD SUBTITLE <br />
                  <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]">B. INDONESIA</span>
                </h2>
              </div>

              {/* === BAGIAN BAWAH: Deskripsi & Tombol === */}
              <div>
                <p className="text-xs sm:text-base lg:text-lg text-gray-100 mb-6 sm:mb-8 leading-relaxed font-medium drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)]">
                  Makin seru & paham cerita! Mainkan The Last of Us, God of War, dan puluhan game AAA lainnya dalam <strong className="text-white drop-shadow-md">Bahasa Indonesia</strong>. Eksklusif hanya di URBAN Gaming Lampung.
                </p>

                <button
                  onClick={onClose}
                  className={`w-full relative group overflow-hidden flex items-center justify-center gap-2 ${theme.bgSolid} text-white font-bold py-3.5 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl ${theme.bgSolidHover} active:scale-[0.98] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-sm sm:text-lg border border-white/10`}
                >
                  {/* Efek kilap modern */}
                  <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

                  <Gamepad2 size={20} className="sm:w-6 sm:h-6 relative z-10" />
                  <span className="relative z-10">Saya Mengerti</span>
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}