"use client";

import React from "react";
import {
  Music,
  Mic2,
  Palette,
  Users,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  Radio,
  Heart,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function MusicDepartment() {
  const objectives = [
    "To spread the gospel through Music, Drama, and Poetry.",
    "To promote our Anglican church hymns.",
    "To encourage creativity.",
    "Nurturing talents among the children, youths, and adults.",
    "To provide a forum for Christian interaction.",
    "To encourage the study of the Bible through memory verses.",
  ];

  const activities = [
    "Music workshops facilitated by Music Technicians.",
    "Music festivals during the month of December.",
  ];

  const festivals = [
    {
      date: "13-12-2021",
      label: "Diocesan Festivals",
      venue: "Christ Church Cathedral",
    },
    {
      date: "17-12-2021",
      label: "Regional Festivals",
      venue: "Mumias Cathedral",
    },
  ];

  const pillars = [
    {
      icon: <Radio size={18} />,
      label: "Board of Communication",
      text: "The Music Department falls under the Board of Communication, alongside Print Media and Public Relations.",
    },
    {
      icon: <Users size={18} />,
      label: "Leadership Structure",
      text: "Headed by the Music Coordinator under the patronage of the Diocesan Bishop, with representation from every Archdeaconry.",
    },
    {
      icon: <Music size={18} />,
      label: "Music Technicians",
      text: "A six-member team of Music Technicians who advise, plan, and organize church and festival songs.",
    },
  ];

  const focusAreas = [
    {
      icon: <Music size={18} />,
      label: "Music",
      text: "Worshipping and giving praise unto God through song.",
    },
    {
      icon: <Mic2 size={18} />,
      label: "Drama",
      text: "Spreading the gospel through dramatic presentations.",
    },
    {
      icon: <Palette size={18} />,
      label: "Poetry",
      text: "Creative expression of faith through poetic works.",
    },
    {
      icon: <Sparkles size={18} />,
      label: "Talent Nurturing",
      text: "Developing gifts among children, youths, and adults.",
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
            <span className="text-white font-semibold">Music</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Music Department
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            Spreading the gospel through Music, Drama, and Poetry — encouraging
            singing as a way of worshipping and giving praise unto God.
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
                About Music Department
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                Following the organization structure of the Diocesan strategic
                plan, the Music Department falls under the Board of
                Communication, which also consists of Print Media and Public
                Relations. The department is headed by the Music Coordinator
                under the patronage of the Diocesan Bishop.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                Each Archdeaconry has at least one member in the committee,
                along with a six-member team of Music Technicians who advise,
                plan, and organize church and festival songs.
              </p>

              {/* Note Highlight */}
              <div className="relative bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-5 overflow-hidden mb-6">
                <Heart
                  size={48}
                  className="absolute top-3 right-3 text-white/10"
                />
                <div className="relative flex items-start gap-3">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Music size={18} />
                  </div>
                  <p className="text-sm leading-relaxed pt-1">
                    <strong className="text-[#c4b5fd]">NOTE:</strong> Music and
                    Drama Department encourages singing as a way of worshipping
                    and giving praise unto God.
                  </p>
                </div>
              </div>

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
                  src="https://ackdioceseofmasenonorth.org/photos/music.jpg"
                  alt="Rev. Dickson Malenje"
                  className="w-full h-[320px] md:h-[480px] object-cover"
                />
                <div className="p-5 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                    <Music size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      Rev. Dickson Malenje
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold truncate">
                      Diocesan Music/Drama Coordinator
                    </div>
                  </div>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {focusAreas.map((f, i) => (
                  <div
                    key={i}
                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-4 overflow-hidden min-w-0"
                  >
                    <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                      {f.icon}
                    </div>
                    <div className="text-xs font-semibold text-gray-900 mb-1 break-words">
                      {f.label}
                    </div>
                    <p className="text-[0.7rem] text-gray-600 leading-relaxed break-words">
                      {f.text}
                    </p>
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
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
              Our Main Objectives
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* ONGOING ACTIVITIES */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What&apos;s Happening
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Ongoing Activities
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activities */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <BookOpen size={20} className="text-[#9333ea]" />
                Activities
              </h3>
              <ul className="space-y-3">
                {activities.map((item, i) => (
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

            {/* Festivals */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Calendar size={20} className="text-[#9333ea]" />
                Music Festivals — December
              </h3>
              <div className="space-y-3">
                {festivals.map((f, i) => (
                  <div
                    key={i}
                    className="flex gap-3 bg-[#f3e8ff] border border-[#e9d5ff] rounded-xl p-4 min-w-0"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                      <Calendar size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold">
                        {f.date}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 break-words">
                        {f.label}
                      </div>
                      <div className="text-xs text-gray-600 break-words">
                        {f.venue}
                      </div>
                    </div>
                  </div>
                ))}
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
              Join the Music Department
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Worship God through music, drama, and poetry — and nurture your
              talents in a Christ-centered community.
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
