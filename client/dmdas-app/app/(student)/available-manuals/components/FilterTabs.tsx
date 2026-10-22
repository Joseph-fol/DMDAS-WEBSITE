'use client';

import React from 'react';
import { FilterTab } from '../data/manual';

interface FilterTabsProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  counts: Record<FilterTab, number>;
}

const TABS: FilterTab[] = ['All', 'Paid', 'Ready for Pickup', 'Collected', 'Failed'];

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeTab, onTabChange, counts }) => {
  return (
    <div className="border-b border-slate-200/80 mb-6">
      <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`whitespace-nowrap text-xs sm:text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${
                isActive
                  ? 'border border-slate-900 text-slate-900 font-semibold bg-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
