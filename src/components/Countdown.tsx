"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const pad = (n: number, w: number) => String(n).padStart(w, "0");

function parts(targetMs: number) {
  let d = Math.max(0, targetMs - Date.now());
  const days = Math.floor(d / 864e5); d -= days * 864e5;
  const hours = Math.floor(d / 36e5); d -= hours * 36e5;
  const minutes = Math.floor(d / 6e4); d -= minutes * 6e4;
  const seconds = Math.floor(d / 1e3);
  return { days: pad(days, 3), hours: pad(hours, 2), minutes: pad(minutes, 2), seconds: pad(seconds, 2) };
}
type Parts = ReturnType<typeof parts>;

/** Live countdown to the vivah muhurat. Renders dashes on the server, numbers after mount. */
export default function Countdown({ targetISO }: { targetISO: string }) {
  const [t, setT] = useState<Parts | null>(null);
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});
  const prev = useRef<Parts | null>(null);

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = () => {
      const next = parts(target);
      if (!reduced && prev.current) {
        (Object.keys(next) as (keyof Parts)[]).forEach((k) => {
          const el = refs.current[k];
          if (el && prev.current![k] !== next[k]) {
            gsap.fromTo(el, { y: -10, opacity: 0, rotateX: 50 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.45, ease: "power2.out" });
          }
        });
      }
      prev.current = next;
      setT(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const units: [keyof Parts, string][] = [["days", "Days"], ["hours", "Hours"], ["minutes", "Minutes"], ["seconds", "Seconds"]];
  return (
    <div className="count-grid" role="timer" aria-live="off">
      {units.map(([k, label]) => (
        <div className="count-tile" key={k}>
          <span className="count-num" ref={(el) => { refs.current[k] = el; }}>{t ? t[k] : "––"}</span>
          <span className="label">{label}</span>
        </div>
      ))}
    </div>
  );
}
