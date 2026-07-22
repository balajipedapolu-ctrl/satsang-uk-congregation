import Hero from "@/components/Hero";
import About from "@/components/About";
import EventDetails from "@/components/EventDetails";
import Schedule from "@/components/Schedule";
import Travel from "@/components/Travel";
import Gallery from "@/components/Gallery";
import DonationCTA from "@/components/DonationCTA";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <EventDetails />
      <Schedule />
      <Travel />
      <Gallery />
      <DonationCTA />
      <Contact />
    </>
  );
}
