import React from "react";
import { Transaction } from "../types";

const statDefinitions = [
    { label: "Total Paid", change: "3 transactions", icon: "book" },
    { label: "Successful", change: "Via paystack", icon: "check" },
    { label: "Active Keycodes", change: "Ready for pickup", icon: "key" },
    { label: "Manual Collected", change: "Distribution complete", icon: "box" },
];

function Icon({ type }: { type: string }) {
    const paths = {
        book: "M4 4.5c2.5-.3 5.1.3 8 1.7v13c-2.9-1.4-5.5-2-8-1.7zM20 4.5c-2.5-.3-5.1.3-8 1.7v13c2.9-1.4 5.5-2 8-1.7z",
        check: "m5 12 4 4L19 6",
        key: "M8 14a4 4 0 1 1 3.5-5.9L20 3.6 22 5.6l-2 2 1.4 1.4-2 2-1.4-1.4-2 2A4 4 0 0 1 8 14z",
        box: "M4 7h16v13H4zM8 7V4h8v3",
    } as const;
    return (
        <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ec003f"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={paths[type as keyof typeof paths]} />
        </svg>
    );
}

export default function TransactionStats({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const collected = transactions.filter((tx) =>
        ["COLLECTED", "CLAIMED"].includes(tx.pickupStatus.toUpperCase()),
    ).length;
    const active = transactions.filter(
        (tx) =>
            tx.keyCode &&
            !["COLLECTED", "CLAIMED"].includes(tx.pickupStatus.toUpperCase()),
    ).length;
    const stats = statDefinitions.map((stat) => {
        if (stat.label === "Total Paid")
            return {
                ...stat,
                value: `₦${transactions
                    .filter((tx) => tx.status === "Paid")
                    .reduce((total, tx) => total + tx.amount, 0)
                    .toLocaleString()}`,
                change: `${transactions.length} transactions`,
            };
        if (stat.label === "Successful")
            return {
                ...stat,
                value: String(transactions.filter((tx) => tx.status === "Paid").length),
            };
        if (stat.label === "Active Keycodes")
            return { ...stat, value: String(active) };
        return { ...stat, value: String(collected) };
    });
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white px-6 py-5"
                >
                    <div className="flex justify-between">
                        <div>
                            <p className="text-[14px] font-medium text-slate-600">
                                {stat.label}
                            </p>
                            <div className="mt-1 text-3xl font-extrabold text-[#381E25]">
                                {stat.value}
                            </div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                            {" "}
                            <Icon type={stat.icon} />
                        </div>
                    </div>
                    <span className="py-1 text-sm text-slate-500">{stat.change}</span>
                </div>
            ))}
        </div>
    );
}
