"use client";

import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Student } from '@/types/portal';
import { getStudents } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function StudentsPage() {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStudents = async (query = '') => {
    try {
      const data = await getStudents(query);
      setStudents(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch students from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    loadStudents(val);
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Students
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          All students assigned to your manuals.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search students..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[#E1193E] animate-spin" />
            <p className="text-sm text-slate-500">Loading students from backend...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No students found matching &quot;{search}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px] bg-slate-50/40">
                  <th className="py-3.5 px-6">Student</th>
                  <th className="py-3.5 px-4">Matric</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Manuals</th>
                  <th className="py-3.5 px-4">Keycodes</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((student) => {
                  const initial = student.name.charAt(0);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <span className="font-bold text-slate-900 text-xs">
                            {student.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-500">
                        {student.matric}
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {student.department}
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {student.level}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        {student.manualsCount}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        {student.keycodesCount !== null ? student.keycodesCount : '—'}
                      </td>

                      <td className="py-4 px-6">
                        {student.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
