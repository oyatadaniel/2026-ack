"use client";

import React from "react";
import {
  BookOpen,
  Church,
  Crown,
  Calendar,
  ChevronRight,
  Quote,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const History = () => {
  const bishops = [
    {
      name: "The Rt. Rev Charles Kascan Asilutwa",
      image: "https://ackdioceseofmasenonorth.org/photos/b.jpg",
      current: true,
      lines: [
        "He was consecrated and enthroned on 10th June 2018.",
        "He is the current Bishop of the Diocese.",
      ],
    },
    {
      name: "Bishop Simon Mutingole Oketch",
      image: "",
      lines: [
        "He was consecrated and enthroned as the third Bishop of the Diocese of Maseno North on 17th December 1995.",
        "He served for 25 years.",
        "He retired on 30th June 2018.",
      ],
    },
    {
      name: "The Rt. Rev James Israel Mundia",
      image: "",
      lines: [
        "Was consecrated and enthroned as the second Bishop of the Diocese of Maseno North on 2nd October 1970.",
        "He served the Diocese for a period of 23 years.",
        "Retired on 28th February 1993.",
        "He died in February, 1997.",
      ],
    },
    {
      name: "The Most Rev Festo Olang’",
      image: "",
      lines: [
        "Enthroned Bishop of Maseno in 1960. Upon Sub-division of Maseno, he transited to the see of Maseno North on 1st January 1970 where he served for only eight months.",
        "He was elected as the first African Archbishop of the Province of Kenya in August 1970 and died on Tuesday 3rd Feb 2004 at 95.",
      ],
    },
  ];

  const milestones = [
    {
      year: "1844",
      title: "The First Missionary",
      text: "Dr. Johann Ludwig Krapf of the Church Missionary Society (CMS) arrived in Mombasa and moved 30 miles west to start a church at Rabai. He was joined two years later by Rev. Johann Rebman.",
    },
    {
      year: "1884",
      title: "Diocese of Eastern Equatorial Africa",
      text: "The diocese was created, covering Uganda, Kenya and Tanganyika, with James Hannington as the first Bishop.",
    },
    {
      year: "1898",
      title: "Split into Mombasa",
      text: "The diocese was split into two — the new Diocese of Mombasa governing Kenya and northern Tanzania, while the other later became the Church of Uganda.",
    },
    {
      year: "1906",
      title: "Maseno Mission Station",
      text: "Mr. Hugh Osborn Saville, who had started a CMS station at Vihiga in 1904, relocated to Maseno and established a Mission station on 14th January 1906. Rev. J.J Willies joined him on 21st October 1906.",
    },
    {
      year: "1908",
      title: "St. Paul's Maseno",
      text: "Evangelism work started under the Omuseno tree (hence the name Emuseno and Maseno). The church was built at this spot and the foundation stone laid in August 1908 and named St. Paul's Maseno.",
    },
    {
      year: "1910",
      title: "First Baptisms",
      text: "On 8th May 1909, the first catechumens were admitted and baptized on 30th January 1910 by Rev. Willis. On 3rd January 1912, the Rt. Rev. R. Tucker confirmed fifteen people.",
    },
    {
      year: "1935",
      title: "School of Nursing",
      text: "The Maseno School of Nursing was started with the enrollment of assistant enrolled midwives.",
    },
    {
      year: "1970",
      title: "Diocese of Maseno North",
      text: "Formed by the division of the Diocese of Maseno. The Rt. Rev. Festo Olang' became its first Bishop.",
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
            <span className="text-white font-semibold">History</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words">
            Our History
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base break-words">
            From the arrival of the first CMS missionary in 1844 to the founding
            of the Diocese of Maseno North in 1970 — a story of faith,
            sacrifice, and the growth of the Church in Western Kenya.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">1970</div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Diocese Founded
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Crown size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {bishops.length}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Bishops
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO / LEAD PARAGRAPH */}
      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              A Story of Faith
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-4 break-words">
              The Growth of the Anglican Church in Maseno
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed break-words">
              The history of the Anglican Church of Kenya dates back to 1844
              when the first missionary from the Church Missionary Society
              (CMS), Dr. Johann Ludwig Krapf, arrived in Mombasa. What followed
              was a century of faithful mission work that would eventually give
              birth to the Diocese of Maseno North.
            </p>
          </div>

          {/* MILESTONE TIMELINE */}
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4c1d95] via-[#9333ea] to-[#c4b5fd] opacity-30 md:-translate-x-1/2" />

            <div className="space-y-8">
              {milestones.map((m, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8 ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 top-3 w-4 h-4 rounded-full bg-gradient-to-br from-[#4c1d95] to-[#9333ea] border-4 border-white shadow-md md:-translate-x-1/2 z-10" />

                    {/* Card */}
                    <div className="ml-12 md:ml-0 md:w-1/2 min-w-0">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 md:p-6 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center bg-[#f3e8ff] text-[#4c1d95] text-xs font-bold px-3 py-1 rounded-full">
                            {m.year}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2 break-words">
                          {m.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed break-words">
                          {m.text}
                        </p>
                      </div>
                    </div>

                    {/* Empty spacer for md+ */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* CLOSING NARRATIVE CARD */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center mb-4">
                <BookOpen size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 break-words">
                Archdeacon Ven. Walter Edward Owen & The Continuing Legacy
              </h3>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed break-words">
                <p>
                  One of the priests whose work will not be forgotten is
                  Archdeacon Ven. Walter Edward Owen of Kavirondo. He was
                  appalled by the level of poverty and sickness of the people he
                  interacted with and therefore spearheaded the expansion of the
                  dispensary, which had been started in 1908 at the same place,
                  with funds granted by the Red Cross for the Kavirondo members
                  of the army carrier corps. He championed the rights of the
                  African majority through the Kavirondo Taxpayer's Welfare
                  Association whose aim was to teach civic education and aid
                  economic development.
                </p>
                <p>
                  The Maseno School of Nursing was started in 1935 with
                  enrollment of assistant enrolled midwives. Thirty-five years
                  later, this diocese was formed in 1970 by the division of the
                  Diocese of Maseno, and the Rt. Rev. Festo Olang' became its
                  first Bishop. However, later in the year he was elected first
                  African Archbishop of the Anglican Church, and was succeeded
                  in the Diocese by the Rt. Rev. James I. Mundia, who served
                  until 1993.
                </p>
                <p>
                  The Rt. Rev. Isaack Namango was the assistant Bishop, serving
                  between 1984 to 1987. He then became the 1st Bishop of the
                  newly created Diocese of Nambale. In 1995, the Rt. Rev. Simon
                  M. Oketch was consecrated as the 3rd Bishop of the Diocese,
                  where he served till 2018. He was succeeded by the Rt. Rev.
                  Charles Asilutwa. The History of Maseno cannot be complete
                  without mentioning the Bishops who have led this diocese from
                  its inception.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BISHOPS SECTION */}
      <section className="py-14 md:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Shepherds
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Bishops of the Diocese
            </h2>
            <p className="text-sm text-gray-600 mt-3">
              The leaders who have guided the Diocese of Maseno North from its
              inception to the present day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bishops.map((b, i) => (
              <div
                key={i}
                className={`group bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all p-5 flex gap-4 min-w-0 ${
                  b.current
                    ? "border-[#9333ea]/30 ring-1 ring-[#9333ea]/20"
                    : "border-gray-100"
                }`}
              >
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#f3e8ff] to-[#e9d5ff] flex items-center justify-center overflow-hidden">
                    {b.image ? (
                      <img
                        src={b.image}
                        alt={b.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Church size={28} className="text-[#4c1d95]" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 break-words">
                      {b.name}
                    </h3>
                    {b.current && (
                      <span className="text-[0.6rem] uppercase tracking-wider bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                        Current
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {b.lines.map((line, k) => (
                      <li
                        key={k}
                        className="text-xs md:text-sm text-gray-600 leading-relaxed flex gap-2 break-words"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9333ea] mt-1.5 flex-shrink-0" />
                        <span className="min-w-0">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section className="bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Quote size={22} />
          </div>
          <p className="text-lg md:text-2xl font-semibold leading-relaxed mb-3 break-words">
            "The History of Maseno cannot be complete without mentioning the
            Bishops who have led this diocese from its inception."
          </p>
          <p className="text-white/70 text-xs uppercase tracking-[0.3em]">
            ACK Diocese of Maseno North
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default History;
