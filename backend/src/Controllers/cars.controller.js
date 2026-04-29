import * as carService from "../Services/car.service.js";

export function getAllCars(req, res) {
  try {
    const cars = carService.getAllCarsByUserId(req.userId);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export function getCarById(req, res) {
  try {
    const car = carService.getCarById(req.params.id, req.userId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export function createCar(req, res) {
  try {
    const { make, model, year } = req.body;

    if (!make || !model || !year) {
      return res.status(400).json({ error: "Make, model and year are required" });
    }

    const car = carService.createCar(req.userId, make, model, parseInt(year));
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export function updateCar(req, res) {
  try {
    const { make, model, year } = req.body;

    if (!make || !model || !year) {
      return res.status(400).json({ error: "Make, model and year are required" });
    }

    const car = carService.updateCar(req.params.id, req.userId, make, model, parseInt(year));
    res.json(car);
  } catch (err) {
    if (err.message === "Car not found or not owned by user") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export function deleteCar(req, res) {
  try {
    carService.deleteCar(req.params.id, req.userId);
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    if (err.message === "Car not found or not owned by user") {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
