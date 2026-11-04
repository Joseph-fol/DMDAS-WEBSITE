"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getStudentNotifications,
  StudentNotification,
} from "../../app/lib/notifications";
import axios from "axios";

type StudentProfile = {
  firstName: string;
  role: string;
};

type DashboardNavbarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

function getStoredProfile(): StudentProfile {
  try {
    const userDetails = sessionStorage.getItem("Student");
    if (!userDetails) return { firstName: "Student", role: "STUDENT" };

    const parsedData = JSON.parse(userDetails);
    const source = parsedData?.user || parsedData?.student || parsedData;
    const fullName = (source?.fullName || source?.name || "").trim();
    const firstName = fullName ? fullName.split(/\s+/)[0] : "Student";
    const role = source?.role || source?.userRole || "STUDENT";

    return { firstName, role: String(role).toUpperCase() };
  } catch {
    return { firstName: "Student", role: "STUDENT" };
  }
}

export default function DashboardNavbar({ isSidebarOpen, setIsSidebarOpen }: DashboardNavbarProps) {
  const pathname = usePathname();

  let title = "Dashboard";
  if (!pathname) title = "Dashboard";
  else if (pathname.includes("available-manuals")) title = "My Manuals";
  else if (pathname.includes("transaction-history")) title = "Payments";
  else if (pathname.includes("purchase-manual")) title = "Purchase Manual";
  else if (pathname.includes("my-profile-settings")) title = "Profile";
  else title = "Dashboard";

  const [profile] = useState<StudentProfile>(() => getStoredProfile());
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setNotifications(
          await getStudentNotifications(sessionStorage.getItem("token")),
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Unable to load notifications:", error.message);
        }
      }
    };

    void loadNotifications();
  }, []);

  // Derive initials for avatar
  const initials = (profile.firstName || "").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "ST";
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent bg-white text-slate-600 transition hover:border-slate-200 hover:bg-slate-50 lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true"><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h10" /></svg>
          </button>

          <h2 className="text-sm font-semibold text-slate-800 sm:text-base">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={isNotificationsOpen}
              onClick={() => setIsNotificationsOpen((open) => !open)}
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 0 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path d="M10 17a2 2 0 0 0 4 0" />
            </svg>
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-0.5 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-11 z-30 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                  <span className="text-xs text-slate-400">{unreadCount} unread</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="border-b border-slate-100 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{notification.message}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{notification.createdAt}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/my-profile-settings?tab=notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="block px-4 py-3 text-center text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  View all
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div suppressHydrationWarning className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white font-semibold">{initials}</div>
            <div className="min-w-0 flex flex-col leading-tight">
              <span suppressHydrationWarning className="text-sm font-semibold">{profile.firstName}</span>
              <span suppressHydrationWarning className="text-xs text-slate-500">{profile.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}