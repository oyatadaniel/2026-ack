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
  Eye,
  EyeOff,
  User,
  Send,
  Phone,
  Users,
  Bell,
  BellOff,
  MessageSquare,
  CheckSquare,
  Square,
  Church,
  Building2,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const FILTERS = ["all", "subscribed", "not_subscribed"];

const filterBadge = (filter) => {
  switch (filter) {
    case "subscribed":
      return { icon: Bell, label: "Subscribed" };
    case "not_subscribed":
      return { icon: BellOff, label: "Not Subscribed" };
    default:
      return { icon: Users, label: "All" };
  }
};

/* ---------------- Masking helpers ---------------- */
const maskName = (name) => {
  if (!name) return "—";
  const str = String(name);
  if (str.length <= 4) return str[0] + "●".repeat(Math.max(str.length - 1, 0));
  return str.slice(0, 3) + "●".repeat(str.length - 3);
};

const maskPhone = (phone) => {
  if (!phone) return "—";
  const str = String(phone);
  if (str.length <= 4) return str;
  // Show first 2 and last 2 characters, mask the middle
  const first = str.slice(0, 2);
  const last = str.slice(-2);
  const middle = "●".repeat(str.length - 4);
  return `${first}${middle}${last}`;
};

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Per-row visibility toggle (by member id)
  const [revealedIds, setRevealedIds] = useState(new Set());

  // Send message modal state
  const [messageOpen, setMessageOpen] = useState(false);
  const [messageTargets, setMessageTargets] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  /* ---------------- GET members (with auth header) ---------------- */
  const getMembers = () => {
    const token = Cookies.get("token"); // replace "token" with your cookie name

    axios
      .get(`${BACKEND_URL}/getAllMembers`, {
        headers: {
          "access-token": token,
        },
      })
      .then((res) => setMembers(res.data || []))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load members");
      });
  };

  useEffect(() => {
    getMembers();
  }, []);

  /* ---------------- Row reveal toggle ---------------- */
  const toggleReveal = (id) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ---------------- Delete (with auth header) ---------------- */
  const handleDelete = (id) => {
    if (!confirm("Delete this member permanently?")) return;
    setDeleting(id);

    const token = Cookies.get("token");

    axios
      .delete(`${BACKEND_URL}/deleteMember/${id}`, {
        headers: {
          "access-token": token,
        },
      })
      .then(() => {
        toast.success("Member deleted");
        setSelected(null);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setRevealedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        getMembers();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete member");
      })
      .finally(() => setDeleting(null));
  };

  /* ---------------- Opt-in check ---------------- */
  const canReceiveMessages = (member) => Number(member.receive_messages) === 1;

  /* ---------------- Single member message ---------------- */
  const openMessageModal = (member) => {
    if (!canReceiveMessages(member)) {
      toast.error("This member opted out of receiving messages");
      return;
    }
    setMessageTargets([member]);
    setIsBulk(false);
    setSubject("");
    setMessageText("");
    setMessageOpen(true);
  };

  /* ---------------- Bulk message ---------------- */
  const openBulkMessageModal = () => {
    const targets = members.filter(
      (m) => selectedIds.has(m.id) && canReceiveMessages(m),
    );

    if (targets.length === 0) {
      toast.error("No subscribed members selected");
      return;
    }

    const skipped = selectedIds.size - targets.length;
    if (skipped > 0) {
      toast(
        `${skipped} member${skipped === 1 ? "" : "s"} skipped (not subscribed)`,
        { icon: "ℹ️" },
      );
    }

    setMessageTargets(targets);
    setIsBulk(true);
    setSubject("");
    setMessageText("");
    setMessageOpen(true);
  };

  /* ---------------- Send (frontend only) ---------------- */
  const handleSendMessage = () => {
    if (!subject.trim()) return toast.error("Subject is required");
    if (!messageText.trim()) return toast.error("Message is required");

    setSending(true);

    setTimeout(() => {
      const count = messageTargets.length;
      toast.success(
        isBulk
          ? `Bulk SMS sent to ${count} member${count === 1 ? "" : "s"} (simulated)`
          : `Message sent to ${messageTargets[0]?.name || "member"} (simulated)`,
      );
      setSending(false);
      setMessageOpen(false);
      setSubject("");
      setMessageText("");
      setMessageTargets([]);
      setSelected(null);
      setSelectedIds(new Set());
    }, 900);
  };

  /* ---------------- Selection helpers ---------------- */
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  /* ---------------- Filter & pagination ---------------- */
  const filteredData = members.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      item.name?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      item.parish?.toLowerCase().includes(q) ||
      item.parish_name?.toLowerCase().includes(q) ||
      item.archdeaconry_name?.toLowerCase().includes(q);

    const subscribed = Number(item.receive_messages) === 1;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "subscribed" && subscribed) ||
      (statusFilter === "not_subscribed" && !subscribed);

    return matchesSearch && matchesStatus;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const counts = {
    all: members.length,
    subscribed: members.filter((m) => Number(m.receive_messages) === 1).length,
    not_subscribed: members.filter((m) => Number(m.receive_messages) !== 1)
      .length,
  };

  /* ---------------- Header checkbox state ---------------- */
  const pageIds = currentRows.map((r) => r.id);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
  const someOnPageSelected =
    !allOnPageSelected && pageIds.some((id) => selectedIds.has(id));

  const toggleSelectAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  /* ---------------- Selected counts ---------------- */
  const selectedCount = selectedIds.size;
  const selectedSubscribedCount = members.filter(
    (m) => selectedIds.has(m.id) && canReceiveMessages(m),
  ).length;
  const selectedOptedOutCount = selectedCount - selectedSubscribedCount;

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Members
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Registered church members and their contact preferences.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#4c1d95] dark:text-[#a78bfa] bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 rounded-lg px-2.5 py-1.5">
          <Users size={11} />
          {members.length} total
        </span>
      </div>

      {/* ---------------- Filter pills ---------------- */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((f) => {
          const badge = filterBadge(f);
          const Icon = badge.icon;
          const isActive = statusFilter === f;
          return (
            <button
              key={f}
              onClick={() => {
                setStatusFilter(f);
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
              <span className="text-[9px] opacity-80">({counts[f]})</span>
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
            placeholder="Search by name, phone, parish or archdeaconry..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
          />
        </div>
      </div>

      {/* ---------------- Bulk action bar ---------------- */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#4c1d95]/5 dark:bg-[#6d28d9]/10 border border-[#4c1d95]/20 dark:border-[#6d28d9]/30 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-200">
            <CheckSquare
              size={12}
              className="text-[#4c1d95] dark:text-[#a78bfa]"
            />
            <span className="font-medium">{selectedCount} selected</span>
            {selectedOptedOutCount > 0 && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                ({selectedSubscribedCount} subscribed · {selectedOptedOutCount}{" "}
                opted out)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openBulkMessageModal}
              disabled={selectedSubscribedCount === 0}
              title={
                selectedSubscribedCount === 0
                  ? "None of the selected members are subscribed"
                  : "Send SMS to subscribed selected members"
              }
              className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white bg-[#4c1d95] dark:bg-[#6d28d9] hover:bg-[#3b1578] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-1.5 transition-colors"
            >
              <Send size={11} />
              Send Bulk SMS
            </button>
            <button
              onClick={clearSelection}
              className="text-[10px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Table ---------------- */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#4c1d95] dark:bg-[#6d28d9] text-white">
              <tr className="text-[10px] uppercase tracking-wide">
                <th className="px-3 py-2 font-medium w-10">
                  <button
                    onClick={toggleSelectAllOnPage}
                    className="inline-flex items-center justify-center"
                    aria-label="Select all on page"
                  >
                    {allOnPageSelected ? (
                      <CheckSquare size={12} />
                    ) : someOnPageSelected ? (
                      <CheckSquare size={12} className="opacity-60" />
                    ) : (
                      <Square size={12} />
                    )}
                  </button>
                </th>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Phone</th>
                <th className="px-3 py-2 font-medium">Archdeaconry</th>
                <th className="px-3 py-2 font-medium">Parish</th>
                <th className="px-3 py-2 font-medium">Messages</th>
                <th className="px-3 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 dark:text-gray-300">
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => {
                  const subscribed = Number(item.receive_messages) === 1;
                  const isChecked = selectedIds.has(item.id);
                  const isRevealed = revealedIds.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`border-t border-gray-100 dark:border-gray-800 transition-colors ${
                        isChecked
                          ? "bg-[#4c1d95]/5 dark:bg-[#6d28d9]/10"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      } ${!subscribed ? "bg-gray-50/40 dark:bg-gray-950/20" : ""}`}
                    >
                      <td className="px-3 py-2">
                        <button
                          onClick={() => toggleSelect(item.id)}
                          className="inline-flex items-center justify-center text-[#4c1d95] dark:text-[#a78bfa]"
                          aria-label="Select row"
                        >
                          {isChecked ? (
                            <CheckSquare size={13} />
                          ) : (
                            <Square
                              size={13}
                              className="text-gray-400 dark:text-gray-500"
                            />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="px-3 py-2 capitalize font-medium text-gray-900 dark:text-gray-100">
                        {isRevealed ? item.name || "—" : maskName(item.name)}
                      </td>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span>
                            {isRevealed
                              ? item.phone || "—"
                              : maskPhone(item.phone)}
                          </span>
                          <button
                            onClick={() => toggleReveal(item.id)}
                            title={
                              isRevealed
                                ? "Hide contact details"
                                : "Reveal contact details"
                            }
                            className="inline-flex items-center justify-center text-gray-400 hover:text-[#4c1d95] dark:hover:text-[#a78bfa] transition-colors"
                          >
                            {isRevealed ? (
                              <EyeOff size={12} />
                            ) : (
                              <Eye size={12} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100 capitalize">
                        {item.archdeaconry_name || "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100 capitalize">
                        {item.parish_name || item.parish || "—"}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${
                            subscribed
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {subscribed ? (
                            <>
                              <Bell size={10} /> Subscribed
                            </>
                          ) : (
                            <>
                              <BellOff size={10} /> Not Subscribed
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelected(item)}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4c1d95] dark:text-[#a78bfa] bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 hover:bg-[#4c1d95]/20 dark:hover:bg-[#6d28d9]/30 rounded-lg px-2.5 py-1.5 transition-colors"
                          >
                            <Eye size={10} />
                            View
                          </button>
                          <button
                            onClick={() => openMessageModal(item)}
                            disabled={!subscribed}
                            title={
                              subscribed
                                ? "Send message"
                                : "This member opted out of receiving messages"
                            }
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg px-2.5 py-1.5 transition-colors"
                          >
                            <Send size={10} />
                            Message
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
                    colSpan="8"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No members found.
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
      {selected && !messageOpen && (
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
                <User
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Member Details
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
                  Message Preference
                </p>
                {Number(selected.receive_messages) === 1 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                    <Bell size={10} /> Subscribed to receive messages
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <BellOff size={10} /> Opted out — do not send messages
                  </span>
                )}
              </div>

              {/* Contact Info */}
              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 pt-2">
                  Contact Info
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User size={11} className="text-gray-400 shrink-0" />
                    <span className="text-[11px] font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {selected.name || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={11} className="text-gray-400 shrink-0" />
                    <span className="text-[11px] text-gray-700 dark:text-gray-300">
                      {selected.phone || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Archdeaconry */}
              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 pt-2">
                  Archdeaconry
                </p>
                <div className="flex items-center gap-2">
                  <Building2 size={11} className="text-gray-400 shrink-0" />
                  <span className="text-[11px] font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {selected.archdeaconry_name || "—"}
                  </span>
                </div>
              </div>

              {/* Parish */}
              <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5 pt-2">
                  Parish
                </p>
                <div className="flex items-center gap-2">
                  <Church size={11} className="text-gray-400 shrink-0" />
                  <span className="text-[11px] font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {selected.parish_name || selected.parish || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={() => handleDelete(selected.id)}
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
                  onClick={() => openMessageModal(selected)}
                  disabled={Number(selected.receive_messages) !== 1}
                  title={
                    Number(selected.receive_messages) === 1
                      ? "Send message"
                      : "This member opted out of receiving messages"
                  }
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4c1d95] dark:text-[#a78bfa] border border-[#4c1d95]/30 dark:border-[#a78bfa]/30 rounded-lg px-3 py-2 hover:bg-[#4c1d95]/10 dark:hover:bg-[#6d28d9]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={12} />
                  Send Message
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

      {/* ---------------- Send Message Modal (single + bulk) ---------------- */}
      {messageOpen && messageTargets.length > 0 && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/50"
          onClick={() => !sending && setMessageOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <MessageSquare
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  {isBulk
                    ? `Send Bulk SMS to ${messageTargets.length} Members`
                    : `Send Message to ${messageTargets[0]?.name || "Member"}`}
                </h2>
              </div>
              <button
                disabled={sending}
                onClick={() => setMessageOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                  {isBulk ? "Recipients" : "To"}
                </p>
                {isBulk ? (
                  <div className="text-[11px] text-gray-900 dark:text-gray-100 max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2">
                    {messageTargets.map((m) => (
                      <div key={m.id} className="truncate">
                        • {m.name} — {m.phone}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-900 dark:text-gray-100">
                    {messageTargets[0].name} — {messageTargets[0].phone}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Subject
                </p>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Upcoming Diocesan Event"
                  className="w-full text-[11px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              <div>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Message
                </p>
                <textarea
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full text-[11px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                disabled={sending}
                onClick={() => setMessageOpen(false)}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={sending}
                onClick={handleSendMessage}
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
                    {isBulk
                      ? `Send to ${messageTargets.length}`
                      : "Send Message"}
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
