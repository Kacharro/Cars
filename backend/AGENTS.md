# AGENTS.md

## Project overview
Express.js API for managing cars and owners. Single entrypoint: `index.js`. Source code lives in `src/Controllers/` and `src/Routers/`.

## Module system conflict
`package.json` declares `"type": "commonjs"` but all files use ESM `import` syntax. This will fail at runtime. Pick one and stay consistent (ESM is recommended given current code).

## Known issues in current code
- `index.js`: incomplete import on line 5, missing import, `PROCESS.env` should be `process.env` (lowercase), `app.use("/")` has no router argument
- `src/Routers/carsOwners.routers.js`: controller functions are called with wrong syntax — express route handlers must be passed as references, not invoked inline (e.g. `router.get("/cars", getAllCars)`, not `router.get("/cars", getAllCars())`)
- `src/Controllers/cars.controlles.js`: empty — no controller logic yet
- filename typo: `cars.controlles.js` (should be `cars.controllers.js`)

## No database configured
No DB client, ORM, or migration tool is installed yet. Routes reference "database" in comments but no persistence layer exists.

## Dev workflow
- `node index.js` — run directly (will fail until issues above are fixed)
- `npx nodemon index.js` — run with hot reload (nodemon is installed but no `dev` script is defined)
- No test framework installed (`npm test` just exits with error)
- No linter or formatter configured

## Env setup
- `.env` is loaded via `dotenv` at the top of `index.js`
- `.env` variables: `JWT_SECRET`, `PORT` (defaults to 3000)
