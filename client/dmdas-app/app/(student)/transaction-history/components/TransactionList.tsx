import React from "react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Download,
  Share2,
} from "lucide-react";
import {
  createTransactionReceipt,
  downloadTransaction,
  transactionDetailsText,
} from "../transactionUtils";
import { Transaction } from "../types";

export default function TransactionList({
  transactions,
  openId,
  onToggle,
}: {
  transactions: Transaction[];
  openId: string | null;
  onToggle: (id: string) => void;
}) {

  const shareTransaction = async (transaction: Transaction) => {
    const receipt = await createTransactionReceipt(transaction);
    const details = transactionDetailsText(transaction);
    
    if (navigator.share && navigator.canShare?.({ files: [receipt] })) {
      await navigator.share({
        title: `DMDAS transaction - ${transaction.courseCode}`,
        text: details,
        files: [receipt],
      });
    } else if (navigator.share) {
      await navigator.share({
        title: `DMDAS transaction - ${transaction.courseCode}`,
        text: details,
      });
    } else {
      await navigator.clipboard.writeText(details);
    }
  };

  if (transactions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-14 my-2 w-14 items-center justify-center rounded-full bg-slate-100">
          <span className="text-2xl">💳</span>
        </div>
        <p className="text-base font-semibold text-slate-800">
          No transactions
        </p>
        <p className="mt-0.5 text-sm text-slate-400">
          Your payments will appear here.
        </p>
      </div>
    );

  return (
    <div className="divide-y divide-slate-100">
      {transactions.map((tx) => {
        const isOpen = openId === tx.id;
        return (
          <div key={tx.id} className="transition-all duration-200">
            <div
              onClick={() => onToggle(tx.id)}
              className="flex min-w-0 cursor-pointer select-none flex-col gap-3 rounded-xl bg-slate-100/80 px-2 py-4 my-3 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200/60 bg-amber-50 text-amber-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="wrap-break-word text-sm font-semibold text-slate-900 sm:text-base">
                      {tx.courseCode} — {tx.courseTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/40 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {tx.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                    <span className="break-all">{tx.paystackRef}</span>
                    <span>•</span>
                    <span>{tx.channel}</span>
                    <span>•</span>
                    <span>
                      {tx.date} {tx.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-3 text-right sm:w-auto sm:shrink-0 sm:gap-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 sm:text-base">
                    ₦{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-xs font-semibold tracking-wider text-rose-500">
                    {tx.keyCode}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </div>
            {isOpen && (
              <div className="mt-1 mb-4 grid grid-cols-1 gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Payment Details
                  </h4>
                  <div className="space-y-3 text-xs">
                    <Detail label="Paystack Ref" value={tx.paystackRef} />
                    <Detail label="Channel" value={tx.channel} />
                    <Detail label="Date" value={`${tx.date} • ${tx.time}`} />
                    <Detail
                      label="Amount"
                      value={`₦${tx.amount.toLocaleString()}`}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Keycode
                  </h4>
                  <div className="flex items-center justify-center rounded-xl border border-rose-100 bg-rose-50/70 px-4 py-3">
                    <span className="text-base font-bold tracking-wider text-rose-500 sm:text-lg">
                      {tx.keyCode}
                    </span>
                  </div>
                  <div className="pt-1">
                    <p className="mb-1.5 text-xs font-medium text-slate-400">
                      Pickup Status
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {tx.pickupStatus}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => void downloadTransaction(tx)}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => void shareTransaction(tx)}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 font-medium text-slate-400">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}
