"use client";

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortalSidebar from './PortalSidebar';
import PortalHeader from './PortalHeader';
import { ToastProvider } from '@/context/ToastContext';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("Student");
    if (!token) {
      router.replace("/signin");
      return;
    }
    try {
      const user = JSON.parse(storedUser || "{}") as { role?: string };
      if (user.role !== "rep" && user.role !== "superRep") router.replace("/dashboard");
    } catch {
      router.replace("/signin");
    }
  }, [router]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans antialiased selection:bg-red-100 selection:text-[#E1193E]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <PortalSidebar />
        </div>

        {/* Mobile Sidebar Overlay & Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Sidebar content */}
            <div className="relative z-10 w-72 max-w-xs h-full bg-white shadow-2xl flex flex-col">
              <PortalSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
          <PortalHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
