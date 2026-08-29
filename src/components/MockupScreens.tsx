"use client";

import { Check, Shield, Lock, Bell, Cloud, Laptop, Smartphone, Copy, CheckCircle2, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { useState } from "react";

// Mockup 1: Digital Manual Distribution (Laptop / Table UI)
export function ManualDistributionMockup() {
  return (
    <div className="w-full bg-[#1E293B] rounded-xl p-2.5 sm:p-3 text-white shadow-md font-sans select-none overflow-hidden">
      {/* Browser / Window Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-700/60">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-400 font-mono ml-2">dmdas.edu.ng/admin/manuals</span>
        </div>
        <span className="text-[9px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-medium">
          Live Sync
        </span>
      </div>

      {/* Content Table */}
      <div className="space-y-1.5 text-[10px]">
        <div className="flex justify-between items-center text-gray-400 px-2 font-medium">
          <span>Course / Manual</span>
          <span>Dept</span>
          <span>Status</span>
        </div>

        <div className="bg-gray-800/80 rounded-lg p-2 flex items-center justify-between border border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#E1193E]/20 text-[#E1193E] flex items-center justify-center font-bold text-[9px]">
              CSC
            </div>
            <div>
              <p className="font-medium text-white text-[11px]">CSC 201: Data Structures</p>
              <p className="text-[9px] text-gray-400">1,240 / 1,300 Claimed</p>
            </div>
          </div>
          <span className="text-gray-300">Comp Sci</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-medium">
            Active
          </span>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-2 flex items-center justify-between border border-gray-700/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[9px]">
              MTH
            </div>
            <div>
              <p className="font-medium text-white text-[11px]">MTH 101: Gen. Mathematics</p>
              <p className="text-[9px] text-gray-400">3,450 / 3,500 Claimed</p>
            </div>
          </div>
          <span className="text-gray-300">Math</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-medium">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

// Mockup 2: Keycode Management (Phone UI mockup)
export function KeycodeMockup() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[280px] mx-auto bg-white rounded-2xl p-3 sm:p-4 border-2 border-gray-100 shadow-md font-sans text-center">
      <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
      <span className="text-[10px] uppercase font-bold tracking-wider text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
        Student Keycode
      </span>

      <div className="my-3 p-3 bg-red-50/60 border border-dashed border-red-200 rounded-xl">
        <p className="text-[10px] text-gray-500 font-medium">Single-Use Security Token</p>
        <p className="text-base sm:text-lg font-mono font-black text-[#E1193E] tracking-wider my-1">
          ABCD-E7DA-LK1-MN9P
        </p>
        <p className="text-[9px] text-gray-400">Assigned to: 2024/CSC/0892</p>
      </div>

      <button
        onClick={handleCopy}
        className="w-full py-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
      >
        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        <span>{copied ? "Keycode Copied!" : "Copy Keycode"}</span>
      </button>
    </div>
  );
}

// Mockup 3: Accountability & Transparency (Audit Dashboard)
export function AccountabilityMockup() {
  return (
    <div className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
        <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#E1193E]" /> Audit & Distribution Logs
        </span>
        <span className="text-[9px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
          100% Verified
        </span>
      </div>

      {/* Chart preview graphic */}
      <div className="h-16 w-full flex items-end justify-between gap-1 px-1 py-1 bg-red-50/30 rounded-lg mb-2">
        <div className="w-full bg-red-200 rounded-t h-[40%]" />
        <div className="w-full bg-red-300 rounded-t h-[65%]" />
        <div className="w-full bg-red-400 rounded-t h-[50%]" />
        <div className="w-full bg-[#E1193E] rounded-t h-[90%]" />
        <div className="w-full bg-red-500 rounded-t h-[75%]" />
        <div className="w-full bg-[#E1193E] rounded-t h-[100%]" />
      </div>

      {/* Audit item */}
      <div className="text-[10px] space-y-1 text-gray-600">
        <div className="flex justify-between items-center py-0.5 border-b border-gray-50">
          <span>Student #2841 redeemed PHY 101</span>
          <span className="text-[9px] text-gray-400">12s ago</span>
        </div>
        <div className="flex justify-between items-center py-0.5">
          <span>Admin batch generated 500 keys</span>
          <span className="text-[9px] text-gray-400">2m ago</span>
        </div>
      </div>
    </div>
  );
}

// Mockup 4: Real-time Insights (Analytics Laptop UI)
export function RealTimeInsightsMockup() {
  return (
    <div className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#E1193E]" />
          <span className="text-[11px] font-bold text-gray-900">Faculty Distribution Metrics</span>
        </div>
        <span className="text-[9px] font-semibold text-[#E1193E] bg-red-50 px-1.5 py-0.5 rounded">
          +24.8% YoY
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-[9px] text-gray-500">Distribution Rate</p>
          <p className="text-sm font-extrabold text-gray-900">98.4%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-[9px] text-gray-500">Avg Access Time</p>
          <p className="text-sm font-extrabold text-gray-900">1.2s</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100">
        <span>Total Revenue Tracked:</span>
        <span className="font-bold text-gray-900">₦62,500,000</span>
      </div>
    </div>
  );
}

// Mockup 5: Role-based Access Modal Mockup
export function RoleBasedAccessMockup() {
  return (
    <div className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-md">
      <p className="text-[11px] font-bold text-gray-900 mb-2">User Roles & Permissions</p>
      <div className="space-y-1.5 text-[10px]">
        <div className="flex items-center justify-between p-1.5 bg-red-50/50 rounded-lg border border-red-100/60">
          <div>
            <p className="font-semibold text-gray-900">Administrator</p>
            <p className="text-[9px] text-gray-500">Full system access & audit</p>
          </div>
          <div className="w-4 h-4 rounded bg-[#E1193E] text-white flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
        </div>

        <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">Lecturer / Staff</p>
            <p className="text-[9px] text-gray-500">Upload manuals & reports</p>
          </div>
          <div className="w-4 h-4 rounded bg-[#E1193E] text-white flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
        </div>

        <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-gray-800">Student</p>
            <p className="text-[9px] text-gray-500">Redeem keycodes & read</p>
          </div>
          <div className="w-4 h-4 rounded bg-[#E1193E] text-white flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Mockup 6: Secure Cloud Storage
export function CloudStorageMockup() {
  return (
    <div className="w-full h-36 bg-gradient-to-br from-[#E1193E] to-[#B80C28] rounded-xl p-3 text-white flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1.5 backdrop-blur-sm">
        <Cloud className="w-6 h-6 text-white" />
      </div>
      <p className="text-xs font-bold">256-bit Encrypted Cloud</p>
      <p className="text-[9px] text-red-100 max-w-[200px] mt-0.5">
        Automated backups, DRM protection & 99.99% high availability
      </p>
    </div>
  );
}

// Mockup 7: Notifications & Alerts (Smartphone Push Toast)
export function NotificationsMockup() {
  return (
    <div className="w-full bg-[#0F172A] rounded-xl p-3 text-white shadow-md">
      <div className="flex items-center justify-between text-[9px] text-gray-400 mb-2">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 rounded bg-[#E1193E] flex items-center justify-center text-white font-bold text-[7px]">
            D
          </div>
          <span className="font-semibold text-gray-200">DMDAS</span>
        </div>
        <span>now</span>
      </div>

      <div className="bg-gray-800/90 rounded-lg p-2.5 border border-gray-700/50">
        <div className="flex items-start gap-2">
          <Bell className="w-4 h-4 text-[#E1193E] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold text-white">Your manual is ready!</p>
            <p className="text-[9px] text-gray-300 leading-snug mt-0.5">
              Your keycode is active. You can now access and read your GST 101 course guide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mockup 8: Secure Payments (Payment Success Modal)
export function PaymentsMockup() {
  return (
    <div className="w-full bg-white rounded-xl p-3 border border-gray-100 shadow-md text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-1.5">
        <CheckCircle2 className="w-6 h-6" />
      </div>
      <p className="text-xs font-bold text-gray-900">Payment Successful!</p>
      <p className="text-[9px] text-gray-400 font-mono mt-0.5">Transaction ID: #DM123456</p>
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px] text-gray-600">
        <span>Amount Paid:</span>
        <span className="font-bold text-gray-900">₦2,500.00</span>
      </div>
    </div>
  );
}
