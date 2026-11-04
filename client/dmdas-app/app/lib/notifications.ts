import axios from "axios";
import { apiUrl } from "./apiUrl";
import { studentRequestConfig } from "./studentApi";

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type?: string;
  read: boolean;
};

export async function getStudentNotifications(
  token: string | null,
): Promise<StudentNotification[]> {
  const response = await axios.get<{ notifications?: StudentNotification[] }>(
    apiUrl("/api/notifications"),
    studentRequestConfig(token),
  );
  return response.data.notifications ?? [];
}

export async function markStudentNotificationsRead(
  token: string | null,
): Promise<void> {
  await axios.patch(
    apiUrl("/api/notifications/read"),
    {},
    studentRequestConfig(token),
  );
}
