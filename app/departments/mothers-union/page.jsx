"use client";

import React from "react";
import {
  Users,
  Heart,
  Eye,
  Target,
  Cross,
  ChevronRight,
  CheckCircle2,
  Calendar,
  BookOpen,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function MothersUnion() {
  const pastPresidents = [
    { name: "Mrs. Esheri Olang", period: "1970 – 8 months" },
    { name: "Mrs. Phanice Mundia", period: "1970 – 1992" },
    { name: "Mrs. Margaret Nyandiko Mutingole Oketch", period: "1993 – 2018" },
    { name: "Mrs. Ann Brenda Kascan Asilutwa", period: "2018 – Present" },
  ];

  const pillars = [
    {
      icon: <Target size={18} />,
      label: "Aim",
      text: "To advance the Christian religion through the strengthening of marriage and family life.",
    },
    {
      icon: <Eye size={18} />,
      label: "Vision",
      text: "A stable family grounded in Christ.",
    },
    {
      icon: <Cross size={18} />,
      label: "Mission",
      text: "To promote programs that contribute to the well-being of families.",
    },
    {
      icon: <Heart size={18} />,
      label: "Purpose",
      text: "To strengthen and preserve marriage and Christian family life.",
    },
  ];

  const objectives = [
    "To uphold Christ's teachings on marriage and promote its understanding.",
    "To encourage parents to bring up their children in faith.",
    "To maintain worldwide fellowship in prayer, worship, and service.",
    "To promote social conditions that strengthen family life and protect children.",
    "To support families facing adversity.",
  ];

  const futurePlans = [
    "Develop programs that enhance family life.",
    "Introduce spiritual initiatives that strengthen Christian families.",
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
            <span className="text-white font-semibold">Mothers Union</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Mothers Union
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            A worldwide Christian organization of the Anglican Communion —
            united in prayer, fellowship, and service to strengthen families
            across the Diocese of Maseno North.
          </p>
        </div>
      </section>

      {/* INTRO + PRESIDENT */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="min-w-0">
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Who We Are
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 break-words">
                About the Mothers Union
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                The Mother&apos;s Union is a world-wide Christian organization
                of the Anglican Communion under the patronage of Archbishops,
                Bishops, and Priests — united in prayer and fellowship. The
                Diocese of Maseno North Mothers Union has various committees led
                by women office bearers including the chairperson, secretary,
                and treasurer.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words text-justify">
                Founded by Mrs. Mary Elizabeth Sumner in 1876 at Old Arresford,
                Hampshire, England, the Mothers Union was created to uphold
                Christian family life through prayer, teaching, and
                encouragement of mothers. Her legacy continues to inspire
                families globally.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-[#f3e8ff] text-[#4c1d95] text-xs font-semibold px-3 py-2 rounded-full">
                  <Calendar size={14} />
                  Founded 1876
                </span>
                <span className="inline-flex items-center gap-2 bg-[#f3e8ff] text-[#4c1d95] text-xs font-semibold px-3 py-2 rounded-full">
                  <Users size={14} />
                  Worldwide Fellowship
                </span>
                <span className="inline-flex items-center gap-2 bg-[#f3e8ff] text-[#4c1d95] text-xs font-semibold px-3 py-2 rounded-full">
                  <BookOpen size={14} />
                  In Kenya since 1908
                </span>
              </div>
            </div>

            {/* President Card */}
            <div className="relative w-full min-w-0">
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-[#9333ea]/10 hidden md:block pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-[#4c1d95]/10 hidden md:block pointer-events-none" />

              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <img
                  src="https://ackdioceseofmasenonorth.org/photos/image.png"
                  alt="Mrs. Ann Brenda Kascan Asilutwa"
                  className="w-full h-[320px] md:h-[420px] object-cover"
                />
                <div className="p-5 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                    <Heart size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      Mrs. Ann Brenda Kascan Asilutwa
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold truncate">
                      Mothers&apos; Union President
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Story
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              History & Leadership
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              From its founding in England to its growth across Kenya and the
              Diocese of Maseno North.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 min-w-0">
              <h3 className="text-base font-semibold text-[#4c1d95] mb-3 flex items-center gap-2">
                <BookOpen size={18} />
                Mothers Union in Kenya
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                The Mothers&apos; Union began in Kenya in 1908 with women
                fellowships among the wives of settlers, government officials,
                and church leaders. African women were first enrolled in 1956
                after training on the movement&apos;s objectives. In all
                dioceses, the Bishop&apos;s wife is the president, while the
                Archbishop&apos;s wife serves as the provincial president.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 min-w-0">
              <h3 className="text-base font-semibold text-[#4c1d95] mb-3 flex items-center gap-2">
                <Users size={18} />
                In the Diocese of Maseno North
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                The Mothers&apos; Union started in the Diocese of Maseno North
                in 1972. Members were trained and enrolled the same year — a
                practice that continues to this day.
              </p>
            </div>
          </div>

          {/* Past Presidents */}
          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#9333ea]" />
              Past & Present Presidents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {pastPresidents.map((p, i) => (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5 overflow-hidden min-w-0"
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center text-sm font-bold shadow-sm mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 break-words">
                    {p.name}
                  </h4>
                  <p className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold">
                    {p.period}
                  </p>
                  <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS: AIM / VISION / MISSION / PURPOSE */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What Drives Us
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Aim, Vision, Mission & Purpose
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow min-w-0"
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
      </section>

      {/* OBJECTIVES & FUTURE PLANS */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Objectives */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Target size={20} className="text-[#9333ea]" />
                Objectives / Functions
              </h3>
              <ul className="space-y-3">
                {objectives.map((item, i) => (
                  <li key={i} className="flex gap-3 min-w-0">
                    <CheckCircle2
                      size={18}
                      className="text-[#9333ea] flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed break-words">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Future Plans */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Eye size={20} className="text-[#9333ea]" />
                Future Plans
              </h3>
              <ul className="space-y-3">
                {futurePlans.map((item, i) => (
                  <li key={i} className="flex gap-3 min-w-0">
                    <CheckCircle2
                      size={18}
                      className="text-[#9333ea] flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed break-words">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-[#f3e8ff] border border-[#e9d5ff]">
                <p className="text-xs text-[#4c1d95] leading-relaxed">
                  <strong>Join us</strong> — the Mothers&apos; Union welcomes
                  women across the Diocese to grow in faith, fellowship, and
                  service to families.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-bold mb-2 break-words">
              Be Part of the Mothers Union
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Strengthen your family and your faith. Join a fellowship of women
              committed to Christ and one another.
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
