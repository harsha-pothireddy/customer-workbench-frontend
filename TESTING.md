# Frontend testing (short)

What is tested
- Unit tests for the frontend service layer (example: `src/services/api.js`).
- Small component tests may exist (render + basic accessibility/interaction) if present.

How to run
1. Install dependencies (first time):

```bash
npm install
```

2. Run all tests (headless):

```bash
npx vitest run
# or if you have an npm script: npm run test
```

3. Run tests in watch/dev mode:

```bash
npx vitest
```

What the tests do
- Verify API client behavior (requests/responses, FormData handling) using mocked `axios`.
- Quick unit checks to ensure UI helpers and small components behave as expected.

Testing technologies
- Vitest (test runner + assertion + mocking)
- @testing-library/react (for component tests, if present)
- axios (mocked in unit tests)

Notes
- The frontend reads the backend base URL from `VITE_API_URL` when running in dev/production; tests mock network calls and do not require the backend to be running.
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
