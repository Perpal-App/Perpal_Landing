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
  /* Two paragraphs, deliberately the same length: the gap, then the answer.
     Both stay short because a centred measure punishes long copy — the reader
     has to find the start of every line. */
  body: [
    "Perpetuals reward people who already understand them. Everyone else learns by losing money on venues built for traders who arrived fluent.",
    "Perpal puts the lesson beside the market it explains, keeps your keys on the phone, and decodes every order into plain fields before you sign.",
  ],
  /* The closing line, and the section's point. Perpal is narrow — one chain,
     one venue, three markets, one platform — and the narrowness is the reason
     to trust it, so the scope is stated flatly instead of written around. */
  scope: "Narrow on purpose: Solana mainnet, Pacifica, and BTC, ETH, SOL on Android.",
} as const;
