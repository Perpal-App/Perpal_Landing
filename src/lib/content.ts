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
  /* Where the nav pill and the hero button send you: the closing panel, which is
     where the action itself now lives. Neither of them signs anyone up — they
     carry the reader to the button that does. */
  href: "#access",
  /* That button's destination, and the one line on this page that is not final.
     There is no waitlist form yet, so it points at the org that will hold it —
     the same placeholder discipline the Android badge used before the app had a
     store listing to link to. On the day there is a form URL it goes here and
     nothing else changes. */
  join: site.repo,
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
    /* Shipping scope first, then what the HLD marks incomplete: the three AI
       capabilities, and limit orders, which now ride inside the order-types term
       rather than sitting apart from it. The list no longer says which is which,
       on instruction — the only remaining signals are the word "planned" in the
       paragraph above it and the standing rule that anything named here exists by
       launch. Reword that sentence and this list starts claiming features the
       prototype does not have. */
    topics: [
      "Duolingo-style lessons",
      "Live perp markets",
      "Private funding",
      "Market news",
      "Market/Limit orders",
      "Portfolio tracking",
      "AI market analysis",
      "AI backtesting",
    ],
  },
} as const;

/* -------------------------------------------------------------------------- */
/* How it works                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The mechanics, between the argument and the questions.
 *
 * Title only, on instruction. The steps are not written yet, and an invented set
 * would be the worst possible placeholder here: this is the section where the claim
 * rules bite hardest after the FAQ, because a numbered sequence reads as a promise
 * about what the app already does.
 *
 * "How it works", sentence case, because it is a statement the section answers
 * rather than a signpost you navigate by — the same reason the panel headings above
 * it are not the uppercase `section-title`.
 */
export const how = {
  title: "How it works",
} as const;

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Title only, on instruction, until the questions are written.
 *
 * When they are, they land here rather than in the component, and the claim rules at
 * the top of this file are stricter in an answer than anywhere else on the page: an
 * answer is where a reader goes looking for the small print. In particular, whatever
 * is said about privacy has to hold the guide's line — the funding legs are the
 * private part, activity under the trading wallet stays visible to Pacifica and
 * linkable to that wallet — and no answer carries a fee, leverage or latency number,
 * because there is no honest one to give yet and an FAQ is where an invented one
 * would be believed.
 */
export const faq = {
  title: "Frequently asked questions",
} as const;

/* -------------------------------------------------------------------------- */
/* Access                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The closing panel: what is coming, and the one thing you can do about it now.
 *
 * The badges are a matching pair because the state they report is the same one —
 * neither store has the app yet. That is also why the title is no longer
 * "Download Perpal": a download heading over two badges that cannot be clicked is
 * a promise the panel does not keep. "Get early access" names what the waitlist
 * actually offers, and leaves the platform news to the badges under it.
 *
 * Each verb is the first half of a sentence its platform finishes — "Coming soon
 * to Android", "Coming soon to iOS" — which is the future tense the guide asks
 * for anything not yet shipping. They stay two fields rather than one string
 * because Android's line is the first that will change, and it changes on its own.
 *
 * Not "Download on the": that is Apple's own lockup wording, and these badges are
 * Perpal's drawing rather than the official artwork, so they should not borrow the
 * sentence that comes with it.
 */
export const access = {
  title: "Get early access",
  android: {
    verb: "Coming soon to",
    platform: "Android",
  },
  ios: {
    verb: "Coming soon to",
    platform: "iOS",
  },
  /* The device in the corner opposite the offer. Described rather than hidden, for
     the same reason as the home screen in `Product`: it is a shot of the real app,
     and it is a different screen from that one, so it has something of its own to
     say. It names the columns and stops there — the leverage badges the screen
     itself shows are exactly the kind of number the claim rules keep out of the
     copy, so the copy does not repeat them. */
  mockAlt:
    "The Perpal markets screen, listing perpetual markets with live prices, next funding, 24-hour change, and volume.",
} as const;

/* -------------------------------------------------------------------------- */
/* Privacy                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The last word on the page, and the one that has to be exact.
 *
 * "Built for privacy" is a heading in the same posture the hero was given on
 * instruction, and the sentence under it is what earns it. Three facts, each one the
 * guide's own, in the order they happen to a reader: the keys never leave the
 * device, the funding legs route through Umbra, and the order is legible before it
 * is signed.
 *
 * What is deliberately absent is any claim about data. Perpal is non-custodial, so
 * the honest privacy story is custody and funding, not a promise never to sell
 * something the app does not collect — and a privacy card is exactly where an
 * unbacked promise would be quoted back at us. "Private" attaches to the funding
 * routing and nothing else, which is the line the guide draws.
 */
export const privacy = {
  title: "Built for privacy",
  body: "Your keys stay on your device. Funding routes privately through Umbra, and every order is shown in plain words before you sign it.",
} as const;

/* -------------------------------------------------------------------------- */
/* The quote                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Two sentences, and they are the page's thesis rather than a testimonial.
 *
 * Unattributed on purpose. There is no user to quote yet — the app is unreleased —
 * and inventing a name under a pull quote is the one kind of copy on this page that
 * would be a lie rather than a stretch. What sits in the marks is the argument
 * `About` makes at length, compressed to the sentences it was always trying to be.
 *
 * The first sentence claims nothing about the product, which is why it can be this
 * confident: no feature, no venue, no number, nothing that has to ship for the line
 * to stay true.
 *
 * The second is here on instruction, because privacy is the product's main claim and
 * the page's last statement was silent about it. It repeats the first one's grammar —
 * "should not cost" twice — so the two read as one argument in two beats rather than as
 * a statement with a feature bolted on.
 *
 * Punctuated as one sentence with a comma between the halves, and no full stop at the
 * end. Both are deliberate. The comma is a splice, joining two clauses that could each
 * stand alone; with the parallel grammar carrying it, that reads as one breath rather
 * than as a missing conjunction, and an "and" there would make the second clause sound
 * like an addition instead of the same claim restated. It also means "trading" is
 * lowercase, because it is no longer opening a sentence. Dropping the terminal full
 * stop is the pull-quote convention the reference sets: a quotation set as an object
 * does not need to be closed like prose, and at this size a period is a mark the eye
 * has to account for at the end of the composition.
 *
 * Its subject is "trading", not "funding", on the product owner's instruction. Note
 * what that costs, because the rule at the top of this file is explicit that the guide
 * forbids exactly this: "private" is scoped to the funding legs, and a claim that
 * trading does not cost your privacy is the broad version the guide rules out. It is
 * the same exception the hero already carries, granted the same way, and this is now
 * the second place on the page standing on it — so if that instruction is ever
 * withdrawn, both the hero and this line come back for rewording together. Nothing
 * else moved: "anonymous" and "untraceable" are still absent, there is still no number,
 * and `privacy.body` still carries the mechanism.
 *
 * Broken into lines here rather than left to wrap, the same as `hero.headline` and for
 * the same reason: the plate is full-bleed, so the measure deciding where a line ends
 * moves with the viewport, and a quotation that has to hold three lines cannot have
 * the browser choosing how many it gets. Authored breaks make the count a fact rather
 * than the outcome of a font-metric estimate.
 *
 * 37 / 32 / 36 characters. The near-match between the first and last is worth keeping
 * for the shape — a centred block reads as composed when its outer lines balance — but
 * nothing depends on it any more. The quote marks used to be pinned to the corners of a
 * box sized by the longest line, which made every other line's mark sit further from
 * its words; they now anchor to their own line, so these three strings can be rewritten
 * to any lengths without the framing coming apart.
 *
 * The break also moved. It used to fall after "cost", which left the second line
 * opening on "you the money" — a pronoun stranded at the head of a line, reading as
 * though the sentence had restarted. It now falls after "cost you", so the first line
 * closes on a complete verb phrase and the second opens on its object.
 */
export const quote = {
  lines: [
    "Learning to trade should not cost you",
    "the money you are learning with,",
    "trading should not cost your privacy",
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Two ways to reach the project, and a notice.
 *
 * They are treated differently on purpose. X gets its own mark, because a brand glyph
 * is the one kind of icon that carries information a word cannot — it identifies the
 * platform faster than reading a URL does, and it is the platform's own identity rather
 * than a decoration standing in for one. The email is printed in full instead: "Contact"
 * behind an envelope would be shorter and would tell the reader less, since an address
 * on the page can be read, copied and judged before anyone clicks.
 *
 * What is absent is still the point. There is no support portal, no documentation, no
 * terms and no privacy policy to link, because none of them exist — this is an
 * unpublished Android prototype. A footer with three columns of links would be inventing
 * a company. A Gmail address is what is true, and it dates the page honestly.
 *
 * `notice` takes the year rather than hard-coding it. Written in, it would be wrong by
 * one every January and nobody would notice; taken from the clock in a shared module it
 * would be evaluated on both the server and the client and could disagree across a New
 * Year boundary. Passed in from a server component, it is fixed at build and correct on
 * every deploy, and the sentence still lives here whole rather than assembled in the
 * component from three fragments.
 */
export const footer = {
  email: {
    /* Rendered through the `label` utility, which uppercases it, so the casing here is
       what assistive technology reads rather than what appears. Sentence case, as
       everywhere else. */
    title: "Contact us",
    label: "perpal.app@gmail.com",
    href: "mailto:perpal.app@gmail.com",
  },
  /* `label` is the accessible name for the icon link, which has no text of its own. */
  x: {
    label: "Perpal on X",
    href: "https://x.com/PerpalApp",
  },
  notice: (year: number) => `© ${year} Perpal. All rights reserved.`,
} as const;
