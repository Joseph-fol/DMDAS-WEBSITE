"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/navbar";

export default function Page() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return <DashboardNavbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />;
}
