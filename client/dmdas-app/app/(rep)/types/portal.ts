// TypeScript models for DMDAS Course Rep Portal

export interface Student {
  id: string;
  name: string;
  matric: string;
  department: string;
  level: string;
  manualsCount: number;
  keycodesCount: number | null;
  status: 'Active' | 'Inactive';
}

export interface Manual {
  id: string;
  courseTitle: string;
  printedStock: string;
  courseCode: string;
  department: string;
  semester: string;
  level: string;
  price: number;
  status: 'Available' | 'Unavailable';
  courseRep: string;
  claimedCount?: number;
  totalCopies?: number;
}

export interface KeycodeItem {
  id: string;
  keycode: string;
  studentName: string;
  matric: string;
  courseCode: string;
  courseTitle: string;
  paystackRef: string;
  amount: number;
  status: 'Ready for Pickup' | 'Collected';
  issuedAt?: string;
  collectedAt?: string;
}

export interface ActivityEvent {
  id: string;
  type: 'payment_confirmed' | 'keycode_generated' | 'payment_failed' | 'manual_collected' | 'withdrawal_processed';
  title: string;
  subtitle: string;
  timestamp: string;
  color: 'green' | 'blue' | 'red' | 'purple' | 'amber';
}

export interface WithdrawalRecord {
  id: string;
  reference: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  dateTime: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface PaymentTransaction {
  id: string;
  paystackRef: string;
  studentName: string;
  matric: string;
  courseCode: string;
  courseTitle: string;
  amount: number;
  date: string;
  keycode: string;
}

export interface BankAccount {
  accountName: string;
  bankName: string;
  accountNumber: string;
  isVerified: boolean;
}

export interface DashboardStats {
  grossSales: number;
  systemDeduction: number;
  systemDeductionRate: number; // e.g. 5
  availableBalance: number;
  confirmedToday: number;
  keycodesIssued: number;
  awaitingPickup: number;
  manualsDistributed: number;
  weeklyConfirmations: {
    day: string;
    count: number;
  }[];
  recentActivity: ActivityEvent[];
  distributionProgress: {
    courseCode: string;
    courseTitle: string;
    distributed: number;
    total: number;
    percentage: number;
  }[];
}

export interface SettlementSummary {
  grossSales: number;
  systemDeduction: number;
  systemDeductionRate: number;
  availableBalance: number;
  totalTransactions: number;
  totalWithdrawn: number;
  settlementAccount: BankAccount;
  withdrawalHistory: WithdrawalRecord[];
  transactions: PaymentTransaction[];
}

export interface ReportsData {
  grossSales: number;
  deductions: number;
  deductionRate: number;
  withdrawn: number;
  available: number;
  manualPerformance: {
    courseCode: string;
    courseTitle: string;
    percentage: number;
  }[];
}

export interface MessageItem {
  id: string;
  sender: string;
  matric?: string;
  role: string;
  avatar: string;
  subject: string;
  snippet: string;
  fullMessage: string;
  timestamp: string;
  unread: boolean;
  courseCode?: string;
}
