"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FAFBFD] border-t border-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <Logo />
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed mt-3">
              Building a smarter, more accountable way to distribute course manuals.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.666.237-2.036.715-.37.478-.444 1.135-.444 2.155v1.115h4.482l-.59 3.667h-3.892v7.98c5.441-1.025 9.574-5.782 9.574-11.691C23.408 5.503 18.297.391 12 .391S.592 5.503.592 12c0 5.909 4.133 10.666 9.509 11.691Z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#E1193E] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-semibold text-gray-900 text-sm tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-[#E1193E]">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <a href="tel:+2348001234567" className="hover:text-[#E1193E] transition-colors">
                  +234 812 583 1569
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-[#E1193E]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:support@dmdas.com.ng" className="hover:text-[#E1193E] transition-colors">
                  support@dmdas.com.ng
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-[#E1193E] mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>Ogbomoso, Oyo State, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Crimson copyright bar */}
      <div className="bg-[#E1193E] text-white py-3.5 text-center text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto px-4">
          © {new Date().getFullYear()} DMDAS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
