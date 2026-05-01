import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/Routers/auth.router.js";
import { generalLimiter, authLimiter } from "./src/Middleware/rateLimit.middleware.js";
import carsRouter from "./src/Routers/cars.router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use("/auth", authLimiter, authRouter);
app.use("/api", carsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
