"use client";

import React from "react";
import {
  Cross,
  Church,
  Users,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Heart,
  Megaphone,
  Sparkles,
  Target,
  HandHeart,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function MissionDepartment() {
  const keyActivities = [
    {
      icon: <BookOpen size={18} />,
      label: "Capacity Building & Training",
      text: "Envisioning all eight archdeaconries on Church Community Mobilization Process (CCMP) for clergy and laity. Training clergy and heads of departments on proposal writing and project management. CAPA general secretary trained all synod members, clergy, and their spouses on church growth and development.",
    },
    {
      icon: <Sparkles size={18} />,
      label: "Prayer Meetings & Teaching",
      text: 'Monthly Diocesan prayer meetings led by the bishop, and deanery prayer meetings led by the mission coordinator. Teaching on the diocesan theme for 2021-2022: "Fear not little flock, for it has pleased your father to give you the Kingdom" (Luke 12:32). Healing and manifestations of the Holy Spirit observed.',
    },
    {
      icon: <Church size={18} />,
      label: "Church Planting & Youth Outreach",
      text: "Planting churches in Matete, Kilingili, Albators, and Shikoti, Kakamega town, and reaching out to orphans.",
    },
  ];

  const pillars = [
    {
      icon: <Megaphone size={18} />,
      label: "Evangelism Committee",
      text: "One of the committees under the Diocesan Board of Mission, mandated to encourage, strengthen, organize, and oversee evangelistic activities in the diocese.",
    },
    {
      icon: <Cross size={18} />,
      label: "Our Objective",
      text: "To proclaim the gospel of Christ as Savior and Lord of all, calling upon people to accept Christ personally and be reconciled to God.",
    },
    {
      icon: <Target size={18} />,
      label: "Our Purpose",
      text: "To establish God's Kingdom in Maseno North according to His Purpose in Genesis 1:26.",
    },
  ];

  const levels = [
    {
      icon: <Church size={18} />,
      label: "Parish Level",
      text: "Individual parishes carry out missions and evangelism activities with the support of the Parish Priest.",
    },
    {
      icon: <Users size={18} />,
      label: "Diocesan Level",
      text: "A volunteer team of evangelists from different parishes conducts missions, crusades, and rallies — preparing a monthly program for invited parishes.",
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
            <span className="text-white font-semibold">Mission Department</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Mission Department
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            Proclaiming the gospel of Christ as Savior and Lord of all —
            establishing God&apos;s Kingdom in Maseno North according to His
            Purpose.
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
                About Mission Department
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 break-words text-justify">
                This is one of the committees under the Diocesan Board of
                Mission. The Evangelism Committee is mandated to encourage,
                strengthen, organize, and oversee evangelistic activities in the
                diocese.
              </p>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6 break-words text-justify">
                Every Anglican in this diocese is encouraged, trained, and
                equipped to be a witness of Christ within their sphere of
                influence.
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
                  src="https://ackdioceseofmasenonorth.org/photos/mission.jpg"
                  alt="Rev. Laban Otiato"
                  className="w-full h-[320px] md:h-[480px] object-cover"
                />
                <div className="p-5 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                    <HandHeart size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      Rev. Laban Otiato
                    </div>
                    <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold truncate">
                      Mission Coordinator
                    </div>
                  </div>
                </div>
              </div>

              {/* Levels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {levels.map((l, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 min-w-0"
                  >
                    <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-3">
                      {l.icon}
                    </div>
                    <div className="text-xs font-semibold text-gray-900 mb-1 break-words">
                      {l.label}
                    </div>
                    <p className="text-[0.7rem] text-gray-600 leading-relaxed break-words">
                      {l.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ACTIVITIES */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What We Do
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Our Key Activities
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              Building capacity, nurturing prayer, and planting churches across
              the Diocese of Maseno North.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {keyActivities.map((a, i) => (
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
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 break-words">
                  {a.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  {a.text}
                </p>
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
              </div>
            ))}
          </div>

          {/* Theme Highlight */}
          <div className="mt-8 relative bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Heart size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-[0.65rem] uppercase tracking-wider text-[#c4b5fd] font-semibold mb-1">
                  Diocesan Theme 2021–2022
                </div>
                <div className="text-base md:text-lg font-bold break-words">
                  &ldquo;Fear not little flock, for it has pleased your father
                  to give you the Kingdom&rdquo;
                </div>
                <p className="text-sm text-white/80 mt-1">— Luke 12:32</p>
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
              Join the Mission
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Be equipped to be a witness of Christ within your sphere of
              influence.
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
