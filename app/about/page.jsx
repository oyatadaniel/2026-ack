"use client";

import React from "react";
import {
  Church,
  Target,
  Eye,
  BookOpen,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AboutUs() {
  const coreValues = [
    {
      title: "Commitment",
      desc: "We shall demonstrate commitment to propagation of the gospel of Jesus Christ and the Anglican Church belief system and demonstrate Christian values in daily activities.",
    },
    {
      title: "God Fearing (Spiritual Transformation)",
      desc: "We shall be guided by strong Christian values in carrying out our mandate as outlined in the Bible and always uphold Christian ideals.",
    },
    {
      title: "Stewardship",
      desc: "We shall be good stewards of, and be accountable for, the human and material resources that God has entrusted to our care.",
    },
    {
      title: "Justice and Equity",
      desc: "We shall endeavor to do what is right at all times, both in the eyes of God and humanity.",
    },
    {
      title: "Inclusion",
      desc: "We shall treat people with dignity, respect, and sensitivity towards religious, gender, class, educational, and cultural differences.",
    },
  ];

  const pillars = [
    {
      icon: <Eye size={18} />,
      label: "Vision Statement",
      text: "A strong, vibrant, self-sustaining diocese proclaiming Christ.",
    },
    {
      icon: <Target size={18} />,
      label: "Mission Statement",
      text: "To build a spiritually-sound, stable and self-reliant Diocese, empowered by the Word of God to love Him and engage the world faithfully, pointing it to Jesus Christ.",
    },
    {
      icon: <BookOpen size={18} />,
      label: "Our Theme",
      text: "A Prosperous God-Fearing Diocese (Proverbs 9:10)",
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
            <span className="text-white font-semibold">About Us</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            About Our Diocese
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            A strong, vibrant, self-sustaining diocese proclaiming Christ across
            Western Kenya — rooted in the Word and committed to serving our
            communities.
          </p>
        </div>
      </section>

      {/* ABOUT + IMAGE */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div className="min-w-0">
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Who We Are
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-5 break-words">
                About Diocese
              </h2>

              <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words">
                The Anglican Church of Kenya (ACK) Diocese of Maseno North
                operates in Vihiga (entire County) and parts of Kakamega County
                (Lurambi, Ikolomani, Shinyalu, Malava, Navakholo, Lugari,
                Likuyani), Maseno Township (Eluhobe, Esianganyi), Siaya County
                (part of Gem) and Bungoma County (Tongaren). The headquarters of
                the Diocese is in Kakamega County, Kakamega town, along Webuye –
                Kakamega – Kisumu Road.
              </p>

              {/* Pillars */}
              <div className="mt-8 space-y-4">
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
              <img
                src="/IMG-20230210-WA0004.jpg"
                alt="Diocese Admin"
                className="relative w-full h-[320px] md:h-[480px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 bg-white/95 backdrop-blur rounded-2xl shadow-md p-4 flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center">
                  <Church size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-[#9333ea] font-semibold truncate">
                    Diocese Headquarters
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    Kakamega Town, Kenya
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              What Guides Us
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Our Core Values
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              The principles that shape our ministry, our people, and our
              service to the community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-6 overflow-hidden min-w-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#9333ea] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <CheckCircle2
                    size={18}
                    className="text-[#9333ea] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2 break-words">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  {value.desc}
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
              Be Part of Our Story
            </h3>
            <p className="text-white/85 text-sm max-w-xl break-words">
              Join us in worship, service, and fellowship. There's a place for
              you in the Diocese of Maseno North.
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
              href="/site/archdeaconries"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/20 transition whitespace-nowrap"
            >
              Our Parishes
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
