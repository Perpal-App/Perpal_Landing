import type { Metadata, Viewport } from "next";
import "./globals.css";

import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/content";
import { Nav } from "@/components/chrome/Nav";
import { Splash } from "@/components/chrome/Splash";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { OPENING_ACTIVE_CLASS } from "@/components/motion/opening";

/* Search engines use the title, visible H1 and Open Graph title together to name
   the result. Keep one descriptive version across those machine-readable surfaces
   so an unknown brand name still says what the product is. */
const socialTitle =
  "Perpal — Gamified perps learning and private trading on Solana";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: socialTitle, template: "%s — Perpal" },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "perpetuals",
    "Solana",
    "non-custodial",
    "Android",
    "Pacifica",
    "privacy-preserving funding",
    "Umbra",
    "perps",
  ],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: socialTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: "/" },
  icons: {
    icon: "/brand/perpal-mark.png",
    apple: "/brand/perpal-mark.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/**
 * Restores everything the motion layer would otherwise reveal.
 *
 * Reveal targets start hidden in CSS so they cannot flash before their
 * animation claims them, which means the page would stay blank if the
 * animations never run. This puts them back for anyone without JavaScript.
 */
const NO_JS_FALLBACK = `[data-reveal],[data-line],[data-parallax]>*{opacity:1!important;transform:none!important}html.${OPENING_ACTIVE_CLASS}{overflow:auto!important}html.${OPENING_ACTIVE_CLASS} body{overflow:auto!important;touch-action:auto!important}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fontVariables} ${OPENING_ACTIVE_CLASS} antialiased`}
      /* Inline, so the first painted pixel is already the frame colour. A class
         here would depend on the stylesheet having resolved, and the frame
         before it does is the browser's own white canvas. */
      style={{ colorScheme: "light", backgroundColor: "#ffffff" }}
    >
      {/* No background utility here: see the note on `body` in globals.css. */}
      <body className="text-ink">
        <noscript>
          <style>{NO_JS_FALLBACK}</style>
        </noscript>

        <SmoothScroll />

        {/* The gradient field is not here: it belongs to the hero, which owns
            and clips it. Everything below the hero sits on paper. */}

        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>

        <Splash />

        <Nav />

        {/* The page is not painted until the card starts to leave, and then it fades in where
            it already is. It does not move: a page that travels upward on arrival reads as
            having been scrolled, which is not something to show a visitor who has not touched
            anything. The timeline is written out in `globals.css`; this delay is one line of
            it. */}
        <main className="animate-[site-reveal_600ms_var(--ease-swift)_2200ms_both]">
          {children}
        </main>
      </body>
    </html>
  );
}
