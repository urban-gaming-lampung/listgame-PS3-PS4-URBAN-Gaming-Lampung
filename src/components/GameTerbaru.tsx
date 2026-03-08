import * as React from "react";
import { Game, Platform } from "../types";
import { ShoppingCart } from "lucide-react";
import { useThemeContext } from "../ThemeContext";

type Props = {
  games: Game[];
  platform: Platform;
  onAdd: (g: Game) => void;
  onOpen: (g: Game) => void;
  formatIDR: (n: number) => string;
  fitContainCovers?: boolean;
  useFixedHeights?: boolean;
  title?: string;
  limit?: number;
};

function cx(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(" ");
}

function pickCover(g: any): string | undefined {
  return (
    g?.coverUrl ||
    g?.coverURL ||
    g?.cover ||
    g?.image ||
    g?.thumbnail ||
    g?.poster ||
    g?.banner ||
    g?.art ||
    g?.img
  );
}

function pickTitle(g: any): string {
  return (g?.title || g?.name || g?.gameTitle || g?.game_name || "Untitled") as string;
}

function pickPrice(g: any): number | undefined {
  const v =
    g?.price ??
    g?.harga ??
    g?.rentPrice ??
    g?.rentalPrice ??
    g?.pricePerDay ??
    g?.price_per_day ??
    g?.dailyPrice ??
    g?.weeklyPrice;
  return typeof v === "number" ? v : undefined;
}

function pickSubtitle(g: any): string {
  const parts: string[] = [];
  if (g?.platform) parts.push(String(g.platform));
  if (g?.year) parts.push(String(g.year));
  if (g?.genre) parts.push(String(g.genre));
  if (g?.region) parts.push(String(g.region));
  return parts.filter(Boolean).slice(0, 3).join(" • ");
}

function CoverCard({
  game,
  onAdd,
  onOpen,
  formatIDR,
  fitContain = false,
}: {
  game: Game;
  onAdd: () => void;
  onOpen: () => void;
  formatIDR: (n: number) => string;
  fitContain?: boolean;
}) {
  const g: any = game as any;
  const cover = pickCover(g);
  const title = pickTitle(g);
  const subtitle = pickSubtitle(g);
  const price = pickPrice(g);

  const [imgLoaded, setImgLoaded] = React.useState(false);
  const theme = useThemeContext();

  return (
    <div className="group">
      <button
        type="button"
        onClick={onOpen}
        className="relative w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
      >
        <div className="aspect-[3/4] relative">
          {cover && (
            <img
              src={cover}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              className={cx(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          )}

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-3 text-white">
            <div className="font-semibold leading-tight line-clamp-2">{title}</div>
            {subtitle && <div className="text-xs text-white/80 line-clamp-1">{subtitle}</div>}
          </div>
        </div>
      </button>

      <button
        onClick={onAdd}
        className={cx(
          "mt-3 w-full rounded-xl px-3 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-300 active:scale-[0.98]",
          theme.bgSolid,
          theme.bgSolidHover,
          "hover:shadow-md"
        )}
      >
        <ShoppingCart className="inline h-4 w-4 mr-1.5" />
        Tambah ke Keranjang
      </button>
    </div>
  );
}

export default function GameTerbaru({
  games,
  platform,
  onAdd,
  onOpen,
  formatIDR,
  fitContainCovers = false,
  title = "Game Terbaru",
  limit = 10,
}: Props) {
  const theme = useThemeContext();
  const latest = React.useMemo(
    () =>
      games
        .filter((g) => g.platform === platform)
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
        .slice(0, limit),
    [games, platform, limit]
  );

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const itemSpanRef = React.useRef(0);

  React.useEffect(() => {
    const first = listRef.current?.querySelector("li") as HTMLElement | null;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(listRef.current!).gap || "0");
    itemSpanRef.current = first.offsetWidth + gap;
  }, [latest.length]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      setActiveIndex(Math.round(el.scrollLeft / (itemSpanRef.current || 1)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // =========================
  // ADD: mouse wheel → horizontal scroll
  // =========================
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollBy({
        left: e.deltaY * 1.5,
        behavior: "smooth",
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  // =========================

  const scrollToIndex = (i: number) => {
    containerRef.current?.scrollTo({
      left: i * (itemSpanRef.current || 1),
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <section className="mb-6">
      <div className="mb-3 flex justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="text-xs text-gray-500">{latest.length} game</span>
      </div>

      <div
        ref={containerRef}
        className="-mx-2 px-2 overflow-x-auto no-scrollbar"
      >
        <ul
          ref={listRef}
          className="flex gap-3 snap-x snap-mandatory"
        >
          {latest.map((g) => (
            <li
              key={g.id}
              className="relative shrink-0 snap-start w-[58vw] max-w-[210px]"
            >
              {(g.year ?? 0) >= currentYear - 1 && (
                <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  Baru
                </span>
              )}

              <CoverCard
                game={g}
                onAdd={() => onAdd(g)}
                onOpen={() => onOpen(g)}
                formatIDR={formatIDR}
                fitContain={fitContainCovers}
              />
            </li>
          ))}
        </ul>
      </div>

      {latest.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {latest.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={cx(
                "h-2 rounded-full transition-all duration-300 ease-out",
                activeIndex === i ? `w-6 ${theme.bgSolid}` : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
