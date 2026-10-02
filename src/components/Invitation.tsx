"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { wedding } from "@/data/wedding";
import { buildScenes } from "@/components/scenes";
import { GatePanel, Elephant } from "@/components/Scenery";
import Music from "@/components/Music";

const SCENE_SECONDS = 9;
const gust = () => window.dispatchEvent(new Event("shaadi:gust"));

/**
 * The film. Ornate gates open onto a sequence of full-screen illustrated
 * scenes that play like a video invite: each one auto-advances, layers drift
 * in parallax under the pointer, and the camera pushes through on every cut.
 * Tap, swipe, scroll or use the arrows to take control. No forms anywhere.
 */
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
      gsap.from(".gpanel", { xPercent: (i) => (i === 0 ? -100 : 100), duration: 1.6, ease: "power3.out" });
      gsap.from(".gate-ele", { scale: 0.7, opacity: 0, duration: 1.4, delay: 0.7, stagger: 0.15, ease: "back.out(1.5)", transformOrigin: "50% 100%" });
      gsap.from(".gseal", { scale: 0.4, opacity: 0, rotate: -30, duration: 1.3, delay: 1.1, ease: "back.out(1.7)" });
      gsap.from(".gate-copy > *", { y: 20, opacity: 0, duration: 0.9, delay: 1.5, stagger: 0.12 });
      gsap.to(".gseal .ring", { rotate: 360, duration: 80, repeat: -1, ease: "none" });
    }, rootRef);
    const dressing = gsap.context(() => {
      if (document.querySelector(".toran")) gsap.from(".toran", { y: -140, opacity: 0, duration: 1.6, ease: "power2.out" });
      if (document.querySelector(".garland")) gsap.from(".garland", { y: -300, opacity: 0, duration: 1.8, delay: 0.3, stagger: 0.15, ease: "power3.out" });
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
    const layers = el.querySelectorAll<HTMLElement>(".layer");
    layers.forEach((layer, i) => {
      const depth = parseFloat(layer.dataset.depth || "0");
      tl.from(layer, { y: 40 + depth * 160, opacity: 0, duration: 1.3, ease: "power3.out" }, at + i * 0.07);
    });
    const copy = el.querySelectorAll("[data-in]");
    if (copy.length) tl.from(copy, { y: 30, opacity: 0, duration: 0.9, stagger: 0.09, ease: "power3.out" }, at + 0.45);
    const glyphs = el.querySelectorAll("[data-m]");
    if (glyphs.length) tl.from(glyphs, { scale: 0.5, opacity: 0, transformOrigin: "50% 50%", duration: 1, stagger: 0.1, ease: "back.out(1.7)" }, at + 0.6);
    const chars = el.querySelectorAll(".name .ch");
    if (chars.length) tl.from(chars, { opacity: 0, rotateX: -90, y: 30, transformOrigin: "50% 100%", stagger: 0.045, duration: 0.9, ease: "back.out(1.4)" }, at + 0.8);
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
    tl.to(".gseal", { scale: 0.3, opacity: 0, duration: 0.6, ease: "power2.in" }, 0)
      .to(".gate-copy", { opacity: 0, duration: 0.4 }, 0)
      .to(".gpanel.left", { rotateY: -108, duration: 2.1, ease: "power2.inOut" }, 0.3)
      .to(".gpanel.right", { rotateY: 108, duration: 2.1, ease: "power2.inOut" }, 0.3)
      .to(gateRef.current, { opacity: 0, duration: 0.5 }, 2.0)
      .set(gateRef.current, { display: "none" });
    if (first) { gsap.set(first, { scale: 1.12 }); tl.to(first, { scale: 1, duration: 2.4, ease: "power2.out" }, 0.6); enter(tl, first, 1.0); }
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
    tl.to(curEl, { scale: dir === 1 ? 1.14 : 0.9, opacity: 0, duration: 0.9 * D, ease: "power2.in" }, 0)
      .set(curEl, { visibility: "hidden", scale: 1 })
      .set(nextEl, { visibility: "visible", opacity: 0, scale: dir === 1 ? 0.9 : 1.12 }, 0.45 * D)
      .to(nextEl, { opacity: 1, scale: 1, duration: 1.3 * D, ease: "power3.out" }, 0.45 * D);
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
        {scenes.map((s, i) => (
          <section className={`scene bg-${s.bg} ${i === index ? "is-current" : ""}`} key={s.key} ref={(el) => { sceneRefs.current[i] = el; }} aria-hidden={i !== index}>
            {s.node}
          </section>
        ))}

        {/* the gates */}
        <div className="gate" ref={gateRef}>
          <div className="gpanel left">
            <GatePanel side="left" />
            <div className="gate-ele"><Elephant /></div>
          </div>
          <div className="gpanel right">
            <GatePanel side="right" />
            <div className="gate-ele flip"><Elephant /></div>
          </div>
          <div className="gate-center">
            <div className="gate-copy">
              <p className="hindi gate-hindi">शुभ विवाह</p>
              <p className="gate-names">{wedding.bride.first} &amp; {wedding.groom.first}</p>
            </div>
            <button type="button" className="gseal" onClick={(e) => { e.stopPropagation(); open(); }} aria-label="Open the invitation">
              <svg viewBox="-100 -100 200 200" className="ring" aria-hidden="true">
                {Array.from({ length: 24 }, (_, i) => <path key={i} d="M0 -62 C 12 -76 12 -90 0 -98 C -12 -90 -12 -76 0 -62 Z" fill={i % 2 ? "#e23a78" : "#ff8a2a"} stroke="#4a1030" strokeWidth="1.4" transform={`rotate(${i * 15})`} />)}
                <circle r="62" fill="#ffb13b" stroke="#4a1030" strokeWidth="2.5" />
                <circle r="54" fill="none" stroke="#4a1030" strokeWidth="1" strokeDasharray="2 5" />
              </svg>
              <span className="gseal-mono">{wedding.monogram.replace(" & ", "")}</span>
            </button>
            <p className="label gate-hint gate-copy">Tap to open the invitation</p>
          </div>
        </div>
      </div>

      {/* chrome */}
      <header className="topbar">
        <span className="mono label">{wedding.bride.first} &amp; {wedding.groom.first} · {wedding.date.display}</span>
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
