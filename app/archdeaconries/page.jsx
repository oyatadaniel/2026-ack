"use client";

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Church, MapPin, ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Archdeaconries = () => {
  const [archdeaconries, setArchdeaconries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArchdeaconries();
  }, []);

  const getArchdeaconries = () => {
    axios
      .get(`${BACKEND_URL}/getArchdeaconries`)
      .then((res) => {
        setArchdeaconries(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch archdeaconries:", err);
        setArchdeaconries([]);
      })
      .finally(() => setLoading(false));
  };

  const title = "ACK Maseno North | Archdeaconries";

  const totalParishes = archdeaconries.reduce((sum, arch) => {
    const list = arch.parishes
      ? arch.parishes.split(",").filter((p) => p.trim() !== "")
      : [];
    return sum + list.length;
  }, 0);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Header />

      {/* HERO */}
      <section className="relative bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6">
            <a href="/" className="text-white/70 hover:text-white transition">
              Home
            </a>
            <ChevronRight size={14} className="text-white/50" />
            <span className="text-white font-semibold">Archdeaconries</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            Archdeaconries and Parishes
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base">
            Explore the archdeaconries that make up our diocese and the parishes
            that serve our communities across Western Kenya.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Church size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {archdeaconries.length}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Archdeaconries
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {totalParishes}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Parishes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABLE */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
              Our Structure
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
              Archdeaconries and their Parishes
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading archdeaconries...
            </div>
          ) : archdeaconries.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="bg-[#4c1d95] text-white text-xs uppercase tracking-wider">
                      <th className="px-5 py-4 font-semibold w-16">#</th>
                      <th className="px-5 py-4 font-semibold w-[260px]">
                        Archdeaconry
                      </th>
                      <th className="px-5 py-4 font-semibold">Parishes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archdeaconries.map((arch, index) => {
                      const parishes = arch.parishes
                        ? arch.parishes
                            .split(",")
                            .map((p) => p.trim())
                            .filter(Boolean)
                        : [];

                      return (
                        <tr
                          key={arch.id ?? index}
                          className={`align-top ${
                            index % 2 === 0 ? "bg-white" : "bg-[#faf7ff]"
                          } border-t border-gray-100 hover:bg-[#f3e8ff]/50 transition-colors`}
                        >
                          <td className="px-5 py-5">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#4c1d95] text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-5 py-5">
                            <div className="font-semibold text-gray-900 capitalize text-sm">
                              {arch.archdeaconry}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {parishes.length}{" "}
                              {parishes.length === 1 ? "parish" : "parishes"}
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            {parishes.length > 0 ? (
                              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 marker:text-[#9333ea] marker:font-semibold">
                                {parishes.map((parish, i) => (
                                  <li key={i}>{parish}</li>
                                ))}
                              </ol>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                No parishes listed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                <Church size={24} />
              </div>
              <p className="text-gray-500 text-sm">
                No archdeaconry data available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Archdeaconries;
