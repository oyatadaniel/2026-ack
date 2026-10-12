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
  Crown,
  Calendar,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ---------------- Auth header helper ---------------- */
const authHeaders = () => ({
  "Content-Type": "application/json",
  "access-token": Cookies.get("token"), // replace "token" with your cookie name
});

export default function BishopUpload() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null); // null = add, id = edit
  const [bishopname, setBishopName] = useState("");
  const [heading, setHeading] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [dateInstalled, setDateInstalled] = useState("");

  const [bishopData, setBishopData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // Delete state
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setBishopName("");
    setHeading("");
    setMessage("");
    setImage("");
    setDateInstalled("");
  };

  const handleShow = () => {
    setEditId(null);
    setBishopName("");
    setHeading("");
    setMessage("");
    setImage("");
    setDateInstalled("");
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setBishopName(item.bishop_name || "");
    setHeading(item.heading || "");
    setMessage(item.message || "");
    setImage(item.image || "");
    setDateInstalled(
      item.date_installed ? String(item.date_installed).slice(0, 10) : "",
    );
    setShow(true);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => setImage(reader.result);
    } else {
      setImage("");
    }
  };

  /* ---------------- POST (add) / PUT (edit) with auth headers ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      bishopname,
      heading,
      message,
      image,
      date_installed: dateInstalled,
    };

    const isEdit = editId !== null;
    const url = isEdit
      ? `${BACKEND_URL}/updateBishopInfo/${editId}`
      : `${BACKEND_URL}/uploadBishopInfo`;

    const request = isEdit
      ? axios.put(url, payload, { headers: authHeaders() })
      : axios.post(url, payload, { headers: authHeaders() });

    request
      .then(() => {
        toast.success(
          isEdit
            ? "Bishop details updated"
            : "Bishop details uploaded successfully",
        );
        setLoading(false);
        handleClose();
        getBishops();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error(
          isEdit
            ? "Failed to update bishop details"
            : "Failed to upload bishop details",
        );
      });
  };

  /* ---------------- GET (no headers) ---------------- */
  const getBishops = () => {
    axios
      .get(`${BACKEND_URL}/getBishopInfo`)
      .then((res) => setBishopData(res.data || []))
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getBishops();
  }, []);

  /* ---------------- Delete (confirmation modal flow) ---------------- */
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
      .delete(`${BACKEND_URL}/deleteBishopInfo/${id}`, {
        headers: authHeaders(),
      })
      .then(() => {
        toast.success("Bishop details deleted");
        setConfirmDeleteId(null);
        getBishops();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete bishop details");
      })
      .finally(() => setDeletingId(null));
  };

  // Format date helper (YYYY-MM-DD -> DD MMM YYYY)
  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter and pagination
  const filteredData = bishopData.filter((item) =>
    item.bishop_name?.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Bishop Details
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Manage the bishop's profile, heading and message.
          </p>
        </div>
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-2 transition-colors"
        >
          <PlusCircle size={12} />
          Add Bishop
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
                <th className="px-3 py-2 font-medium">Image</th>
                <th className="px-3 py-2 font-medium">Bishop Name</th>
                <th className="px-3 py-2 font-medium">Date Installed</th>
                <th className="px-3 py-2 font-medium">Heading</th>
                <th className="px-3 py-2 font-medium">Message</th>
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
                    <td className="px-3 py-2">
                      <img
                        src={item.image}
                        alt={item.bishop_name}
                        className="w-20 h-14 object-cover rounded-md border border-gray-100 dark:border-gray-800"
                      />
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {item.bishop_name}
                    </td>
                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar
                          size={10}
                          className="text-[#4c1d95] dark:text-[#a78bfa]"
                        />
                        {formatDate(item.date_installed)}
                      </span>
                    </td>
                    <td className="px-3 py-2">{item.heading}</td>
                    <td
                      className="px-3 py-2 truncate max-w-[200px]"
                      title={item.message}
                    >
                      {item.message}
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
                    colSpan="7"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No records found.
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

      {/* ---------------- Add / Edit Modal ---------------- */}
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  {editId !== null
                    ? "Edit Bishop Details"
                    : "Add Bishop Details"}
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
            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Bishop Name */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Bishop Name
                </label>
                <input
                  type="text"
                  placeholder="Enter bishop name"
                  value={bishopname}
                  onChange={(e) => setBishopName(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Date Installed */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Date Installed
                </label>
                <div className="relative">
                  <Calendar
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="date"
                    value={dateInstalled}
                    onChange={(e) => setDateInstalled(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg pl-8 pr-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  Select the date the bishop was installed.
                </p>
              </div>

              {/* Heading */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  placeholder="Enter heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Message
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter bishop message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-[11px] text-gray-600 dark:text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-medium file:bg-[#4c1d95]/10 dark:file:bg-[#6d28d9]/20 file:text-[#4c1d95] dark:file:text-[#a78bfa] hover:file:bg-[#4c1d95]/20 transition-colors"
                />
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  Upload the bishop's profile image.
                </p>

                {/* Preview */}
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="mt-2 w-24 h-16 object-cover rounded-lg border border-gray-100 dark:border-gray-800"
                  />
                )}
              </div>
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
                className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    {editId !== null ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    {editId !== null ? "Update Details" : "Upload Details"}
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
            className="w-full max-w-sm bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <Trash2 size={14} className="text-rose-600 dark:text-rose-400" />
              <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                Delete Bishop Details
              </h2>
            </div>

            <div className="px-5 py-4">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                Are you sure you want to delete these bishop details? This
                action cannot be undone.
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
