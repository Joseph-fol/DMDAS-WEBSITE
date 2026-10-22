'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onPurchaseClick: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          My Manuals 
        </h1>
        <p className="text-sm text-slate-500 font-normal mt-1">
          All your purchased course manuals.
        </p>
      </div>
      <div>
        <Link
          href= "/purchase-manual"
          className="inline-flex items-center justify-center gap-2 bg-[#E51749] hover:bg-[#D0103F] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98] w-full sm:w-auto"
        >
          <ShoppingBag className="w-4 h-4 hidden" />
          <span>Purchase Manual</span>
        </Link>
      </div>
    </header>
  );
};
