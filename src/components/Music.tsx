"use client";
import { useEffect, useRef, useState } from "react";

const SONG = "/audio/o-meri-laila.mp3";
// Suresh Wadkar — Vakratunda Mahakaya, 7s–22s only
const BHAJAN = "/audio/vakratunda.mp3?v=22";
/** That 15-second stretch, then Laila. Never play past it. */
const BHAJAN_SECONDS = 15;
/** Official cut: start at 1:13. */
const SONG_START = 73;

/**
 * Background music. Fifteen seconds of Vakratunda Mahakaya (7s–22s of the
 * Suresh Wadkar recording) play on the opening page — from the first tap if
 * the browser holds sound back — then it crossfades into "O Meri Laila" from
 * 1:13 through to the end, looping from that same start. The top-right
 * button mutes it. If the song's MP3 can't play, the tanpura synth below
 * takes over so the film never plays silent.
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
  const [track, setTrack] = useState<"bhajan" | "song" | "tanpura">("bhajan");
  const bhajanRef = useRef<HTMLAudioElement>(null);
  const songRef = useRef<HTMLAudioElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const tanRef = useRef<ReturnType<typeof createTanpura> | null>(null);
  const muted = useRef(false);
  const handedOff = useRef(false);
  const handoffTimer = useRef<number | undefined>(undefined);

  // iOS ignores element.volume, so there these fades become simple cuts.
  const fade = (a: HTMLAudioElement, to: number, ms: number, done?: () => void) => {
    const from = a.volume, t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step); else done?.();
    };
    step();
  };

  const startTanpura = () => {
    if (!ctxRef.current) { ctxRef.current = new AudioContext(); tanRef.current = createTanpura(ctxRef.current); }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    if (!muted.current) tanRef.current!.start();
    setTrack("tanpura");
    setState(muted.current ? "muted" : "playing");
  };

  const cueSong = (s: HTMLAudioElement) => {
    if (s.currentTime < SONG_START - 0.4 || s.ended) s.currentTime = SONG_START;
  };

  const toSong = () => {
    if (handedOff.current) return;
    handedOff.current = true;
    if (handoffTimer.current !== undefined) { clearTimeout(handoffTimer.current); handoffTimer.current = undefined; }
    const b = bhajanRef.current, s = songRef.current;
    if (b && !b.paused) fade(b, 0, 1400, () => { b.pause(); b.currentTime = 0; });
    else b?.pause();
    if (!s || s.error) { startTanpura(); return; }
    cueSong(s);
    s.volume = 0;
    s.muted = muted.current;
    s.play().then(() => fade(s, 1, 1200)).catch(startTanpura);
    setTrack("song");
    setState(muted.current ? "muted" : "playing");
  };

  const scheduleHandoff = (from: HTMLAudioElement) => {
    if (handedOff.current || handoffTimer.current !== undefined) return;
    const raw = Number.isFinite(from.duration) && from.duration > 1 ? from.duration : BHAJAN_SECONDS;
    const end = Math.min(BHAJAN_SECONDS, raw) - 0.45;
    const left = Math.max(0.2, end - from.currentTime);
    handoffTimer.current = window.setTimeout(toSong, left * 1000);
  };

  const startBhajan = () => {
    const b = bhajanRef.current;
    if (!b || handedOff.current) return Promise.resolve();
    if (!b.paused && !b.ended) { scheduleHandoff(b); return Promise.resolve(); }
    b.muted = muted.current;
    b.volume = 1;
    return b.play().then(() => {
      setTrack("bhajan");
      setState(muted.current ? "muted" : "playing");
      scheduleHandoff(b);
    });
  };

  useEffect(() => {
    const b = bhajanRef.current;
    const s = songRef.current;
    const onLoop = () => { if (s) { cueSong(s); s.play().catch(() => {}); } };
    const onTick = () => { if (s && handedOff.current && s.currentTime > 0 && s.currentTime < SONG_START - 0.5) cueSong(s); };
    const onBhajanTick = () => { if (b && !handedOff.current && b.currentTime >= BHAJAN_SECONDS - 0.12) toSong(); };
    const onBhajanEnd = () => { if (!handedOff.current) toSong(); };
    b?.addEventListener("ended", onBhajanEnd);
    b?.addEventListener("timeupdate", onBhajanTick);
    s?.addEventListener("ended", onLoop);
    s?.addEventListener("timeupdate", onTick);

    let armed = false;
    const go = () => { disarm(); startBhajan().catch(() => {}); };
    const disarm = () => { ["pointerdown", "keydown", "touchstart"].forEach((t) => window.removeEventListener(t, go)); };
    const arm = () => {
      if (armed) return;
      armed = true;
      ["pointerdown", "keydown", "touchstart"].forEach((t) => window.addEventListener(t, go, { once: true, passive: true }));
    };

    // try for the vandana straight away; most browsers wait for the first touch
    const kick = window.setTimeout(() => startBhajan().catch(arm), 200);
    // opening the card is also a gesture: start the mantra if it hasn't yet
    const onOpen = () => { startBhajan().catch(toSong); };
    window.addEventListener("shaadi:open", onOpen);

    return () => {
      clearTimeout(kick); clearTimeout(handoffTimer.current);
      window.removeEventListener("shaadi:open", onOpen);
      disarm();
      b?.removeEventListener("ended", onBhajanEnd);
      b?.removeEventListener("timeupdate", onBhajanTick);
      s?.removeEventListener("ended", onLoop);
      s?.removeEventListener("timeupdate", onTick);
      b?.pause(); s?.pause(); tanRef.current?.stop(); ctxRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    if (state === "idle") { (handedOff.current ? Promise.resolve(toSong()) : startBhajan()).catch(() => {}); return; }
    muted.current = state === "playing";
    [bhajanRef.current, songRef.current].forEach((a) => { if (a) a.muted = muted.current; });
    if (track === "tanpura") { if (muted.current) tanRef.current?.stop(); else tanRef.current?.start(); }
    setState(muted.current ? "muted" : "playing");
  };

  const name = track === "bhajan" ? "Vakratunda Mahakaya" : track === "song" ? "O Meri Laila" : "Tanpura";
  const label = state === "muted" ? "Muted" : state === "playing" ? name : "Music";
  return (
    <>
      <audio ref={bhajanRef} src={BHAJAN} preload="auto" playsInline />
      <audio ref={songRef} src={SONG} preload="auto" playsInline />
      <button type="button" className={`sound ${state === "playing" ? "on" : ""}`} onClick={toggle} aria-pressed={state === "playing"} aria-label={state === "playing" ? "Mute music" : "Play music"}>
        <span className="bars" aria-hidden="true"><i /><i /><i /><i /></span>
        <span className="label">{label}</span>
      </button>
    </>
  );
}
