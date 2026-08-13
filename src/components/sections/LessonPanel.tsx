"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { how } from "@/lib/content";
import { Confetti } from "@/components/ui/Confetti";
import { MascotSays } from "@/components/ui/Mascot";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/scroll";
import { useIsomorphicLayoutEffect } from "@/components/motion/use-isomorphic-layout-effect";

/**
 * A lesson, played on a chart that stops early.
 *
 * The panel is the argument rather than an illustration of it. Its heading says the app
 * teaches perps by reading a chart and taking a side, and the way to demonstrate that on
 * a web page is to hand the reader a chart with its ending withheld and two buttons. One
 * tap is the whole interaction — the gamified part is what the tap reveals, not a layer
 * of scoring on top of a graph.
 *
 * Three rounds, one per market Perpal trades. Two of them close higher and one lower, so
 * the answer is never a pattern to learn instead of a chart to read.
 *
 * The reveal is the drawing, and it is built out of two masked copies of the same path.
 * The history is `ink` and neutral, because a coloured line before the answer would be
 * the answer. The tail is `long` or `short` — this repo's semantic market tokens, and the
 * only honest use of them: the colour states which way the market went, and it arrives at
 * the same moment that fact does.
 *
 * The mascot is `Mascot`'s job, not this file's. What belongs here is when it pops: its
 * key is the round and the answer, so it arrives once for the question and again for the
 * verdict, and the mood it arrives in is the only place the panel says right or wrong in a
 * face rather than in words. The words are still there underneath it.
 *
 * The card stays `paper`, and the separation from its plate is the plate's job. This was
 * briefly `ink`, to tell it apart from the white node cards opposite; that is not
 * available, because every surface on this site is light. `long` and `short` are the
 * reason it would not have worked anyway — both were darkened to clear 4.5:1 on paper, so
 * on a dark card they measure 3.5:1 and no text could carry them.
 *
 * The chart is twelve closes, drawn as one spline over a body of colour — a shape to judge
 * rather than a data series to inspect. No gridlines and no vertex markers: the line is
 * the whole reading, and the numbers that matter are named instead, in the app's own
 * shorthand above the plot. One marker survives, on the cut, because that is the price the
 * question is asked at. The setups are authored by hand and the constraint they all have to
 * meet is recorded above `SETUPS`.
 *
 * The lesson ends in a card rather than a reset: a medal struck out of light, a reaction
 * chosen by the score, the two figures it came to, and a way back in. The medal wears the
 * same `lilac-deep` and the same puff as the completed capsules on the track above it, so
 * finishing looks like three of those, scaled up. No mascot on it: the mascot's job is the
 * conversation during a question, and the card is the result.
 *
 * At nought from three the light, the confetti and the tick all drop out and the card keeps
 * only its sentence. A celebration for a set nobody got right would read as sarcasm.
 *
 * The plot is drawn in a 0-100 box with `preserveAspectRatio="none"`, so it stretches to
 * whatever height the panel has left after the copy — which is how this column matches the
 * device beside it without a magic number. `vector-effect="non-scaling-stroke"` keeps the
 * line 3px through that stretch instead of scaling it into a wedge, and anything that must
 * not distort — the vertices, the cut line, the question mark — is a DOM element in
 * percentages over the same box rather than a shape inside it. A `<circle>` in there would
 * be drawn as an ellipse.
 */

/** Twelve closes, nine of them visible: the lesson asks at the ninth. */
const POINTS = 12;
const CUT = 9;

/** The drawing box. Inset top and bottom so a peak never touches the frame. */
const BOX = 100;
const INSET = 8;

/** Where the chart stops, in the box's own units. */
const EDGE = ((CUT - 1) / (POINTS - 1)) * BOX;

/* How long the answer stays on screen before the next question, and the longer beat after
   the last one so the third mark on the progress strip is seen before it empties.
   Long enough to read a verdict of about eight words, and the reveal takes 0.7s of it. */
const HOLD = 2400;
const HOLD_LAST = 3400;

type Side = "long" | "short";

/* Three setups, drawn by hand rather than generated.
   A random walk gave ninety-six closes and a jagged line, and neither served a lesson:
   twelve points read as a shape you can judge, and a designed shape can be a case worth
   teaching — a bottom that turns, a rally that makes a lower high, a level that holds.
   Hand-authoring also settles the one thing a generator kept getting wrong. The axis is
   scaled to the whole series, so if the withheld quarter made a new high or low, the
   visible part would never touch that end of the plot and the empty band would give the
   answer away. Every tail below stays inside the range its own visible part already
   reached. Check that by eye before editing a number. */
const SETUPS = [
  {
    id: "BTC",
    pair: "BTC-USD",
    /* Sold off all session, flattens on the low, ticks up. Closes higher. */
    closes: [
      63_900, 63_200, 62_400, 62_700, 61_800, 61_200, 61_500, 61_100, 61_300,
      61_900, 62_600, 63_100,
    ],
  },
  {
    id: "ETH",
    pair: "ETH-USD",
    /* Rallied, then a lower high and no follow-through. Closes lower. */
    closes: [
      2_980, 3_050, 3_120, 3_080, 3_150, 3_190, 3_160, 3_175, 3_140, 3_105,
      3_070, 3_055,
    ],
  },
  {
    id: "SOL",
    pair: "SOL-USD",
    /* Slid, held the same level three times, bounced. Closes higher. */
    closes: [
      148.2, 151, 149.4, 146.2, 143.8, 144.6, 142.9, 143.5, 142.6, 144.8, 146.9,
      148.6,
    ],
  },
];

/**
 * Catmull-Rom through the closes, written out as cubic Béziers.
 *
 * Tension under 1 on purpose. At 1 the curve bulges past every turn, and on a price chart
 * an overshoot is a high or a low that never happened — the one kind of smoothing a chart
 * cannot afford. At 0.8 the line still reads as drawn rather than plotted and the peaks
 * stay where the closes put them.
 */
function spline(points: readonly { x: number; y: number }[], tension = 0.8) {
  let path = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const before = points[index - 1] ?? points[index];
    const from = points[index];
    const to = points[index + 1];
    const after = points[index + 2] ?? points[index + 1];

    const c1x = from.x + ((to.x - before.x) / 6) * tension;
    const c1y = from.y + ((to.y - before.y) / 6) * tension;
    const c2x = to.x - ((after.x - from.x) / 6) * tension;
    const c2y = to.y - ((after.y - from.y) / 6) * tension;

    path += `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${to.x.toFixed(2)} ${to.y.toFixed(2)}`;
  }

  return path;
}

const ROUNDS = SETUPS.map((setup) => {
  const { closes } = setup;
  const low = Math.min(...closes);
  const high = Math.max(...closes);
  const span = high - low || 1;

  const at = (value: number) =>
    INSET + (1 - (value - low) / span) * (BOX - INSET * 2);

  const points = closes.map((value, index) => ({
    x: (index / (POINTS - 1)) * BOX,
    y: at(value),
  }));

  const line = spline(points);
  const mark = closes[CUT - 1];
  const close = closes[POINTS - 1];
  const move = (close - mark) / mark;

  return {
    ...setup,
    at,
    line,
    /* The session's range. Named away from `high` and `low` so nothing here reads as the
       axis bounds it happens to share. */
    top: high,
    floor: low,
    /* Closed to the floor of the box rather than to the lowest close, so the fill reads
       as a body of colour under the line and not as a ribbon. */
    area: `${line} L${BOX} ${BOX} L0 ${BOX} Z`,
    mark,
    close,
    move,
    outcome: (move >= 0 ? "long" : "short") as Side,
  };
});

const money = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const { panel } = how.lesson;

/* The closing card: a lilac wash rather than white, so the medal and the action sitting on
   it are deeper steps of the field they sit in rather than colour dropped onto paper. Mixed
   from the token, not sampled off it, so the two ends of the ramp cannot drift apart. */
const CARD = [
  "linear-gradient(180deg,",
  "color-mix(in srgb, var(--color-lilac) 26%, var(--color-paper)) 0%,",
  "color-mix(in srgb, var(--color-lilac) 58%, var(--color-paper)) 100%)",
].join(" ");

/* And the light on it. Rays first, then a glow over them, both struck from `50% 50%` of a
   layer that is centred on the medal itself — which is the only way the two stay registered
   with each other, since the medal's place in the card depends on how much copy is under
   it. White, because on a tinted field light has to be lighter than its ground; over the
   earlier white card these were violet, and a violet sunburst on a violet wash is a
   pattern rather than light.

   Every stop fades to white at zero alpha rather than to `transparent`, the rule `Backdrop`
   records: `transparent` is rgba(0,0,0,0), so interpolating to it drags the ramp through
   black and leaves a grey cast. The rays are masked back to nothing well before the layer's
   edge, because a sunburst that reaches a panel's corners stops reading as light. */
const RAYS = [
  "repeating-conic-gradient(from 8deg at 50% 50%,",
  "rgba(255,255,255,0.72) 0deg 5deg,",
  "rgba(255,255,255,0) 5deg 17deg)",
].join(" ");

const RAY_MASK = [
  "radial-gradient(closest-side at 50% 50%,",
  "#000 0%, rgba(0,0,0,0.5) 54%, rgba(0,0,0,0) 100%)",
].join(" ");

const GLOW = [
  "radial-gradient(closest-side at 50% 50%,",
  "rgba(255,255,255,0.7) 0%,",
  "rgba(255,255,255,0.28) 44%,",
  "rgba(255,255,255,0) 76%)",
].join(" ");

/** A four-point star, in a 12-unit box. */
const STAR = "M6 0 7.4 4.6 12 6 7.4 7.4 6 12 4.6 7.4 0 6 4.6 4.6Z";

export function LessonPanel() {
  /* Stripped down to word characters, because these ids end up inside `url(#…)`
     references for the gradients and masks. React's generated ids carry punctuation that
     a fragment reference should not have to survive. */
  const uid = useId().replace(/[^\w-]/g, "");

  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState<(Side | null)[]>(() =>
    ROUNDS.map(() => null),
  );
  const [done, setDone] = useState(false);

  const plot = useRef<HTMLDivElement>(null);
  const history = useRef<SVGRectElement>(null);
  const tail = useRef<SVGRectElement>(null);
  const arrived = useRef(false);

  const market = ROUNDS[round];
  const pick = picks[round];
  const answered = pick !== null;
  const hit = pick === market.outcome;
  const last = round === ROUNDS.length - 1;

  const right = picks.map(
    (choice, index) => choice !== null && choice === ROUNDS[index].outcome,
  );
  const score = right.filter(Boolean).length;
  const earned = right.reduce(
    (total, won, index) => total + (won ? panel.xp[index] : 0),
    0,
  );

  /* Everything below is imperative rather than an effect on state, because a
     `gsap.context` reverting between renders would flash the whole chart for a frame —
     which in this panel is the answer. Every tween is a `fromTo` with `overwrite`, so it
     starts where it means to whatever GSAP last read off the element, and a fast run of
     taps lands on the last one.

     Both wipes are eased in and out rather than out only, which is the difference between
     a line being drawn and a curtain being pulled. */
  const draw = useCallback((duration: number) => {
    const rect = history.current;
    if (!rect) return;

    if (prefersReducedMotion()) {
      gsap.set(rect, { scaleX: 1 });
      return;
    }

    gsap.fromTo(
      rect,
      { scaleX: 0 },
      {
        scaleX: 1,
        svgOrigin: `0 ${BOX / 2}`,
        duration,
        ease: "power2.inOut",
        overwrite: true,
      },
    );
  }, []);

  const reveal = useCallback(() => {
    const rect = tail.current;
    if (!rect) return;

    if (prefersReducedMotion()) {
      gsap.set(rect, { scaleX: 1 });
      return;
    }

    gsap.fromTo(
      rect,
      { scaleX: 0 },
      {
        scaleX: 1,
        svgOrigin: `${EDGE} ${BOX / 2}`,
        duration: 0.85,
        ease: "power2.inOut",
        overwrite: true,
      },
    );
  }, []);

  /* The first draw waits for the panel to arrive on screen. */
  useIsomorphicLayoutEffect(() => {
    const rect = history.current;
    if (!rect) return;

    if (prefersReducedMotion()) {
      gsap.set(rect, { scaleX: 1 });
      return;
    }

    gsap.set(rect, { scaleX: 0 });

    const trigger = ScrollTrigger.create({
      trigger: plot.current,
      start: "top 88%",
      once: true,
      onEnter: () => draw(0.9),
    });

    return () => trigger.kill();
  }, [draw]);

  /* A new round redraws. In a layout effect, before paint, and the plot is keyed on the
     round as well, so the question that just began cannot show a single frame of the one
     that ended — the masks it inherits are fresh elements whose markup has the tail
     collapsed. Two guards for one bug, because the bug is showing the reader the answer. */
  useIsomorphicLayoutEffect(() => {
    if (!arrived.current) {
      arrived.current = true;
      return;
    }

    draw(0.6);
  }, [round, draw]);

  /* The wipe runs from an effect rather than from the handler, because the group it
     reveals is only mounted by the render the handler causes. */
  useIsomorphicLayoutEffect(() => {
    if (answered) reveal();
  }, [answered, round, reveal]);

  function take(side: Side) {
    if (answered) return;
    setPicks((current) =>
      current.map((choice, index) => (index === round ? side : choice)),
    );
  }

  function restart() {
    setPicks(ROUNDS.map(() => null));
    setRound(0);
    setDone(false);
  }

  /* The lesson carries itself between questions: an answer holds long enough to be read,
     then the next one arrives. It does not carry itself past the end — after the third,
     the result stands until the reader asks for another set. The timer is started by the
     reader's own answer and fires once, so this is a response to an action rather than a
     carousel; nothing moves on this panel unless it was asked to. */
  useEffect(() => {
    if (!answered || done) return;

    const timer = window.setTimeout(
      () => {
        if (last) setDone(true);
        else setRound((current) => current + 1);
      },
      last ? HOLD_LAST : HOLD,
    );

    return () => window.clearTimeout(timer);
  }, [answered, done, last]);

  const cursor = market.at(market.mark);

  return (
    <div className="flex flex-1 flex-col">
      {/* The three questions as a track, each one worth what it says underneath. A node
          is filled when the call was right and dropped back when it was missed, so the
          track is a score as well as a position — which is why the panel needs no separate
          tally. `lilac-deep` fills it: the section's own violet, and not `grape`, which is
          reserved for things you press. */}
      <ol className="flex items-start">
        {ROUNDS.map((entry, index) => {
          const won = right[index];
          const missed = picks[index] !== null && !won;
          const current = index === round && !done;

          return (
            <li
              key={entry.id}
              className="relative flex flex-1 flex-col items-center gap-1.5"
            >
              {/* The rail runs from the previous capsule's middle to this one's, behind
                  both, and fills rather than switching colour: a track with an inner bar
                  scaled from its left edge, so completing a question pushes the line
                  across instead of repainting it. */}
              {index > 0 ? (
                <span
                  aria-hidden
                  className="absolute top-[1.125rem] left-[-50%] right-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-surface"
                >
                  <span
                    className={`block h-full origin-left rounded-full bg-lilac-deep transition-transform duration-500 ease-swift ${
                      picks[index - 1] !== null ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </span>
              ) : null}

              {/* Two elements, because the halo and the capsule need separate rings: the
                  `paper` collar is what makes the rail stop short of the capsule instead
                  of running under it, and the capsule keeps its own inset ring for the
                  question in play. */}
              <span aria-hidden className="relative z-10 rounded-full bg-paper p-1">
                <span
                  /* Keyed on the state so a completed capsule remounts and pops. The
                     animation is left off while a question is still waiting — nothing
                     should pop on page load. */
                  key={won ? "won" : missed ? "missed" : "waiting"}
                  className={`grid h-7 w-11 place-items-center rounded-full ${
                    picks[index] === null
                      ? ""
                      : "animate-[node-pop_340ms_var(--ease-snap)_both]"
                  } ${
                    won
                      ? "bg-lilac-deep text-paper shadow-raise"
                      : missed
                        ? "bg-surface text-muted"
                        : current
                          ? "bg-paper text-lilac-deep ring-2 ring-lilac-deep ring-inset"
                          : "bg-surface text-muted"
                  }`}
                >
                  {won ? (
                    <svg viewBox="0 0 12 12" className="size-3.5 fill-none">
                      <path
                        d="M2.6 6.4 4.8 8.6 9.4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        pathLength={12}
                        strokeDasharray={12}
                        className="animate-[check-draw_320ms_260ms_var(--ease-quart)_both]"
                      />
                    </svg>
                  ) : missed ? (
                    <svg viewBox="0 0 12 12" className="size-3 fill-none">
                      <path
                        d="M3.2 3.2 8.8 8.8M8.8 3.2 3.2 8.8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <span className="nums font-ui text-xs font-semibold">
                      {index + 1}
                    </span>
                  )}
                </span>
              </span>

              <span aria-hidden className="label text-muted">
                <span className="nums">{panel.xp[index]}</span> {panel.exp}
              </span>

              <span className="sr-only">
                {panel.question} {index + 1}, {panel.xp[index]} {panel.exp}:{" "}
                {won
                  ? panel.states.right
                  : missed
                    ? panel.states.wrong
                    : panel.states.waiting}
              </span>
            </li>
          );
        })}
      </ol>

      {done ? (
        <div
          style={{ background: CARD }}
          className="relative mt-4 flex flex-1 flex-col items-center justify-center gap-7 overflow-hidden rounded-xl p-6 text-center"
        >
          {/* Confetti belongs to the card; the light belongs to the medal, and is inside its
              box below. Both only where there is something to mark — at nought from three
              the card keeps its words and drops the party. */}
          {score > 0 ? <Confetti /> : null}

          <div className="relative">
            {/* Struck from the medal's own centre: the layer is oversized around the disc,
                so `50% 50%` of it is the middle of the tick whatever sits underneath. The
                card's clip is what cuts it. */}
            {score > 0 ? (
              <>
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-52"
                  style={{
                    backgroundImage: RAYS,
                    maskImage: RAY_MASK,
                    WebkitMaskImage: RAY_MASK,
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-52"
                  style={{ background: GLOW }}
                />
              </>
            ) : null}

            <div
              className={`relative grid size-20 place-items-center rounded-full animate-[node-pop_420ms_var(--ease-snap)_both] ${
                score > 0
                  ? "bg-lilac-deep text-paper shadow-raise"
                  : "bg-paper text-muted"
              }`}
            >
                <svg aria-hidden viewBox="0 0 24 24" className="size-10 fill-none">
                  <path
                    d={
                      score > 0
                        ? "M6.5 12.6 10.4 16.6 17.6 8"
                        : "M8 8 16 16M16 8 8 16"
                    }
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={12}
                    strokeDasharray={12}
                    className="animate-[check-draw_420ms_300ms_var(--ease-quart)_both]"
                  />
                </svg>
              </div>

              {/* Two sparks, off-centre and unequal, because a pair the same size either
                  side of a disc reads as a diagram. */}
              {score > 0 ? (
                <>
                  <svg
                    aria-hidden
                    viewBox="0 0 12 12"
                    className="absolute -top-2 -right-4 size-5 animate-[node-pop_360ms_420ms_var(--ease-snap)_both]"
                  >
                    <path d={STAR} fill="var(--color-sky-deep)" />
                  </svg>
                  <svg
                    aria-hidden
                    viewBox="0 0 12 12"
                    className="absolute top-11 -left-5 size-4 animate-[node-pop_360ms_560ms_var(--ease-snap)_both]"
                  >
                    <path d={STAR} fill="var(--color-sky-deep)" />
                  </svg>
                </>
              ) : null}
          </div>

          <p
            aria-live="polite"
            className="relative max-w-[26ch] font-ui text-lg leading-snug font-semibold text-ink"
          >
            {panel.reactions[score]}
          </p>

          {/* The result as figures. Two tiles rather than a sentence, and the two numbers
              are not the same fact twice: one is how many calls landed, the other is what
              they were worth — a set can be two from three and still be worth 50 or 250,
              because the questions are not priced the same. */}
          <dl className="relative grid w-full max-w-sm grid-cols-2 gap-3">
            {/* `flex-col-reverse`, so the term can come first in the markup — a definition
                list has to be read `dt` then `dd` — while the figure reads first on the
                page. */}
            <div className="flex flex-col-reverse gap-2 rounded-xl bg-paper px-4 py-4">
              <dt className="label text-muted">{panel.calls}</dt>
              <dd className="nums font-ui text-2xl leading-none font-semibold text-ink">
                {score}
                <span className="text-muted">/{ROUNDS.length}</span>
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-2 rounded-xl bg-paper px-4 py-4">
              <dt className="label text-muted">{panel.earned}</dt>
              <dd className="nums font-ui text-2xl leading-none font-semibold text-ink">
                {earned}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={restart}
            /* The same key as the two choices, in the action colour — this one is a real
               action rather than an answer, so `grape` is where it belongs. */
            className="relative min-h-11 rounded-xl bg-grape px-6 font-ui text-sm font-semibold text-grape-ink shadow-raise transition-[transform,background-color] duration-150 ease-swift hover:bg-grape-deep active:translate-y-[3px] active:shadow-none"
          >
            {panel.again}
          </button>
        </div>
      ) : (
      <div
        /* One `color` for the panel's tail, so the line, its fill and the number in the
           verdict cannot end up disagreeing about which way the market went. */
        style={{
          color:
            market.outcome === "long"
              ? "var(--color-long)"
              : "var(--color-short)",
        }}
        className="mt-4 flex flex-1 flex-col rounded-xl bg-paper p-4"
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-ui text-sm font-semibold text-ink">
              {market.pair}
            </p>
            <p className="label mt-1.5 text-muted">{panel.kind}</p>
          </div>
          <div className="text-right">
            {/* The mark at the cut: the price you would be taking the side at. Not the
                close, which is the answer. */}
            <p className="nums font-ui text-lg leading-none font-semibold text-ink">
              ${money.format(market.mark)}
            </p>
            {/* The session's range, in the app's own shorthand. Safe to show: every setup
                makes its high and its low before the cut. */}
            <p className="mt-1.5 flex items-baseline justify-end gap-3">
              <span className="label text-muted">
                {panel.high}{" "}
                <span className="nums text-ink">{money.format(market.top)}</span>
              </span>
              <span className="label text-muted">
                {panel.low}{" "}
                <span className="nums text-ink">
                  {money.format(market.floor)}
                </span>
              </span>
            </p>
          </div>
        </div>

        <div ref={plot} className="relative mt-4 min-h-40 flex-1">
          <p className="sr-only">{panel.hidden}</p>

          <svg
            key={round}
            aria-hidden
            viewBox={`0 0 ${BOX} ${BOX}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              {/* Both fills fade to their own hue at zero alpha, never to
                  `transparent` — that is rgba(0,0,0,0) and drags the ramp through
                  black. */}
              {/* Full-bodied at the line and gone at the floor. Heavier than a sparkline
                  would be, because with twelve points the fill is half the drawing. */}
              <linearGradient id={`${uid}-past`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0"
                  stopColor="var(--color-ink)"
                  stopOpacity="0.14"
                />
                <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${uid}-tail`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0.34" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>

              <mask id={`${uid}-history`}>
                <rect
                  ref={history}
                  x="0"
                  y="0"
                  width={EDGE}
                  height={BOX}
                  fill="#fff"
                />
              </mask>
              <mask id={`${uid}-reveal`}>
                {/* No transform in the markup. This carried `scale(0 1)` to keep the answer
                    hidden before the tween touched it, and GSAP read that attribute as its
                    starting matrix — then applied `svgOrigin` on top of a baseline that
                    already had one, which slid the revealed band to the left-hand end of
                    the plot. The tail is kept out of the DOM instead, below. */}
                <rect
                  ref={tail}
                  x={EDGE}
                  y="0"
                  width={BOX - EDGE}
                  height={BOX}
                  fill="#fff"
                />
              </mask>
            </defs>

            {/* What happened, in a colour that says nothing about what happens next. */}
            <g mask={`url(#${uid}-history)`}>
              <path d={market.area} fill={`url(#${uid}-past)`} />
              <path
                d={market.line}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>

            {/* And the answer, which does not exist until there is one. Not hidden, not
                masked to nothing, not opacity zero — absent. It is the only guarantee that
                no arrangement of animation state can show the reader what happens next. */}
            {answered ? (
              <g mask={`url(#${uid}-reveal)`}>
                <path d={market.area} fill={`url(#${uid}-tail)`} />
                <path
                  d={market.line}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ) : null}
          </svg>

          {/* Where the lesson asks: a dashed edge and the mark sitting on it. */}
          <div
            aria-hidden
            className="absolute inset-y-0 border-l border-dashed border-line-strong"
            style={{ left: `${EDGE}%` }}
          />
          {/* Now: filled, and a size up on the rest, because it is the one vertex the
              reader is being asked about. */}
          <div
            aria-hidden
            className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
            style={{ left: `${EDGE}%`, top: `${cursor}%` }}
          />

          {/* The withheld quarter, marked rather than left blank. Dürer, because this is
              the one place on the plate that is allowed to be playful. */}
          <span
            aria-hidden
            className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-4xl text-sky-deep transition-opacity duration-300 ease-swift ${
              answered ? "opacity-0" : "opacity-60"
            }`}
            style={{ left: `${(EDGE + BOX) / 2}%` }}
          >
            ?
          </span>
        </div>

        {/* The question, then the verdict, in one row whose height is reserved for the
            button that only exists once the answer does. */}
        <div className="mt-4 flex min-h-11 items-center">
          {/* Keyed on the round and the answer, which is what makes the mascot pop again:
              a new key remounts it and its arrival animation replays. */}
          <MascotSays
            key={`${round}-${pick ?? "asking"}`}
            mood={answered ? (hit ? "right" : "wrong") : "asking"}
          >
            {answered ? (
              <>
                <span className="font-medium">
                  {hit ? panel.right : panel.wrong}
                </span>{" "}
                {market.outcome === "long" ? panel.rose : panel.fell}{" "}
                <span className="nums font-medium text-current">
                  {money.format(Math.abs(market.move) * 100)}%
                </span>
              </>
            ) : (
              panel.prompt
            )}
          </MascotSays>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(["long", "short"] as const).map((side) => {
            const correct = side === market.outcome;
            const chosen = side === pick;

            return (
              <button
                key={side}
                type="button"
                aria-disabled={answered}
                onClick={() => take(side)}
                /* `sky` while it waits, and the same `sky` on both, so the pair gives
                   nothing away — the colour that means something only arrives with the
                   answer. It is the accent rather than a pale surface step because the
                   card under it is white and a button has to look like an object on it.
                   Raised until it is pressed, and the side that did not happen drops
                   flat: the shadow is the difference between a control and a result. */
                className={`min-h-11 rounded-xl font-ui text-sm font-semibold transition-[transform,background-color] duration-150 ease-swift ${
                  chosen ? "ring-2 ring-ink ring-inset" : ""
                } ${
                  answered
                    ? correct
                      ? side === "long"
                        ? "bg-long text-paper shadow-raise"
                        : "bg-short text-paper shadow-raise"
                      : "bg-surface text-muted"
                    : "bg-sky text-ink shadow-raise hover:bg-sky-deep active:translate-y-[3px] active:shadow-none"
                }`}
              >
                {side === "long" ? panel.long : panel.short}
              </button>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
}
