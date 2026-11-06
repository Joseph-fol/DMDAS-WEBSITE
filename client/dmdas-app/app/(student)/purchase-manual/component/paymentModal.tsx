"use client";

import React from "react";
import { ArrowLeft, ExternalLink, LockKeyhole, X } from "lucide-react";

interface PaymentModalProps {
  manual: {
    id: string;
    code: string;
    title: string;
    price: string | number;
    department?: string;
    level?: string;
    description?: string;
    details?: string;
    semester?: string;
    session?: string;
    academicYear?: string;
    lecturer?: string;
    author?: string;
  } | null;

  isLoading?: boolean;
  onClose: () => void;
  onProceed: () => void;
  errorMessage?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  manual,
  isLoading = false,
  onClose,
  onProceed,
  errorMessage,
}) => {
  if (!manual) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-linear-to-br from-cyan-500 to-cyan-600 px-5 py-5 text-white sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                P
              </span>{" "}
              Paystack
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-white/15 p-1.5 hover:bg-white/25"
              aria-label="Close payment modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-4 text-sm text-cyan-100">Pay to DMDAS</p>
          <p className="text-2xl font-extrabold">
            {typeof manual.price === "number"
              ? `₦${manual.price.toLocaleString()}`
              : manual.price}
          </p>
          <p className="text-sm text-cyan-100">
            {manual.code} - {manual.title}
          </p>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-bold text-slate-800 text-sm">Ready to pay?</p>
            <p className="mt-1 text-sm">
              Continue to the secure Paystack checkout.
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onProceed}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-sm font-bold text-white transition hover:bg-cyan-600 disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? "Preparing payment..." : "Proceed to payment"}
            {!isLoading && <ExternalLink className="h-4 w-4" />}
          </button>
          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {errorMessage}
            </p>
          )}
          <p className="flex items-center justify-center gap-1 text-xs text-slate-400">
            <LockKeyhole className="h-3 w-3" /> Secured by Paystack 
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mx-auto flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            <ArrowLeft className="h-3 w-3" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
