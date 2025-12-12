# Frontend Testing (Customer Workbench Frontend)

Prerequisites
- Node.js (v18+ recommended)
- npm

Run unit tests

From the frontend project root:

```bash
cd /Users/harshapothireddy/Documents/GitHub/customer-workbench-frontend
# run Vitest unit tests
npx vitest run
```

Run tests in watch mode (development):

```bash
npx vitest
```

Run the dev server (optional for manual verification):

```bash
npm run dev
# open http://localhost:3000
```

Notes
- Tests mock `axios` and use small polyfills for `File`/`FormData` so they run under Node.
- If you add browser-only APIs be sure to polyfill or mock them in tests.

Script
- There is a convenience script `run-tests.sh` in the project root that runs the quick test command.
