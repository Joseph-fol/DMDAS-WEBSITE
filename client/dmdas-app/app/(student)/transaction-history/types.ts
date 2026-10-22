export type FilterTab = "All" | "Paid" | "Failed" | "Refunded";

export interface Transaction {
  id: string;
  courseCode: string;
  courseTitle: string;
  status: "Paid" | "Failed" | "Refunded";
  paystackRef: string;
  channel: string;
  date: string;
  time: string;
  amount: number;
  keyCode: string;
  pickupStatus: string;
}
