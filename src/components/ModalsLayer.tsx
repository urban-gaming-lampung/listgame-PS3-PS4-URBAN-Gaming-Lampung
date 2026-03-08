// src/components/ModalsLayer.tsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';

import GameDetailModal from './GameDetailPopUp';
import CartModal from './Keranjang';
import ProdukLainnyaDetail from './ProdukLainnyaDetail';
import PromoModal, { Promo } from './PromoModal';
import WelcomeModal from './WelcomeModal';

export type ModalsLayerProps = {
  // Welcome Promo
  showWelcome: boolean;
  onCloseWelcome: () => void;
  // Game detail
  selected: any | null;
  onCloseSelected: () => void;
  onAddSelected: () => void;
  formatIDR: (n: number) => string;

  // Cart
  showCart: boolean;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  onCloseCart: () => void;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  onCheckout: () => void;
  totalSizePS3: number;
  totalSizePS4: number;

  // Produk lainnya detail
  selectedProduct: any | null;
  onCloseSelectedProduct: () => void;
  onAddProduct: (p: any) => void;

  // Promo
  promoOpen: boolean;
  promos: Promo[];
  selectedPromo: Promo | null;
  onSelectPromo: (p: Promo) => void;
  onBackToPromoList: () => void;
  onClosePromo: () => void;
  onOpenCartFromPromo: () => void;
};

export default function ModalsLayer(props: ModalsLayerProps) {
  const {
    // Welcome Promo
    showWelcome,
    onCloseWelcome,

    // Game detail
    selected,
    onCloseSelected,
    onAddSelected,
    formatIDR,

    // Cart
    showCart,
    cart,
    setCart,
    onCloseCart,
    subtotal,
    discountPercent,
    discountAmount,
    total,
    onCheckout,
    totalSizePS3,
    totalSizePS4,

    // Produk lainnya detail
    selectedProduct,
    onCloseSelectedProduct,
    onAddProduct,

    // Promo
    promoOpen,
    promos,
    selectedPromo,
    onSelectPromo,
    onBackToPromoList,
    onClosePromo,
    onOpenCartFromPromo,
  } = props;

  return (
    <>
      {/* Game Detail Modal */}
      <AnimatePresence>
        {selected && (
          <GameDetailModal
            game={selected}
            onAdd={onAddSelected}
            onClose={onCloseSelected}
            formatIDR={formatIDR}
          />
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <CartModal
            items={cart}
            setItems={setCart}
            onClose={onCloseCart}
            formatIDR={formatIDR}
            subtotal={subtotal}
            discountPercent={discountPercent}
            discountAmount={discountAmount}
            total={total}
            onCheckout={onCheckout}
            totalSizePS3={Number(totalSizePS3.toFixed(1))}
            totalSizePS4={Number(totalSizePS4.toFixed(1))}
          />
        )}
      </AnimatePresence>

      {/* Produk Lainnya Detail */}
      <ProdukLainnyaDetail
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={onCloseSelectedProduct}
        onAdd={(p: any) => onAddProduct(p)}
        formatIDR={formatIDR}
      />

      {/* Promo Modal */}
      <PromoModal
        open={promoOpen}
        promos={promos}
        selectedPromo={selectedPromo}
        onSelectPromo={onSelectPromo}
        onBackToList={onBackToPromoList}
        onClose={onClosePromo}
        onOpenCart={onOpenCartFromPromo}
      />

      {/* Welcome Marketing Modal */}
      <WelcomeModal
        open={showWelcome}
        onClose={onCloseWelcome}
      />
    </>
  );
}
