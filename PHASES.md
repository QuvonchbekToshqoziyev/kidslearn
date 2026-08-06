# KidsLearn delivery phases

Each phase is a small vertical slice. It must pass its validation gate, update documentation/tests, receive one logical commit, and be pushed before the next phase starts.

## Phase 1 — Backend foundation and access model

- NestJS/TypeScript backend
- Prisma/PostgreSQL schema
- Health endpoint
- Environment validation
- Role model: `SUPERADMIN`, `ADMIN`, `PARENT`, `CHILD`
- Authorization rules for the admin hierarchy and parent-owned children
- Swagger shell
- Build and unit-test setup

Gate: clean install, Prisma validation/generation, build, unit tests, health endpoint.

## Phase 2 — Authentication and account management

- Parent registration/login/logout
- Admin login
- JWT access and refresh sessions
- Superadmin creates administrators
- Admin manages parents
- Backend-enforced role checks

Gate: auth, session, invalid-login, and role-isolation tests.

## Phase 3 — Parent and child management

- Parent profile
- Child profiles, avatars, birth dates, and automatic age
- Child switching on shared devices
- Parent-owned data isolation

Gate: parent cannot access another parent’s children; switching works on mobile and web.

## Phase 4 — Activities and admin content management

- Activity model and publishing workflow
- Tests, lessons, games, puzzles, and memory activities
- Initial six activity types
- Age/category filters
- Admin activity management

Gate: published age-appropriate activity can be completed and persisted.

## Phase 5 — Child experience and rewards

- Mobile-first child dashboard
- Portrait/landscape responsive activity player
- Points, stars, streaks, and medals
- PWA manifest, install guidance, and offline shell

Gate: browser tests complete an activity and verify visible rewards.

## Phase 6 — Parent monitoring and notifications

- Progress dashboard
- Daily/weekly/monthly summaries
- Difficult topics and best subjects
- In-app notifications
- Automatic status refresh

Gate: parent sees real persisted child progress and achievement notifications.

## Phase 7 — Admin reporting and release hardening

- Parent/child/activity search
- Age, subject, date, and activity filters
- Pagination
- Media management
- Accessibility, security, responsive, and browser QA
- Swagger, Postman, README, CI, and deployment configuration

Gate: full browser acceptance suite passes at desktop, mobile portrait, and mobile landscape sizes.

## Phase 8 — Deployment

- Deploy development/staging
- Run migrations and approved seeds
- Public API/frontend smoke tests
- Real mobile browser verification
- Explicit approval
- Production deployment and smoke test

After the first release: iPad-specific polish, advanced push notifications, AI, multilingual UI, voice controls, leaderboard, and certificates.

