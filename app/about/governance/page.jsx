"use client";

import React from "react";
import {
  Landmark,
  Users,
  Church,
  Home,
  ChevronRight,
  Shield,
  Network,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Governance() {
  const governanceLevels = [
    {
      icon: <Landmark size={20} />,
      level: "Highest Organ",
      title: "The Diocesan Synod",
      desc: "This is the highest governance organ of the diocese. It is made up of all canonically resident clergy in good standing and 2 laity from each parish and the ordinary sessions are held once every two years.",
      tag: "Every 2 years",
    },
    {
      icon: <Shield size={20} />,
      level: "Oversight",
      title: "The Standing Committee of the Synod",
      desc: "The Synod elects from its delegates members who together with ex-officio members (Archdeacons, Provost and Administrative Secretary), form the Standing Committee of Synod. It offers oversight to the management of the diocese. It also appoints members to various boards and committees of the diocese.",
      tag: "Oversight & appointments",
    },
    {
      icon: <Users size={20} />,
      level: "Parish Level",
      title: "The Parish Church Council",
      desc: "The parish is governed by the Parish Church Council (PCC) made up of members from Local Churches of the parish. They assist the Vicar or parish priest in managing the affairs of the parish.",
      tag: "PCC",
    },
    {
      icon: <Home size={20} />,
      level: "Local Level",
      title: "The Local Church Council",
      desc: "Every congregation or local church is governed by the Local Church Council which manages its day-to-day services. The diocese also has two other regional levels, the Archdeaconries and Deaneries, which are advisory by nature and assist in unifying the diocese in their delivery of convenient pastoral services. The archdeaconry is managed by an Archdeacon and the deanery is led by a Rural or Urban Dean.",
      tag: "Day-to-day",
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
            <span className="text-white font-semibold">Governance System</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Governance System
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            The structures and organs through which the Diocese of Maseno North
            is guided, shepherded, and administered — from the Diocesan Synod
            down to the Local Church Council.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Network size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">4</div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Governance Organs
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Church size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">Synod</div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Highest Organ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOVERNANCE STRUCTURE */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Structure
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              How the Diocese is Governed
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              From the highest decision-making organ to the local congregation,
              each level plays a distinct role in the life of the Diocese.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {governanceLevels.map((item, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 overflow-hidden min-w-0 flex flex-col"
              >
                {/* Top: icon + level badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-wider bg-[#f3e8ff] text-[#4c1d95] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                    {item.tag}
                  </span>
                </div>

                {/* Level label */}
                <div className="text-[0.65rem] uppercase tracking-wider text-[#9333ea] font-semibold mb-1">
                  {item.level}
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 break-words">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed break-words flex-1">
                  {item.desc}
                </p>

                {/* Hover underline */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STANDING COMMITTEE BANNER */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white rounded-2xl shadow-lg p-6 md:p-10 text-center min-w-0">
            <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Shield size={22} />
            </div>
            <span className="text-xs tracking-[0.3em] uppercase text-[#c4b5fd] font-semibold">
              Standing Committee
            </span>
            <h3 className="text-xl md:text-2xl font-bold mt-3 mb-3 break-words">
              Diocesan Standing Committee
            </h3>
            <p className="text-white/85 text-sm md:text-base max-w-xl mx-auto break-words">
              September 2019 – August 2021
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
