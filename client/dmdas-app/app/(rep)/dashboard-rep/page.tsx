"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  KeyRound,
  Inbox,
  Package,
  Loader2,
  RefreshCw,
  X,
  CreditCard,
} from 'lucide-react';
import { DashboardStats } from '../types/portal';
import { getDashboardData, requestWithdrawal } from '../lib/api';
import { useToast } from '../context/ToastContext';
import { useRepProfile } from '@/app/lib/repProfile';

export default function DashboardPage() {
  const { showToast } = useToast();
  const { firstName } = useRepProfile();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Withdraw Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('4670');
  const [withdrawing, setWithdrawing] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const stats = await getDashboardData();
      setData(stats);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not fetch dashboard data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!amountNum || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setWithdrawing(true);
    try {
      const result = await requestWithdrawal(amountNum);
      showToast(`Withdrawal of ₦${amountNum.toLocaleString()} initiated! Ref: ${result.reference}`, 'success');
      setWithdrawModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Withdrawal request failed', 'error');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-[#E1193E] animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    );
  }

  if (!data) return null;

  const maxWeeklyCount = Math.max(...data.weeklyConfirmations.map((w) => w.count), 20);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Withdraw Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, {firstName} 
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Here is what is happening with your course manuals today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Refresh from personal backend"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#E1193E]' : ''}`} />
          </button>

          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="px-4 py-2.5 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <span>Withdraw ₦{data.availableBalance.toLocaleString()}</span>
          </button>
        </div>
      </div>

      {/* Row 1 Stats: Gross Sales, Deduction, Available Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Gross Sales
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">
            ₦{data.grossSales.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Total Paystack confirmations
          </p>
        </div>

        {/* System Deduction */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            System Deduction
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">
            - ₦{data.systemDeduction.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {data.systemDeductionRate}% platform operation fee
          </p>
        </div>

        {/* Available Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Available Balance
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#E1193E] mt-1.5">
            ₦{data.availableBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Ready to withdraw
          </p>
        </div>
      </div>

      {/* Row 2 Stats: 4 Small Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Confirmed Today */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600 block">
              Confirmed Today
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {data.confirmedToday}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Via Paystack
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Keycodes Issued */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600 block">
              Keycodes Issued
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {data.keycodesIssued}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Auto-generated
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
        </div>

        {/* Awaiting Pickup */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600 block">
              Awaiting Pickup
            </span>
            <span className="text-2xl font-bold text-[#E1193E] mt-1 block">
              {data.awaitingPickup}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Students waiting
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E1193E] flex items-center justify-center shrink-0">
            <Inbox className="w-4 h-4" />
          </div>
        </div>

        {/* Manuals Distributed */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-600 block">
              Manuals Distributed
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {data.manualsDistributed}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Total collected
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Alert / Notice Banner */}
      <div className="bg-[#FFF0F3] border border-[#FCE7EC] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#E1193E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {data.awaitingPickup} students ready for keycode verification
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Students with active keycodes are waiting for manual collection.
            </p>
          </div>
        </div>

        <Link
          href="/keycode-verification"
          className="px-4 py-2 bg-[#E1193E] hover:bg-[#C20E30] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto text-center"
        >
          Verify Keycodes
        </Link>
      </div>

      {/* Mid Section Grid: Bar Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weekly Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Paystack Confirmations — This Week
            </h3>
          </div>

          <div className="mt-8 pt-4 pb-2">
            <div className="grid grid-cols-6 gap-3 sm:gap-4 items-end h-44 border-b border-slate-100 pb-2">
              {data.weeklyConfirmations.map((item) => {
                const heightPercentage = Math.round((item.count / maxWeeklyCount) * 100);
                return (
                  <div key={item.day} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-bold text-slate-500 mb-1 group-hover:text-[#E1193E] transition-colors">
                      {item.count}
                    </span>
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="w-full max-w-[42px] bg-[#E1193E] hover:bg-[#C20E30] rounded-t-lg transition-all duration-300 shadow-xs group-hover:brightness-95"
                    />
                    <span className="text-xs font-medium text-slate-500 mt-2">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
            <Link
              href="/history"
              className="text-xs font-medium text-[#E1193E] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    activity.color === 'green'
                      ? 'bg-emerald-500'
                      : activity.color === 'blue'
                      ? 'bg-blue-500'
                      : activity.color === 'red'
                      ? 'bg-red-500'
                      : activity.color === 'purple'
                      ? 'bg-purple-500'
                      : 'bg-amber-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {activity.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {activity.subtitle}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Progress Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Distribution Progress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.distributionProgress.map((item) => (
            <div
              key={item.courseCode}
              className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-4 space-y-2.5"
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 mr-2">
                    {item.courseCode}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.courseTitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Distributed</span>
                <span className="font-semibold text-slate-700">
                  {item.distributed}/{item.total} ({item.percentage}%)
                </span>
              </div>

              <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#E1193E] h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E1193E]" />
                <h3 className="text-base font-bold text-slate-900">
                  Withdraw to Bank Account
                </h3>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Bank
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <p className="font-bold">EMEKA ANUNOBI</p>
                  <p className="text-slate-500 mt-0.5">GTBank · 0123456789 (Verified)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Withdrawal Amount (₦)
                </label>
                <input
                  type="number"
                  max={data.availableBalance}
                  min={500}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Available: ₦{data.availableBalance.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawing}
                  className="px-4 py-2 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {withdrawing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Withdrawal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
