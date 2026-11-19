# Ciejay Fortu: Portfolio

Personal portfolio built with Next.js 16, React 19 and Tailwind CSS 4. No other runtime packages.

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000.

## Edit content

Everything you see (bio, projects, skills, timeline, typing challenge) is in `lib/content.ts`.

- **Résumé download:** put a file named `resume.pdf` in `public/`. The download link appears on its own.
- **Project screenshots:** go in `public/projects/`. `cropTop` (in pixels) hides a browser bar at the top of a screenshot.
- **Colours:** the theme tokens are at the top of `app/globals.css` (`--accent`, `--good`, `--bad` and `--soft`, for both themes).

## What's on the page

- A hanging ID card: drag it, let go, and it swings back. Click it to flip it. Hover the photo for android mode.
- A 3D keyboard of skills, coloured by group: hover or tap a key, or pick a group to light it up.
- A typing challenge: the exact 25 words of my Monkeytype personal best. The ghost caret replays that run keystroke for keystroke (timing read from the screen recording at 60 fps, stored in `typingRecord.replay`).
- Light and dark mode. It follows the system theme until you pick one.
- Respects "reduce motion".

## Deploy

Import the repository on Vercel; no settings or environment variables are needed.
