"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Radio,
  PlayCircle,
  Ticket,
  Loader2,
  X,
  ExternalLink,
  Tv,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ---------- Safe date/time helpers ---------- */

const toDate = (dateStr, timeStr) => {
  if (!dateStr) return null;

  const raw = String(dateStr).trim();
  if (raw.includes("T") || raw.includes(":")) {
    const d = new Date(raw);
    return isNaN(d) ? null : d;
  }

  const dateOnly = raw.split(" ")[0];
  const timeOnly = timeStr ? String(timeStr).trim() : "00:00:00";
  const d = new Date(`${dateOnly}T${timeOnly}`);
  return isNaN(d) ? null : d;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const raw = String(dateStr).trim();

  const datePart = raw.split("T")[0].split(" ")[0];
  const parts = datePart.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    const dt = new Date(y, m - 1, d);
    if (isNaN(dt)) return dateStr;
    return dt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const dt = new Date(raw);
  return isNaN(dt)
    ? dateStr
    : dt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const s = String(timeStr).trim();

  const match = s.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    let hour = Number(match[1]);
    const minute = match[2];
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  const dt = new Date(s);
  return isNaN(dt)
    ? timeStr
    : dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

/* ---------- Component ---------- */

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  /* Live streams state */
  const [liveStreams, setLiveStreams] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [selectedLive, setSelectedLive] = useState(null); // modal with sound

  /* ✅ "now" is set client-side only — avoids SSR/hydration mismatch */
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    getEvents();
    getLiveStreams();
  }, []);

  const getEvents = () => {
    axios
      .get(`${BACKEND_URL}/getAllEvents`)
      .then((res) => {
        setEvents(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  };

  const getLiveStreams = () => {
    setLiveLoading(true);
    axios
      .get(`${BACKEND_URL}/getAllLiveIds`)
      .then((res) => {
        const data = res.data || [];
        setLiveStreams(data);
      })
      .catch((err) => {
        console.error("getAllLiveIds failed, trying fallback:", err);
        axios
          .get(`${BACKEND_URL}/getLatestLiveId`)
          .then((res2) => {
            if (res2.data?.liveId) {
              setLiveStreams([
                {
                  liveId: res2.data.liveId,
                  status: res2.data.status || "active",
                },
              ]);
            } else {
              setLiveStreams([]);
            }
          })
          .catch(() => setLiveStreams([]));
      })
      .finally(() => setLiveLoading(false));
  };

  const getStart = (e) =>
    toDate(e.start_date || e.date, e.start_time || e.time);
  const getEnd = (e) =>
    toDate(
      e.end_date || e.start_date || e.date,
      e.end_time || e.start_time || e.time,
    );

  const isLive = (event) => {
    if (!now) return false; // ✅ guard before mount
    const start = getStart(event);
    const end = getEnd(event);
    if (!start || !end) return false;
    return now >= start && now <= end;
  };

  const upcomingEvents = now
    ? events
        .filter((e) => {
          const s = getStart(e);
          return s && s > now;
        })
        .sort((a, b) => getStart(a) - getStart(b))
    : [];

  const pastEvents = now
    ? events
        .filter((e) => {
          const end = getEnd(e);
          return end && end < now;
        })
        .sort((a, b) => getStart(b) - getStart(a))
    : [];

  const liveEvents = now ? events.filter(isLive) : [];

  const filteredEvents =
    filter === "upcoming"
      ? upcomingEvents
      : filter === "past"
        ? pastEvents
        : events;

  const heroEvent = liveEvents[0] || upcomingEvents[0];

  /* Only streams with status === "active" shown in Live Now section */
  const activeStreams = liveStreams.filter(
    (s) => (s.status || "").toString().toLowerCase() === "active",
  );

  const filters = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "all", label: "All Events" },
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
            <span className="text-white font-semibold">Events</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            Events & Gatherings
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base">
            Join us for worship services, conferences, retreats, and community
            outreach across the diocese. Watch live or plan your visit.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {upcomingEvents.length}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Upcoming
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Radio size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {activeStreams.length}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Live Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE NOW SECTION */}
      {!liveLoading && activeStreams.length > 0 && (
        <section className="relative py-12 bg-gradient-to-br from-rose-50 via-white to-rose-50/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <div>
                <span className="text-xs tracking-[0.3em] uppercase text-rose-600 font-semibold">
                  Happening Now
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  Live Streams
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {activeStreams.map((item, idx) => {
                const liveId = item.liveId || item;
                return (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col sm:flex-row items-stretch"
                  >
                    <button
                      onClick={() => setSelectedLive(liveId)}
                      className="relative w-full sm:w-72 md:w-96 flex-shrink-0 aspect-video sm:aspect-auto bg-black cursor-pointer overflow-hidden"
                      aria-label="Watch live with sound"
                    >
                      <iframe
                        key={`preview-${liveId}`}
                        src={`https://www.youtube.com/embed/${liveId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
                        title="Live Stream Preview"
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        allow="autoplay; encrypted-media; picture-in-picture"
                      />

                      <span className="absolute inset-0 z-10 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-white/0 group-hover:bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                          <PlayCircle
                            size={26}
                            className="text-[#4c1d95] ml-0.5"
                          />
                        </span>
                      </span>

                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-red-600 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full shadow pointer-events-none">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                        </span>
                        LIVE
                      </div>

                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/60 backdrop-blur text-white text-[0.6rem] font-medium px-2 py-1 rounded-full pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                        Muted
                      </div>
                    </button>

                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center min-w-0">
                      <span className="text-[0.65rem] uppercase tracking-wider text-rose-600 font-semibold mb-1">
                        Live Now
                      </span>

                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Church Live Stream
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3">
                        {item.description}. Click{" "}
                        <span className="font-semibold text-[#4c1d95]">
                          Watch Live
                        </span>{" "}
                        to Watch Event.
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Radio size={12} className="text-rose-500" />
                          Broadcasting now
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <Tv size={12} className="text-[#9333ea]" />
                          {liveId}
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center justify-center px-5 py-4 sm:py-0 border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50/50 sm:bg-transparent">
                      <button
                        onClick={() => setSelectedLive(liveId)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] hover:opacity-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition w-full sm:w-auto justify-center"
                      >
                        <PlayCircle size={16} />
                        Watch Live
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED / LIVE BANNER */}
      {heroEvent && (
        <section className="relative -mt-10 md:-mt-14 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-56 md:h-auto">
                <img
                  src={heroEvent.image || heroEvent.file}
                  alt={heroEvent.title}
                  className="w-full h-full object-cover"
                />
                {isLive(heroEvent) && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    LIVE NOW
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-center">
                <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold mb-2">
                  {isLive(heroEvent) ? "Happening Now" : "Featured Event"}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 capitalize mb-3">
                  {heroEvent.title}
                </h2>

                <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#9333ea]" />
                    {formatDate(heroEvent.start_date || heroEvent.date)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#9333ea]" />
                    {formatTime(heroEvent.start_time || heroEvent.time)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#9333ea]" />
                    {heroEvent.venue ||
                      heroEvent.location ||
                      "Diocese Headquarters"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`/site/event-details?id=${heroEvent.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:opacity-95 transition"
                  >
                    <Ticket size={16} />
                    View Details
                  </a>
                  {heroEvent.live_url && (
                    <a
                      href={heroEvent.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-red-700 transition"
                    >
                      <PlayCircle size={16} />
                      Watch Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EVENTS LIST */}
      <section className="py-14 md:py-20 bg-gray-50 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Our Calendar
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                Browse Events
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`text-xs font-semibold px-4 py-2 rounded-lg transition ${
                    filter === f.key
                      ? "bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white shadow-sm"
                      : "text-gray-600 hover:text-[#4c1d95] hover:bg-[#f3e8ff]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Loading events...
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => {
                const live = isLive(event);
                const startDate = event.start_date || event.date;
                const startTime = event.start_time || event.time;
                const endTime = event.end_time;
                const startObj = toDate(startDate, startTime);
                const venue =
                  event.venue || event.location || "Diocese Headquarters";
                return (
                  <div
                    key={event.id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={event.image || event.file}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {live && (
                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full shadow">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                          </span>
                          LIVE
                        </div>
                      )}

                      {startObj && (
                        <div className="absolute top-3 right-3 bg-white rounded-xl shadow-md text-center px-3 py-2">
                          <div className="text-[0.65rem] uppercase font-semibold text-[#9333ea] leading-none">
                            {startObj.toLocaleDateString("en-GB", {
                              month: "short",
                            })}
                          </div>
                          <div className="text-lg font-bold text-gray-900 leading-tight">
                            {startObj.getDate()}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-gray-900 capitalize line-clamp-2 group-hover:text-[#4c1d95] transition-colors">
                        {event.title}
                      </h3>

                      <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                        <p className="text-xs font-semibold text-gray-900 capitalize truncate">
                          {event.name}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <div className="flex items-center gap-1.5">
                            <Clock size={13} className="text-[#9333ea]" />
                            {formatTime(startTime)}
                            {endTime && ` – ${formatTime(endTime)}`}
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin
                              size={13}
                              className="text-[#9333ea] flex-shrink-0"
                            />
                            <span className="truncate">{venue}</span>
                          </div>
                        </div>

                        {event.attendees != null && (
                          <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-[#9333ea]" />
                            {event.attendees} attending
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                        <a
                          href={`/site/event-details?id=${event.id}`}
                          className="text-xs font-semibold text-[#4c1d95] hover:text-[#9333ea] transition-colors inline-flex items-center gap-1"
                        >
                          Details
                          <ChevronRight size={14} />
                        </a>

                        {live && event.live_url && (
                          <a
                            href={event.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 transition flex-shrink-0"
                          >
                            <PlayCircle size={14} />
                            Watch Live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                <Calendar size={24} />
              </div>
              <p className="text-gray-500 text-sm">
                No {filter !== "all" ? filter : ""} events to display.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LIVE PLAYBACK MODAL — WITH SOUND */}
      {selectedLive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedLive(null)}
        >
          <div
            className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Tv size={14} className="text-[#4c1d95]" />
                    Live Stream — With Sound
                  </h2>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    {selectedLive}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.youtube.com/watch?v=${selectedLive}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#4c1d95] bg-[#4c1d95]/10 hover:bg-[#4c1d95]/20 rounded-lg px-3 py-1.5 transition"
                >
                  <ExternalLink size={12} />
                  YouTube
                </a>
                <button
                  onClick={() => setSelectedLive(null)}
                  className="w-8 h-8 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-video bg-black">
              <iframe
                key={selectedLive}
                src={`https://www.youtube.com/embed/${selectedLive}?autoplay=1&playsinline=1&rel=0`}
                title="Live Stream"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              />
            </div>

            <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
              <span className="text-[11px] text-gray-500">
                Live broadcasting from ACK Diocese of Maseno North
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${selectedLive}`}
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

export default Events;
