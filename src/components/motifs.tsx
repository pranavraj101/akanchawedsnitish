/**
 * Madhubani (Mithila) motifs — the folk art of Bihar. Bold outlines, flat
 * fills, hatching, and the double-line habit. Every repeat is generated,
 * and every group carries data-m so a page turn can pop it in piece by piece.
 * All draw in a -100..100 square.
 */
import type { Motif } from "@/data/wedding";

const INK = "#4a1030";
const MARIGOLD = "#f0a53a";
const SAFFRON = "#e5762b";
const RANI = "#e23a78";
const LEAF = "#3f8a4a";
const TEAL = "#0e8c8c";
const GOLD = "#c9a227";
const PAPER = "#fff6e6";

const r2 = (n: number) => Math.round(n * 100) / 100;

const base = { fill: "none", stroke: INK, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Hatch({ x, y, w, h, gap = 4, angle = 0 }: { x: number; y: number; w: number; h: number; gap?: number; angle?: number }) {
  const lines = [];
  for (let i = 0; i <= w; i += gap) lines.push(<line key={i} x1={x + i} y1={y} x2={x + i} y2={y + h} />);
  return <g strokeWidth=".7" opacity=".55" transform={`rotate(${angle} ${x + w / 2} ${y + h / 2})`}>{lines}</g>;
}

/* ---------------------------------------------------------------- SUN — Haldi */
export function Sun() {
  const rays = 24;
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m>
        {Array.from({ length: rays }, (_, i) => (
          <path key={i} d="M-8 -52 L0 -92 L8 -52 Z" fill={i % 2 ? SAFFRON : MARIGOLD} transform={`rotate(${(360 / rays) * i})`} />
        ))}
      </g>
      <g data-m>
        <circle r="50" fill={MARIGOLD} />
        <circle r="44" strokeDasharray="1.5 4" strokeWidth="1" />
      </g>
      <g data-m>
        <circle r="30" fill={PAPER} />
        <path d="M-12 -4 Q -8 -10 -4 -4" strokeWidth="1.8" />
        <path d="M4 -4 Q 8 -10 12 -4" strokeWidth="1.8" />
        <circle cx="-8" cy="-1" r="1.6" fill={INK} stroke="none" />
        <circle cx="8" cy="-1" r="1.6" fill={INK} stroke="none" />
        <path d="M0 2 L -3 9 L 3 9 Z" fill={RANI} strokeWidth="1" />
        <path d="M-11 14 Q 0 22 11 14" strokeWidth="1.6" />
        <circle cx="0" cy="-16" r="2.2" fill={RANI} stroke="none" />
      </g>
      <g data-m>
        {Array.from({ length: 36 }, (_, i) => {
          const a = ((Math.PI * 2) / 36) * i;
          return <circle key={i} cx={r2(Math.cos(a) * 96)} cy={r2(Math.sin(a) * 96)} r="1.4" fill={INK} stroke="none" />;
        })}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- PEACOCK — Sangeet */
export function Peacock() {
  const feathers = 9;
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m>
        {Array.from({ length: feathers }, (_, i) => {
          const a = -160 + (140 / (feathers - 1)) * i; // fan from left-up to right-up
          const rad = (a * Math.PI) / 180;
          const tx = r2(Math.cos(rad) * 82), ty = r2(18 + Math.sin(rad) * 82);
          return (
            <g key={i}>
              <line x1="0" y1="18" x2={tx} y2={ty} strokeWidth="1.2" stroke={LEAF} />
              <g transform={`translate(${tx} ${ty}) rotate(${a + 90})`}>
                <ellipse rx="9" ry="14" fill={LEAF} />
                <ellipse rx="5.5" ry="9" fill={MARIGOLD} strokeWidth="1" />
                <ellipse rx="2.6" ry="4.5" fill={TEAL} stroke="none" />
              </g>
            </g>
          );
        })}
      </g>
      <g data-m>
        <ellipse cx="0" cy="28" rx="27" ry="36" fill={TEAL} />
        <g clipPath="url(#pc-body)"><Hatch x={-27} y={-8} w={54} h={72} gap={5} /></g>
        <clipPath id="pc-body"><ellipse cx="0" cy="28" rx="25" ry="34" /></clipPath>
        <path d="M-6 -4 C -8 -50 10 -66 26 -64" strokeWidth="13" stroke={TEAL} />
        <path d="M-6 -4 C -8 -50 10 -66 26 -64" strokeWidth="13" stroke={INK} fill="none" opacity="0" />
        <path d="M-12 -2 C -14 -52 8 -74 28 -72" strokeWidth="1.6" />
        <path d="M0 -6 C -2 -46 12 -58 28 -56" strokeWidth="1.6" />
        <circle cx="28" cy="-64" r="10" fill={TEAL} />
        <circle cx="31" cy="-66" r="1.8" fill={INK} stroke="none" />
        <path d="M37 -63 L 47 -60 L 37 -58 Z" fill={SAFFRON} strokeWidth="1" />
        <path d="M26 -74 L 22 -88" strokeWidth="1.2" /><circle cx="22" cy="-90" r="2.2" fill={RANI} stroke="none" />
        <path d="M30 -74 L 31 -90" strokeWidth="1.2" /><circle cx="31" cy="-92" r="2.2" fill={RANI} stroke="none" />
        <path d="M34 -73 L 40 -86" strokeWidth="1.2" /><circle cx="41" cy="-88" r="2.2" fill={RANI} stroke="none" />
      </g>
      <g data-m>
        <path d="M-10 62 L -12 80 M -10 62 L -4 80 M 10 62 L 12 80 M 10 62 L 4 80" strokeWidth="1.6" />
        <path d="M-40 84 Q 0 90 40 84" strokeWidth="1.2" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- PAISLEY — Mehendi */
function Ambi({ fill, scale = 1 }: { fill: string; scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <path d="M 0 -46 C 34 -30 40 20 14 38 C -4 50 -30 38 -30 14 C -30 -10 -14 -30 0 -46 Z" fill={fill} />
      <path d="M 0 -30 C 22 -18 26 12 10 26 C -2 34 -18 26 -18 12 C -18 -4 -8 -18 0 -30 Z" fill={PAPER} strokeWidth="1.1" />
      <g clipPath="url(#pa-in)"><Hatch x={-20} y={-30} w={40} h={60} gap={3.5} angle={40} /></g>
      <clipPath id="pa-in"><path d="M 0 -30 C 22 -18 26 12 10 26 C -2 34 -18 26 -18 12 C -18 -4 -8 -18 0 -30 Z" /></clipPath>
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const x = r2(-32 + t * 40 + Math.sin(t * Math.PI) * 14), y = r2(26 - t * 74 + Math.cos(t * Math.PI) * 6);
        return <circle key={i} cx={x} cy={y} r="1.8" fill={INK} stroke="none" />;
      })}
    </g>
  );
}
export function Paisley() {
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m transform="translate(-34 22) rotate(-30)"><Ambi fill={LEAF} scale={0.9} /></g>
      <g data-m transform="translate(36 26) rotate(32) scale(-1 1)"><Ambi fill={SAFFRON} scale={0.9} /></g>
      <g data-m transform="translate(0 -22)"><Ambi fill={RANI} scale={1.05} /></g>
      <g data-m>
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((Math.PI * 2) / 12) * i;
          return <circle key={i} cx={r2(Math.cos(a) * 92)} cy={r2(Math.sin(a) * 92)} r={i % 2 ? 2.4 : 1.4} fill={i % 2 ? MARIGOLD : INK} stroke={i % 2 ? INK : "none"} strokeWidth="1" />;
        })}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- FISH PAIR & LOTUS — Vivah (kohbar) */
function Fish({ fill }: { fill: string }) {
  const scales = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
    const x = -22 + c * 11 + (r % 2) * 5.5, y = -9 + r * 7;
    scales.push(<path key={`${r}${c}`} d={`M${x - 4} ${y} A 4 4 0 0 0 ${x + 4} ${y}`} strokeWidth=".9" />);
  }
  return (
    <g>
      <path d="M -40 0 C -25 -22 20 -22 38 0 C 20 22 -25 22 -40 0 Z" fill={fill} />
      <path d="M -40 0 L -58 -14 L -52 0 L -58 14 Z" fill={MARIGOLD} />
      <path d="M -6 -16 L 0 -28 L 10 -14 Z" fill={MARIGOLD} strokeWidth="1.2" />
      <path d="M -6 16 L 0 28 L 10 14 Z" fill={MARIGOLD} strokeWidth="1.2" />
      <g opacity=".8">{scales}</g>
      <circle cx="26" cy="-3" r="4" fill={PAPER} strokeWidth="1.2" />
      <circle cx="27" cy="-3" r="1.6" fill={INK} stroke="none" />
      <path d="M -30 0 Q -10 6 12 2" strokeWidth=".8" strokeDasharray="2 2" />
    </g>
  );
}
export function FishLotus() {
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m>
        <circle r="94" strokeWidth="1.2" />
        <circle r="88" strokeWidth=".7" strokeDasharray="1.5 3.5" />
      </g>
      <g data-m transform="translate(0 -52) rotate(12)"><Fish fill={RANI} /></g>
      <g data-m transform="translate(0 52) rotate(192)"><Fish fill={TEAL} /></g>
      <g data-m>
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d="M0 0 C -12 -10 -12 -30 0 -40 C 12 -30 12 -10 0 0 Z" fill={i % 2 ? RANI : SAFFRON}
            transform={`translate(${-36 + i * 12} 10) rotate(${-36 + i * 12})`} />
        ))}
        <path d="M -40 10 Q 0 30 40 10" fill={LEAF} strokeWidth="1.4" />
        <path d="M -30 16 Q 0 26 30 16" strokeWidth=".8" strokeDasharray="2 2" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- KALASH — Reception */
export function Kalash() {
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m>
        <path d="M -38 -6 C -46 30 -26 60 0 60 C 26 60 46 30 38 -6 Z" fill={SAFFRON} />
        <path d="M -36 10 Q 0 22 36 10" strokeWidth="1.2" />
        <path d="M -38 26 Q 0 38 38 26" strokeWidth="1.2" />
        <g opacity=".7">
          {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-30 + i * 10} cy={44} r="2.2" fill={INK} stroke="none" />)}
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-35 + i * 10} 14 l4 8 l4 -8`} strokeWidth=".9" />)}
        </g>
        <rect x="-24" y="-20" width="48" height="14" fill={MARIGOLD} />
        <path d="M -28 -20 L 28 -20" strokeWidth="1.8" />
      </g>
      <g data-m>
        {Array.from({ length: 5 }, (_, i) => {
          const a = -60 + i * 30;
          return (
            <g key={i} transform={`rotate(${a} 0 -22)`}>
              <path d="M0 -22 C 10 -36 10 -58 0 -70 C -10 -58 -10 -36 0 -22 Z" fill={LEAF} />
              <path d="M0 -28 L 0 -64" strokeWidth=".8" opacity=".7" />
            </g>
          );
        })}
      </g>
      <g data-m>
        <circle cx="0" cy="-64" r="16" fill={GOLD} />
        <path d="M -10 -70 Q 0 -80 10 -70" strokeWidth="1.2" />
        <circle cx="0" cy="-64" r="6" fill={RANI} strokeWidth="1" />
      </g>
      <g data-m>
        <path d="M -60 70 Q 0 80 60 70" strokeWidth="1.2" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- ARCH — Venue */
export function Arch() {
  const cusps = 7;
  const r = 60;
  let d = `M ${-r} 40 L ${-r} 0`;
  for (let i = 0; i < cusps; i++) {
    const a0 = Math.PI - (Math.PI / cusps) * i, a1 = Math.PI - (Math.PI / cusps) * (i + 1);
    const x1 = Math.cos(a1) * r, y1 = -Math.sin(a1) * r;
    const mx = Math.cos((a0 + a1) / 2) * (r + 9), my = -Math.sin((a0 + a1) / 2) * (r + 9);
    d += ` Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  d += ` L ${r} 40`;
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m>
        <path d={d} strokeWidth="2.2" />
        <path d={d} strokeWidth="1" transform="scale(1.14) translate(0 -2)" opacity=".6" />
        <path d="M -78 40 L 78 40 M -78 46 L 78 46" strokeWidth="1.4" />
      </g>
      <g data-m>
        <path d="M -22 -68 Q 0 -100 22 -68 Z" fill={MARIGOLD} />
        <path d="M0 -84 L 0 -96" strokeWidth="1.6" /><circle cx="0" cy="-97" r="2.4" fill={RANI} stroke="none" />
        <path d="M -60 -30 L -74 -30 L -74 -50 Q -60 -60 -46 -50 L -46 -30" fill={TEAL} strokeWidth="1.2" />
        <path d="M 60 -30 L 74 -30 L 74 -50 Q 60 -60 46 -50 L 46 -30" fill={TEAL} strokeWidth="1.2" />
      </g>
      <g data-m>
        <circle cx="0" cy="-10" r="18" fill={RANI} />
        <circle cx="0" cy="-10" r="10" fill={PAPER} strokeWidth="1" />
        <circle cx="0" cy="-10" r="3" fill={INK} stroke="none" />
        {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={-40 + i * 20} cy={64} r="3" fill={MARIGOLD} strokeWidth="1" />)}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- OM in a lotus ring — Cover / Ganesh vandana */
export function OmSeal() {
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M0 -58 C 10 -70 10 -86 0 -96 C -10 -86 -10 -70 0 -58 Z" fill={i % 2 ? RANI : SAFFRON} transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      <g data-m>
        <circle r="58" fill={MARIGOLD} />
        <circle r="50" strokeWidth=".8" strokeDasharray="1.5 3.5" />
      </g>
      <text data-m x="0" y="20" textAnchor="middle" fontSize="60" fill={INK} stroke="none" fontFamily="var(--font-hindi), serif">ॐ</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- ELEPHANT — the cover, facing right */
export function Elephant() {
  const dots = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) dots.push(<circle key={`${r}${c}`} cx={-40 + c * 14 + (r % 2) * 7} cy={-2 + r * 10} r="1.8" fill={INK} stroke="none" />);
  return (
    <svg viewBox="-100 -100 200 200" {...base} aria-hidden="true">
      <g data-m>
        <path d="M -70 4 C -70 -30 -40 -52 0 -52 C 40 -52 66 -36 66 0 C 66 30 40 44 0 44 C -40 44 -70 34 -70 4 Z" fill={TEAL} />
        <rect x="-52" y="30" width="18" height="40" rx="7" fill={TEAL} />
        <rect x="-26" y="34" width="18" height="38" rx="7" fill={TEAL} />
        <rect x="8" y="34" width="18" height="38" rx="7" fill={TEAL} />
        <rect x="34" y="30" width="18" height="40" rx="7" fill={TEAL} />
        {[-52, -26, 8, 34].map((x) => <rect key={x} x={x - 1} y="60" width="20" height="5" fill={MARIGOLD} strokeWidth="1" />)}
        <path d="M -70 0 C -84 4 -86 22 -78 34" strokeWidth="3" />
        <circle cx="-79" cy="35" r="3" fill={INK} stroke="none" />
      </g>
      <g data-m>
        <path d="M -50 -18 L 40 -18 L 40 22 Q 31 30 22 22 Q 13 30 4 22 Q -5 30 -14 22 Q -23 30 -32 22 Q -41 30 -50 22 Z" fill={MARIGOLD} />
        <path d="M -46 -12 L 36 -12" strokeWidth="1" strokeDasharray="3 2" />
        {dots}
        <path d="M -50 -18 Q -5 -34 40 -18" fill={RANI} strokeWidth="1.2" />
      </g>
      <g data-m>
        <circle cx="62" cy="-22" r="30" fill={TEAL} />
        <path d="M 48 -40 C 30 -46 22 -20 40 -6 C 46 -2 52 -8 50 -20 Z" fill={RANI} />
        <path d="M 84 -4 C 100 10 104 40 86 58 C 76 68 62 60 70 50" strokeWidth="14" stroke={TEAL} />
        <path d="M 84 -4 C 100 10 104 40 86 58 C 76 68 62 60 70 50" strokeWidth="14" stroke={TEAL} strokeLinecap="round" />
        <path d="M 78 -2 C 94 12 98 40 82 56" strokeWidth="1.4" />
        <path d="M 90 0 C 106 14 110 42 90 62" strokeWidth="1.4" />
        {[8, 20, 32].map((k) => <path key={k} d={`M ${80 + k * 0.5} ${k} q 6 2 12 0`} strokeWidth="1" />)}
        <path d="M 78 4 Q 94 8 92 22" strokeWidth="5" stroke={PAPER} />
        <path d="M 78 4 Q 94 8 92 22" strokeWidth="5" stroke="none" />
        <circle cx="70" cy="-30" r="3" fill={PAPER} strokeWidth="1.2" />
        <circle cx="71" cy="-30" r="1.4" fill={INK} stroke="none" />
        <path d="M 40 -50 L 62 -70 L 84 -50 Z" fill={GOLD} />
        <circle cx="62" cy="-58" r="3" fill={RANI} strokeWidth="1" />
        <path d="M 44 -46 Q 62 -40 80 -46" strokeWidth="2" stroke={GOLD} />
        <path d="M 46 -30 Q 62 -44 78 -30" strokeWidth="1" strokeDasharray="2 2" />
      </g>
      <g data-m>
        <path d="M 70 52 C 60 44 62 30 76 30 C 90 30 92 44 82 52 Z" fill={RANI} />
        <path d="M 62 40 C 56 30 62 22 70 26" fill={SAFFRON} strokeWidth="1" />
        <path d="M 90 40 C 96 30 90 22 82 26" fill={SAFFRON} strokeWidth="1" />
        <path d="M -80 82 Q 0 90 96 82" strokeWidth="1.2" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

export function MotifFor({ motif }: { motif: Motif }) {
  switch (motif) {
    case "sun": return <Sun />;
    case "peacock": return <Peacock />;
    case "paisley": return <Paisley />;
    case "fish": return <FishLotus />;
    case "kalash": return <Kalash />;
  }
}
