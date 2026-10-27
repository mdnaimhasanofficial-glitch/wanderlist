<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- Use **npm** (`package-lock.json` is the lockfile; the README's yarn/pnpm/bun lines are template boilerplate). No `.env` setup exists or is needed — nothing reads env vars yet.
- Scripts are only `dev`, `build`, `start`, `lint` (bare `eslint`, flat config in `eslint.config.mjs`). **There is no test runner and no typecheck script.**
- Verify a change with: `npx tsc --noEmit` → `npm run lint` → `npm run build`. `next build` runs the TypeScript check and prerenders routes itself, so it is the authoritative gate.
- **`npm run lint` exits 1 at baseline**: `react-hooks/set-state-in-effect` errors in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts`, plus an unused-import warning in `src/app/layout.tsx`. Expect this — ensure your files add no *new* problems rather than aiming for a clean exit.
- Fresh clone: `npx tsc --noEmit` fails on `LayoutProps<"/">` in `src/app/layout.tsx` because it is declared in generated `.next/types/routes.d.ts` and `.next/` is gitignored. Run `npm run build` (or `npm run dev`) once first.

## Stack quirks (Next 16.4.3, React 19.3)

- `next.config.ts` enables `cacheComponents` and `partialPrefetching`: data fetching follows the Cache Components model (`use cache` directives, Suspense rules) instead of classic `revalidate` caching. Read `node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md` before writing data code.
- `reactCompiler: true` (babel-plugin-react-compiler) handles memoization — skip manual `useMemo`/`useCallback` boilerplate. Its lint rules are also why the baseline lint errors above exist.
- Tailwind **v4** has no config file: CSS loads via a Turbopack rule (`@tailwindcss/turbopack`), and all theming is CSS-first in `src/app/globals.css` (`@theme`, shadcn CSS variables).
- shadcn/ui style is **`base-nova`** (`components.json`): components wrap **Base UI (`@base-ui/react`)**, not Radix — don't assume Radix APIs. Add components with `npx shadcn add <name>`; they land in `src/components/ui/`.
- App Router code lives in `src/app/`; import alias `@/*` → `src/*` (also used by the shadcn aliases in `components.json`).
