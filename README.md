# Reformer Pilates Malta — Homepage Prototype

This repository is the standalone visual prototype for the new Reformer Pilates Malta public homepage.

It is intentionally separate from the production booking application while the homepage art direction, motion system, typography and responsive behaviour are being refined.

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- GSAP + ScrollTrigger
- CSS keyframe animation for the hero hover marquee
- Lucide React icons

No Gemini / Google GenAI runtime is required by this prototype.

## Main files

- `src/components/PremiumLandingPage.tsx` — homepage composition, hero interaction, intro timeline and page sections
- `src/index.css` — global visual tokens plus hero typography/marquee behaviour
- `src/App.tsx` — lightweight prototype shell and mock management/user state
- `src/components/SiteFooter.tsx` — intentionally minimal mock footer used by this standalone prototype
- `public/premium/` — homepage photography and visual assets
- `vite.config.ts` — standard React + Tailwind Vite configuration

## Hero behaviour

The desktop hero uses a six-column grid with:

- vertically staggered rounded media capsules
- a sliced, viewport-aligned `reformer` word
- an opening sequence that morphs circular image windows into the final capsules
- hover-specific lowercase text tracks (`begin`, `build`, `sculpt`, `private`)
- two identical 100vw hover-text groups, each split into three equal word slots
- one 200vw CSS marquee track translated by exactly `-50%`, so the second group replaces the first without a visible restart seam
- one shared optical type axis for the large word and hover typography

The hover marquee is intentionally slow and readable rather than behaving like a fast UI ticker. The small text uses a measured optical Y correction while remaining tied to the same 50% hero type axis as `reformer`.

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

`src/App.tsx` currently contains mock contact/user state and a mock dashboard action. `src/components/SiteFooter.tsx` is also a visual placeholder. This repository should not be treated as the production booking/auth implementation.

The visual homepage can later be integrated into the production `reformerpilatesmalta.com` application without copying these mock behaviours.

## Design guardrails

When changing the homepage:

- preserve the warm near-white editorial direction
- preserve the hero grid and sliced typography concept
- avoid generic wellness cards, gradients and excessive shadows
- keep desktop hover motion restrained, continuous and seamless
- keep mobile scrolling native and uncomplicated
- do not change unrelated page sections when tuning the hero

## Cleanup status

Removed from the prototype:

- AI Studio-specific `metadata.json`
- Gemini / AI Studio `.env.example`
- AI Studio-only HMR/file-watching logic in `vite.config.ts`
- unused GenAI / Express runtime dependencies from `package.json`
- stale Bun and npm lockfiles that still referenced the removed template dependencies
- the redundant Motion-based hero marquee and its `motion` dependency
- dead hero transform utility classes that were being overridden by inline transforms
- unused `BrandMark` and `UserPanel` prototype components

The remaining mock state/footer are intentional standalone-prototype scaffolding, not AI runtime code.
