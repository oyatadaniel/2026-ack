"use client";

import React from "react";
import {
  Users,
  Eye,
  Target,
  Cross,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Quote,
  Shield,
  UserCheck,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Kama() {
  const chairmen = [
    { name: "Lay Canon William Olaka", period: "2001 – 2004" },
    { name: "Ven. George Mbati", period: "2004 – 2018" },
    { name: "Ven. Fredrick Yakwa", period: "2018 – 2019" },
    { name: "Ven. Josphat Indeche", period: "2019 – 2021" },
    { name: "Rev. Joseph Emonyi", period: "2021 – Present" },
  ];

  const objectives = [
    "To promote spiritual empowerment.",
    "To promote economic empowerment.",
    "To uphold Christian, family, and marriage values.",
    "To encourage community service and partnerships.",
    "To enhance education and training.",
  ];

  const functions = [
    "To encourage men to serve the Lord and spread the Gospel, just as Christ was sent by the Father.",
    "To encourage men to benchmark and learn from others to improve their livelihoods.",
    "To initiate and manage projects such as the Bus Project and other micro-enterprises.",
  ];

  const pillars = [
    {
      icon: <Eye size={18} />,
      label: "Vision",
      text: "A caring Anglican man boldly proclaiming Christ.",
    },
    {
      icon: <Target size={18} />,
      label: "Mission",
      text: "To equip Anglican men to transform the family, church, and society through the Gospel.",
    },
    {
      icon: <Quote size={18} />,
      label: "Motto",
      text: '"As for me and my household, we will serve the Lord." — Joshua 24:15',
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
            <span className="text-white font-semibold">KAMA</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Kenya Anglican Men&apos;s Association
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            Equipping Anglican men to transform the family, church, and society
            through the Gospel — with over 1,000 active members across the
            Diocese.
          </p>
        </div>
      </section>

      {/* INTRO + STATS */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Text */}
            <div className="min-w-0">
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Who We Are
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 break-words">
                About KAMA
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                KAMA is a department within the Anglican Church of Kenya (ACK) —
                the youngest in both the Province of Kenya and the Diocese.
                Before KAMA, men&apos;s issues were addressed through various
                associations such as the Fathers Union and Fathers Association.
                For example, Maseno North Diocese had a Fathers Association,
                while Mount Kenya South pioneered the Fathers Union in 1985.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                These associations each had their own constitutions, which led
                to a lack of provincial coordination. Between 2000 and 2001,
                several meetings were held at the provincial level to harmonize
                the constitutions and establish one unified department under the
                umbrella of the{" "}
                <strong className="text-[#4c1d95]">
                  Kenya Anglican Men&apos;s Association (KAMA)
                </strong>
                . The Provincial Synod officially recognized and blessed KAMA in
                July 2001.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words text-justify">
                KAMA was launched in the Diocese of Maseno North in September
                2021 with the enrollment of about 80 men by Bishop Emeritus
                Simon Oketch. Later that year, Archbishop (then Most Rev. Dr.
                David Kitari) enrolled an additional 142 clergy. Today, the
                association proudly has over{" "}
                <strong className="text-[#4c1d95]">1,000 active members</strong>
                .
              </p>
            </div>

            {/* Stats + Highlights */}
            <div className="relative w-full min-w-0">
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-[#9333ea]/10 hidden md:block pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-[#4c1d95]/10 hidden md:block pointer-events-none" />

              <div className="relative grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                    <Users size={18} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    1,000+
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold mt-1">
                    Active Members
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                    <BookOpen size={18} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    2001
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold mt-1">
                    Recognized by Synod
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                    <Shield size={18} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    2021
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold mt-1">
                    Launched in Diocese
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                    <UserCheck size={18} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    222
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold mt-1">
                    Initial Enrollees
                  </div>
                </div>
              </div>

              {/* Motto Highlight */}
              <div className="relative mt-6 bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-6 overflow-hidden">
                <Quote
                  size={48}
                  className="absolute top-4 right-4 text-white/10"
                />
                <div className="relative">
                  <div className="text-[0.65rem] uppercase tracking-wider text-[#c4b5fd] font-semibold mb-2">
                    Our Motto
                  </div>
                  <p className="text-base md:text-lg font-semibold leading-relaxed italic">
                    &ldquo;As for me and my household, we will serve the
                    Lord.&rdquo;
                  </p>
                  <p className="text-xs text-white/80 mt-2">— Joshua 24:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Leadership
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Leadership & Chairmen
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              Guiding KAMA through its growth and mission across the Diocese of
              Maseno North.
            </p>
          </div>

          {/* Coordinator Card */}
          <div className="mb-10">
            <div className="relative bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white" />
              </div>
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
                <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <UserCheck size={24} />
                </div>
                <div className="min-w-0">
                  <div className="text-[0.65rem] uppercase tracking-wider text-[#c4b5fd] font-semibold mb-1">
                    Coordinator
                  </div>
                  <div className="text-lg md:text-xl font-bold break-words">
                    Lay Canon William Olaka
                  </div>
                  <div className="text-sm text-white/80 mt-1">
                    2001 – Present
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chairmen Grid */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#9333ea]" />
            Chairmen Through the Years
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {chairmen.map((c, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5 overflow-hidden min-w-0"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center text-sm font-bold shadow-sm mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1 break-words">
                  {c.name}
                </h4>
                <p className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold">
                  {c.period}
                </p>
                {i === chairmen.length - 1 && (
                  <span className="inline-block mt-3 text-[0.6rem] uppercase tracking-wider bg-[#f3e8ff] text-[#4c1d95] font-semibold px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
                <div className="absolute bottom-0 left-5 right-5 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTIVES & FUNCTIONS */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What We Do
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Objectives & Functions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Objectives */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Target size={20} className="text-[#9333ea]" />
                Objectives
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

            {/* Functions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Cross size={20} className="text-[#9333ea]" />
                Functions
              </h3>
              <ul className="space-y-3">
                {functions.map((item, i) => (
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
          </div>
        </div>
      </section>

      {/* VISION / MISSION / MOTTO */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What Guides Us
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Vision, Mission & Motto
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 overflow-hidden min-w-0"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-[#9333ea] font-semibold mb-2">
                  {p.label}
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words">
                  {p.text}
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
              Join KAMA
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Be part of a fellowship of men committed to spiritual growth,
              family values, and community service.
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
