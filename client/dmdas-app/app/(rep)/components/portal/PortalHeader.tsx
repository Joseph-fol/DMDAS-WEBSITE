"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Menu, Check } from 'lucide-react';
import Link from 'next/link';
import { useRepProfile } from '@/app/lib/repProfile';

interface PortalHeaderProps {
  onOpenMobileMenu?: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard-rep': 'Dashboard',
  '/manuals': 'My Manuals',
  '/students': 'Students',
  '/keycode-verification': 'Keycode Verification',
  '/settlement': 'Settlement & Payout',
  '/history': 'History',
  '/reports': 'Reports',
  '/messages': 'Messages',
  '/settings': 'Settings',
};

export default function PortalHeader({ onOpenMobileMenu }: PortalHeaderProps) {
  const pathname = usePathname();
  const { firstName } = useRepProfile();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Payment confirmed via Paystack',
      subtitle: 'Michael O. · CSC401',
      time: '16:02 today',
      unread: true,
    },
    {
      id: '2',
      title: 'Keycode generated',
      subtitle: 'Sarah O. · MTH201',
      time: '11:05 today',
      unread: true,
    },
    {
      id: '3',
      title: 'Manual collected',
      subtitle: 'David A. · CSC321',
      time: 'Aug 5, 2026',
      unread: false,
    },
  ]);

  const pageTitle = pageTitles[pathname] || 'Dashboard';
  const unreadCount = notifications.filter((n) => n.unread).length;
  const initials = firstName.charAt(0).toUpperCase();

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Left Title / Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E1193E] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#E1193E] hover:underline font-medium flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs hover:bg-slate-50 transition-colors ${
                      n.unread ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{n.subtitle}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <Link
                  href="/history"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#E1193E] hover:underline"
                >
                  View full activity history &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-100">
          <div className="w-8 h-8 rounded-full bg-[#E1193E] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {initials}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {firstName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none">
              Course Rep
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
