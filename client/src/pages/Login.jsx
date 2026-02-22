import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TrendingUp, Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl space-y-8">
        <div className="text-center">
          <div className="flex justify-center flex-col items-center gap-2">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl mb-2">
              <TrendingUp size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-secondary">
              Log in to your virtual trading account
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-danger/10 text-danger p-3 rounded-xl text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="email"
                required
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-slate-50/50"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="password"
                required
                className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all bg-slate-50/50"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-blue-200"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-secondary">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-primary hover:underline"
          >
            Create Profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;