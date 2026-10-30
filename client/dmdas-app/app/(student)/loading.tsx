"use client";

import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

// app/(student)/loading.tsx
export default function StudentDashboardLoading() {
  return (
    <div className="min-h-[60vh] bg-white px-4 py-6 sm:px-6">
      <DashboardSkeleton />
    </div>
  );
}
