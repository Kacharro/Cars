import { useAuth } from "../features/auth/AuthContext";
import CarList from "../features/cars/CarList";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Cars() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    toast.success("Logged out");
    navigate("/login");
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Car & Owners</h1>
          <p className="text-slate-400 mt-1">Welcome, {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      <CarList />
    </div>
  );
}
