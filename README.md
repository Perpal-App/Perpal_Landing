# Perpal Landing

The public landing page for Perpal, a mobile, non-custodial perpetuals client on
Solana. The site introduces Perpal's bite-sized perp education, Pacifica market
experience, Umbra-powered private funding, and planned AI-assisted analysis,
backtesting, and user-approved order preparation.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- GSAP with ScrollTrigger and SplitText
- Lenis smooth scrolling
- Self-hosted Dürer, Poppins, and Lexend fonts

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and provide the MongoDB and waitlist secrets.
The public form posts only an email address to `POST /api/waitlist`; successful
registrations are persisted before the existing success state appears.

## Waitlist backend

The waitlist uses the official MongoDB driver and no CAPTCHA or external rate
limiter. MongoDB allows five registration requests per IP in a fixed one-hour
window and keeps a separate one-hour cooldown only after a new registration is
successfully inserted. Duplicate and failed registrations do not consume that
success cooldown. MongoDB also enforces a unique email hash. Email addresses are
encrypted with AES-256-GCM, while email and IP lookup keys use HMAC-SHA256. Raw IP
addresses are never stored.

For operations, `waitlist_readable_registrations` stores the normalized email,
registration time, source, and status in readable form. This collection contains
PII: restrict it to the minimum database users, do not expose it through a public
read route, and do not include it in application logs. Use a separate read-only
MongoDB credential scoped to this collection for invite delivery; do not place
that credential in the landing-page deployment.

After a successful response, the browser stores only a versioned registration
timestamp so returning visitors keep the success state. The email is never placed
in browser storage, and the marker is never trusted by the API; MongoDB validation,
email uniqueness, and the IP cooldown remain authoritative.

Required environment variables are documented in `.env.example`. Generate the
two secrets independently and keep them stable; changing either requires a data
migration. `WAITLIST_IP_HEADER` must name a header that your trusted reverse proxy
overwrites. Never point it at a client-controlled forwarding header.
`WAITLIST_ALLOWED_ORIGIN` is matched exactly. Keep localhost only in `.env.local`;
production rejects localhost, loopback, and non-HTTPS origins.

On first use, the server creates strict MongoDB JSON-schema validators and the
unique and TTL indexes. The runtime MongoDB user therefore needs permission to
create collections and indexes in `MONGODB_DB`, but should have no access to any
other database. After initialization, replace it with a least-privilege runtime
role limited to the three waitlist collections. Keep database network access
restricted to the deployment and enable the provider's encryption at rest.

## Scripts

| Command         | Purpose                                      |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the local Next.js development server.  |
| `npm run build` | Create a production build.                   |
| `npm run start` | Serve an existing production build.          |
| `npm run lint`  | Run ESLint across the repository.             |
| `npm run test:waitlist` | Check waitlist input and IP normalization. |

## Project structure

```text
src/
├── app/                  App Router entry points, metadata, and global CSS
├── components/
│   ├── chrome/           Persistent navigation and visual backdrop
│   ├── motion/           GSAP, Lenis, reveal, lift, and parallax behavior
│   ├── sections/         Landing-page sections
│   └── ui/               Shared presentation primitives
├── fonts/                Optimized WOFF2 files loaded by the application
└── lib/
    ├── content.ts        All product copy, links, and claim boundaries
    ├── fonts.ts          Canonical local-font declarations
    └── cn.ts             Class-name composition helper

public/
├── assets/               Product mockups and optimized decorative renders
├── brand/                Perpal marks used by the site and metadata
└── fonts/                Original font source files for asset generation and OG rendering
```

`src/app/page.tsx` composes the single-page experience from Hero, About,
Product, How It Works, FAQ, Access, and Privacy sections.

## Editing content

Keep page copy in `src/lib/content.ts`, not inside section components. That file
also documents the product's privacy, custody, platform, and feature-claim
boundaries. Update those constraints only when the product source of truth has
changed.

The current privacy claim is scoped: Umbra can obscure the direct funding link,
while Pacifica can still observe activity associated with the trading wallet.
Do not describe Perpal as anonymous or untraceable.

## Design system

- Design tokens and typography utilities live in `src/app/globals.css`.
- Font loading is centralized in `src/lib/fonts.ts`.
- Components use token utilities instead of literal font families or one-off
  colours.
- Motion is coordinated through the shared GSAP and Lenis layer and must preserve
  meaning when reduced motion is enabled.
- Source images belong in their existing public asset folders; optimized site
  variants are generated by `scripts/build-image-assets.mjs`.

Read `AGENTS.md` before making design or implementation changes. It contains the
repository's required design contract, accessibility constraints, typography
rules, command discipline, and completion protocol.

## Production

Create the production build with:

```bash
npm run build
```

The output can be deployed to any platform that supports Next.js 16 and provides
a trusted client-IP header. Configure the production environment from
`.env.example` before enabling the waitlist.
