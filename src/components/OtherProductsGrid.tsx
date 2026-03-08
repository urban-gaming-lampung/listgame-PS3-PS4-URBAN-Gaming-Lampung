import React from 'react';
import { Product } from '../types';
import OtherProductCard from './ProdukLainnyaCard';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function OtherProductsGrid({
  products,
  onAdd,
  onOpen,
  formatIDR,
  gridCols = 3, // ✅ NEW: dikontrol dari floating zoom button
}: {
  products: Product[];
  onAdd: (p: Product) => void;
  onOpen?: (p: Product) => void; // untuk buka modal preview
  formatIDR: (n: number) => string;
  gridCols?: number; // ✅ NEW
}) {
  const cols = clamp(gridCols, 2, 5);

  if (!products?.length) {
    return <div className="w-full py-16 text-center text-gray-500">Produk tidak ditemukan.</div>;
  }

  return (
    <div
      className="grid gap-5"
      // ✅ FIX: gak peduli ukuran layar, selalu ikut cols (2–5)
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {products.map((p) => (
        <OtherProductCard
          key={p.id}
          product={p}
          onAdd={() => onAdd(p)}
          onOpen={onOpen ? () => onOpen(p) : undefined}
          formatIDR={formatIDR}
        />
      ))}
    </div>
  );
}
