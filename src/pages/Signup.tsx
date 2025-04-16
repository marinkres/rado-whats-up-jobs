import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Input validation
    if (!email || !password || !companyName || !phone) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    // Create user in Supabase
    const { data: user, error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) {
      setErrorMessage(signupError.message);
      return;
    }

    // Insert employer details into the employers table
    const { error: insertError } = await supabase
      .from("employers")
      .insert({ email, company_name: companyName, phone });

    if (insertError) {
      setErrorMessage(insertError.message);
      return;
    }

    alert("Signup successful! Please check your email for confirmation.");
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-900 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-center">
          <img src="/rado.png" alt="Rado Logo" className="h-28" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Registrirajte se
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Već imate račun?{" "}
          <a href="/" className="text-[#43AA8B] hover:underline">
            Prijavite se
          </a>
        </p>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naziv tvrtke
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
              placeholder="Unesite naziv tvrtke"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
              placeholder="Unesite telefon"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
              placeholder="Unesite email"
              required
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
              required
            />
          </div>
          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-[#43AA8B] text-white font-semibold rounded-lg hover:bg-green-600 transition"
          >
            Registriraj se
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

export default Signup;
