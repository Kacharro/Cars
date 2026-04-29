import RegisterForm from "../features/auth/RegisterForm";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Car & Owners</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
