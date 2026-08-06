# Full-Stack Project Delivery Workflow

This playbook records how the Mini CRM was planned, implemented, tested, documented, populated, and deployed. Reuse it for similar React + NestJS + PostgreSQL projects by replacing the domain models and project-specific requirements.

## 1. Start with the task as the source of truth

Before writing code:

1. Read the complete task file.
2. Convert every requirement into a checklist.
3. Separate required features from optional improvements.
4. Choose the stack and record the decision.
5. Define the completion boundary for backend, frontend, documentation, and deployment.
6. Identify changes that need approval, such as public deployment, production data writes, or removing a requested feature.

For Mini CRM, the selected stack was:

- Frontend: React, Vite, TypeScript
- Backend: NestJS, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- API documentation: Swagger and Postman
- Hosting: separate Vercel projects for frontend and backend
- Managed production database: Neon PostgreSQL through Vercel

Do not begin with optional features. First make the required business flow work end to end.

## 2. Plan work as independently releasable phases

Each phase should produce working code and documentation. A phase is complete only when its validation gate passes.

### Backend phases

1. Repository and NestJS foundation
2. PostgreSQL and Prisma schema
3. Shared validation, errors, middleware, security, and Swagger shell
4. Authentication and session management
5. Users CRUD and profile
6. Customers CRUD
7. Projects CRUD
8. Tasks CRUD and assignment rules
9. Dashboard statistics
10. Documentation and Postman audit
11. CI, Vercel configuration, and backend acceptance audit

### Frontend phases

1. Confirm any missing backend fields required by the design
2. React foundation and design system
3. Authentication and route guards
4. Responsive application shell and dashboard
5. Customers interface
6. Projects interface
7. Tasks interface
8. Users and profile interface
9. Responsive audit, browser tests, CI, documentation, and deployment

### Change phases after the original plan

Real projects change during implementation. We handled later requests as small vertical changes instead of reopening the architecture:

- Added a combined local development launcher.
- Added idempotent demo data.
- Added settings and task-assignment notifications.
- Simplified local database setup.
- Archived and removed email-verification behavior when it was no longer required.
- Fixed deployment-specific build and rate-limit problems without unrelated refactors.

## 3. Use a strict phase checkpoint

For every phase:

1. Implement only the phase scope.
2. Update tests.
3. Update Swagger and Postman for changed endpoints.
4. Update `.env.example` for changed configuration.
5. Update README instructions for changed commands or behavior.
6. Run the phase validation gate.
7. Review the diff and preserve unrelated files.
8. Commit with one logical message.
9. Push and confirm CI before continuing.

Example commit messages:

```text
scaffold NestJS backend
add CRM database schema and migrations
add user management and profile
add responsive CRM shell and dashboard
add task assignment notifications
complete frontend testing and Vercel deployment
fix Vercel backend dependency installation
```

Avoid a single large final commit. Logical commits make review, rollback, and technical interviews easier.

## 4. Keep documentation with the implementation

Documentation was written during every phase, not postponed until the end.

- Endpoint implemented: update Swagger decorators and Postman in the same phase.
- Environment variable added: update `.env.example` and README immediately.
- Script added: document its purpose, prerequisites, and exact command.
- Authorization changed: update the RBAC/API guide.
- Deployment behavior changed: update the deployment guide.

The final documentation phase is only for proofreading, completeness checks, clean-start verification, and deployment instructions.

Required repository artifacts:

- Root README
- Environment examples without real secrets
- Database migrations
- Seed instructions
- Swagger/OpenAPI documentation
- Postman collection and environment
- API and RBAC guide
- Local setup and troubleshooting guide
- CI workflows
- Deployment configuration and instructions

## 5. Build backend foundations before business modules

Establish shared behavior once so every module uses it:

- Global `/api/v1` prefix
- DTO validation and input transformation
- Stable global error response
- Request IDs and structured logging
- Helmet, CORS, and rate limiting
- Swagger bearer authentication
- JWT access tokens and rotating HttpOnly refresh cookies
- Backend-enforced ADMIN/USER authorization
- Consistent search, filters, pagination, and archive handling
- Separate test database for E2E tests

Recommended stable error shape:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Human-readable message",
  "details": [],
  "path": "/api/v1/example",
  "timestamp": "ISO-8601 timestamp",
  "requestId": "request UUID"
}
```

Fix cross-cutting behavior in the shared layer. Do not add a different validation, pagination, or error pattern to each module.

## 6. Model data and relationships before CRUD

For each entity, define:

- Required and nullable fields
- Enums
- Relationships and deletion behavior
- Unique constraints and indexes
- Searchable fields
- Filterable fields
- Creation and update timestamps
- Archive/soft-delete field where restoration is required

Mini CRM used this dependency order:

```text
User ──< Task >── Project >── Customer
  └──── RefreshSession
  └──── Notification >── Task
```

Relationship guards belonged in the backend:

- Do not archive a customer with active projects.
- Do not archive a project with active tasks.
- Assign tasks only to active users and active projects.
- A USER can read only assigned tasks and update only their status.
- Do not archive or demote the final active ADMIN.

The frontend hides forbidden actions for usability, but the backend remains the security boundary.

## 7. Use migrations and idempotent seeds

Local setup flow:

```bash
cd backend
cp .env.example .env
npm ci
npm run prisma:generate
npm run db:setup
npm run db:seed
```

`db:setup` should:

1. Read `DATABASE_URL`.
2. Create the named local PostgreSQL database only when it does not exist and the database user has permission.
3. Apply committed migrations.

Important limits:

- The application can create a database, not the PostgreSQL server or provider account.
- Managed production providers normally create the database and return a URL.
- Never run migrations concurrently in every API instance at startup.
- Run production migrations as a separate release step.
- Seeds must be idempotent so reruns do not create duplicates.
- Keep demo data separate from the required ADMIN seed.
- Block demo seeds in production unless production demo data is explicitly approved.

For a visual demo, seed related records rather than independent rows. Customers, projects, tasks, assignments, and notifications should form a believable working dataset.

## 8. Implement complete vertical CRUD slices

For each business module, complete the whole slice before moving on:

1. Prisma queries and relationship checks
2. Service behavior
3. Controller routes
4. DTO validation
5. RBAC rules
6. Search, filters, pagination, archive, and restore
7. Swagger
8. Postman
9. Unit/E2E tests
10. Frontend API contract
11. Desktop table and mobile card UI
12. Create/view/edit/archive/restore interactions

This avoids having a UI that exists before its permissions, filters, or API behavior are reliable.

## 9. Frontend architecture and UI rules

The frontend followed the supplied reference while staying connected to real backend data.

- Dark navy responsive sidebar
- Compact top bar
- KPI cards and honest charts
- Searchable and filterable CRUD lists
- Drawers for forms and details
- Confirmation dialogs for destructive actions
- Desktop tables that become mobile cards
- Uzbek user-facing text
- Role-aware navigation and controls
- Loading, empty, error, and skeleton states
- Keyboard focus and reduced-motion behavior

State rules:

- Server data: TanStack Query
- Forms: React Hook Form
- Search/filter/pagination: URL query parameters
- Search: debounced
- Filter changes: reset page to 1
- Access token: memory only
- Refresh token: Secure HttpOnly cookie
- Session startup: refresh-cookie request
- Multiple simultaneous `401` responses: one shared refresh request, then retry each request once

Do not invent analytics that the backend cannot provide. Dashboard charts must be derived from real totals or task statuses.

## 10. Authentication and security workflow

The final authentication flow was:

1. Register creates a USER.
2. Login returns a short-lived access token and sets a rotating refresh cookie.
3. Refresh rotates the session token and revokes reused sessions.
4. Logout revokes the session and clears the cookie.
5. Sensitive profile changes revoke existing sessions.

Production settings:

```text
JWT_ACCESS_SECRET=<different random secret>
JWT_REFRESH_SECRET=<different random secret>
REFRESH_COOKIE_SECURE=true
REFRESH_COOKIE_SAME_SITE=none   # when frontend and backend are cross-site
CORS_ORIGINS=https://your-frontend.example
```

Generate independent secrets:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Never commit `.env`, database URLs, passwords, refresh tokens, or JWT secrets. Store production values as encrypted hosting-provider environment variables.

If a planned security feature is removed, archive the old migration/history as needed, remove its live routes and UI completely, update all documentation, and rerun the full authentication gate. Do not leave a half-enabled flow.

## 11. Local development workflow

Install each module once:

```bash
cd backend && npm ci
cd ../frontend && npm ci
```

Run both modules from the repository root:

```bash
./dev.sh
```

Expected URLs:

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs`

When an app works in an embedded VS Code browser but fails in Chrome, check:

1. Chrome is using the expected `localhost` URL and port.
2. `VITE_API_BASE_URL` points to the browser-reachable API URL.
3. Backend `CORS_ORIGINS` includes the exact frontend origin.
4. Cookies use settings appropriate for HTTP locally and HTTPS in production.
5. Remote development ports are forwarded correctly.
6. The frontend was restarted after changing Vite environment variables.

## 12. Validation gates

### Backend gate

```bash
cd backend
npm run prisma:format
npm run prisma:validate
npm run prisma:generate
npm run lint
npm test
npm run test:e2e
npm run build
```

### Frontend gate

```bash
cd frontend
npm run format:check
npm run lint
npm test
npm run build
```

### Browser acceptance gate

Use Playwright with the real frontend, backend, and PostgreSQL test database.

ADMIN flow:

```text
login → dashboard → customer → project → user → assigned task → archive/restore
```

USER flow:

```text
login → hidden Users/write actions → read-only customers/projects
      → assigned-task isolation → status-only update → notifications
```

Also verify:

- Registration and logout
- Refresh-session restoration
- Invalid login behavior
- Profile update and password change
- Search, filters, pagination, archive, and restore
- Relationship conflict messages
- 1440px, tablet, and 390px layouts
- Direct protected-route refresh
- No page-level horizontal overflow

## 13. CI workflow

Backend CI should run:

```text
npm ci
Prisma validate and generate
lint
unit tests
PostgreSQL E2E tests
production build
```

Frontend CI should run:

```text
npm ci
format check
lint
unit tests
production build
Playwright full-stack tests with PostgreSQL
```

Use a separate CI database. Keep CI seed users deterministic and reset their state in setup so repeated runs remain reliable.

Rate limits can make full-stack tests collide when multiple tests reuse the same IP. Configure test-safe limits explicitly instead of weakening production limits.

## 14. Vercel deployment workflow

Use two Vercel projects for a monorepo:

### Backend project

- Root Directory: `backend`
- Framework: NestJS
- Build command: repository `vercel-build` script
- Install command: `npm ci --include=dev`
- Production URL used by the frontend must include `/api/v1` in `VITE_API_BASE_URL`.

`--include=dev` matters because Nest CLI and TypeScript are build dependencies. Setting `NODE_ENV=production` during install can otherwise omit them and cause `nest: command not found`.

### Frontend project

- Root Directory: `frontend`
- Framework: Vite
- Set `VITE_API_BASE_URL` before the production build.
- Add an SPA rewrite so `/profile`, `/tasks`, and other direct route refreshes return `index.html`.

### Database

1. Create/connect a managed PostgreSQL resource.
2. Copy the pooled runtime URL to `DATABASE_URL`.
3. Use an unpooled/direct URL for migrations if the provider supplies one.
4. Apply committed migrations once.
5. Create the ADMIN seed with an approved generated password.
6. Add approved demo data only when required.

### Environment variables

Backend production variables normally include:

```text
NODE_ENV
DATABASE_URL
DIRECT_URL or DATABASE_URL_UNPOOLED
CORS_ORIGINS
JWT_ACCESS_SECRET
JWT_ACCESS_TTL_SECONDS
JWT_REFRESH_SECRET
JWT_REFRESH_TTL_SECONDS
REFRESH_COOKIE_NAME
REFRESH_COOKIE_SAME_SITE
REFRESH_COOKIE_SECURE
THROTTLE_TTL_MS
THROTTLE_LIMIT
SWAGGER_ENABLED
SEED_ADMIN_FULLNAME
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
```

Frontend production variables:

```text
VITE_API_BASE_URL=https://your-backend.example/api/v1
```

Vite variables are compiled into the frontend bundle. Redeploy the frontend after changing them.

### Public access

Check Vercel Deployment Protection. A deployment can be Ready but still redirect visitors to Vercel SSO. Disable SSO only with explicit approval, because it can also expose preview deployments.

### Final public smoke test

Verify from the public domains:

1. `GET /api/v1/health` returns `200` and `{ "status": "ok" }`.
2. `/docs` returns Swagger.
3. Frontend `/` returns the SPA.
4. Direct `/profile` returns the same SPA entry.
5. CORS preflight from the exact frontend origin succeeds.
6. ADMIN login returns `200`.
7. A Secure HttpOnly refresh cookie is present.
8. Authenticated `/dashboard/summary` returns expected database totals.
9. A real Chrome/Playwright login reaches `/dashboard` and renders a KPI.

## 15. Deployment lessons from Mini CRM

- A successful Vercel build does not prove the deployment is public; test without CLI authentication.
- A frontend environment change needs a new Vite build.
- `NODE_ENV=production` can omit build tools during `npm ci`; explicitly include dev dependencies for the build stage.
- Provider-downloaded environment files may redact secret values. Never generate database password hashes from a pulled/redacted env file; use the original protected secret source.
- Verify seeds with aggregate counts and test a real login. A row count alone does not prove its password works.
- If a failed seed creates an accidental record, delete only the exact known record and verify the remaining counts.
- Add `.vercel/` to `.gitignore`; never commit local project-link metadata.
- Keep migrations out of API startup. Serverless instances can start concurrently.
- Use exact frontend origins in CORS; paths do not belong in an origin.
- Test the final production flow in an ordinary browser, not only an IDE preview or authenticated CLI.

## 16. Definition of done

A project is ready to hand over only when all of the following are true:

- Every required task item is implemented or explicitly removed with approval.
- Backend authorization is enforced at request time.
- Database migrations work from a clean database.
- Required seed and approved demo data are idempotent.
- Swagger and Postman match the live API.
- README setup works from a clean checkout.
- Backend and frontend static gates pass.
- Full-stack browser tests pass.
- CI is green on the submitted commit.
- Production variables contain no placeholder secrets.
- Public health, CORS, login, cookie, SPA rewrite, and dashboard checks pass.
- The repository, app URL, API documentation URL, and credentials are ready for handoff.
- Temporary local secret files are removed after deployment.

## 17. Reusable execution template

Use this short checklist for the next project:

```text
[ ] Read and convert task into acceptance checklist
[ ] Choose stack and define scope
[ ] Plan backend phases
[ ] Build database and shared API infrastructure
[ ] Build auth and RBAC
[ ] Complete each business module vertically
[ ] Complete backend docs, tests, CI, and deployment config
[ ] Plan frontend from the approved reference
[ ] Build design system, auth, shell, then feature pages
[ ] Add real-data dashboard and responsive behavior
[ ] Add browser acceptance tests
[ ] Audit task file requirement by requirement
[ ] Create managed production database
[ ] Upload generated secrets as encrypted variables
[ ] Apply migrations and approved seeds
[ ] Deploy backend, then frontend
[ ] Make public only with approval
[ ] Run public API and real-browser smoke tests
[ ] Hand over links and rotate temporary credentials
```

The core rule is simple: implement in small vertical phases, document and test each phase immediately, and verify the same public path the recipient will actually use.
