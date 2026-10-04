import type { Motif } from "@/data/wedding";

/** Fine gold line-art, drawn in currentColor so CSS sets the foil tone. */
const Svg = ({ children, className = "", vb = "0 0 64 64" }: { children: React.ReactNode; className?: string; vb?: string }) => (
  <svg viewBox={vb} className={`orn ${className}`} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const Tilak = () => (
  <Svg>
    <path d="M22 8 C 22 32, 25 46, 32 52 C 39 46, 42 32, 42 8" />
    <path d="M27 10 C 27 30, 29 40, 32 44 C 35 40, 37 30, 37 10" opacity=".6" />
    <path d="M32 22 C 34 26, 34 30, 32 33 C 30 30, 30 26, 32 22 Z" fill="currentColor" />
    <ellipse cx="32" cy="58" rx="18" ry="3.5" />
  </Svg>
);

const Matka = () => (
  <Svg>
    <path d="M23 22 C 11 30, 11 49, 24 55 L 40 55 C 53 49, 53 30, 41 22 Z" />
    <path d="M23 22 C 23 18, 41 18, 41 22" />
    <path d="M26 18 L 26 13 C 30 11, 34 11, 38 13 L 38 18" />
    <path d="M14 36 C 24 40, 40 40, 50 36" opacity=".6" />
    {[20, 26, 32, 38, 44].map((x) => <circle key={x} cx={x} cy={x === 32 ? 43 : 42} r="1.2" fill="currentColor" />)}
    <path d="M6 60 C 14 57, 22 61, 32 59 C 42 57, 50 61, 58 58" opacity=".6" />
  </Svg>
);

const Mandap = () => (
  <Svg>
    <path d="M10 26 C 18 14, 46 14, 54 26 Z" />
    <path d="M32 15 V 8" /><circle cx="32" cy="6" r="2" />
    <path d="M14 26 V 57 M50 26 V 57 M23 28 V 57 M41 28 V 57" opacity=".75" />
    <path d="M14 31 Q 23 38 32 31 Q 41 38 50 31" opacity=".6" />
    <path d="M32 54 C 36 50, 36 46, 32 42 C 28 46, 28 50, 32 54 Z" />
    <path d="M8 58 H 56" />
  </Svg>
);

const Thali = () => (
  <Svg>
    <ellipse cx="32" cy="42" rx="26" ry="9" />
    <ellipse cx="32" cy="42" rx="20" ry="6" opacity=".6" />
    <path d="M20 41 C 20 37, 27 37, 27 41 Z M37 41 C 37 37, 44 37, 44 41 Z" />
    <path d="M28 44 C 29 39, 35 39, 36 44" />
    <path d="M27 30 C 25 26, 29 24, 27 18 M33 30 C 31 26, 35 24, 33 18 M39 30 C 37 26, 41 24, 39 18" opacity=".55" />
  </Svg>
);

const Doli = () => (
  <Svg>
    <path d="M4 22 H 60" />
    <path d="M18 22 C 18 11, 46 11, 46 22" />
    <path d="M32 12 V 7" /><circle cx="32" cy="5.5" r="1.6" />
    <path d="M20 22 V 46 H 44 V 22" />
    <path d="M20 26 Q 26 34 32 26 Q 38 34 44 26" opacity=".6" />
    <rect x="27" y="32" width="10" height="10" rx="1" />
    <path d="M18 46 H 46 M23 46 V 51 M32 46 V 51 M41 46 V 51" />
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

const ICONS: Record<Motif, () => React.JSX.Element> = { tilak: Tilak, kalash: Kalash, paisley: Paisley, matka: Matka, diya: Diya, mandap: Mandap, thali: Thali, doli: Doli };

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
