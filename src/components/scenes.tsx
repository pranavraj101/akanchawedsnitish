import type { ReactNode } from "react";
import { wedding, calendarLink, mapsLink } from "@/data/wedding";
import { EventIcon, Calendar, Pin, Flourish, Spark } from "@/components/ornaments";
import Countdown from "@/components/Countdown";

export type Scene = { key: string; label: string; node: ReactNode };

/** Content sitting inside the arch. depth drives the pointer parallax. */
const Card = ({ children, className = "", depth = 0.03 }: { children: ReactNode; className?: string; depth?: number }) => (
  <div className={`copy ${className}`} data-depth={depth}>
    <div className="plx">{children}</div>
  </div>
);

/** Pinyon's ampersand reads as an "E"; set it in the serif instead. */
const Amp = ({ text }: { text: string }) => {
  const [a, b] = text.split(" & ");
  return b === undefined ? <>{text}</> : <>{a} <span className="amp">&amp;</span> {b}</>;
};

const Couple = ({ size = "lg" }: { size?: "lg" | "sm" }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className={`couple couple-${size}`} src="/art/couple.webp" alt={`Illustration of ${wedding.bride.first} and ${wedding.groom.first}`} data-in draggable={false} />
);

const DateVenue = () => (
  <div className="facts" data-in>
    <div className="fact">
      <Calendar />
      <span className="fact-main">{wedding.date.short}</span>
      <span className="fact-sub">{wedding.date.weekday} · {wedding.date.muhuratLabel}</span>
    </div>
    <span className="fact-rule" aria-hidden="true" />
    <div className="fact">
      <Pin />
      <span className="fact-main">{wedding.venue.name}</span>
      <span className="fact-sub">{wedding.venue.city}</span>
    </div>
  </div>
);

export function buildScenes(): Scene[] {
  const w = wedding;
  const scenes: Scene[] = [];

  scenes.push({
    key: "hero", label: "Shubh Vivah",
    node: (
      <Card className="hero">
        <p className="hindi ganesh" data-in>॥ श्री गणेशाय नमः ॥</p>
        <p className="label" data-in>Together with their families</p>
        <Couple />
        <h1 className="names" data-in>
          <span className="script name">{w.bride.first}</span>
          <span className="and">and</span>
          <span className="script name">{w.groom.first}</span>
          <Spark className="s1" /><Spark className="s2" /><Spark className="s3" />
        </h1>
        <p className="label date-line" data-in>{w.date.display}</p>
      </Card>
    ),
  });

  scenes.push({
    key: "invite", label: "Invitation",
    node: (
      <Card className="invite">
        <p className="hindi shlok" data-in>मंगलम् भगवान् विष्णुः, मंगलम् गरुड़ध्वजः</p>
        <p className="body" data-in>With the blessings of our elders<br /><strong>{w.bride.parents}</strong><br />request the honour of your presence at the wedding of their daughter</p>
        <p className="script invite-name name" data-in>{w.bride.first}</p>
        <p className="and" data-in>with</p>
        <p className="script invite-name name" data-in>{w.groom.full}</p>
        <p className="body" data-in>son of <strong>{w.groom.parents}</strong></p>
        <DateVenue />
      </Card>
    ),
  });

  w.events.forEach((ev, i) => {
    const note = "note" in ev ? ev.note : undefined;
    scenes.push({
      key: `ev-${i}`, label: ev.title,
      node: (
        <Card className="event">
          <div className="ev-icon" data-in><EventIcon motif={ev.motif} /></div>
          <p className="hindi ev-hindi" data-in>{ev.hindi}</p>
          <h2 className="script ev-title name" data-in><Amp text={ev.title} /></h2>
          <p className="label ev-date" data-in>{ev.day} {ev.monthLong} · {ev.meta}</p>
          <Flourish />
          <p className="ev-place" data-in>{ev.place}</p>
          <p className="body ev-dress" data-in><span className="label">Attire</span>{ev.dress}</p>
          {note ? <p className="ev-note" data-in>{note}</p> : null}
        </Card>
      ),
    });
  });

  scenes.push({
    key: "venue", label: "Venue",
    node: (
      <Card className="venue">
        <div className="ev-icon" data-in><Pin /></div>
        <p className="label" data-in>The venue</p>
        <h2 className="venue-name" data-in>{w.venue.name}</h2>
        <p className="body" data-in>{w.venue.addressLines.map((l, i) => <span key={i}>{l}<br /></span>)}</p>
        <div className="links" data-in>
          <a className="pill" href={mapsLink()} target="_blank" rel="noopener">Open in Maps</a>
          <a className="pill" href={calendarLink()} target="_blank" rel="noopener">Save the Date</a>
        </div>
        <Flourish />
        <p className="ev-note" data-in>{w.venue.travelNote}</p>
        <p className="ev-note" data-in>{w.venue.stayNote}</p>
      </Card>
    ),
  });

  scenes.push({
    key: "closing", label: "Countdown",
    node: (
      <Card className="closing">
        <Couple size="sm" />
        <p className="label" data-in>The pheras begin in</p>
        <div data-in><Countdown targetISO={w.date.muhuratISO} /></div>
        <p className="ev-note" data-in>Vivah muhurat · {w.date.longForm} · {w.date.muhuratLabel}</p>
        <div className="closing-wrap">
          <p className="script closing-line name" data-in>We can&apos;t wait to celebrate with you</p>
          <Spark className="s1" /><Spark className="s3" />
        </div>
        <p className="label hashtag" data-in>{w.hashtag}</p>
        <p className="ev-note" data-in>With love, the {w.bride.parents.split(" ").pop()} &amp; {w.groom.parents.split(" ").pop()} families</p>
      </Card>
    ),
  });

  return scenes;
}
