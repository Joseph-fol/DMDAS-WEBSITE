"use client";

import {
  UploadCloud,
  KeyRound,
  ShieldCheck,
  Download,
  CheckCircle2,
  Lock,
  Clock,
  BarChart3,
  Users2,
  ArrowRight,
} from "lucide-react";
import CtaBanner from "@/components/CtaBanner";
import { HeroCampusVisual, HowItWorkImage } from "@/components/CampusVisuals";
import { useModal } from "@/context/ModalContext";

export default function HowItWorksPage() {
  const { openAuthModal } = useModal();

  const steps = [
    {
      number: 1,
      title: "Distribute",
      description:
        "Course Representative upload course manuals to the system. Manuals are organized and made available to the right students.",
      icon: UploadCloud,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Institution uploading course manuals to DMDAS",
    },
    {
      number: 2,
      title: "Assign & Track",
      description:
        "Unique keycodes are generated and assigned to students. Distribution and usage are tracked in real-time.",
      icon: KeyRound,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Real-time keycode tracking dashboard and phone",
    },
    {
      number: 3,
      title: "Account & Report",
      description:
        "Every action is recorded for full transparency and accountability. Generate reports with just a few clicks.",
      icon: ShieldCheck,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Generating accountability and distribution audit reports",
    },
    {
      number: 4,
      title: "Access Manual",
      description:
        "Students redeem their keycodes to access and download their manuals securely.",
      icon: Download,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Student redeeming keycode and downloading manual",
    },
    {
      number: 5,
      title: "Complete & Secure",
      description:
        "The system ensures every manual is received, recorded, and accounted for.",
      icon: CheckCircle2,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Student studying with verified course manual",
    },
  ];

  const whyLoveDmdas = [
    {
      title: "Secure",
      description: "Data and transactions are protected with advanced security.",
      icon: Lock,
    },
    {
      title: "Efficient",
      description: "Save time and reduce the stress of manual processes.",
      icon: Clock,
    },
    {
      title: "Transparent",
      description: "Full visibility and accountability at every step.",
      icon: BarChart3,
    },
    {
      title: "Trusted",
      description: "Used and trusted by institutions and students across campuses.",
      icon: Users2,
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
                <span>HOW IT WORKS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.15]">
                Simple Steps. <br />
                <span className="text-[#E1193E]">Powerful Impact.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                DMDAS simplifies manual distribution and accountability in educational institutions through a seamless, transparent, and efficient process.
              </p>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-6">
              <HowItWorkImage />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5-STEP CONNECTED TIMELINE */}
      <section className="py-16 sm:py-24 bg-[#FAFBFD] border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How DMDAS Works
            </h2>
            <div className="w-16 h-1 bg-[#E1193E] rounded-full mx-auto mt-3" />
          </div>

          <div className="space-y-12 sm:space-y-16 relative">
            {/* Vertical timeline connector */}
            <div className="hidden sm:block absolute left-4 top-10 bottom-10 w-0.5 bg-red-200" />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative flex items-start gap-4 sm:gap-8">
                  {/* Numbered Badge Circle */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E1193E] text-white font-black text-sm sm:text-base flex items-center justify-center flex-shrink-0 z-10 shadow-md shadow-red-500/20 ring-4 ring-white">
                    {step.number}
                  </div>

                  {/* Step Card (Grid of Image + Info) */}
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 sm:p-7 rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-md transition-all">
                    {/* Left preview image */}
                    <div className="md:col-span-6 relative aspect-[16/10] overflow-hidden rounded-2xl bg-gray-100">
                      <img
                        src={step.image}
                        alt={step.imageAlt}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Right text card */}
                    <div className="md:col-span-6 flex flex-col justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E1193E] flex items-center justify-center">
                        <Icon className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. WHY INSTITUTIONS LOVE DMDAS */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Why Institutions Love DMDAS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyLoveDmdas.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-pink-100/80 hover:border-red-200 card-hover flex flex-col space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E]">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CTA BANNER */}
      <CtaBanner
        title="Ready to simplify manual distribution and improve accountability?"
        subtitle="Join thousands of institutions using DMDAS today."
        buttonText="Get Started Today"
      />
    </div>
  );
}
