"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Users,
  Package,
  MessageSquare,
  CreditCard,
  Clock,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Book,
  Settings,
} from 'lucide-react';
import { useRepProfile } from '@/app/lib/repProfile';
import Image from 'next/image';

interface PortalSidebarProps {
  onCloseMobile?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard-rep', icon: Home },
  { name: 'Manuals', href: '/manuals', icon: BookOpen },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Keycode Verification', href: '/keycode-verification', icon: Package },
  { name: 'Messages', href: '/messages', icon: MessageSquare, badge: 2 },
  { name: 'Settlement & Payout', href: '/settlement', icon: CreditCard },
  { name: 'History', href: '/history', icon: Clock },
  { name: 'Reports', href: '/reports', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function PortalSidebar({ onCloseMobile }: PortalSidebarProps) {
  const pathname = usePathname();
  const { firstName } = useRepProfile();
  const [collapsed, setCollapsed] = useState(false);
  const initials = firstName.charAt(0).toUpperCase();

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <aside
      className={`bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 h-screen sticky top-0 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Logo */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard-rep"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 overflow-hidden"
          >
            {/* <Image src="" height="200px" width="100px"></Image> */}
            <div className="w-9 h-9 rounded-xl bg-[#E1193E] flex items-center justify-center text-white shrink-0 shadow-sm">
              <Book className="w-5 h-5 fill-white stroke-none" />
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-800 text-md tracking-tight leading-none">
                  DMDAS
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                  REP PORTAL
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={toggleCollapsed}
            aria-label="Toggle sidebar collapse"
            className="hidden md:flex w-6 h-6 items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard-rep' && pathname?.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#FFF0F3] text-[#E1193E] font-semibold'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#E1193E]' : 'text-[#64748B] group-hover:text-[#1E293B]'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!collapsed && item.badge !== undefined && (
                  <span className="w-5 h-5 rounded-full bg-[#E1193E] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-4">
        {/* Need Help Card */}
        {!collapsed && (
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-3.5">
            <h4 className="text-xs font-semibold text-slate-800">Need Help?</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Contact support for assistance
            </p>
            <a
              href="mailto:support@dmdas.com.ng"
              className="text-[11px] font-semibold text-[#E1193E] hover:underline mt-2 inline-flex items-center gap-1"
            >
              Get Support &rarr;
            </a>
          </div>
        )}

        {/* User Card */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E1193E] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  {firstName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none">
                  Course Rep
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('token');
                  sessionStorage.removeItem('Student');
                  window.location.href = '/signin';
                }
              }}
              className="flex items-center gap-2 mt-3 text-xs text-slate-500 hover:text-[#E1193E] transition-colors pl-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
