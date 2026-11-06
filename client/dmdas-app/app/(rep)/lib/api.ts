import {
  DashboardStats,
  Manual,
  Student,
  KeycodeItem,
  SettlementSummary,
  ReportsData,
  ActivityEvent,
  MessageItem,
  BankAccount,
  WithdrawalRecord,
} from '@/types/portal';

// Base URL of YOUR personal backend
// Set in .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
).replace(/\/$/, '');

// Helper to get auth token if user stores it in localStorage
function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Core HTTP fetch wrapper sending requests directly to your backend.
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
  fallbackData?: T
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      const errorMessage =
        errorJson?.message || errorJson?.error || `Request failed with HTTP status ${res.status}`;
      throw new Error(errorMessage);
    }

    const json = await res.json();
    // Handle either { data: ... } wrapped responses or raw responses
    return json?.data !== undefined ? json.data : json;
  } catch (error: any) {
    // If backend is unreachable (e.g. ECONNREFUSED) and fallbackData is provided, log warning
    throw error;
  }
}

// ==========================================
// 1. DASHBOARD API
// ==========================================
export async function getDashboardData(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/api/admin/dashboard', { method: 'GET' });
}

// ==========================================
// 2. MANUALS API
// ==========================================
type BackendManual = Partial<Manual> & {
  _id?: string;
  isAvailable?: boolean;
  addedBy?: string | { fullName?: string };
};

function unwrapManual(response: BackendManual | { manual?: BackendManual }): BackendManual {
  if ("manual" in response) {
    if (!response.manual) throw new Error("Manual was not returned by the server.");
    return response.manual;
  }
  return response as BackendManual;
}

function normalizeManual(manual: BackendManual): Manual {
  const id = manual.id || manual._id;
  if (!id) {
    throw new Error('Manual response is missing an id');
  }

  return {
    id,
    courseTitle: manual.courseTitle || '',
    printedStock: String(manual.printedStock ?? ''),
    courseCode: manual.courseCode || '',
    department: manual.department || '',
    semester: manual.semester || '',
    level: manual.level || '',
    price: Number(manual.price || 0),
    status:
      manual.isAvailable === false || manual.status === 'Unavailable'
        ? 'Unavailable'
        : 'Available',
    courseRep:
      manual.courseRep ||
      (typeof manual.addedBy === 'object' ? manual.addedBy.fullName || '' : manual.addedBy || ''),
    claimedCount: manual.claimedCount,
    totalCopies: manual.totalCopies ?? Number(manual.printedStock || 0),
  };
}

export async function getManuals(): Promise<Manual[]> {
  const response = await apiRequest<BackendManual[] | { manuals?: BackendManual[] }>(
    '/api/rep/getManual',
    { method: 'GET' }
  );
  const manuals = Array.isArray(response) ? response : response.manuals ?? [];
  return manuals.map(normalizeManual);
}

export async function createManual(payload: {
  courseTitle: string;
  courseCode: string;
  semester: string;
  price: number;
  printedStock: number;
}): Promise<Manual> {
  const response = await apiRequest<BackendManual | { manual?: BackendManual }>('/api/rep/addManual', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeManual(unwrapManual(response));
}

export async function updateManual(
  id: string,
  payload: Partial<{
    courseTitle: string;
    courseCode: string;
    price: number;
    semester: string;
    printedStock: number;
    isAvailable: boolean;
  }>
): Promise<Manual> {
  const response = await apiRequest<BackendManual | { manual?: BackendManual }>(`/api/rep/editManual/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return normalizeManual(unwrapManual(response));
}

export async function toggleManualStatus(
  id: string,
  status?: 'Available' | 'Unavailable'
): Promise<Manual> {
  return updateManual(id, { isAvailable: status !== 'Unavailable' });
}

// ==========================================
// 3. STUDENTS API
// ==========================================
export async function getStudents(search = ''): Promise<Student[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await apiRequest<Student[] | { data?: Student[] }>(`/api/students${query}`, { method: 'GET' });
  const students = Array.isArray(response) ? response : response.data ?? [];

  if (search) {
    const s = search.toLowerCase();
    return students.filter(
      (item) =>
        item.name.toLowerCase().includes(s) ||
        item.matric.toLowerCase().includes(s) ||
        item.department.toLowerCase().includes(s)
    );
  }
  return students;
}

// ==========================================
// 4. KEYCODE VERIFICATION API
// ==========================================
export async function lookupKeycode(code: string): Promise<{
  match: KeycodeItem | null;
  awaitingPickup: KeycodeItem[];
}> {
  const query = code ? `?code=${encodeURIComponent(code)}` : '';
  const response = await apiRequest<
    { match?: KeycodeItem | null; awaitingPickup?: KeycodeItem[]; data?: KeycodeItem } | KeycodeItem
  >(
    `/api/keycode/verify${query}`,
    { method: 'GET' }
  );
  if ("data" in response && response.data) {
    return { match: response.data, awaitingPickup: [] };
  }
  if ("match" in response || "awaitingPickup" in response) {
    return { match: response.match ?? null, awaitingPickup: response.awaitingPickup ?? [] };
  }
  return { match: null, awaitingPickup: [] };
}

export async function confirmKeycodeCollection(keycode: string): Promise<KeycodeItem> {
  return apiRequest<KeycodeItem>('/api/rep/pickup/confirm', {
    method: 'POST',
    body: JSON.stringify({ keycode }),
  });
}

// ==========================================
// 5. SETTLEMENT & PAYOUT API
// ==========================================
export async function getSettlementData(): Promise<SettlementSummary> {
  return apiRequest<SettlementSummary>('/api/settlement', { method: 'GET' });
}

export async function requestWithdrawal(amount: number): Promise<WithdrawalRecord> {
  return apiRequest<WithdrawalRecord>('/api/settlement/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export async function resolveAccountDetails(
  accountNumber: string,
  bankName: string,
  bankCode?: string,
): Promise<BankAccount> {
  return apiRequest<BankAccount>('/api/rep/resolveAccount', {
    method: 'POST',
    body: JSON.stringify({ accountNumber, bankName, bankCode }),
  });
}

export async function getBanks(): Promise<Array<{ name: string; code: string }>> {
  const response = await apiRequest<{ banks?: Array<{ name: string; code: string }> }>(
    '/api/banks',
    { method: 'GET' },
  );
  return response.banks ?? [];
}

export async function updateSettlementAccount(account: BankAccount): Promise<BankAccount> {
  return apiRequest<BankAccount>('/api/settlement/account', {
    method: 'PUT',
    body: JSON.stringify(account),
  });
}

// ==========================================
// 6. REPORTS API
// ==========================================
export async function getReportsData(): Promise<ReportsData> {
  return apiRequest<ReportsData>('/api/reports', { method: 'GET' });
}

// ==========================================
// 7. ACTIVITY HISTORY API
// ==========================================
export async function getActivityHistory(filter = 'all'): Promise<ActivityEvent[]> {
  const query = filter && filter !== 'all' ? `?filter=${encodeURIComponent(filter)}` : '';
  const list = await apiRequest<ActivityEvent[]>(`/api/history${query}`, { method: 'GET' });

  if (filter && filter !== 'all') {
    return list.filter((e) => e.type === filter);
  }
  return list;
}

// ==========================================
// 8. MESSAGES API
// ==========================================
export async function getMessages(): Promise<MessageItem[]> {
  return apiRequest<MessageItem[]>('/api/messages', { method: 'GET' });
}

export async function sendMessage(payload: {
  recipient: string;
  subject: string;
  message: string;
  courseCode?: string;
}): Promise<MessageItem> {
  return apiRequest<MessageItem>('/api/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
