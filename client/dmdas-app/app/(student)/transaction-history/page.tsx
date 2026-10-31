"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStudentTransactions } from "../../lib/studentApi";
import TransactionList from "./components/TransactionList";
import TransactionStats from "./components/TransactionStats";
import { normalizeTransaction } from "./transactionUtils";
import { FilterTab, Transaction } from "./types";
import { KeycodeModal } from "../available-manuals/components/KeycodeModal";
import { Manual } from "../available-manuals/data/manual";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

const tabs: FilterTab[] = ["All", "Paid", "Failed", "Refunded"];

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setLoadError("No transactions");
          return;
        }

        const records = await getStudentTransactions(token);
        setTransactions(
          records.map(normalizeTransaction).filter((transaction) => transaction.id),
        );
      } catch {
        setLoadError("No transactions");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // if (isLoading) {
  //     return <DashboardSkeleton />;
  //   }

  const filteredTransactions = useMemo(
    () => activeTab === "All"
      ? transactions
      : transactions.filter((transaction) => transaction.status === activeTab),
    [activeTab, transactions],
  );

  const activeKeycodeCount = transactions.filter(
    (transaction) =>
      transaction.keyCode && transaction.pickupStatus !== "Collected",
  ).length;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="block items-start justify-between gap-4 md:flex lg:py-1">
        <div className="items-start justify-between gap-4 lg:py-3">
          <h1 className="text-3xl font-extrabold text-black">Payment Overview</h1>
          <p className="mt-2 text-md font-medium text-slate-800">
            All your transactions and issued keycodes.
          </p>
        </div>

        <Link
          href=""
          className="my-4 rounded-md bg-[#F8FAFC] px-2 py-2 text-sm font-semibold text-black shadow-sm"
        >
          Export
        </Link>
      </div>

      <div className="py-4">
        <TransactionStats transactions={transactions} />
      </div>

      <div className="mb-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
            <span className="text-lg">⌁</span>
          </div>
          <div>
            <p className="font-semibold">You have {activeKeycodeCount} active keycodes</p>
            <p className="text-sm text-slate-600">
              Present your keycode to your Course Representative to collect your manual.
            </p>
          </div>
        </div>

        {/* onClick={() => router.push("/available-manuals")} */}
        <button
          type="button"
          className="w-full rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 sm:w-auto"
        >
        <KeycodeModal manual={selectedManual} onClose={() => setSelectedManual(null)}/>
          View Keycode
        </button>

      </div>

      <div className="w-full rounded-2xl border border-slate-200 bg-white p-2 font-sans text-slate-800 shadow-sm md:p-6">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Transactions</h2>
          <div className="flex w-full items-center gap-1 my-2 overflow-x-auto rounded-xl bg-slate-100/80 p-1 text-xs font-medium text-slate-600 sm:w-auto sm:text-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setOpenId(null);
                }}
                className={`shrink-0 rounded-lg px-4 py-1.5 transition-all duration-150 ${
                  activeTab === tab
                    ? "border border-slate-200 bg-white font-semibold text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
    {/* className="py-16 text-center text-sm text-slate-500" */}
        {isLoading ? (
          <p ><DashboardSkeleton /></p>
        ) : loadError ? (
          <p className="py-16 text-center text-sm text-rose-600">{loadError}</p>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            openId={openId}
            onToggle={(id) => setOpenId((current) => (current === id ? null : id))}
          />
        )}
      </div>
    </section>
  );
}
