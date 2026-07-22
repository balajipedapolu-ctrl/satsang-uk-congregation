/**
 * Single source of truth for all event content.
 * Edit the values here to update the whole website.
 */

export const EVENT = {
  edition: "19th",
  title: "19th Satsang National Congregation",
  occasion:
    "Celebrating the 139th Birth Anniversary of Sree Sree Thakur Anukulchandra",
  // ISO date-time in UK time. Used by the countdown timer.
  startsAtISO: "2026-09-26T07:00:00+01:00",
  dateLabel: "Saturday, 26th September 2026",
  timeLabel: "07:00 am – 07:00 pm",
  venue: {
    name: "Nonsuch High School for Girls",
    address: "Ewell Road, Cheam, Sutton, SM3 8AB",
    postcode: "SM3 8AB",
    mapsQuery: "Nonsuch High School for Girls, Ewell Road, Cheam, Sutton, SM3 8AB",
  },
  dressCode: "Any decent dress is welcome.",
  organisation: "Satsang UK",
} as const;

export const CONTACT = {
  email: "info@satsanguk.org",
  phone: "+44 20 0000 0000",
  whatsapp: "https://chat.whatsapp.com/your-group-invite-code",
} as const;

// Optional external donation link (Stripe / JustGiving / PayPal etc.)
export const DONATION_URL = "https://www.justgiving.com/your-campaign";

export type ScheduleItem = {
  start: string;
  end: string;
  title: string;
  note?: string;
};

export const SCHEDULE: ScheduleItem[] = [
  {
    start: "07:05",
    end: "07:15",
    title: "Sree Sree Thakur's Janma Lagna Ghoshana",
  },
  { start: "07:15", end: "09:00", title: "Morning Congregation" },
  {
    start: "09:00",
    end: "10:00",
    title: "Breakfast Break",
    note: "Sangeetanjali in parallel",
  },
  { start: "10:00", end: "11:00", title: "Welcome to NHS & VCF team" },
  {
    start: "11:00",
    end: "13:00",
    title:
      "Symposium — Being and Becoming: Sree Sree Thakur Anukulchandra's Philosophy of Human Excellence and Sustainable Living",
  },
  { start: "13:00", end: "14:00", title: "Lunch Prasad Break" },
  { start: "14:00", end: "15:00", title: "Matrisammelani" },
  { start: "15:00", end: "16:30", title: "Kids' & Cultural Programme" },
  { start: "16:30", end: "17:00", title: "Afternoon Tea Break" },
  { start: "17:00", end: "19:00", title: "Evening Congregation" },
  { start: "19:00", end: "20:30", title: "Dinner Prasad" },
];

export const SEVA_OPTIONS = [
  "Registration & Welcome Desk",
  "Prasad / Food Service",
  "Parking & Traffic",
  "Cultural Programme",
  "Set-up & Clean-up",
  "First Aid",
  "Photography / Media",
] as const;

// Primary navigation. Section links point to the landing page anchors so they
// work from any route (e.g. from the /register page too).
export const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Event", href: "/#event" },
  { label: "Schedule", href: "/#schedule" },
  { label: "Travel", href: "/#travel" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
] as const;
