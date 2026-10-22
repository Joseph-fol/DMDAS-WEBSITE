import type { Metadata } from "next";
import "./globals.css";
import PortalLayout from "../components/portal/PortalLayout";

export const metadata: Metadata = {
  title: "DMDAS | Course Rep Portal",
  description: "Digital Manual Distribution and Accountability System - Course Representative Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen bg-[#F8FAFC] text-[#1E293B]">
        <PortalLayout>{children}</PortalLayout>
      </body>
    </html>
  );
}
