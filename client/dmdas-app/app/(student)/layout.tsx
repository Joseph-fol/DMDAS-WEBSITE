"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/navbar";
import DashboardSidebar from "@/components/dashboard/sidebar";

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen">
        <DashboardSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      <div className="flex min-w-0 flex-col">
        <DashboardNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}>
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Sidebar */}
          <div
            className={`relative flex h-full w-72 max-w-[calc(100%-3rem)] flex-col transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <DashboardSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        </div>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}