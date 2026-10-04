import type { ReactNode } from "react";
import { wedding, calendarLink, mapsLink, type WeddingEvent } from "@/data/wedding";
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

const at = (iso: string) => new Date(`${iso}T12:00:00+05:30`);
const fmt = (iso: string, locale: string, o: Intl.DateTimeFormatOptions) => at(iso).toLocaleDateString(locale, { timeZone: "Asia/Kolkata", ...o });

/** One ceremony on a day card. Optional time and place appear only when known. */
const Ceremony = ({ ev }: { ev: WeddingEvent }) => {
  const time = "time" in ev ? ev.time : undefined;
  const timeHindi = "timeHindi" in ev ? ev.timeHindi : undefined;
  const place = "place" in ev ? ev.place : undefined;
  const placeHindi = "placeHindi" in ev ? ev.placeHindi : undefined;
  const note = "note" in ev ? ev.note : undefined;
  const meta = [timeHindi ?? time, placeHindi].filter(Boolean).join(" · ");
  const metaEn = [time, place].filter(Boolean).join(" · ");
  return (
    <div className="ceremony">
      <div className="ev-icon" data-in><EventIcon motif={ev.motif} /></div>
      <p className="hindi ev-hindi" data-in>{ev.hindi}</p>
      <h2 className="script ev-title name" data-in><Amp text={ev.title} /></h2>
      {meta ? <p className="hindi ev-meta-hi" data-in>{meta}</p> : null}
      {metaEn ? <p className="ev-place" data-in>{metaEn}</p> : null}
      {note ? <p className="ev-note" data-in>{note}</p> : null}
    </div>
  );
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
        <p className="hindi ganesh" data-in>शुभ विवाह</p>
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

  const days: { date: string; events: WeddingEvent[] }[] = [];
  w.events.forEach((ev) => {
    const last = days[days.length - 1];
    if (last && last.date === ev.date) last.events.push(ev);
    else days.push({ date: ev.date, events: [ev] });
  });

  days.forEach((day, i) => {
    scenes.push({
      key: `ev-${i}`, label: day.events.map((e) => e.title).join(" · "),
      node: (
        <Card className={`event ${day.events.length > 1 ? "pair" : ""}`}>
          <p className="label ev-day" data-in>{fmt(day.date, "en-IN", { weekday: "long" })}</p>
          <p className="ev-date" data-in>{fmt(day.date, "en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          <p className="hindi ev-date-hi" data-in>{fmt(day.date, "hi-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          <Flourish />
          {day.events.map((ev, k) => (
            <div className="ceremony-wrap" key={ev.title}>
              {k > 0 ? <span className="ceremony-rule" aria-hidden="true" /> : null}
              <Ceremony ev={ev} />
            </div>
          ))}
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
        <p className="hindi ev-hindi" data-in>{w.venue.nameHindi}</p>
        <h2 className="venue-name" data-in>{w.venue.name}</h2>
        <p className="body" data-in>{w.venue.addressLines.map((l, i) => <span key={i}>{l}<br /></span>)}</p>
        <div className="links" data-in>
          <a className="pill" href={mapsLink()} target="_blank" rel="noopener">Open in Maps</a>
          <a className="pill" href={calendarLink()} target="_blank" rel="noopener">Save the Date</a>
        </div>
        <Flourish />
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
