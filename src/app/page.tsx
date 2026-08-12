import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Product } from "@/components/sections/Product";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Privacy } from "@/components/sections/Privacy";
import { Faq } from "@/components/sections/Faq";
import { Access } from "@/components/sections/Access";
import { Quote } from "@/components/sections/Quote";
import { Footer } from "@/components/chrome/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Product />
      {/* Mechanics, then the reassurance, then the questions that survive it, then the
          ask. Everything a reader might still be weighing comes before the button.
          `Privacy` moved above `Faq`: the objection it answers is the one nobody types
          into a search box, so it belongs where it can pre-empt the questions rather
          than trailing them — and it leaves the FAQ as the last word before the ask,
          which is where a reader with a specific doubt goes looking. */}
      <HowItWorks />
      <Privacy />
      <Faq />
      <Access />
      {/* After the ask, and neither one asks for anything: the line the page wants
          remembered, then the plate it ends on. */}
      <Quote />
      <Footer />
    </>
  );
}
