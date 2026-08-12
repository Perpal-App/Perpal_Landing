import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Product } from "@/components/sections/Product";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Faq } from "@/components/sections/Faq";
import { Access } from "@/components/sections/Access";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Product />
      {/* Mechanics, then whatever they leave unanswered, then the ask. Both of
          these sit above `Access` because an objection has to be settled before the
          button, and an FAQ under it is a footer. */}
      <HowItWorks />
      <Faq />
      <Access />
    </>
  );
}
