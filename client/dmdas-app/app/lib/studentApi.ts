import axios, { AxiosRequestConfig } from "axios";
import { apiBaseUrl } from "./apiUrl";

export const studentApiBaseUrl = apiBaseUrl;

export function studentApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const apiPath = normalizedPath.startsWith("/api/")
    ? normalizedPath
    : `/api${normalizedPath}`;

  return `${studentApiBaseUrl}${apiPath}`;
}

export function studentRequestConfig(token: string | null): AxiosRequestConfig {
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      "Idempotency-Key": typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    },
  };
}

export function responseRecords(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter(isRecord);
  if (!isRecord(value)) return [];

  for (const key of ["data", "manuals", "transactions", "payments", "results"]) {
    const records = responseRecords(value[key]);
    if (records.length || Array.isArray(value[key])) return records;
  }

  return [value];
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getString(
  record: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") return String(value);
  }
  return fallback;
}

export function toAmount(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value.replace(/[^0-9.-]+/g, "")) || 0;
  return 0;
}

export async function getStudentRecords(
  path: string,
  token: string | null,
): Promise<Record<string, unknown>[]> {
  const response = await axios.get(studentApiUrl(path), studentRequestConfig(token));
  if (path === "/student/transactionHistory" || path === "/api/student/transactionHistory") {
  }
  return responseRecords(response.data);
}

export function getStudentTransactions(
  token: string | null,
): Promise<Record<string, unknown>[]> {
  return getStudentRecords("/api/student/transactionHistory", token);
}

export type StudentTransactionPage = {
  records: Record<string, unknown>[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function getStudentTransactionPage(
  token: string | null,
  page: number,
  limit: number,
  status?: string,
): Promise<StudentTransactionPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status && status !== "All") params.set("status", status.toUpperCase());

  const response = await axios.get(
    studentApiUrl(`/api/student/transactionHistory?${params.toString()}`),
    studentRequestConfig(token),
  );
  const data = isRecord(response.data) ? response.data : {};
  const pagination = isRecord(data.pagination) ? data.pagination : {};

  return {
    records: responseRecords(data.transactions),
    page: typeof pagination.page === "number" ? pagination.page : page,
    limit: typeof pagination.limit === "number" ? pagination.limit : limit,
    total: typeof pagination.total === "number" ? pagination.total : 0,
    totalPages:
      typeof pagination.totalPages === "number" ? pagination.totalPages : 0,
  };
}