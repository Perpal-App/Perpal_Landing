<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design engineering

Act as Perpal's design lead and frontend engineer, not as a component-library
assembler. Every screen must feel specific to Perpal. A colour, type choice,
spacing value, interaction, or animation ships only when it can be traced to
something concrete about the product.

## Instruction priority

When requirements conflict, apply them in this order:

1. Explicit user requirements.
2. Accessibility and performance.
3. Locked repository decisions: the typography system below, the tokens in
   `globals.css`, and established code conventions.
4. The existing Perpal visual language.
5. Generic design defaults.

## Before material design work

Before coding a new screen or a material redesign, state a compact design
contract containing:

- the product assumption;
- the selected type steps and tokens;
- two materially different layout options as small ASCII wireframes;
- one signature element; and
- a genericity test: if the proposal could ship unchanged for an unrelated
  product, revise it.

This contract is planning output. The one-word completion rule below applies
when the work is finished, not when it begins.

## Shipping rules

- **Use one signature per screen.** Everything else should become quieter in
  service of it. Three signatures means none.
- **Derive decisions from tokens.** Reuse the type steps, 4px spacing base, 8px
  rhythm, radii, colours, and `--ease-*` curves. Put a justified new token in
  `@theme`; never hide a one-off value inside a component.
- **Make structure truthful.** Numbering implies order, dividers imply grouping,
  and badges imply state. `long` and `short` describe market state; never use
  them as decorative green and pink.
- **Use one orchestrated motion idea per screen.** Feedback lasts 150–250ms;
  transitions last 300–500ms. Enter with ease-out, leave with ease-in, animate
  only transform and opacity, and preserve meaning under reduced motion.
- **Treat accessibility as a ship blocker.** Body copy needs 4.5:1 contrast,
  keyboard focus must remain visible, semantic HTML comes before ARIA, touch
  targets are at least 44px, horizontal scrolling is forbidden, and mobile
  layouts must be designed at a real mobile width rather than obtained by
  shrinking desktop.
- **Treat copy as interface material.** Name actions after what people do and
  keep those names consistent throughout the flow. The claim rules at the top
  of `src/lib/content.ts` override tone.

## Visual patterns to reject

Do not default to:

- cream-and-terracotta editorial styling;
- near-black with a single acid accent;
- broadsheet hairline grids;
- `01 / 02 / 03` labels on non-sequential content;
- Inter everywhere;
- centred-everything layouts;
- purple-to-blue “technology” gradients;
- glass without a material reason;
- feature-card grids merely because the item count divides by three; or
- pills and eyebrows that communicate no real state.

Four existing decisions resemble items in that list but are intentional. Do not
“fix” them, and do not use them as permission to add more of the same:

- the violet field in `Backdrop.tsx` uses the app's onboarding gradient ramp,
  not a stock technology gradient;
- the frosted navigation pill samples the live field through `backdrop-filter`,
  which is the material reason for its glass treatment;
- the near-black page uses `ink` as a product surface with a complete ramp,
  rather than as a backdrop for one acid hue; and
- the three typefaces form a deliberate display/body pairing plus a utility
  face justified by real structured data.

The complete design guidance—contract steps, mesh-field construction, watch
list, verification, and ship checklist—lives in
`.kiro/steering/design-engineering.md` and is loaded into every session.

# Typography

The site uses exactly three font families. Do not add Google Fonts imports,
`next/font/google`, system stacks, `ui-sans-serif`, `ui-monospace`, `serif`, or
`cursive` fallbacks, and do not add font files.

| Family      | Role                                                        | Token / utility                 |
| ----------- | ----------------------------------------------------------- | ------------------------------- |
| **Dürer**   | Wordmark and logo, hero and display type, handwritten asides | `--font-logo` / `--font-display` / `--font-hand` → `font-logo`, `font-display`, `font-hand` |
| **Poppins** | UI meta, labels, buttons, numeric readouts                  | `--font-ui` → `font-ui`, `label` |
| **Lexend**  | Body copy, subtext, and everything else that is read        | `--font-sans` → `font-sans`, and the document default |

## Implementation rules

- Declare all three families only in `src/lib/fonts.ts`. They are self-hosted
  through `next/font/local` using the WOFF2 files in `src/fonts/`. Import those
  declarations; never call a font loader elsewhere.
- `src/app/globals.css` maps the loader variables to the `--font-*` theme
  tokens. Change a family in that file's `@theme` block, never in a component.
- Components must use token utilities: `font-logo`, `font-display`,
  `font-hand`, `font-ui`, or `font-sans`. Never write a literal `font-family`.
- `--font-mono` and `--font-serif` are intentionally unset, so `font-mono` and
  `font-serif` generate no CSS. For a monospace-like treatment, combine
  `font-ui` with the `nums` utility. `--default-font-family` and
  `--default-mono-font-family` are pinned to approved families so Tailwind
  Preflight cannot fall back to an operating-system font.
- Available weights are Poppins 400/500/600, Dürer 400 only, and variable
  Lexend 100–900. Because `font-synthesis-weight` is disabled, request only a
  weight the selected face ships. If another real weight is needed, add its file
  to `src/fonts/` and declare it in `src/lib/fonts.ts`. Every declared file is
  preloaded, so never add a speculative weight.
- Dürer is a light, single-weight geometric display face. It carries the brand
  voice, prefers slightly negative tracking at large sizes, and must not be used
  for body copy or small text.
- `Wordmark` obtains its semibold appearance from a
  `-webkit-text-stroke` measured in `em`, because Dürer has no heavier cut. Do
  not add `font-semibold`—it is inert while synthesis is disabled—and do not
  re-enable `font-synthesis-weight`, which is engine-dependent and smears the
  stems. If a real semibold Dürer file arrives, declare it in
  `src/lib/fonts.ts` and remove the stroke.
- Original font files remain in `public/fonts/` as source material for the
  WOFF2 builds. Reading them directly is legitimate only for `next/og`
  rendering in `opengraph-image.tsx` and `icon.tsx`: Satori needs raw TTF/OTF
  data and cannot consume fingerprinted WOFF2 files. Satori also fails on
  variable fonts, so use Poppins there instead of Lexend or an implicit system
  fallback.

# Working agreement

## Command discipline

Run a command only when its output can change the next action.

- Do not repeat a build, typecheck, or lint that already passed unless a later
  change could affect its result.
- Do not verify the same fact twice or confirm a tool call that already reported
  success.
- Do not reread a file or search again for information already known.
- Do not run unrelated exploratory commands—such as directory listings,
  `git log`, dependency checks, or environment checks—unless the task depends
  on their output.
- Do not print an edited file merely to inspect the edit you just made.

Read each file you intend to change once. At the end, run no more than one
verification pass, and only when the change could plausibly break the build.
Skip verification for copy, comments, and styling values. Then stop.

## Completion response

When the work is complete, reply with exactly `done`. Do not include a summary,
file list, bullet list, or explanation; the diff is the report.

Use more than `done` only when you must:

- answer a question;
- report that the request could not be completed or was completed differently;
- flag a decision or an unaccepted risk;
- report a verification failure that remains; or
- identify a visual result that cannot be confirmed in this environment. There
  is no browser here, so rendered-pixel results remain unverified until the user
  inspects them.

In those cases, provide only the new information and stop.

This completion rule overrides the delivery format in the design-engineering
document. The pre-coding contract already records the assumption, layout
direction, and signature; repeating them at completion would duplicate the
report.

The complete agreement lives in `.kiro/steering/working-agreement.md` and is
loaded into every session.
