# Plan – User & Car Management API

## Overview
Express.js API for registering users and managing their cars. Each user can only access their own vehicles via JWT-based authentication.

## Step-by-Step Implementation

### 1. Fix module system
- Change `package.json` to `"type": "module"`
- Update any `require` → `import` / `module.exports` → `export default`

### 2. Generate JWT secret
- Create a strong random secret (32+ bytes base64)
- Store in `.env` as `JWT_SECRET=...`
- Already loaded via `dotenv` at the top of `index.js`

### 3. Add database layer
- Install `better-sqlite3`
- Create `src/db.js` to initialize the DB with:
  - `users(id, email, password_hash)`
  - `cars(id, user_id, make, model, year)`

### 4. User registration & login
- Create `src/Controllers/auth.controller.js`
- `register(email, password)` → hash with bcrypt → store in DB
- `login(email, password)` → verify → sign JWT → return token
- Add basic body validation (email format, required fields)

### 5. JWT authentication middleware
- Create `src/Middleware/auth.middleware.js`
- Verify `Authorization: Bearer <token>`
- Extract `userId` from token payload, attach to `req.userId`
- Return 401 if token invalid or missing

### 6. Car CRUD controllers
- Rename `cars.controlles.js` → `cars.controllers.js`
- Implement:
  - `getAllCars` – returns cars where `user_id = req.userId`
  - `getCarById` – returns single car if owned by user
  - `createCar` – inserts new car with `user_id = req.userId`
  - `updateCar` – updates car only if owned by user
  - `deleteCar` – deletes car only if owned by user

### 7. Router wiring
- Fix `src/Routers/carsOwners.routers.js`:
  - Export `authRouter` (POST `/register`, POST `/login`)
  - Export `carRouter` (GET/POST/PUT/DELETE cars, all protected)
- Fix `index.js`:
  - Mount routers: `app.use('/auth', authRouter)` and `app.use('/api', carRouter)`
  - Fix `PROCESS.env` → `process.env`
  - Fix incomplete import on line 5
  - Ensure `app.use()` has proper middleware arguments

### 8. Environment & server start
- Ensure `dotenv` is the very first import
- Use `process.env.PORT || 3000`

### 9. Add NPM scripts
- `"dev": "npx nodemon index.js"`
- `"start": "node index.js"`
- `"test": "jest"`

### 10. Testing
- Install `jest`
- Write unit tests for auth controller
- Write integration tests for car routes

### 11. Documentation
- Update `README.md` with:
  - Setup steps (install deps, create `.env`, run `npm run dev`)
  - API endpoints reference
  - Example requests with curl/Postman

## Immediate Next Steps
1. Generate a strong JWT secret and add to `.env`
2. Create the DB initializer (`src/db.js`)
3. Implement auth controller + middleware
4. Implement car controllers + routes
5. Fix `index.js` wiring
6. Add tests and scripts
