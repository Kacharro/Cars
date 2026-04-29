import { useState, useEffect } from "react";
import { fetchApi } from "../../api/client.js";
import CarForm from "./CarForm";
import toast from "react-hot-toast";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  user_id: number;
  created_at: string;
}

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function loadCars() {
    try {
      const data = await fetchApi<Car[]>("/api/cars");
      setCars(data);
    } catch (err: unknown) {
      const message = err instanceof Object && "message" in err ? err.message : "Failed to load cars";
      toast.error(String(message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  async function handleDelete(id: number) {
    try {
      await fetchApi(`/api/cars/${id}`, { method: "DELETE" });
      setCars((prev) => prev.filter((c) => c.id !== id));
      toast.success("Car deleted");
    } catch (err: unknown) {
      const message = err instanceof Object && "message" in err ? err.message : "Failed to delete car";
      toast.error(String(message));
    }
  }

  function handleEdit(car: Car) {
    setEditingCar(car);
    setShowForm(true);
  }

  function handleFormClose() {
    setEditingCar(null);
    setShowForm(false);
  }

  function handleCarSaved() {
    setShowForm(false);
    setEditingCar(null);
    loadCars();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Cars</h2>
        <button
          onClick={() => {
            setEditingCar(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Add Car
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
          <CarForm car={editingCar} onSaved={handleCarSaved} onClose={handleFormClose} />
        </div>
      )}

      {cars.length === 0 ? (
        <p className="text-slate-400 text-center py-10">No cars yet. Add your first one!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white">
                {car.make} {car.model}
              </h3>
              <p className="text-slate-400 mt-1">Year: {car.year}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(car)}
                  className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car.id)}
                  className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
