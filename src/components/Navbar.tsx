"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { Menu, X, KeyRound } from "lucide-react";
import { useModal } from "@/context/ModalContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Features", href: "/features" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openAuthModal, openKeycodeModal } = useModal();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/95 backdrop-blur-md ${
        scrolled ? "shadow-sm border-b border-gray-100 py-3" : "py-4 sm:py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 py-1 ${
                    isActive
                      ? "text-[#E1193E] font-semibold"
                      : "text-gray-700 hover:text-[#E1193E]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E1193E] rounded-full transform transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={openKeycodeModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 hover:text-[#E1193E] bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full transition-all duration-200"
              title="Test Student Keycode Redemption"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#E1193E]" />
              <span>Redeem Keycode</span>
            </button>

            <Link
              href="/https://app.dmdas.com.ng/signin/" target="_blank"
              className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-[#E1193E] border border-gray-300 hover:border-red-300 rounded-lg transition-all duration-200 hover:bg-red-50/50"
            >
              Log In
            </Link>

            <Link href="/https://app.dmdas.com.ng/signup/" target="_blank"
              // onClick={() => openAuthModal("register")}
              className="px-5 py-2 text-sm font-medium text-white bg-[#E1193E] hover:bg-[#C20E30] rounded-lg shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={openKeycodeModal}
              className="p-2 text-gray-700 hover:text-[#E1193E] bg-gray-50 border border-gray-200 rounded-lg"
              title="Redeem Keycode"
            >
              <KeyRound className="w-4 h-4 text-[#E1193E]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-6 border-t border-gray-100 space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-base font-medium ${
                      isActive
                        ? "bg-red-50 text-[#E1193E] font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#E1193E]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openKeycodeModal();
                }}
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-[#E1193E] bg-red-50 rounded-lg flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                Redeem Student Keycode
              </button>
              
              <Link href="/https://app.dmdas.com.ng/signin/"
                
                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Log In
              </Link>

              <Link href="/https://app.dmdas.com.ng/signup/"

                className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-[#E1193E] hover:bg-[#C20E30] rounded-lg shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// onClick={() => {
//                   setMobileMenuOpen(false);
//                   openAuthModal("login");
//                 }}
