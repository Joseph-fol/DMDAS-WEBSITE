"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, KeyRound, ShieldCheck, BarChart3, Users, CheckCircle2 } from "lucide-react";
import StatsCounter from "@/components/StatsCounter";
import CtaBanner from "@/components/CtaBanner";
import FaqAccordion from "@/components/FaqAccordion";
import { HeroCampusVisual, HowItWorkImage, StudentWorkflowVisual } from "@/components/CampusVisuals";
import { useModal } from "@/context/ModalContext";
import Image from "next/image";

export default function HomePage() {
  const { openAuthModal } = useModal();

  const coreFeatures = [
    {
      title: "Digital Manual Distribution",
      description: "Distribute course manuals digitally to the right students at the right time.",
      icon: BookOpen,
    },
    {
      title: "Keycode Management",
      description: "Generate, assign, and track keycodes with ease and full control.",
      icon: KeyRound,
    },
    {
      title: "Accountability & Transparency",
      description: "Track every transaction and ensure complete accountability.",
      icon: ShieldCheck,
    },
    {
      title: "Real-time Insights",
      description: "Get real-time reports and insights to make smarter decisions.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
                <span>DIGITAL. ACCOUNTABLE. EFFICIENT.</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-gray-900 leading-[1.15]">
                Smarter Distribution. <br />
                <span className="text-[#E1193E]">Stronger Accountability.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                DMDAS helps institutions distribute course manuals digitally, manage keycodes, and ensure transparency every step of the way.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="https://app.dmdas.com.ng/signup/" target="_blank" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl sm:rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm sm:text-base shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/features"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl sm:rounded-full bg-white hover:bg-gray-50 text-gray-700 hover:text-[#E1193E] font-semibold text-sm sm:text-base border border-gray-300 hover:border-red-200 transition-all shadow-sm"
                >
                  Explore Features
                </Link>
              </div>

              {/* Trust Badge with Avatars */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-left">
                <div className="flex -space-x-2 overflow-hidden">
                  <Image width={20} height={30}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="/student-avatar1.jpg"
                    alt="Student avatar 1"
                  />
                  <Image width={20} height={30}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="/student-avatar2.jpg"
                    alt="Student avatar 2"
                  />
                  <Image width={20} height={30}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="/student-avatar3.jpg"
                    alt="Student avatar 3"
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium leading-snug">
                  Trusted by students, departments and institutions <br className="hidden sm:block" />
                  across campuses.
                </p>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-6">
              <HeroCampusVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES 4-CARD OVERVIEW */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-gray-100/90 bg-white hover:border-pink-200 card-hover shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E1193E] flex items-center justify-center">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. STATS STRIP */}
      <StatsCounter variant="compact" />

      {/* 4. "HOW DMDAS WORKS" HIGHLIGHT SECTION */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image with numbered overlay */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <HowItWorkImage />
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
                <span>SIMPLE. FAST. RELIABLE.</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                How DMDAS Works
              </h2>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Our system simplifies the entire process of manual distribution and accountability, from upload to reporting.
              </p>

              <div className="pt-2">
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm shadow-md shadow-red-500/10 transition-all hover:gap-3"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="py-16 sm:py-20 bg-[#FAFBFD] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Accordion Component */}
          <FaqAccordion />

          {/* View All Button */}
          <div className="mt-10 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-7 py-2.5 rounded-full border border-gray-300 hover:border-red-300 text-gray-700 hover:text-[#E1193E] text-sm font-semibold transition-all hover:bg-red-50/50"
            >
              View All FAQs
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <CtaBanner
        title="Ready to simplify manual distribution and improve accountability?"
        subtitle="Join thousands of institutions using DMDAS today."
        buttonText="Get Started Today"
      />
    </div>
  );
}
