"use client";

import { ArrowRight, GraduationCap } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function CtaBanner({
  title = "Ready to simplify manual distribution and improve accountability?",
  subtitle = "Join thousands of institutions using DMDAS today.",
  buttonText = "Get Started Today",
}: CtaBannerProps) {
  const { openAuthModal } = useModal();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#E1193E] text-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-red-500/10">

        {/* Subtle background decorative shapes */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Left: Icon and Text */}
          <div className="flex items-center gap-5 sm:gap-6 text-center md:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-[#E1193E]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
                {title}
              </h2>
              {subtitle && (
                <p className="text-red-100 text-sm sm:text-base mt-1 font-normal opacity-95">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Button */}
          <Link href="https://app.dmdas.com.ng/signup" target="_blank"
            className="shrink-0 inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-white text-[#E1193E] font-semibold text-sm sm:text-base hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
