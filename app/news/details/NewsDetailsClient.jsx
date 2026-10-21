"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import {
  Calendar,
  Clock,
  ChevronRight,
  Newspaper,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Optimize a Cloudinary URL by injecting delivery transformations.
 * - q_auto: automatic quality (visually lossless, ~70% smaller)
 * - f_auto: automatic format (WebP/AVIF for modern browsers)
 * - w_XXX:  resize on the fly to the width we actually render
 *
 * Safe: returns the original URL untouched if it's not a Cloudinary URL.
 */
const optimizeCloudinaryUrl = (url, width) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const transforms = [`q_auto`, `f_auto`];
  if (width) transforms.push(`w_${width}`, `c_limit`);

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
};

export default function NewsDetailsClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [news, setNews] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 8;

  useEffect(() => {
    const fetchNewsDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/getAllNews/${id}`);
        setNews(res.data.news);
        setOtherNews(res.data.otherNews || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNewsDetails();
    else setLoading(false);
  }, [id]);

  const indexOfLast = currentPage * newsPerPage;
  const indexOfFirst = indexOfLast - newsPerPage;
  const currentNews = otherNews?.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil((otherNews?.length || 0) / newsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stripHtml = (html) =>
    html
      ? html
          .replace(/<[^>]*>?/gm, "")
          .replace(/\s+/g, " ")
          .trim()
      : "";

  const excerpt = (html, sentences = 2) => {
    const text = stripHtml(html);
    if (!text) return "";
    const parts = text.split(".").filter(Boolean);
    if (parts.length === 0) return "";
    return (
      parts.slice(0, sentences).join(". ").trim() +
      (parts.length > sentences ? "..." : ".")
    );
  };

  const truncate = (str, len = 70) =>
    str && str.length > len ? str.slice(0, len) + "..." : str || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans antialiased">
        <Header />
        <div className="flex items-center justify-center py-32 text-gray-500 gap-2">
          <Loader2 size={18} className="animate-spin" />
          Loading article...
        </div>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-white font-sans antialiased">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
            <Newspaper size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            News not found
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            The article you're looking for may have been removed or moved.
          </p>
          <Link
            href="/site/news"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:opacity-95 transition"
          >
            <ArrowLeft size={16} />
            Back to News
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = moment(news.created_at).format("MMMM D, YYYY");
  const formattedTime = moment(news.created_at).format("h:mm A");

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden w-full max-w-full">
      <Header />

      <section className="relative bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white overflow-hidden w-full">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 md:w-96 md:h-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-16 w-64 h-64 md:w-80 md:h-80 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 w-full">
          <nav className="flex flex-wrap items-center gap-2 text-xs mb-6">
            <Link
              href="/"
              className="text-white/70 hover:text-white transition"
            >
              Home
            </Link>
            <ChevronRight size={14} className="text-white/50 flex-shrink-0" />
            <Link
              href="/site/news"
              className="text-white/70 hover:text-white transition"
            >
              News
            </Link>
            <ChevronRight size={14} className="text-white/50 flex-shrink-0" />
            <span className="text-white font-semibold truncate max-w-[180px] md:max-w-none">
              Article
            </span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            Diocese News
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 break-words capitalize">
            {news.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {formattedTime}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-w-0">
            {news.file && (
              <div className="relative w-full h-[260px] sm:h-[360px] md:h-[460px]">
                <Image
                  src={optimizeCloudinaryUrl(news.file, 1600)}
                  alt={news.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-10">
              <div
                className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed break-words
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-a:text-[#4c1d95] prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: news.info }}
              />
            </div>
          </article>

          <div className="mt-6">
            <Link
              href="/site/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4c1d95] hover:text-[#9333ea] transition"
            >
              <ArrowLeft size={16} />
              Back to all news
            </Link>
          </div>

          <div className="mt-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs tracking-[0.3em] uppercase text-[#9333ea] font-semibold">
                Keep Reading
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                Other Related News
              </h2>
            </div>

            {otherNews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
                  <Newspaper size={24} />
                </div>
                <p className="text-gray-500 text-sm">
                  No other news available.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentNews.map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/details?id=${item.id}`}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col min-w-0"
                    >
                      {item.file && (
                        <div className="relative w-full h-44 overflow-hidden">
                          <Image
                            src={optimizeCloudinaryUrl(item.file, 500)}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      <div className="p-4 flex flex-col flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 capitalize line-clamp-2 group-hover:text-[#4c1d95] transition-colors break-words">
                          {truncate(item.title, 70)}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-2 text-[0.7rem] text-gray-500">
                          <Calendar size={12} />
                          {moment(item.created_at).format("MMM D, YYYY")}
                        </div>

                        <p className="text-xs text-gray-500 mt-2 line-clamp-2 capitalize break-words">
                          {excerpt(item.info, 2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:border-[#9333ea] hover:text-[#4c1d95] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Prev
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 text-xs font-semibold rounded-lg transition ${
                            currentPage === page
                              ? "bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white shadow-sm"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-[#9333ea] hover:text-[#4c1d95]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:border-[#9333ea] hover:text-[#4c1d95] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
