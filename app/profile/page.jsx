"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, ChevronRight, User } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function ProfileInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Missing profile id.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/getProfileById/${id}`)
      .then((res) => {
        const data = res.data;
        if (!data || data.Status === "Error" || data.Status === "NotFound") {
          setError("Profile not found.");
          return;
        }
        setProfile(Array.isArray(data) ? data[0] : data);
      })
      .catch(() => setError("Could not load this profile."))
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={22} className="animate-spin text-[#4c1d95]" />
        </div>
        <Footer />
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <Header />

        <section className="py-20 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-8 text-center max-w-md w-full">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f3e8ff] text-[#4c1d95] flex items-center justify-center">
              <User size={24} />
            </div>
            <p className="text-gray-500 text-sm mb-6">
              {error || "Profile not found."}
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white rounded-full px-5 py-2.5"
            >
              Go back
            </button>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  /* ---------- Sanitized HTML description ---------- */
  const safeDescription = profile.description
    ? DOMPurify.sanitize(profile.description)
    : "";

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Header />

      {/* HERO */}
      <section className="relative bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs mb-6 capitalize">
            <a href="/" className="text-white/70 hover:text-white transition">
              Home
            </a>
            <ChevronRight size={14} className="text-white/50" />
            <span className="text-white font-semibold">
              {profile.name || "Profile"}
            </span>
          </nav>

          <span className="inline-block text-xs tracking-[0.3em] uppercase text-[#c4b5fd] mb-3">
            {profile.office_name || "ACK Diocese of Maseno North"}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight capitalize">
            {profile.name}
          </h1>
          {profile.title && (
            <p className="text-white/85 mt-2 text-sm md:text-base capitalize">
              {profile.title}
            </p>
          )}
        </div>
      </section>

      {/* CONTENT — 30% image / 70% text */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className=" overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-0">
              {/* LEFT — PICTURE (30% → 3/10 columns) */}
              <div className="md:col-span-4 p-4">
                <div className="md:sticky">
                  {/* Fixed aspect ratio keeps image stable no matter how long text is */}
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 ">
                    <img
                      src={profile.image || "/placeholder-avatar.png"}
                      alt={profile.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-avatar.png";
                      }}
                    />
                  </div>

                  {/* Optional caption / office under the image */}
                  {profile.office_name && (
                    <div className="mt-4 text-center md:text-left">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                        Office
                      </p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {profile.office_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — DETAILS (70% → 7/10 columns) */}
              <div className="md:col-span-6 p-4 md:p-4 lg:p-4  ">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 capitalize">
                  {profile.name}
                </h2>

                {profile.title && (
                  <p className="text-sm text-[#9333ea] font-medium mb-6 capitalize">
                    {profile.title}
                  </p>
                )}

                <div className="text-[15px] leading-relaxed text-gray-700">
                  {safeDescription ? (
                    <div
                      className="
                        profile-description
                        [&_p]:mb-4
                        [&_p:last-child]:mb-0
                        [&_p:first-of-type]:first-letter:text-4xl
                        [&_p:first-of-type]:first-letter:font-bold
                        [&_p:first-of-type]:first-letter:text-[#4c1d95]
                        [&_p:first-of-type]:first-letter:mr-2
                        [&_p:first-of-type]:first-letter:float-left
                        [&_p:first-of-type]:first-letter:leading-none
                        [&_p:first-of-type]:first-letter:mt-1
                        [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3
                        [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3
                        [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                        [&_li]:mb-1
                        [&_a]:text-[#9333ea] [&_a]:underline
                        [&_strong]:font-semibold
                        [&_em]:italic
                      "
                      dangerouslySetInnerHTML={{ __html: safeDescription }}
                    />
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No description available.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 font-sans antialiased">
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 size={22} className="animate-spin text-[#4c1d95]" />
          </div>
        </div>
      }
    >
      <ProfileInner />
    </Suspense>
  );
}
