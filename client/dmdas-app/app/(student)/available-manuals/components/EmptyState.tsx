'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  onBrowse: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onBrowse }) => {
  return (
    <div className="py-20 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
      {/* Icon Badge */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-4 shadow-2xs">
        <Inbox className="w-6 h-6 text-slate-700" />
      </div>

      {/* Text */}
      <h3 className="text-base font-bold text-slate-900 mb-1">
        No manuals found
      </h3>
      <p className="text-xs text-slate-500 max-w-xs mb-5">
        Try a different filter or purchase a new manual.
      </p>

      {/* Action Button */}
      <Link
        href= "/purchase-manual"
        className="bg-[#E51749] hover:bg-[#D0103F] active:scale-[0.98] text-white font-medium px-4 py-2 rounded-lg text-xs shadow-xs transition-all"
      >
        Browse Manuals
      </Link>
    </div>
  );
};
