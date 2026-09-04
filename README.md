# Reformer Pilates Malta — Homepage Prototype

This repository is the standalone visual prototype for the new Reformer Pilates Malta public homepage.

It is intentionally separate from the production booking application while the homepage art direction, motion system, typography and responsive behaviour are being refined.

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- GSAP + ScrollTrigger for desktop storytelling
- Native CSS scroll snap for mobile reels
- CSS keyframe animation for hero type / media reveals
- Lucide React icons

No Gemini / Google GenAI runtime is required by this prototype.

## Main files

- `src/components/PremiumLandingPage.tsx` — homepage composition, desktop hero interaction, intro timeline and page sections
- `src/index.css` — global visual tokens plus desktop hero typography / marquee behaviour
- `src/mobile-premium.css` — mobile-only art direction, touch behaviour, safe-area handling and mobile auth overrides
- `src/auth-menu.css` — full-screen menu, theme and account interface
- `src/App.tsx` — lightweight prototype shell and mock user state
- `src/components/SiteFooter.tsx` — responsive editorial footer
- `public/premium/` — homepage photography and visual assets
- `vite.config.ts` — standard React + Tailwind Vite configuration

## Desktop hero behaviour

The desktop hero uses a six-column grid with:

- vertically staggered rounded media capsules
- a sliced, viewport-aligned `reformer` word
- an opening sequence that morphs circular image windows into the final capsules
- hover-specific lowercase words (`begin`, `build`, `sculpt`, `private`)
- a continuous hover marquee clipped to the active media pill
- one shared optical type axis for the large word and hover typography
- a restrained right-to-left title reveal inspired by the analysed Unanime opening behaviour

Photography stays calm on hover; typography remains the primary interaction.

## Mobile art direction

Mobile is deliberately not a compressed version of the desktop layout.

At `767px` and below:

- the two empty desktop hero columns disappear
- the four practice capsules become a native horizontal, touch-driven scroll-snap reel
- the large `reformer` word remains behind the reel as a single mobile wordmark rather than six sliced desktop copies
- hover-dependent effects are removed; swipe becomes the primary interaction
- each capsule keeps a staggered vertical position to preserve the architectural rhythm of the desktop composition
- the hero uses one quiet central rail instead of the desktop six-column grid
- the desktop scroll cue is replaced by a small `swipe to explore` instruction
- the classes section becomes a second native horizontal snap reel rather than a long stacked card list
- instructor photography uses an asymmetric pill crop to maintain the core brand geometry
- full-screen menu / auth forms use `100dvh`, safe-area padding and touch targets of roughly 48–58px
- form labels stay above fields and the form remains one column on phones
- horizontal hover translations are disabled for touch-only devices
- `prefers-reduced-motion` removes the mobile opening motion while preserving final layout

The mobile experience relies on native scrolling rather than GSAP pinning. This avoids scroll-jacking, keeps touch momentum intact and reduces interaction cost on phones.

## Menu / account prototype

The menu is a full-screen editorial canvas opened with a right-to-left wipe. Light theme is the default unless the user explicitly saved dark mode in `localStorage`.

Authentication is still prototype-only:

- account choice and form UI are implemented
- form state is local React state
- no password is persisted locally
- successful prototype submit creates only a mock user object
- production auth / profile persistence will replace the adapter later

The theme value is intentionally isolated so production can sync it to an authenticated profile while keeping `localStorage` as an instant client-side fallback.

## Development

The old AI Studio / Bun lockfiles were removed because they contained stale template dependencies. Generate a clean npm lockfile from the current manifest on first install:

```bash
npm install
npm run dev
```

Type check:

```bash
npm run lint
```

Production bundle check:

```bash
npm run build
```

## Important prototype limitation

`src/App.tsx` still contains mock contact/user state and a mock dashboard action. This repository should not be treated as the production booking/auth implementation.

The visual homepage can later be integrated into the production `reformerpilatesmalta.com` application without copying these mock behaviours.

## Design guardrails

When changing the homepage:

- preserve the warm limestone / ivory editorial direction
- preserve the hero pill geometry and typography identity
- avoid generic wellness cards, gradients and excessive shadows
- keep desktop hover motion restrained, continuous and seamless
- never make mobile depend on hover
- prefer native mobile scroll snap over pinned or scroll-jacked interactions
- keep phone touch targets comfortably finger-sized
- keep mobile auth forms single-column and context-clear
- preserve safe-area spacing for modern iPhones
- do not change unrelated desktop sections when tuning mobile behaviour

## Cleanup status

Removed from the prototype:

- AI Studio-specific `metadata.json`
- Gemini / AI Studio `.env.example`
- AI Studio-only HMR/file-watching logic in `vite.config.ts`
- unused GenAI / Express runtime dependencies from `package.json`
- stale Bun and npm lockfiles that still referenced removed template dependencies
- redundant Motion-based hero marquee and its `motion` dependency
- dead hero transform utility classes that were overridden by inline transforms
- unused `BrandMark` and `UserPanel` prototype components
- the old mock footer presentation

The remaining mock account / management state is intentional standalone-prototype scaffolding, not AI runtime code.
