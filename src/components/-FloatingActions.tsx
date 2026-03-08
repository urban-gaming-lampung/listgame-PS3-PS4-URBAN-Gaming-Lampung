import React, { useState, useEffect } from 'react';
import { MessageCircle, ShoppingCart, Megaphone, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  cartCount: number;
  onChatAdmin: () => void;
  onOpenCart: () => void;
  onOpenAnnouncement: () => void;
};

export default function FloatingActions({
  cartCount,
  onChatAdmin,
  onOpenCart,
  onOpenAnnouncement,
}: Props) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setShowScrollTop((window.scrollY || document.documentElement.scrollTop) > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const Item = ({
    children,
    onClick,
    className,
    label,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className: string;
    label: string;
  }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 shadow-lg border text-white w-48 h-12 ${className}`}
      aria-label={label}
    >
      {children}
      <span className="text-sm font-semibold">{label}</span>
    </motion.button>
  );

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col-reverse gap-3 md:right-6 md:bottom-6">
      {/* Pengumuman */}
      <Item
        onClick={onOpenAnnouncement}
        className="bg-red-600 border-red-700 hover:brightness-110 active:brightness-95"
        label="Pengumuman"
      >
        <Megaphone className="w-5 h-5" />
      </Item>

      {/* Keranjang */}
      <div className="relative">
        <Item
          onClick={onOpenCart}
          className="bg-black border-black hover:brightness-110 active:brightness-95"
          label="Keranjang"
        >
          <ShoppingCart className="w-5 h-5" />
        </Item>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 grid place-items-center w-5 h-5 rounded-full text-[11px] bg-white text-black font-bold border">
            {cartCount}
          </span>
        )}
      </div>

      {/* Chat Admin + panah di atas kanan */}
      <div className="relative">
        <Item
          onClick={onChatAdmin}
          className="bg-green-500 border-green-600 hover:brightness-110 active:brightness-95"
          label="Chat Admin"
        >
          <MessageCircle className="w-5 h-5" />
        </Item>

        {/* Panah ke atas */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              key="scroll-top"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="
                absolute right-0 bottom-full mb-2
                w-9 h-9 rounded-full
                bg-gray-200 text-gray-800
                shadow border border-gray-300
                flex items-center justify-center
                hover:bg-gray-300
                z-50
              "
              aria-label="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
