"use client";

import axios from "axios";
import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { FilterTabs } from "./components/FilterTabs";
import { ManualCard } from "./components/ManualCard";
import { EmptyState } from "./components/EmptyState";
import { KeycodeModal } from "./components/KeycodeModal";
import { Manual, FilterTab } from "./data/manual";
import { getString, getStudentRecords, toAmount } from "../../lib/studentApi";

function getNestedString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;
      const nestedMatch = getNestedString(nested, keys);
      if (nestedMatch) return nestedMatch;
    }
  }
  return "";
}

function normalizeManual(record: Record<string, unknown>): Manual {
  const nestedManual = (record.manual ?? record.course ?? {}) as Record<string, unknown>;
  const nestedPayment = (record.payment ?? {}) as Record<string, unknown>;
  const nestedStudent = (record.student ?? {}) as Record<string, unknown>;
  const pickupStatus = getNestedString(record, [
    "pickupStatus",
    "collectionStatus",
    "status",
    "paymentStatus",
  ]);

  const manualId = getNestedString(record, [
    "id",
    "_id",
    "manualId",
    "purchaseId",
    "manual_id",
  ]);

  const code = getNestedString(record, [
    "code",
    "courseCode",
    "manualCode",
    "course_code",
    "manual_code",
  ]) || getNestedString(nestedManual, ["code", "courseCode", "manualCode"]);

  const title = getNestedString(record, [
    "title",
    "courseTitle",
    "manualTitle",
    "manual_name",
    "manualName",
  ]) || getNestedString(nestedManual, ["title", "courseTitle", "manualTitle"]);

  const department = getNestedString(record, ["department", "dept"]) || getNestedString(nestedManual, ["department", "dept"]);
  const level = getNestedString(record, ["level", "studentLevel", "yearLevel"]) || getNestedString(nestedManual, ["level", "studentLevel", "yearLevel"]);
  const priceValue =
    record.price ??
    record.amount ??
    record.total ??
    record.paidAmount ??
    nestedPayment.amount ??
    nestedManual.price ??
    0;

  return {
    id: manualId || getString(record, ["manualId", "id", "_id"]),
    code: code || "MANUAL",
    title: title || "Course Manual",
    department: department || "N/A",
    level: level || "N/A",
    price: `₦${toAmount(priceValue).toLocaleString()}`,
    paymentStatus: "Paid",
    pickupStatus:
      pickupStatus === "Collected"
        ? "Collected"
        : pickupStatus === "Failed"
          ? "Failed"
          : "Ready for Pickup",
    keycode: getNestedString(record, ["keycode", "keyCode", "key", "generatedKey"]) || getNestedString(nestedManual, ["keycode", "keyCode", "key"]),
    createdAt: getNestedString(record, ["createdAt", "date", "paidAt"]) || "Recently purchased",
    collectedAt: getNestedString(record, ["collectedAt", "pickupDate"]),
    studentName:
      getNestedString(record, ["studentName", "fullName", "name"]) ||
      getNestedString(nestedStudent, ["fullName", "name"]) ||
      "Student",
    studentId:
      getNestedString(record, ["studentId", "matricNumber", "student_id", "matric"]) ||
      getNestedString(nestedStudent, ["studentId", "matricNumber", "matric"]) ||
      "N/A",
    paystackRef:
      getNestedString(record, [
        "paystackRef",
        "reference",
        "transactionReference",
        "paystack_reference",
      ]) ||
      getNestedString(nestedPayment, ["reference", "paystackRef"]) ||
      "N/A",
  };
}

export default function Page() {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);

  useEffect(() => {
    const loadManuals = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const records = await getStudentRecords(
          "/api/student/purchasedManuals",
          token,
        );
        
        setManuals(records.map(normalizeManual).filter((manual) => manual.id));
      } catch (error) {
        setLoadError(
          axios.isAxiosError(error) && error.response?.status === 404
            ? "No purchased course manual."
            : "No purchased course manual.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadManuals();
  }, []);

  // Tab counts
  const counts = useMemo(() => {
    return {
      All: manuals.length,
      Paid: manuals.filter((m) => m.paymentStatus === "Paid").length,
      "Ready for Pickup": manuals.filter(
        (m) => m.pickupStatus === "Ready for Pickup",
      ).length,
      Collected: manuals.filter((m) => m.pickupStatus === "Collected").length,
      Failed: manuals.filter((m) => m.pickupStatus === "Failed").length,
    };
  }, [manuals]);

  // Filtered manuals based on active tab
  const filteredManuals = useMemo(() => {
    switch (activeTab) {
      case "Paid":
        return manuals.filter((m) => m.paymentStatus === "Paid");
      case "Ready for Pickup":
        return manuals.filter((m) => m.pickupStatus === "Ready for Pickup");
      case "Collected":
        return manuals.filter((m) => m.pickupStatus === "Collected");
      case "Failed":
        return manuals.filter((m) => m.pickupStatus === "Failed");
      case "All":
      default:
        return manuals;
    }
  }, [manuals, activeTab]);

  const handleBrowseManuals = () => {
    window.location.assign("/purchase-manual");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-2 sm:py-5 px-2 sm:px-6 lg:px-0 max-w-7xl mx-auto">
      {/* Top Header */}
      <Header onPurchaseClick={handleBrowseManuals} />

      {/* Filter Tabs Navigation */}
      <FilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {isLoading ? (
        <p className="py-12 text-center text-sm text-slate-500">
          Loading purchased manuals...
        </p>
      ) : loadError ? (
        <p className="py-12 text-center text-sm text-rose-600">{loadError}</p>
      ) : filteredManuals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredManuals.map((manual) => (
            <ManualCard
              key={manual.id}
              manual={manual}
              onShowKeycode={(m) => setSelectedManual(m)}
            />
          ))}
        </div>
      ) : (
        <EmptyState onBrowse={handleBrowseManuals} />
      )}

      {/* Keycode Details Modal */}
      <KeycodeModal
        manual={selectedManual}
        onClose={() => setSelectedManual(null)}
      />
    </main>
  );
}
