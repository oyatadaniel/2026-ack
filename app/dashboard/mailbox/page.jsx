"use client";

import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  Mail,
  MailOpen,
  Send,
  Inbox,
  Star,
  Trash2,
  X,
  Loader2,
  Paperclip,
  Reply,
  Forward,
  Search,
  RefreshCw,
  File as FileIcon,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  "access-token": Cookies.get("token"),
});

export default function Mailbox() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // Compose modal state
  const [composeOpen, setComposeOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  const fileInputRef = useRef(null);

  /* ---------------- Fetch inbox ---------------- */
  const getEmails = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/getAllEmails`, { headers: authHeaders() })
      .then((res) => setEmails(res.data || []))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load mailbox");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getEmails();
  }, []);

  /* ---------------- Compose helpers ---------------- */
  const resetCompose = () => {
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setMessage("");
    setAttachments([]);
    setShowCc(false);
    setShowBcc(false);
  };

  const openCompose = () => {
    resetCompose();
    setComposeOpen(true);
  };

  const closeCompose = () => {
    if (sending) return;
    setComposeOpen(false);
    resetCompose();
  };

  const handleFilePick = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Cap at 3 MB total to keep payload reasonable
    const MAX_TOTAL = 3 * 1024 * 1024;
    let total = attachments.reduce((s, a) => s + a.size, 0);

    const accepted = [];
    for (const f of files) {
      if (total + f.size > MAX_TOTAL) {
        toast.error(`Skipped ${f.name} — total attachments exceed 3 MB limit`);
        continue;
      }
      total += f.size;
      accepted.push(f);
    }

    Promise.all(
      accepted.map(
        (f) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({
                name: f.name,
                type: f.type,
                size: f.size,
                data: reader.result, // base64 data URL
              });
            reader.readAsDataURL(f);
          }),
      ),
    ).then((arr) => {
      setAttachments((prev) => [...prev, ...arr]);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  /* ---------------- Send ---------------- */
  const handleSend = () => {
    if (!to.trim()) return toast.error("Recipient is required");
    if (!subject.trim()) return toast.error("Subject is required");
    if (!message.trim()) return toast.error("Message is required");

    setSending(true);

    axios
      .post(
        `${BACKEND_URL}/sendEmail`,
        {
          to,
          cc,
          bcc,
          subject,
          message,
          attachments,
        },
        { headers: authHeaders() },
      )
      .then(() => {
        toast.success("Email sent successfully");
        setSending(false);
        closeCompose();
        getEmails();
      })
      .catch((err) => {
        console.error(err);
        setSending(false);
        toast.error(err?.response?.data?.message || "Failed to send email");
      });
  };

  /* ---------------- Selection ---------------- */
  const openEmail = (item) => {
    setSelected(item);
  };

  /* ---------------- Filter ---------------- */
  const filtered = emails.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.from?.toLowerCase().includes(q) ||
      item.to?.toLowerCase().includes(q) ||
      item.subject?.toLowerCase().includes(q) ||
      item.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Mailbox
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Read received emails and send new ones.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={getEmails}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            Refresh
          </button>
          <button
            onClick={openCompose}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-2 transition-colors"
          >
            <Send size={12} />
            Compose
          </button>
        </div>
      </div>

      {/* ---------------- Search ---------------- */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-72">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search mailbox..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
          />
        </div>
      </div>

      {/* ---------------- Inbox list ---------------- */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
          <Inbox size={12} className="text-[#4c1d95] dark:text-[#a78bfa]" />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Inbox
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            ({filtered.length})
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-10">
            No emails.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => openEmail(item)}
                  className={`w-full text-left px-3 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    item.unread ? "bg-amber-50/30 dark:bg-amber-900/5" : ""
                  }`}
                >
                  <div className="w-7 h-7 shrink-0 rounded-full bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 flex items-center justify-center">
                    <Mail
                      size={12}
                      className="text-[#4c1d95] dark:text-[#a78bfa]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={`text-[11px] truncate ${
                          item.unread
                            ? "font-semibold text-gray-900 dark:text-gray-50"
                            : "font-medium text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {item.from || item.sender || "Unknown sender"}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <div className="text-[11px] truncate font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                      {item.subject || "(No subject)"}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {item.message
                        ? item.message.replace(/<[^>]*>/g, "").slice(0, 120)
                        : ""}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------------- Email view modal ---------------- */}
      {selected && !composeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 min-w-0">
                <MailOpen
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa] shrink-0"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50 truncate">
                  {selected.subject || "(No subject)"}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  From
                </p>
                <p className="text-[11px] text-gray-900 dark:text-gray-100">
                  {selected.from || selected.sender || "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  To
                </p>
                <p className="text-[11px] text-gray-900 dark:text-gray-100">
                  {selected.to || "—"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Message
                </p>
                <div
                  className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2"
                  dangerouslySetInnerHTML={{
                    __html: selected.message || "",
                  }}
                />
              </div>

              {selected.attachments && selected.attachments.length > 0 && (
                <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 pt-2">
                    Attachments
                  </p>
                  <ul className="space-y-1">
                    {selected.attachments.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-300"
                      >
                        <FileIcon size={11} className="text-gray-400" />
                        {a.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={() => {
                  setTo(selected.from || selected.sender || "");
                  setSubject(
                    selected.subject?.startsWith("Re:")
                      ? selected.subject
                      : `Re: ${selected.subject || ""}`,
                  );
                  setMessage("");
                  setComposeOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4c1d95] dark:text-[#a78bfa] border border-[#4c1d95]/30 dark:border-[#a78bfa]/30 rounded-lg px-3 py-2 hover:bg-[#4c1d95]/10 dark:hover:bg-[#6d28d9]/20 transition-colors"
              >
                <Reply size={12} />
                Reply
              </button>
              <button
                onClick={() => setSelected(null)}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Compose modal ---------------- */}
      {composeOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/50"
          onClick={closeCompose}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Send
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  New Email
                </h2>
              </div>
              <button
                disabled={sending}
                onClick={closeCompose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* To */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                    To *
                  </label>
                  <div className="flex items-center gap-1">
                    {!showCc && (
                      <button
                        type="button"
                        onClick={() => setShowCc(true)}
                        className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 hover:text-[#4c1d95] dark:hover:text-[#a78bfa] transition-colors"
                      >
                        <Plus size={9} /> Cc
                      </button>
                    )}
                    {!showBcc && (
                      <button
                        type="button"
                        onClick={() => setShowBcc(true)}
                        className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 hover:text-[#4c1d95] dark:hover:text-[#a78bfa] transition-colors"
                      >
                        <Plus size={9} /> Bcc
                      </button>
                    )}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="recipient@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* CC */}
              {showCc && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      Cc
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCc(false);
                        setCc("");
                      }}
                      className="text-[10px] text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Minus size={9} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="cc@example.com"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
              )}

              {/* BCC */}
              {showBcc && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                      Bcc
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBcc(false);
                        setBcc("");
                      }}
                      className="text-[10px] text-gray-400 hover:text-rose-600 transition-colors"
                    >
                      <Minus size={9} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="bcc@example.com"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Message *
                </label>
                <textarea
                  rows={8}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors resize-none"
                />
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                    Attachments
                  </label>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    Max 3 MB total
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFilePick}
                  className="hidden"
                  id="mail-attachments"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#4c1d95] dark:text-[#a78bfa] border border-[#4c1d95]/30 dark:border-[#a78bfa]/30 rounded-lg px-2.5 py-1.5 hover:bg-[#4c1d95]/10 dark:hover:bg-[#6d28d9]/20 transition-colors"
                >
                  <Paperclip size={10} />
                  Add files
                </button>

                {attachments.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {attachments.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg px-2.5 py-1.5 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileIcon
                            size={11}
                            className="text-[#4c1d95] dark:text-[#a78bfa] shrink-0"
                          />
                          <span className="truncate text-gray-700 dark:text-gray-300">
                            {a.name}
                          </span>
                          <span className="text-[10px] text-gray-400 shrink-0">
                            ({formatBytes(a.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="text-gray-400 hover:text-rose-600 transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                disabled={sending}
                onClick={closeCompose}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={sending}
                onClick={handleSend}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-[#4c1d95] dark:bg-[#6d28d9] hover:bg-[#3b1578] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2 transition-colors"
              >
                {sending ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
