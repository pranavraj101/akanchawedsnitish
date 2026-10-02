/** Concentric rings, petals and dots in currentColor. Used as the cover seal and closing watermark. */
export default function Mandala({ petals = 24, className }: { petals?: number; className?: string }) {
  const inner = Math.max(8, petals / 2);
  const dots = petals * 2;
  return (
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" className={className} aria-hidden="true">
      <circle r="97" strokeWidth=".9" />
      <circle r="91" strokeWidth=".5" strokeDasharray="2 3" />
      <circle r="70" strokeWidth=".7" />
      <circle r="46" strokeWidth=".6" />
      <circle r="20" strokeWidth=".8" />
      <circle r="9" fill="currentColor" fillOpacity=".35" />
      {Array.from({ length: petals }, (_, i) => (
        <path
          key={`p${i}`}
          d="M0 -70 C 8 -86, 8 -92, 0 -96 C -8 -92, -8 -86, 0 -70 Z"
          fill="currentColor" fillOpacity=".18" strokeWidth=".6"
          transform={`rotate(${(360 / petals) * i})`}
        />
      ))}
      {Array.from({ length: inner }, (_, i) => (
        <g key={`i${i}`}>
          <ellipse cx="0" cy="-58" rx="5.5" ry="12" strokeWidth=".7" transform={`rotate(${(360 / inner) * i})`} />
          <path
            d="M0 -20 C 7 -30, 7 -40, 0 -46 C -7 -40, -7 -30, 0 -20 Z"
            strokeWidth=".6" fill="currentColor" fillOpacity=".12"
            transform={`rotate(${(360 / inner) * i + 360 / inner / 2})`}
          />
        </g>
      ))}
      {Array.from({ length: dots }, (_, i) => {
        const a = ((Math.PI * 2) / dots) * i;
        return <circle key={`d${i}`} cx={(Math.cos(a) * 80).toFixed(2)} cy={(Math.sin(a) * 80).toFixed(2)} r="1.4" fill="currentColor" stroke="none" />;
      })}
    </svg>
  );
}
