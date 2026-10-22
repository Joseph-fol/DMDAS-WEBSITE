"use client";

import { GraduationCap, Users, BookOpen, ShieldCheck } from "lucide-react";

interface StatsCounterProps {
  variant?: "full" | "compact";
}

export default function StatsCounter({ variant = "full" }: StatsCounterProps) {
  const stats = [
    {
      value: "1",
      label: variant === "full" ? "Institutions Using DMDAS" : "Institutions",
      icon: GraduationCap,
    },
    {
      value: "50+",
      label: variant === "full" ? "Students Served" : "Students",
      icon: Users,
    },
    {
      value: "0+",
      label: "Manuals Distributed",
      icon: BookOpen,
    },
    {
      value: "100%",
      label: variant === "full" ? "Commitment to Transparency" : "Transparency",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-[#FFF5F7] border border-pink-100/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:py-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 sm:gap-4 p-2"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFE4E9] flex items-center justify-center flex-shrink-0 text-[#E1193E]">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.75]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#E1193E] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600 leading-tight mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
