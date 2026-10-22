import html2canvas from "html2canvas";
import { toAmount } from "../../lib/studentApi";
import { Transaction } from "./types";

export function getNestedString(
  record: Record<string, unknown>,
  keys: string[],
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number")
      return String(value);
    if (value && typeof value === "object") {
      const nestedValue = getNestedString(
        value as Record<string, unknown>,
        keys,
      );
      if (nestedValue) return nestedValue;
    }
  }
  return "";
}

export function normalizeTransaction(
  record: Record<string, unknown>,
): Transaction {
  const rawStatus = getNestedString(record, [
    "status",
    "paymentStatus",
    "transactionStatus",
    "state",
  ]).toLowerCase();
  const status =
    rawStatus === "refunded"
      ? "Refunded"
      : ["failed", "failure", "cancelled", "canceled"].includes(rawStatus)
        ? "Failed"
        : "Paid";
  const dateValue = getNestedString(record, [
    "dateOfPayment",
    "createdAt",
    "paidAt",
    "date",
    "timestamp",
  ]);
  const date = dateValue
    ? new Date(`${dateValue}T00:00:00`).toLocaleDateString()
    : "-";

  return {
    id: getNestedString(record, [
      "paystackReference",
      "id",
      "_id",
      "transactionId",
      "reference",
    ]),
    courseCode:
      getNestedString(record, ["courseCode", "code", "manualCode"]) || "MANUAL",
    courseTitle:
      getNestedString(record, [
        "courseTitle",
        "title",
        "manualName",
        "manualTitle",
      ]) || "Course Manual",
    status,
    paystackRef:
      getNestedString(record, [
        "paystackReference",
        "paystackRef",
        "reference",
        "transactionReference",
        "paystack_reference",
      ]) || "N/A",
    channel:
      getNestedString(record, ["channel", "paymentChannel", "method"]) ||
      "Paystack",
    date,
    time: getNestedString(record, ["timeOfPayment", "time"]) || "-",
    amount: toAmount(
      record.amount ??
        record.amountPaid ??
        record.paidAmount ??
        record.total ??
        0,
    ),
    keyCode: getNestedString(record, [
      "keycode",
      "keyCode",
      "key",
      "generatedKey",
    ]),
    pickupStatus:
      getNestedString(record, ["pickupStatus", "collectionStatus", "status"]) ||
      "Pending",
  };
}

function transactionDetails(transaction: Transaction): string {
  return [
    "DMDAS Transaction Receipt",
    `Course: ${transaction.courseCode} - ${transaction.courseTitle}`,
    `Status: ${transaction.status}`,
    `Paystack Reference: ${transaction.paystackRef}`,
    `Channel: ${transaction.channel}`,
    `Date: ${transaction.date} ${transaction.time}`,
    `Amount: N${transaction.amount.toLocaleString()}`,
    `Keycode: ${transaction.keyCode || "N/A"}`,
    `Pickup Status: ${transaction.pickupStatus}`,
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] || character,
  );
}

function receiptMarkup(transaction: Transaction): string {
  const value = (text: string) => escapeHtml(text);
  const course = `${transaction.courseCode} - ${transaction.courseTitle}`;
  return `<article style="width:700px;box-sizing:border-box;overflow:hidden;border:1px solid #e2e8f0;border-radius:24px;background:#fff;color:#1e293b;font-family:Arial,sans-serif;box-shadow:0 12px 32px rgba(15,23,42,.08)"><header style="padding:36px;background:#fff1f2;border-bottom:1px solid #ffe4e6"><p style="margin:0 0 14px;color:#e11d48;font-size:18px;font-weight:700;letter-spacing:2px">DMDAS PAYMENT OVERVIEW</p><h1 style="margin:0;color:#1e293b;font-size:32px;line-height:1.25">${value(course)}</h1><p style="margin:12px 0 0;color:#64748b;font-size:20px">Transaction receipt and manual pickup details</p></header><section style="padding:36px"><div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:28px"><div><div style="color:#94a3b8;font-size:16px;font-weight:700;letter-spacing:1px">AMOUNT PAID</div><div style="margin-top:8px;color:#0f172a;font-size:40px;font-weight:800">₦${transaction.amount.toLocaleString()}</div></div><span style="padding:9px 14px;border:1px solid #bbf7d0;border-radius:25px;background:#f0fdf4;color:#15803d;font-size:17px;font-weight:700">${value(transaction.status)}</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;padding-top:24px;border-top:1px solid #f1f5f9"><div><div style="color:#94a3b8;font-size:14px;font-weight:700">REFERENCE</div><p style="margin:6px 0 0;color:#334155;font-size:18px;font-weight:700;overflow-wrap:anywhere">${value(transaction.paystackRef)}</p></div><div><div style="color:#94a3b8;font-size:14px;font-weight:700">CHANNEL</div><p style="margin:6px 0 0;color:#334155;font-size:18px;font-weight:700">${value(transaction.channel)}</p></div><div><div style="color:#94a3b8;font-size:14px;font-weight:700">PAYMENT DATE</div><p style="margin:6px 0 0;color:#334155;font-size:18px;font-weight:700">${value(transaction.date)}</p></div><div><div style="color:#94a3b8;font-size:14px;font-weight:700">PAYMENT TIME</div><p style="margin:6px 0 0;color:#334155;font-size:18px;font-weight:700">${value(transaction.time)}</p></div><div><div style="color:#94a3b8;font-size:14px;font-weight:700">PICKUP STATUS</div><p style="margin:6px 0 0;color:#334155;font-size:18px;font-weight:700">${value(transaction.pickupStatus)}</p></div></div><div style="margin-top:28px;padding:22px;border:1px solid #ffe4e6;border-radius:18px;background:#fff1f2;text-align:center"><div style="color:#94a3b8;font-size:14px;font-weight:700;letter-spacing:1px">MANUAL KEYCODE</div><div style="margin-top:10px;color:#f43f5e;font-size:32px;font-weight:800;letter-spacing:3px">${value(transaction.keyCode || "N/A")}</div></div></section><footer style="padding:20px 36px;border-top:1px solid #f1f5f9;color:#94a3b8;font-size:15px">Keep this receipt for your records.</footer></article>`;
}

export function transactionDetailsText(transaction: Transaction): string {
  return transactionDetails(transaction);
}

export async function createTransactionReceipt(
  transaction: Transaction,
): Promise<File> {
  const receiptElement = document.createElement("div");
  receiptElement.innerHTML = receiptMarkup(transaction);
  Object.assign(receiptElement.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    background: "#f8fafc",
    padding: "40px",
  });
  document.body.appendChild(receiptElement);
  try {
    const canvas = await html2canvas(receiptElement, {
      backgroundColor: "#f8fafc",
      scale: 2,
      useCORS: true,
    });
    const jpgBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.92),
    );
    
    if (!jpgBlob) throw new Error("Unable to export transaction image");
    return new File(
      [jpgBlob],
      `Manual Transaction for-${transaction.courseCode || transaction.paystackRef}.jpg`,
      { type: "image/jpeg" },
    );
  } finally {
    receiptElement.remove();
  }
}

export async function downloadTransaction(
  transaction: Transaction,
): Promise<void> {
  const receipt = await createTransactionReceipt(transaction);
  const url = URL.createObjectURL(receipt);
  const link = document.createElement("a");
  link.href = url;
  link.download = receipt.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
