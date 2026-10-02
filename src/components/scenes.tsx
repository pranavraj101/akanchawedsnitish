import type { ReactNode } from "react";
import { wedding, calendarLink, mapsLink } from "@/data/wedding";
import { MotifFor, Arch } from "@/components/motifs";
import { Hills, River, Clouds, BigSun, Fireworks, Mandap, Parade, Diyas, Lanterns } from "@/components/Scenery";
import Countdown from "@/components/Countdown";

export type Scene = { key: string; label: string; bg: string; node: ReactNode };

/** A parallax layer. depth 0 = pinned to the camera, 1 = nearest, moves most. */
const L = ({ depth, children, className = "" }: { depth: number; children: ReactNode; className?: string }) => (
  <div className={`layer ${className}`} data-depth={depth}>
    <div className="plx">{children}</div>
  </div>
);

const Split = ({ text, className }: { text: string; className?: string }) => (
  <span className={className} aria-label={text}>
    {[...text].map((ch, i) => <span className="ch" key={i} aria-hidden="true">{ch}</span>)}
  </span>
);

const Medallion = ({ children }: { children: ReactNode }) => (
  <div className="medal" data-in>
    <svg viewBox="-100 -100 200 200" className="medal-ring" aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => <circle key={i} cx="0" cy="-92" r="7" fill="#c9a227" stroke="#4a1030" strokeWidth="1.2" transform={`rotate(${i * (360 / 28)})`} />)}
      <circle r="86" fill="#fff6e6" stroke="#4a1030" strokeWidth="2" />
      <circle r="78" fill="none" stroke="#c9a227" strokeWidth="1.5" strokeDasharray="3 6" />
    </svg>
    <div className="medal-art">{children}</div>
  </div>
);

export function buildScenes(): Scene[] {
  const w = wedding;
  const scenes: Scene[] = [];

  scenes.push({
    key: "vandana", label: "Shubh Vivah", bg: "sunrise",
    node: (
      <>
        <L depth={0.08}><Clouds /></L>
        <L depth={0.14} className="only-portrait"><BigSun x={800} y={720} r={215} /></L>
        <L depth={0.14} className="only-landscape"><BigSun x={800} y={705} r={150} ray={80} /></L>
        <L depth={0.28}><Hills color="#4fc3c3" edge="#4a1030" y={640} amp={40} freq={3} /></L>
        <L depth={0.45}><Hills color="#2e8b57" edge="#4a1030" y={720} amp={55} freq={4} seed={2} dots="#fff3c4" /></L>
        <L depth={0.65}><River y={800} /></L>
        <div className="copy top" data-depth="0.04">
          <div className="plx">
            <p className="hindi ganesh-line" data-in>॥ श्री गणेशाय नमः ॥</p>
            <p className="hindi shubh" data-in>शुभ विवाह</p>
            <div className="names" data-in>
              <Split text={w.bride.first} className="name foil" />
              <span className="amp">&amp;</span>
              <Split text={w.groom.first} className="name foil" />
            </div>
            <p className="lede" data-in>request the pleasure of your company as they begin their forever</p>
            <div className="date-row" data-in>
              <span className="label">{w.date.weekday}</span>
              <span className="date-big">{w.date.display}</span>
              <span className="label">{w.venue.city}</span>
            </div>
          </div>
        </div>
      </>
    ),
  });

  scenes.push({
    key: "invite", label: "Invitation", bg: "blush",
    node: (
      <>
        <L depth={0.06}><Clouds color="#fff" /></L>
        <L depth={0.2}><Mandap /></L>
        <L depth={0.5}><Hills color="#ffb13b" edge="#4a1030" y={800} amp={20} freq={2} /></L>
        <div className="copy narrow" data-depth="0.03">
          <div className="plx">
            <p className="hindi shlok" data-in>॥ मंगलम् भगवान् विष्णुः, मंगलम् गरुड़ध्वजः ॥</p>
            <p className="invite-text" data-in>With the blessings of our elders,<br /><strong>{w.bride.parents}</strong><br />request the honour of your presence at the wedding of their daughter</p>
            <p className="invite-name foil" data-in>{w.bride.first}</p>
            <p className="invite-with" data-in>with</p>
            <p className="invite-name foil" data-in>{w.groom.full}</p>
            <p className="invite-text" data-in>son of <strong>{w.groom.parents}</strong></p>
            <p className="hindi hindi-note" data-in>आपकी उपस्थिति हमारे लिए आशीर्वाद स्वरूप होगी।</p>
          </div>
        </div>
        <L depth={0.7}><Mandap front /></L>
      </>
    ),
  });

  const scenery: Record<string, { bg: string; back: ReactNode; front?: ReactNode }> = {
    sun: {
      bg: "haldi",
      back: <><L depth={0.08}><Clouds /></L><L depth={0.3}><Hills color="#a9c34a" edge="#4a1030" y={680} amp={50} freq={3} seed={1} dots="#fff3c4" /></L><L depth={0.5}><Hills color="#2e8b57" edge="#4a1030" y={790} amp={30} freq={5} seed={4} /></L></>,
    },
    peacock: {
      bg: "dusk",
      back: <><L depth={0.1}><Fireworks /></L><L depth={0.3}><Hills color="#0e8c8c" edge="#4a1030" y={700} amp={50} freq={3} seed={3} /></L><L depth={0.5}><Hills color="#4a1030" edge="#4a1030" y={810} amp={25} freq={4} /></L></>,
    },
    paisley: {
      bg: "mint",
      back: <><L depth={0.08}><Clouds color="#fff" /></L><L depth={0.3}><Hills color="#7cc47f" edge="#4a1030" y={690} amp={60} freq={3} seed={5} dots="#e23a78" /></L><L depth={0.5}><Hills color="#2e8b57" edge="#4a1030" y={800} amp={30} freq={4} seed={1} /></L></>,
    },
    fish: {
      bg: "gold",
      back: <><L depth={0.08}><Fireworks /></L><L depth={0.18}><Mandap /></L><L depth={0.35}><Hills color="#ffb13b" edge="#4a1030" y={790} amp={16} freq={2} /></L></>,
      front: <L depth={0.6} className="parade-layer"><Parade /></L>,
    },
    kalash: {
      bg: "evening",
      back: <><L depth={0.12}><Lanterns /></L><L depth={0.3}><Hills color="#8e2a63" edge="#4a1030" y={720} amp={40} freq={3} seed={2} /></L><L depth={0.5}><Hills color="#4a1030" edge="#4a1030" y={820} amp={20} freq={5} /></L></>,
    },
  };

  w.events.forEach((ev, i) => {
    const sc = scenery[ev.motif];
    const isMain = "main" in ev && ev.main;
    const note = "note" in ev ? ev.note : undefined;
    scenes.push({
      key: `ev-${i}`, label: ev.title, bg: sc.bg,
      node: (
        <>
          {sc.back}
          <div className={`copy event ${isMain ? "is-main" : ""}`} data-depth="0.03">
            <div className="plx">
              {isMain ? null : <Medallion><MotifFor motif={ev.motif} /></Medallion>}
              <div className="ev-date" data-in><span className="d">{ev.day}</span><span className="m">{ev.month}</span></div>
              <p className="hindi ev-hindi" data-in>{ev.hindi}</p>
              <h2 className="ev-title" data-in>{ev.title}</h2>
              <p className="ev-meta" data-in>{ev.meta}</p>
              <p className="ev-place" data-in>{ev.place}</p>
              <p className="ev-dress" data-in><span className="label">Dress</span>{ev.dress}</p>
              {note ? <p className="ev-note" data-in>{note}</p> : null}
            </div>
          </div>
          {sc.front}
        </>
      ),
    });
  });

  scenes.push({
    key: "venue", label: "Venue", bg: "cream",
    node: (
      <>
        <L depth={0.08}><Clouds /></L>
        <L depth={0.3}><Hills color="#4fc3c3" edge="#4a1030" y={700} amp={40} freq={3} seed={6} /></L>
        <L depth={0.6}><River y={800} /></L>
        <div className="copy" data-depth="0.03">
          <div className="plx">
            <div className="venue-arch" data-in><Arch /></div>
            <p className="hindi ev-hindi" data-in>स्थान</p>
            <h2 className="venue-name" data-in>{w.venue.name}</h2>
            <p className="venue-address" data-in>{w.venue.addressLines.map((l, i) => <span key={i}>{l}<br /></span>)}</p>
            <div className="venue-links" data-in>
              <a className="pill" href={mapsLink()} target="_blank" rel="noopener">Open in Maps</a>
              <a className="pill" href={calendarLink()} target="_blank" rel="noopener">Save the Date</a>
            </div>
            <p className="venue-note" data-in>{w.venue.travelNote}</p>
            <p className="venue-note" data-in>{w.venue.stayNote}</p>
          </div>
        </div>
      </>
    ),
  });

  const [monoA, monoB] = w.monogram.split(" & ");
  scenes.push({
    key: "closing", label: "Countdown", bg: "twilight",
    node: (
      <>
        <L depth={0.08}><Fireworks /></L>
        <L depth={0.3}><Hills color="#8e2a63" edge="#4a1030" y={690} amp={40} freq={3} seed={7} /></L>
        <L depth={0.5}><River y={760} color="#0e6b7a" light="#4fc3c3" /></L>
        <L depth={0.7}><Diyas /></L>
        <div className="copy top" data-depth="0.03">
          <div className="plx">
            <p className="label section-label" data-in>The pheras begin in</p>
            <div data-in><Countdown targetISO={w.date.muhuratISO} /></div>
            <p className="muhurat" data-in>Vivah Muhurat · {w.date.longForm} · {w.date.muhuratLabel}</p>
            <p className="monogram foil" data-in>{monoA} <span>&amp;</span> {monoB}</p>
            <p className="closing-text" data-in>We can&apos;t wait to celebrate with you.</p>
            <p className="hashtag" data-in>{w.hashtag}</p>
            <p className="families label" data-in>With love · The {w.bride.parents.split(" ").pop()} &amp; {w.groom.parents.split(" ").pop()} families</p>
          </div>
        </div>
      </>
    ),
  });

  return scenes;
}
