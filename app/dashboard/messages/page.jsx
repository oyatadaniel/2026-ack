"use client";

import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Trash2,
  X,
  Loader2,
  Mail,
  MailOpen,
  Eye,
  Clock,
  CheckCircle2,
  Archive,
  User,
  Send,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  "access-token": Cookies.get("token"),
});

const STATUSES = ["pending", "opened", "replied", "archived"];

const statusBadge = (status) => {
  switch (status) {
    case "pending":
      return {
        cls: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
        icon: Clock,
        label: "Pending",
      };
    case "opened":
      return {
        cls: "bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 text-[#4c1d95] dark:text-[#a78bfa]",
        icon: MailOpen,
        label: "Opened",
      };
    case "replied":
      return {
        cls: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
        icon: CheckCircle2,
        label: "Replied",
      };
    case "archived":
      return {
        cls: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
        icon: Archive,
        label: "Archived",
      };
    default:
      return {
        cls: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
        icon: Clock,
        label: status || "Unknown",
      };
  }
};

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Delete confirmation modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const getMessages = () => {
    axios
      .get(`${BACKEND_URL}/getAllMessages`, { headers: authHeaders() })
      .then((res) => {
        setMessages(res.data);
      });
  };

  useEffect(() => {
    getMessages();
  }, []);

  const updateStatus = (id, status) => {
    setUpdatingId(id);

    axios
      .patch(
        `${BACKEND_URL}/updateMessageStatus/${id}`,
        { status },
        { headers: authHeaders() },
      )
      .then(() => {
        toast.success(`Marked as ${status}`);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m)),
        );
        setSelected((prev) =>
          prev && prev.id === id ? { ...prev, status } : prev,
        );
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update status");
      })
      .finally(() => setUpdatingId(null));
  };

  /* ---------------- Delete flow (modal, not window.confirm) ---------------- */
  const askDelete = (id) => setConfirmDeleteId(id);
  const cancelDelete = () => {
    if (deleting !== null) return;
    setConfirmDeleteId(null);
  };

  const confirmDelete = () => {
    const id = confirmDeleteId;
    if (!id) return;
    setDeleting(id);

    axios
      .delete(`${BACKEND_URL}/deleteMessage/${id}`, {
        headers: authHeaders(),
      })
      .then(() => {
        toast.success("Message deleted");
        setConfirmDeleteId(null);
        setSelected(null);
        getMessages();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete message");
      })
      .finally(() => setDeleting(null));
  };

  const handleOpen = (item) => {
    setSelected(item);
    if (item.status === "pending") {
      updateStatus(item.id, "opened");
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return toast.error("Reply message is required");

    setSending(true);

    axios
      .post(
        `${BACKEND_URL}/replyMessage`,
        {
          id: selected.id,
          to: selected.email,
          name: selected.name,
          subject: `Re: ${selected.subject || ""}`,
          message: replyText,
        },
        { headers: authHeaders() },
      )
      .then(() => {
        toast.success("Reply sent!");
        setReplyText("");
        setReplyOpen(false);
        updateStatus(selected.id, "replied");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to send reply");
      })
      .finally(() => setSending(false));
  };

  const filteredData = messages.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.subject?.toLowerCase().includes(search.toLowerCase()) ||
      item.message?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = messages.filter((m) => m.status === s).length;
    return acc;
  }, {});
  counts.all = messages.length;

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Messages
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Contact form submissions from the website.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#4c1d95] dark:text-[#a78bfa] bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 rounded-lg px-2.5 py-1.5">
          <Mail size={11} />
          {messages.length} total
        </span>
      </div>

      {/* ---------------- Status filter pills ---------------- */}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => {
            setStatusFilter("all");
            setCurrentPage(1);
          }}
          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
            statusFilter === "all"
              ? "bg-[#4c1d95] dark:bg-[#6d28d9] text-white border-[#4c1d95] dark:border-[#6d28d9]"
              : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          All
          <span className="text-[9px] opacity-80">({counts.all})</span>
        </button>

        {STATUSES.map((s) => {
          const badge = statusBadge(s);
          const Icon = badge.icon;
          const isActive = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors ${
                isActive
                  ? "bg-[#4c1d95] dark:bg-[#6d28d9] text-white border-[#4c1d95] dark:border-[#6d28d9]"
                  : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={10} />
              {badge.label}
              <span className="text-[9px] opacity-80">({counts[s]})</span>
            </button>
          );
        })}
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
            placeholder="Search by name, email, subject or message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
          />
        </div>
      </div>

      {/* ---------------- Table ---------------- */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#4c1d95] dark:bg-[#6d28d9] text-white">
              <tr className="text-[10px] uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Subject</th>
                <th className="px-3 py-2 font-medium">Message</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 dark:text-gray-300">
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => {
                  const badge = statusBadge(item.status);
                  const StatusIcon = badge.icon;
                  return (
                    <tr
                      key={item.id}
                      className={`border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        item.status === "pending"
                          ? "bg-amber-50/30 dark:bg-amber-900/5"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td
                        className={`px-3 py-2 capitalize text-gray-900 dark:text-gray-100 ${
                          item.status === "pending"
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {item.name || "—"}
                      </td>
                      <td className="px-3 py-2 lowercase text-gray-900 dark:text-gray-100">
                        {item.email}
                      </td>
                      <td
                        className={`px-3 py-2 text-gray-900 dark:text-gray-100 ${
                          item.status === "pending"
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {item.subject}
                      </td>
                      <td
                        className="px-3 py-2 truncate max-w-[250px]"
                        title={item.message}
                      >
                        {item.message?.length > 70
                          ? item.message.slice(0, 70) + "..."
                          : item.message}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${badge.cls}`}
                        >
                          <StatusIcon size={10} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpen(item)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4c1d95] dark:text-[#a78bfa] bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 hover:bg-[#4c1d95]/20 dark:hover:bg-[#6d28d9]/30 rounded-lg px-2.5 py-1.5 transition-colors"
                          >
                            <Eye size={10} />
                            View
                          </button>
                          <button
                            onClick={() => askDelete(item.id)}
                            disabled={deleting === item.id}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50 rounded-lg px-2.5 py-1.5 transition-colors"
                          >
                            {deleting === item.id ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Trash2 size={10} />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- Pagination ---------------- */}
      {totalPages > 1 && (
        <nav className="flex justify-end">
          <ul className="flex items-center gap-1 text-[11px]">
            <li>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#4c1d95] dark:bg-[#6d28d9] text-white border-[#4c1d95] dark:border-[#6d28d9]"
                      : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* ---------------- View Modal ---------------- */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <MailOpen
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Message Details
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
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Status
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {STATUSES.map((s) => {
                    const badge = statusBadge(s);
                    const Icon = badge.icon;
                    const isActive = selected.status === s;
                    return (
                      <button
                        key={s}
                        disabled={updatingId === selected.id}
                        onClick={() => updateStatus(selected.id, s)}
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                          isActive
                            ? "bg-[#4c1d95] dark:bg-[#6d28d9] text-white border-[#4c1d95] dark:border-[#6d28d9]"
                            : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {updatingId === selected.id && isActive ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Icon size={10} />
                        )}
                        {badge.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Subject
                </p>
                <p className="text-[11px] font-medium text-gray-900 dark:text-gray-100">
                  {selected.subject}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Message
                </p>
                <div className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2">
                  {selected.message}
                </div>
              </div>

              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 pt-2">
                  Contact Info
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User size={11} className="text-gray-400 shrink-0" />
                    <span className="text-[11px] font-medium text-gray-900 dark:text-gray-100">
                      {selected.name || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="text-gray-400 shrink-0" />
                    <span className="text-[11px] text-gray-700 dark:text-gray-300 lowercase">
                      {selected.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={() => askDelete(selected.id)}
                disabled={deleting === selected.id}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-lg px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-50 transition-colors"
              >
                {deleting === selected.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
                Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReplyText("");
                    setReplyOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4c1d95] dark:text-[#a78bfa] border border-[#4c1d95]/30 dark:border-[#a78bfa]/30 rounded-lg px-3 py-2 hover:bg-[#4c1d95]/10 dark:hover:bg-[#6d28d9]/20 transition-colors"
                >
                  <Mail size={12} />
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
        </div>
      )}

      {/* ---------------- Reply Modal ---------------- */}
      {replyOpen && selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/50"
          onClick={() => !sending && setReplyOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Send
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Reply to {selected.name || selected.email}
                </h2>
              </div>
              <button
                disabled={sending}
                onClick={() => setReplyOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  To
                </p>
                <p className="text-[11px] text-gray-900 dark:text-gray-100 lowercase">
                  {selected.email}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  Subject
                </p>
                <p className="text-[11px] font-medium text-gray-900 dark:text-gray-100">
                  Re: {selected.subject}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Your Reply
                </p>
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full text-[11px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                disabled={sending}
                onClick={() => setReplyOpen(false)}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={sending}
                onClick={handleSendReply}
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
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Delete Confirmation Modal ---------------- */}
      {confirmDeleteId !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 bg-black/50"
          onClick={cancelDelete}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <Trash2 size={14} className="text-rose-600 dark:text-rose-400" />
              <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                Delete Message
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={cancelDelete}
                disabled={deleting !== null}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting !== null}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2 transition-colors"
              >
                {deleting !== null ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={12} />
                    Delete
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
