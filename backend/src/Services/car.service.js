import db from "../Database/db.js";

export function getAllCarsByUserId(userId) {
  return db.prepare("SELECT * FROM cars WHERE user_id = ?").all(userId);
}

export function getCarById(carId, userId) {
  return db.prepare("SELECT * FROM cars WHERE id = ? AND user_id = ?").get(carId, userId);
}

export function createCar(userId, make, model, year) {
  const result = db.prepare("INSERT INTO cars (user_id, make, model, year) VALUES (?, ?, ?, ?)").run(userId, make, model, year);
  return db.prepare("SELECT * FROM cars WHERE id = ?").get(result.lastInsertRowid);
}

export function updateCar(carId, userId, make, model, year) {
  const result = db.prepare("UPDATE cars SET make = ?, model = ?, year = ? WHERE id = ? AND user_id = ?").run(make, model, year, carId, userId);
  if (result.changes === 0) {
    throw new Error("Car not found or not owned by user");
  }
  return db.prepare("SELECT * FROM cars WHERE id = ?").get(carId);
}

export function deleteCar(carId, userId) {
  const result = db.prepare("DELETE FROM cars WHERE id = ? AND user_id = ?").run(carId, userId);
  if (result.changes === 0) {
    throw new Error("Car not found or not owned by user");
  }
}
