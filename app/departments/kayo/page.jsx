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
  Sparkles,
  Heart,
  Megaphone,
  GraduationCap,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Kayo() {
  const objectives = [
    "Bring young people to know and love Jesus Christ as Savior and Lord.",
    "Build up young people in knowledge and behavior of the Christian faith.",
    "Educate youth in good Christian character and leadership skills.",
    "Help the Church understand its responsibility towards young people.",
  ];

  const functions = [
    "Organize Diocesan youth rallies, conferences, festivals, competitions, and sports.",
    "Advise the Diocesan Youth Organizer (DYO).",
    "Prepare youth work budgets for approval by the Board of Finance.",
    "Seek ways to raise funds for youth activities.",
    "Reach young people in schools and colleges for mentorship.",
    "Advise and encourage parish youth workers.",
    "Ensure youth groups are active and aligned with diocesan vision.",
    "Provide guidance and counseling services from primary to tertiary institutions.",
  ];

  const futurePlans = [
    "Initiate income-generating projects/programs.",
    "Promote awareness on nurturing young people.",
    "Ensure active parish and archdeaconry leadership under clergy patronage.",
    "Create youth mission and evangelism teams to reach young people in churches, schools, colleges, and communities.",
    "Develop leadership capacity-building forums.",
    "Create opportunities for talent growth through festivals, sports, and extracurricular activities.",
    "Commission KAYO members formally.",
  ];

  const formerLeaders = [
    "Rev. Captain Moses Obatsa",
    "Rev. Eliud Okiring",
    "Rev. Dancan Ndanyi",
    "Rev. Simon Oketch",
    "Rev. Joshua Kalerwa",
    "Rev. Makalama",
    "Rev. Edward Etale",
    "Rev. Charles Apwoka",
    "Rev. Harrison Nyende",
    "Rev. Justo O. Nyamwata",
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
            <span className="text-white font-semibold">KAYO</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Kenya Anglican Youths Organization
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            Raising a generation of young people who know, love, and serve Jesus
            Christ — strong in the Lord and rooted in His Word.
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
                About KAYO
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                KAYO was started in the Maseno North Diocese by{" "}
                <strong className="text-[#4c1d95]">
                  Rev. James Israel Mundia
                </strong>{" "}
                as Youth Advisor/Diocesan Youth Organizer, bringing young people
                together, especially school leavers.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words text-justify">
                Over the years, leadership passed through Rev. Captain Moses
                Obatsa, Rev. Eliud Okiring, Rev. Dancan Ndanyi, Rev. Simon
                Oketch, Rev. Joshua Kalerwa, Rev. Makalama, Rev. Edward Etale,
                Rev. Charles Apwoka, Rev. Harrison Nyende, Rev. Justo O.
                Nyamwata, and currently{" "}
                <strong className="text-[#4c1d95]">Rev. Philip Waka</strong>.
              </p>

              {/* Former Leaders */}
              <div className="mt-6">
                <div className="text-[0.65rem] uppercase tracking-wider text-[#9333ea] font-semibold mb-3">
                  Former Diocesan Youth Organizers
                </div>
                <div className="flex flex-wrap gap-2">
                  {formerLeaders.map((name, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center bg-white border border-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full min-w-0">
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-3xl bg-[#9333ea]/10 hidden md:block pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-3xl bg-[#4c1d95]/10 hidden md:block pointer-events-none" />

              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <img
                  src="https://ackdioceseofmasenonorth.org/photos/kayo.jpg"
                  alt="Rev. Philip Waka"
                  className="w-full h-[320px] md:h-[420px] object-cover"
                />
                <div className="p-5 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      Rev. Philip Waka
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold truncate">
                      Current DYO Director
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOTTO & PROMISE */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Foundation
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Motto & Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Motto */}
            <div className="relative bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden">
              <Quote
                size={64}
                className="absolute top-4 right-4 text-white/10"
              />
              <div className="relative">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-4">
                  <Sparkles size={18} />
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-[#c4b5fd] font-semibold mb-2">
                  KAYO Motto
                </div>
                <p className="text-lg md:text-xl font-semibold leading-relaxed italic">
                  &ldquo;Be strong in the Lord&rdquo;
                </p>
                <p className="text-sm text-white/80 mt-2">— Ephesians 6:10</p>
              </div>
            </div>

            {/* Promise */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-4">
                <Heart size={18} />
              </div>
              <div className="text-[0.65rem] uppercase tracking-wider text-[#9333ea] font-semibold mb-2">
                KAYO Promise
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words">
                I promise to serve Jesus Christ all the days of my life, pray
                and read the Bible daily, encourage other young people to join
                KAYO, and abide by its rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What We Stand For
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Our Objectives
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

      {/* FUNCTIONS */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What We Do
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Our Functions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {functions.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 min-w-0"
              >
                <CheckCircle2
                  size={18}
                  className="text-[#9333ea] flex-shrink-0 mt-0.5"
                />
                <span className="text-sm text-gray-600 leading-relaxed break-words">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUTURE PLANS */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="min-w-0">
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Looking Ahead
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 break-words">
                Future Plans
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 break-words text-justify">
                We are committed to nurturing a vibrant youth community across
                the Diocese — through mission, mentorship, talent development,
                and leadership capacity building.
              </p>

              <div className="relative bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-6 overflow-hidden">
                <Quote
                  size={48}
                  className="absolute top-4 right-4 text-white/10"
                />
                <div className="relative">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-4">
                    <Megaphone size={18} />
                  </div>
                  <p className="text-base font-semibold leading-relaxed">
                    Raising young people who are strong in the Lord — and ready
                    to serve.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {futurePlans.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition min-w-0"
                >
                  <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center text-xs font-bold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed break-words pt-1">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-bold mb-2 break-words">
              Join KAYO
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Be part of a generation of young people who are strong in the Lord
              — growing in faith, leadership, and service.
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
