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

- `src/components/PremiumLandingPage.tsx` — page composition and booking orchestration
- `src/components/LandingHeader.tsx` — fixed brand/header controls
- `src/components/DesktopHero.tsx` — desktop hero presentation
- `src/components/MobileHero.tsx` — mobile hero presentation
- `src/components/ClassesSection.tsx` — desktop/mobile classes presentation
- `src/components/EditorialSections.tsx` — studio, proof and instructor sections
- `src/components/BookingSections.tsx` — first-session, booking CTA and floating WhatsApp actions
- `src/components/ThemeMenu.tsx` — full-screen menu/theme/account prototype
- `src/components/SiteFooter.tsx` — responsive editorial footer
- `src/content/practice.ts` — canonical BEGIN / BUILD / SCULPT / PRIVATE content and hero imagery
- `src/motion/` — GSAP ownership isolated from presentation components
- `src/index.css` — semantic palette tokens, shared geometry and desktop hero styling
- `src/mobile-hero.css` — mobile hero art direction only
- `src/mobile-premium.css` — mobile landing-page layout only
- `src/auth-menu.css` — menu/account styling only
- `src/action-motion.css` — shared CTA interaction language
- `src/footer-map.css` — footer/map treatment

## Design architecture

Desktop and mobile heroes intentionally use different compositions while sharing the same four practice definitions and image sources from `src/content/practice.ts`.

Desktop uses a six-column sliced typography system and one GSAP-owned opening/scroll story. Mobile uses a pinned horizontal capsule rail with segmented `reformer` typography that scatters vertically only after the final capsule has cleared the viewport.

Theme colors are semantic CSS variables rather than selectors that inspect Tailwind class strings. Components use surface, text and border roles so changing a palette value does not require finding every individual section.

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
- keep palette changes inside semantic theme variables rather than component-specific dark-mode overrides
- do not change unrelated sections when tuning one interaction
