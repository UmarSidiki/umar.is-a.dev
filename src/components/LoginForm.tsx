"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        onLoginSuccess?.();
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber to-amber-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <div className="max-w-md w-full mx-4">
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-700/30 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-2xl">🔐</span>
                  </div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    Admin Login
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Access the admin dashboard
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <p className="text-red-700 dark:text-red-400 text-sm">
                        {error}
                      </p>
                    </div>
                  )}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="Enter your username"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
  );
};

export default LoginForm;
