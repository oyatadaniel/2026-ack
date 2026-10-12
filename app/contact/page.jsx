"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axios.post(`${BACKEND_URL}/sendMessage`, form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={18} />,
      label: "Our Location",
      value: "ACK Diocese of Maseno North, Maseno, Kisumu County, Kenya",
    },
    {
      icon: <Phone size={18} />,
      label: "Phone",
      value: "020 2103 103",
      href: "tel:0202103103",
    },
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "info@ackmasenonorth.org",
      href: "mailto:info@ackmasenonorth.org",
    },
    {
      icon: <Clock size={18} />,
      label: "Office Hours",
      value: "Mon – Fri: 8:00 AM – 5:00 PM",
    },
  ];

  const socials = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/1Dz94DFouE/",
      target: "_blank",
      rel: "noopener noreferrer",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
        </svg>
      ),
    },

    {
      label: "YouTube",
      href: "https://www.youtube.com/@ackdioceseofmasenonorth",
      target: "_blank",
      rel: "noopener noreferrer",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header />

      {/* HERO */}
      <section className="relative bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          <nav className="flex items-center gap-2 text-xs mb-6">
            <a href="/" className="text-white/70 hover:text-white transition">
              Home
            </a>
            <ChevronRight size={14} className="text-white/50" />
            <span className="text-white font-semibold">Contact Us</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            Get in Touch
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base">
            Have a question, a prayer request, or want to partner with us? We'd
            love to hear from you. Reach out and our team will respond promptly.
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="relative -mt-10 md:-mt-14 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[0.65rem] uppercase tracking-wider text-[#9333ea] font-semibold mb-1">
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-gray-800 font-medium hover:text-[#4c1d95] transition-colors break-words"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="text-sm text-gray-800 font-medium break-words">
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + SIDE INFO */}
      <section className="py-14 md:py-20 bg-gray-50 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* FORM */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                  Send a Message
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-6">
                  We'd Love to Hear From You
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Daniel Oyata"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40 focus:border-[#9333ea] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40 focus:border-[#9333ea] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40 focus:border-[#9333ea] transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40 focus:border-[#9333ea] transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow-md hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Send us a Message</>
                    )}
                  </button>

                  {status === "success" && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                      <CheckCircle2 size={16} />
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}
                  {status === "error" && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      Something went wrong. Please try again later.
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* SIDE INFO */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Map */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <iframe
                  title="Diocese location"
                  src="https://www.google.com/maps?q=Maseno,Kenya&output=embed"
                  className="w-full h-64 border-0"
                  loading="lazy"
                />
              </div>

              {/* Social */}
              <div className="bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-2">Follow Us</h3>
                <p className="text-white/80 text-sm mb-5">
                  Stay connected with our community on social media.
                </p>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      aria-label={s.label}
                      className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:scale-105 transition"
                    >
                      {s.svg}
                    </a>
                  ))}
                </div>
              </div>

              {/* Prayer request card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                  Prayer Requests
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">
                  Need Prayer?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our pastoral team is here for you. Send us your prayer request
                  and we will stand with you in faith.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
