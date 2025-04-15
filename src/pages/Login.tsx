import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "demo" && password === "demo") {
      navigate("/overview"); // Redirect to the overview page
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-900 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-center">
          <img src="/rado.png" alt="Rado Logo" className="h-28" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Dobrodošli natrag!
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Nemate račun?{" "}
          <a href="/register" className="text-[#43AA8B] hover:underline">
            Registrirajte se
          </a>
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Korisničko ime
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
              placeholder="Unesite korisničko ime"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
              placeholder="Unesite lozinku"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300 text-[#43AA8B] focus:ring-[#43AA8B]" />
              Zapamti me
            </label>
            <a href="/forgot-password" className="text-[#43AA8B] hover:underline">
              Zaboravljena lozinka?
            </a>
          </div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-[#43AA8B] text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Prijava
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          Trebate pomoć?{" "}
          <a href="mailto:support@rado.ai" className="text-[#43AA8B] hover:underline">
            Kontaktirajte Rado podršku
          </a>
        </p>
        <p className="text-xs text-center text-black mt-2 font-bold">Rado 2025</p>
      </div>
    </div>
  );
};

export default Login;
