"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { cta, waitlist } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { Mark } from "@/components/ui/Logo";
import { Mascot } from "@/components/ui/Mascot";

type Stage = "closed" | "open" | "done";
type Confirmation = (typeof waitlist)["success" | "alreadyRegistered"];

/**
 * The control's width at each stage.
 *
 * Written down because a CSS width transition needs two concrete values — `auto`
 * is not interpolable, and `interpolate-size` is scoped to `details` in
 * globals.css rather than granted to the document. They live together here rather
 * than beside three different class strings so the morph can be read in one place.
 *
 * `w-44` is 176px, which holds "Join Waitlist" at `text-base` semibold inside the
 * md button's `px-7`, and holds the check with "You're in" and room to spare. Both
 * fixed states clear a 320px viewport, where `--spacing-gutter` leaves 280px.
 *
 * The open state fills a stable parent capped at 26rem below. Keeping the cap on
 * the parent is what makes the transition honest on desktop: if `width: 100%`
 * targets the full hero while `max-width: 26rem` lands on the moving capsule,
 * the cap is reached in the first few frames and the expansion looks instant.
 */
const WIDTH: Record<Stage, string> = {
  closed: "w-44",
  open: "w-full",
  /* Wider than the trigger, because the mascot rides inside the capsule now:
     16px check + 8 + roughly 78px of "You're in" + 8 + a 36px mascot is 146px,
     and `px-5` either side takes it to 186px. `w-52` is 208px, which leaves the
     group centred rather than wedged. */
  done: "w-52",
};

/**
 * Every stage occupies the same box.
 *
 * Absolute, so the three cross-fade in place and the control's height never moves
 * — a hero whose only action changed height would shift the composition under the
 * reader's cursor mid-click. The height comes from `min-h-14` on the container.
 */
const LAYER =
  "absolute inset-0 flex items-center transition-opacity duration-200 ease-swift";

/**
 * The one glass recipe, written once and shared by every surface in this control.
 *
 * A light translucent fill and a small blur, and deliberately nothing more — no
 * saturate, no border. Stacking is what differentiates the parts rather than
 * separate treatments: the capsule puts this over the gradient field, the inner
 * field puts it over the capsule, and two translucent whites compound to a lighter
 * panel than either. That is the inset the field reads as, and it costs no border
 * to draw.
 *
 * `sm` is 8px. It is a third of the `xl` this started at, because the point of the
 * material here is transparency rather than frost — at 24px the field behind it
 * stopped being legible as a field and became a grey wash.
 */
const GLASS = "bg-paper/45 backdrop-blur-sm";
const JOINED_STORAGE_KEY = "perpal.waitlist.joined.v1";
const VALIDATION_FEEDBACK_MS = 420;

/** The glyph that lands where the label was. Drawn, because an emoji is not an icon. */
function Check() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0">
      <path
        d="M3.2 8.6 6.3 11.7 12.8 4.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatCooldown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function isWaitlistCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

async function readWaitlistCount(signal?: AbortSignal): Promise<number | null> {
  const response = await fetch("/api/waitlist", {
    cache: "no-store",
    signal,
  });
  const result: unknown = await response.json();
  const count =
    typeof result === "object" && result !== null && "count" in result
      ? result.count
      : null;

  return isWaitlistCount(count) ? count : null;
}

/**
 * The hero's action, in three states of one object.
 *
 * The button does not open a form so much as become one: it widens in place, the
 * field appears inside it with its submit inset at the right end, and on success
 * it closes back to a key carrying a check. One control the whole way through,
 * which is why the check reads as the resolution of the button rather than as a
 * new element arriving.
 *
 * ── Material ─────────────────────────────────────────────────────────────────
 *
 * Glass throughout, and earned for the reason the nav pill's is: this sits
 * directly on the live gradient field and samples it with `backdrop-filter`
 * rather than imitating it with a flat translucent wash.
 *
 * Every surface takes one recipe — `GLASS`, defined once above — at 8px of blur:
 * the capsule over the field, the inner field over the capsule, and the same blur
 * pushed onto both buttons so nothing in the control frosts by a different amount.
 * The parts are told apart by stacking rather than by separate treatments, which
 * is what lets the field read as inset without a border to draw it.
 *
 * `shadow-pill` is the nav's own token for exactly this object: glass floating
 * over the weather. It is the only thing here that is not blur or fill, and it is
 * what gives the capsule a body.
 *
 * The two actions keep the hero button's fill: `variant="glass"`, the same
 * `grape-deep/90` lens with the same `shadow-bulge` curvature — lit top edge,
 * violet-tinted inset shade along the bottom, soft cast below. Only the blur is
 * overridden. They stay the variant rather than a lookalike, so they cannot drift
 * from the button they are meant to match, and they stay deep rather than pale
 * because this is the page's one action: a light glass pill would sit at the same
 * weight as the field it opens.
 *
 * One honest note on nesting: the submit's own blur samples the capsule's fill
 * rather than the field, so its glass contributes little there and the bulge does
 * the work.
 *
 * ── The active border ────────────────────────────────────────────────────────
 *
 * One hairline, `ring-1`, and only its colour changes: transparent at rest,
 * `grape` while the field has focus, `ink` when the last submission was rejected.
 * There is no resting border at all — the blur and the fill already separate the
 * capsule from the field behind it, so the ring exists only to say something.
 *
 * It replaces the document's 2px `:focus-visible` outline on the input alone,
 * which at its 3px offset would have drawn outside a field that is itself inset
 * inside the capsule and crossed the capsule's edge.
 *
 * It is a replacement and not a removal: `grape` measures about 5:1 on paper,
 * comfortably past the 3:1 a meaningful UI graphic needs, and it marks the whole
 * control rather than a box inside it. The submit keeps the document ring
 * untouched, so tabbing from the field to the button moves a visible indicator
 * from the capsule to the button.
 *
 * Focus is tracked in React rather than through `:focus-visible`, which also
 * makes the ring appear on a pointer focus. For a text field that is correct — a
 * field the reader has clicked into is focused, and should look it.
 *
 * ── Motion ───────────────────────────────────────────────────────────────────
 *
 * Width, radius, fill and ring on the container, 380ms, `--ease-swift`, and no
 * delay anywhere: the box starts moving on the frame the click lands. The layers
 * cross-fade over 200ms inside that, so the field is legible before the capsule
 * has finished opening rather than after.
 *
 * A CSS transition rather than a GSAP tween, deliberately. This is a discrete
 * state change on one small element, it needs no timeline and no scroll position,
 * and the reduced-motion block in globals.css already collapses every transition
 * on the page — so reduced motion gets the same three states with no travel, for
 * free, and without this component knowing anything about it.
 *
 * The cost worth naming: a `backdrop-filter` layer is rasterised once while it is
 * still and re-composited every frame its box changes size, and this box changes
 * size. It is one small element for 380ms, which is the price of the material.
 *
 * ── Confetti ─────────────────────────────────────────────────────────────────
 *
 * `Confetti` has no JavaScript and runs its animation on mount, so mounting it is
 * the trigger and it cannot fire twice. Its region is centred around the capsule
 * and capped at 20rem, wide enough for the pieces to separate without turning the
 * whole hero into the celebration surface.
 *
 * Under reduced motion the global block lands the fall on its final frame, which
 * is off-screen and transparent, so the celebration simply does not happen. That
 * is the right behaviour for something that is only a celebration.
 */
export function WaitlistField() {
  const [stage, setStage] = useState<Stage>("closed");
  const [celebrate, setCelebrate] = useState(false);
  const [confirmation, setConfirmation] =
    useState<Confirmation>(waitlist.success);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [joinedCount, setJoinedCount] = useState<number | null>(null);
  const [retryUntil, setRetryUntil] = useState<number | null>(null);
  const [retryRemaining, setRetryRemaining] = useState<number | null>(null);
  const field = useRef<HTMLInputElement>(null);
  const fieldId = useId();
  const errorId = `${fieldId}-error`;

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(JOINED_STORAGE_KEY);
      if (stored === null) return;

      const joinedAt = Number(stored);
      if (
        Number.isFinite(joinedAt) &&
        joinedAt > 0 &&
        joinedAt <= Date.now()
      ) {
        setConfirmation(waitlist.alreadyRegistered);
        setStage("done");
        return;
      }

      window.localStorage.removeItem(JOINED_STORAGE_KEY);
    } catch {
      // Storage can be unavailable; MongoDB remains the registration authority.
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void readWaitlistCount(controller.signal)
      .then((count) => count !== null && setJoinedCount(count))
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (retryUntil === null) return;

    const update = () => {
      const remaining = Math.max(0, Math.ceil((retryUntil - Date.now()) / 1_000));
      setRetryRemaining(remaining || null);
      if (remaining === 0) setRetryUntil(null);
    };

    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, [retryUntil]);

  const startCooldown = (seconds: number) => {
    const duration = Math.max(1, Math.ceil(seconds));
    setRetryRemaining(duration);
    setRetryUntil(Date.now() + duration * 1_000);
  };

  const open = () => {
    setStage("open");
    /* One frame, because an `inert` element cannot take focus and the stage has
       to commit before the field is no longer inert. */
    requestAnimationFrame(() => field.current?.focus());
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const input = field.current;
    if (!input || submitting) return;

    const email = input.value.trim().normalize("NFKC").toLowerCase();
    input.value = email;

    /* Validation reads the platform's own answer and then says it in the
       product's words. `type="email"` and `required` already encode what a valid
       address is, so `validity` is consulted rather than a pattern invented here
       — but `reportValidity` is not called, because its bubble would sit over the
       capsule in the browser's wording and the browser's typeface. */
    const { tooLong, valueMissing, typeMismatch } = input.validity;
    if (valueMissing || typeMismatch || tooLong) {
      setError(valueMissing ? waitlist.empty : waitlist.invalid);
      input.focus();
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const [response] = await Promise.all([
        fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }),
        new Promise<void>((resolve) =>
          window.setTimeout(resolve, VALIDATION_FEEDBACK_MS),
        ),
      ]);
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        status?: "registered" | "already_registered";
        retryAfterSeconds?: number;
        count?: number | null;
      } | null;

      if (result?.ok) {
        try {
          window.localStorage.setItem(JOINED_STORAGE_KEY, String(Date.now()));
        } catch {
          // A blocked browser store must not turn a persisted registration into failure.
        }
        const alreadyRegistered = result.status === "already_registered";
        if (isWaitlistCount(result.count)) {
          setJoinedCount(result.count);
        } else if (!alreadyRegistered) {
          setJoinedCount((current) =>
            current === null ? current : current + 1,
          );
        }
        setConfirmation(
          alreadyRegistered ? waitlist.alreadyRegistered : waitlist.success,
        );
        setCelebrate(!alreadyRegistered);
        setStage("done");
        return;
      }

      if (
        result?.error === "rate_limited" &&
        typeof result.retryAfterSeconds === "number" &&
        Number.isFinite(result.retryAfterSeconds)
      ) {
        setError(null);
        startCooldown(result.retryAfterSeconds);
        return;
      }

      setError(
        result?.error === "invalid_email"
          ? waitlist.invalid
          : waitlist.unavailable,
      );
    } catch {
      setError(waitlist.unavailable);
    } finally {
      setSubmitting(false);
    }
  };

  /* Nothing at rest, and a hairline only when there is something to say. Focus
     outranks rejection, so a field the reader has come back to correct shows the
     focus colour rather than the error one.

     The resting border is gone because the capsule does not need drawing — the
     blur and the fill already separate it from the field behind it. What cannot go
     with it is the focus indicator: this is the only interactive control in the
     hero, and the document's own ring was already handed over to this hairline. So
     it stays, and only its resting state is transparent. */
  const ring = focused
    ? "ring-grape"
    : error
      ? "ring-ink"
      : "ring-transparent";

  /* Fixed-height from the start. Validation copy replaces an invisible line in
     this slot instead of being inserted below the control, so a rejected submit
     changes pixels but not geometry — the hero, the capsule and the pointer all
     stay exactly where they were. */
  const cooldown = retryRemaining
    ? `${waitlist.retry} ${formatCooldown(retryRemaining)}`
    : null;
  const countCopy =
    joinedCount === null ? null : waitlist.count(joinedCount);
  const count = countCopy
    ? `${countCopy.lead} ${countCopy.tail}`
    : null;
  const message = cooldown ?? error ?? count ?? "\u00a0";
  const messageVisible = Boolean(cooldown || error || count);

  return (
    <div className="relative isolate flex w-full flex-col items-center">
      {/* Mounted only on success, and behind the control in paint order so no
          piece lands on top of the words that say it worked. `isolate` on the root
          is what keeps that `-z-10` inside this component — without it the burst
          would drop into the hero's own stacking context, where the gradient field
          also sits at a negative index.

          The region is a wrapper rather than a `className` on `Confetti`, because
          `Confetti` sets `inset-0` itself and `tailwind-merge` does not treat a
          later `inset-x` as replacing an earlier `inset` — both would survive and
          the winner would be decided by stylesheet order rather than by intent.
          Given its own box to fill, it fills this one.

          Pieces are placed by percentage inside this box, so its capped width is
          the burst's visible width on desktop while `w-full` keeps it inside the
          hero gutters on a phone. */}
      {stage === "done" && celebrate && (
        <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[26rem] w-full max-w-80 -translate-x-1/2">
          <Confetti />
        </div>
      )}

      <div className="flex w-full max-w-[26rem] justify-center">
        <div
          className={cn(
            "relative min-h-14 ring-1",
            "transition-[width,background-color,box-shadow,border-radius] duration-[380ms] ease-swift",
            /* The capsule's own surface exists only once it has opened. Collapsed,
               the glass button inside is the entire object, and a second frosted
               plate behind it would double the blur for nothing. */
            stage === "closed"
              ? "rounded-xl"
              : cn("rounded-2xl shadow-pill", GLASS),
            stage === "closed" ? "ring-transparent" : ring,
            WIDTH[stage],
            stage === "done" &&
              confirmation === waitlist.alreadyRegistered &&
              "w-60 sm:w-64",
          )}
        >
          <div
            inert={stage !== "closed"}
            className={cn(
              LAYER,
              stage === "closed" ? "opacity-100" : "opacity-0",
            )}
          >
            {/* `backdrop-blur-sm` overrides the variant's `xl` so the trigger, the
                capsule and the submit all blur by the same 8px. The fill stays the
                variant's `grape-deep/90`: this is the page's only action, and a
                pale glass pill would put it at the same weight as the field it
                opens. Same material, same blur, different depth. */}
            <Button
              variant="glass"
              onClick={open}
              className="h-14 w-full backdrop-blur-sm"
            >
              {cta.label}
            </Button>
          </div>

          {/* `p-1` is what insets the submit: the capsule is 56px, so 4px each
              side leaves the button its own 48px — past the 44px touch floor and
              the same height the hero button has always been. */}
          <form
            onSubmit={submit}
            noValidate
            inert={stage !== "open"}
            aria-busy={submitting}
            className={cn(
              LAYER,
              "gap-1 p-1",
              stage === "open" ? "opacity-100" : "opacity-0",
            )}
          >
            <label htmlFor={fieldId} className="sr-only">
              {waitlist.label}
            </label>
            <input
              ref={field}
              id={fieldId}
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              spellCheck={false}
              readOnly={submitting || retryRemaining !== null}
              placeholder={waitlist.placeholder}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={() => error && setError(null)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              /* Poppins, because a form control's value belongs with the labels,
                 buttons and readouts rather than with the prose — the error
                 sentence below is the part that is read, and it stays Lexend.

                 `muted`, not `faint`, for the placeholder. `faint` is the token's
                 nominated placeholder tone but measures 4.06:1 on solid paper, and
                 this field is translucent over a gradient that moves, so that
                 number is not one this component can promise. `muted` holds 8:1 on
                 paper and has the headroom the glass costs.

                 The document's ring is suppressed here and replaced by the
                 capsule's hairline — see the note on the active border above.

                 The two autofill variants are what keep the typeface and the glass
                 when a browser fills this in, which for an email field is the
                 likeliest way it gets filled at all. Chrome paints an autofilled
                 background with a UA `!important` rule that no class can outrank,
                 so the long `background-color` transition is the standard way to
                 defer that paint indefinitely and leave the glass showing;
                 `-webkit-text-fill-color` is separately required because the same
                 rule overrides `color`. Without the pair, a filled address arrives
                 on opaque yellow-white in the engine's own colour. */
              className={cn(
                "h-12 min-w-0 flex-1 rounded-xl px-4 font-ui text-base text-ink placeholder:text-muted focus-visible:outline-none",
                GLASS,
                "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-ink)] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
              )}
            />
            {/* Tighter horizontal padding than the md size until `sm`, which hands
                the field back about 16px on the narrowest screens without touching
                the button's height — so the 48px target is untouched and only the
                dead space around a four-letter word gives way. */}
            <Button
              type="submit"
              variant="glass"
              magnetic={false}
              disabled={submitting || retryRemaining !== null}
              aria-label={submitting ? waitlist.checking : undefined}
              className="shrink-0 px-5 backdrop-blur-sm sm:px-7"
            >
              <span className="grid place-items-center">
                <span
                  className={cn(
                    "col-start-1 row-start-1 transition-[opacity,transform] duration-200 ease-swift",
                    submitting
                      ? "scale-75 opacity-0"
                      : "scale-100 opacity-100",
                  )}
                >
                  {waitlist.submit}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "col-start-1 row-start-1 size-5 transition-[opacity,transform] duration-200 ease-swift",
                    submitting
                      ? "scale-100 opacity-100"
                      : "scale-75 opacity-0",
                  )}
                >
                  <Mark className={cn("size-5", submitting && "animate-spin")} />
                </span>
              </span>
            </Button>
          </form>

          <div
            inert={stage !== "done"}
            className={cn(
              LAYER,
              "justify-center gap-2 px-4 font-ui text-sm font-semibold text-ink sm:px-5 sm:text-base",
              stage === "done" ? "opacity-100" : "opacity-0",
            )}
          >
            <Check />
            <span role="status" className="whitespace-nowrap">
              {confirmation}
            </span>

            {/* Inside the capsule, riding with the words rather than standing next
                to them — so the whole success state is one object, the way the
                trigger and the field before it were.

                Mounted on the stage rather than rendered with the layer, and that
                is load-bearing: the mascot's pop is a CSS animation on mount, so a
                copy that had been sitting here invisibly since page load would
                have spent its animation before anyone could see it. `cheering` is
                the mood with the sparks, and this is the one moment on the
                marketing page that has earned them. */}
            {stage === "done" && <Mascot mood="cheering" />}
          </div>
        </div>
      </div>

      {/* Always in the layout, never inserted on demand. The slot holds a
          non-breaking space when there is nothing to say and reserves one line of
          `text-sm`, so a rejected submit swaps the text inside a row that was
          already there. That is the whole of not shifting the layout: mounting a
          paragraph on error would move the capsule — and the pointer aimed at it —
          upward by its height at the exact moment the reader is trying to correct
          something. It stays a live region across the swap, so the message is
          announced rather than merely appearing.

          Lexend, from the document default, because this is the one part of the
          control that is read as a sentence rather than operated. `muted` holds
          8:1, and deliberately not `short`: that token means a market direction,
          and a mistyped address is not a position going against you. The sentence
          carries the meaning; the capsule's hairline only points at it. */}
      <p
        id={errorId}
        role={cooldown ? "timer" : error ? "alert" : "status"}
        className={cn(
          /* Two lines of reserved height on a phone, one from `sm` up. The longer
             message is 41 characters, which at `text-sm` needs about 266px and so
             wraps inside the 280px a 320px viewport leaves — and a slot that
             reserves one line while holding two is the layout shift this slot
             exists to prevent, arriving by the back door. */
          "mt-3 min-h-10 text-center text-sm text-muted transition-opacity duration-200 ease-swift sm:min-h-5",
          messageVisible ? "opacity-100" : "opacity-0",
        )}
      >
        {countCopy && !cooldown && !error ? (
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2">
            <span className="inline-flex items-center gap-1">
              <span>{countCopy.lead}</span>
              <span aria-hidden className="inline-flex -space-x-1">
                <Mascot mood="right" className="h-5 w-4" />
                <Mascot
                  mood="cheering"
                  className="h-5 w-4 [--color-lilac:var(--color-mascot-yellow)]"
                />
                <Mascot
                  mood="asking"
                  className="h-5 w-4 [--color-lilac:var(--color-mascot-orange)]"
                />
              </span>
            </span>
            <span>{countCopy.tail}</span>
          </span>
        ) : (
          message
        )}
      </p>
    </div>
  );
}
