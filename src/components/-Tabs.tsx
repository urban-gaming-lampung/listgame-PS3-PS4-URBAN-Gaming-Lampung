import React from "react";
import { Megaphone, ShoppingCart, X } from "lucide-react";

export type TabKey = "PS3" | "PS4" | "PS5" | "Produk Lainnya";

export type SortKey =
  | "abjad"
  | "harga-asc"
  | "harga-desc"
  | "rilis-new"
  | "rilis-old";

type TabsProps = {
  tabs: readonly TabKey[];
  active: TabKey;
  onChange: (t: TabKey) => void;

  query: string;
  setQuery: (q: string) => void;

  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;

  cartCount: number;
  onChatAdmin: () => void; // masih ada biar ga ngerusak parent (ga dipakai)
  onOpenCart: () => void;
  onOpenAnnouncement: () => void;
};

const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.11 17.19c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.2-1.34-.82-.73-1.37-1.63-1.53-1.9-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.03-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27s.98 2.63 1.12 2.81c.14.18 1.93 2.95 4.68 4.13.65.28 1.15.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.82-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.32z" />
    <path d="M26.67 5.33A14.67 14.67 0 0 0 3.3 23.3L2 30l6.83-1.29A14.67 14.67 0 0 0 30.67 16c0-3.92-1.53-7.61-4-10.67zM16 28c-2.43 0-4.69-.73-6.58-1.99l-.47-.3-4.05.76.77-3.95-.31-.49A12 12 0 1 1 28 16 12.02 12.02 0 0 1 16 28z" />
  </svg>
);

const IconCircleButton = ({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className="
      relative inline-flex items-center justify-center
      w-10 h-10 rounded-full
      border border-gray-200/70 bg-white/80
      shadow-sm
      hover:bg-white hover:shadow
      active:scale-[0.97]
      transition
      focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2
      motion-reduce:transition-none motion-reduce:active:transform-none
    "
  >
    {children}
  </button>
);

const WhatsAppCircleButton = ({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className="
      relative inline-flex items-center justify-center
      w-10 h-10 rounded-full
      border border-emerald-200/70
      bg-emerald-500
      text-white
      shadow-sm
      hover:bg-emerald-600 hover:shadow
      active:scale-[0.97]
      transition
      focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2
      motion-reduce:transition-none motion-reduce:active:transform-none
    "
  >
    {children}
  </button>
);

const CartBadge = ({ cartCount }: { cartCount: number }) => {
  if (cartCount <= 0) return null;
  const label = cartCount > 99 ? "99+" : String(cartCount);

  return (
    <span
      className="
        absolute -top-1.5 -right-1.5
        min-w-[18px] h-[18px]
        px-1
        flex items-center justify-center
        rounded-full
        bg-red-500 text-white
        text-[10.5px] font-extrabold
        border border-white
        shadow
        leading-none
        select-none
      "
      aria-label={`Keranjang berisi ${label} item`}
      title={`Keranjang: ${label}`}
    >
      {label}
    </span>
  );
};

const SearchInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <div className="relative w-full">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full rounded-2xl
        border border-gray-200/80
        bg-white/85
        px-3 py-2.5 text-sm
        pr-9
        shadow-sm
        placeholder:text-gray-400
        hover:bg-white hover:shadow
        focus:bg-white
        focus:outline-none focus:ring-2 focus:ring-gray-300/70
        transition
        motion-reduce:transition-none
      "
      placeholder={placeholder}
      inputMode="search"
      autoComplete="off"
    />

    {/* tombol clear (X) kalau ada isi */}
    {value ? (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Clear search"
        title="Clear"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition"
      >
        <X className="w-4 h-4" />
      </button>
    ) : (
      <svg
        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 21l-4.3-4.3m1.55-4.45a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )}
  </div>
);

function TabButton({
  label,
  isActive,
  onClick,
  className = "",
}: {
  label: TabKey;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        px-3 py-2
        text-xs md:text-sm font-semibold
        rounded-xl whitespace-nowrap
        transition
        motion-reduce:transition-none
        ${
          isActive
            ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/70"
            : "text-gray-600 hover:text-gray-900 hover:bg-white/70"
        }
        active:scale-[0.99] motion-reduce:active:transform-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2
        ${className}
      `}
    >
      {label}
    </button>
  );
}

export default function Tabs({
  tabs,
  active,
  onChange,
  query,
  setQuery,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortBy: _sortBy,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSortBy: _setSortBy,
  cartCount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChatAdmin: _onChatAdmin,
  onOpenCart,
  onOpenAnnouncement,
}: TabsProps) {
  const placeholder = active === "Produk Lainnya" ? "Cari produk…" : "Cari game…";

  // urutin tab biar konsisten
  const order: TabKey[] = ["PS3", "PS4", "PS5", "Produk Lainnya"];
  const tabSet = new Set(tabs);
  const orderedTabs = order.filter((t) => tabSet.has(t));

  // ===== WhatsApp settings =====
  const waNumberLocal = "085709647790";
  const waNumberIntl = "6285709647790"; // 0 -> 62
  const waText = "Hallo admin saya tertarik beli di URBAN Gaming Lampung";

  const openWhatsApp = () => {
    const url = `https://wa.me/${waNumberIntl}?text=${encodeURIComponent(
      waText
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="sticky top-0 z-30">
      <div className="border-b border-gray-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/55 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="rounded-3xl border border-gray-200/70 bg-white/40 backdrop-blur-sm overflow-hidden">
            {/* ================= MOBILE (JANGAN DIUBAH) ================= */}
            <div className="flex flex-col md:hidden">
              {/* Baris atas: Search + ikon */}
              <div className="flex items-center gap-2 p-3">
                <div className="flex-1 min-w-0">
                  <SearchInput
                    value={query}
                    onChange={setQuery}
                    placeholder={placeholder}
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* tombol pengumuman dihapus */}

                  <div className="relative">
                    <IconCircleButton title="Keranjang" onClick={onOpenCart}>
                      <ShoppingCart className="w-5 h-5" />
                    </IconCircleButton>
                    <CartBadge cartCount={cartCount} />
                  </div>

                  <WhatsAppCircleButton
                    title={`Chat WhatsApp (${waNumberLocal})`}
                    onClick={openWhatsApp}
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                  </WhatsAppCircleButton>
                </div>
              </div>

              <div className="h-px bg-gray-200/70" />

              {/* Baris bawah: Tabs GRID (mobile tetap 3 + 1 bawah) */}
              <div className="p-3">
                <div className="rounded-2xl bg-gray-100/80 p-1 shadow-inner">
                  <div className="grid grid-cols-3 gap-1">
                    {["PS3", "PS4", "PS5"].map((t) => (
                      <TabButton
                        key={t}
                        label={t as TabKey}
                        isActive={active === (t as TabKey)}
                        onClick={() => onChange(t as TabKey)}
                        className="w-full"
                      />
                    ))}
                  </div>

                  {orderedTabs.includes("Produk Lainnya") && (
                    <>
                      <div className="h-2" />
                      <div className="grid grid-cols-1 gap-1">
                        <TabButton
                          label="Produk Lainnya"
                          isActive={active === "Produk Lainnya"}
                          onClick={() => onChange("Produk Lainnya")}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ================= DESKTOP (TAB NYATU 4, SEARCH+TOMBOL DI BAWAH) ================= */}
            <div className="hidden md:block p-3">
              {/* Baris 1: Tabs (4 nyatu) */}
              <div className="rounded-2xl bg-gray-100/80 p-1 shadow-inner">
                <div className="grid grid-cols-4 gap-1">
                  {orderedTabs.map((t) => (
                    <TabButton
                      key={t}
                      label={t}
                      isActive={active === t}
                      onClick={() => onChange(t)}
                      className="w-full"
                    />
                  ))}
                </div>
              </div>

              <div className="h-3" />

              {/* Baris 2: Search + 3 tombol */}
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-[260px]">
                  <SearchInput
                    value={query}
                    onChange={setQuery}
                    placeholder={placeholder}
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* tombol pengumuman dihapus */}

                  <div className="relative">
                    <IconCircleButton title="Keranjang" onClick={onOpenCart}>
                      <ShoppingCart className="w-5 h-5" />
                    </IconCircleButton>
                    <CartBadge cartCount={cartCount} />
                  </div>

                  <WhatsAppCircleButton
                    title={`Chat WhatsApp (${waNumberLocal})`}
                    onClick={openWhatsApp}
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                  </WhatsAppCircleButton>
                </div>
              </div>
            </div>
            {/* ================= /DESKTOP ================= */}
          </div>
        </div>
      </div>
    </div>
  );
}
