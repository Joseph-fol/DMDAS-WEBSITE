'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { Manual } from '../data/manual';

interface ManualCardProps {
  manual: Manual;
  onShowKeycode: (manual: Manual) => void;
}

export const ManualCard: React.FC<ManualCardProps> = ({ manual, onShowKeycode }) => {
  const isReady = manual.pickupStatus === 'Ready for Pickup';
  const isCollected = manual.pickupStatus === 'Collected';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-800 shadow-2xs">
            <BookOpen className="w-4 h-4 text-slate-700" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Paid
          </span>
        </div>

        {/* Course Info */}
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            {manual.code}
          </h3>
          <p className="text-xs font-medium text-slate-600 mt-0.5">
            {manual.title}
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            {manual.department} · {manual.level}
          </p>
        </div>

        {/* Price & Pickup Status Row */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
          <span className="text-base font-extrabold text-slate-900">
            {manual.price}
          </span>

          {isReady && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Ready for Pickup
            </span>
          )}

          {isCollected && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Collected
            </span>
          )}
        </div>

        {/* Keycode Container */}
        <div className="bg-[#FFF0F3] border border-pink-100/60 rounded-xl px-3.5 py-2.5 flex items-center justify-between mt-3">
          <span className="text-xs font-medium text-slate-500">Keycode</span>
          <span className="font-mono font-bold text-[#E51749] text-xs tracking-wider">
            {manual.keycode}
          </span>
        </div>
      </div>

      {/* Footer Action or Timestamp */}
      <div className="mt-3 pt-1">
        {isReady && (
          <>
            <button
              onClick={() => onShowKeycode(manual)}
              className="w-full bg-[#E51749] hover:bg-[#D0103F] active:scale-[0.99] text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              Show Keycode
            </button>
            <div className="text-[11px] text-slate-400 mt-2 font-medium">
              {manual.createdAt}
            </div>
          </>
        )}

        {isCollected && (
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            {manual.collectedAt || manual.createdAt}
          </div>
        )}
      </div>
    </div>
  );
};
