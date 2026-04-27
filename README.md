# AgentraCo — Marketing Landing

Static, framework-free landing page for AgentraCo.
GitHub Pages compatible.

## Files

| File | Purpose |
|---|---|
| `index.html` | Production landing page (locked agency direction). |
| `styles.css` | All visual tokens, themes, and component styles. |
| `script.js` | Vanilla JS — mobile nav toggle, scroll reveal. |
| `assets/agentraco-logo.svg` | Official AgentraCo SVG logo asset. |
| `index.tweaks-backup.html` | Pre-strip version with the in-page Tweaks panel for re-exploring directions. Not deployed. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is. |

## Brand tokens

```
Deep Space     #06091E
Velocity Blue  #0062FF
Apex Green     #00E87A
Kinetic Orange #FF5722
```

Wordmark: Playfair Display · UI/body: DM Sans (loaded from Google Fonts).

## Locked design direction

- Theme: Agency bold (cream `#faf7f2` body, near-black `#0a0a0a` ink)
- Accent: Kinetic Orange
- Hero: Combo (3D Pulse A logo behind, live-call card foreground)
- 3D intensity: Subtle
- Headline: "AI agents that *answer, capture, and route*."
- Density: Compact

These are still controlled by `data-*` attributes on `<body>` in `index.html`, so swapping themes later is one attribute change — no rebuild required.

## Deploy to GitHub Pages

This project is a static HTML/CSS/JS site. It is not a Next.js app, so no
`package.json`, install step, or build step is required.

Recommended setup:

1. Push to the repo's default branch.
2. In **Settings → Pages**, set source to `GitHub Actions`.
3. The included `.github/workflows/pages.yml` workflow will publish the static files.
4. The site will be live at `https://<owner>.github.io/<repo>/`.

Alternative setup:

1. Push to the repo's default branch.
2. In **Settings → Pages**, set source to `Branch: main / root`.
3. Wait ~1 minute.

The `.nojekyll` file prevents Jekyll from skipping any underscore-prefixed paths.

## Manual QA before going live

- [ ] Replace `Start Pilot` button `<button>` with `<a href="mailto:…">` or your form link.
- [ ] Add a real favicon to `<head>` (`<link rel="icon" href="/assets/favicon.png">`).
- [ ] Add an Open Graph image (`<meta property="og:image" …>`) — 1200×630 PNG.
- [ ] Verify mobile nav opens/closes on a real phone.
- [ ] Audit color contrast in your browser's a11y devtools.
- [ ] Test `prefers-reduced-motion: reduce` (animations disable, ECG hides).

## Future migration

Because everything lives in three flat files with semantic HTML and CSS variables:
- Move to Astro / Next.js by copying sections into components — class names map 1:1.
- Add a CMS by replacing static text nodes with template variables.
- A/B test by toggling `<body>` data attributes server-side.
