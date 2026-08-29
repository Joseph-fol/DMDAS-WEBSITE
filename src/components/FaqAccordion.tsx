"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export const defaultFaqs: FaqItem[] = [
  {
    question: "What is DMDAS?",
    answer:
      "DMDAS (Digital Manual Distribution and Accountability System) is a secure digital platform built for higher educational institutions to digitize course manuals, automate distribution, eliminate manual bottlenecks, and provide 100% financial and academic accountability.",
    category: "General",
  },
  {
    question: "How do I get a keycode?",
    answer:
      "Keycodes are unique alphanumeric tokens issued directly by course coordinators, department administrators, or automatically generated after making a secure digital payment. Students simply enter their keycode on the portal to instantly unlock and collect their course manuals from the course representative",
    category: "Students",
  },
  {
    question: "Who can use DMDAS?",
    answer:
      "DMDAS is tailored for university administrations, polytechnic faculties, academic departments, lecturers, bookshops, and students. Any tertiary institution looking to replace manual paper distribution with a secure, trackable digital system can deploy DMDAS.",
    category: "Institutions",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, completely. All financial transactions on DMDAS are processed via top-tier PCI-DSS compliant payment gateways utilizing 256-bit SSL encryption. Neither DMDAS nor your institution stores your sensitive card or banking credentials.",
    category: "Security & Payments",
  },
  {
    question: "Who developed DMDAS",
    answer:
      "DMDAS was developed and maintained by FolaTech (a Software Company), which is owned by Olawoyin Joseph Folasakin, a FullStack Software Engineer.",
    category: "General",
  },
  {
    question: "How does DMDAS prevent manual piracy and unauthorized sharing?",
    answer:
      "Each manual distributed via DMDAS incorporates dynamic watermarking tied to the student's matriculation number and keycode token. Keycodes are strictly single-use and audit-logged.",
    category: "Security & Payments",
  },
];

interface FaqAccordionProps {
  items?: FaqItem[];
  showAll?: boolean;
}

export default function FaqAccordion({
  items = defaultFaqs,
  showAll = false,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const displayedItems = showAll ? items : items.slice(0, 4);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {displayedItems.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl p-5 sm:p-6 transition-all duration-200 bg-white ${
              isOpen
                ? "border-[#E1193E]/30 shadow-md shadow-red-500/5 ring-1 ring-[#E1193E]/20"
                : "border-gray-200/90 hover:border-red-200 hover:bg-gray-50/50"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none"
            >
              <span className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#E1193E] transition-colors">
                {faq.question}
              </span>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isOpen
                    ? "bg-[#E1193E] text-white"
                    : "bg-red-50 text-[#E1193E] group-hover:bg-[#E1193E] group-hover:text-white"
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
            </button>

            {isOpen && (
              <div className="mt-3.5 pt-3 border-t border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
