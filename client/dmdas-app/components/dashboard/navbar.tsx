"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type StudentProfile = {
  firstName: string;
  role: string;
};

type DashboardNavbarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
};

export default function DashboardNavbar({ isSidebarOpen, setIsSidebarOpen }: DashboardNavbarProps) {
  const pathname = usePathname();

  let title = "Dashboard";
  if (!pathname) title = "Dashboard";
  else if (pathname.includes("available-manuals")) title = "My Manuals";
  else if (pathname.includes("transaction-history")) title = "Payments";
  else if (pathname.includes("purchase-manual")) title = "Purchase Manual";
  else if (pathname.includes("my-profile-settings")) title = "Profile";
  else title = "Dashboard";

  const [profile, setProfile] = useState<StudentProfile>({
    firstName: "Student",
    role: "STUDENT",
  });

  useEffect(() => {
    try {
      const userDetails = sessionStorage.getItem("Student");
      if (!userDetails) return;

      const parsedData = JSON.parse(userDetails);
      const source = parsedData?.user || parsedData?.student || parsedData;
      const fullName = (source?.fullName || source?.name || "").trim();
      const firstName = fullName ? fullName.split(/\s+/)[0] : "Student";
      const role = source?.role || source?.userRole || "STUDENT";

      setProfile({ firstName, role: String(role).toUpperCase() });
    } catch {
      // Keep the deterministic default profile when stored data is invalid.
    }
  }, []);

  // Derive initials for avatar
  const initials = (profile.firstName || "").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() || "ST";

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
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 0 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
              <path d="M10 17a2 2 0 0 0 4 0" />
            </svg>
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
          </button>

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