import Hero from "@/components/Hero";
import QuoteBand from "@/components/QuoteBand";
import NHSHighlight from "@/components/NHSHighlight";
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
      <QuoteBand />
      <NHSHighlight />
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
