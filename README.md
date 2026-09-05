# Reformer Pilates Malta — Homepage Prototype

This repository is the standalone visual prototype for the new Reformer Pilates Malta public homepage.

It is intentionally separate from the production booking application while the homepage art direction, motion system, typography and responsive behaviour are being refined.

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- GSAP + ScrollTrigger for editorial scroll choreography
- Lucide React icons

## Current structure

- `src/components/PremiumLandingPage.tsx` — page composition and shared reveal/book orchestration
- `src/components/LandingHeader.tsx` — fixed brand/header controls
- `src/components/DesktopHero.tsx` — desktop hero composition and GSAP intro/scroll story
- `src/components/MobileHero.tsx` — mobile horizontal capsule story and segmented typography scatter
- `src/components/ClassesSection.tsx` — desktop/mobile classes presentation
- `src/components/LandingSections.tsx` — studio, proof, instructor and booking sections
- `src/components/ThemeMenu.tsx` — full-screen menu/theme/account prototype
- `src/components/SiteFooter.tsx` — responsive editorial footer
- `src/content/practice.ts` — canonical BEGIN / BUILD / SCULPT / PRIVATE content and hero imagery
- `src/index.css` — global visual tokens and desktop hero styling
- `src/mobile-hero.css` — mobile hero art direction only
- `src/mobile-premium.css` — mobile landing-page overrides only
- `src/auth-menu.css` — menu/account styling only
- `src/action-motion.css` — shared CTA interaction language
- `src/footer-map.css` — footer/map treatment

## Design architecture

The desktop and mobile heroes intentionally use different compositions while sharing the same four practice definitions and image sources from `src/content/practice.ts`.

Desktop uses a six-column sliced typography system, individually staged capsules and one GSAP-owned opening timeline. Mobile uses a pinned horizontal capsule rail with segmented `reformer` typography that scatters vertically only after the final capsule has cleared the viewport.

Semantic section/action classes are preferred over DOM-order selectors. Motion ownership should stay local to the component that renders the scene so later design changes do not create cross-file overrides.

## Development

```bash
npm install
npm run dev
```

Production validation runs TypeScript before Vite bundling:

```bash
npm run build
```

## Prototype boundaries

Account/dashboard behaviour is still lightweight prototype scaffolding. Current work is focused on public-site art direction and interaction quality rather than production authentication or booking integration.

## Design guardrails

- preserve the warm limestone / ivory editorial direction
- preserve the hero pill geometry and typography identity
- avoid generic wellness cards, gradients and excessive shadows
- keep desktop hover motion restrained and continuous
- never make mobile depend on hover
- preserve safe-area spacing for modern phones
- use semantic classes/refs instead of section order or utility-class selector chains
- keep one animation owner per property; avoid CSS and GSAP competing for the same transform/clip-path
- keep shared practice labels/images in `src/content/practice.ts`
- do not change unrelated sections when tuning one interaction
