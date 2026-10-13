"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Copy,
  Check,
  Heart,
  Landmark,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Header() {
  const [fixed, setFixed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [giveOpen, setGiveOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Live event flag
  const [hasLiveEvent, setHasLiveEvent] = useState(false);

  // react-pdf pieces, loaded lazily on the client only
  const [PdfComponents, setPdfComponents] = useState(null);

  const pathname = usePathname();

  // Load react-pdf only in the browser
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist/build/pdf");
        const { Document, Page } = await import("react-pdf");
        await import("react-pdf/dist/Page/AnnotationLayer.css");
        await import("react-pdf/dist/Page/TextLayer.css");

        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        if (mounted) setPdfComponents({ Document, Page, pdfjs });
      } catch (err) {
        console.error("Failed to load PDF viewer:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setFixed(window.scrollY > 32);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = pdfOpen || giveOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [pdfOpen, giveOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setPdfOpen(false);
        setGiveOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ============================================================
     Check if there's an active live event
     Polls every 30s so the blink stops/starts automatically.
  ============================================================ */
  useEffect(() => {
    let cancelled = false;

    const checkLive = async () => {
      if (!BACKEND_URL) return;
      try {
        const res = await fetch(`${BACKEND_URL}/getAllLiveIds`, {
          cache: "no-store",
        });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        const active = arr.some(
          (it) => (it?.status || "").toString().toLowerCase() === "active",
        );
        if (!cancelled) setHasLiveEvent(active);
      } catch (err) {
        // Fallback endpoint
        try {
          const res2 = await fetch(`${BACKEND_URL}/getLatestLiveId`, {
            cache: "no-store",
          });
          const data2 = await res2.json();
          const status = (data2?.status || "").toString().toLowerCase();
          if (!cancelled) setHasLiveEvent(status === "active");
        } catch {
          if (!cancelled) setHasLiveEvent(false);
        }
      }
    };

    checkLive();
    const id = setInterval(checkLive, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const openPdf = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPageNumber(1);
    setPdfLoading(true);
    setPdfOpen(true);
    setOpenDropdown(null);
    setMobileOpen(false);
  }, []);

  const openGive = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setGiveOpen(true);
    setOpenDropdown(null);
    setMobileOpen(false);
  }, []);

  const copyPaybill = () => {
    navigator.clipboard.writeText("880100").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyBankAccount = () => {
    navigator.clipboard.writeText("5087630031").then(() => {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    });
  };

  // Active state helpers
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  // For parent items with children, check if any child is active
  const isParentActive = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => {
      if (child.href === "#" || child.pdf) return false;
      if (child.href === "/") return pathname === "/";
      return pathname === child.href || pathname.startsWith(child.href + "/");
    });
  };

  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "About",
      href: "#",
      children: [
        { name: "About Us", href: "/about" },
        { name: "Diocese History", href: "/about/history" },
        { name: "Governance System", href: "/about/governance" },
        { name: "Boards & Committees", href: "/about/boards-committees" },
        {
          name: "Strategic Plan",
          href: "#",
          pdf: "/files/strategic-plan.pdf",
        },
        { name: "Profiling", href: "/about/profiling" },
      ],
    },
    {
      name: "Departments",
      href: "#",
      children: [
        { name: "Mothers Union", href: "/departments/mothers-union" },
        { name: "Kenya Anglican Men Mission", href: "/departments/kamm" },
        {
          name: "Kenya Anglican Youth Organization",
          href: "/departments/kayo",
        },
        { name: "Children Ministry", href: "/departments/children" },
        { name: "Education", href: "/departments/education" },
        {
          name: "Theological Education Expertise",
          href: "/departments/theological-education",
        },
        { name: "Music", href: "/departments/music" },
        { name: "Mission Department", href: "/departments/mission" },
      ],
    },
    { name: "Archdeaconries", href: "/archdeaconries" },
    { name: "Events", href: "/events" },
    { name: "Sermons", href: "/sermons" },
    { name: "News", href: "/news" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  const Doc = PdfComponents?.Document;
  const Pg = PdfComponents?.Page;

  return (
    <>
      {/* ============ Blink keyframes for live Events link ============ */}
      <style jsx global>{`
        @keyframes liveBlink {
          0%,
          100% {
            color: #e11d48; /* rose-600 */
            opacity: 1;
          }
          50% {
            color: #fb7185; /* rose-400 */
            opacity: 0.55;
          }
        }
        .live-blink {
          animation: liveBlink 1.1s ease-in-out infinite;
        }
        .live-blink .live-blink-bar {
          animation: liveBlink 1.1s ease-in-out infinite;
        }
      `}</style>

      {/* TOP BAR */}
      <div className="bg-[#4c1d95] text-white text-[0.7rem] py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-center md:text-left">
            Welcome to <strong>ACK Diocese of Maseno North</strong> — Where
            Faith, Hope &amp; Love Abide
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+254202103103"
              className="flex items-center gap-1 hover:underline"
            >
              <Phone size={12} /> 020 2103 103
            </a>
            <span className="hidden md:inline text-white/40">|</span>
            <a
              href="mailto:info@ackdioceseofmasenonorth.org"
              className="hidden sm:flex items-center gap-1 hover:underline"
            >
              <Mail size={12} /> info@ackdioceseofmasenonorth.org
            </a>
            <a
              href="/authentication/signin"
              className="border border-white/40 rounded-full px-3 py-[3px] font-semibold hover:bg-white hover:text-[#4c1d95] transition"
            >
              Staff Login
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav
        className={`bg-white/95 backdrop-blur border-b border-gray-100 w-full z-[60] ${
          fixed ? "fixed top-0 left-0 shadow-md" : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="ACK Diocese of Maseno North Logo"
                  className="w-10 h-10"
                />
              </div>
              <div className="leading-tight min-w-0">
                <div className="font-bold text-[#4c1d95] text-sm md:text-base truncate">
                  ACK MASENO NORTH
                </div>
                <div className="text-[0.6rem] text-gray-500 tracking-widest truncate">
                  DIOCESE OF MASENO NORTH
                </div>
              </div>
            </a>

            {/* Desktop menu */}
            <ul className="hidden lg:flex items-center gap-6 text-xs">
              {navItems.map((item) => {
                const isEvents = item.name === "Events";
                const showLive = isEvents && hasLiveEvent;

                return item.children ? (
                  <li
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1 py-2 transition ${
                        isParentActive(item) || openDropdown === item.name
                          ? "text-[#4c1d95] font-semibold"
                          : "text-gray-700 hover:text-[#4c1d95]"
                      }`}
                    >
                      {item.name} <ChevronDown size={14} />
                      {isParentActive(item) && (
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-6 h-[3px] rounded-full bg-[#4c1d95]" />
                      )}
                    </button>

                    <div
                      className={`absolute left-0 top-full pt-2 min-w-[240px] z-[70] transition-all duration-150 origin-top ${
                        openDropdown === item.name
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-1 invisible pointer-events-none"
                      }`}
                    >
                      <ul className="bg-white rounded-2xl py-2 border border-gray-100 shadow-xl">
                        {item.children.map((sub) =>
                          sub.pdf ? (
                            <li key={sub.name}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openPdf(e);
                                }}
                                className="w-full text-left block px-4 py-2 text-xs transition text-gray-600 hover:bg-[#4c1d95]/5 hover:text-[#4c1d95]"
                              >
                                {sub.name}
                              </button>
                            </li>
                          ) : (
                            <li key={sub.name}>
                              <a
                                href={sub.href}
                                className={`block px-4 py-2 text-xs transition ${
                                  isActive(sub.href)
                                    ? "bg-[#4c1d95]/5 text-[#4c1d95] font-semibold"
                                    : "text-gray-600 hover:bg-[#4c1d95]/5 hover:text-[#4c1d95]"
                                }`}
                              >
                                {sub.name}
                              </a>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`relative flex items-center gap-1.5 py-2 transition ${
                        showLive
                          ? "live-blink font-semibold"
                          : isActive(item.href)
                            ? "text-[#4c1d95] font-semibold"
                            : "text-gray-700 hover:text-[#4c1d95]"
                      }`}
                    >
                      {/* Pulsing live dot */}
                      {showLive && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                      )}

                      {item.name}

                      {isActive(item.href) && !showLive && (
                        <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-6 h-[3px] rounded-full bg-[#4c1d95]" />
                      )}
                      {showLive && (
                        <span className="live-blink-bar absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-6 h-[3px] rounded-full bg-rose-500" />
                      )}
                    </a>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={openGive}
                  className="bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white px-5 py-2 rounded-full font-semibold hover:opacity-90 transition"
                >
                  Give
                </button>
              </li>
            </ul>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden p-2 rounded-md text-gray-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[80vh] overflow-y-auto">
            <ul className="flex flex-col text-sm font-medium py-2">
              {navItems.map((item) => {
                const isEvents = item.name === "Events";
                const showLive = isEvents && hasLiveEvent;

                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={`flex items-center gap-2 px-6 py-3 transition ${
                        showLive
                          ? "live-blink font-semibold bg-rose-50"
                          : isActive(item.href)
                            ? "bg-[#4c1d95]/5 text-[#4c1d95] font-semibold"
                            : "text-gray-700 hover:bg-[#4c1d95]/5"
                      }`}
                    >
                      {showLive && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                        </span>
                      )}
                      {item.name}
                    </a>
                    {item.children && (
                      <ul className="bg-gray-50">
                        {item.children.map((sub) =>
                          sub.pdf ? (
                            <li key={sub.name}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openPdf(e);
                                }}
                                className="w-full text-left block px-10 py-2 text-sm transition text-gray-600 hover:bg-[#4c1d95]/5"
                              >
                                {sub.name}
                              </button>
                            </li>
                          ) : (
                            <li key={sub.name}>
                              <a
                                href={sub.href}
                                className={`block px-10 py-2 text-sm transition ${
                                  isActive(sub.href)
                                    ? "bg-[#4c1d95]/10 text-[#4c1d95] font-semibold"
                                    : "text-gray-600 hover:bg-[#4c1d95]/5"
                                }`}
                              >
                                {sub.name}
                              </a>
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}
              <li className="px-6 py-3 flex flex-col gap-2">
                <a
                  href="/staff/login"
                  className="text-center border border-[#4c1d95] text-[#4c1d95] px-5 py-2 rounded-full font-semibold"
                >
                  Staff Login
                </a>
                <button
                  type="button"
                  onClick={openGive}
                  className="text-center bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white px-5 py-2 rounded-full font-semibold"
                >
                  Give
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* PDF MODAL */}
      {pdfOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setPdfOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold truncate">
                    Strategic Plan
                  </div>
                  <div className="text-[0.65rem] text-white/70 truncate">
                    ACK Diocese of Maseno North
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href="/files/strategic-plan.pdf"
                  download
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition px-3 py-1.5 rounded-lg"
                >
                  <Download size={14} />
                  Download
                </a>
                <button
                  onClick={() => setPdfOpen(false)}
                  className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex-1 bg-gray-100 overflow-auto flex justify-center p-3 sm:p-4">
              {!Doc || !Pg ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm self-center">
                  <Loader2 size={18} className="animate-spin" />
                  Loading viewer...
                </div>
              ) : (
                <>
                  {pdfLoading && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm self-center">
                      <Loader2 size={18} className="animate-spin" />
                      Loading document...
                    </div>
                  )}
                  <Doc
                    file="/files/strategic-plan.pdf"
                    onLoadSuccess={({ numPages }) => {
                      setNumPages(numPages);
                      setPdfLoading(false);
                    }}
                    onLoadError={(err) => {
                      console.error("PDF load error:", err);
                      setPdfLoading(false);
                    }}
                    loading=""
                    className="flex flex-col items-center gap-4"
                  >
                    <Pg
                      pageNumber={pageNumber}
                      width={Math.min(
                        typeof window !== "undefined"
                          ? window.innerWidth - 60
                          : 800,
                        900,
                      )}
                      className="shadow-lg rounded-lg overflow-hidden bg-white"
                    />
                  </Doc>
                </>
              )}
            </div>

            {/* Modal footer */}
            {numPages && (
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-gray-100 bg-white">
                <div className="text-xs text-gray-500">
                  Page{" "}
                  <span className="font-semibold text-gray-800">
                    {pageNumber}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {numPages}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    disabled={pageNumber <= 1}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-[#f3e8ff] text-[#4c1d95] px-3 py-2 rounded-lg hover:bg-[#e9d5ff] disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setPageNumber((p) => Math.min(numPages, p + 1))
                    }
                    disabled={pageNumber >= numPages}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-[#4c1d95] to-[#9333ea] text-white px-3 py-2 rounded-lg hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GIVE MODAL */}
      {giveOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70  flex items-center justify-center"
          onClick={() => setGiveOpen(false)}
        >
          <div
            className="bg-white border-2 border-slate-200 rounded-3xl  w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex bg-gradient-to-br from-[#f3e8ff] to-[#faf5ff] items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-100  ">
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="text-base font-bold truncate">
                    Give &amp; Support the Ministry
                  </div>
                  <div className="text-[0.65rem] truncate">
                    ACK Diocese of Maseno North
                  </div>
                </div>
              </div>
              <button
                onClick={() => setGiveOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition flex-shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f3e8ff] to-[#faf5ff] p-4">
              <p className="text-sm text-gray-600 mb-5 text-center">
                Your generous giving supports the mission and ministry of the
                diocese. You can give using the details below.
              </p>

              {/* NCBA Bank */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className=" flex items-center justify-center">
                    <Landmark size={16} className="text-slate-600" />
                  </div>
                  <h3 className="font-bold text-slate-600 text-sm">
                    NCBA Bank
                  </h3>
                </div>

                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      1
                    </span>
                    <span>
                      Go to <strong>M-Pesa</strong> menu on your phone
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      2
                    </span>
                    <span>
                      Select <strong>Lipa na M-Pesa</strong> then{" "}
                      <strong>Pay Bill</strong>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      3
                    </span>
                    <span>
                      Enter Business Number:{" "}
                      <button
                        onClick={copyPaybill}
                        className="inline-flex items-center gap-1 font-bold text-[#4c1d95] bg-white border border-[#e9d5ff] px-2 py-0.5 rounded-md hover:bg-[#f3e8ff] transition"
                      >
                        880100
                        {copied ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      4
                    </span>
                    <span>
                      Enter Account Number:{" "}
                      <button
                        onClick={copyBankAccount}
                        className="inline-flex items-center gap-1 font-bold text-[#4c1d95] bg-white border border-[#e9d5ff] px-2 py-0.5 rounded-md hover:bg-[#f3e8ff] transition"
                      >
                        5087630031
                        {copiedBank ? (
                          <Check size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      5
                    </span>
                    <span>
                      Enter the <strong>Amount</strong> you wish to give
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4c1d95] text-white text-xs flex items-center justify-center">
                      6
                    </span>
                    <span>
                      Enter your <strong>M-Pesa PIN</strong> and confirm
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
