"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";

export default function Header({ onMenuClick, mobileNavOpen }) {
  const { data: session } = useSession();
  const [dark, setDark] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const userName = session?.user?.name || "Staff Member";
  const userEmail = session?.user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="w-full h-16 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: mobile menu + brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/admin" className="flex items-center gap-3">
            <div className=" flex items-center justify-center">
              <img
                src="/logo.png"
                alt="ACK Diocese of Maseno North Logo"
                className="w-7 h-7 object-contain"
              />
            </div>

            <div className="hidden sm:block leading-tight">
              <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                ACK DIOCESE
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 tracking-[0.2em]">
                MASENO NORTH
              </div>
            </div>
          </Link>
        </div>

        {/* Right: dark toggle, notifications, user */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark mode toggle — same style as login page */}
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label="Toggle dark mode"
            onClick={toggleDark}
            className="relative inline-flex h-8 w-16 items-center rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#4c1d95]/30 dark:focus:ring-[#9333ea]/40"
          >
            <Sun
              size={14}
              className={`absolute left-2 transition-opacity duration-300 ${
                dark ? "opacity-30 text-gray-500" : "opacity-100 text-amber-500"
              }`}
            />
            <Moon
              size={14}
              className={`absolute right-2 transition-opacity duration-300 ${
                dark
                  ? "opacity-100 text-indigo-300"
                  : "opacity-30 text-gray-500"
              }`}
            />
            <span
              className={`absolute  left-1 h-6 w-6 rounded-full  transform transition-transform duration-300 flex items-center justify-center ${
                dark ? "translate-x-8 bg-[#4c1d95]" : "translate-x-0 bg-white"
              }`}
            >
              {dark ? (
                <Moon size={12} className="text-white" />
              ) : (
                <Sun size={12} className="text-amber-500" />
              )}
            </span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#9333ea] dark:bg-[#a78bfa]" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <span className="w-8 h-8 rounded-full bg-[#4c1d95] dark:bg-[#6d28d9] text-white text-xs font-bold flex items-center justify-center">
                {initials || <User size={14} />}
              </span>
              <span className="hidden capitalize md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                {userName}
              </span>
              <ChevronDown
                size={14}
                className="hidden md:block text-gray-400 dark:text-gray-500"
              />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 z-20 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {userName}
                    </div>
                    {userEmail && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userEmail}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/admin/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <User size={16} /> My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
