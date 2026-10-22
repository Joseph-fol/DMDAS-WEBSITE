"use client";

import React, { useState, useEffect } from 'react';
import {
  Download,
  Loader2,
  Coins,
  TrendingDown,
  Building2,
  Wallet,
} from 'lucide-react';
import { ReportsData } from '@/types/portal';
import { getReportsData } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function ReportsPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getReportsData();
        setData(res);
      } catch (err: any) {
        showToast(err.message || 'Failed to load reports from backend', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const handleExport = () => {
    if (!data) return;
    setExporting(true);

    try {
      const csvRows = [
        ['DMDAS Report - Performance Summary'],
        ['Generated At', new Date().toLocaleString()],
        ['Course Rep', 'Emeka A.'],
        [],
        ['Metric', 'Amount (NGN)'],
        ['Gross Sales', data.grossSales],
        ['Platform Deductions (5%)', data.deductions],
        ['Total Withdrawn', data.withdrawn],
        ['Pending Available Balance', data.available],
        [],
        ['Course Code', 'Course Title', 'Performance %'],
        ...data.manualPerformance.map((m) => [m.courseCode, m.courseTitle, `${m.percentage}%`]),
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `DMDAS-Report-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Report CSV exported successfully!', 'success');
    } catch (err) {
      showToast('Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-[#E1193E] animate-spin" />
        <p className="text-sm text-slate-500">Loading reports from backend...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Title & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reports
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Summary of payment and distribution performance.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all shadow-2xs flex items-center gap-2 self-start sm:self-auto"
        >
          {exporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E1193E]" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>Export Report</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Gross Sales
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1.5 block">
              ₦{data.grossSales.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Paystack payments
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4" />
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Deductions
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1.5 block">
              ₦{data.deductions.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              {data.deductionRate}% platform fee
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>

        {/* Withdrawn */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Withdrawn
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1.5 block">
              ₦{data.withdrawn.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Total paid out
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>

        {/* Available */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Available
            </span>
            <span className="text-2xl font-bold text-[#E1193E] mt-1.5 block">
              ₦{data.available.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Pending withdrawal
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E1193E] flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Manual Performance Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900">
          Manual Performance
        </h3>

        <div className="space-y-6">
          {data.manualPerformance.map((perf) => (
            <div key={perf.courseCode} className="flex items-center gap-4">
              <span className="w-16 font-mono font-bold text-slate-800 text-xs shrink-0">
                {perf.courseCode}
              </span>

              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#E1193E] h-full rounded-full transition-all duration-700"
                  style={{ width: `${perf.percentage}%` }}
                />
              </div>

              <span className="text-xs font-semibold text-slate-600 w-12 text-right shrink-0">
                {perf.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
