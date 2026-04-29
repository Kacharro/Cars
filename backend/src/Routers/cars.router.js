import { Router } from "express";
import { authenticateToken } from "../Middleware/auth.middleware.js";
import { getAllCars, getCarById, createCar, updateCar, deleteCar } from "../Controllers/cars.controller.js";

const router = Router();

router.use(authenticateToken);

router.get("/cars", getAllCars);
router.get("/cars/:id", getCarById);
router.post("/cars", createCar);
router.put("/cars/:id", updateCar);
router.delete("/cars/:id", deleteCar);

export default router;
