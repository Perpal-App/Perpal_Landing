import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Product } from "@/components/sections/Product";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Faq } from "@/components/sections/Faq";
import { Privacy } from "@/components/sections/Privacy";
import { Access } from "@/components/sections/Access";
import { Quote } from "@/components/sections/Quote";
import { Footer } from "@/components/chrome/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Product />
      {/* Mechanics, then the questions they leave, then the reassurance, then the
          ask. Everything a reader might still be weighing comes before the button,
          which is also why `Privacy` sits here rather than after it: the last thing
          said before an ask should be the reason to trust it. */}
      <HowItWorks />
      <Faq />
      <Privacy />
      <Access />
      {/* After the ask, and neither one asks for anything: the line the page wants
          remembered, then the plate it ends on. */}
      <Quote />
      <Footer />
    </>
  );
}
