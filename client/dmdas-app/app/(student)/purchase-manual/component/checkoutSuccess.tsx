// app/checkout/success/page.tsx
'use client';

import axios from 'axios';
import { Check, CreditCard, KeyRound } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  getString,
  isRecord,
  studentApiUrl,
  studentRequestConfig,
  toAmount,
} from '../../../lib/studentApi';

type PaymentDetails = {
  manual: string;
  amount: number;
  reference: string;
  keycode: string;
};

function VerifyCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [status, setStatus] = useState<'verifying' | 'verified' | 'failed'>(
    reference ? 'verifying' : 'failed',
  );
  const [details, setDetails] = useState<PaymentDetails | null>(null);
  const [copied, setCopied] = useState(false);
  const apiDispatched = useRef(false);

  useEffect(() => {
    if (!reference || apiDispatched.current) {
      return;
    }

    apiDispatched.current = true;

    const token = sessionStorage.getItem('token');

    axios
      .get(studentApiUrl("/student/verifyPayment"), {
        params: { reference },
        ...studentRequestConfig(token),
      })
      .then((response) => {
        const responseData = isRecord(response.data) ? response.data : {};
        const data = isRecord(responseData.data) ? responseData.data : responseData;
        const transaction = isRecord(data.transaction) ? data.transaction : {};
        const payment = isRecord(data.payment) ? data.payment : {};
        const manual = isRecord(data.manual) ? data.manual : {};

        const paymentStatus = getString(
          data,
          ['status', 'paymentStatus'],
          getString(
            transaction,
            ['status', 'paymentStatus'],
            getString(payment, ['status'], getString(responseData, ['status', 'paymentStatus'])),
          ),
        )
          .trim()
          .toLowerCase();

        const keycode = getString(
          data,
          ['keycode', 'keyCode', 'key_code', 'key'],
          getString(
            transaction,
            ['keycode', 'keyCode', 'key_code', 'key'],
            getString(
              payment,
              ['keycode', 'keyCode', 'key_code', 'key'],
              getString(
                manual,
                ['keycode', 'keyCode', 'key_code', 'key'],
                getString(responseData, ['keycode', 'keyCode', 'key_code', 'key']),
              ),
            ),
          ),
        ).trim();

        const backendSuccess =
          responseData.success === true ||
          responseData.status === true ||
          ['success', 'successful', 'paid', 'verified', 'true'].includes(paymentStatus) ||
          (keycode.length > 0 &&
            getString(data, ['message'], getString(responseData, ['message']))
              .toLowerCase()
              .includes('successfully processed'));

        if (!backendSuccess) {
          setStatus('failed');
          return;
        }

        setDetails({
          manual: getString(
            data,
            ['manualName', 'manualTitle', 'courseTitle'],
            getString(
              transaction,
              ['manualName', 'manualTitle', 'courseTitle'],
              getString(manual, ['title', 'courseTitle'], 'Course Manual'),
            ),
          ),
          amount: toAmount(
            data.amount ??
              transaction.amount ??
              transaction.amountPaid ??
              payment.amount ??
              data.paidAmount ??
              manual.price,
          ),
          reference: getString(
            data,
            ['paystackRef', 'paystackReference', 'reference'],
            getString(
              transaction,
              ['paystackRef', 'paystackReference', 'reference'],
              getString(payment, ['reference'], reference),
            ),
          ),
          keycode: keycode || 'GENERATED',
        });
        setStatus('verified');
      })
      .catch((error) => {
        console.error('Axios Fetch Error:', error);
        setStatus('failed');
      });
  }, [reference]);

  const handleCopy = async () => {
    if (!details?.keycode) return;

    try {
      await navigator.clipboard.writeText(details.keycode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Unable to copy keycode:', error);
    }
  };

  const handleBuyAnother = () => {
    router.push('/purchase-manual');
  };

  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-start justify-center bg-[#f7f9fc] px-4 pt-6 sm:pt-8">
      {status === 'verifying' && (
        <div className="w-full max-w-[358px] rounded-[10px] border border-[#d9e0e8] bg-white px-8 py-10 text-center shadow-[0_2px_4px_rgba(15,23,42,0.12)] sm:px-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-black border-r-[#13bce8] animate-spin">
            <CreditCard className="h-6 w-6 text-black" strokeWidth={1.8} fill="#f5b400" />
          </div>

          <h1 className="mt-5 text-[20px] font-bold text-[#071b3a]">Processing Payment</h1>
          <p className="mx-auto mt-1 max-w-61.25 text-sm leading-4.25 text-[#607492]">
            Confirming your payment with Paystack. Please wait...
          </p>

          <div className="mt-5 space-y-2 text-left text-sm">
            <p className="flex items-center justify-center gap-2 text-[#526783]">
              <span className="font-bold text-[#14b86a]">✓</span>
              <span>Payment authorised</span>
            </p>
            <p className="flex items-center justify-center gap-2 text-[#7c91ae]">
              <span className="h-3.25 w-3.25 rounded-full border-2 border-[#9ae4fa] border-t-[#16b8e5] animate-spin" />
              <span>Generating keycode.....</span>
            </p>
          </div>
        </div>
      )}

      {status === 'verified' && details && (

        <div className="w-full max-w-[430px]">
          <button
            type="button"
            onClick={handleBuyAnother}
            className="mb-3 text-sm font-semibold text-[#ed174b] hover:underline"
          >
            Go back to manuals
          </button>
          
          <div className="rounded-[14px] border border-[#9ad7b2] bg-[#dff5e5] px-6 py-8 text-center shadow-[0_2px_6px_rgba(14,24,36,0.06)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#80d39b] text-white shadow-inner">
              <Check className="h-7 w-7" strokeWidth={3} />
            </div>
            <h2 className="mt-4 text-[16px] font-bold text-[#0d1b2a]">Payment Confirmed</h2>
            <p className="mx-auto mt-2 max-w-[290px] text-[15px] leading-5 text-[#495d73]">
              Your payment was successful. Your keycode has been generated instantly.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-[12px] border border-[#dfe6ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="border-b border-[#e5eaf0] px-4 py-3 text-center text-[14px] font-bold text-[#0d1b2a]">
              Payment Summary
            </div>

            <div className="divide-y divide-[#eef1f4] text-[13px] text-[#2c3a4b]">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-[#495d73]">Manual</span>
                <span className="max-w-[58%] text-right font-medium text-[#0d1b2a]">
                  {details.manual}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-[#495d73]">Amount</span>
                <span className="font-medium text-[#0d1b2a]">₦{details.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-[#495d73]">Paystack Ref</span>
                <span className="max-w-[58%] truncate font-medium text-[#0d1b2a]">
                  {details.reference}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-[#495d73]">Status</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f9f1] px-2.5 py-1 text-[11px] font-semibold text-[#208a53]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1faa65]" />
                  Paid
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[12px] border border-[#dfe6ee] bg-white px-5 py-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#596f89]">
              <KeyRound className="h-3.5 w-3.5" />
              <span>Your keycode</span>
            </div>

            <div className="mt-3 font-mono text-[28px] font-extrabold tracking-[0.05em] text-[#ed174b]">
              {details.keycode}
            </div>

            <p className="mx-auto mt-3 max-w-[260px] text-[13px] text-[#7a8aa0]">
              Present this keycode to your Course Representative to collect your manual.
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 w-full rounded-lg border border-[#f6a2b4] bg-transparent px-4 py-2.5 text-[13px] font-semibold text-[#ed174b] transition hover:bg-[#fff0f3]"
            >
              {copied ? 'Copied' : 'Copy Keycode'}
            </button>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleBuyAnother}
              className="w-full rounded-lg bg-[#ed174b] px-4 py-3 text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(237,23,75,0.25)] transition hover:bg-[#d91445]"
            >
              Buy Another
            </button>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="w-full max-w-md rounded-lg border bg-white p-6 text-center shadow-sm">
          <h1 className="text-md font-bold text-red-600">Payment Verification Failed !!</h1>
          <p className="mt-2 text-sm text-gray-500">
            Could not verify payment reference or retrieve keycode.
          </p>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-[#f7f9fc]">
          <p className="animate-pulse text-sm font-medium text-gray-500">
            Loading verification details...
          </p>
        </div>
      }
    >
      <VerifyCheckoutContent />
    </Suspense>
  );
}
