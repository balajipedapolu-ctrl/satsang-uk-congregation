/**
 * Single source of truth for all event content.
 * Edit the values here to update the whole website.
 */

export const EVENT = {
  edition: "19th",
  editionNumber: "19",
  title: "19th Satsang UK National Congregation",
  // Name without the edition prefix (the big "19th" is shown separately).
  name: "Satsang UK National Congregation",
  occasion:
    "Celebrating the 139th Holy Birth Anniversary of Sree Sree Thakur Anukulchandra",
  // ISO date-time in UK time. Used by the countdown timer.
  startsAtISO: "2026-09-26T07:00:00+01:00",
  dateLabel: "Saturday, 26th September 2026",
  timeLabel: "07:00 am – 08:30 pm",
  venue: {
    name: "Nonsuch High School for Girls",
    address: "Ewell Road, Cheam, Sutton, London, SM3 8AB",
    postcode: "SM3 8AB",
    mapsQuery: "Nonsuch High School for Girls, Ewell Road, Cheam, Sutton, SM3 8AB",
  },
  dressCode: "Any Modest Dress.",
  organisation: "Satsang UK",
} as const;

export const CONTACT = {
  email: "Satsang.Unitedkingdom@gmail.com",
  phone: "+44 7868 098775",
  phone2: "+44 7730 416678",
} as const;

// Official public listing of this event on Sutton's community/voluntary
// sector directory — shown as a credibility link in Contact.
export const SUTTON_HUB_LISTING_URL =
  "https://suttoninformationhub.org.uk/events/satsang-uk-utsav-2026";

// A teaching of Sree Sree Thakur Anukulchandra, shown as a quote band.
export const THAKUR_QUOTE = {
  text: "Existence with attachment to the ideal is the be-all and end-all of life.",
  author: "Sree Sree Thakur Anukulchandra",
} as const;

// Secure online payment link (SumUp) and the matching QR code in /public.
export const DONATION_URL = "https://pay.sumup.com/b2c/QZ9MBBX7";
export const DONATION_QR = "/donate-qr.png";

export type Guest = {
  name: string;
  role: string;
  badge: string;
  photo?: string;
};

// Confirmed special guests for this year's congregation. Add more entries
// here as further confirmations come in — no other changes needed.
export const GUESTS: Guest[] = [
  {
    name: "Luke Taylor MP",
    role: "Member of Parliament for Sutton and Cheam",
    badge: "Chief Guest",
    photo: "/guest-luke-taylor.jpg",
  },
  {
    name: "Razia Sattar",
    role: "Head of Partnerships, Impact and Equalities, Community Action Sutton",
    badge: "Symposium Speaker",
    photo: "/guest-razia-sattar.jpg",
  },
];

export type CommunityPartner = {
  name: string;
  icon: string;
  summary: string;
  details: string;
};

// Community organisations collaborating with this year's congregation. Add
// more entries here as further partnerships are confirmed — no other
// changes needed.
export const COMMUNITY_PARTNERS: CommunityPartner[] = [
  {
    name: "Sutton Tree Wardens",
    icon: "🌳",
    summary: "A voluntary tree-plantation organisation",
    details:
      "Tree plantation has long been close to the heart of Pujyapad Acharyadev — from the tree-plantation campaign held in his honour on Reverend Abinda's last birthday, to the ongoing work of Satsang volunteers today. This year we're delighted to welcome the Sutton Tree Wardens to our Utsav. They'll be sharing leaflets and information about their work and upcoming projects, and Satsang volunteers are warmly invited to visit their table on the day to learn more and enrol in tree-plantation activities.",
  },
];

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
  { start: "15:00", end: "16:00", title: "Kids' & Cultural Programme" },
  { start: "16:00", end: "16:30", title: "Afternoon Tea Break" },
  { start: "16:30", end: "18:00", title: "Evening Congregation" },
  {
    start: "18:00",
    end: "19:00",
    title: "Musical Ensemble by BEATIFICUS",
    note: "Satsang Europe's musical band",
  },
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
  "Stage Decoration",
  "NHS Team Support",
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
