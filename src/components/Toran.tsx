/**
 * A toran — the garland of mango leaves and marigolds hung over a doorway
 * before any auspicious occasion. Generated, so nothing is hand-drawn.
 */
const W = 1600;
const SAG = 78;
const N = 30;

function pt(t: number) {
  return {
    x: 2 * (1 - t) * t * (W / 2) + t * t * W,
    y: (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * (SAG * 2) + t * t * 6,
  };
}

export default function Toran() {
  const items = [];
  for (let i = 0; i <= N; i++) {
    const p = pt(i / N);
    const cls = `hang ${i % 3 === 0 ? "alt2" : i % 2 ? "alt" : ""}`;
    items.push(
      <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
        <g className={cls}>
          {i % 2 === 0 ? (
            <>
              <line x1="0" y1="0" x2="0" y2="18" stroke="#a3782c" strokeWidth="1.2" />
              <circle cx="0" cy="30" r="13" fill="url(#toran-mg)" />
              <circle cx="0" cy="30" r="13" fill="none" stroke="#e5762b" strokeWidth="1" opacity=".6" />
              <circle cx="0" cy="30" r="6" fill="#e5762b" opacity=".55" />
              <circle cx="0" cy="50" r="4" fill="#d8b35a" />
            </>
          ) : (
            <>
              <line x1="0" y1="0" x2="0" y2="8" stroke="#a3782c" strokeWidth="1.2" />
              <path d="M0 8 C 14 20, 12 44, 0 58 C -12 44, -14 20, 0 8 Z" fill="url(#toran-lf)" />
              <path d="M0 12 L 0 52" stroke="#1f5a2c" strokeWidth=".8" opacity=".6" />
              <circle cx="0" cy="66" r="3.5" fill="#f0a53a" />
            </>
          )}
        </g>
      </g>,
    );
  }
  return (
    <div className="toran" aria-hidden="true">
      <svg viewBox={`0 -4 ${W} 150`} preserveAspectRatio="none">
        <defs>
          <radialGradient id="toran-mg" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#ffd27a" />
            <stop offset=".55" stopColor="#f0a53a" />
            <stop offset="1" stopColor="#c85e1c" />
          </radialGradient>
          <linearGradient id="toran-lf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a8f45" />
            <stop offset="1" stopColor="#1f5a2c" />
          </linearGradient>
        </defs>
        <path d={`M0 6 Q ${W / 2} ${SAG * 2} ${W} 6`} fill="none" stroke="#a3782c" strokeWidth="2.5" />
        <path d={`M0 6 Q ${W / 2} ${SAG * 2} ${W} 6`} fill="none" stroke="#f3dc8a" strokeWidth=".8" opacity=".7" />
        {items}
      </svg>
    </div>
  );
}
