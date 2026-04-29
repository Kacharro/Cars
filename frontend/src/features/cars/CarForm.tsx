import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchApi } from "../../api/client.js";
import toast from "react-hot-toast";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
}

interface CarFormProps {
  car: Car | null;
  onSaved: () => void;
  onClose: () => void;
}

const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int("Year must be a whole number").min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Invalid year"),
});

type CarFormData = z.infer<typeof carSchema>;

export default function CarForm({ car, onSaved, onClose }: CarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: car
      ? { make: car.make, model: car.model, year: car.year }
      : { make: "", model: "", year: 2024 },
  });

  async function onSubmit(data: CarFormData) {
    try {
      if (car) {
        await fetchApi(`/api/cars/${car.id}`, {
          method: "PUT",
          body: data,
        });
        toast.success("Car updated");
      } else {
        await fetchApi("/api/cars", {
          method: "POST",
          body: data,
        });
        toast.success("Car added");
      }
      onSaved();
    } catch (err: unknown) {
      const message = err instanceof Object && "message" in err ? err.message : "Failed to save car";
      toast.error(String(message));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          {car ? "Edit Car" : "Add New Car"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div>
        <label htmlFor="make" className="block text-sm font-medium text-slate-300 mb-1">
          Make
        </label>
        <input
          id="make"
          {...register("make")}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Toyota"
        />
        {errors.make && <p className="mt-1 text-sm text-red-400">{errors.make.message}</p>}
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-slate-300 mb-1">
          Model
        </label>
        <input
          id="model"
          {...register("model")}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Corolla"
        />
        {errors.model && <p className="mt-1 text-sm text-red-400">{errors.model.message}</p>}
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-slate-300 mb-1">
          Year
        </label>
        <input
          id="year"
          type="number"
          {...register("year", { valueAsNumber: true })}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="2024"
        />
        {errors.year && <p className="mt-1 text-sm text-red-400">{errors.year.message}</p>}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? "Saving..." : car ? "Update" : "Add"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
