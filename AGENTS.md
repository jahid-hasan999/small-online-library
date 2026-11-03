<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Commands

- `npm run dev` — dev server (Turbopack + React Compiler are always on, enabled in `next.config.mjs`).
- `npm run lint` — ESLint (`eslint` 9 flat config). No test suite exists in this repo.
- `npm run build` / `npm run start` — production build/serve.

# External prerequisites

- Pages fetch data from an **external backend API not in this repo**, at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`, endpoints like `/books`). Without it running, every books page stays empty. Don't confuse it with Next itself.
- MongoDB Atlas (database `onlinelibrary`) + Better Auth (`BETTER_AUTH_*`, `GOOGLE_*`). Secrets live in `.env`, which is gitignored via `.env*` in `.gitignore` — recreated locally, not committed.

# Architecture notes

- **Route protection lives in `src/proxy.js`** — this Next.js version replaces `middleware` with `proxy`; the file must export a function named `proxy` (not `middleware`) plus the usual `config.matcher`. It guards `/add-book`, `/my-books`, `/my-borrows`, `/profile`, `/books/<id>` (list `/books` stays public) by checking for the Better Auth session cookie only — a stale `better-auth.session_token` cookie passes the check even if the session is dead server-side. Auth pages (`/sign-in`, `/sign-up`) redirect logged-in users to `/`.
- Auth stack: Better Auth (email+password, Google OAuth, JWT plugin) backed by the Mongo adapter. Server instance in `src/lib/auth.js` (Mongo client is cached on `globalThis` to prevent dev reconnections), client instance in `src/lib/auth-client.js`, single catch-all handler at `src/app/api/auth/[...all]/route.js`.
- Pure JavaScript, no TypeScript: all files `.js`/`.jsx`, `jsconfig.json` maps `@/*` → `./src/*` for path imports.
- App Router under `src/app`. `src/app/(user)/` is a route group (no layout) holding sign-in/sign-up.
- `src/components/ui/` is shadcn-generated (`npx shadcn` with style `base-nova`, `tsx: false`, per `components.json`, using `@base-ui/react` primitives) — avoid hand-editing these; they may be overwritten by regeneration.
- Tailwind v4 is wired via `@tailwindcss/turbopack` in the `turbopack.rules` block of `next.config.mjs`, not through PostCSS.
- `next.config.mjs` enables `cacheComponents`, `partialPrefetching`, `reactCompiler`, and `experimental.agentFeedback`. Check `node_modules/next/dist/docs/` before using caching/dynamic-rendering APIs — conventions differ from standard Next.js.

