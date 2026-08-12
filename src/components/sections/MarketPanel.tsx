"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { how } from "@/lib/content";
import { gsap } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/scroll";
import { useIsomorphicLayoutEffect } from "@/components/motion/use-isomorphic-layout-effect";

/**
 * A market you can read without signing anything.
 *
 * The panel is the argument, not an illustration of it. Its heading says live prices
 * are open to look at with nothing to sign first, and the way to demonstrate that on
 * a web page is to hand the reader a market and no Buy button. Everything here is
 * inspection: pick one of the three perps Perpal trades, run along the series, read
 * the price at any point. Nothing commits, because on this page nothing can.
 *
 * That is also why it is three markets and not six, and why the contract line reads
 * "Perpetual" with no multiplier next to it. The app's own screen shows `50x` there;
 * a leverage figure in the page's own UI would be a claim, and the copy rules forbid
 * one. The word is a fact.
 *
 * The prices are invented and the panel says so underneath. What is not invented is
 * the direction: `long` and `short` are this repo's semantic market tokens and this
 * is their first use, so the rule they establish is that they encode which way a
 * series went and nothing else. A series that closes above its open is `long` — the
 * line, the fill and the change all take the same colour from one `color` on the
 * wrapper, so there is no way for the three of them to disagree.
 *
 * Three details worth knowing before editing:
 *
 * The series is arithmetic, not random. `Math.random()` would give the server and the
 * client two different paths and React would throw the panel away on hydration, so a
 * Lehmer generator runs from a fixed seed at module scope.
 *
 * The plot is drawn in a 0-100 box with `preserveAspectRatio="none"`, so it stretches
 * to whatever height the panel has left after the copy above it — which is how this
 * column matches the height of the step thread beside it without a magic number.
 * `vector-effect="non-scaling-stroke"` is what keeps the line 2px through that
 * stretch instead of scaling into a wedge. Anything that must not distort — the
 * crosshair, the open line, the readout — is a DOM element positioned in percentages
 * over the same box rather than a shape inside it.
 *
 * Touch is left alone. Tracking a finger here would mean claiming the gesture that
 * scrolls the page, so pointer tracking is mouse and pen only; a touch reader gets
 * the last price, the change and the range as text, and a keyboard reader gets the
 * whole series through the slider.
 */

/** A day of 15-minute closes, which is the window the readout names. */
const POINTS = 96;

/** The drawing box. Inset top and bottom so a peak never touches the frame. */
const BOX = 100;
const INSET = 8;

type Spec = {
  id: string;
  pair: string;
  /** Where the window opens, and how far it travels across it, in percent. */
  open: number;
  drift: number;
  /** Step size as a percentage of the open, which is what makes SOL choppier. */
  vol: number;
  seed: number;
};

/* Levels sit in the region the app's own screen shows, and the three do not all go the
   same way — a panel where every market is green is a mood, not a market.

   `vol` is set against `drift` rather than picked for looks: at these values the walk's
   cumulative noise is a little larger than the trend it is walking along, which is what
   puts a real pullback in the middle of a rising day instead of a clean ramp. Drop it
   and every series becomes a diagonal; raise it and the drift stops deciding the sign.
   The seeds are the three whose shapes carry a turn rather than one direction. */
const SPECS: readonly Spec[] = [
  { id: "BTC", pair: "BTC-USD", open: 62_480, drift: 1.7, vol: 0.74, seed: 23 },
  { id: "ETH", pair: "ETH-USD", open: 3_104, drift: -1.4, vol: 0.63, seed: 37 },
  { id: "SOL", pair: "SOL-USD", open: 146.4, drift: 3.2, vol: 1.5, seed: 19 },
];

function walk(spec: Spec) {
  let state = (spec.seed * 16_807) % 2_147_483_647;
  const noise = () => {
    state = (state * 48_271) % 2_147_483_647;
    return state / 2_147_483_647 - 0.5;
  };

  const values: number[] = [];
  let level = spec.open;
  for (let index = 0; index < POINTS; index += 1) {
    level +=
      (spec.open * spec.drift) / 100 / POINTS +
      spec.open * (spec.vol / 100) * noise();
    values.push(Math.round(level * 100) / 100);
  }
  return values;
}

const MARKETS = SPECS.map((spec) => {
  const values = walk(spec);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = high - low || 1;

  /** Vertical position of a price, as a percentage of the box. */
  const at = (value: number) =>
    INSET + (1 - (value - low) / span) * (BOX - INSET * 2);

  const line = values
    .map(
      (value, index) =>
        `${index ? "L" : "M"}${((index / (POINTS - 1)) * BOX).toFixed(2)} ${at(
          value,
        ).toFixed(2)}`,
    )
    .join(" ");

  const change = (values[POINTS - 1] - values[0]) / values[0];

  return {
    ...spec,
    values,
    low,
    high,
    at,
    line,
    /* Closed down to the floor of the box rather than to the lowest close, so the
       fill reads as a body of colour under the line and not as a ribbon. */
    area: `${line} L${BOX} ${BOX} L0 ${BOX} Z`,
    change,
    rising: change >= 0,
  };
});

const money = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: "always",
});

const { panel } = how.markets;

export function MarketPanel() {
  /* Stripped down to word characters, because two of these ids end up inside
     `url(#…)` references for the gradient and the mask. React's generated ids carry
     punctuation that a fragment reference should not have to survive. */
  const uid = useId().replace(/[^\w-]/g, "");
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState<number | null>(null);

  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const plot = useRef<HTMLDivElement>(null);
  const wipe = useRef<SVGRectElement>(null);
  const arrived = useRef(false);

  const market = MARKETS[active];
  const index = cursor ?? POINTS - 1;
  const reading = market.values[index];

  /* The line draws itself once on arrival, and again — quicker, and without waiting
     for the scroll position — whenever the market changes. One gesture doing two
     jobs: it introduces the series, and it acknowledges the switch.

     The wipe is a rect inside a mask, so the reveal is a transform on one element
     rather than a stroke-dash the compositor has to re-rasterise. `svgOrigin` is in
     user space, which spares GSAP a `getBBox()` on an element the renderer never
     lays out. */
  useIsomorphicLayoutEffect(() => {
    const rect = wipe.current;
    if (!rect) return;

    if (prefersReducedMotion()) {
      gsap.set(rect, { scaleX: 1 });
      return;
    }

    const first = !arrived.current;
    arrived.current = true;

    const context = gsap.context(() => {
      gsap.fromTo(
        rect,
        { scaleX: 0 },
        {
          scaleX: 1,
          svgOrigin: `0 ${BOX / 2}`,
          duration: first ? 0.9 : 0.36,
          ease: "power3.out",
          scrollTrigger: first
            ? { trigger: plot.current, start: "top 88%", once: true }
            : undefined,
        },
      );
    });

    return () => context.revert();
  }, [active]);

  function selectMarket(next: number) {
    setActive(next);
    setCursor(null);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, from: number) {
    const moves: Record<string, number> = {
      ArrowRight: from + 1,
      ArrowLeft: from - 1,
      Home: 0,
      End: MARKETS.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;

    event.preventDefault();
    const wrapped = (next + MARKETS.length) % MARKETS.length;
    selectMarket(wrapped);
    tabs.current[wrapped]?.focus();
  }

  function track(event: PointerEvent<HTMLDivElement>) {
    /* Mouse and pen only — see the note at the top of the file. */
    if (event.pointerType === "touch") return;
    const box = plot.current?.getBoundingClientRect();
    if (!box) return;

    const ratio = (event.clientX - box.left) / box.width;
    setCursor(
      Math.min(POINTS - 1, Math.max(0, Math.round(ratio * (POINTS - 1)))),
    );
  }

  function onPlotKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: POINTS - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;

    event.preventDefault();
    setCursor(Math.min(POINTS - 1, Math.max(0, next)));
  }

  const x = (index / (POINTS - 1)) * 100;
  const y = market.at(reading);

  return (
    <div className="flex flex-1 flex-col">
      <div
        role="tablist"
        aria-label={panel.tablist}
        className="grid grid-cols-3 gap-2"
      >
        {MARKETS.map((entry, position) => {
          const selected = position === active;
          return (
            <button
              key={entry.id}
              ref={(node) => {
                tabs.current[position] = node;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${entry.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectMarket(position)}
              onKeyDown={(event) => onTabKeyDown(event, position)}
              className={`flex min-h-11 flex-col items-start justify-center gap-0.5 rounded-xl px-3 py-2 transition-colors duration-200 ease-swift ${
                selected
                  ? "bg-paper ring-1 ring-line-strong"
                  : "bg-paper/55 hover:bg-paper/85"
              }`}
            >
              <span
                className={`font-ui text-sm font-semibold ${
                  selected ? "text-ink" : "text-muted"
                }`}
              >
                {entry.id}
              </span>
              <span
                className={`nums font-ui text-xs font-medium ${
                  entry.rising ? "text-long" : "text-short"
                }`}
              >
                {percent.format(entry.change * 100)}%
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${market.id}`}
        /* One `color` for the whole panel: the stroke, the fill's gradient and the
           crosshair dot all read it, so the series cannot end up drawn in one
           direction's colour and labelled in the other's. */
        style={{
          color: market.rising ? "var(--color-long)" : "var(--color-short)",
        }}
        className="mt-2 flex flex-1 flex-col rounded-xl bg-paper p-4"
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-ui text-sm font-semibold text-ink">
              {market.pair}
            </p>
            <p className="label mt-1.5 text-muted">{panel.kind}</p>
          </div>
          <div className="text-right">
            <p className="nums font-ui text-lg leading-none font-semibold text-ink">
              ${money.format(market.values[POINTS - 1])}
            </p>
            <p className="mt-1.5 flex items-center justify-end gap-2">
              <span className="label text-muted">{panel.window}</span>
              <span className="nums font-ui text-xs font-medium text-current">
                {percent.format(market.change * 100)}%
              </span>
            </p>
          </div>
        </div>

        <div
          ref={plot}
          role="slider"
          tabIndex={0}
          aria-label={panel.inspect}
          aria-valuemin={0}
          aria-valuemax={POINTS - 1}
          aria-valuenow={index}
          aria-valuetext={`$${money.format(reading)}`}
          onPointerMove={track}
          onPointerLeave={() => setCursor(null)}
          onKeyDown={onPlotKeyDown}
          className="relative mt-4 min-h-40 flex-1"
        >
          {/* Where the window opened. The change above is measured from this line,
              so it is the one horizontal rule in the plot that means something. */}
          <div
            aria-hidden
            className="absolute inset-x-0 border-t border-dashed border-line-strong"
            style={{ top: `${market.at(market.values[0])}%` }}
          />

          <svg
            aria-hidden
            viewBox={`0 0 ${BOX} ${BOX}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id={`${uid}-fill`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {/* Fading to the same hue at zero alpha, never to `transparent`:
                    `transparent` is rgba(0,0,0,0) and drags the ramp through black. */}
                <stop
                  offset="0"
                  stopColor="currentColor"
                  stopOpacity="0.18"
                />
                <stop
                  offset="1"
                  stopColor="currentColor"
                  stopOpacity="0"
                />
              </linearGradient>
              <mask id={`${uid}-wipe`}>
                <rect
                  ref={wipe}
                  x="0"
                  y="0"
                  width={BOX}
                  height={BOX}
                  fill="#fff"
                />
              </mask>
            </defs>

            {[25, 50, 75].map((line) => (
              <line
                key={line}
                x1="0"
                x2={BOX}
                y1={line}
                y2={line}
                stroke="var(--color-line)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <g mask={`url(#${uid}-wipe)`}>
              <path d={market.area} fill={`url(#${uid}-fill)`} />
              <path
                d={market.line}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>

          {cursor !== null ? (
            <>
              <div
                aria-hidden
                className="absolute inset-y-0 w-px bg-ink/25"
                style={{ left: `${x}%` }}
              />
              <div
                aria-hidden
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-current"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
              <p
                aria-hidden
                /* Pinned to the top of the plot and clamped away from both edges, so
                   it never covers the line it is reporting on or leaves the panel. */
                className="nums absolute top-0 -translate-x-1/2 rounded-md bg-ink px-2 py-1 font-ui text-[0.6875rem] leading-none font-medium text-paper"
                style={{ left: `${Math.min(Math.max(x, 12), 88)}%` }}
              >
                ${money.format(reading)}
              </p>
            </>
          ) : null}
        </div>

        <p className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
          <span className="label text-muted">{panel.range}</span>
          <span className="nums font-ui text-xs font-medium text-ink">
            ${money.format(market.low)} – ${money.format(market.high)}
          </span>
        </p>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{panel.note}</p>
    </div>
  );
}
