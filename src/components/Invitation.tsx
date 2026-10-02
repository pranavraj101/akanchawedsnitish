"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { wedding } from "@/data/wedding";
import { buildScenes } from "@/components/scenes";
import Music from "@/components/Music";

const SCENE_SECONDS = 9;
const gust = () => window.dispatchEvent(new Event("shaadi:gust"));

/**
 * The film. An ivory gatefold sealed with wax opens onto a gold arch; inside
 * it the invitation plays card by card like a video invite: each one
 * auto-advances, drifts gently under the pointer and dissolves into the next.
 * Tap, swipe, scroll or use the arrows to take control. No forms anywhere.
 */
/** A wax seal's softly pooled edge: gentle lobes joined by smooth curves. */
const SEAL_EDGE = (() => {
  const n = 14;
  const pt = (k: number, r: number) => {
    const a = (k / n) * Math.PI * 2;
    return `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  };
  let d = `M${pt(0, 86)}`;
  for (let i = 0; i < n; i++) d += ` Q ${pt(i + 0.5, 95 + (i % 3) * 1.5)} ${pt(i + 1, 86)}`;
  return `${d} Z`;
})();

export default function Invitation() {
  const scenes = useMemo(buildScenes, []);
  const N = scenes.length;
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progress = useRef<gsap.core.Tween | null>(null);
  const busy = useRef(false);
  const indexRef = useRef(0);
  const openedRef = useRef(false);
  const playingRef = useRef(true);
  const reduced = useRef(false);

  /* ---------- initial state + gate entrance ---------- */
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sceneRefs.current.forEach((el, i) => el && gsap.set(el, { visibility: i === 0 ? "visible" : "hidden", opacity: i === 0 ? 1 : 0 }));
    if (reduced.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".gpanel", { opacity: 0, duration: 1.4, ease: "power2.out" });
      gsap.from(".gseal", { scale: 0.6, opacity: 0, rotate: -12, duration: 1.4, delay: 0.6, ease: "back.out(1.6)" });
      gsap.from(".gate-copy > *", { y: 16, opacity: 0, duration: 1.1, delay: 0.9, stagger: 0.14, ease: "power3.out" });
    }, rootRef);
    const dressing = gsap.context(() => {
      gsap.from(".flora-bottom", { y: 80, opacity: 0, duration: 2.2, ease: "power3.out" });
      gsap.from(".flora-corner", { x: 60, y: -60, opacity: 0, duration: 2.2, delay: 0.2, ease: "power3.out" });
    });
    return () => { ctx.revert(); dressing.revert(); };
  }, []);

  /* ---------- parallax ---------- */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reduced.current) return;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      const cur = sceneRefs.current[indexRef.current];
      if (!cur) return;
      cur.querySelectorAll<HTMLElement>(".layer, .copy").forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth || "0");
        const plx = layer.querySelector(".plx");
        if (plx) gsap.to(plx, { x: -dx * depth * 90, y: -dy * depth * 50, duration: 1.2, ease: "power2.out", overwrite: "auto" });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /* ---------- autoplay progress ---------- */
  const armProgress = (i: number) => {
    progress.current?.kill();
    barRefs.current.forEach((b, k) => b && gsap.set(b, { scaleX: k < i ? 1 : 0 }));
    const bar = barRefs.current[i];
    if (!bar) return;
    progress.current = gsap.fromTo(bar, { scaleX: 0 }, {
      scaleX: 1, duration: SCENE_SECONDS, ease: "none",
      paused: !playingRef.current,
      onComplete: () => { if (indexRef.current < N - 1) go(1); else setPlaying(false); },
    });
  };
  const togglePlay = () => {
    const next = !playingRef.current;
    playingRef.current = next;
    setPlaying(next);
    if (next) progress.current?.play(); else progress.current?.pause();
  };

  /* ---------- animate a scene's pieces in ---------- */
  const enter = (tl: gsap.core.Timeline, el: HTMLElement, at: number) => {
    if (reduced.current) return;
    const copy = el.querySelectorAll("[data-in]");
    if (copy.length) tl.from(copy, { y: 18, opacity: 0, filter: "blur(6px)", duration: 1.1, stagger: 0.1, ease: "power3.out", clearProps: "filter" }, at + 0.3);
    // script names are written on left to right, like ink from a nib
    const names = el.querySelectorAll(".name");
    if (names.length) tl.fromTo(names, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, stagger: 0.35, ease: "power2.inOut", clearProps: "clipPath" }, at + 0.6);
  };

  /* ---------- open the gates ---------- */
  const open = () => {
    if (openedRef.current || busy.current) return;
    busy.current = true;
    window.dispatchEvent(new Event("shaadi:open")); // music starts on this tap
    gust();
    const first = sceneRefs.current[0];
    const tl = gsap.timeline({
      onComplete: () => { busy.current = false; openedRef.current = true; setOpened(true); armProgress(0); },
    });
    tl.to(".gseal", { scale: 1.15, opacity: 0, duration: 0.7, ease: "power2.in" }, 0)
      .to(".gate-copy", { opacity: 0, y: -10, duration: 0.5 }, 0)
      .to(".gpanel.left", { rotateY: -100, duration: 2.2, ease: "power2.inOut" }, 0.35)
      .to(".gpanel.right", { rotateY: 100, duration: 2.2, ease: "power2.inOut" }, 0.35)
      .to(gateRef.current, { opacity: 0, duration: 0.6 }, 1.9)
      .set(gateRef.current, { display: "none" })
      .from(".arch", { opacity: 0, scale: 0.96, duration: 1.6, ease: "power2.out" }, 0.9);
    if (first) { gsap.set(first, { scale: 1.04 }); tl.to(first, { scale: 1, duration: 2.4, ease: "power2.out" }, 0.8); enter(tl, first, 1.1); }
  };

  /* ---------- cut to another scene ---------- */
  const go = (dir: 1 | -1) => {
    if (!openedRef.current || busy.current) return;
    const cur = indexRef.current;
    const next = cur + dir;
    if (next < 0 || next >= N) return;
    const curEl = sceneRefs.current[cur], nextEl = sceneRefs.current[next];
    if (!curEl || !nextEl) return;
    busy.current = true;
    progress.current?.kill();
    gust();
    const D = reduced.current ? 0.01 : 1;
    const tl = gsap.timeline({
      onComplete: () => { busy.current = false; indexRef.current = next; setIndex(next); armProgress(next); },
    });
    tl.to(curEl, { y: dir === 1 ? -24 : 24, opacity: 0, filter: "blur(4px)", duration: 0.8 * D, ease: "power2.in" }, 0)
      .set(curEl, { visibility: "hidden", y: 0, filter: "none" })
      .set(nextEl, { visibility: "visible", opacity: 0, y: dir === 1 ? 24 : -24 }, 0.55 * D)
      .to(nextEl, { opacity: 1, y: 0, duration: 1.2 * D, ease: "power3.out" }, 0.55 * D);
    enter(tl, nextEl, 0.5 * D);
  };

  /* ---------- input ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!openedRef.current) { if (e.key === "Enter" || e.key === " ") open(); return; }
      if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    let wheelLock = 0;
    const onWheel = (e: WheelEvent) => {
      if (!openedRef.current) return;
      const now = Date.now();
      if (now < wheelLock || Math.abs(e.deltaY) < 24) return;
      wheelLock = now + 1400;
      go(e.deltaY > 0 ? 1 : -1);
    };
    let sx = 0, sy = 0, st = 0;
    const onDown = (e: PointerEvent) => { sx = e.clientX; sy = e.clientY; st = Date.now(); };
    const onUp = (e: PointerEvent) => {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3 && Date.now() - st < 700) go(dx < 0 ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!openedRef.current) { open(); return; }
    const t = e.target as HTMLElement;
    if (t.closest("a, button")) return;
    const x = e.clientX / window.innerWidth;
    if (x > 0.7) go(1);
    else if (x < 0.3) go(-1);
  };

  return (
    <div className="film" ref={rootRef}>
      <div className="viewer" onClick={onStageClick} role="presentation">
        <div className="arch" aria-hidden="true"><div className="arch-inner" /></div>
        {scenes.map((s, i) => (
          <section className={`scene scene-${s.key} ${i === index ? "is-current" : ""}`} key={s.key} ref={(el) => { sceneRefs.current[i] = el; }} aria-hidden={i !== index}>
            {s.node}
          </section>
        ))}

        {/* the gatefold */}
        <div className="gate" ref={gateRef}>
          <div className="gpanel left"><span className="gpanel-arch" /></div>
          <div className="gpanel right"><span className="gpanel-arch" /></div>
          <div className="gate-center">
            <div className="gate-copy">
              <p className="hindi gate-hindi">शुभ विवाह</p>
              <p className="label">The wedding of</p>
              <p className="script gate-names">{wedding.bride.first} <span>&amp;</span> {wedding.groom.first}</p>
            </div>
            <button type="button" className="gseal" onClick={(e) => { e.stopPropagation(); open(); }} aria-label="Open the invitation">
              <svg viewBox="-100 -100 200 200" aria-hidden="true">
                <defs>
                  <radialGradient id="wax" cx="38%" cy="32%" r="75%">
                    <stop offset="0" stopColor="#c98a86" />
                    <stop offset=".55" stopColor="#a35d5e" />
                    <stop offset="1" stopColor="#6f3438" />
                  </radialGradient>
                </defs>
                <path d={SEAL_EDGE} fill="url(#wax)" />
                <circle r="66" fill="none" stroke="#5d2a2e" strokeOpacity=".45" strokeWidth="3" />
                <circle r="62" fill="none" stroke="#e6c9a0" strokeOpacity=".55" strokeWidth="1" strokeDasharray="1.5 4" />
              </svg>
              <svg viewBox="-40 -40 80 80" className="gseal-lotus" aria-hidden="true">
                {[-56, -28, 0, 28, 56].map((r) => <path key={r} d="M0 14 C -9 2, -7 -14, 0 -26 C 7 -14, 9 2, 0 14 Z" transform={`rotate(${r} 0 14)`} />)}
                <path d="M-26 18 Q 0 24 26 18" />
                <circle cx="0" cy="-32" r="2" />
              </svg>
            </button>
            <p className="label gate-hint gate-copy">Tap the seal to open</p>
          </div>
        </div>
      </div>

      {/* chrome */}
      <header className="topbar">
        <span className="mono label">{wedding.bride.first} &amp; {wedding.groom.first} &nbsp;·&nbsp; {wedding.date.display}</span>
        <Music />
      </header>

      <div className={`controls ${opened ? "show" : ""}`}>
        <ol className="segments" aria-label="Scenes">
          {scenes.map((s, i) => (
            <li key={s.key} className={i === index ? "on" : i < index ? "done" : ""}>
              <span className="fill" ref={(el) => { barRefs.current[i] = el; }} />
            </li>
          ))}
        </ol>
        <div className="ctl-row">
          <button type="button" className="ctl" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous scene">‹</button>
          <button type="button" className="ctl play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>{playing ? "❚❚" : "▶"}</button>
          <button type="button" className="ctl" onClick={() => go(1)} disabled={index === N - 1} aria-label="Next scene">›</button>
          <span className="scene-label label">{scenes[index].label}</span>
        </div>
      </div>
    </div>
  );
}
