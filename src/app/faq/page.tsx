"use client";

import { useState } from "react";
import { Search, HelpCircle, ArrowRight } from "lucide-react";
import FaqAccordion, { defaultFaqs, FaqItem } from "@/components/FaqAccordion";
import CtaBanner from "@/components/CtaBanner";
import { useModal } from "@/context/ModalContext";

const extraFaqs: FaqItem[] = [
  ...defaultFaqs,
  {
    question: "Can an institution integrate DMDAS with existing student portals (e.g. EduPortal)?",
    answer:
      "Yes. DMDAS provides RESTful APIs and webhook integrations allowing seamless synchronization with campus student databases, matriculation registers, and course registration platforms.",
    category: "Institutions",
  },
  {
    question: "What happens if a student loses their keycode token?",
    answer:
      "Students can look up previously allocated tokens using their verified matriculation number and student email address, or request instant re-verification from their course representative.",
    category: "Students",
  },
  {
    question: "How are royalties and sales revenues disbursed to course representatives?",
    answer:
      "Revenues collected from manual distributions are automatically credited into the course representative's authorized bank account with detailed automated financial audit statements.",
    category: "Security & Payments",
  },
];

export default function FaqPage() {
  const { openKeycodeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "General", "Students", "Institutions", "Security & Payments"];

  const filteredFaqs = extraFaqs.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO & SEARCH */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-[#FFF5F7] to-white border-b border-pink-100/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
            <span>HELP & KNOWLEDGE BASE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Frequently Asked <span className="text-[#E1193E]">Questions</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about manual distribution, keycode security, institution onboarding, and student access.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search answers (e.g. keycode, payment)..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#E1193E]/20 focus:border-[#E1193E] text-gray-900"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
          </div>

          {/* Categories Pill Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#E1193E] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-red-200 hover:text-[#E1193E]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FAQS LIST */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length > 0 ? (
            <FaqAccordion items={filteredFaqs} showAll={true} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">No matching questions found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching with different terms or select All categories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. CTA BANNER */}
      <CtaBanner
        title="Still have questions or need campus onboarding?"
        subtitle="Our institutional support team is available 24/7."
        buttonText="Get in Touch"
      />
    </div>
  );
}
