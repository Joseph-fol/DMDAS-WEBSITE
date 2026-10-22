"use client";

import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { PaymentModal } from "./component/paymentModal";
import {
  getStudentRecords,
  studentApiUrl,
  studentRequestConfig,
  toAmount,
} from "../../lib/studentApi";

type CourseRep = {
  fullName?: string;
  name?: string;
  department?: string;
  level?: string;
  phoneNumber?: string;
};

type Manual = {
  id?: string;
  _id?: string;
  courseCode?: string;
  code?: string;
  courseTitle?: string;
  title?: string;
  department?: string;
  level?: string;
  price?: number | string;
  description?: string;
  details?: string;
  semester?: string;
  session?: string;
  academicYear?: string;
  lecturer?: string;
  author?: string;

  // Representative details (flat or object)
  rep?: CourseRep | string;
  courseRep?: CourseRep | string;
  repFullName?: string;
  repName?: string;
  representativeName?: string;
  repDepartment?: string;
  repLevel?: string;
  isPurchased?: boolean;
  purchased?: boolean;
  paymentStatus?: string;
  keycode?: string;
  [key: string]: unknown;
};

type PaymentConfirmation = {
  manual: string;
  amount: string;
  reference: string;
  keycode: string;
};

function formatCurrency(n: number | string | undefined | null) {
  if (n === undefined || n === null || n === "") return "₦0";
  if (typeof n === "string") {
    if (n.startsWith("₦")) return n;
    const parsed = parseFloat(n.replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? n : `₦${parsed.toLocaleString()}`;
  }
  return `₦${n.toLocaleString()}`;
}

const getManualId = (m: Manual): string => String(m.id || m._id || "");
const getManualCode = (m: Manual | null): string =>
  m?.courseCode || m?.code || "MANUAL";
const getManualTitle = (m: Manual | null): string =>
  m?.courseTitle || m?.title || "Course Manual";
const getManualDept = (m: Manual | null): string => m?.department || "N/A";
const getManualLevel = (m: Manual | null): string => m?.level || "N/A";
const getManualPrice = (m: Manual | null): string => formatCurrency(m?.price);
const getManualCodeValue = (m: Manual): string =>
  String(m.courseCode || m.code || "").trim().toLowerCase();
const isAlreadyPurchased = (m: Manual, purchasedKeys: Set<string>): boolean =>
  Boolean(
    m.isPurchased ||
      m.purchased ||
      m.keycode ||
      purchasedKeys.has(getManualId(m)) ||
      purchasedKeys.has(getManualCodeValue(m)),
  );

const asText = (value: unknown, fallback: string): string =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;

const getRepFullName = (m: Manual | null): string => {
  if (!m) return "Course Representative";
  if (typeof m.rep === "object" && m.rep?.fullName) return m.rep.fullName;
  if (typeof m.rep === "object" && m.rep?.name) return m.rep.name;
  if (typeof m.courseRep === "object" && m.courseRep?.fullName)
    return m.courseRep.fullName;
  if (typeof m.courseRep === "object" && m.courseRep?.name)
    return m.courseRep.name;
  if (typeof m.rep === "string") return m.rep;
  if (typeof m.courseRep === "string") return m.courseRep;
  return asText(
    m.repFullName || m.repName || m.representativeName || m.uploadedBy,
    "Course Representative",
  );
};

const getRepDepartment = (m: Manual | null): string => {
  if (!m) return "N/A";
  if (typeof m.rep === "object" && m.rep?.department) return m.rep.department;
  if (typeof m.courseRep === "object" && m.courseRep?.department)
    return m.courseRep.department;
  return asText(
    m.repDepartment || m.courseRepDepartment || m.department,
    "N/A",
  );
};

const getRepLevel = (m: Manual | null): string => {
  if (!m) return "N/A";
  if (typeof m.rep === "object" && m.rep?.level) return m.rep.level;
  if (typeof m.courseRep === "object" && m.courseRep?.level)
    return m.courseRep.level;
  return asText(m.repLevel || m.courseRepLevel || m.level, "N/A");
};

export default function PurchaseManual() {
  const [selectedId, setSelectedId] = useState<string>("");
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [purchasedKeys, setPurchasedKeys] = useState<Set<string>>(new Set());
  const [manualLoadMessage, setManualLoadMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentManual, setPaymentManual] = useState<Manual | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [confirmation, setConfirmation] = useState<PaymentConfirmation | null>(
    null,
  );
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const selected = useMemo(
    () => manuals.find((m) => getManualId(m) === selectedId) ?? null,
    [selectedId, manuals],
  );

  useEffect(() => {

    const fetchManualData = async () => {
      try {
        setIsLoading(true);
        setManualLoadMessage("");
        const availableRecords = await getStudentRecords(
          "/api/student/availableManuals",
          token,
        );

        let purchasedRecords: Record<string, unknown>[] = [];
        try {
          purchasedRecords = await getStudentRecords(
            "/api/student/purchasedManuals",
            token,
          );
        } catch (purchasedError) {
          if (axios.isAxiosError(purchasedError) && purchasedError.response?.status === 404) {
            try {
              purchasedRecords = await getStudentRecords(
                "/api/student/transactions",
                token,
              );
            } catch (transactionError) {
              if (!axios.isAxiosError(transactionError) || transactionError.response?.status !== 404) {
                console.error("Unable to load purchase history:", transactionError);
              }
            }
          } else {
            throw purchasedError;
          }
        }

        const purchasedIdentifiers = new Set<string>();
        for (const record of purchasedRecords) {
          const paymentStatus = String(
            record.status ?? record.paymentStatus ?? "",
          ).toLowerCase();
          if (
            paymentStatus &&
            !["paid", "success", "successful", "verified", "completed"].includes(paymentStatus)
          ) {
            continue;
          }

          const manual =
            record.manual && typeof record.manual === "object"
              ? (record.manual as Record<string, unknown>)
              : {};

          const id = String(
            record.manualId ?? record.id ?? record._id ?? manual.id ?? manual._id ?? "",
          ).trim();
          const code = String(
            record.courseCode ?? record.code ?? manual.courseCode ?? manual.code ?? "",
          ).trim().toLowerCase();
          if (id) purchasedIdentifiers.add(id);
          if (code) purchasedIdentifiers.add(code);
        }

        setPurchasedKeys(purchasedIdentifiers);
        setManuals(availableRecords);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setManuals([]);
          setManualLoadMessage("No course manuals available.");
        } else {
          console.error("Error fetching manual data:", error);
          setManualLoadMessage("No course manuals available.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchManualData();
  }, [token]);

  
  useEffect(() => {
    const confirmPayment = async () => {
      const query = new URLSearchParams(window.location.search);
      const reference = query.get("reference") || query.get("trxref");
      if (!reference || query.get("status") === "cancelled") return;

      setIsConfirmingPayment(true);
      try {
        const response = await axios.get(
          studentApiUrl("/student/verifyPayment"),
          { params: { reference }, ...studentRequestConfig(token) },
        );
        
        // console.log("Verify payment response:", response.data);
        const responseData = (response.data ?? {}) as Record<string, unknown>;
        const data = (responseData.data ?? responseData) as Record<string, unknown>;
        const payment = (data.payment ?? responseData.payment ?? {}) as Record<string, unknown>;
        const manual = (data.manual ?? responseData.manual ?? {}) as Record<string, unknown>;

        const status = String(
          data.status ??
            data.paymentStatus ??
            payment.status ??
            responseData.status ??
            ""
        ).toLowerCase();

        const keycode = String(
          data.keycode ??
            data.keyCode ??
            data.key ??
            payment.keycode ??
            payment.keyCode ??
            payment.key ??
            manual.keycode ??
            manual.keyCode ??
            manual.key ??
            responseData.keycode ??
            responseData.keyCode ??
            ""
        );

        const rawAmount = data.amount ?? payment.amount ?? responseData.amount;
        const isSuccess =
          responseData.success === true ||
          responseData.status === true ||
          ["success", "successful", "paid", "verified", "true"].includes(status);

        if (!isSuccess) {
          throw new Error(
            (responseData.message as string) ||
              "Payment could not be confirmed. Please check your transaction history."
          );
        }

        setConfirmation({
          manual: String(
            data.manualName ??
              data.manualTitle ??
              manual.title ??
              manual.courseTitle ??
              "Course Manual",
          ),
          amount: formatCurrency(
            typeof rawAmount === "string" || typeof rawAmount === "number"
              ? rawAmount
              : undefined,
          ),
          reference: String(
            data.paystackRef ??
              data.reference ??
              payment.reference ??
              reference,
          ),
          keycode: keycode || "GENERATED", // Fallback display if keycode is generated later
        });
        
        window.history.replaceState({}, "", window.location.pathname);
      } catch (error) {
        setPaymentError(
          axios.isAxiosError(error)
            ? ((error.response?.data as { message?: string } | undefined)
                ?.message ?? error.message)
            : error instanceof Error
              ? error.message
              : "Unable to confirm payment.",
        );
      } finally {
        setIsConfirmingPayment(false);
      }
    };

    confirmPayment();
  }, [token]);


  if (isConfirmingPayment) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center text-sm text-slate-500">
        Confirming your payment...
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="mx-auto max-w-md space-y-3 bg-[#f8fafc] py-2 text-[#071b41]">
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-base font-bold">Payment Confirmed</h1>
          <p className="mt-1 text-xs text-slate-500">
            Your Paystack payment was successful. Your keycode has been
            generated instantly.
          </p>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-xs font-bold">
            Payment Summary
          </h2>
          <div className="space-y-0 px-4 text-xs">
            <div className="flex justify-between gap-4 border-b border-slate-100 py-3">
              <span className="text-slate-500">Manual</span>
              <span className="text-right font-mono font-semibold">
                {confirmation.manual}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-3">
              <span className="text-slate-500">Amount</span>
              <span className="font-mono font-semibold">
                {confirmation.amount}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-3">
              <span className="text-slate-500">Paystack Ref</span>
              <span className="font-mono font-semibold">
                {confirmation.reference}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-500">Status</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600">
                ● Paid
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm">
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <KeyRound className="h-3.5 w-3.5" /> Your keycode
          </div>
          <div className="my-2 font-mono text-xl font-extrabold tracking-widest text-[#ed174b]">
            {confirmation.keycode}
          </div>
          <p className="mx-auto max-w-xs text-[10px] text-slate-400">
            Present this keycode to your Course Representative to collect your
            manual.
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(confirmation.keycode);
              setIsCopied(true);
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-rose-300 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
          >
            {isCopied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {isCopied ? "Copied" : "Copy Keycode"}
          </button>
        </section>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedId("");
              setPaymentManual(null);
              setIsPaymentOpen(false);
              window.location.assign("/purchase-manual");
            }}
            className="flex-1 rounded-lg bg-rose-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
          >
            Buy Another
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(confirmation.keycode)}
            className="flex-1 rounded-lg bg-[#ed174b] py-2.5 text-xs font-bold text-white"
          >
            View Keycode
          </button>
        </div>
      </div>
    );
  }

  const options = manuals.filter(
    (manual) => !isAlreadyPurchased(manual, purchasedKeys),
  );

  const handleOpenPayment = () => {
    if (!selected) return;
    if (isAlreadyPurchased(selected, purchasedKeys)) {
      setPaymentError(
        "You have already purchased this manual. Check Available Manuals for your keycode.",
      );
      setIsPaymentOpen(false);
      return;
    }
    setPaymentError("");
    setPaymentManual(selected);
    setIsPaymentOpen(true);
  };

  const handleProceedToPayment = async () => {
    if (!paymentManual) return;
    setPaymentError("");
    setIsInitializingPayment(true);

    try {
      const response = await axios.post(
        studentApiUrl("/student/initializeTransaction"),
        {
          amount: toAmount(paymentManual.price),
          manualId: getManualId(paymentManual),
          callback_url: `${window.location.origin}/purchase-manual/checkout-success`,
        },
        studentRequestConfig(token),
      );

      const responseData = response.data as {
        data?: {
          manual?: Manual;
          authorization_url?: string;
          payment?: { authorization_url?: string };
        };

        manual?: Manual;
        authorization_url?: string;
        payment?: { authorization_url?: string };
      };
      
      const data = responseData.data ?? responseData;
      const authorizationUrl =
        data.authorization_url ?? data.payment?.authorization_url ?? "";
      setPaymentManual(data.manual ?? paymentManual);

      if (!authorizationUrl) {
        throw new Error(
          "Payment authorization URL was not returned by the server.",
        );
      }
      
      window.location.assign(authorizationUrl);
    } catch (error) {
      setPaymentError(
        axios.isAxiosError(error)
          ? ((error.response?.data as { message?: string } | undefined)
              ?.message ?? error.message)
          : error instanceof Error
            ? error.message
            : "Unable to initialize payment.",
      );
    } finally {
      setIsInitializingPayment(false);
    }
  };

  return (
    <div className="py-2">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Purchase Manual
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Select a manual and pay securely via Paystack. Your keycode is
            generated instantly.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 overflow-x-auto">
          <div className="flex items-center gap-6 min-w-160">
            <div className="flex items-center gap-4 whitespace-nowrap">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white font-medium">
                1
              </div>
              <div className="text-sm text-slate-700 font-medium">
                Select Manual
              </div>
            </div>
            <div
              className={`flex-1 h-0.5 transition-colors ${selected ? "bg-red-500" : "bg-slate-200"}`}
            />
            <div className="flex items-center gap-4 whitespace-nowrap">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition-colors ${selected ? "bg-red-500 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                2
              </div>
              <div
                className={`text-sm ${selected ? "text-slate-700 font-medium" : "text-slate-400"}`}
              >
                Pay with Paystack
              </div>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-4 text-slate-400 whitespace-nowrap">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-400">
                3
              </div>
              <div className="text-sm">Keycode Issued</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-1 md:col-span-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800">
                Step 1 — Select Manual
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Choose a Course Manual
              </p>

              <div className="mt-6">
                <label className="block w-full">
                  <select
                    value={selectedId}
                    onChange={(e) => {
                      setSelectedId(e.target.value);
                      setPaymentError("");
                    }}
                    className={`w-full rounded-lg p-3 text-sm text-slate-700 focus:ring-0 outline-none ${
                      selected
                        ? "border-2 border-red-300"
                        : "border border-slate-200"
                    }`}
                  >
                    {isLoading ? (
                      <option value="">Loading manuals...</option>
                    ) : (
                      <>
                        <option value="">Select a manual...</option>
                        {options.length > 0 ? (
                          options.map((m, idx) => {
                            const mId = getManualId(m) || String(idx);
                            return (
                              <option key={mId} value={mId}>
                                {getManualCode(m)} - {getManualTitle(m)}
                              </option>
                            );
                          })
                        ) : (
                          <option value="" disabled>
                            {manualLoadMessage || "No manuals available for purchase."}
                          </option>
                        )}
                      </>
                    )}
                  </select>
                </label>

                {selected && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-linear-to-br from-red-50/80 via-slate-50/50 to-white p-5 shadow-xs transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-100 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-md">
                              {getManualCode(selected)}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1.5">
                            {getManualTitle(selected)}
                          </h4>
                        </div>
                      </div>

                      <div className="text-left sm:text-right bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-red-100">
                        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Manual Price
                        </div>
                        <div className="text-xl font-extrabold text-red-600 mt-0.5">
                          {getManualPrice(selected)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      <div className="bg-white rounded-lg p-3.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Department
                        </div>
                        <div className="mt-1 font-bold text-slate-800 text-sm">
                          {getManualDept(selected)}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3.5 border border-slate-200/80 shadow-2xs">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Level
                        </div>
                        <div className="mt-1 font-bold text-slate-800 text-sm">
                          {getManualLevel(selected)}
                        </div>
                      </div>

                      <div className="bg-red-50/80 rounded-lg p-3.5 border border-red-200 shadow-2xs">
                        <div className="text-[11px] font-semibold text-red-500 uppercase tracking-wider">
                          Amount Payable
                        </div>
                        <div className="mt-1 font-extrabold text-red-600 text-sm">
                          {getManualPrice(selected)}
                        </div>
                      </div>
                    </div>

                    {/* Course Representative Details Card */}
                    <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white shadow-xs border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                            Course Representative (Rep)
                          </div>
                          <div className="text-sm font-extrabold text-white mt-0.5">
                            {getRepFullName(selected)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                        <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Rep Department
                          </span>
                          <span className="font-semibold text-slate-200 text-xs mt-0.5 block">
                            {getRepDepartment(selected)}
                          </span>
                        </div>
                        <div className="bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Rep Level
                          </span>
                          <span className="font-semibold text-slate-200 text-xs mt-0.5 block">
                            {getRepLevel(selected)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(selected.semester ||
                      selected.session ||
                      selected.academicYear ||
                      selected.lecturer ||
                      selected.author ||
                      selected.description ||
                      selected.details) && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {(selected.semester ||
                          selected.session ||
                          selected.academicYear) && (
                          <div className="bg-white/80 p-3 rounded-lg border border-slate-200/60">
                            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                              Session / Semester
                            </span>
                            <span className="font-medium text-slate-800 text-sm mt-0.5 block">
                              {[
                                selected.session || selected.academicYear,
                                selected.semester,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                        )}

                        {(selected.lecturer || selected.author) && (
                          <div className="bg-white/80 p-3 rounded-lg border border-slate-200/60">
                            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                              Lecturer / Author
                            </span>
                            <span className="font-medium text-slate-800 text-sm mt-0.5 block">
                              {selected.lecturer || selected.author}
                            </span>
                          </div>
                        )}

                        {(selected.description || selected.details) && (
                          <div className="sm:col-span-2 bg-white/80 p-3 rounded-lg border border-slate-200/60">
                            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block">
                              Description
                            </span>
                            <p className="font-normal text-slate-700 text-xs mt-1 leading-relaxed">
                              {selected.description || selected.details}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selected && (
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Step 2 — Pay with Paystack
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Secure payment powered by Paystack. Supports card, bank
                  transfer, and USSD. Your keycode is issued immediately after
                  payment.
                </p>

                <div className="mt-6 bg-slate-50/90 rounded-xl p-5 border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Order Summary & Selected Details
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200/60 shadow-2xs">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {getManualCode(selected)} — {getManualTitle(selected)}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          {getManualDept(selected)} · {getManualLevel(selected)}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-xs font-medium text-slate-400">
                        Total Amount
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        {getManualPrice(selected)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-1">
                    <span className="text-slate-500 font-medium">
                      Course Rep Pickup Contact:
                    </span>
                    <span className="font-bold text-slate-800">
                      {getRepFullName(selected)} ({getRepDepartment(selected)} ·{" "}
                      {getRepLevel(selected)})
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  {paymentError && (
                    <p className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-center text-xs font-medium text-rose-700">
                      {paymentError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleOpenPayment}
                    className="w-full rounded-lg py-3 text-white font-medium bg-linear-to-r from-cyan-500 to-blue-500"
                  >
                    Pay {getManualPrice(selected)} with Paystack
                  </button>
                </div>

                <div className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-4">
                  <div>🔒 SSL Encrypted</div>
                  <div>·</div>
                  <div>PCI DSS Compliant</div>
                  <div>·</div>
                  <div>Instant Keycode</div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-4 space-y-6 md:sticky md:top-28">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h4 className="font-semibold text-slate-800">How it works</h4>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400">📚</span> Select your manual
                  from the list
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400">💳</span> Pay securely via
                  Paystack
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400">🔑</span> Get your keycode
                  instantly
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400">📦</span> Present keycode to
                  collect manual
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h4 className="font-semibold text-slate-800">Payment Methods</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  💳 Debit / Credit Card
                </li>
                <li className="flex items-center gap-3">🏦 Bank Transfer</li>
                <li className="flex items-center gap-3">📲 USSD</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600">🔑</div>
                <div>
                  Your keycode is generated the moment payment is confirmed no
                  manual approval needed. No waiting.
                </div>
              </div>
            </div>
          </div>
        </div>
        {isPaymentOpen && (
          <PaymentModal
            manual={
              paymentManual
                ? {
                    id: getManualId(paymentManual),
                    code: getManualCode(paymentManual),
                    title: getManualTitle(paymentManual),
                    price: paymentManual.price || 0,
                    department: paymentManual.department,
                    level: paymentManual.level,
                    description: paymentManual.description,
                    details: paymentManual.details,
                    semester: paymentManual.semester,
                    session: paymentManual.session,
                    academicYear: paymentManual.academicYear,
                    lecturer: paymentManual.lecturer,
                    author: paymentManual.author,
                  }
                : null
            }
            isLoading={isInitializingPayment}
            errorMessage={paymentError}
            onClose={() => setIsPaymentOpen(false)}
            onProceed={handleProceedToPayment}
          />
        )}
      </div>
    </div>
  );
}
