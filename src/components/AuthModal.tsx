"use client";

import { useState } from "react";
import { X, Building2, User, GraduationCap, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useModal } from "@/context/ModalContext";

export default function AuthModal() {
  const { isAuthOpen, authMode, closeAuthModal, openAuthModal } = useModal();
  const [role, setRole] = useState<"institution" | "staff" | "student">("institution");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      closeAuthModal();
      alert(
        authMode === "login"
          ? `Welcome back! Logged in as ${role.toUpperCase()}.`
          : `Registration submitted! Our campus team will contact ${institutionName || email} shortly.`
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFF0F3] to-white p-6 pb-4 border-b border-pink-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl text-gray-900">
              {authMode === "login" ? "Log in to DMDAS" : "Get Started with DMDAS"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {authMode === "login"
                ? "Access your digital distribution portal"
                : "Join educational institutions modernizing course materials"}
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-700 flex items-center justify-center border border-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="px-6 pt-5">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            Select Portal Account
          </label>
          <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("institution")}
              className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                role === "institution"
                  ? "bg-white text-[#E1193E] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Institution</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("staff")}
              className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                role === "staff"
                  ? "bg-white text-[#E1193E] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Lecturer/Staff</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-2 text-xs font-semibold rounded-lg flex flex-col items-center gap-1 transition-all ${
                role === "student"
                  ? "bg-white text-[#E1193E] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === "register" && role === "institution" && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. University of Lagos / LAUTECH"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#E1193E]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address / Portal ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu.ng"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#E1193E]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#E1193E]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {authMode === "login" && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-[#E1193E] hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full py-3 px-4 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitted ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{authMode === "login" ? "Log In" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            {authMode === "login" ? (
              <p>
                Don't have an institution account?{" "}
                <button
                  type="button"
                  onClick={() => openAuthModal("register")}
                  className="text-[#E1193E] font-bold hover:underline"
                >
                  Get Started
                </button>
              </p>
            ) : (
              <p>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="text-[#E1193E] font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
