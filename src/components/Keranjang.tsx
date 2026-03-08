import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Minus, Plus, Trash2, Info, HardDrive, ShoppingBag } from "lucide-react";
import type { CartItem } from "../types";
import { useThemeContext } from "../ThemeContext";

type Props = {
  items: CartItem[];
  setItems: (fn: any) => void;
  onClose: () => void;
  formatIDR: (n: number) => string;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  onCheckout: () => void;
  totalSizePS3: number;
  totalSizePS4: number;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Keranjang({
  items,
  setItems,
  onClose,
  formatIDR,
  subtotal,
  discountPercent,
  discountAmount,
  total,
  onCheckout,
  totalSizePS3,
  totalSizePS4,
}: Props) {
  const theme = useThemeContext();
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const hasItems = items.length > 0;

  const totals = useMemo(
    () => ({
      subtotalText: formatIDR(subtotal),
      discountText: formatIDR(discountAmount),
      totalText: formatIDR(total),
    }),
    [formatIDR, subtotal, discountAmount, total]
  );

  const decQty = useCallback(
    (id: string) => {
      setItems((prev: CartItem[]) =>
        prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty - 1) } : p))
      );
    },
    [setItems]
  );

  const incQty = useCallback(
    (id: string) => {
      setItems((prev: CartItem[]) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
    },
    [setItems]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev: CartItem[]) => prev.filter((p) => p.id !== id));
    },
    [setItems]
  );

  const clearAll = useCallback(() => setItems([]), [setItems]);

  // ESC to close + basic focus entry
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // focus the panel for better keyboard flow
    setTimeout(() => panelRef.current?.focus(), 0);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const overlayVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.18 } },
      exit: { opacity: 0, transition: { duration: reduceMotion ? 0 : 0.12 } },
    }),
    [reduceMotion]
  );

  const panelVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 18, scale: 0.985 },
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: reduceMotion ? 0 : 0.22,
          ease: [0.22, 1, 0.36, 1],
        },
      },
      exit: { opacity: 0, y: 18, scale: 0.985, transition: { duration: reduceMotion ? 0 : 0.16 } },
    }),
    [reduceMotion]
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10, scale: 0.99 },
      show: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: reduceMotion ? 0 : 0.2,
          delay: reduceMotion ? 0 : Math.min(i * 0.02, 0.12),
          ease: [0.22, 1, 0.36, 1],
        },
      }),
      exit: { opacity: 0, y: 10, scale: 0.99, transition: { duration: reduceMotion ? 0 : 0.14 } },
    }),
    [reduceMotion]
  );

  return (
    <motion.div
      className="fixed inset-0 z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      aria-modal="true"
      role="dialog"
    >
      {/* overlay */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Tutup keranjang"
      />

      {/* modal */}
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        variants={panelVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className={cn(
          "relative mx-auto my-4",
          "w-[min(56rem,calc(100vw-1.25rem))]",
          "max-h-[calc(100vh-1.25rem)]",
          "rounded-2xl overflow-hidden",
          "bg-white",
          "shadow-2xl",
          "ring-1 ring-gray-100",
          "flex flex-col"
        )}
      >
        {/* HEADER (sticky) */}
        <div className="relative flex-shrink-0 border-b border-gray-100 bg-white">
          <div className="p-5 md:p-6 flex items-start gap-4 justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className={`h-10 w-10 rounded-xl ${theme.bgSolid} text-white flex items-center justify-center shadow-sm`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-black tracking-tight text-gray-900">
                    Keranjang
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                    Tekan <span className="font-semibold">Kirim ke Admin</span> → invoice PDF auto keunduh, lalu WhatsApp kebuka.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-2xl",
                "hover:bg-black/5 active:scale-[0.98]",
                "transition"
              )}
              aria-label="Tutup"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* subtle bottom gradient line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </div>

        {!hasItems ? (
          <div className="flex-1 min-h-0 flex items-center justify-center p-10">
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-black/5 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-slate-500" />
              </div>
              <div className="text-slate-700 font-semibold">Belum ada item di keranjang.</div>
              <div className="text-xs text-slate-500 mt-1">Gas pilih game dulu 😄</div>
            </div>
          </div>
        ) : (
          <>
            {/* LIST (scroll area only) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-6">
              <div className="flex flex-col gap-3 md:gap-4">
                <AnimatePresence initial={false}>
                  {items.map((it, idx) => (
                    <motion.div
                      key={it.id}
                      custom={idx}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className={cn(
                        "group rounded-2xl",
                        "border border-black/5",
                        "bg-white/70 backdrop-blur",
                        "shadow-sm",
                        "hover:shadow-md hover:-translate-y-[1px]",
                        "transition will-change-transform"
                      )}
                    >
                      <div className="p-3 md:p-4 flex items-center justify-between gap-3 md:gap-4">
                        {/* left */}
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          {it.cover ? (
                            <div className="relative flex-shrink-0">
                              <img
                                src={it.cover}
                                alt={it.name}
                                loading="lazy"
                                className={cn(
                                  "w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl",
                                  "ring-1 ring-black/10",
                                  "shadow-[0_10px_25px_-18px_rgba(0,0,0,0.45)]"
                                )}
                              />
                              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/30" />
                            </div>
                          ) : (
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl ring-1 ring-black/10 bg-black/5 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                              No Image
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 line-clamp-2">{it.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{it.platform}</div>

                            <div className="mt-1.5 flex items-center gap-2">
                              <div className="text-sm font-extrabold text-slate-900">{formatIDR(it.price)}</div>
                              <span className="text-[11px] text-slate-500">
                                • {formatIDR(it.price * it.qty)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* right controls */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => decQty(it.id)}
                            className={cn(
                              "w-9 h-9 rounded-xl",
                              "ring-1 ring-black/10 bg-white/70",
                              "hover:bg-black/5 active:scale-[0.98]",
                              "transition"
                            )}
                            aria-label="Kurangi"
                            title="Kurangi"
                          >
                            <Minus className="w-4 h-4 mx-auto text-slate-700" />
                          </button>

                          <div className="w-10 text-center font-extrabold select-none text-slate-900">
                            {it.qty}
                          </div>

                          <button
                            onClick={() => incQty(it.id)}
                            className={cn(
                              "w-9 h-9 rounded-xl",
                              "ring-1 ring-black/10 bg-white/70",
                              "hover:bg-black/5 active:scale-[0.98]",
                              "transition"
                            )}
                            aria-label="Tambah"
                            title="Tambah"
                          >
                            <Plus className="w-4 h-4 mx-auto text-slate-700" />
                          </button>

                          <button
                            onClick={() => removeItem(it.id)}
                            className={cn(
                              "w-9 h-9 rounded-xl",
                              "ring-1 ring-black/10 bg-white/70",
                              "text-slate-500",
                              "hover:bg-red-50 hover:text-red-700 hover:ring-red-200",
                              "active:scale-[0.98]",
                              "transition ml-1"
                            )}
                            aria-label="Hapus item"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>

                      {/* bottom accent line */}
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* FOOTER (sticky) */}
            <div className="flex-shrink-0 border-t border-black/5 bg-white/60 backdrop-blur-xl">
              <div className="p-5 md:p-6">
                {/* Total size card */}
                <div className="rounded-2xl ring-1 ring-black/10 bg-gradient-to-b from-white/70 to-white/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <HardDrive className="w-4 h-4" />
                      <span>Total Size Game</span>
                    </div>
                    <div className="text-[11px] text-slate-500">estimasi total</div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-black/5 ring-1 ring-black/5 p-3">
                      <div className="text-[11px] text-slate-600">PS3</div>
                      <div className="text-lg font-black text-slate-900">{totalSizePS3} GB</div>
                    </div>
                    <div className="rounded-xl bg-black/5 ring-1 ring-black/5 p-3">
                      <div className="text-[11px] text-slate-600">PS4</div>
                      <div className="text-lg font-black text-slate-900">{totalSizePS4} GB</div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="pt-4 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-extrabold text-slate-900">{totals.subtotalText}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-slate-600">Diskon (jumlah game PS3/PS4)</span>
                    <span className="font-extrabold text-slate-900">
                      {discountPercent}% <span className="text-slate-500 font-semibold">(−{totals.discountText})</span>
                    </span>
                  </div>

                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] text-slate-500">Total bayar</div>
                      <div className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                        {totals.totalText}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      Diskon: 5=10%, 10=15%, 15=20%
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onCheckout}
                      className={cn(
                        "flex-1 inline-flex items-center justify-center gap-2",
                        "rounded-xl px-4 py-3",
                        "text-sm font-extrabold text-white",
                      theme.bgSolid,
                      "shadow-sm",
                      `${theme.bgSolidHover} hover:shadow-md active:scale-[0.985]`,
                      "transition-all duration-300"
                    )}
                    >
                      Kirim ke Admin (WA)
                    </button>

                    <button
                      onClick={clearAll}
                      className={cn(
                        "sm:w-44 inline-flex items-center justify-center gap-2",
                        "rounded-xl px-4 py-3",
                        "text-sm font-extrabold",
                        "bg-gray-50 text-gray-800",
                        "ring-1 ring-gray-200",
                        "hover:bg-gray-100 active:scale-[0.985]",
                        "transition-all"
                      )}
                    >
                      Kosongkan
                    </button>
                  </div>

                  {/* tiny safe area for mobile notch */}
                  <div className="h-2" />
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
