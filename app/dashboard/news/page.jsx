"use client";

import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
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
  Newspaper,
  BookOpen,
  ExternalLink,
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ---------------- Auth header helper ---------------- */
const authHeaders = () => ({
  "Content-Type": "application/json",
  "access-token": Cookies.get("token"), // replace "token" with your cookie name
});

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("news"); // "news" | "sermons"

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Content Management
        </h1>
        <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
          Manage news articles and sermon videos in one place.
        </p>
      </div>

      {/* ---------------- Tabs ---------------- */}
      <div className="flex items-center gap-1 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("news")}
          className={`relative inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 -mb-px border-b-2 transition-colors ${
            activeTab === "news"
              ? "border-[#4c1d95] dark:border-[#a78bfa] text-[#4c1d95] dark:text-[#a78bfa]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <Newspaper size={12} />
          News
        </button>
        <button
          onClick={() => setActiveTab("sermons")}
          className={`relative inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 -mb-px border-b-2 transition-colors ${
            activeTab === "sermons"
              ? "border-[#4c1d95] dark:border-[#a78bfa] text-[#4c1d95] dark:text-[#a78bfa]"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <BookOpen size={12} />
          Sermons
        </button>
      </div>

      {/* ---------------- Tab content ---------------- */}
      {activeTab === "news" && <NewsTab />}
      {activeTab === "sermons" && <SermonsTab />}
    </div>
  );
}

/* ================================================================ */
/* ========================== NEWS TAB ============================ */
/* ================================================================ */

function NewsTab() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add / Edit form state
  const [editId, setEditId] = useState(null); // null = add, id = edit
  const [title, setTitle] = useState("");
  const [info, setInfo] = useState("");
  const [file, setFile] = useState("");

  const [newsList, setNewsList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Delete state
  const [deletingId, setDeletingId] = useState(null); // row spinner
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // confirm modal target

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setTitle("");
    setInfo("");
    setFile("");
  };

  const handleShow = () => {
    setEditId(null);
    setTitle("");
    setInfo("");
    setFile("");
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title || "");
    setInfo(item.info || item.content || "");
    setFile(item.file || "");
    setShow(true);
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    const reader = new FileReader();

    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => setFile(reader.result);
    } else {
      setFile("");
    }
  };

  /* ---------------- POST (add) / PUT (edit) with auth headers ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { title, content: info, image: file };
    const isEdit = editId !== null;
    const url = isEdit
      ? `${BACKEND_URL}/updateNews/${editId}`
      : `${BACKEND_URL}/uploadNews`;

    const request = isEdit
      ? axios.put(url, payload, { headers: authHeaders() })
      : axios.post(url, payload, { headers: authHeaders() });

    request
      .then(() => {
        toast.success(isEdit ? "News updated" : "News added successfully");
        setLoading(false);
        handleClose();
        getNews();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error(isEdit ? "Failed to update news" : "Failed to add news");
      });
  };

  /* ---------------- GET (no headers) ---------------- */
  const getNews = () => {
    axios
      .get(`${BACKEND_URL}/getAllNews`)
      .then((res) => setNewsList(res.data || []))
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getNews();
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
      .delete(`${BACKEND_URL}/deleteNews/${id}`, { headers: authHeaders() })
      .then(() => {
        toast.success("News deleted");
        setConfirmDeleteId(null);
        getNews();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete news");
      })
      .finally(() => setDeletingId(null));
  };

  const filteredData = newsList.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="space-y-3">
      {/* Header action */}
      <div className="flex justify-end">
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-2 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-1.5 transition-colors"
        >
          <PlusCircle size={12} />
          Add News
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-72">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-7 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#4c1d95] dark:bg-[#6d28d9] text-white">
              <tr className="text-[10px] uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">File</th>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Info</th>
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
                      {item.file ? (
                        <img
                          src={item.file}
                          alt="news file"
                          className="w-40 h-14 object-cover rounded-md border border-gray-100 dark:border-gray-800"
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </td>

                    <td
                      className="px-3 py-2 truncate max-w-[250px]"
                      title={
                        item.info
                          ?.replace(/\s+/g, " ")
                          .replace(/<[^>]*>/g, "") || ""
                      }
                    >
                      {(() => {
                        if (!item.info) return "";
                        const sentences = item.info
                          .replace(/<[^>]*>/g, "")
                          .replace(/\s+/g, " ")
                          .split(".")
                          .filter(Boolean);
                        if (sentences.length === 0) return "";
                        return (
                          sentences.slice(0, 2).join(". ").trim() +
                          (sentences.length > 2 ? "..." : ".")
                        );
                      })()}
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
                    colSpan="5"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No news found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Newspaper
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  {editId !== null ? "Edit News" : "Add News"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-4 py-3 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter news title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Content
                </label>
                <div className="news-quill rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                  <ReactQuill
                    value={info}
                    onChange={setInfo}
                    modules={modules}
                    placeholder="Write your article here..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  Upload an image for this news item.
                </p>
                {file && file.startsWith("data:image") && (
                  <div className="mt-2">
                    <img
                      src={file}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded-md border border-gray-100 dark:border-gray-800"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
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
                    {editId !== null ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    {editId !== null ? "Update News" : "Submit News"}
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
                Delete News
              </h2>
            </div>

            <div className="px-5 py-4">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this news item? This action
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
/* ======================== SERMONS TAB =========================== */
/* ================================================================ */

function SermonsTab() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [info, setInfo] = useState("");
  const [link, setLink] = useState("");

  const [sermons, setSermons] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setTitle("");
    setInfo("");
    setLink("");
  };

  const handleShow = () => {
    setEditId(null);
    setTitle("");
    setInfo("");
    setLink("");
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title || "");
    setInfo(item.info || "");
    setLink(item.link || "");
    setShow(true);
  };

  /* ---------------- POST (add) / PUT (edit) with auth headers ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { title, info, link };
    const isEdit = editId !== null;
    const url = isEdit
      ? `${BACKEND_URL}/updateSermon/${editId}`
      : `${BACKEND_URL}/uploadSermon`;

    const request = isEdit
      ? axios.put(url, payload, { headers: authHeaders() })
      : axios.post(url, payload, { headers: authHeaders() });

    request
      .then(() => {
        toast.success(isEdit ? "Sermon updated" : "Sermon added successfully");
        setLoading(false);
        handleClose();
        getSermons();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error(
          isEdit ? "Failed to update sermon" : "Failed to add sermon",
        );
      });
  };

  /* ---------------- GET (no headers) ---------------- */
  const getSermons = () => {
    axios
      .get(`${BACKEND_URL}/getSermons`)
      .then((res) => setSermons(res.data || []))
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getSermons();
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
      .delete(`${BACKEND_URL}/deleteSermon/${id}`, { headers: authHeaders() })
      .then(() => {
        toast.success("Sermon deleted");
        setConfirmDeleteId(null);
        getSermons();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete sermon");
      })
      .finally(() => setDeletingId(null));
  };

  const filteredData = sermons.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/,
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : null;
  };

  return (
    <div className="space-y-3">
      {/* Header action */}
      <div className="flex justify-end">
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-2 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-1.5 transition-colors"
        >
          <PlusCircle size={12} />
          Add Sermon
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-full sm:w-72">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-[11px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-7 pr-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#4c1d95] dark:bg-[#6d28d9] text-white">
              <tr className="text-[10px] uppercase tracking-wide">
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Video</th>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Info</th>
                <th className="px-3 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 dark:text-gray-300">
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
                      {getYouTubeEmbedUrl(item.link) ? (
                        <iframe
                          width="140"
                          height="80"
                          src={getYouTubeEmbedUrl(item.link)}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-md border border-gray-100 dark:border-gray-800"
                        />
                      ) : (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-[#4c1d95] dark:text-[#a78bfa] bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 hover:bg-[#4c1d95]/20 dark:hover:bg-[#6d28d9]/30 rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                          <ExternalLink size={10} />
                          View Link
                        </a>
                      )}
                    </td>

                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </td>

                    <td
                      className="px-3 py-2 truncate max-w-[250px]"
                      title={item.info}
                    >
                      {item.info}
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
                    colSpan="5"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No sermons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <BookOpen
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  {editId !== null ? "Edit Sermon" : "Add New Sermon"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-4 py-3 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter sermon title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter sermon description"
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  YouTube Link
                </label>
                <input
                  type="url"
                  placeholder="Enter YouTube video link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  Paste the full YouTube video URL (e.g.
                  https://www.youtube.com/watch?v=xxxxxx)
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
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
                    {editId !== null ? "Updating..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    {editId !== null ? "Update Sermon" : "Submit Sermon"}
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
                Delete Sermon
              </h2>
            </div>

            <div className="px-5 py-4">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this sermon? This action cannot
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
