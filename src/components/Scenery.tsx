/**
 * Full-bleed set pieces, Madhubani-flat: bold outlines, saturated fills,
 * generated repetition. Each is an SVG that slices to fill its layer.
 * viewBox is 1600 x 900 unless noted; scenes place them with CSS.
 */
import { Sun, Peacock, Paisley, FishLotus, Kalash, Elephant, Arch } from "@/components/motifs";

const INK = "#4a1030";
const full = { viewBox: "0 0 1600 900", preserveAspectRatio: "xMidYMax slice" as const, className: "set" };
const sky = { viewBox: "0 0 1600 900", preserveAspectRatio: "xMidYMin slice" as const, className: "set sky" };

/* ---------- ground: layered hills ---------- */
export function Hills({ color, edge, y = 640, amp = 70, freq = 3, seed = 0, dots }: { color: string; edge: string; y?: number; amp?: number; freq?: number; seed?: number; dots?: string }) {
  let d = `M 0 ${y}`;
  const steps = 40;
  for (let i = 1; i <= steps; i++) {
    const x = (1600 / steps) * i;
    const yy = y + Math.sin((i / steps) * Math.PI * freq + seed) * amp + Math.sin((i / steps) * Math.PI * freq * 2.3 + seed) * (amp * 0.3);
    d += ` L ${x.toFixed(1)} ${yy.toFixed(1)}`;
  }
  d += " L 1600 900 L 0 900 Z";
  const marks = [];
  if (dots) for (let i = 0; i < 26; i++) marks.push(<circle key={i} cx={40 + i * 60 + (seed * 37) % 40} cy={y + 90 + ((i * 53) % 120)} r="3" fill={dots} opacity=".6" />);
  return (
    <svg {...full} aria-hidden="true">
      <path d={d} fill={color} stroke={edge} strokeWidth="3" />
      {marks}
    </svg>
  );
}

/* ---------- river with waves and lotuses ---------- */
export function River({ y = 720, color = "#0e8c8c", light = "#4fc3c3" }: { y?: number; color?: string; light?: string }) {
  const wave = (yy: number, amp: number, len: number) => {
    let d = `M -200 ${yy}`;
    for (let x = -200; x <= 1800; x += len) d += ` q ${len / 4} ${-amp} ${len / 2} 0 t ${len / 2} 0`;
    return d;
  };
  return (
    <svg {...full} aria-hidden="true">
      <rect x="0" y={y} width="1600" height={900 - y} fill={color} />
      <path d={wave(y, 14, 120)} fill={color} stroke={INK} strokeWidth="3" />
      <g className="waves" stroke={light} strokeWidth="3" fill="none" strokeLinecap="round">
        {[40, 90, 140].map((off, i) => <path key={i} d={wave(y + off, 8, 160)} opacity={0.8 - i * 0.2} />)}
      </g>
      <g className="lotus-row">
        {[180, 520, 900, 1260].map((x, i) => (
          <g key={x} transform={`translate(${x} ${y + 24 + (i % 2) * 30}) scale(${0.9 + (i % 2) * 0.3})`}>
            <ellipse rx="42" ry="10" fill="#2e8b57" stroke={INK} strokeWidth="2" />
            {Array.from({ length: 7 }, (_, k) => (
              <path key={k} d="M0 0 C -12 -10 -12 -34 0 -44 C 12 -34 12 -10 0 0 Z" fill={k % 2 ? "#e23a78" : "#ff7aa8"} stroke={INK} strokeWidth="1.6" transform={`translate(${-30 + k * 10} 0) rotate(${-33 + k * 11})`} />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- sky furniture ---------- */
export function Clouds({ color = "#fff8ec" }: { color?: string }) {
  const cloud = (x: number, y: number, s: number, k: number) => (
    <g key={k} className="cloud" style={{ animationDelay: `${-k * 7}s`, animationDuration: `${60 + k * 12}s` }} transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="70" ry="26" fill={color} stroke={INK} strokeWidth="2" />
      <ellipse cx="-30" cy="-14" rx="34" ry="24" fill={color} stroke={INK} strokeWidth="2" />
      <ellipse cx="24" cy="-18" rx="40" ry="28" fill={color} stroke={INK} strokeWidth="2" />
      <ellipse cx="0" cy="0" rx="70" ry="26" fill={color} />
      <path d="M -40 8 Q 0 14 40 8" stroke={INK} strokeWidth="1.2" fill="none" strokeDasharray="4 4" />
    </g>
  );
  return <svg {...sky} aria-hidden="true">{cloud(220, 150, 1, 0)}{cloud(760, 90, 0.8, 1)}{cloud(1320, 180, 1.1, 2)}</svg>;
}

export function BigSun({ x = 800, y = 520, r = 260, ray = 120 }: { x?: number; y?: number; r?: number; ray?: number }) {
  return (
    <svg {...full} aria-hidden="true">
      <g transform={`translate(${x} ${y})`}>
        <g className="rays">
          {Array.from({ length: 36 }, (_, i) => (
            <path key={i} d={`M -14 ${-r} L 0 ${-r - ray} L 14 ${-r} Z`} fill={i % 2 ? "#ff8a2a" : "#ffc247"} stroke={INK} strokeWidth="1.5" transform={`rotate(${i * 10})`} />
          ))}
        </g>
        <circle r={r} fill="#ffb13b" stroke={INK} strokeWidth="3" />
        <circle r={r - 30} fill="none" stroke={INK} strokeWidth="1.5" strokeDasharray="4 10" />
        <circle r={r - 60} fill="#ffd27a" stroke={INK} strokeWidth="2" />
      </g>
    </svg>
  );
}

export function Fireworks() {
  const burst = (x: number, y: number, c: string, k: number) => (
    <g key={k} className="burst" style={{ animationDelay: `${k * 1.3}s` }} transform={`translate(${x} ${y})`}>
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="0" y1="0" x2="0" y2="-90" stroke={c} strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * (360 / 14)})`} />
      ))}
      {Array.from({ length: 14 }, (_, i) => <circle key={`d${i}`} cx="0" cy="-104" r="4" fill="#fff3c4" transform={`rotate(${i * (360 / 14) + 12})`} />)}
    </g>
  );
  return <svg {...sky} aria-hidden="true">{burst(260, 200, "#ffd54f", 0)}{burst(1300, 160, "#ff7aa8", 1)}{burst(820, 120, "#4fc3c3", 2)}{burst(560, 260, "#ffb13b", 3)}{burst(1080, 280, "#fff8ec", 4)}</svg>;
}

/* ---------- the mandap: four pillars, canopy, garlands ---------- */
export function Mandap({ front = false }: { front?: boolean }) {
  const pillar = (x: number, k: number) => (
    <g key={k} transform={`translate(${x} 0)`}>
      <rect x="-26" y="230" width="52" height="560" fill="#ffb13b" stroke={INK} strokeWidth="3" />
      <rect x="-14" y="230" width="6" height="560" fill="#fff3c4" opacity=".7" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x="-26" y={280 + i * 58} width="52" height="8" fill="#e23a78" stroke={INK} strokeWidth="1" />)}
      <rect x="-40" y="200" width="80" height="34" rx="6" fill="#c9a227" stroke={INK} strokeWidth="3" />
      <rect x="-44" y="780" width="88" height="40" rx="6" fill="#c9a227" stroke={INK} strokeWidth="3" />
      <g className="hang" style={{ transformOrigin: `${x}px 234px` }}>
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-36} cy={260 + i * 40} r="13" fill={i % 2 ? "#ffb13b" : "#e23a78"} stroke={INK} strokeWidth="1.5" />)}
        <line x1="-36" y1="234" x2="-36" y2="470" stroke="#2e8b57" strokeWidth="2" />
      </g>
    </g>
  );
  if (front) return <svg {...full} aria-hidden="true">{pillar(200, 0)}{pillar(1400, 1)}</svg>;
  return (
    <svg {...full} aria-hidden="true">
      {/* canopy */}
      <path d="M 120 230 Q 800 60 1480 230 L 1480 250 Q 800 90 120 250 Z" fill="#e23a78" stroke={INK} strokeWidth="3" />
      <path d="M 120 250 Q 800 90 1480 250" fill="none" stroke="#fff3c4" strokeWidth="3" strokeDasharray="10 10" />
      {Array.from({ length: 23 }, (_, i) => {
        const t = i / 22, x = Math.round(120 + t * 1360), y = Math.round(250 - Math.sin(t * Math.PI) * 156 + 4);
        return <path key={i} d={`M ${x - 28} ${y} Q ${x} ${y + 50} ${x + 28} ${y}`} fill="#c9a227" stroke={INK} strokeWidth="2" />;
      })}
      <path d="M 700 90 L 800 20 L 900 90 Z" fill="#c9a227" stroke={INK} strokeWidth="3" />
      <circle cx="800" cy="14" r="10" fill="#e23a78" stroke={INK} strokeWidth="2" />
      {pillar(520, 2)}{pillar(1080, 3)}
    </svg>
  );
}

/* ---------- elephants on parade ---------- */
export function Parade() {
  return (
    <div className="parade" aria-hidden="true">
      {[0, 1, 2].map((k) => (
        <div key={k} className="walker" style={{ animationDelay: `${-k * 9}s`, ["--s" as string]: 1 - k * 0.18, ["--z" as string]: 3 - k }}>
          <Elephant />
        </div>
      ))}
    </div>
  );
}

/* ---------- diyas floating on water ---------- */
export function Diyas() {
  return (
    <svg {...full} aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => {
        const x = 120 + i * 170 + (i % 2) * 40, y = 760 + (i % 3) * 30, s = 0.8 + (i % 3) * 0.15;
        return (
          <g key={i} className="diya" style={{ animationDelay: `${-i * 0.7}s` }} transform={`translate(${x} ${y}) scale(${s})`}>
            <ellipse cx="0" cy="-30" rx="26" ry="40" fill="#ffd54f" opacity=".28" className="glow" />
            <path d="M -36 0 Q 0 30 36 0 Q 0 8 -36 0 Z" fill="#b8541a" stroke={INK} strokeWidth="2" />
            <path d="M -30 -4 Q 0 6 30 -4" stroke="#ffb13b" strokeWidth="3" fill="none" />
            <path d="M 0 -6 C 10 -20 6 -34 0 -44 C -6 -34 -10 -20 0 -6 Z" fill="#ffb13b" stroke="#ff7a1a" strokeWidth="1.5" className="flame" />
            <path d="M 0 -12 C 4 -20 3 -28 0 -32 C -3 -28 -4 -20 0 -12 Z" fill="#fff3c4" />
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- lanterns for the reception ---------- */
export function Lanterns() {
  return (
    <svg {...sky} aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => {
        const x = 150 + i * 220, h = 120 + (i % 3) * 70;
        return (
          <g key={i} className="lantern" style={{ animationDelay: `${-i * 1.1}s`, transformOrigin: `${x}px 0px` }}>
            <line x1={x} y1="0" x2={x} y2={h} stroke="#c9a227" strokeWidth="2" />
            <g transform={`translate(${x} ${h})`}>
              <path d="M -34 0 Q -44 40 -34 80 L 34 80 Q 44 40 34 0 Z" fill={i % 2 ? "#e23a78" : "#ff8a2a"} stroke={INK} strokeWidth="2" />
              <rect x="-24" y="-12" width="48" height="12" rx="3" fill="#c9a227" stroke={INK} strokeWidth="1.5" />
              <rect x="-24" y="80" width="48" height="10" rx="3" fill="#c9a227" stroke={INK} strokeWidth="1.5" />
              <path d="M -30 20 Q 0 30 30 20 M -32 44 Q 0 54 32 44 M -30 64 Q 0 74 30 64" stroke="#fff3c4" strokeWidth="1.5" fill="none" />
              <ellipse cx="0" cy="40" rx="18" ry="30" fill="#fff3c4" opacity=".25" />
              {[-12, 0, 12].map((dx) => <line key={dx} x1={dx} y1="90" x2={dx} y2="118" stroke="#c9a227" strokeWidth="2" />)}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- gates for the opening ---------- */
export function GatePanel({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 800 900" preserveAspectRatio="none" className="gate-svg" aria-hidden="true">
      <defs>
        <pattern id={`gj-${side}`} width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="#fff3c4" strokeWidth="1.2" opacity=".55" />
          <circle cx="30" cy="30" r="8" fill="none" stroke="#fff3c4" strokeWidth=".9" opacity=".55" />
        </pattern>
      </defs>
      <rect width="800" height="900" fill={`url(#gj-${side})`} />
      <rect x="40" y="40" width="720" height="820" fill="none" stroke="#f6e27a" strokeWidth="4" />
      <rect x="60" y="60" width="680" height="780" fill="none" stroke="#f6e27a" strokeWidth="1.5" strokeDasharray="6 8" />
      {[[70, 70], [730, 70], [70, 830], [730, 830]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          {Array.from({ length: 8 }, (_, k) => <ellipse key={k} rx="5" ry="16" cy="-18" fill="#f6e27a" transform={`rotate(${k * 45})`} />)}
          <circle r="7" fill="#e23a78" stroke="#f6e27a" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

export { Sun, Peacock, Paisley, FishLotus, Kalash, Elephant, Arch };
