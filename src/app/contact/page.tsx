"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import CtaBanner from "@/components/CtaBanner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    subject: "Institution Demo",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HEADER */}
      <section className="pt-12 pb-14 bg-gradient-to-b from-[#FFF5F7] to-white border-b border-pink-100/60">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-pink-100 text-[#E1193E] text-xs font-bold tracking-wider uppercase">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Contact <span className="text-[#E1193E]">DMDAS</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Have a question about deploying DMDAS on your campus or need technical assistance? We are here to help.
          </p>
        </div>
      </section>

      {/* 2. CONTACT CONTENT */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Reach Our Support & Institutional Team
                </h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Our regional representatives assist universities, polytechnics, and colleges across Nigeria and West Africa.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAFBFD] border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Call Us Directly
                    </h4>
                    <p className="text-base font-bold text-gray-900 mt-0.5">+234 812 583 1469</p>
                    <p className="text-xs text-gray-500 mt-0.5">Mon - Fri, 8:00 AM - 6:00 PM WAT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAFBFD] border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Email Inquiries
                    </h4>
                    <p className="text-base font-bold text-gray-900 mt-0.5">support@dmdas.com.ng</p>
                    <p className="text-xs text-gray-500 mt-0.5">Responses within 2 business hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAFBFD] border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#FFE4E9] flex items-center justify-center text-[#E1193E] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Headquarters
                    </h4>
                    <p className="text-base font-bold text-gray-900 mt-0.5">
                      Ogbomoso, Oyo State, Nigeria
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Campus Innovation Center</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100/90 shadow-xl shadow-gray-100/50">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Prof. / Dr. / Mr. / Ms."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#E1193E] text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Institution / University Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. LAUTECH, UNILAG, FUTA"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#E1193E] text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Official Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@institution.edu.ng"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#E1193E] text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#E1193E] text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Subject / Inquiry Type
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#E1193E] text-gray-900"
                    >
                      <option value="Institution Demo">Request Institution Live Demo</option>
                      <option value="Keycode Support">Student Keycode Redemption Support</option>
                      <option value="Lecturer Uploads">Lecturer Manual Upload Guidance</option>
                      <option value="Billing & Accounting">Billing & Revenue Settlement</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your faculty, number of students, or any specific question..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#E1193E] text-gray-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl bg-[#E1193E] hover:bg-[#C20E30] text-white font-semibold text-sm shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Message Received!</h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Thank you for reaching out, <strong>{formData.name}</strong>. Our institutional team will get back to you via <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        institution: "",
                        subject: "Institution Demo",
                        message: "",
                      });
                    }}
                    className="text-xs text-[#E1193E] font-bold hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA BANNER */}
      <CtaBanner />
    </div>
  );
}
