/**
 * Every word on the page lives here.
 *
 * Copy rules, taken from the product's own engineering guide:
 *  - The guide scopes "private" to the M -> T and T -> destination funding
 *    links only, and forbids "private trading". The hero says "trade
 *    privately" against that, on the product owner's instruction. Read it as a
 *    deliberate marketing claim, not an oversight — but "anonymous" and
 *    "untraceable" are still out, here and everywhere.
 *  - Pacifica is the sole venue. Activity under trading wallet T remains
 *    visible to Pacifica and linkable to T.
 *  - No latency figures. No baseline has been measured on a physical device.
 *  - Android-only, on Solana mainnet.
 *  - The page is written as though the app is shipping, on instruction. The
 *    guide's future-tense rule for unbuilt features is suspended here, so any
 *    feature named on this page has to exist by launch or leave the copy.
 */

export const site = {
  name: "Perpal",
  tagline: "Trade perpetuals. Privately.",
  description:
    "Perpal is an Android-only, non-custodial perpetuals client for Solana. Browse live Pacifica markets without a wallet signature and confirm every order before local signing.",
  url: "https://perpal.app",
  repo: "https://github.com/Perpal-App",
} as const;

export const status = {
  chip: "Solana mainnet",
  build: "Android prototype",
} as const;

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export const hero = {
  headline: ["Trade perpetuals.", "Privately."],
  /* Two sentences, kept apart, because the hero breaks the lede on its own
     punctuation rather than wherever the measure runs out. The Umbra logo
     renders where `brand` sits in the second one — see `Hero`. The word stays
     here because it is still the logo's accessible name. */
  lede: {
    lesson: "Learn perps in short daily lessons.",
    funding: {
      before: "Fund through",
      brand: "Umbra",
      after: "and trade privately.",
    },
  },
} as const;

/* -------------------------------------------------------------------------- */
/* The action                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The page has one action, so it is named once.
 *
 * The nav pill and the hero button both read from here: two buttons pointing at
 * the same place must not be able to drift into two different names, and this
 * label is the one that has to stay consistent through the flow — whatever the
 * form says on success has to be the past tense of this word.
 */
export const cta = {
  label: "Join Waitlist",
  href: "#access",
} as const;

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const about = {
  /* A question, and the section answers it. Phrased as one because the reader's
     own question at this point in the page is exactly this. */
  title: "Why Perpal?",
  /**
   * Two short paragraphs: the gap, then the answer.
   *
   * Whole strings, not lines. The reveal animates characters, so it needs no
   * break points from the copy, and `text-wrap: balance` gives an evenly ragged
   * centred block at any width — which hand-written breaks cannot do, since they
   * are correct at exactly one measure.
   *
   * The second paragraph is deliberately plain. "Routes funding", "states every
   * order" and "your keys" are all accurate and all read as jargon to someone
   * who has never held a wallet — which is precisely who this section is for.
   */
  body: [
    "Perpetuals reward people who already understand them. Everyone else learns by losing money on venues built for traders who arrived fluent.",
    "Perpal puts a short lesson next to the market it explains, and adds money privately through Umbra. Every trade is shown in plain words before you approve it, from a wallet only you control.",
  ],
  /* The closing line names the three markets and where they trade, and nothing
     else. One sentence across two lines, starting with the verb: the colon made
     it read like a spec sheet, and what the markets are matters more to a reader
     than the infrastructure they sit on, so they come first.
     You trade on Perpal — that is the product the reader is being asked to want
     — and Pacifica is the venue underneath it. Naming them in that order is both
     the honest relationship and the useful one. */
  scope: {
    what: "Trade BTC, ETH, and SOL perpetuals",
    where: "on Perpal, powered by Pacifica.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Product                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Two panels: the trading home, and the product's learning and privacy scope.
 *
 * The claim rules bite hardest here, because this is the section that describes
 * the product rather than the promise. Everything under `app` has to be visible
 * in the screenshot beside it. Planned order controls are named as planned so
 * they cannot be mistaken for features already available in the prototype.
 */
export const product = {
  app: {
    title: "Perps, all in one place.",
    body: "Track balances, positions, and market signals, with a planned AI agent for analysis, backtests, and order prep you approve.",
    /* Real alt text: the screenshot carries information, so it is described
       rather than hidden. */
    alt: "The Perpal home screen, showing total balance, open trade count, a fear and greed gauge, the day's biggest movers with live prices, and market news.",
  },
  lessons: {
    title: "Learn. Backtest. Trade with more privacy.",
    body: "Take Duolingo-style perp lessons beside live markets, fund privately through Umbra, and use planned AI analysis, backtests, and user-approved order prep.",
    /* Shipping scope first, then the five the HLD marks incomplete: the three AI
       capabilities and the two order types beyond market. The list no longer says
       which is which, on instruction — the only remaining signal is the word
       "planned" in the paragraph above it, so if that sentence is ever reworded,
       this list starts claiming five features the prototype does not have. */
    topics: [
      "Duolingo-style lessons",
      "Live perp markets",
      "Private funding",
      "Market news",
      "Market orders",
      "Portfolio tracking",
      "AI market analysis",
      "AI backtesting",
    ],
  },
} as const;
