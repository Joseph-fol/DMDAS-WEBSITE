"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import { KeycodeItem } from '../types/portal';
import { lookupKeycode, confirmKeycodeCollection } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function KeycodeVerificationPage() {
  const { showToast } = useToast();
  const [keyCodeInput, setKeyCodeInput] = useState('');
  const [lookingUp, setLookingUp] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [matchedItem, setMatchedItem] = useState<KeycodeItem | null>(null);
  const [awaitingList, setAwaitingList] = useState<KeycodeItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadAwaitingList = async () => {
    try {
      const res = await lookupKeycode('');
      setAwaitingList(res.awaitingPickup);
    } catch (err: any) {
      showToast(err.message || 'Failed to load awaiting list from backend', 'error');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadAwaitingList();
  }, []);

  const handleLookup = async (e?: React.FormEvent, codeToSearch?: string) => {
    if (e) e.preventDefault();
    const query = (codeToSearch !== undefined ? codeToSearch : keyCodeInput).trim();

    if (!query) {
      showToast('Please enter a keycode to look up', 'info');
      return;
    }

    setLookingUp(true);
    try {
      const res = await lookupKeycode(query);
      if (res.match) {
        setMatchedItem(res.match);
        showToast('Keycode match found!', 'success');
      } else {
        setMatchedItem(null);
        showToast(`No match found for "${query}" on backend`, 'error');
      }
      setAwaitingList(res.awaitingPickup);
    } catch (err: any) {
      showToast(err.message || 'Error communicating with backend', 'error');
    } finally {
      setLookingUp(false);
    }
  };

  const handleConfirmCollection = async (itemToConfirm?: KeycodeItem) => {
    const target = itemToConfirm || matchedItem;
    if (!target) return;

    setConfirming(true);
    try {
      await confirmKeycodeCollection(target.keycode);
      showToast(
        `Manual collection confirmed for ${target.studentName} (${target.courseCode})!`,
        'success'
      );

      if (matchedItem && matchedItem.id === target.id) {
        setMatchedItem(null);
        setKeyCodeInput('');
      }

      await loadAwaitingList();
    } catch (err: any) {
      showToast(err.message || 'Failed to confirm manual collection', 'error');
    } finally {
      setConfirming(false);
    }
  };

  const selectRow = (item: KeycodeItem) => {
    setKeyCodeInput(item.keycode);
    setMatchedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Keycode Verification
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Verify student keycodes and confirm manual collections.
        </p>
      </div>

      {/* Verify Student Keycode Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Verify Student Keycode
        </h3>

        {/* <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={keyCodeInput}
            onChange={(e) => setKeyCodeInput(e.target.value.toUpperCase())}
            placeholder="ENTER KEYCODE (E.G. DM-1234)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
          />
          <button
            type="submit"
            disabled={lookingUp}
            className="px-6 py-2.5 bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {lookingUp && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Look Up</span>
          </button>
        </form> */}

        {/* Keycode Match Found Card */}
        {matchedItem && (
          <div className="mt-6 p-5 sm:p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                Keycode Match Found
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-600 border border-sky-100/60">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                {matchedItem.status}
              </span>
            </div>

            {/* Red bold Keycode */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-[#E1193E]">
                {matchedItem.keycode}
              </h1>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Student
                </span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5">
                  {matchedItem.studentName}
                </span>
                <span className="text-xs text-slate-500 font-mono block">
                  {matchedItem.matric}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Manual
                </span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5">
                  {matchedItem.courseCode}
                </span>
                <span className="text-xs text-slate-500 block truncate">
                  {matchedItem.courseTitle}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Amount Paid
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  ₦{matchedItem.amount.toLocaleString()}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Paystack Ref
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700 block mt-0.5">
                  {matchedItem.paystackRef}
                </span>
              </div>
            </div>

            {/* Confirm Manual Collection Button */}
            <button
              onClick={() => handleConfirmCollection()}
              disabled={confirming}
              className="w-full py-3.5 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {confirming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
              <span>Confirm Manual Collection</span>
            </button>
          </div>
        )}
      </div>

      {/* Students Awaiting Pickup Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Students Awaiting Pickup
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {awaitingList.length} waiting
          </span>
        </div>

        {initialLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#E1193E] animate-spin" />
            <p className="text-xs text-slate-400">Loading awaiting students...</p>
          </div>
        ) : awaitingList.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400 bg-slate-50/50 rounded-xl">
            No students currently awaiting pickup.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 pr-4">Student</th>
                  <th className="py-3 px-4">Manual</th>
                  <th className="py-3 px-4">Keycode</th>
                  <th className="py-3 px-4">Paystack Ref</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {awaitingList.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => selectRow(item)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 pr-4">
                      <span className="font-bold text-slate-900 block group-hover:text-[#E1193E] transition-colors">
                        {item.studentName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.matric}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {item.courseCode}
                      </span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                        {item.courseTitle}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#E1193E] tracking-wide">
                        {item.keycode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {item.paystackRef}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      ₦{item.amount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-600 border border-sky-100/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 pl-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmCollection(item);
                        }}
                        className="px-3.5 py-1.5 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
