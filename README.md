# Reformer Pilates Malta — Homepage Prototype

Standalone React/Vite prototype for the new Reformer Pilates Malta public homepage. The booking/authentication layer is still prototype-only; this repository is currently focused on the public experience, motion system and responsive art direction.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4
- GSAP + ScrollTrigger
- Lucide React

## Runtime structure

- `src/App.tsx` — prototype shell, shared contact data and menu/auth request state
- `src/components/PremiumLandingPage.tsx` — desktop hero and page sections
- `src/components/MobileHero.tsx` — dedicated mobile pinned horizontal hero
- `src/components/ThemeMenu.tsx` — full-screen menu, theme and prototype account flow
- `src/components/SiteFooter.tsx` — footer/map/social presentation
- `src/index.css` — global tokens, desktop hero and theme behaviour
- `src/mobile-hero.css` — mobile hero only
- `src/mobile-premium.css` — mobile page sections only
- `src/auth-menu.css` — menu/auth layout and responsive behaviour
- `src/footer-map.css` — footer/map presentation
- `src/action-motion.css` — shared CTA interaction language

## Current hero behaviour

Desktop keeps the six-column editorial hero, sliced `reformer` typography, staggered media capsules and ScrollTrigger story.

Mobile is intentionally separate. It shows one full capsule plus part of the next capsule, uses a sliced viewport-aligned `reformer` word, pins the hero while the media rail travels right-to-left, and scatters the `reformer` slices vertically only after the last capsule has left the viewport.

## Menu / account prototype

The menu is opened by the same `authRequest` state used by homepage booking actions. There is no DOM click interception between the header and menu. `login` opens the member menu; `register` opens the create-account view.

Authentication is still intentionally mock-only:

- form state lives in React
- no password is persisted
- submit creates a temporary in-memory user object
- dashboard action is still a mock alert

Do not treat this as production authentication. Replace the adapter when the production booking/account service is connected.

## Development

```bash
npm install
npm run dev
```

Type check:

```bash
npm run lint
```

Bundle check:

```bash
npm run build
```

Run both before merging structural changes:

```bash
npm run check
```

A clean npm lockfile should be committed once dependencies are installed in the development environment so local and Vercel installs are reproducible.

## Design guardrails

- preserve the warm limestone / ivory direction
- keep hero typography and capsule geometry editorial, not card-like
- keep desktop hover motion restrained
- never make mobile depend on hover
- preserve safe-area spacing and comfortable touch targets
- do not reintroduce a second legacy mobile hero
- use semantic component selectors for new code; avoid new `nth-of-type` or Tailwind-class-string selectors
- keep component-specific responsive CSS in the component's own stylesheet

## Known production blockers

- authentication and dashboard are prototype-only
- social URLs are intentionally empty until verified
- dependency lockfile is not yet committed
- `PremiumLandingPage.tsx` is still large and should be split by section before substantial new business logic is added
- some existing CSS still relies on structural selectors; these should be removed incrementally rather than covered by additional overrides
