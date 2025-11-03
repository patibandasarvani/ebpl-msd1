# EBPL Online Compiler (MERN)

Monorepo with React (Vite) client and Express server. Server uses a mock EBPL runner you can replace with a real interpreter.

## Prerequisites
- Node 18+
- npm or pnpm or yarn

## Setup
```bash
# From repo root
cd server
npm install
npm run dev # starts API on http://localhost:5000

# In a second terminal
cd ../client
npm install
npm run dev # Vite dev server
```

Set `VITE_API_URL` in `client/.env` if your API isn’t on localhost:5000.

## Replace EBPL Runner
Edit `server/src/services/ebplRunner.js` to call your real runner.

## API
- POST /api/compile-run { code } -> { output, tokens, generatedCode, timeMs }
- GET /api/examples -> seeded list
- Snippets endpoints are scaffolded for future MongoDB wiring.
