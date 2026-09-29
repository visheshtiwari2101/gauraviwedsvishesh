# Gauravi & Vishesh wedding invitation

Existing bilingual, mobile-first wedding invitation with layered botanical scenery, a progressive sky, ceremony timeline, RSVP and music controls.

This copy is an invitation from Gauravi's Pathak family. Deepak Pathak and Rashmi Pathak invite guests to their daughter's wedding with Vishesh Tiwari; his parents remain correctly identified as Parashuram Tiwari and Indira Tiwari. Couple branding and the original monogram remain Gauravi & Vishesh.

The Pathak grandparents (Brij Bihari Lal Pathak and Late Pushpa Pathak), family telephone 8989428932, and Hindi name दीपक कुमार पाठक were recovered from the existing configuration in Git commit `5e6bc66`. Dates, event times, venue, countdown, music and RSVP service configuration remain unchanged. Older refinement notes below describe historical versions, including the earlier groom-side invitation.

## Run and validate

Requires Node.js 20 or later. No npm dependencies are required.

```sh
npm run build
npm test
node scripts/serve.mjs
```

Open http://127.0.0.1:4173/. Deploy the contents of `dist/` to a static HTTPS host. This repository push does not itself configure hosting.

## Project

- `dist/`: deployable website and optimized artwork.
- `dist/config.js`: wedding facts, English/Hindi text and existing service URLs.
- `dist/motion.js`: cached scroll geometry, bounded visible wind, entrances and reduced-motion handling.
- `dist/drift.js`: fifteen reusable falling botanical fragments with randomized type, position, scale and curved CSS trajectories. Paused in hidden tabs and under reduced motion; no timers or per-frame JavaScript.
- `artwork-source/`: original generated decorative assets. Supplied Ganesha and monogram remain unchanged; their hashes are verified by the build.
- `tests/`: regression checks for motion scheduling, falling-element bounds/accessibility, RSVP transport/validation, translations and countdown.

## Motion and performance

Individual plants use varied wind periods, negative delays and rotations. Current side leaf amplitudes are approximately 9–12.9 degrees; flowers 9–12.2 degrees. Parallax remains a separate transform layer. Visible vegetation is capped at 10 plants on mobile, 26 desktop and 4 economical devices, balanced across both sides and between leaves/flowers. Other ambient motion has its own small budget. Offscreen elements pause.

Falling fragments are bounded to fifteen DOM elements, with different depths and fall speeds, curved lateral drift, rotation and a brief upward gust. Their appearances and paths change between falls without adding DOM nodes. Bird groups, clouds and the existing text entrances remain intact. Static warm radial auras avoid animated blur or filters.

## Verification

Production build and seven tests pass. Browser checks confirm changing wind and falling transforms, no mobile horizontal overflow and full reduced-motion suppression. Real-device frame rates are not guaranteed. Live RSVP delivery and actual YouTube playback depend on their external services and were not newly verified.

For isolated mock browser checks, run `node scripts/serve-qa.mjs` and visit port 4174 with `?mode=success`, `?mode=error`, or `?mode=reduced`. These fixtures do not send real guest responses and are not part of `dist/`.

See `ARTWORK.md`, `WORLD-UPDATE.md` and `LATEST-REFINEMENTS.md` for artwork provenance and earlier refinement notes.
