import Nav from "./Nav";
import Hero from "./Hero";
import Problem from "./Problem";
import System from "./System";
import Audience from "./Audience";
import ConceptPreview from "./ConceptPreview";
import Trust from "./Trust";
import Testimonial from "./Testimonial";
import Pricing from "./Pricing";
import CTA from "./CTA";
import Footer from "./Footer";
import ScrollReveal from "./ScrollReveal";

export default function LandingPage() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <Hero />
      <Problem />
      <System />
      <Audience />
      <ConceptPreview />
      <Trust />
      <Testimonial />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
