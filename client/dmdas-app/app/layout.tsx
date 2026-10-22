import type { Metadata } from "next";
import "./globals.css";
import { satoshi } from "./fonts";
import NextTopLoader from 'nextjs-toploader';
import InstallPrompt from "./components/portal/InstallPrompt";

export const metadata: Metadata = {
  title: "DMDAS | Student Portal",
  description: "Digital Manuals Distribution and Accountability System",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "DMDAS",
    "Digital Manual Distribution",
    "Accountability System",
    "Educational Institution",
    "Keycode Management",
    "Course Manuals",
    "Manual Distribution",
    "Nigeria University Software",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={satoshi.className}>
      <body>
        {children}
        <InstallPrompt />
        <NextTopLoader color="#EC003F" showSpinner={false} height={3} />
      </body>
    </html>
  );
}