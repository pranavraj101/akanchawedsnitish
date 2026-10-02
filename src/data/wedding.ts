/**
 * Every detail of the invitation lives here. Change this file, nothing else.
 * Placeholder values are marked with (placeholder) in comments.
 */

export const wedding = {
  bride: {
    first: "Akansha",
    parents: "Mr. Prakash Chandra & Mrs. Punam Sinha",
  },
  groom: {
    first: "Nitish",
    full: "Nitish Anand",
    parents: "Mr. Ashok & Mrs. Rekha Anand", // (placeholder)
  },
  monogram: "A & N",
  hashtag: "#AkanshaWedsNitish",

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
    name: "Ganga Vatika Marriage Garden", // (placeholder)
    addressLines: ["Kapasiya Chowk, NH-31", "Begusarai, Bihar 851101"], // (placeholder)
    city: "Begusarai, Bihar",
    mapsQuery: "Ganga Vatika Marriage Garden Begusarai Bihar",
    travelNote:
      "Begusarai Junction is ten minutes from the venue. Patna airport is about three hours by road — we'll have cars waiting for outstation guests on 2 and 3 December.",
    stayNote: "Rooms for outstation guests are arranged nearby from 1 to 6 December.",
  },

  // Order matters: this is the sequence of the celebrations.
  events: [
    {
      day: "02",
      month: "Dec",
      monthLong: "December",
      hindi: "हल्दी एवं मटकोर",
      note: "Matkor — the Bihari ritual where the women of the house fetch sacred earth for the mandap.",
      title: "Haldi & Matkor",
      motif: "sun",
      meta: "Wednesday · 10:00 AM",
      place: "The Courtyard, Ganga Vatika",
      dress: "Yellows & whites you won't mind getting turmeric on",
    },
    {
      day: "02",
      month: "Dec",
      monthLong: "December",
      hindi: "संगीत",
      title: "Sangeet",
      motif: "peacock",
      meta: "Wednesday · 7:00 PM till the dhol gives up",
      place: "Main Lawn",
      dress: "Glam — sequins strongly encouraged",
    },
    {
      day: "03",
      month: "Dec",
      monthLong: "December",
      hindi: "मेहंदी",
      title: "Mehendi",
      motif: "paisley",
      meta: "Thursday · 11:00 AM onwards",
      place: "Poolside Pavilion",
      dress: "Greens, florals & anything that catches the sun",
    },
    {
      day: "04",
      month: "Dec",
      monthLong: "December",
      hindi: "बारात एवं विवाह",
      title: "Baraat & Vivah",
      motif: "fish",
      meta: "Friday · Baraat at 6:00 PM · Pheras at 8:45 PM",
      place: "The Mandap, Main Lawn",
      dress: "Traditional, in your richest colours. December nights in Begusarai are cold — carry a shawl.",
      main: true,
    },
    {
      day: "05",
      month: "Dec",
      monthLong: "December",
      hindi: "स्वागत समारोह",
      title: "Reception",
      motif: "kalash",
      meta: "Saturday · 7:30 PM",
      place: "Banquet Hall",
      dress: "Cocktail or Indo-western",
    },
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
