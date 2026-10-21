"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Play,
  ArrowRight,
  Cross,
  BookOpen,
  Users,
  HandHeart,
  Handshake,
  ShieldCheck,
  X,
  Bell,
  BellOff,
  Landmark,
  Copy,
  Check,
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ============================================================
   HELPERS
============================================================ */
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|live\/))([\w-]{11})/,
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

function getYouTubeVideoId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/live\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const getYearsServing = (dateInstalled) => {
  if (!dateInstalled) return null;
  const start = moment.utc(dateInstalled);
  if (!start.isValid()) return null;
  const years = moment.utc().diff(start, "years");
  return years >= 0 ? years : 0;
};

/* ============================================================
   SEARCHABLE PARISH SELECT
============================================================ */
function SearchableParishSelect({
  parishes,
  value,
  onChange,
  placeholder = "Start typing your parish...",
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setQuery("");
      return;
    }
    const found = parishes.find((p) => String(p.id) === String(value));
    setQuery(found ? found.parish : "");
  }, [value, parishes]);

  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = parishes.filter((p) =>
    (p.parish || "").toLowerCase().includes((query || "").toLowerCase().trim()),
  );

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  const commitTypedValue = () => {
    const typed = (query || "").trim();
    if (!typed) {
      onChange("");
      return;
    }
    let match = parishes.find(
      (p) => (p.parish || "").toLowerCase() === typed.toLowerCase(),
    );
    if (!match) {
      match = parishes.find((p) =>
        (p.parish || "").toLowerCase().includes(typed.toLowerCase()),
      );
    }
    if (match) {
      onChange(String(match.id));
      setQuery(match.parish);
    } else {
      onChange("");
    }
  };

  const commitSelection = (p) => {
    onChange(String(p.id));
    setQuery(p.parish);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (filtered[highlight]) {
        e.preventDefault();
        commitSelection(filtered[highlight]);
      } else {
        e.preventDefault();
        commitTypedValue();
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          onChange("");
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            commitTypedValue();
            setOpen(false);
          }, 120);
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#4c1d95] focus:ring-2 focus:ring-[#4c1d95]/20 outline-none transition"
        autoComplete="off"
      />

      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No parish found
            </div>
          ) : (
            filtered.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commitSelection(p)}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full text-left px-4 py-2.5 text-sm transition ${
                  i === highlight
                    ? "bg-[#f3e8ff] text-[#4c1d95] font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p.parish}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MEMBERSHIP MODAL
============================================================ */
function MembershipModal({ open, onClose }) {
  const [parishes, setParishes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    parish_id: "",
    receiveMessages: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!open) return;
    axios
      .get(`${BACKEND_URL}/getParishes`)
      .then((res) => setParishes(res.data || []))
      .catch(() => setParishes([]));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm({
        name: "",
        phone: "",
        parish_id: "",
        receiveMessages: true,
      });
      setStatus(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = (form.name || "").trim();
    const trimmedPhone = (form.phone || "").trim();

    if (!trimmedName || !trimmedPhone || !form.parish_id) {
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/joinMember`, {
        name: trimmedName,
        phone: trimmedPhone,
        parish_id: form.parish_id,
        receive_messages: form.receiveMessages ? 1 : 0,
      });
      if (res.data?.Status === "Success") {
        setStatus("success");
        setForm({
          name: "",
          phone: "",
          parish_id: "",
          receiveMessages: true,
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 "
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl border border-gray-200 w-full max-w-md p-6 md:p-8 max-h-[92vh] overflow-y-auto animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h5 className="text-xl font-bold text-gray-900 mb-1">
          Join As A Member
        </h5>
        <p className="text-sm text-gray-500 mb-6">
          Fill in your details and we&apos;ll get in touch with you.
        </p>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Thank you!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your request has been received. We&apos;ll contact you soon.
            </p>
            <button
              onClick={onClose}
              className="bg-[#4c1d95] hover:bg-[#3b1573] text-white font-semibold px-6 py-2.5 rounded-full transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#4c1d95] focus:ring-2 focus:ring-[#4c1d95]/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 0712 345 678"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#4c1d95] focus:ring-2 focus:ring-[#4c1d95]/20 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parish
              </label>
              <SearchableParishSelect
                parishes={parishes}
                value={form.parish_id}
                onChange={(id) =>
                  setForm((prev) => ({ ...prev, parish_id: id }))
                }
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bell size={12} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800">
                    Receive Messages About The Diocese
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Get updates on events, news, and announcements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, receiveMessages: true }))
                  }
                  className={`flex items-center justify-center gap-2 py-1 rounded-lg border text-sm font-semibold transition ${
                    form.receiveMessages
                      ? "bg-[#4c1d95] text-white border-[#4c1d95]"
                      : "bg-white text-gray-600 border-gray-300 hover:border-[#4c1d95]/60"
                  }`}
                >
                  <Bell size={12} /> Yes
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, receiveMessages: false }))
                  }
                  className={`flex items-center justify-center gap-2 py-1 rounded-lg border text-sm font-semibold transition ${
                    !form.receiveMessages
                      ? "bg-gray-700 text-white border-gray-700"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <BellOff size={15} /> Not Now
                </button>
              </div>
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                Please fill in all fields correctly.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4c1d95] hover:bg-[#3b1573] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

            <p className="text-[10px] leading-snug text-gray-400 text-center pt-1">
              We will not share your information with anyone.
            </p>
          </form>
        )}
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-in { animation: modalIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}

/* ============================================================
   HERO CAROUSEL
============================================================ */
function HeroCarousel({ onJoinClick }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getAllSliders`)
      .then((res) => setSlides(res.data || []))
      .catch(() => setSlides([]));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      6000,
    );
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides.length) return null;

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="relative w-full h-[500px] md:h-[640px] overflow-hidden">
      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(-1.5%, -1.5%); }
        }
        .animate-kenburns {
          animation: kenburns 6s ease-out forwards;
          will-change: transform;
        }
      `}</style>

      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img
              key={i === index ? `active-${index}` : `idle-${i}`}
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover ${
                i === index ? "animate-kenburns" : ""
              }`}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <div className="max-w-2xl text-white">
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-4">
                  ACK Diocese of Maseno North
                </span>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 capitalize">
                  {slide.title}
                </h1>
                <p className="text-lg text-white/90 mb-8 capitalize">
                  {slide.caption}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={onJoinClick}
                    className="bg-white text-[#4c1d95] font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition inline-flex items-center gap-2"
                  >
                    Join As A Member <ArrowRight size={16} />
                  </button>
                  <a
                    href="/sermons"
                    className="border border-white/60 text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-[#4c1d95] transition inline-flex items-center gap-2"
                  >
                    <Play size={16} /> Watch Live Events
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   QUICK INFO STRIP
============================================================ */
function QuickInfo() {
  const items = [
    { icon: Clock, title: "Sunday Service", value: "9:00 AM & 11:00 AM" },
    { icon: MapPin, title: "Location", value: "Kakamega & Western Region" },
    { icon: Phone, title: "Call Us", value: "020 2103 103" },
    {
      icon: Mail,
      title: "Email",
      value: "info@ackdioceseofmasenonorth.org",
    },
  ];

  return (
    <section className="-mt-16 relative z-30 max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center flex-shrink-0">
              <item.icon size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                {item.title}
              </div>
              <div className="text-gray-800 text-xs">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   WELCOME / ABOUT
============================================================ */
function Welcome() {
  const [bishop, setBishop] = useState({});
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getBishopInfoCurrent`)
      .then((res) => setBishop(res.data?.[0] || {}))
      .catch(() => setBishop({}));
  }, []);

  const paragraphs = (bishop.message || "")
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const VISIBLE_COUNT = 3;
  const visibleParagraphs = expanded
    ? paragraphs
    : paragraphs.slice(0, VISIBLE_COUNT);
  const hasMore = paragraphs.length > VISIBLE_COUNT;

  const yearsServing = getYearsServing(bishop.date_installed);
  const yearsDisplay = yearsServing !== null ? `${yearsServing}+` : "25+";
  const yearsLabel =
    yearsServing === 1
      ? "Year Serving The Community"
      : "Years Serving The Community";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
        <div className="relative">
          <img
            src={bishop.image || "/logo.png"}
            alt={bishop.bishop_name || "Bishop"}
            className="rounded-2xl shadow-lg w-full h-[420px] object-cover"
          />
          <div className="absolute -bottom-6 -right-4 md:right-6 bg-[#4c1d95] text-white rounded-2xl p-6 shadow-xl w-48">
            <div className="text-3xl font-bold">{yearsDisplay}</div>
            <div className="text-sm text-white/80">{yearsLabel}</div>
          </div>
        </div>

        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
            Welcome to ACK Maseno North
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-3 leading-tight capitalize">
            {bishop.heading || "A Place To Belong, Believe, and Become"}
          </h2>

          {bishop.bishop_name && (
            <p className="text-sm font-semibold text-[#4c1d95] mb-5 capitalize">
              — {bishop.bishop_name} —
            </p>
          )}

          <div className="relative">
            <div
              className={`space-y-4 ${hasMore && !expanded ? "fade-mask" : ""}`}
            >
              {visibleParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-gray-600 leading-relaxed text-justify"
                >
                  {para}
                </p>
              ))}
            </div>

            {hasMore && !expanded && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
            )}
          </div>

          {hasMore && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-6 inline-flex items-center gap-2 text-[#4c1d95] font-semibold text-sm hover:gap-3 transition-all"
            >
              {expanded ? "Read Less" : "Read More"}
              <ChevronRight
                size={16}
                className={`transition-transform duration-300 ${
                  expanded ? "rotate-90" : ""
                }`}
              />
            </button>
          )}

          <div className="grid sm:grid-cols-2 gap-4 my-8">
            {[
              { icon: BookOpen, text: "Biblical Teaching" },
              { icon: Users, text: "Loving Community" },
              { icon: HandHeart, text: "Community Outreach" },
              { icon: Handshake, text: "Spirit-Filled Worship" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                  <item.icon size={18} />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <a
            href="/about"
            className="inline-flex items-center gap-2 bg-[#4c1d95] hover:bg-[#3b1573] text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Learn More About Us <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <style>{`
        .fade-mask {
          -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   MISSION / VISION / VALUES
============================================================ */
function MissionVision() {
  const cards = [
    {
      icon: Cross,
      title: "Our Mission",
      text: "To equip God's people for wholesome transformation",
    },
    {
      icon: Handshake,
      title: "Our Vision",
      text: "An Empowered, Sustainable and Mission Oriented Diocese boldly proclaiming Christ",
    },
    {
      icon: ShieldCheck,
      title: "Our Values",
      text: "Faith in God, Integrity, Unity, Professionalism, Transparency and Accountability",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
            What Drives Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Our Foundation
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
            >
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                <c.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {c.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   UPCOMING EVENTS
============================================================ */
function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getAllEvents`)
      .then((res) => setEvents(res.data || []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What's Happening
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Upcoming Events
            </h2>
          </div>
          <a
            href="/events"
            className="inline-flex items-center gap-2 text-[#4c1d95] font-semibold hover:gap-3 transition-all"
          >
            View All Events <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 6).map((e, i) => {
            const dateStr = e.date
              ? moment.utc(e.date).format("DD MMM YYYY")
              : "";
            const [day, month] = dateStr.split(" ");
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={e.image || "/service1.jpg"}
                    alt={e.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {day && (
                    <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 text-center shadow-md">
                      <div className="text-[#4c1d95] font-bold text-lg leading-none">
                        {day}
                      </div>
                      <div className="text-[0.65rem] uppercase text-gray-500 tracking-wider">
                        {month}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 capitalize">
                    {e.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#9333ea]" /> {e.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#9333ea]" />{" "}
                      {e.location || "Main Sanctuary"}
                    </div>
                  </div>
                  <a
                    href="/events"
                    className="mt-4 inline-flex items-center gap-1 text-[#4c1d95] font-semibold text-sm hover:gap-2 transition-all"
                  >
                    Learn More <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="/events"
            className="inline-flex items-center gap-2 bg-[#4c1d95] hover:bg-[#3b1573] text-white font-semibold px-8 py-3 rounded-full transition shadow-md"
          >
            View More Events <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SERMONS / VIDEO GALLERY
============================================================ */
function Sermons() {
  const [sermons, setSermons] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getSermons`)
      .then((res) => setSermons(res.data || []))
      .catch(() => setSermons([]));
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Listen & Watch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Latest Sermons
            </h2>
          </div>
          <a
            href="/sermons"
            className="inline-flex items-center gap-2 text-[#4c1d95] font-semibold hover:gap-3 transition-all"
          >
            All Sermons <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sermons.slice(0, 3).map((s, i) => {
            const embed = getYouTubeEmbedUrl(s.link);
            const videoId = getYouTubeVideoId(s.link);
            const thumb =
              s.image ||
              (videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : "/service1.jpg");

            return (
              <div
                key={i}
                className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-56 overflow-hidden bg-black">
                  {embed ? (
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full h-full"
                    >
                      <img
                        src={thumb}
                        alt={s.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6 text-[#4c1d95] ml-1"
                            fill="currentColor"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  ) : (
                    <img
                      src={s.image || "/service1.jpg"}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 capitalize">
                    {s.title}
                  </h3>
                  {s.created_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <Calendar size={12} />
                      {moment.utc(s.created_at).format("DD MMM YYYY • h:mm A")}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 capitalize">
                    {s.preacher || s.speaker || ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LATEST NEWS
============================================================ */
function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getAllNews`)
      .then((res) => setNews(res.data || []))
      .catch(() => setNews([]));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Stay Updated
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Latest News{" "}
            </h2>
          </div>
          <a
            href="/news"
            className="inline-flex items-center gap-2 text-[#4c1d95] font-semibold hover:gap-3 transition-all"
          >
            All News <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 6).map((n, i) => (
            <a
              key={i}
              href={`/news/details?id=${n.id}`}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={n.file}
                  alt={n.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar size={12} />
                  {n.created_at
                    ? moment.utc(n.created_at).format("DD MMM YYYY")
                    : ""}
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#4c1d95] transition capitalize leading-snug">
                  {n.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/news"
            className="inline-flex items-center gap-2 bg-[#4c1d95] hover:bg-[#3b1573] text-white font-semibold px-8 py-3 rounded-full transition shadow-md"
          >
            View More News <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ADMINISTRATION (marquee)
============================================================ */
function Administration() {
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getOffices`)
      .then((res) => setOffices(res.data || []))
      .catch(() => setOffices([]));
  }, []);

  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const dragMoved = useRef(false);
  const pointerDownX = useRef(0);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    setDragging(true);
    dragMoved.current = false;
    pointerDownX.current = e.clientX;
    startX.current = e.clientX;
    scrollStart.current = trackRef.current.scrollLeft;
  };

  const onPointerMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    if (Math.abs(e.clientX - pointerDownX.current) > 5) {
      dragMoved.current = true;
    }
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = scrollStart.current - dx;
  };

  const endDrag = () => {
    isDragging.current = false;
    setDragging(false);
  };

  const onWheel = (e) => {
    if (!trackRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      trackRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const goToProfile = (office) => {
    if (dragMoved.current) return;
    window.location.href = `/profile?name=${encodeURIComponent(
      office.name,
    )}&id=${encodeURIComponent(office.id) || ""}`;
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let idleTimer;

    const scheduleResume = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        el.classList.remove("paused");
      }, 1500);
    };

    const onInteract = () => {
      el.classList.add("paused");
      scheduleResume();
    };

    el.addEventListener("pointerdown", onInteract);
    el.addEventListener("wheel", onInteract, { passive: true });
    el.addEventListener("touchstart", onInteract, { passive: true });

    return () => {
      clearTimeout(idleTimer);
      el.removeEventListener("pointerdown", onInteract);
      el.removeEventListener("wheel", onInteract);
      el.removeEventListener("touchstart", onInteract);
    };
  }, []);

  if (!offices.length) return null;

  return (
    <section className="relative py-14 md:py-20 w-full overflow-hidden bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#ede9fe]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#c4b5fd] opacity-40 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#a78bfa] opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-[#ddd6fe] opacity-50 blur-3xl" />
        <div className="absolute top-10 right-1/4 w-40 h-40 rounded-full bg-[#e9d5ff] opacity-60 blur-2xl" />
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .admin-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
        }
        .admin-track::-webkit-scrollbar { display: none; }
        .admin-track.dragging { cursor: grabbing; }
        .admin-track.paused .admin-marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
            Administration
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
            Diocesan Leadership &amp; Offices
          </h2>
        </div>

        <div
          ref={trackRef}
          className={`admin-track relative overflow-x-auto overflow-y-hidden px-6 ${
            dragging ? "dragging" : ""
          }`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          onWheel={onWheel}
          style={{ touchAction: "pan-y" }}
        >
          <div className="admin-marquee flex gap-4 w-max animate-[scroll_25s_linear_infinite]">
            {[...offices, ...offices].map((office, i) => (
              <div
                key={i}
                role="link"
                tabIndex={0}
                onClick={() => goToProfile(office)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goToProfile(office);
                  }
                }}
                className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] block cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200/60 group bg-white select-none">
                  <div className="relative h-[220px] md:h-[260px] overflow-hidden">
                    <img
                      src={office.image || office.src}
                      alt={office.name}
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <span className="absolute top-3 left-3 bg-white/90  text-gray-800 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {office.office_name}
                    </span>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-base leading-tight drop-shadow-sm capitalize">
                        {office.title}
                      </p>
                      <p className="text-white/80 text-sm font-medium mt-0.5 capitalize drop-shadow-sm">
                        {office.name}
                      </p>
                    </div>
                  </div>

                  <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA BANNER
============================================================ */
function CTABanner({ onJoinClick, onGiveClick }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&q=80"
        alt="Worship"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#4c1d95]/95 to-[#9333ea]/80" />
      <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
          Come As You Are. <br className="hidden md:block" /> Leave Transformed.
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Whether you are new to the area or searching for a church home, we
          would love to meet you this Sunday.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={onJoinClick}
            className="bg-white text-[#4c1d95] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition inline-flex items-center gap-2"
          >
            Join As A Member <ArrowRight size={16} />
          </button>
          <button
            onClick={onGiveClick}
            className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-[#4c1d95] transition inline-flex items-center gap-2"
          >
            Give Online
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOME PAGE
============================================================ */
export default function HomePage() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [giveOpen, setGiveOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const copyPaybill = () => {
    navigator.clipboard.writeText("880100");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyBankAccount = () => {
    navigator.clipboard.writeText("5087630031");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 1500);
  };

  // Lock body scroll while any modal is open
  useEffect(() => {
    if (joinOpen || giveOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [joinOpen, giveOpen]);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Header />
      <HeroCarousel onJoinClick={() => setJoinOpen(true)} />
      <QuickInfo />
      <Welcome />
      <MissionVision />
      <Events />
      <Sermons />
      <News />
      <Administration />
      <CTABanner
        onJoinClick={() => setJoinOpen(true)}
        onGiveClick={() => setGiveOpen(true)}
      />
      <Footer />

      <MembershipModal open={joinOpen} onClose={() => setJoinOpen(false)} />

      {/* GIVE MODAL */}
      {giveOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70  flex items-center justify-center"
          onClick={() => setGiveOpen(false)}
        >
          <div
            className="bg-white border-2 border-slate-200 rounded-3xl  w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex bg-gradient-to-br from-[#f3e8ff] to-[#faf5ff] items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-100  ">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="text-base font-bold truncate">
                    Give &amp; Support the Ministry
                  </div>
                  <div className="text-[0.65rem] truncate">
                    ACK Diocese of Maseno North
                  </div>
                </div>
              </div>
              <button
                onClick={() => setGiveOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition flex-shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f3e8ff] to-[#faf5ff] p-4">
              <p className="text-sm text-gray-600 mb-5 text-center">
                Your generous giving supports the mission and ministry of the
                diocese. You can give using the details below.
              </p>

              {/* NCBA Bank */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className=" flex items-center justify-center">
                    <Landmark size={16} className="text-slate-600" />
                  </div>
                  <h3 className="font-bold text-slate-600 text-sm">
                    NCBA Bank
                  </h3>
                </div>

                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      1
                    </span>
                    <span>
                      Go to <strong>M-Pesa</strong> menu on your phone
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      2
                    </span>
                    <span>
                      Select <strong>Lipa na M-Pesa</strong> then{" "}
                      <strong>Pay Bill</strong>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      3
                    </span>
                    <span>
                      Enter Business Number:{" "}
                      <button
                        onClick={copyPaybill}
                        className="inline-flex items-center gap-1 font-bold text-[#4c1d95] bg-white border border-[#e9d5ff] px-2 py-0.5 rounded-md hover:bg-[#f3e8ff] transition"
                      >
                        880100
                        {copied ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      4
                    </span>
                    <span>
                      Enter Account Number:{" "}
                      <button
                        onClick={copyBankAccount}
                        className="inline-flex items-center gap-1 font-bold text-[#4c1d95] bg-white border border-[#e9d5ff] px-2 py-0.5 rounded-md hover:bg-[#f3e8ff] transition"
                      >
                        5087630031
                        {copiedBank ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      5
                    </span>
                    <span>
                      Enter the <strong>Amount</strong> you wish to give
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      6
                    </span>
                    <span>
                      Enter your <strong>M-Pesa PIN</strong> and confirm
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
