import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KeycodeModal from "@/components/KeycodeModal";
import AuthModal from "@/components/AuthModal";
import { ModalProvider } from "@/context/ModalContext";

export const metadata: Metadata = {
  title: "DMDAS | Digital Manual Distribution and Accountability System",
  description:
    "DMDAS helps higher institutions digitize and streamline course manual distribution, manage keycodes effortlessly, and promote 100% accountability and transparency.",
  keywords: [
    "DMDAS",
    "Digital Manual Distribution",
    "Accountability System",
    "Educational Institution",
    "Keycode Management",
    "Course Manuals",
    "Nigeria University Software",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white text-[#1E293B] selection:bg-red-100 selection:text-[#E1193E]">
        <ModalProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <KeycodeModal />
          <AuthModal />
        </ModalProvider>
      </body>
    </html>
  );
}
