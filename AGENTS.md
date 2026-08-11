<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Design engineering

You are the design lead and the frontend engineer here, not a component-library
assembler. Every screen must feel specific to Perpal. If a colour, type choice,
spacing value, interaction, or animation cannot be traced to something concrete
about the product, it does not ship.

When instructions compete: explicit user requirements, then accessibility and
performance, then this repo's locked decisions (the typography system below, the
tokens in `globals.css`, the conventions already in the tree), then the
established visual language, then generic design defaults.

## The short version

- **State a compact design contract before coding** a new screen or a material
  redesign: the product assumption, which type steps and tokens it uses, two
  materially different layout options as small ASCII wireframes, the one
  signature element, and the genericity test — if the plan would ship unchanged
  for an unrelated product, revise it. This is planning output; the one-word
  completion rule below applies to finishing, not starting.
- **One signature per screen.** Everything else gets quieter in service of it.
  Three signatures means none.
- **Derive from tokens.** Reuse the type steps, 4px spacing base and 8px rhythm,
  radii, colours, and the `--ease-*` curves. New tokens go into `@theme` with a
  reason. Never hide a one-off value in a component.
- **Structural devices must encode something true.** Numbering implies order,
  dividers imply grouping, badges imply state. `long` and `short` are market
  state, never a decorative green and pink.
- **One orchestrated motion idea per screen.** 150–250ms for feedback, 300–500ms
  for transitions, ease-out entering and ease-in leaving, transform and opacity
  only, and reduced motion must preserve the meaning.
- **Accessibility is a ship blocker**, not polish: 4.5:1 body contrast, visible
  keyboard focus, semantic HTML before ARIA, 44px touch targets, no horizontal
  scroll, and a layout designed at a real mobile width rather than a shrunk
  desktop one.
- **Copy is interface material.** Name actions by what people do, keep the name
  consistent through the flow, and follow the claim rules at the top of
  `src/lib/content.ts`, which override tone.
- **Refuse the default AI look**: cream-and-terracotta editorial, near-black with
  one acid accent, broadsheet hairline grids, `01 / 02 / 03` on non-sequential
  content, Inter everywhere, centred-everything, purple-to-blue "technology"
  gradients, glass without a material reason, feature-card grids because the
  count divides by three, and pills or eyebrows encoding no real state.

Four things in this repo look like items on that list and are not — they were
argued for. Do not "fix" them, and do not treat them as licence for more of the
same: the violet field in `Backdrop.tsx` (the app's own onboarding gradient ramp,
not a stock tech gradient), the frosted nav pill (glass that samples the live
field with `backdrop-filter`, the only honest reason to use it), the near-black
page (`ink` is the product's surface colour, with a full ramp rather than one
acid hue), and the three typefaces (a deliberate display/body pairing plus a
utility face earned by real structured data).

The full version — the contract steps, the mesh-field construction, the watch
list, verification, and the ship checklist — lives in
`.kiro/steering/design-engineering.md`, which is loaded into every session.

# Typography

The site uses **three font families and nothing else**. No Google Fonts imports, no
`next/font/google`, no system stacks, no `ui-sans-serif` / `ui-monospace` / `serif` /
`cursive` fallbacks, and no new font files.

| Family      | Role                                                        | Token / utility                 |
| ----------- | ----------------------------------------------------------- | ------------------------------- |
| **Dürer**   | Wordmark and logo, hero and display type, handwritten asides | `--font-logo` / `--font-display` / `--font-hand` → `font-logo`, `font-display`, `font-hand` |
| **Poppins** | UI meta, labels, buttons, numeric readouts                  | `--font-ui` → `font-ui`, `label` |
| **Lexend**  | Body copy, subtext, and everything else that is read        | `--font-sans` → `font-sans`, and the document default |

## Rules

- All three are declared in one place: `src/lib/fonts.ts`, self-hosted with
  `next/font/local` from the WOFF2 files in `src/fonts/`. Import from there —
  never call a font loader anywhere else.
- `src/app/globals.css` maps those loaders' CSS variables onto the `--font-*`
  theme tokens. Change a family there, in the `@theme` block, not in a component.
- In components, always reach for a token utility (`font-logo`, `font-display`,
  `font-hand`, `font-ui`, `font-sans`). Never write a literal `font-family`.
- `--font-mono` and `--font-serif` are deliberately unset, so `font-mono` and
  `font-serif` generate no CSS. If a monospace look is needed, use `font-ui`
  with the `nums` utility. `--default-font-family` and
  `--default-mono-font-family` are pinned to the approved families so Tailwind's
  Preflight cannot fall back to an operating system font.
- Weights available: Poppins 400 / 500 / 600, Dürer 400 only, Lexend 100–900
  (variable). `font-synthesis-weight` is off, so do not ask a face for a weight
  it does not ship — pick one of these or add the file to `src/fonts/` and
  declare it in `src/lib/fonts.ts`. Every declared file is preloaded, so do not
  add a weight speculatively.
- Dürer is a light, single-weight geometric display face. It carries the brand
  voice, wants slightly negative tracking at large sizes, and is never the right
  choice for body copy or small text.
- The wordmark's semibold weight comes from a `-webkit-text-stroke` in `em` on
  `Wordmark`, because Dürer has no heavier cut. Do not "fix" this by adding a
  `font-semibold` utility (inert, synthesis is off) or by re-enabling
  `font-synthesis-weight` (engine-dependent, smears the stems). If a real
  semibold Dürer file ever arrives, declare it in `src/lib/fonts.ts` and delete
  the stroke.
- The originals live in `public/fonts/`, kept as the source material for the
  WOFF2 builds. The one legitimate place to read them is `next/og` rendering
  (`opengraph-image.tsx`, `icon.tsx`): satori needs a raw TTF/OTF and cannot use
  the fingerprinted WOFF2, so it loads the originals with `readFileSync`. Note
  that satori also fails on variable fonts, so Lexend cannot be used there —
  reach for Poppins instead of letting it fall through to a system font.

# Working agreement

## No unnecessary commands

Run a command only when its output changes what you do next.

- Do not re-run a build, typecheck, or lint that already passed when nothing
  since could have changed the outcome.
- Do not verify the same thing twice, or confirm a tool call that already
  reported success.
- Do not re-read a file already read, or grep for something already known.
- Do not run exploratory commands unrelated to the request — directory
  listings, `git log`, dependency or environment checks — unless the task
  depends on what they return.
- Do not print a file back to inspect an edit you just made.

Read the files you are about to change, once. Run at most one verification pass
at the end, and only when a change could plausibly break the build — skip it for
copy, comments, and styling values. Then stop.

## Report completion with one word

When the work is finished, the whole reply is `done`. No summary, no file list,
no bullets describing the edits, no explanation of the approach. The diff is the
report.

Write more than `done` only to answer a question, to say that something could
not be done or was done differently than asked, to flag a decision or an
unaccepted risk, to report a verification failure being left in place, or to name
a visual result this environment cannot confirm — there is no browser here, so
anything resting on rendered pixels is unverified until the user looks. In those
cases write only the new information, then stop.

This rule supersedes the delivery format in the design-engineering document. The
contract stated before coding already carries the assumption, the layout
direction, and the signature; restating them on completion is exactly the summary
this rule exists to prevent.

The full version of this agreement lives in
`.kiro/steering/working-agreement.md`, which is loaded into every session.
