"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  Search,
  PlayCircle,
  Loader2,
  X,
  ExternalLink,
  Tv,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const ITEMS_PER_PAGE = 6;

/* ============================================================
   YOUTUBE ICON (lucide has no brand icons)
============================================================ */
const YouTubeIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
    aria-hidden="true"
  >
    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
  </svg>
);

/* ============================================================
   YOUTUBE HELPERS
============================================================ */
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|live\/))([\w-]{11})/,
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

const getYouTubeVideoId = (url) => {
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
};

/* ============================================================
   DATE / TIME HELPERS
============================================================ */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ============================================================
   SERMONS PAGE
============================================================ */
const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSermon, setSelectedSermon] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getSermons`)
      .then((res) => setSermons(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch sermons:", err);
        setSermons([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* Filter by title / preacher */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sermons;
    return sermons.filter((s) => {
      const title = (s.title || "").toLowerCase();
      const preacher = (s.preacher || s.speaker || "").toLowerCase();
      return title.includes(q) || preacher.includes(q);
    });
  }, [sermons, search]);

  /* Reset to page 1 whenever the search changes */
  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goToPage = (p) => {
    const target = Math.min(Math.max(1, p), totalPages);
    setPage(target);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* Close modal on Escape */
  useEffect(() => {
    if (!selectedSermon) return;
    const onKey = (e) => e.key === "Escape" && setSelectedSermon(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedSermon]);

  const selectedVideoId = selectedSermon
    ? getYouTubeVideoId(selectedSermon.link)
    : null;

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
            <span className="text-white font-semibold">Sermons</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            Listen & Watch
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            Sermons & Teachings
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base">
            Catch up on messages from our services and special gatherings. Click
            any sermon to watch it right here.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <YouTubeIcon size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {sermons.length}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Total Sermons
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Our Library
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                All Sermons
              </h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or preacher..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#4c1d95]/20 focus:ring-2 focus:ring-[#4c1d95]/20 outline-none transition text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Loading sermons...
            </div>
          ) : paginated.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((s, i) => {
                  const videoId = getYouTubeVideoId(s.link);
                  const thumb =
                    s.image ||
                    (videoId
                      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                      : "/service1.jpg");
                  const embed = getYouTubeEmbedUrl(s.link);

                  return (
                    <button
                      key={i}
                      onClick={() => embed && setSelectedSermon(s)}
                      className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                    >
                      <div className="relative h-52 overflow-hidden bg-black">
                        <img
                          src={thumb}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {embed && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                            <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <PlayCircle
                                size={26}
                                className="text-[#4c1d95]"
                              />
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-semibold text-gray-900 capitalize line-clamp-2 group-hover:text-[#4c1d95] transition-colors">
                          {s.title}
                        </h3>

                        <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                          {(s.preacher || s.speaker) && (
                            <div className="flex items-center gap-1.5">
                              <User size={13} className="text-[#9333ea]" />
                              <span className="capitalize truncate">
                                {s.preacher || s.speaker}
                              </span>
                            </div>
                          )}

                          {s.created_at && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <div className="flex items-center gap-1.5">
                                <Calendar
                                  size={13}
                                  className="text-[#9333ea]"
                                />
                                {formatDate(s.created_at)}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock size={13} className="text-[#9333ea]" />
                                {formatTime(s.created_at)}
                              </div>
                            </div>
                          )}
                        </div>

                        {embed && (
                          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-[#4c1d95]">
                            Watch Sermon
                            <ChevronRight size={14} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(safePage - 1)}
                    disabled={safePage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#4c1d95] hover:text-[#4c1d95] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      return Math.abs(p - safePage) <= 1;
                    })
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && p - prev > 1;
                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && (
                            <span className="px-1 text-gray-400">…</span>
                          )}
                          <button
                            onClick={() => goToPage(p)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                              p === safePage
                                ? "bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white shadow-sm"
                                : "border border-gray-200 bg-white text-gray-600 hover:border-[#4c1d95] hover:text-[#4c1d95]"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}

                  <button
                    onClick={() => goToPage(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#4c1d95] hover:text-[#4c1d95] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {totalPages > 1 && (
                <p className="text-center text-xs text-gray-500 mt-4">
                  Showing {startIdx + 1}–
                  {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of{" "}
                  {filtered.length} sermons
                </p>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                <YouTubeIcon size={24} />
              </div>
              <p className="text-gray-500 text-sm">
                {search
                  ? "No sermons match your search."
                  : "No sermons available yet."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* VIDEO MODAL */}
      {selectedSermon && selectedVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedSermon(null)}
        >
          <div
            className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 gap-3">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 capitalize truncate">
                  {selectedSermon.title}
                </h2>
                <p className="text-[11px] text-gray-500 capitalize mt-0.5 truncate">
                  {selectedSermon.preacher || selectedSermon.speaker || ""}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={selectedSermon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#4c1d95] bg-[#4c1d95]/10 hover:bg-[#4c1d95]/20 rounded-lg px-3 py-1.5 transition"
                >
                  <ExternalLink size={12} />
                  YouTube
                </a>
                <button
                  onClick={() => setSelectedSermon(null)}
                  className="w-8 h-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-video bg-black">
              <iframe
                key={selectedVideoId}
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&playsinline=1&rel=0`}
                title={selectedSermon.title}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              />
            </div>

            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
              <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <Tv size={12} className="text-[#9333ea]" />
                {formatDate(selectedSermon.created_at)}
                {formatTime(selectedSermon.created_at) &&
                  ` • ${formatTime(selectedSermon.created_at)}`}
              </span>
              <a
                href={selectedSermon.link}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:hidden inline-flex items-center gap-1.5 text-xs font-medium text-[#4c1d95]"
              >
                <ExternalLink size={12} />
                YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Sermons;
