"use client";

import { Target, Eye, Heart, CheckCircle2, ArrowRight } from "lucide-react";
import StatsCounter from "@/components/StatsCounter";
import CtaBanner from "@/components/CtaBanner";
import { AboutImage, HeroCampusVisual, HowItWorkImage, StudyGroupVisual } from "@/components/CampusVisuals";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";

export default function AboutPage() {
  const { openAuthModal } = useModal();

  const values = [
    "Transparency",
    "Accountability",
    "Integrity",
    "Innovation",
    "Excellence",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
                <span>ABOUT US</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight">
                About DMDAS
              </h1>

              <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                <p>
                  DMDAS (Digital Manual Distribution and Accountability System) is a smart solution built to simplify the distribution of course manuals in educational institutions.
                </p>
                <p>
                  We help schools digitize the entire manual distribution process, manage keycodes effortlessly, and promote accountability and transparency at every step.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="#purpose"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm sm:text-base shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Our Mission</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-6">
              <AboutImage />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <StatsCounter variant="full" />

      {/* 3. OUR PURPOSE - MISSION, VISION & VALUES */}
      <section id="purpose" className="py-16 sm:py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
              <span>OUR PURPOSE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Mission, Vision & Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Our Mission */}
            <div className="p-8 rounded-3xl border border-pink-100/80 bg-white hover:border-[#E1193E]/30 card-hover shadow-sm flex flex-col justify-start">
              <div className="w-14 h-14 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E] mb-6">
                <Target className="w-7 h-7 stroke-[1.75]" />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To digitize and streamline manual distribution in educational institutions while ensuring accountability, transparency, and efficiency.
              </p>
            </div>

            {/* Card 2: Our Vision */}
            <div className="p-8 rounded-3xl border border-pink-100/80 bg-white hover:border-[#E1193E]/30 card-hover shadow-sm flex flex-col justify-start">
              <div className="w-14 h-14 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E] mb-6">
                <Eye className="w-7 h-7 stroke-[1.75]" />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To become the leading digital platform for manual distribution and accountability across all educational institutions.
              </p>
            </div>

            {/* Card 3: Our Values */}
            <div className="p-8 rounded-3xl border border-pink-100/80 bg-white hover:border-[#E1193E]/30 card-hover shadow-sm flex flex-col justify-start">
              <div className="w-14 h-14 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E] mb-6">
                <Heart className="w-7 h-7 stroke-[1.75]" />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-4">Our Values</h3>
              <ul className="space-y-2.5">
                {values.map((val, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-[#E1193E] shrink-0" />
                    <span>{val}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR STORY - BUILDING A SMARTER WAY */}
      <section className="py-16 sm:py-24 bg-[#FAFBFD] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image */}
            <div className="lg:col-span-6">
              <HowItWorkImage />
            </div>

            {/* Right Story Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
                <span>OUR STORY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Building a Smarter Way <br className="hidden sm:block" />
                to Distribute Manuals
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                <p>
                  DMDAS was born from the need to solve the challenges of manual distribution in schools delays, mismanagement, lack of tracking, long queing and accountability gaps.
                </p>
                <p>
                  We combine technology and education to create a platform that empowers institutions and students with a seamless, secure, and transparent experience.
                </p>
              </div>

              <div className="pt-3">
                <Link href="https://app.dmdas.com.ng/signup" target="_blank"
                  // onClick={() => openAuthModal("register")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm sm:text-base shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <CtaBanner
        title="Ready to transform manual distribution in your institution?"
        subtitle="Join thousands of institutions using DMDAS today."
        buttonText="Get Started Today"
      />
    </div>
  );
}
