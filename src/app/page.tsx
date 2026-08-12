import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Product } from "@/components/sections/Product";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Faq } from "@/components/sections/Faq";
import { Access } from "@/components/sections/Access";
import { Privacy } from "@/components/sections/Privacy";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Product />
      {/* Mechanics, then whatever they leave unanswered, then the ask. Both of
          these sit above `Access` because an objection has to be settled before the
          button, and an FAQ under it is a footer.

          `Privacy` is the only thing below the ask, and it is not an argument — it
          is the sentence worth reading last. The button stays the last object on the
          page you can act on. */}
      <HowItWorks />
      <Faq />
      <Access />
      <Privacy />
    </>
  );
}
