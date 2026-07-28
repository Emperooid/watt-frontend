# WattAmIUsing — Frontend

Next.js frontend for WattAmIUsing, a free tool that helps Nigerians estimate how much their appliances
cost to run on their local electricity tariff.

Live site: https://watt-frontend.vercel.app/

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- No external UI library — hand-built components in `src/components`

## Routes

- `/` — the public landing page: hero, quick single-appliance calculator, energy tips, about, and the
  Version 2 waitlist.
- `/planner` — the full "Home Planner" wizard (add multiple appliances, usage patterns, Good Day/Bad Day
  scenarios, review, and results). Reached from the landing page via the "Plan your whole home" / "Open
  Home Planner" buttons.

## Local setup

```bash
npm install
cp .env.local.example .env.local   # if present; otherwise see below
npm run dev
```

Open http://localhost:3000. The dev server needs the backend running locally too — see
`../wattbackend/README.md`.

### Environment variables

- `NEXT_PUBLIC_API_URL` — base URL of the backend API, e.g. `http://localhost:8000/api` for local dev or
  `https://watt-backend-qin8.onrender.com/api` for production. If unset, the app auto-detects: it uses
  `http://localhost:8000/api` when running on `localhost`/`127.0.0.1`, and the deployed Render URL
  otherwise — see `src/lib/api.ts`. Setting the env var explicitly always takes precedence.

## A note on the local dev environment

This project was built on a machine where the shell has a persistent `NODE_ENV=production` env var, which
breaks `next dev`'s CSS pipeline and makes `npm install` silently skip devDependencies. Both are worked
around already:

- `npm install --include=dev` if dependencies ever look incomplete (missing `typescript`, `eslint`, etc.)
- The `dev` script is wrapped in `cross-env NODE_ENV=development` in `package.json`, so `npm run dev` is
  safe to run as-is regardless of the ambient `NODE_ENV`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Deployment (Vercel)

Deploys from `main`. Set `NEXT_PUBLIC_API_URL` in the Vercel project's Environment Variables (see
`.env.vercel`, gitignored, for the exact value used for this project's deployment) — though the app will
still work without it, thanks to the auto-detection described above.

## Workflow

Work happens on `dev` and gets merged into `main` (the branch Vercel deploys from) once verified locally.
