"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, X, BookOpen } from "lucide-react";
import { Manual } from "../types/portal";
import {
  getManuals,
  createManual,
  updateManual,
  toggleManualStatus,
} from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function ManualsPage() {
  const { showToast } = useToast();
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingManual, setEditingManual] = useState<Manual | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    courseTitle: "",
    courseCode: "",
    price: "",
    printedStock: "",
    semester: "",
  });

  const loadManuals = async () => {
    try {
      const data = await getManuals();
      setManuals(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load manuals", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManuals();
  }, []);

  const openAddModal = () => {
    setEditingManual(null);
    setFormData({
      courseTitle: "",
      courseCode: "",
      price: "",
      printedStock: "",
      semester: "",
    });

    setModalOpen(true);
  };

  const openEditModal = (manual: Manual) => {
    setEditingManual(manual);
    setFormData({
      courseTitle: manual.courseTitle,
      courseCode: manual.courseCode,
      price: Number(manual.price).toString(),
      semester: manual.semester || "",
      printedStock: manual.printedStock || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(formData.price);
    const printedStock = Number(formData.printedStock);

    if (!formData.courseTitle.trim() || !formData.courseCode.trim()) {
      showToast("Course title and course code are required", "error");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showToast("Enter a valid price greater than zero", "error");
      return;
    }

    if (!Number.isInteger(printedStock) || printedStock < 0) {
      showToast("Enter a valid printed stock quantity", "error");
      return;
    }

    if (!editingManual && !["Harmattan", "Rain"].includes(formData.semester)) {
      showToast("Select a semester", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingManual) {
        await updateManual(editingManual.id, {
          courseTitle: formData.courseTitle,
          courseCode: formData.courseCode.toUpperCase(),
          price,
          printedStock,
        });
        showToast("Manual updated successfully!", "success");
      } else {

        await createManual({
          courseTitle: formData.courseTitle,
          courseCode: formData.courseCode.toUpperCase(),
          price,
          semester: formData.semester,
          printedStock,
        });
        showToast("New course manual added successfully!", "success");
      }
      setModalOpen(false);
      loadManuals();
    } catch (err: any) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (manual: Manual) => {
    try {
      const targetStatus =
        manual.status === "Available" ? "Unavailable" : "Available";
      await toggleManualStatus(manual.id, targetStatus);
      showToast(`${manual.courseCode} marked as ${targetStatus}`, "info");
      loadManuals();
    } catch (err: any) {
      showToast(err.message || "Failed to update status", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manuals
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage all course manuals.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Manual</span>
        </button>
      </div>

      {/* Manuals Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[#E1193E] animate-spin" />
            <p className="text-sm text-slate-500">
              Loading manuals...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-220 table-fixed text-left border-collapse text-xs">
              <colgroup>
                <col className="w-[27%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[11%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px] bg-slate-50/40">
                  <th className="py-3.5 px-6">Course Title</th>
                  <th className="py-3.5 px-4">Course Code</th>
                  <th className="py-3.5 px-4">Semester</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">Printed Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {manuals.map((manual) => (
                  <tr
                    key={manual.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Course Title & Course code */}
                    <td className="py-4 px-6">
                      <span
                        className="block truncate font-bold text-slate-900 text-xs"
                        title={manual.courseTitle}
                      >
                        {manual.courseTitle}
                      </span>
                    </td>

                    {/* Code */}
                    <td className="py-4 px-4 font-mono font-bold text-slate-800">
                      <span className="block truncate" title={manual.courseCode}>
                        {manual.courseCode}
                      </span>
                    </td>

                    {/* Semester */}
                    <td className="py-4 px-4 text-slate-600">
                      {manual.semester || "—"}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₦{manual.price.toLocaleString()}
                    </td>

                    {/* Printed stock */}
                    <td className="py-4 px-4 text-right font-semibold text-slate-700">
                      {Number(manual.printedStock || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {manual.status === "Available" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Unavailable
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEditModal(manual)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleToggleStatus(manual)}
                          className={`text-xs font-medium transition-colors ${
                            manual.status === "Available"
                              ? "text-slate-400 hover:text-slate-700"
                              : "text-[#E1193E] hover:underline"
                          }`}
                        >
                          {manual.status === "Available"
                            ? "Archive"
                            : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Manual Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#E1193E]" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingManual ? "Edit Course Manual" : "Add Course Manual"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manual Title *
                </label>
                <input
                  type="text"
                  value={formData.courseTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, courseTitle: e.target.value })
                  }
                  placeholder="e.g. System Analysis and Design"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        courseCode: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. CSC311"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="3500"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  />
                </div> */}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester *
                  </label>
                  <select
                    value={formData.semester}
                    disabled={Boolean(editingManual)}
                    required={!editingManual}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="" disabled>
                      Select option
                    </option>
                    <option value="Harmattan">Harmattan</option>
                    <option value="Rain">Rain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Printed Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.printedStock}
                    onChange={(e) =>
                      setFormData({ ...formData, printedStock: e.target.value })
                    }
                    placeholder="20"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>
                    {editingManual ? "Save Changes" : "Create Manual"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
