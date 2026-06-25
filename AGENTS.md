# AGENTS.md - MotoManager Frontend

## Project Overview
Angular 22 application for motorcycle management (expenses, maintenance, moto tracking). Uses Angular Material, RxJS, HashLocationStrategy.

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
- Angular 22 (core, material, router, forms, animations, platform-browser)
- RxJS 7.8, zone.js 0.15, xlsx 0.18.5
- Dev: Angular CLI 22, TypeScript 6.0, Karma 6.4

## Rules & Skills
- **Rules** (auto-loaded): `.opencode/rules/instructions.md`, `.opencode/rules/workflow.md`
- **Skills** (load via `skill` tool when relevant):
  - `.opencode/skills/angular/` - Angular guidelines
  - `.opencode/skills/ui-ux-pro-max/` - UI/UX design intelligence
  - `.opencode/skills/ui-paper/` - UI paper design
- **Usage**: Load applicable skill(s) at start of each prompt; rules apply automatically; Angular skill apply automatically;
