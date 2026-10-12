"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sun,
  Moon,
} from "lucide-react";

export default function StaffLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);

  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const saved = localStorage.getItem("theme");
    const prefersDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);

    setDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (form.email === "" || form.password === "") {
        setLoading(false);
        setError("Ensure Form Is Filled Completely Before Submitting");
        return;
      }

      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res.error) {
        setError(decodeURIComponent(res.error));
        setLoading(false);
        return;
      }

      router.push("/authentication/checkAccount");
      setLoading(false);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-stretch bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Dark mode switch — top right of the whole page */}
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Toggle dark mode"
        onClick={toggleDark}
        className="absolute top-2 right-4 z-50 inline-flex h-8 w-16 items-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#4c1d95]/30 dark:focus:ring-[#9333ea]/40"
      >
        <Sun
          size={14}
          className={`absolute left-2 transition-opacity duration-300 ${
            dark ? "opacity-40 text-gray-400" : "opacity-100 text-amber-500"
          }`}
        />

        <Moon
          size={14}
          className={`absolute right-2 transition-opacity duration-300 ${
            dark ? "opacity-100 text-indigo-300" : "opacity-40 text-gray-400"
          }`}
        />

        <span
          className={`absolute left-1 h-6 w-6 rounded-full bg-white dark:bg-[#4c1d95] shadow-md transform transition-transform duration-300 flex items-center justify-center ${
            dark ? "translate-x-8" : "translate-x-0"
          }`}
        >
          {dark ? (
            <Moon size={12} className="text-white" />
          ) : (
            <Sun size={12} className="text-amber-500" />
          )}
        </span>
      </button>

      {/* Left hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#9333ea] dark:from-[#1e1b4b] dark:via-[#2e1065] dark:to-[#4c1d95]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-black/10 blur-3xl" />
        </div>

        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="cross"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M30 10 V50 M10 30 H50"
                  stroke="white"
                  strokeWidth="2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cross)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16 text-white">
          <div className="flex items-center gap-3">
            <div>
              <img
                src="/logo.png"
                alt="ACK Diocese of Maseno North Logo"
                className="w-12 h-12 object-contain"
              />
            </div>

            <div>
              <div className="font-bold text-sm tracking-wide">ACK DIOCESE</div>
              <div className="text-xs text-white/70 tracking-[0.2em]">
                MASENO NORTH
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Staff Portal
            </h1>

            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Secure access to diocesan administration tools, member records,
              and ministry resources — all in one place.
            </p>

            <ul className="space-y-3 text-sm text-white/90">
              {[
                "Manage member records",
                "Track events & programs",
                "Publish news & sermons",
                "Generate reports",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight size={11} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/60">
            <ShieldCheck size={14} />
            Authorized personnel only · Secured with end-to-end encryption
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white dark:bg-gray-950 transition-colors">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-[#4c1d95] dark:bg-[#2e1065] text-white flex items-center justify-center">
              <img
                src="/logo.png"
                alt="ACK Diocese of Maseno North Logo"
                className="w-8 h-8 object-contain"
              />
            </div>

            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                ACK DIOCESE
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 tracking-[0.2em]">
                MASENO NORTH
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Sign in to access the staff dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded-xl px-4 py-3">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@ackdioceseofmasenonorth.org"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4c1d95]/20 dark:focus:ring-[#9333ea]/30 focus:border-[#4c1d95] dark:focus:border-[#9333ea] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>

                <a
                  href="/staff/forgot-password"
                  className="text-xs font-semibold text-[#4c1d95] dark:text-[#a78bfa] hover:text-[#9333ea] dark:hover:text-[#c4b5fd] transition"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4c1d95]/20 dark:focus:ring-[#9333ea]/30 focus:border-[#4c1d95] dark:focus:border-[#9333ea] transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#4c1d95] dark:text-[#9333ea] focus:ring-[#4c1d95] dark:focus:ring-[#9333ea] dark:bg-gray-900"
              />

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Keep me signed in
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4c1d95] dark:bg-[#6d28d9] hover:bg-[#3b1573] dark:hover:bg-[#5b21b6] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-[#4c1d95]/20 dark:shadow-[#6d28d9]/30"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />

            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Need help?
            </span>

            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Contact the diocesan IT office at{" "}
            <a
              href="mailto:ict@ackdioceseofmasenonorth.org"
              className="font-semibold text-[#4c1d95] dark:text-[#a78bfa] hover:text-[#9333ea] dark:hover:text-[#c4b5fd] transition"
            >
              ict@ackdioceseofmasenonorth.org
            </a>
          </p>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
            &copy; {currentYear} ACK Diocese of Maseno North. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
