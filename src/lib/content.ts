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
} as const;

/**
 * The hero's waitlist control, in the order a reader meets it.
 *
 * `submit` is short because it sits inside the field rather than beside it: the
 * trigger already said "Join Waitlist", and the box supplies the object, so the
 * verb on its own is the whole instruction. That keeps the action's name
 * consistent through the flow rather than introducing a second word for it.
 *
 * `success` is present tense, which the page's own convention above allows —
 * everything here is written as though the app is shipping. It is worth being
 * clear about what that does and does not cover: it licenses the tense, not the
 * claim. The server only reaches this state after MongoDB accepts the registration
 * or confirms that the same address is already present.
 *
 * `invalid` says what happened and what to do, and names no field the reader
 * cannot see.
 */
export const waitlist = {
  /* The field's accessible name. The placeholder cannot be it: a placeholder
     disappears the moment anyone types, which is when a reader is most likely to
     need telling what the box wanted. */
  label: "Email address",
  placeholder: "Email",
  submit: "Join",
  success: "You're in",
  alreadyRegistered: "Already joined",
  count: (total: number) => ({
    lead: `${total.toLocaleString("en-US")} ${total === 1 ? "trader" : "traders"}`,
    tail: total === 1 ? "is already in" : "are already in",
  }),
  /* Two messages, because "invalid" covers two different mistakes and telling
     them apart is the difference between a message that helps and one that only
     scolds. An empty field has not been filled in; a malformed one has. */
  /* Both kept under about forty characters, and that is a layout constraint as
     much as an editorial one: they occupy a slot the control reserves rather than
     a line it grows, so a message that wrapped to two rows on a 360px screen
     would reintroduce the shift the slot exists to prevent. */
  empty: "Enter your email address.",
  invalid: "That does not look like an email address.",
  retry: "Register again in",
  unavailable: "Could not join. Please try again.",
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
 * The mechanics, between the argument and the reassurance.
 *
 * There is no section title here, on instruction, and nothing replaced it. "How it
 * works" named the pair from above, and what it added over the two headings under it
 * was the word "how" — which "One trade, end to end" and "Browse first, sign later"
 * both already are. A signpost over two panels that announce themselves is a line the
 * reader has to get past to reach the answer. The section keeps its `#how` anchor,
 * because that is a URL and not copy.
 *
 * Two answers rather than two halves of one: what happens across a whole trade, and
 * what you are allowed to do before any of it starts. The first is a sequence and is
 * drawn as one; the second is an invitation and is drawn as a market you can poke.
 *
 * This was eight steps in two columns, then five, and is now four labels. Two rounds of
 * cutting, both on instruction, and they cut in different directions.
 *
 * The first removed steps that were not Perpal's. "Sign in" was Privy provisioning a
 * Solana wallet and "Add a trading wallet" was Perpal deriving the second one — true,
 * and true of every wallet app ever shipped, so they described the genre rather than the
 * product. "Browse the markets" left the list too, and went somewhere better: it is the
 * second panel now, whose whole subject is that live Pacifica prices are open to look at
 * with nothing to sign first, so the claim is demonstrated instead of asserted.
 *
 * The second removed prose rather than steps. What is left names the four moments and
 * says nothing else about them, and the accounting for that is on `steps` below.
 *
 * The word "private" appears once, in the lede, on the funding legs. That is the one
 * place the engineering guide's scope allows it — the M -> T and T -> destination links —
 * and both legs are named in the same sentence. No fee, leverage or latency figure
 * appears anywhere here, and the sample series in the market panel says in plain words
 * that it is a sample.
 */
export const how = {
  trade: {
    title: "One trade, end to end",
    /* The lede carries the two claims worth keeping from the paragraphs the steps used to
       have — Umbra on both funding legs, and nothing signed before the order is read.
       Both were already on the page; neither is new.

       One string, and one paragraph on the page. It was briefly two entries set as two
       columns, to hold a reading measure across a plate that runs to 950px before the
       section splits — that is reverted on instruction. It reads as one sentence of
       thought, so it is set as one block of text and allowed to wrap where it wraps. */
    lede: "Umbra relays the money in and out, and that leg is the one that stays private. In between, nothing is signed until you have read the whole order.",
    /* Four labels rather than four paragraphs, on instruction: the node is a name on a
       wire, and a wire diagram whose nodes each hold a paragraph is a list with
       decoration around it.
       What that costs is worth writing down, because it is the section's substance —
       gone from the page are the SOL reserve, the six fields an order is spelled out in,
       the local signature, the key that never leaves the device, the reduce-only close,
       and position management as a named step. Every one of them is a fact, not a claim,
       so nothing on the page has become less true; the page simply says less. Position
       tracking still appears under `product.app`, and the funding legs survive in the
       lede above. The rest belongs in the FAQ when it is written.
       Named for what you do, in the order you do it. */
    steps: [
      "Fund through Umbra",
      "Choose open or close",
      "Review & confirm the order",
      "Withdraw through Umbra",
    ],
    /* Real alt text, because the screenshot is evidence rather than decoration: it is
       the screen the five steps above happen on. Described in the order the screen
       reads, and the description stops where the crop does. */
    shotAlt:
      "The Perpal trade screen for BTC-USD, showing the mark price and the day's change above the 24-hour volume, open interest, oracle price and funding rate, a 15-minute candle chart below them, and long and short order buttons at the foot of the screen.",
  },

  /**
   * The second panel, and it teaches rather than argues.
   *
   * It was a market you could look at, under the heading "Browse first, sign later" —
   * true, and the panel demonstrated it by being readable. This is the same idea with
   * something asked of the reader: the app's own pitch is that it teaches perps in short
   * daily lessons beside live markets, so the panel is a lesson. The chart stops three
   * quarters of the way along, you take a side, and the rest of it plays.
   *
   * Every claim here is one the page already makes. `hero` promises short daily lessons,
   * `product.lessons` promises them beside live markets, and `long` / `short` are the
   * product's own words for the two sides of a position. What the panel must not do is
   * imply a live feed, which is why the body says the chart is a sample and the numbers
   * are the only ones on this page that are invented.
   */
  lesson: {
    /* Two verbs in the order you do them, which is exactly the panel. */
    title: "Read the chart, take a side",
    body: "The app teaches perps in short daily lessons. Here is one, on a sample chart.",
    panel: {
      /* What the contract is, without the leverage the app's own screen shows beside
         it. A number there would be a claim; the word is a fact. */
      kind: "Perpetual",
      prompt: "Long or short from here?",
      /* The two sides, named as the product names them. */
      long: "Long",
      short: "Short",
      /* The session's own range, which is the same number whether it is measured over the
         visible part or the whole series — every setup's withheld quarter is inside the
         range its visible part already made, so neither figure gives anything away. */
      high: "High",
      low: "Low",
      /* The verdict, built as two halves: whether the call was right, then what the
         market did. Kept apart because the second half is true either way — a wrong
         call still deserves the number that beat it. */
      right: "Right.",
      wrong: "Not this time.",
      rose: "It closed higher, by",
      fell: "It closed lower, by",
      /* For a reader who cannot see the chart: what the drawing is withholding. */
      hidden:
        "The last quarter of the chart is hidden until you take a side.",
      /* The three questions as a track, and what each one is worth. `exp` is the app's
         own word for it. Read the note on this key before shipping: a number of exp on
         the marketing page says the lessons in the app keep score, so the app has to. */
      question: "Question",
      exp: "exp",
      xp: [50, 100, 150],
      states: {
        right: "correct",
        wrong: "missed",
        waiting: "not answered yet",
      },
      /* The closing card, indexed by score from nought to three. Each one says the number
         plainly and then gives the reader somewhere to stand — a lesson that scolds is a
         lesson nobody opens twice. */
      reactions: [
        "None this time. Reading a chart is a habit, not a knack.",
        "One from three. The next set reads easier.",
        "Two from three. One short of the set.",
        "Three from three. That is the lesson.",
      ],
      /* The result, as two figures rather than a sentence about them. "Calls" because that
         is what the reader made — a call on a market, not a guess at a quiz. */
      calls: "calls right",
      earned: "exp earned",
      again: "Play again",
    },
  },
} as const;

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Six questions, and the claim rules bite harder here than anywhere else on the page: an
 * answer is where a reader goes looking for the small print, and an invented number in one
 * would be believed.
 *
 * Every answer below follows the current product boundary. The live Pacifica catalog is
 * implemented; lessons, backtesting and the assistant are named as planned features.
 * The language stays at the user's level without exposing the infrastructure behind it.
 *
 * Two of them are worth reading before editing:
 *
 * "What does more privacy mean" still says what is not private. Money moving in and out
 * gets added privacy; trades remain visible to the trading service.
 *
 * No answer carries a fee, leverage or latency figure. There is no honest one to give, which
 * is also why there is no question about fees: a question whose answer has to be evasive is
 * worse than no question.
 */
export const faq = {
  title: "Frequently asked questions",
  items: [
    {
      question: "What can I trade?",
      answer:
        "Explore the full range of perpetual markets Pacifica makes available on Solana. The list updates with the available market catalog instead of being limited to a few fixed assets.",
    },
    {
      question: "How will the lessons work?",
      answer:
        "Short, Duolingo-style lessons will break perps into clear, manageable topics. Quick questions and market examples will help you practise each idea before moving on.",
    },
    {
      question: "What is backtesting for?",
      answer:
        "Planned backtesting will show how a trading idea might have behaved across past market conditions. You will be able to review the results and assumptions before using real funds.",
    },
    {
      question: "How can the AI assistant help?",
      answer:
        "The planned assistant will help explain markets, explore trade ideas and prepare an order for review. You remain responsible for checking and approving every trade.",
    },
    {
      question: "What does more privacy mean?",
      answer:
        "Perpal is designed to add privacy when money moves into or out of trading. You stay in control of your funds, approvals and withdrawals throughout.",
    },
    {
      question: "Does Perpal hold my funds?",
      answer:
        "No. You remain in control of your funds and trading decisions. Perpal does not take custody or approve trades on your behalf.",
    },
  ],
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
 * instruction, and the sentence under it is what earns it. It stays at the user's
 * altitude: control of funds, privacy when money moves in and out, and clear orders
 * before approval.
 *
 * What is deliberately absent is any claim about data. Perpal is non-custodial, so
 * the honest privacy story is custody and funding, not a promise never to sell
 * something the app does not collect — and a privacy card is exactly where an
 * unbacked promise would be quoted back at us. "Private" attaches to the funding
 * routing and nothing else, which is the line the guide draws.
 */
export const privacy = {
  title: "Built for privacy",
  body: "Your funds stay under your control. Perpal adds privacy when money moves in and out, while clear order details keep every decision yours.",
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
