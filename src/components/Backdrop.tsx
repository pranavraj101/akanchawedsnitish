/**
 * Viewport dressing that sits over every scene: marigold garland strings
 * down both sides the way a mandap is dressed, and a gold filigree frame.
 */
function GarlandString({ beads, side }: { beads: number; side: "left" | "right" }) {
  const items = [];
  for (let i = 0; i < beads; i++) {
    const y = 26 + i * 44;
    const kind = i % 4;
    const lx = side === "left" ? -1 : 1;
    items.push(
      <g key={i} transform={`translate(30 ${y})`}>
        {kind === 0 || kind === 2 ? (
          <>
            <circle r="16" fill="url(#g-marigold)" stroke="#4a1030" strokeWidth="1.2" />
            <circle r="7" fill="#f28c1e" opacity=".6" />
          </>
        ) : kind === 1 ? (
          <>
            <circle r="13" fill="url(#g-rose)" stroke="#4a1030" strokeWidth="1.2" />
            <path d="M-7 -3 Q 0 -10 7 -3 Q 3 3 0 6 Q -3 3 -7 -3 Z" fill="#8e0f3a" opacity=".45" />
          </>
        ) : (
          <>
            {[0, 60, -60].map((r) => <ellipse key={r} rx="7" ry="11" fill="#fff8ec" stroke="#4a1030" strokeWidth="1" transform={`rotate(${r})`} />)}
            <circle r="3.5" fill="#f6b73c" />
          </>
        )}
        {i % 2 === 1 ? <path d={`M${14 * lx} 6 C ${30 * lx} 4, ${34 * lx} 28, ${12 * lx} 30 Z`} fill="#2e8b57" stroke="#4a1030" strokeWidth="1" /> : null}
      </g>,
    );
  }
  const h = 26 + beads * 44 + 30;
  return (
    <svg className={`garland ${side}`} viewBox={`0 0 60 ${h}`} aria-hidden="true">
      <defs>
        <radialGradient id="g-marigold" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ffd97a" /><stop offset=".55" stopColor="#f6a623" /><stop offset="1" stopColor="#d9741a" /></radialGradient>
        <radialGradient id="g-rose" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#ff6f9c" /><stop offset=".6" stopColor="#d81b60" /><stop offset="1" stopColor="#8e0f3a" /></radialGradient>
      </defs>
      <line x1="30" y1="0" x2="30" y2={h - 20} stroke="#b8860b" strokeWidth="2.5" />
      <line x1="30" y1="0" x2="30" y2={h - 20} stroke="#f6e27a" strokeWidth=".8" />
      {items}
      <path d={`M30 ${h - 22} l -9 16 h 18 z`} fill="#f6b73c" stroke="#4a1030" strokeWidth="1" />
    </svg>
  );
}

function Corner() {
  return (
    <svg viewBox="0 0 100 100" className="corner" aria-hidden="true">
      <path d="M2 98 L2 40 Q 2 2 40 2 L 98 2" fill="none" stroke="#c9a227" strokeWidth="3" />
      <path d="M12 98 L12 44 Q 12 12 44 12 L 98 12" fill="none" stroke="#c9a227" strokeWidth="1.2" />
      <g transform="translate(26 26)">
        {Array.from({ length: 8 }, (_, k) => <ellipse key={k} rx="4" ry="12" cy="-13" fill={k % 2 ? "#ffb13b" : "#e23a78"} stroke="#4a1030" strokeWidth="1" transform={`rotate(${k * 45})`} />)}
        <circle r="5" fill="#c9a227" stroke="#4a1030" strokeWidth="1" />
      </g>
      <path d="M 50 8 q 8 -6 16 0 q -8 6 -16 0 Z M 8 50 q -6 8 0 16 q 6 -8 0 -16 Z" fill="#c9a227" />
    </svg>
  );
}

export default function Backdrop() {
  return (
    <div className="dressing" aria-hidden="true">
      <GarlandString beads={14} side="left" />
      <GarlandString beads={14} side="right" />
      <div className="vframe">
        <Corner /><Corner /><Corner /><Corner />
      </div>
    </div>
  );
}
