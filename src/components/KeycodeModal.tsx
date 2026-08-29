"use client";

import { useState } from "react";
import { X, KeyRound, CheckCircle, Download, BookOpen, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { useModal } from "@/context/ModalContext";

export default function KeycodeModal() {
  const { isKeycodeOpen, closeKeycodeModal } = useModal();
  const [keycode, setKeycode] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [unlockedManual, setUnlockedManual] = useState<any>(null);
  const [error, setError] = useState("");

  if (!isKeycodeOpen) return null;

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!keycode.trim()) {
      setError("Please enter a valid keycode");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setUnlockedManual({
        title: "CSC 201: Data Structures and Algorithms",
        author: "Department of Computer Science & Engineering",
        pages: 148,
        semester: "Harmattan Semester 2024/2025",
        institution: "Ladoke Akintola University of Technology",
        code: keycode.toUpperCase(),
      });

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E1193E", "#FF4D6D", "#FFB3C1", "#10B981"],
        });
      } catch (err) {
        // ignore if canvas-confetti is not loaded
      }
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setKeycode("");
    setMatricNo("");
    setUnlockedManual(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#FFF0F3] to-white p-6 pb-5 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight">Redeem Course Manual</h3>
              <p className="text-xs text-gray-500">Enter your institution keycode to unlock access</p>
            </div>
          </div>
          <button
            onClick={closeKeycodeModal}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center border border-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {!isSuccess ? (
            <form onSubmit={handleRedeem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Student Keycode <span className="text-[#E1193E]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={keycode}
                    onChange={(e) => setKeycode(e.target.value)}
                    placeholder="e.g. ABCD-E7DA-LK1-MN9P"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono text-sm tracking-wider focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E1193E]/20 focus:border-[#E1193E] uppercase transition-all"
                  />
                  <div className="absolute right-3 top-3.5 text-xs text-gray-400">16-CHAR</div>
                </div>
                {/* Quick Fill Suggestion */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-gray-500">Try demo code:</span>
                  <button
                    type="button"
                    onClick={() => setKeycode("ABCD-E7DA-LK1-MN9P")}
                    className="text-[11px] font-mono text-[#E1193E] bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200 transition-colors"
                  >
                    ABCD-E7DA-LK1-MN9P
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Matric / Student ID Number (Optional)
                </label>
                <input
                  type="text"
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  placeholder="e.g. 2024/CSC/0892"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E1193E]/20 focus:border-[#E1193E] transition-all"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#E1193E] font-medium">
                  {error}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Validating Keycode...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Unlock Course Manual</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>Protected by 256-bit DMDAS Security & Instant Audit Log</span>
              </p>
            </form>
          ) : (
            <div className="text-center space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Keycode Verified Successfully
                </span>
                <h4 className="text-xl font-extrabold text-gray-900 mt-2">
                  {unlockedManual?.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{unlockedManual?.author}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-left space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Semester:</span>
                  <span className="font-semibold text-gray-900">{unlockedManual?.semester}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pages:</span>
                  <span className="font-semibold text-gray-900">{unlockedManual?.pages} Pages (PDF)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Redeemed Token:</span>
                  <span className="font-mono font-semibold text-[#E1193E]">{unlockedManual?.code}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => alert("Simulated: Manual opened in secure DMDAS Reader viewer!")}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#E1193E] hover:bg-[#C20E30] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Online</span>
                </button>

                <button
                  onClick={() => alert("Simulated: Offline copy encrypted and downloaded!")}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-[#E1193E] underline font-medium"
              >
                Redeem another keycode
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
