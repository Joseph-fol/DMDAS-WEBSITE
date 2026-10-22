"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { ActivityEvent } from '@/types/portal';
import { getActivityHistory } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function HistoryPage() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async (selectedFilter = filter, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getActivityHistory(selectedFilter);
      setEvents(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load activity history from backend', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory(filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Activity History
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <p className="text-sm text-slate-500">
            All Paystack-confirmed payments and keycode events.
          </p>
          <button
            type="button"
            onClick={() => loadHistory(filter, true)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh history
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: 'All Activities' },
          { key: 'payment_confirmed', label: 'Payments' },
          { key: 'keycode_generated', label: 'Keycodes' },
          { key: 'manual_collected', label: 'Collections' },
          { key: 'withdrawal_processed', label: 'Withdrawals' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              filter === tab.key
                ? 'bg-[#E1193E] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-[#E1193E] animate-spin" />
            <p className="text-sm text-slate-500">Loading activity timeline...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No events found for this filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      event.color === 'green'
                        ? 'bg-emerald-500'
                        : event.color === 'blue'
                        ? 'bg-blue-500'
                        : event.color === 'red'
                        ? 'bg-red-500'
                        : event.color === 'purple'
                        ? 'bg-purple-500'
                        : 'bg-amber-500'
                    }`}
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {event.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] sm:text-xs text-slate-400 shrink-0 font-medium">
                  {event.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
