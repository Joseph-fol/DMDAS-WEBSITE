"use client";

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building,
  Loader2,
  X,
} from 'lucide-react';
import { SettlementSummary, BankAccount } from '@/types/portal';
import {
  getSettlementData,
  getBanks,
  requestWithdrawal,
  resolveAccountDetails,
  updateSettlementAccount,
} from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function SettlementPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<SettlementSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Withdraw Modal
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('Input your amount');
  const [withdrawing, setWithdrawing] = useState(false);

  // Update Account Modal
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [updatingAccount, setUpdatingAccount] = useState(false);
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [banks, setBanks] = useState<Array<{ name: string; code: string }>>([]);
  const [accountForm, setAccountForm] = useState<BankAccount>({
    accountName: '',
    bankName: '',
    accountNumber: '',
    isVerified: true,
  });

  const loadData = async () => {
    try {
      const summary = await getSettlementData();
      setData(summary);
      setAccountForm(summary.settlementAccount);
    } catch (err: any) {
      showToast(err.message || 'Failed to load settlement information from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!accountModalOpen || banks.length > 0) return;

    getBanks()
      .then(setBanks)
      .catch((err: any) => {
        showToast(err.message || 'Unable to load banks', 'error');
      });
  }, [accountModalOpen, banks.length, showToast]);

  useEffect(() => {
    if (
      !accountModalOpen ||
      accountForm.accountNumber.length !== 10 ||
      !accountForm.bankName
    ) {
      return;
    }

    let cancelled = false;
    const resolve = async () => {
      setResolvingAccount(true);
      try {
        const resolvedAccount = await resolveAccountDetails(
          accountForm.accountNumber,
          accountForm.bankName,
          accountForm.bankCode,
        );
        if (!cancelled) {
          setAccountForm((current) => ({
            ...current,
            ...resolvedAccount,
            isVerified: true,
          }));
        }
      } catch (err: any) {
        if (!cancelled) {
          setAccountForm((current) => ({
            ...current,
            accountName: '',
            isVerified: false,
          }));
          showToast(err.message || 'Unable to verify this account', 'error');
        }
      } finally {
        if (!cancelled) setResolvingAccount(false);
      }
    };

    void resolve();
    return () => {
      cancelled = true;
    };
  }, [
    accountModalOpen,
    accountForm.accountNumber,
    accountForm.bankName,
    accountForm.bankCode,
    showToast,
  ]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (!amountNum || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setWithdrawing(true);
    try {
      const record = await requestWithdrawal(amountNum);
      showToast(`Withdrawal of ₦${amountNum.toLocaleString()} requested! Ref: ${record.reference}`, 'success');
      setWithdrawModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Withdrawal failed', 'error');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountForm.isVerified || !accountForm.accountName) {
      showToast('Verify the account number before saving.', 'error');
      return;
    }

    setUpdatingAccount(true);
    try {
      await updateSettlementAccount(accountForm);
      showToast('Settlement bank account updated on backend!', 'success');
      setAccountModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update account', 'error');
    } finally {
      setUpdatingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-[#E1193E] animate-spin" />
        <p className="text-sm text-slate-500">Loading settlement details from backend...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Title & Withdraw Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Settlement & Payout
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Withdraw your earnings and manage your settlement account.
          </p>
        </div>

        <button
          onClick={() => setWithdrawModalOpen(true)}
          className="px-4 py-2.5 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-sm font-semibold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <span>Withdraw ₦{data.availableBalance.toLocaleString()}</span>
        </button>
      </div>

      {/* Row 1 Stats: Gross Sales, System Deduction, Available Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Gross Sales
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">
            ₦{data.grossSales.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            All Paystack-confirmed student payments
          </p>
          <span className="text-[11px] text-slate-400 block mt-2">
            {data.totalTransactions} transactions
          </span>
        </div>

        {/* System Deduction */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            System Deduction
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5">
            - ₦{data.systemDeduction.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {data.systemDeductionRate}% platform operation fee (DMDAS)
          </p>
          <span className="text-[11px] text-slate-400 block mt-2">
            Auto-deducted before payout
          </span>
        </div>

        {/* Available Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Available Balance
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#E1193E] mt-1.5">
            ₦{data.availableBalance.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Gross - Deduction - Withdrawn (₦{data.totalWithdrawn.toLocaleString()})
          </p>
          <button
            onClick={() => setWithdrawModalOpen(true)}
            className="text-[11px] font-bold text-[#E1193E] hover:underline flex items-center gap-1 mt-2"
          >
            Withdraw now &rarr;
          </button>
        </div>
      </div>

      {/* Settlement Account Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Settlement Account
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Your registered bank account for withdrawals from Paystack.
            </p>
          </div>

          <button
            onClick={() => setAccountModalOpen(true)}
            className="px-3 py-1.5 border border-slate-200 text-[#E1193E] hover:bg-red-50/60 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            Update Account
          </button>
        </div>

        <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
              <Building className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                {data.settlementAccount.accountName}
              </span>
              <span className="text-xs text-slate-500 block">
                {data.settlementAccount.bankName} · {data.settlementAccount.accountNumber}
              </span>
              {data.settlementAccount.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
                  ✓ Bank-verified account
                </span>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Settlement via Paystack</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Instant to next business day</p>
          </div>
        </div>
      </div>

      {/* Withdrawal History Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Withdrawal History
        </h3>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 pr-4">Reference</th>
                <th className="py-3 px-4">Bank Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.withdrawalHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pr-4 font-mono font-medium text-slate-700">
                    {item.reference}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">
                      {item.bankName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.accountNumber} · {item.accountName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₦{item.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {item.dateTime}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Transaction History Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Payment Transaction History
        </h3>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 pr-4">Paystack Ref</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Manual</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 pl-4 text-right">Keycode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {data.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pr-4 font-mono font-medium text-slate-700">
                    {tx.paystackRef}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">
                      {tx.studentName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {tx.matric}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">
                      {tx.courseCode}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                      {tx.courseTitle}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {tx.date}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    <span className="font-mono font-bold text-[#E1193E] tracking-wide">
                      {tx.keycode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E1193E]" />
                <h3 className="text-base font-bold text-slate-900">
                  Withdraw to Bank Account
                </h3>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Bank
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <p className="font-bold">{data.settlementAccount.accountName}</p>
                  <p className="text-slate-500 mt-0.5">
                    {data.settlementAccount.bankName} · {data.settlementAccount.accountNumber} (Verified)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Withdrawal Amount (₦)
                </label>
                <input
                  type="number"
                  max={data.availableBalance}
                  min={500}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Available: ₦{data.availableBalance.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawing}
                  className="px-4 py-2 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {withdrawing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Withdrawal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Bank Modal */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-[#E1193E]" />
                <h3 className="text-base font-bold text-slate-900">
                  Update Settlement Account
                </h3>
              </div>
              <button
                onClick={() => setAccountModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAccount} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name
                </label>
                <select
                  value={accountForm.bankName}
                  onChange={(e) => setAccountForm({
                    ...accountForm,
                    bankName: e.target.value,
                    bankCode: banks.find((bank) => bank.name === e.target.value)?.code,
                    accountName: '',
                    isVerified: false,
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  required
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm({
                    ...accountForm,
                    accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                    accountName: '',
                    isVerified: false,
                  })}
                  placeholder="0123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={accountForm.accountName}
                  readOnly
                  placeholder={resolvingAccount ? 'Verifying account...' : 'Account name appears after verification'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs uppercase focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#E1193E]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAccountModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingAccount || resolvingAccount || !accountForm.isVerified}
                  className="px-4 py-2 bg-[#E1193E] hover:bg-[#C20E30] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  {updatingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
