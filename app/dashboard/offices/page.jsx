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
  Users,
  Shield,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ROLES = ["Admin", "Editor", "Viewer", "Pastor", "Staff"];

export default function UsersManagement() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState(null); // null = add, id = edit
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [password, setPassword] = useState("");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    "access-token": Cookies.get("token"),
  });

  const handleClose = () => {
    setShow(false);
    setEditId(null);
    setName("");
    setEmail("");
    setRole(ROLES[0]);
    setPassword("");
  };

  const handleShow = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setRole(ROLES[0]);
    setPassword("");
    setShow(true);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setName(item.name || "");
    setEmail(item.email || "");
    setRole(item.role || ROLES[0]);
    setPassword(""); // leave blank unless user types a new one
    setShow(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!role.trim()) return toast.error("Role is required");

    const isEdit = editId !== null;

    if (!isEdit) {
      if (!password.trim()) return toast.error("Password is required");
      if (password.length < 6)
        return toast.error("Password must be at least 6 characters");
    } else {
      // Only validate password if one was typed (means user wants to change it)
      if (password && password.length < 6)
        return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    const url = isEdit
      ? `${BACKEND_URL}/updateUser/${editId}`
      : `${BACKEND_URL}/createUser`;

    const payload = { name, email, role };
    if (password.trim()) payload.password = password;

    const request = isEdit
      ? axios.put(url, payload, { headers: authHeaders() })
      : axios.post(url, payload, { headers: authHeaders() });

    request
      .then(() => {
        toast.success(isEdit ? "User updated" : "User created successfully");
        setLoading(false);
        handleClose();
        getUsers();
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast.error(error?.response?.data?.message || "Something went wrong");
      });
  };

  const getUsers = () => {
    axios
      .get(`${BACKEND_URL}/getAllUsers`, { headers: authHeaders() })
      .then((res) => {
        setUsers(res.data);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  /* ---------------- Delete flow ---------------- */
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
      .delete(`${BACKEND_URL}/deleteUser/${id}`, {
        headers: authHeaders(),
      })
      .then(() => {
        toast.success("User deleted");
        setConfirmDeleteId(null);
        getUsers();
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to delete user");
      })
      .finally(() => setDeletingId(null));
  };

  // Filter & pagination
  const filteredData = users.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.role?.toLowerCase().includes(search.toLowerCase()),
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Role badge color
  const roleBadge = (r) => {
    switch (r?.toLowerCase()) {
      case "admin":
        return "bg-[#4c1d95]/10 dark:bg-[#6d28d9]/20 text-[#4c1d95] dark:text-[#a78bfa]";
      case "editor":
        return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400";
      case "pastor":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
      case "staff":
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div className="px-3 space-y-3 mx-auto">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Users Management
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            Manage admin accounts, roles and access.
          </p>
        </div>
        <button
          onClick={handleShow}
          className="inline-flex items-center gap-2 text-[11px] bg-[#4c1d95] hover:bg-[#3b1578] dark:bg-[#6d28d9] dark:hover:bg-[#5b21b6] text-white rounded-lg px-3 py-2 transition-colors"
        >
          <PlusCircle size={12} />
          Add User
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
            placeholder="Search by name, email or role..."
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
                <th className="px-3 py-2 font-medium">Role</th>
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
                    <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {item.name}
                    </td>
                    <td className="px-3 py-2 lowercase">{item.email}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full capitalize ${roleBadge(
                          item.role,
                        )}`}
                      >
                        <Shield size={10} />
                        {item.role}
                      </span>
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
                    No users found.
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
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Users
                  size={14}
                  className="text-[#4c1d95] dark:text-[#a78bfa]"
                />
                <h2 className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                  {editId !== null ? "Edit User" : "Add User"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder={
                    editId !== null
                      ? "Leave blank to keep current password"
                      : "Enter password (min 6 characters)"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-[11px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#4c1d95]/50 dark:focus:border-[#a78bfa]/50 transition-colors"
                />
                <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                  {editId !== null
                    ? "Leave blank if you don't want to change the password."
                    : "Password is hashed before being stored on the server."}
                </p>
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
                    {editId !== null ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Upload size={12} />
                    {editId !== null ? "Update" : "Submit"}
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
                Delete User
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-[11px] text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this user? This action cannot be
                undone.
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
