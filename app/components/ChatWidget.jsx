"use client";

import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { MessageCircle, X, Send, Loader2, AtSign, User } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const HIDDEN_ROUTES = ["/dashboard", "/authentication"];

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const exitTimer = useRef(null);

  const shouldHide = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  useEffect(() => {
    if (open) {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      setMounted(true);
    } else if (mounted) {
      exitTimer.current = setTimeout(() => setMounted(false), 200);
    }
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (shouldHide) return null;

  const handleClose = () => setOpen(false);
  const handleToggle = () => setOpen((v) => !v);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!subject.trim()) return toast.error("Subject is required");
    if (!message.trim()) return toast.error("Message is required");

    setLoading(true);

    axios
      .post(
        `${BACKEND_URL}/sendMessage`,
        { name, email, subject, message },
        { headers: { "Content-Type": "application/json" } },
      )
      .then(() => {
        toast.success("Message sent!");
        setLoading(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setOpen(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error("Failed to send message");
      });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* ---------------- Speech bubble popover ---------------- */}
      {mounted && (
        <div
          className={`relative mb-3 w-[280px] transition-all duration-200 ease-out origin-bottom-right ${
            open
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-90 translate-y-2 pointer-events-none"
          }`}
        >
          {/* Bubble body */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl rounded-br-sm border-2 border-slate-300 dark:border-slate-600 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#6d28d9] ">
              <div className="flex items-center gap-1.5">
                <MessageCircle size={12} />
                <p className="text-[10px] font-semibold">Send us a message</p>
              </div>
              <button
                onClick={handleClose}
                className=" hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={12} />
              </button>
            </div>

            {/* Greeting */}
            <div className="px-3 pt-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tl-sm px-2.5 py-2">
                <p className="text-[10px] text-gray-700 dark:text-gray-200 leading-relaxed">
                  Hi there! How may we help you today? Send us a message.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-3 space-y-2">
              {/* Name */}
              <div className="relative">
                <User
                  size={11}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-[10px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg pl-7 pr-2.5 py-1.5 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <AtSign
                  size={11}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-[10px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg pl-7 pr-2.5 py-1.5 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Subject */}
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-[10px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
              />

              {/* Message */}
              <textarea
                rows="3"
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-[10px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-1 text-[10px] font-medium bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-2.5 py-1.5 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={11} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>Send us a message</>
                )}
              </button>
            </form>
          </div>

          {/* Bubble tail — small triangle pointing down-right toward button */}
          <div
            className="absolute -bottom-[9px] right-6 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "10px solid #4c1d95",
            }}
          />
          {/* Inner tail to mask the border and reveal the fill */}
          <div
            className="absolute -bottom-[5px] right-6 w-0 h-0 dark:hidden"
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid #ffffff",
            }}
          />
          <div
            className="absolute -bottom-[5px] right-6 w-0 h-0 hidden dark:block"
            style={{
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid #111827",
            }}
          />
        </div>
      )}

      {/* ---------------- Button ---------------- */}
      <button
        onClick={handleToggle}
        aria-label="Chat"
        className={`ml-auto flex items-center justify-center w-11 h-11 rounded-full text-white shadow-lg shadow-[#4c1d95]/30 transition-all duration-200 active:scale-95 relative ${
          open
            ? "bg-[#3b1578] dark:bg-[#5b21b6] rotate-90"
            : "bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] rotate-0"
        }`}
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-gray-950 animate-pulse" />
        )}
      </button>
    </div>
  );
}
