"use client";

import React from "react";
import {
  GraduationCap,
  BookOpen,
  School,
  Users,
  ChevronRight,
  CheckCircle2,
  Building2,
  Award,
  Church,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Education() {
  const stats = [
    {
      icon: <School size={18} />,
      value: "52",
      label: "Primary Schools",
      sub: "Sponsored by the Diocese",
    },
    {
      icon: <GraduationCap size={18} />,
      value: "24",
      label: "Secondary Schools",
      sub: "Sponsored by the Diocese",
    },
    {
      icon: <Building2 size={18} />,
      value: "6",
      label: "TVET Institutions",
      sub: "Maseno, Nzalwa, Nzoia, Lugari, Mautuma, Soy",
    },
    {
      icon: <Award size={18} />,
      value: "4",
      label: "Academies",
      sub: "Bishop Oketch, Sunrise, All Saints, Good Shepherd",
    },
  ];

  const tvetInstitutions = [
    "Maseno",
    "Nzalwa",
    "Nzoia",
    "Lugari",
    "Mautuma",
    "Soy",
  ];

  const academies = [
    "ACK Bishop Oketch School",
    "Sunrise Maseno",
    "All Saints Mushililie Educational Center",
    "Good Shepherd Maseno (St John Lurambi)",
  ];

  const pillars = [
    {
      icon: <BookOpen size={18} />,
      label: "Our Heritage",
      text: "Rev. Ludwig Kraft established a school in Rabai in 1844 — the foundation of ACK's enduring commitment to education.",
    },
    {
      icon: <Users size={18} />,
      label: "Our Partnership",
      text: "ACK's decade theme — 'A wholesome church for a wholesome Nation' — prioritizes government-church partnership for all-rounded citizens.",
    },
    {
      icon: <Church size={18} />,
      label: "Our Mission",
      text: "To transform society through quality education that nurtures faith, character, and academic excellence.",
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
            <span className="text-white font-semibold">Education</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Education Department
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            Transforming society through quality education — continuing a
            tradition of learning and faith that began in 1844.
          </p>
        </div>
      </section>

      {/* INTRO + IMAGE */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="min-w-0">
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Who We Are
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 break-words">
                About Education Department
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                The Anglican Church of Kenya (ACK) values education as a
                critical avenue to transform society. From its founding,{" "}
                <strong className="text-[#4c1d95]">Rev. Ludwig Kraft</strong>{" "}
                invested in education by establishing a school in Rabai in 1844.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 break-words text-justify">
                ACK&apos;s decade theme,{" "}
                <strong className="text-[#4c1d95]">
                  &ldquo;A wholesome church for a wholesome Nation&rdquo;
                </strong>
                , prioritizes partnership between the government and the church
                to streamline education for all-rounded citizens.
              </p>

              {/* Pillars */}
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

            {/* Image */}
            <div className="relative w-full min-w-0">
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-[#9333ea]/10 hidden md:block pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-[#4c1d95]/10 hidden md:block pointer-events-none" />

              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <img
                  src="https://ackdioceseofmasenonorth.org/photos/education.png"
                  alt="Education Department"
                  className="w-full h-[320px] md:h-[480px] object-cover"
                />
                <div className="p-5 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      Ven. Antony Olwenyi
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold truncate">
                      Diocesan Secretary, Education Department
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Impact
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Education in Numbers
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              The Diocese of Maseno North continues ACK&apos;s tradition of
              investing in education across all levels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 overflow-hidden min-w-0"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#4c1d95] mb-1">
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {s.label}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed break-words">
                  {s.sub}
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TVET & ACADEMIES */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Institutions
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              TVET Institutions & Academies
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              Supporting the government&apos;s 100% transition agenda through
              technical and academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TVET */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">
                    TVET Institutions
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold">
                    6 Institutions
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tvetInstitutions.map((name, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center bg-[#f3e8ff] text-[#4c1d95] text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Academies */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">
                    Academies
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold">
                    4 Academies
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {academies.map((name, i) => (
                  <li key={i} className="flex gap-3 min-w-0">
                    <CheckCircle2
                      size={18}
                      className="text-[#9333ea] flex-shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed break-words">
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Education Day Highlight */}
          <div className="mt-6 relative bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Award size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-[0.65rem] uppercase tracking-wider text-[#c4b5fd] font-semibold mb-1">
                  Annual Celebration
                </div>
                <div className="text-lg md:text-xl font-bold break-words">
                  Education Day
                </div>
                <p className="text-sm text-white/80 mt-1">
                  Celebrating excellent achievements across our schools and
                  institutions.
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
              Partner with Education Department
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Join us in transforming society through quality, faith-based
              education for all-rounded citizens.
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
