# KidsLearn

Mobile-first learning website and PWA for children aged 1–7.

The first release supports desktop web and mobile browsers in portrait and landscape orientations. iPad-specific optimization and bonus features are planned after the first deployment.

## Delivery

See [PHASES.md](PHASES.md) for the committed delivery sequence and validation gates.

## Backend development

```bash
cd backend
npm install
npm run prisma:generate
npm run build
npm test
npm run start:dev
```

The API will run on `http://localhost:3000` and expose health at `/api/v1/health`.

## Roles

- `SUPERADMIN`: creates and manages administrators.
- `ADMIN`: manages activities/tests and parent accounts.
- `PARENT`: manages only their own children and views their progress.
- `CHILD`: completes activities assigned to their profile.

