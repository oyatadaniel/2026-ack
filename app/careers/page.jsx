"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  Search,
  Loader2,
  X,
  ChevronRight,
  Building2,
  GraduationCap,
  Send,
  FileText,
  CheckCircle2,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ============================================================
   DATE HELPERS
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

const daysLeft = (deadline) => {
  if (!deadline) return null;
  const d = new Date(deadline);
  if (isNaN(d)) return null;
  const diff = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

/* ============================================================
   CAREERS PAGE
============================================================ */
const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/getAllCareers`)
      .then((res) => setCareers(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch careers:", err);
        setCareers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* Filter by title / department / location */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter((c) => {
      const title = (c.title || c.position || "").toLowerCase();
      const dept = (c.department || "").toLowerCase();
      const loc = (c.location || "").toLowerCase();
      return title.includes(q) || dept.includes(q) || loc.includes(q);
    });
  }, [careers, search]);

  /* Close modal on Escape */
  useEffect(() => {
    if (!selectedJob) return;
    const onKey = (e) => e.key === "Escape" && setSelectedJob(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selectedJob]);

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
            <span className="text-white font-semibold">Careers</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            Join Our Team
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            Careers & Opportunities
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base">
            Serve God and His people through meaningful work. Explore current
            openings at ACK Diocese of Maseno North.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Briefcase size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {careers.length}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  {careers.length === 1 ? "Open Position" : "Open Positions"}
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
                Current Openings
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                Available Positions
              </h2>
            </div>

            {careers.length > 0 && (
              <div className="relative w-full md:w-80">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, department, location..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-[#4c1d95] focus:ring-2 focus:ring-[#4c1d95]/20 outline-none transition text-sm"
                />
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500 flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Loading careers...
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((job, i) => {
                const days = daysLeft(job.deadline || job.closing_date);
                const urgent = days !== null && days >= 0 && days <= 7;
                const closed = days !== null && days < 0;

                return (
                  <div
                    key={job.id || i}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {(job.department || job.category) && (
                          <span className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-wider font-semibold text-[#4c1d95] bg-[#f3e8ff] px-2.5 py-1 rounded-full">
                            <Building2 size={10} />
                            {job.department || job.category}
                          </span>
                        )}
                        {(job.type || job.employment_type) && (
                          <span className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-wider font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                            <Clock size={10} />
                            {job.type || job.employment_type}
                          </span>
                        )}
                        {urgent && !closed && (
                          <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                            Closing Soon
                          </span>
                        )}
                        {closed && (
                          <span className="text-[0.65rem] uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            Closed
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-semibold text-gray-900 capitalize line-clamp-2 group-hover:text-[#4c1d95] transition-colors">
                        {job.title || job.position}
                      </h3>

                      <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                        {job.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#9333ea]" />
                            <span className="capitalize truncate">
                              {job.location}
                            </span>
                          </div>
                        )}

                        {(job.deadline || job.closing_date) && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-[#9333ea]" />
                            Deadline:{" "}
                            {formatDate(job.deadline || job.closing_date)}
                          </div>
                        )}
                      </div>

                      {/* Short description */}
                      {job.description && (
                        <p className="mt-3 text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {String(job.description)
                            .replace(/<[^>]+>/g, "")
                            .slice(0, 140)}
                          ...
                        </p>
                      )}

                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="text-xs font-semibold text-[#4c1d95] hover:text-[#9333ea] transition-colors inline-flex items-center gap-1"
                        >
                          View Details
                          <ChevronRight size={14} />
                        </button>
                        {!closed && (
                          <span className="text-[0.65rem] text-gray-400">
                            {days !== null && days >= 0
                              ? `${days} ${days === 1 ? "day" : "days"} left`
                              : "Open"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                <Briefcase size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {search ? "No matching positions" : "No careers at the moment"}
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto px-4">
                {search
                  ? "Try adjusting your search terms or clear the filter."
                  : "We don't have any open positions right now. Please check back later for new opportunities."}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 inline-flex items-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-95 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold capitalize truncate">
                  {selectedJob.title || selectedJob.position}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px] text-white/80">
                  {(selectedJob.department || selectedJob.category) && (
                    <span className="flex items-center gap-1">
                      <Building2 size={11} />
                      {selectedJob.department || selectedJob.category}
                    </span>
                  )}
                  {selectedJob.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {selectedJob.location}
                    </span>
                  )}
                  {(selectedJob.type || selectedJob.employment_type) && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {selectedJob.type || selectedJob.employment_type}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition flex-shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
              {/* Meta row */}
              <div className="flex flex-wrap gap-3 text-xs">
                {(selectedJob.deadline || selectedJob.closing_date) && (
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-lg font-medium">
                    <Calendar size={13} />
                    Deadline:{" "}
                    {formatDate(
                      selectedJob.deadline || selectedJob.closing_date,
                    )}
                  </div>
                )}
                {selectedJob.salary && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-lg font-medium">
                    <FileText size={13} />
                    {selectedJob.salary}
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedJob.description && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText size={14} className="text-[#9333ea]" />
                    Job Description
                  </h3>
                  <div
                    className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedJob.description,
                    }}
                  />
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <GraduationCap size={14} className="text-[#9333ea]" />
                    Requirements
                  </h3>
                  <div
                    className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedJob.requirements,
                    }}
                  />
                </div>
              )}

              {/* How to apply */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Send size={14} className="text-[#9333ea]" />
                  How to Apply
                </h3>
                <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-xl p-4 text-sm text-gray-700 space-y-2">
                  <p className="flex items-start gap-2">
                    <CheckCircle2
                      size={15}
                      className="text-[#9333ea] mt-0.5 flex-shrink-0"
                    />
                    <span>
                      Send your application letter, CV, and copies of
                      certificates to{" "}
                      <a
                        href={`mailto:${
                          selectedJob.email ||
                          "info@ackdioceseofmasenonorth.org"
                        }`}
                        className="font-semibold text-[#4c1d95] hover:underline"
                      >
                        {selectedJob.email ||
                          "info@ackdioceseofmasenonorth.org"}
                      </a>
                    </span>
                  </p>
                  {(selectedJob.deadline || selectedJob.closing_date) && (
                    <p className="flex items-start gap-2">
                      <CheckCircle2
                        size={15}
                        className="text-[#9333ea] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Applications must reach us on or before{" "}
                        <strong>
                          {formatDate(
                            selectedJob.deadline || selectedJob.closing_date,
                          )}
                        </strong>
                      </span>
                    </p>
                  )}
                  {selectedJob.application_link && (
                    <p className="flex items-start gap-2">
                      <CheckCircle2
                        size={15}
                        className="text-[#9333ea] mt-0.5 flex-shrink-0"
                      />
                      <span>
                        Or apply online:{" "}
                        <a
                          href={selectedJob.application_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#4c1d95] hover:underline"
                        >
                          Click here to apply
                        </a>
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 sm:px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <span className="text-[11px] text-gray-500">
                ACK Diocese of Maseno North
              </span>
              <a
                href={`mailto:${
                  selectedJob.email || "info@ackdioceseofmasenonorth.org"
                }?subject=Application for ${
                  selectedJob.title || selectedJob.position
                }`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-95 transition"
              >
                <Send size={13} />
                Apply via Email
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Careers;
