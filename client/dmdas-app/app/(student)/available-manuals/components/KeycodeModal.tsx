'use client';

import React, { useState } from 'react';
import { Check, X, Copy } from 'lucide-react';
import { Manual } from '../data/manual';

interface KeycodeModalProps {
  manual: Manual | null;
  onClose: () => void;
}

export const KeycodeModal: React.FC<KeycodeModalProps> = ({ manual, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!manual) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(manual.keycode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      {/* Modal Card */}
      <div 
        className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-2 bg-[#E51749] w-full" />

        {/* Content Container */}
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                My Keycode
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Present this to your Course Representative to collect your manual.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payment Confirmed Badge */}
          <div className="mt-6 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mt-3">
              Payment Confirmed via Paystack
            </p>
          </div>

          {/* Keycode Display Box */}
          <div className="bg-[#FFF5F7] border border-dashed border-pink-300 rounded-2xl p-5 text-center mt-4">
            <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              Keycode
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E51749] tracking-wider my-1.5 font-mono">
              {manual.keycode}
            </div>
            <span className="text-xs text-slate-400 font-normal">
              Single-use · Valid until collected
            </span>
          </div>

          {/* Breakdown Details Container */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 mt-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Manual</span>
              <span className="font-semibold text-slate-900 font-mono  text-right max-w-55 truncate">
                {manual.code} – {manual.title}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Student</span>
              <span className="font-semibold text-slate-900 font-mono">
                {manual.studentName} ({manual.studentId})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Amount Paid</span>
              <span className="font-extrabold text-slate-900">{manual.price}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Paystack Ref</span>
              <span className="font-semibold text-slate-800 font-mono">
                {manual.paystackRef}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
              <span className="text-slate-500 font-medium">Pickup Status</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {manual.pickupStatus}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6">
            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Keycode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
