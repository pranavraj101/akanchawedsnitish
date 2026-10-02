"use client";
import { useEffect, useRef, useState } from "react";

const TRACK = "/audio/o-meri-laila.mp3";

/**
 * Background music. Starts on the tap that opens the gates (the one moment a
 * browser lets sound begin), loops, and can be muted from the top bar. If the
 * MP3 isn't there the tanpura synth below takes over so the film never plays silent.
 */
function createTanpura(ctx: AudioContext) {
  const master = ctx.createGain(); master.gain.value = 0;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800; lp.Q.value = 0.6;
  const conv = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * 2.4);
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  conv.buffer = ir;
  const wet = ctx.createGain(); wet.gain.value = 0.35;
  const dry = ctx.createGain(); dry.gain.value = 0.65;
  lp.connect(dry).connect(master); lp.connect(conv).connect(wet).connect(master); master.connect(ctx.destination);
  const strings = [69.3, 103.83, 138.59, 34.65];
  let i = 0; let timer: number | undefined;
  const pluck = () => {
    const f = strings[i++ % strings.length]; const now = ctx.currentTime;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now); env.gain.linearRampToValueAtTime(0.22, now + 0.02); env.gain.exponentialRampToValueAtTime(0.0008, now + 3.8);
    [1, 2, 3, 4, 5].forEach((h) => {
      const o = ctx.createOscillator(); o.type = h === 1 ? "triangle" : "sine";
      o.frequency.value = f * h * (1 + (Math.random() - 0.5) * 0.0015);
      const g = ctx.createGain(); g.gain.value = (1 / (h * h)) * (h === 2 ? 1.6 : 1);
      o.connect(g).connect(env); o.start(now); o.stop(now + 4);
    });
    env.connect(lp);
    timer = window.setTimeout(pluck, 900 + Math.random() * 250);
  };
  return {
    start() { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.5); if (timer === undefined) pluck(); },
    stop() { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8); if (timer !== undefined) { clearTimeout(timer); timer = undefined; } },
  };
}

export default function Music() {
  const [state, setState] = useState<"idle" | "playing" | "muted">("idle");
  const [fallback, setFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const tanRef = useRef<ReturnType<typeof createTanpura> | null>(null);
  const started = useRef(false);

  const startTanpura = () => {
    if (!ctxRef.current) { ctxRef.current = new AudioContext(); tanRef.current = createTanpura(ctxRef.current); }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    tanRef.current!.start();
    setFallback(true);
    setState("playing");
  };

  const begin = () => {
    if (started.current) return;
    started.current = true;
    const a = audioRef.current;
    if (!a || a.error || fallback) { startTanpura(); return; }
    a.volume = 0;
    a.muted = false;
    a.play().then(() => {
      setState("playing");
      // gentle fade in
      const t0 = performance.now();
      const fade = () => { const k = Math.min(1, (performance.now() - t0) / 2000); a.volume = k; if (k < 1) requestAnimationFrame(fade); };
      fade();
    }).catch(() => {
      // Autoplay refused before any interaction: arm the first touch/key anywhere, and only
      // fall back to the tanpura if the file itself is unplayable.
      started.current = false;
      if (a.error) { startTanpura(); return; }
      const arm = () => { window.removeEventListener("pointerdown", arm); window.removeEventListener("keydown", arm); window.removeEventListener("touchstart", arm); begin(); };
      window.addEventListener("pointerdown", arm, { once: true });
      window.addEventListener("keydown", arm, { once: true });
      window.addEventListener("touchstart", arm, { once: true, passive: true });
    });
  };

  useEffect(() => {
    const a = audioRef.current;
    const onErr = () => setFallback(true);
    a?.addEventListener("error", onErr);
    window.addEventListener("shaadi:open", begin);
    // volume on by default: try to start right away, before any tap
    const kick = window.setTimeout(begin, 300);
    return () => { clearTimeout(kick); a?.removeEventListener("error", onErr); window.removeEventListener("shaadi:open", begin); tanRef.current?.stop(); ctxRef.current?.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    if (state === "idle") { begin(); return; }
    const muting = state === "playing";
    if (fallback) { if (muting) tanRef.current?.stop(); else tanRef.current?.start(); }
    else if (audioRef.current) audioRef.current.muted = muting;
    setState(muting ? "muted" : "playing");
  };

  const label = state === "muted" ? "Muted" : state === "playing" ? (fallback ? "Tanpura" : "O Meri Laila") : "Music";
  return (
    <>
      <audio ref={audioRef} src={TRACK} loop autoPlay preload="auto" playsInline />
      <button type="button" className={`sound ${state === "playing" ? "on" : ""}`} onClick={toggle} aria-pressed={state === "playing"} aria-label={state === "playing" ? "Mute music" : "Play music"}>
        <span className="bars" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="label">{label}</span>
      </button>
    </>
  );
}
