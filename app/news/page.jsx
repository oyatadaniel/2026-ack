"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Newspaper, Calendar, ChevronRight } from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Blog = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews();
  }, []);

  const getNews = () => {
    axios
      .get(`${BACKEND_URL}/getAllNews`)
      .then((res) => {
        setNews(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch news:", err);
        setNews([]);
      })
      .finally(() => setLoading(false));
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const latestNews = news[0];
  const rightNews = news.slice(1, 3);
  const otherNews = news.slice(3);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
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
            <span className="text-white font-semibold">Blogs & News</span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            ACK Diocese of Maseno North
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
            Diocese News & Blogs
          </h1>
          <p className="text-white/85 max-w-2xl text-sm md:text-base">
            Stay up to date with the latest happenings, stories, and
            announcements from across our diocese.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <Newspaper size={18} />
              </div>
              <div>
                <div className="text-lg font-bold leading-none">
                  {news.length}
                </div>
                <div className="text-[0.65rem] uppercase tracking-wider text-white/70">
                  Articles
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS CONTENT */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-16 text-gray-500">
              Loading news...
            </div>
          ) : news.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                <Newspaper size={24} />
              </div>
              <p className="text-gray-500 text-sm">
                No news articles available at the moment.
              </p>
            </div>
          ) : (
            <>
              {/* FEATURED + RIGHT SIDE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                {/* Featured */}
                {latestNews && (
                  <a
                    href={`/news/details?id=${latestNews.id}`}
                    className="lg:col-span-2 group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={latestNews.file}
                      alt={latestNews.title}
                      className="w-full h-[260px] md:h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 text-white">
                      <span className="inline-block text-[0.65rem] uppercase tracking-wider bg-[#9333ea] px-2.5 py-1 rounded-full font-semibold mb-3">
                        Featured
                      </span>
                      <h2 className="text-xl md:text-3xl font-bold leading-snug line-clamp-2 capitalize">
                        {latestNews.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-3 text-xs text-white/80">
                        <Calendar size={14} />
                        {formatDate(latestNews.created_at)}
                      </div>
                    </div>
                  </a>
                )}

                {/* Right side list */}
                {rightNews.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {rightNews.map((item) => (
                      <a
                        key={item.id}
                        href={`/news/details?id=${item.id}`}
                        className="group flex gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#9333ea]/30 transition-all overflow-hidden"
                      >
                        <img
                          src={item.file}
                          alt={item.title}
                          className="w-28 md:w-32 h-full min-h-[110px] object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="flex flex-col justify-center py-3 pr-3">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 capitalize group-hover:text-[#4c1d95] transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-2 text-[0.7rem] text-gray-500">
                            <Calendar size={12} />
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* OTHER NEWS GRID */}
              {otherNews.length > 0 && (
                <>
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                      More Stories
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                      Latest From the Diocese
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {otherNews.map((item) => (
                      <a
                        key={item.id}
                        href={`/news/details?id=${item.id}`}
                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={item.file}
                            alt={item.title}
                            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 capitalize group-hover:text-[#4c1d95] transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-auto pt-3 text-[0.7rem] text-gray-500">
                            <Calendar size={12} />
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
