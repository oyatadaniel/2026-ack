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
  Briefcase,
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Offices() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [officeName, setOfficeName] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [offices, setOffices] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!officeName.trim()) return toast.error("Office name is required");
    if (!name.trim()) return toast.error("Name is required");

    setLoading(true);

    axios
      .post(
        `${BACKEND_URL}/uploadOffice`,
        {
          officeName,
          title,
          name,
          description,
          image,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "access-token": Cookies.get("token"),
          },
        },
      )
      .then(() => {
        toast.success("Office added successfully");
        setLoading(false);
        setOfficeName("");
        setTitle("");
        setName("");
        setDescription("");
        setImage("");
        handleClose();
        getOffices();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error("Failed to add office");
      });
  };

  const getOffices = () => {
    axios.get(`${BACKEND_URL}/getAllOffices`).then((res) => {
      setOffices(res.data);
    });
  };

  useEffect(() => {
    getOffices();
  }, []);

  // Filtering and pagination
  const filteredData = offices.filter(
    (item) =>
      item.officeName?.toLowerCase().includes(search.toLowerCase()) ||
      item.name?.toLowerCase().includes(search.toLowerCase()),
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
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Offices Management
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Manage office holders, titles and their descriptions.
          </p>
        </div>
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-2 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-2 transition-colors"
        >
          <PlusCircle size={12} />
          Add Office
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
            placeholder="Search by office or name..."
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
                <th className="px-3 py-2 font-medium">Office</th>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Description</th>
                <th className="px-3 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-[11px] text-gray-700 dark:text-gray-300">
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors align-top"
                  >
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-2">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-100 dark:border-gray-800"
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {item.officeName}
                    </td>
                    <td className="px-3 py-2">{item.title}</td>
                    <td className="px-3 py-2 capitalize">{item.name}</td>
                    <td
                      className="px-3 py-2 truncate max-w-[250px]"
                      title={
                        item.description
                          ?.replace(/<[^>]*>/g, "")
                          .replace(/\s+/g, " ") || ""
                      }
                    >
                      {(() => {
                        if (!item.description) return "";
                        const text = item.description
                          .replace(/<[^>]*>/g, "")
                          .replace(/\s+/g, " ");
                        return text.length > 100
                          ? text.slice(0, 100) + "..."
                          : text;
                      })()}
                    </td>
                    <td className="px-3 py-2">
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
                    colSpan="7"
                    className="text-center text-[11px] text-gray-400 dark:text-gray-500 py-6"
                  >
                    No offices found.
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
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Briefcase
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  Add Office
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
              {/* Office Name + Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Office Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bishop, Vicar"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Pastor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Description (Quill) */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <div className="news-quill rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                  <ReactQuill
                    value={description}
                    onChange={setDescription}
                    modules={modules}
                    placeholder="Write the office description here..."
                  />
                </div>
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
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  Upload a profile image for this office holder.
                </p>

                {/* Preview */}
                {image && (
                  <div className="mt-2">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100 dark:border-gray-800"
                    />
                  </div>
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
