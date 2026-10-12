"use client";

import React from "react";
import {
  BookOpen,
  Eye,
  Target,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  Users,
  Lightbulb,
  Library,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Tee() {
  const objectives = [
    "Enhance theological knowledge and practical ministry skills.",
    "Train clergy and lay leaders in effective ministry practices.",
    "Provide continuous education through workshops, seminars, and study programs.",
    "Develop and distribute educational resources for congregations and schools.",
  ];

  const pillars = [
    {
      icon: <Eye size={18} />,
      label: "Vision",
      text: "To cultivate a well-informed, faithful, and effective church leadership.",
    },
    {
      icon: <Target size={18} />,
      label: "Mission",
      text: "To provide excellent theological education and mentorship for clergy, lay leaders, and members across the diocese.",
    },
  ];

  const focusAreas = [
    {
      icon: <GraduationCap size={18} />,
      label: "Clergy Training",
      text: "Equipping pastors and church leaders with deep theological grounding.",
    },
    {
      icon: <Users size={18} />,
      label: "Lay Education",
      text: "Empowering all members to grow in knowledge, faith, and ministry skills.",
    },
    {
      icon: <Library size={18} />,
      label: "Resources",
      text: "Developing and distributing educational materials for congregations and schools.",
    },
    {
      icon: <Lightbulb size={18} />,
      label: "Workshops & Seminars",
      text: "Continuous learning through structured study programs and mentoring.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden w-full max-w-full">
      <Header />

      {/* HERO */}
      <section className="relative bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white overflow-hidden w-full">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-16 w-64 h-64 md:w-80 md:h-80 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 w-full">
          <nav className="flex flex-wrap items-center gap-2 text-xs mb-6">
            <a href="/" className="text-white/70 hover:text-white transition">
              Home
            </a>
            <ChevronRight size={14} className="text-white/50 flex-shrink-0" />
            <span className="text-white/70">Departments</span>
            <ChevronRight size={14} className="text-white/50 flex-shrink-0" />
            <span className="text-white font-semibold">TEE</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Theological Education Expertise
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            Strengthening theological foundations and education across the
            diocese — equipping every member with a deep understanding of
            Christian theology.
          </p>
        </div>
      </section>

      {/* INTRO + FOCUS AREAS */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Text */}
            <div className="min-w-0">
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Who We Are
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 break-words">
                About TEE
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                The Theological Education Expertise (TEE) department is
                dedicated to strengthening the theological foundations and
                education across the diocese. This department oversees
                theological programs, clergy training, and lay education
                initiatives to ensure that all members grow in knowledge, faith,
                and practical ministry skills.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 break-words text-justify">
                TEE plays a key role in developing educational resources,
                mentoring church leaders, and organizing workshops and seminars.
                Its vision is to equip every member with a deep understanding of
                Christian theology, enabling them to serve effectively in their
                communities and the wider church.
              </p>

              {/* Vision & Mission Pillars */}
              <div className="space-y-4">
                {pillars.map((p, i) => (
                  <div
                    key={i}
                    className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow min-w-0"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                      {p.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[0.65rem] uppercase tracking-wider text-[#9333ea] font-semibold mb-1">
                        {p.label}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed break-words">
                        {p.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Areas Grid */}
            <div className="relative w-full min-w-0">
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-[#9333ea]/10 hidden md:block pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-[#4c1d95]/10 hidden md:block pointer-events-none" />

              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
                {focusAreas.map((f, i) => (
                  <div
                    key={i}
                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5 overflow-hidden min-w-0"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center mb-4 shadow-sm">
                      {f.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 break-words">
                      {f.label}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed break-words">
                      {f.text}
                    </p>
                    <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What We Do
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Our Objectives
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              Building a well-informed, faithful, and effective church through
              structured theological education.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {objectives.map((item, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 overflow-hidden min-w-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <CheckCircle2
                    size={18}
                    className="text-[#9333ea] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  {item}
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-bold mb-2 break-words">
              Grow in Theological Knowledge
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Join our programs and be equipped for effective ministry and
              service in your community.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a
              href="/site/contact"
              className="inline-flex items-center gap-2 bg-white text-[#4c1d95] font-semibold text-sm px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition whitespace-nowrap"
            >
              Contact Us
              <ChevronRight size={16} />
            </a>
            <a
              href="/site/departments"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/20 transition whitespace-nowrap"
            >
              Other Departments
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
