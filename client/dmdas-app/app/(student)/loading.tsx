"use client";

// app/(student)/loading.tsx
export default function StudentDashboardLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="h-12 w-12 rounded-full border-4 border-neutral-200 border-t-neutral-900 animate-spin" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-neutral-600">
        Loading...
      </p>
    </div>
  );
}
