import type { Motif } from "@/data/wedding";

/** Fine gold line-art, drawn in currentColor so CSS sets the foil tone. */
const Svg = ({ children, className = "", vb = "0 0 64 64" }: { children: React.ReactNode; className?: string; vb?: string }) => (
  <svg viewBox={vb} className={`orn ${className}`} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const Marigold = () => (
  <Svg>
    {Array.from({ length: 12 }, (_, i) => <path key={i} d="M32 20 C 35 13, 35 8, 32 4 C 29 8, 29 13, 32 20 Z" transform={`rotate(${i * 30} 32 32)`} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={`b${i}`} d="M32 24 C 34 20, 34 17, 32 14 C 30 17, 30 20, 32 24 Z" transform={`rotate(${i * 30 + 15} 32 32)`} />)}
    <circle cx="32" cy="32" r="6" />
    <circle cx="32" cy="32" r="2" fill="currentColor" />
  </Svg>
);

const Feather = () => (
  <Svg>
    <path d="M32 60 C 31 46, 31 30, 32 6" />
    <path d="M32 8 C 20 14, 16 28, 20 40 C 24 50, 30 54, 32 56 C 34 54, 40 50, 44 40 C 48 28, 44 14, 32 8 Z" />
    <ellipse cx="32" cy="28" rx="8" ry="10" />
    <ellipse cx="32" cy="29" rx="4" ry="5.5" />
    <circle cx="32" cy="30" r="1.6" fill="currentColor" />
    {[-1, 1].map((s) => [16, 24, 36, 44].map((y) => <path key={`${s}${y}`} d={`M32 ${y + 6} L ${32 + s * 10} ${y}`} opacity=".55" />))}
  </Svg>
);

const Paisley = () => (
  <Svg>
    <path d="M36 6 C 22 12, 12 26, 14 40 C 16 52, 28 60, 40 56 C 52 52, 54 38, 46 30 C 40 24, 30 28, 32 36 C 34 42, 42 40, 42 34" />
    <path d="M34 14 C 24 20, 20 30, 22 40 C 24 48, 32 52, 40 49" opacity=".6" />
    {[[20, 30], [24, 22], [30, 17], [22, 44], [30, 52]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.2" fill="currentColor" />)}
    <path d="M36 6 C 40 4, 44 6, 44 10" />
  </Svg>
);

const Kalash = () => (
  <Svg>
    <path d="M20 30 C 14 38, 16 52, 24 56 L 40 56 C 48 52, 50 38, 44 30 Z" />
    <path d="M22 30 L 42 30 L 40 25 L 24 25 Z" />
    <path d="M18 44 L 46 44" opacity=".6" />
    <path d="M28 50 l 4 -3 l 4 3" opacity=".6" />
    <circle cx="32" cy="16" r="6" />
    {[-1, 1].map((s) => <path key={s} d={`M32 24 C ${32 + s * 8} 22, ${32 + s * 16} 20, ${32 + s * 20} 14 C ${32 + s * 12} 14, ${32 + s * 6} 18, 32 24 Z`} />)}
    <path d="M24 56 L 26 60 L 38 60 L 40 56" />
  </Svg>
);

const Diya = () => (
  <Svg>
    <path d="M32 8 C 38 16, 38 24, 32 28 C 26 24, 26 16, 32 8 Z" />
    <path className="flame" d="M32 16 C 34 20, 34 23, 32 25 C 30 23, 30 20, 32 16 Z" fill="currentColor" opacity=".35" />
    <path d="M10 36 C 14 48, 24 52, 32 52 C 40 52, 50 48, 54 36 L 46 36 C 42 40, 22 40, 18 36 Z" />
    <path d="M10 36 C 22 32, 42 32, 54 36" />
    <path d="M26 52 L 24 58 L 40 58 L 38 52" />
    {[-1, 1].map((s) => <path key={s} d={`M${32 + s * 12} 14 l ${s * 4} -3 M${32 + s * 13} 22 l ${s * 5} 0`} opacity=".6" />)}
  </Svg>
);

const ICONS: Record<Motif, () => React.JSX.Element> = { sun: Marigold, peacock: Feather, paisley: Paisley, fish: Kalash, kalash: Diya };

export const EventIcon = ({ motif }: { motif: Motif }) => {
  const Icon = ICONS[motif];
  return <Icon />;
};

export const Calendar = () => (
  <Svg className="fact-icon" vb="0 0 32 32">
    <rect x="4" y="7" width="24" height="21" rx="2" />
    <path d="M4 13 H 28 M10 4 V 9 M22 4 V 9" />
    {[9, 14, 19, 24].map((x) => [17, 22].map((y) => <circle key={`${x}${y}`} cx={x - 0.5} cy={y} r=".9" fill="currentColor" stroke="none" />))}
  </Svg>
);

export const Pin = () => (
  <Svg className="fact-icon" vb="0 0 32 32">
    <path d="M16 29 C 16 29, 6 19, 6 12 A 10 10 0 0 1 26 12 C 26 19, 16 29, 16 29 Z" />
    <circle cx="16" cy="12" r="3.5" />
  </Svg>
);

export const Flourish = () => (
  <Svg className="flourish" vb="0 0 200 20">
    <path d="M10 10 H 78 M122 10 H 190" opacity=".7" />
    <path d="M78 10 C 86 2, 92 2, 100 10 C 108 2, 114 2, 122 10 C 114 18, 108 18, 100 10 C 92 18, 86 18, 78 10 Z" />
    <circle cx="100" cy="10" r="2" fill="currentColor" />
    <circle cx="6" cy="10" r="1.4" fill="currentColor" />
    <circle cx="194" cy="10" r="1.4" fill="currentColor" />
  </Svg>
);

/** A four-pointed gold glint that twinkles in place. */
export function Spark({ style, className = "" }: { style?: React.CSSProperties; className?: string }) {
  return (
    <svg viewBox="-10 -10 20 20" className={`spark ${className}`} style={style} aria-hidden="true">
      <path d="M0 -10 C 1 -3, 3 -1, 10 0 C 3 1, 1 3, 0 10 C -1 3, -3 1, -10 0 C -3 -1, -1 -3, 0 -10 Z" />
    </svg>
  );
}
