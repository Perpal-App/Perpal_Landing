import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Product } from "@/components/sections/Product";
import { Access } from "@/components/sections/Access";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Product />
      <Access />
    </>
  );
}
