"use client";

import React from "react";
import {
  Users,
  Heart,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Shield,
  GraduationCap,
  Church,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function ChildrenMinistry() {
  const functions = [
    "Coordinate the work of Sunday School.",
    "Organize courses for Sunday school teachers.",
    "Organize diocesan Sunday school rallies.",
    "Prepare a department budget, raise funds, and evangelize children within the diocese.",
  ];

  const pillars = [
    {
      icon: <BookOpen size={18} />,
      label: "Teaching",
      text: "Nurturing children in the Word of God through Sunday services and follow-up forums at home and in church.",
    },
    {
      icon: <Users size={18} />,
      label: "Mentorship",
      text: "Guiding children through age-based levels with support from Teens' Mentors who model Christian living.",
    },
    {
      icon: <Sparkles size={18} />,
      label: "Capacity Building",
      text: "Equipping children with faith and life skills so they grow into mature, active members of society.",
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
            <span className="text-white font-semibold">Children Ministry</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Children Ministry
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            One of the oldest departments in the diocese — nurturing children in
            faith, discipline, and life skills from their earliest years.
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
                About Children Ministry
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                Children&apos;s ministry is one of the oldest departments in the
                diocese. It focuses on Sunday services for children and
                follow-up forums at home or in church, aiming to nurture their
                faith and life skills.
              </p>

              {/* Pillars */}
              <div className="mt-6 space-y-4">
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
                  src="https://www.cbcity.nsw.gov.au/CaF%20Slider/slider-Children-2.jpg?RenditionID=5"
                  alt="Children Ministry"
                  className="w-full h-[320px] md:h-[480px] object-cover"
                />
                <div className="p-5 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                    <Heart size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      Nurturing Faith & Life Skills
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold truncate">
                      Children&apos;s Ministry
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRIGADE */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Program
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              The Boys&apos; Brigade & The Girls Brigade
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main text */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-4">
                <Shield size={18} />
              </div>
              <div className="text-[0.65rem] uppercase tracking-wider text-[#9333ea] font-semibold mb-2">
                About the Brigade
              </div>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words text-justify">
                The Brigade is a Christian, disciplined, international
                organization for boys and girls. Its goal is to develop mature
                Christians who are knowledgeable and active in society. Children
                advance through levels based on age, with mentorship from
                Teens&apos; Mentors. The ministry focuses on teaching,
                mentoring, and capacity building, ensuring children grow in
                faith and life skills.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                  <GraduationCap size={18} />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Age-Based Levels
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Children advance through structured levels as they grow.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                  <Users size={18} />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Teens&apos; Mentors
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Older youth mentor younger children in faith and life.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                  <BookOpen size={18} />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Teaching
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Grounded in Scripture and Christian doctrine.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-w-0">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                  <Sparkles size={18} />
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Capacity Building
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Developing skills for life and service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCTIONS */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What We Do
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Functions of Children Ministry
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {functions.map((item, i) => (
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
              Partner with Children Ministry
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Help us nurture the next generation in faith, discipline, and
              service to Christ.
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
