"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Search,
  Upload,
  Pencil,
  Trash2,
  X,
  Loader2,
  CalendarDays,
  Radio,
  ExternalLink,
  StopCircle,
  Tv,
  MapPin,
  Link2,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ============================================================
   Extract YouTube live/video ID from many URL shapes
============================================================ */
const extractYouTubeId = (input) => {
  if (!input) return null;
  const str = input.trim();

  if (/^[\w-]{11}$/.test(str)) return str;

  const patterns = [
    /youtube\.com\/live\/([\w-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/v\/([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
  ];

  for (const re of patterns) {
    const m = str.match(re);
    if (m && m[1]) return m[1];
  }

  return null;
};

/* ============================================================
   Status color/label helper
============================================================ */
const getStatusStyle = (status) => {
  const s = (status || "").toString().toLowerCase();

  if (s === "active") {
    return {
      label: "Live",
      dot: "bg-rose-500",
      ping: "bg-rose-400",
      badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
      text: "text-rose-600 dark:text-rose-400",
    };
  }

  if (s === "ended" || s === "expired") {
    return {
      label: "Ended",
      dot: "bg-gray-400",
      ping: null,
      badge: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
      text: "text-gray-500 dark:text-gray-400",
    };
  }

  if (s === "inactive") {
    return {
      label: "Inactive",
      dot: "bg-gray-400",
      ping: null,
      badge: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
      text: "text-gray-500 dark:text-gray-400",
    };
  }

  if (s === "scheduled") {
    return {
      label: "Scheduled",
      dot: "bg-amber-500",
      ping: null,
      badge:
        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      text: "text-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: status || "Unknown",
    dot: "bg-gray-400",
    ping: null,
    badge: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
    text: "text-gray-500 dark:text-gray-400",
  };
};

export default function EventsUpload() {
  /* ---------------- Tabs ---------------- */
  const [activeTab, setActiveTab] = useState("live");

  /* ---------------- Add Event Modal state ---------------- */
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  /* ---------------- Go Live Modal state ---------------- */
  const [showGoLive, setShowGoLive] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const [liveDescription, setLiveDescription] = useState("");
  const [liveSubmitting, setLiveSubmitting] = useState(false);

  /* ---------------- Events list state ---------------- */
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  /* ---------------- Live events state ---------------- */
  const [liveEvents, setLiveEvents] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState("");
  const [selectedLive, setSelectedLive] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseGoLive = () => {
    setShowGoLive(false);
    setLiveUrl("");
    setLiveDescription("");
  };
  const handleShowGoLive = () => setShowGoLive(true);

  /* ---------------- Image ---------------- */
  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => setImage(reader.result);
    } else {
      setImage("");
    }
  };

  /* ---------------- Submit event ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(
        `${BACKEND_URL}/uploadEvent`,
        {
          name: eventName,
          date: eventDate,
          time: eventTime,
          venue,
          description,
          image,
        },
        { headers: { "Content-Type": "application/json" } },
      )
      .then(() => {
        toast.success("Event added successfully");
        setLoading(false);
        setEventName("");
        setEventDate("");
        setEventTime("");
        setVenue("");
        setDescription("");
        setImage("");
        handleClose();
        getEvents();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error("Failed to add event");
      });
  };

  /* ---------------- Submit Go Live ---------------- */
  const handleSubmitGoLive = (e) => {
    e.preventDefault();

    const liveId = extractYouTubeId(liveUrl);
    if (!liveId) {
      toast.error("Could not find a YouTube video ID in that link.");
      return;
    }

    setLiveSubmitting(true);

    axios
      .post(
        `${BACKEND_URL}/saveLiveId`,
        { liveId, description: liveDescription.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then(() => {
        toast.success(`Live event started (${liveId})`);
        setLiveSubmitting(false);
        setLiveUrl("");
        setLiveDescription("");
        setShowGoLive(false);
        fetchLiveEvents();
      })
      .catch((err) => {
        console.error(err);
        setLiveSubmitting(false);
        toast.error("Failed to save live event");
      });
  };

  /* ---------------- Fetch events ---------------- */
  const getEvents = () => {
    axios.get(`${BACKEND_URL}/getAllEvents`).then((res) => {
      setEvents(res.data);
    });
  };

  /* ---------------- Fetch live events ---------------- */
  const fetchLiveEvents = () => {
    setLiveLoading(true);
    axios
      .get(`${BACKEND_URL}/getAllLiveIds`)
      .then((res) => {
        const data = res.data || [];
        setLiveEvents(data);
        if (!data.length) {
          setLiveError("No live events found");
        } else {
          setLiveError("");
        }
      })
      .catch((err) => {
        console.error(err);
        axios
          .get(`${BACKEND_URL}/getLatestLiveId`)
          .then((res2) => {
            if (res2.data?.liveId) {
              setLiveEvents([
                {
                  liveId: res2.data.liveId,
                  status: res2.data.status || "active",
                  description: res2.data.description || "",
                },
              ]);
              setLiveError("");
            } else {
              setLiveEvents([]);
              setLiveError("No live events found");
            }
          })
          .catch(() => {
            setLiveEvents([]);
            setLiveError("Failed to fetch live events");
          });
      })
      .finally(() => setLiveLoading(false));
  };

  useEffect(() => {
    getEvents();
    fetchLiveEvents();
  }, []);

  /* ---------------- Expire live ---------------- */
  const expireLiveEvent = (liveId) => {
    axios
      .post(`${BACKEND_URL}/expireLiveId`, { liveId })
      .then(() => {
        toast.success("Live event expired");
        fetchLiveEvents();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to expire event");
      });
  };

  /* ---------------- Filter + pagination ---------------- */
  const filteredData = events.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  /* ---------------- Tabs config ---------------- */
  const tabs = [
    {
      key: "live",
      label: "Live Events",
      icon: Radio,
      badge: liveEvents.length ? liveEvents.length : null,
    },
    {
      key: "events",
      label: "Other Events",
      icon: CalendarDays,
      badge: events.length || null,
    },
  ];

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Events Management
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Manage the live stream and all church events.
          </p>
        </div>

        {activeTab === "events" && (
          <button
            onClick={handleShow}
            className="inline-flex items-center gap-1.5 text-[11px]  bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-1.5 transition-colors"
          >
            <PlusCircle size={12} />
            Add Event
          </button>
        )}

        {activeTab === "live" && (
          <button
            onClick={handleShowGoLive}
            className="inline-flex items-center gap-1.5 text-[11px] bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-3 py-1.5 transition-colors"
          >
            <Radio size={12} />
            Create Live Event
          </button>
        )}
      </div>

      {/* ---------------- Tabs ---------------- */}
      <div className="flex items-center gap-1 border-b border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 -mb-px border-b-2 transition-colors ${
                isActive
                  ? "border-[#4c1d95] dark:border-[#a78bfa] text-[#4c1d95] dark:text-[#a78bfa]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <Icon size={12} />
              {tab.label}
              {tab.badge && (
                <span
                  className={`ml-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                    tab.key === "live"
                      ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= LIVE TAB ================= */}
      {activeTab === "live" && (
        <div>
          {liveLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2
                size={18}
                className="animate-spin text-[#4c1d95] dark:text-[#a78bfa]"
              />
            </div>
          ) : liveEvents.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-8 text-center">
              <Tv
                size={20}
                className="mx-auto text-gray-300 dark:text-gray-600 mb-2"
              />
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {liveError || "No live events at the moment."}
              </p>
              <button
                onClick={handleShowGoLive}
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-3 py-1.5 transition-colors"
              >
                <Radio size={12} />
                Start a Live Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {liveEvents.map((item, idx) => {
                const liveId = item.liveId || item;
                const status = item.status || "unknown";
                const liveDesc = (item.description || "").trim();
                const s = getStatusStyle(status);
                const isActive =
                  (status || "").toString().toLowerCase() === "active";

                return (
                  <div
                    key={idx}
                    className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl group hover:shadow-md hover:z-20 transition-shadow"
                  >
                    {/* ============ HOVER TOOLTIP ============ */}
                    {liveDesc && (
                      <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-56 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out">
                        <div className="relative bg-gray-900 dark:bg-gray-800 text-white text-[10px] leading-relaxed rounded-lg px-2.5 py-2 shadow-lg border border-gray-700/50 whitespace-pre-wrap break-words">
                          {liveDesc}
                          {/* Arrow */}
                          <span className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 -mt-1 border-r border-b border-gray-700/50" />
                        </div>
                      </div>
                    )}

                    {/* Card header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 rounded-t-xl">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          {s.ping && (
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.ping} opacity-75`}
                            />
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${s.dot}`}
                          />
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide ${s.text}`}
                        >
                          {s.label}
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 truncate max-w-[80px]">
                        {liveId}
                      </span>
                    </div>

                    {/* Video area */}
                    <div className="relative block w-full aspect-video bg-black overflow-hidden">
                      {isActive ? (
                        <iframe
                          key={`live-${liveId}`}
                          src={`https://www.youtube.com/embed/${liveId}?autoplay=1&mute=1&playsinline=1&rel=0`}
                          title="Live Stream"
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                        />
                      ) : (
                        <button
                          onClick={() => setSelectedLive(liveId)}
                          className="relative block w-full h-full cursor-pointer"
                          aria-label="Play live stream"
                        >
                          <img
                            src={`https://img.youtube.com/vi/${liveId}/hqdefault.jpg`}
                            alt="Live thumbnail"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                            <span className="w-9 h-9 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-md">
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 text-[#4c1d95] ml-0.5"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </span>
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Description strip (always visible) */}
                    {liveDesc && (
                      <div
                        className="px-3 py-2 border-t border-gray-100 dark:border-gray-800"
                        title={liveDesc}
                      >
                        <p className="text-[10px] text-gray-600 dark:text-gray-300 line-clamp-2 break-words">
                          {liveDesc}
                        </p>
                      </div>
                    )}

                    {/* Status row */}
                    <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}
                        >
                          <span className={`h-1 w-1 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-1 px-2 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 rounded-b-xl">
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/watch?v=${liveId}`,
                            "_blank",
                          )
                        }
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4c1d95] dark:text-[#a78bfa] hover:underline"
                      >
                        <ExternalLink size={10} />
                        YouTube
                      </button>
                      <button
                        onClick={() => expireLiveEvent(liveId)}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        <StopCircle size={10} />
                        End
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= LIVE PLAYBACK MODAL ================= */}
      {selectedLive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70"
          onClick={() => setSelectedLive(null)}
        >
          <div
            className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Live Stream
                </h2>
              </div>
              <button
                onClick={() => setSelectedLive(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedLive}?autoplay=1&mute=1&playsinline=1`}
                title="Live Stream"
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= GO LIVE MODAL ================= */}
      {showGoLive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60"
          onClick={handleCloseGoLive}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-600 shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Start a Live Event
                </h2>
              </div>
              <button
                onClick={handleCloseGoLive}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmitGoLive}>
              <div className="px-4 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
                {/* ---------------- Description (with spell-check) ---------------- */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      Description
                    </label>
                    <span className="text-[9px] text-gray-400 dark:text-gray-500">
                      {liveDescription.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    spellCheck={true}
                    lang="en"
                    autoCorrect="on"
                    autoCapitalize="sentences"
                    placeholder="What is this live event about? (e.g. Sunday Service — Worship & Word)"
                    value={liveDescription}
                    onChange={(e) => setLiveDescription(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-rose-500/60 transition-colors resize-none"
                  />
                  <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                    Spell-check is on. Right-click any underlined word to fix
                    it.
                  </p>
                </div>

                {/* ---------------- YouTube Link ---------------- */}
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    YouTube Live Link
                  </label>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-youtube absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
                    </svg>

                    <input
                      type="text"
                      placeholder="https://www.youtube.com/live/irIcIKqt8vs..."
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-rose-500/60 transition-colors"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                    Paste the full YouTube link. The video ID will be extracted
                    automatically.
                  </p>
                </div>

                {liveUrl && (
                  <div className="rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-2.5">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                      <Link2 size={10} />
                      Extracted ID
                    </div>
                    {extractYouTubeId(liveUrl) ? (
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] font-mono text-[#4c1d95] dark:text-[#a78bfa] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded px-2 py-1">
                          {extractYouTubeId(liveUrl)}
                        </code>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Valid
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                        ✗ Could not find a YouTube video ID
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                <button
                  type="button"
                  onClick={handleCloseGoLive}
                  className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={liveSubmitting || !extractYouTubeId(liveUrl)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
                >
                  {liveSubmitting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      Going Live...
                    </>
                  ) : (
                    <>
                      <Radio size={12} />
                      Create Live Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EVENTS TAB ================= */}
      {activeTab === "events" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <div className="relative w-full sm:w-72">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by event name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-7 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#4c1d95] dark:bg-[#6d28d9] text-white">
                  <tr className="text-[10px] uppercase tracking-wide">
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Image</th>
                    <th className="px-3 py-2 font-medium">Event Name</th>
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Time</th>
                    <th className="px-3 py-2 font-medium">Venue</th>
                    <th className="px-3 py-2 font-medium">Description</th>
                    <th className="px-3 py-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] text-gray-700 dark:text-gray-300 capitalize">
                  {currentRows.length > 0 ? (
                    currentRows.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td className="px-3 py-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-14 object-cover rounded-md border border-gray-100 dark:border-gray-800"
                          />
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                          {item.name}
                        </td>
                        <td className="px-3 py-2">{item.date}</td>
                        <td className="px-3 py-2">{item.time}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin
                              size={10}
                              className="text-[#4c1d95] dark:text-[#a78bfa]"
                            />
                            {item.venue || "—"}
                          </span>
                        </td>
                        <td
                          className="px-3 py-2 truncate max-w-[200px]"
                          title={item.description}
                        >
                          {item.description}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-md px-2 py-1 transition-colors">
                              <Pencil size={10} />
                              Edit
                            </button>
                            <button className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-md px-2 py-1 transition-colors">
                              <Trash2 size={10} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                      >
                        No events found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <nav className="flex justify-end">
              <ul className="flex items-center gap-1 text-[11px]">
                <li>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-2.5 py-1 rounded-md border transition-colors ${
                        currentPage === i + 1
                          ? "bg-[#4c1d95] dark:bg-[#6d28d9] text-white border-[#4c1d95] dark:border-[#6d28d9]"
                          : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}

      {/* ================= ADD EVENT MODAL ================= */}
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 "
          onClick={handleClose}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-600 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Add New Event
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-4 py-3 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  placeholder="Enter event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Venue
                </label>
                <div className="relative">
                  <MapPin
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Enter venue (e.g. Main Sanctuary)"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  Where the event will take place.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter event description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-[11px] text-gray-600 dark:text-gray-300 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-medium file:bg-[#4c1d95]/10 dark:file:bg-[#6d28d9]/20 file:text-[#4c1d95] dark:file:text-[#a78bfa] hover:file:bg-[#4c1d95]/20 transition-colors"
                />
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  Upload an image for this event.
                </p>
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-2 w-24 h-16 object-cover rounded-md border border-gray-100 dark:border-gray-800"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={handleClose}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    Submit Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
