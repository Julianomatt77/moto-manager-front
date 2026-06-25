# AGENTS.md - MotoManager Frontend

## Project Overview
Angular 22 application for motorcycle management (expenses, maintenance, moto tracking). Uses Tailwind CSS v4, Heroicons, HashLocationStrategy.

## Commands
- `npm start` / `ng serve` - dev server at `http://localhost:4200`
- `npm run build` / `ng build` - production build to `dist/moto-manager`
- `npm run watch` - watch mode build (development)
- `npm run test` / `ng test` - unit tests via Karma/Jasmine

## Architecture
- **Entry point**: `src/main.ts` → `bootstrapApplication(AppComponent, appConfig)`
- **Config**: `src/app/app.config.ts` - provides router, HttpClient (with XHR + AuthInterceptor), animations, HashLocationStrategy
- **Routes**: `src/app/app.routes.ts` - lazy-loaded components, `authGuard` protects `/depenses`, `/entretien`, `/motos`
- **Environments**: `src/environments/environment.ts` (dev) ↔ `environment.prod.ts` (prod) - swapped at build via `fileReplacements`

## Key Conventions
- **Strict TypeScript**: `strict: true`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `strictTemplates: true`
- **Indentation**: 2 spaces, single quotes for TS
- **Component prefix**: `app` (set in angular.json)
- **Auth**: JWT in `sessionStorage` (key: `mm_token`), `AuthService` + `AuthInterceptor` + `authGuard`
- **API base**: `http://127.0.0.1:8000/api/` (dev), `https://moto-manager-api.martin-julien-dev.fr/api/` (prod)

## Testing
- Unit tests only (Karma/Jasmine)
- No e2e tests configured (`ng e2e` requires additional package)
- Spec files co-located with components/services (`*.spec.ts`)

## Build Quirks
- Default build configuration is **production** (see `angular.json:61`)
- Budgets: initial 4MB warning / 5MB error; component styles 2KB warning / 4KB error
- Output hashing enabled in production
- Zone.js polyfill included

## Dependencies
- Angular 22 (core, router, forms, animations, platform-browser)
- RxJS 7.8, zone.js 0.15, xlsx 0.18.5
- Dev: Angular CLI 22, TypeScript 6.0, Karma 6.4

## Shared Components (`src/app/shared/`)
- `<app-icon name="">` — inline Heroicons SVG (home, plus, edit, delete, close, upload, download, user, user-off, menu, eye, eye-off, chevron-left/right, filter, mail, send, moto, xlsx)
- `<app-dialog [isOpen] (close) [wide]>` — modal overlay with backdrop blur
- `<app-paginator [length] [pageSize] [pageIndex] (changePage)>` — pagination controls
- `<app-toggle [checked] [disabled] (changed)>` — toggle switch

## UI Conventions
- **No component CSS files** — all styling via Tailwind utility classes
- **Design system**: primary #2563EB, secondary #3B82F6, cta #F97316, bg #EFF6FF, text #1E40AF
- **Typography**: Fira Code headings, Fira Sans body (Google Fonts import in styles.css)
- **Cards**: `rounded-2xl shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-200`
- **Buttons**: `cursor-pointer transition-colors duration-200` on clickable elements
- **Dialogs**: Use `<app-dialog>` wrapping form/confirmation content — no `MatDialog`

## Rules & Skills
- **Rules** (auto-loaded): `.opencode/rules/instructions.md`, `.opencode/rules/workflow.md`
- **Skills** (load via `skill` tool when relevant):
  - `.opencode/skills/angular/` - Angular guidelines
  - `.opencode/skills/ui-ux-pro-max/` - UI/UX design intelligence
  - `.opencode/skills/ui-paper/` - UI paper design
- **Usage**: Load applicable skill(s) at start of each prompt; rules apply automatically; Angular skill apply automatically;
