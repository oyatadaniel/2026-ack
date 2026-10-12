"use client";

import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Search,
  Upload,
  Pencil,
  Trash2,
  X,
  Loader2,
  Church,
  Building2,
  LayoutList,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  "access-token": Cookies.get("token"),
});

const TABS = [
  { key: "all", label: "All", icon: LayoutList },
  { key: "archdeaconries", label: "Archdeaconries", icon: Building2 },
  { key: "parishes", label: "Parishes", icon: Church },
];

export default function Archdeaconries() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-100 dark:border-gray-800">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`relative inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 -mb-px border-b-2 transition-colors ${
                isActive
                  ? "border-[#4c1d95] dark:border-[#a78bfa] text-[#4c1d95] dark:text-[#a78bfa]"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "all" && <AllTab />}
      {activeTab === "archdeaconries" && <ArchdeaconriesTab />}
      {activeTab === "parishes" && <ParishesTab />}
    </div>
  );
}

/* ================================================================ */
/* =========================== ALL TAB ============================ */
/* ================================================================ */
/*  EXACT copy of the original component — untouched.               */
/* ================================================================ */

function AllTab() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [archdeaconries, setArchdeaconries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Archdeaconry name is required");
    setLoading(true);

    axios
      .post(`${BACKEND_URL}/createArchdeaconry`, { name })
      .then(() => {
        toast.success("Archdeaconry added successfully");
        setName("");
        handleClose();
        getArchdeaconries();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to add archdeaconry");
      })
      .finally(() => setLoading(false));
  };

  const getArchdeaconries = () => {
    axios.get(`${BACKEND_URL}/getArchdeaconries`).then((res) => {
      setArchdeaconries(res.data.data);
    });
  };

  useEffect(() => {
    getArchdeaconries();
  }, []);

  // Filter & Pagination
  const filteredData = archdeaconries.filter((item) =>
    item.archdeaconry.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="space-y-3">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Archdeaconries Management
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Manage archdeaconries and their parishes.
          </p>
        </div>
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-2 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-2 transition-colors"
        >
          <PlusCircle size={12} />
          Add Archdeaconry
        </button>
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
            placeholder="Search by name..."
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
                <th className="px-3 py-2 font-medium">Parishes</th>
                <th className="px-3 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 dark:text-gray-300 capitalize">
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400 align-top">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100 align-top">
                      {item.archdeaconry}
                    </td>
                    <td className="px-3 py-2 align-top">
                      {item.parishes ? (
                        <ul className="space-y-0.5">
                          {item.parishes.split(",").map((p, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#4c1d95] dark:bg-[#a78bfa]" />
                              {p.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          No parishes
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg px-2.5 py-1.5 transition-colors">
                          <Pencil size={10} />
                          Edit
                        </button>
                        <button className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg px-2.5 py-1.5 transition-colors">
                          <Trash2 size={10} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No archdeaconries found.
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

      {/* ---------------- Modal ---------------- */}
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Church
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Add New Archdeaconry
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 py-4">
              <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter archdeaconry name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
              />
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={handleClose}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    Submit
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

/* ================================================================ */
/* ==================== ARCHDEACONRIES TAB ======================= */
/* ================================================================ */

function ArchdeaconriesTab() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [archdeaconries, setArchdeaconries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setName("");
  };

  const handleShow = () => {
    setEditId(null);
    setName("");
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.archdeaconry || "");
    setShow(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Archdeaconry name is required");
    setLoading(true);

    const isEdit = editId !== null;
    const url = isEdit
      ? `${BACKEND_URL}/updateArchdeaconry/${editId}`
      : `${BACKEND_URL}/createArchdeaconry`;

    const request = isEdit
      ? axios.put(url, { name }, { headers: authHeaders() })
      : axios.post(url, { name }, { headers: authHeaders() });

    request
      .then(() => {
        toast.success(
          isEdit ? "Archdeaconry updated" : "Archdeaconry added successfully",
        );
        setName("");
        handleClose();
        getArchdeaconries();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          isEdit
            ? "Failed to update archdeaconry"
            : "Failed to add archdeaconry",
        );
      })
      .finally(() => setLoading(false));
  };

  const getArchdeaconries = () => {
    axios.get(`${BACKEND_URL}/getArchdeaconries`).then((res) => {
      setArchdeaconries(res.data.data);
    });
  };

  useEffect(() => {
    getArchdeaconries();
  }, []);

  const askDelete = (id) => setConfirmDeleteId(id);
  const cancelDelete = () => {
    if (deletingId !== null) return;
    setConfirmDeleteId(null);
  };

  const confirmDelete = () => {
    const id = confirmDeleteId;
    if (!id) return;
    setDeletingId(id);

    axios
      .delete(`${BACKEND_URL}/deleteArchdeaconry/${id}`, {
        headers: authHeaders(),
      })
      .then(() => {
        toast.success("Archdeaconry deleted");
        setConfirmDeleteId(null);
        getArchdeaconries();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete archdeaconry");
      })
      .finally(() => setDeletingId(null));
  };

  const filteredData = archdeaconries.filter((item) =>
    item.archdeaconry?.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-2 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-2 transition-colors"
        >
          <PlusCircle size={12} />
          Add Archdeaconry
        </button>
      </div>

      <div className="flex justify-end">
        <div className="relative w-full sm:w-72">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#4c1d95] dark:bg-[#6d28d9] text-white">
              <tr className="text-[10px] uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 dark:text-gray-300 capitalize">
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {item.archdeaconry}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                          <Pencil size={10} />
                          Edit
                        </button>
                        <button
                          onClick={() => askDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50 rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                          {deletingId === item.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Trash2 size={10} />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No archdeaconries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

      {/* Add / Edit Modal */}
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Church
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  {editId !== null
                    ? "Edit Archdeaconry"
                    : "Add New Archdeaconry"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4">
              <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter archdeaconry name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={handleClose}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                Delete Archdeaconry
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this archdeaconry? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={cancelDelete}
                disabled={deletingId !== null}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2 transition-colors"
              >
                {deletingId !== null ? (
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

/* ================================================================ */
/* ========================= PARISHES TAB ========================= */
/* ================================================================ */

function ParishesTab() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [parish, setParish] = useState("");
  const [archdeaconryId, setArchdeaconryId] = useState("");

  const [parishes, setParishes] = useState([]);
  const [archdeaconries, setArchdeaconries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setParish("");
    setArchdeaconryId("");
  };

  const handleShow = () => {
    setEditId(null);
    setParish("");
    setArchdeaconryId("");
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setParish(item.parish || "");
    setArchdeaconryId(String(item.archdeaconry_id || ""));
    setShow(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!parish.trim()) return toast.error("Parish name is required");
    if (!archdeaconryId) return toast.error("Please select an archdeaconry");

    setLoading(true);

    const payload = { parish, archid: archdeaconryId };
    const isEdit = editId !== null;
    const url = isEdit
      ? `${BACKEND_URL}/updateParish/${editId}`
      : `${BACKEND_URL}/createParish`;

    const request = isEdit
      ? axios.put(url, payload, { headers: authHeaders() })
      : axios.post(url, payload, { headers: authHeaders() });

    request
      .then(() => {
        toast.success(isEdit ? "Parish updated" : "Parish added successfully");
        handleClose();
        getParishes();
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          isEdit ? "Failed to update parish" : "Failed to add parish",
        );
      })
      .finally(() => setLoading(false));
  };

  const getParishes = () => {
    axios.get(`${BACKEND_URL}/getParishes`).then((res) => {
      setParishes(res.data);
    });
  };

  const getArchdeaconries = () => {
    axios.get(`${BACKEND_URL}/getArchdeaconries`).then((res) => {
      setArchdeaconries(res.data.data);
    });
  };

  useEffect(() => {
    getParishes();
    getArchdeaconries();
  }, []);

  const askDelete = (id) => setConfirmDeleteId(id);
  const cancelDelete = () => {
    if (deletingId !== null) return;
    setConfirmDeleteId(null);
  };

  const confirmDelete = () => {
    const id = confirmDeleteId;
    if (!id) return;
    setDeletingId(id);

    axios
      .delete(`${BACKEND_URL}/deleteParish/${id}`, {
        headers: authHeaders(),
      })
      .then(() => {
        toast.success("Parish deleted");
        setConfirmDeleteId(null);
        getParishes();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete parish");
      })
      .finally(() => setDeletingId(null));
  };

  const archNameById = Object.fromEntries(
    (archdeaconries || []).map((a) => [String(a.id), a.archdeaconry]),
  );

  const filteredData = (parishes || []).filter((item) =>
    item.parish?.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-2 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-2 transition-colors"
        >
          <PlusCircle size={12} />
          Add Parish
        </button>
      </div>

      <div className="flex justify-end">
        <div className="relative w-full sm:w-72">
          <Search
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by parish name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#4c1d95] dark:bg-[#6d28d9] text-white">
              <tr className="text-[10px] uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Parish</th>
                <th className="px-3 py-2 font-medium">Archdeaconry</th>
                <th className="px-3 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 dark:text-gray-300 capitalize">
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {item.parish}
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                      {archNameById[String(item.archdeaconry_id)] || "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                          <Pencil size={10} />
                          Edit
                        </button>
                        <button
                          onClick={() => askDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-50 rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                          {deletingId === item.id ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <Trash2 size={10} />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No parishes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

      {/* Add / Edit Modal */}
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Church
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  {editId !== null ? "Edit Parish" : "Add New Parish"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Parish Name
                </label>
                <input
                  type="text"
                  placeholder="Enter parish name"
                  value={parish}
                  onChange={(e) => setParish(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Archdeaconry
                </label>
                <select
                  value={archdeaconryId}
                  onChange={(e) => setArchdeaconryId(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                >
                  <option value="">Select archdeaconry</option>
                  {(archdeaconries || []).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.archdeaconry}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={handleClose}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                Delete Parish
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this parish? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <button
                onClick={cancelDelete}
                disabled={deletingId !== null}
                className="text-[11px] font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-3 py-2 transition-colors"
              >
                {deletingId !== null ? (
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
