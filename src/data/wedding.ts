/**
 * Every detail of the invitation lives here. Change this file, nothing else.
 * Placeholder values are marked with (placeholder) in comments.
 */

export const wedding = {
  bride: {
    first: "Akancha",
    parents: "Mr. Prakash Chandra & Mrs. Punam Sinha",
  },
  groom: {
    first: "Nitish",
    full: "Nitish Anand",
    parents: "Mr. Ashok & Mrs. Rekha Anand", // (placeholder)
  },
  monogram: "A & N",
  hashtag: "#AkanchaWedsNitish",

  // The main day
  date: {
    iso: "2026-12-04",
    weekday: "Friday",
    display: "04 · 12 · 2026",
    short: "4 December 2026",
    longForm: "Friday, 4 December 2026",
    // Vivah muhurat in IST — the countdown runs to this moment.
    muhuratISO: "2026-12-04T20:45:00+05:30",
    muhuratLabel: "8:45 PM",
  },

  venue: {
    name: "Parinay Garden",
    nameHindi: "परिणय गार्डन",
    addressLines: ["Begusarai, Bihar"],
    city: "Begusarai, Bihar",
    mapsQuery: "Parinay Garden Begusarai Bihar",
    stayNote: "Rooms for outstation guests are arranged nearby from 1 to 6 December.",
  },

  // Order matters: this is the sequence of the celebrations. Events sharing a
  // date are shown together on one card. time / place are optional.
  events: [
    { date: "2026-12-01", hindi: "तिलक", title: "Tilak", motif: "tilak" },
    { date: "2026-12-01", hindi: "शगुन", title: "Shagun", motif: "kalash" },
    { date: "2026-12-02", hindi: "हल्दी एवं मेंहदी", title: "Haldi & Mehendi", motif: "paisley", place: "At the residence", placeHindi: "निवास स्थल" },
    {
      date: "2026-12-02", hindi: "मटकोर", title: "Matkor", motif: "matka",
      note: "The Bihari ritual where the women of the house fetch sacred earth for the mandap.",
    },
    { date: "2026-12-03", hindi: "घृतढारी", title: "Ghritdhari", motif: "diya" },
    { date: "2026-12-04", hindi: "शुभ विवाह रात्रि", title: "Shubh Vivah", motif: "mandap", time: "Night", timeHindi: "रात्रि", place: "Parinay Garden, Begusarai", placeHindi: "परिणय गार्डन, बेगूसराय" },
    { date: "2026-12-04", hindi: "प्रीती भोज", title: "Preeti Bhoj", motif: "thali", time: "7:00 PM", timeHindi: "संध्या सात बजे" },
    { date: "2026-12-05", hindi: "विदाई", title: "Vidaai", motif: "doli", time: "7:00 AM", timeHindi: "सुबह सात बजे" },
  ],
} as const;

export type WeddingEvent = (typeof wedding.events)[number];
export type Motif = WeddingEvent["motif"];

/** Google Calendar "Save the date" link — a link, not a form. */
export function calendarLink(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${wedding.bride.first} & ${wedding.groom.first}'s Wedding`,
    // 6:00 PM IST baraat to midnight IST, expressed in UTC
    dates: "20261204T123000Z/20261204T183000Z",
    details: "Baraat at 6:00 PM · Pheras at 8:45 PM",
    location: `${wedding.venue.name}, ${wedding.venue.addressLines.join(", ")}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function mapsLink(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.venue.mapsQuery)}`;
}
