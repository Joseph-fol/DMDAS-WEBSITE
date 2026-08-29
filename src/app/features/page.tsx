"use client";

import {
  BookOpen,
  KeyRound,
  ShieldCheck,
  BarChart3,
  Users2,
  Cloud,
  Bell,
  Lock,
  Clock,
  CheckCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import CtaBanner from "@/components/CtaBanner";
import { HeroCampusVisual } from "@/components/CampusVisuals";
import {
  ManualDistributionMockup,
  KeycodeMockup,
  AccountabilityMockup,
  RealTimeInsightsMockup,
  RoleBasedAccessMockup,
  CloudStorageMockup,
  NotificationsMockup,
  PaymentsMockup,
} from "@/components/MockupScreens";
import { useModal } from "@/context/ModalContext";

export default function FeaturesPage() {
  const { openAuthModal } = useModal();

  const featureCards = [
    {
      title: "Digital Manual Distribution",
      description:
        "Upload and distribute course manuals digitally to the right students at the right time.",
      icon: BookOpen,
      mockup: <ManualDistributionMockup />,
    },
    {
      title: "Keycode Management",
      description:
        "Generate, assign, and manage unique keycodes with full control and flexibility.",
      icon: KeyRound,
      mockup: <KeycodeMockup />,
    },
    {
      title: "Accountability & Transparency",
      description:
        "Track every distribution, access, and activity with complete transparency and audit logs.",
      icon: ShieldCheck,
      mockup: <AccountabilityMockup />,
    },
    {
      title: "Real-time Insights",
      description:
        "Get real-time reports and analytics to make smarter, data-driven decisions.",
      icon: BarChart3,
      mockup: <RealTimeInsightsMockup />,
    },
    {
      title: "Role-based Access",
      description:
        "Define roles and permissions for staff, admins, and students to ensure secure access.",
      icon: Users2,
      mockup: <RoleBasedAccessMockup />,
    },
    {
      title: "Secure Cloud Storage",
      description:
        "Store manuals securely in the cloud with automatic backup and high availability.",
      icon: Cloud,
      mockup: <CloudStorageMockup />,
    },
    {
      title: "Notifications & Alerts",
      description:
        "Keep students and staff informed with automated notifications and important alerts.",
      icon: Bell,
      mockup: <NotificationsMockup />,
    },
    {
      title: "Secure Payments",
      description:
        "Process payments securely and confirm transactions before manual access.",
      icon: Lock,
      mockup: <PaymentsMockup />,
    },
  ];

  const platformBenefits = [
    {
      title: "Save Time",
      description: "Automate manual distribution and reduce administrative workload.",
      icon: Clock,
    },
    {
      title: "Enhance Security",
      description: "Protect data, keycodes, and transactions with advanced security.",
      icon: ShieldCheck,
    },
    {
      title: "Increase Accuracy",
      description: "Minimize errors and ensure the right students get the right manuals.",
      icon: CheckCircle,
    },
    {
      title: "Improve Accountability",
      description: "Track every step and build a culture of transparency and trust.",
      icon: Users2,
    },
    {
      title: "Better for Students",
      description: "Students get instant, secure access to the materials they need to succeed.",
      icon: GraduationCap,
    },
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
                <span>FEATURES</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.15]">
                Powerful Features. <br />
                <span className="text-[#E1193E]">Built for Education.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                DMDAS is packed with features that make manual distribution smarter, faster, and more accountable for institutions and students.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => openAuthModal("register")}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm sm:text-base shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-6">
              <HeroCampusVisual />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 8-CARD FEATURE GRID WITH PREVIEWS */}
      <section className="py-16 sm:py-24 bg-[#FAFBFD] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E1193E] flex items-center justify-center">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* UI Preview Area */}
                  <div className="mt-auto pt-2">{card.mockup}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EVERYTHING YOU NEED IN ONE PLATFORM (5-COLUMN STRIP) */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Everything You Need in One Platform
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {platformBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-pink-100/80 hover:border-red-200 card-hover flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E]">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{benefit.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <CtaBanner
        title="Ready to transform manual distribution in your institution?"
        subtitle="Join thousands of institutions using DMDAS today."
        buttonText="Get Started Today"
      />
    </div>
  );
}
