"use client";

import Image from "next/image";
import { Check, ArrowRight, ShieldCheck, Sparkles, Key, FileCheck, Layers } from "lucide-react";


export function HeroCampusVisual() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex items-center justify-center">
      {/* Decorative red dotted arc / stroke */}
      <svg
        className="absolute -top-6 -left-6 w-full h-full pointer-events-none opacity-40 z-0"
        viewBox="0 0 500 500"
        fill="none"
      >
        <path
          d="M50 250 A 200 200 0 0 1 450 250"
          stroke="#E1193E"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <circle cx="50" cy="250" r="4" fill="#E1193E" />
      </svg>

      {/* Main Curved Image Container */}
      <div className="relative z-10 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] border-4 border-white shadow-2xl bg-linear-to-br from-red-50 to-gray-100">
        <div className="relative aspect-4/3 w-full">

          <Image width={300} height={400}
            src="/student-avatar1.jpg"
            alt="Students in library collaborating with laptop on DMDAS"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          
          {/* Subtle bottom gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Floating Keycode Badge */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 text-[#E1193E] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Distribution Status</p>
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <span>100% Instant Delivery</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutImage() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex items-center justify-center">
      {/* Decorative red dotted arc / stroke */}
      <svg
        className="absolute -top-6 -left-6 w-full h-full pointer-events-none opacity-40 z-0"
        viewBox="0 0 500 500"
        fill="none"
      >
        <path
          d="M50 250 A 200 200 0 0 1 450 250"
          stroke="#E1193E"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <circle cx="50" cy="250" r="4" fill="#E1193E" />
      </svg>

      {/* Main Curved Image Container */}
      <div className="relative z-10 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] border-4 border-white shadow-2xl bg-linear-to-br from-red-50 to-gray-100">
        <div className="relative aspect-4/3 w-full">

          <Image width={300} height={400}
            src="/student-avatar2.jpg"
            alt="Students in library collaborating with laptop on DMDAS"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          
          {/* Subtle bottom gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Floating Keycode Badge */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 text-[#E1193E] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Distribution Status</p>
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <span>100% Instant Delivery</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorkImage() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex items-center justify-center">
      {/* Decorative red dotted arc / stroke */}
      <svg
        className="absolute -top-6 -left-6 w-full h-full pointer-events-none opacity-40 z-0"
        viewBox="0 0 500 500"
        fill="none"
      >
        <path
          d="M50 250 A 200 200 0 0 1 450 250"
          stroke="#E1193E"
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />
        <circle cx="50" cy="250" r="4" fill="#E1193E" />
      </svg>

      {/* Main Curved Image Container */}
      <div className="relative z-10 w-full overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] border-4 border-white shadow-2xl bg-linear-to-br from-red-50 to-gray-100">
        <div className="relative aspect-4/3 w-full">

          <Image width={300} height={400}
            src="/student-avatar4.jpg"
            alt="Students in library collaborating with laptop on DMDAS"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          
          {/* Subtle bottom gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Floating Keycode Badge */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 text-[#E1193E] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">Distribution Status</p>
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <span>100% Instant Delivery</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Student Working on Laptop with Floating Step Overlays (for "How DMDAS Works" on Home page)
export function StudentWorkflowVisual() {
  return (
    <div className="relative w-full max-w-md mx-auto">

      {/* Background Image Container */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-gray-100 shadow-xl bg-gray-100 aspect-4/3">
        <Image width={300} height={500}
          src="/student-avatar3.jpg"
          alt="Student accessing digital manual on DMDAS"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent sm:w-3/4" />

        {/* Steps Overlay on the card */}
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-center space-y-3 z-10">
          {/* Step 1 */}
          <div className="bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#E1193E] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              1
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs">Distribute</h5>
              <p className="text-[10px] text-gray-500 leading-tight">
                Course Representative upload & distribute manuals digitally.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#E1193E] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              2
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs">Assign & Track</h5>
              <p className="text-[10px] text-gray-500 leading-tight">
                Keycodes are assigned & tracked in real-time.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/95 backdrop-blur-sm p-2.5 sm:p-3 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#E1193E] text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              3
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs">Account & Report</h5>
              <p className="text-[10px] text-gray-500 leading-tight">
                Every action recorded for full transparency.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Student Group for "Our Story" section (About page)
export function StudyGroupVisual() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border-2 border-gray-100 shadow-xl bg-gray-50">
      <img
        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
        alt="Team of students studying course manuals together"
        className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}
