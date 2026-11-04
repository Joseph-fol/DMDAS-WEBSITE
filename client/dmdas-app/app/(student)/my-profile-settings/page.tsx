"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../../lib/apiUrl";
import { studentRequestConfig } from "../../lib/studentApi";
import {
  getStudentNotifications,
  markStudentNotificationsRead,
  StudentNotification,
} from "../../lib/notifications";

type StudentProfile = {
  fullName: string;
  email: string;
  department: string;
  level: string;
  phoneNumber: string;
  role: string;
  matricNumber?: string;
  purchasedManuals?: number;
  totalSpent?: string;
  keycodesIssued?: number;
  whatsapp?: string;
};

const departmentsList = [
  "Computer Science",
  "Computer Engineering",
  "Electrical & Electronics Engineering",
  "Civil Engineering",
  "Agricultural Engineering",
  "Mechanical Engineering",
  "Food Engineering",
];

const levelsList = ["100", "200", "300", "400", "500"];

function ProfileSettingsSkeleton() {
  return (
    <section
      className="mx-auto w-full max-w-7xl animate-pulse space-y-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        <div className="h-52 bg-slate-200 px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-slate-300" />
            <div className="space-y-3">
              <div className="h-7 w-48 rounded bg-slate-300" />
              <div className="h-4 w-64 rounded bg-slate-300" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-11 rounded-lg bg-slate-200" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-slate-100 p-4">
              <div className="mx-auto h-8 w-20 rounded bg-slate-200" />
              <div className="mx-auto h-4 w-28 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 rounded-lg bg-slate-200" />
          ))}
        </aside>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-7 w-48 rounded bg-slate-200" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="h-11 rounded-lg bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const userDetails =
        typeof window !== "undefined"
          ? sessionStorage.getItem("Student")
          : null;
          
      if (userDetails) {
        const parsedData = JSON.parse(userDetails);
        return {
          fullName: parsedData.fullName || parsedData.name || "",
          email: parsedData.email || "",
          department: parsedData.department || "",
          level: parsedData.level || "",
          phoneNumber: parsedData.phoneNumber || parsedData.whatsapp || "",
          role: parsedData.role || "",
          matricNumber:
            parsedData.matricNumber ||
            parsedData.matric ||
            parsedData.matric_number,
          purchasedManuals: parsedData.purchasedManuals,
          totalSpent: parsedData.totalSpent,
          keycodesIssued: parsedData.keycodesIssued,
          whatsapp: parsedData.whatsapp,
        } as StudentProfile;
      }
    } catch {
      // ignore parse errors
    }

    return {
      fullName: "",
      email: "",
      department: "",
      level: "",
      phoneNumber: "",
      role: "",
    };
  });

  // Derive initials for avatar
  const initials =
    (profile.fullName || "")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  const manualsPurchased = profile.purchasedManuals ?? 0;
  const totalSpent = profile.totalSpent ?? "₦0";
  const keycodesIssued = profile.keycodesIssued ?? 0;

  const [activeTab, setActiveTab] = useState<
    "personal" | "security" | "notifications" | "activity"
  >(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("tab") === "notifications"
      ? "notifications"
      : "personal",
  );
  const [notifications, setNotifications] = useState<StudentNotification[]>(() =>
    [],
  );

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: profile.fullName || "",
    department: profile.department || "",
    level: profile.level || "",
    phoneNumber: profile.phoneNumber || profile.whatsapp || "",
  });
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setNotifications(
          await getStudentNotifications(sessionStorage.getItem("token")),
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Unable to load notifications:", error.message);
        }
      }
    };

    void loadNotifications();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      const token = sessionStorage.getItem("token");

      try {
        const response = await axios.get<StudentProfile>(
          apiUrl("/api/profile"),
          studentRequestConfig(token),
        );

        setProfile(response.data);
        sessionStorage.setItem("Student", JSON.stringify(response.data));
      } catch (error) {
        setProfileError(
          axios.isAxiosError(error)
            ? error.response?.data?.message || error.message
            : "Unable to load profile statistics.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  // Security tab state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const [sessions, setSessions] = useState([
    {
      id: "s1",
      title: "Chrome on Windows",
      meta: "Lagos, Nigeria · Now — current session",
      isCurrent: true,
    },
    {
      id: "s2",
      title: "Safari on iPhone 14",
      meta: "Lagos, Nigeria · 2 hours ago",
      isCurrent: false,
    },
  ] as { id: string; title: string; meta: string; isCurrent?: boolean }[]);

  const startEditingProfile = () => {
    setEditFormData({
      fullName: profile.fullName || "",
      department: profile.department || "",
      level: profile.level || "",
      phoneNumber: profile.phoneNumber || profile.whatsapp || "",
    });
    setProfileMessage(null);
    setProfileError(null);
    setIsEditingProfile(true);
    setActiveTab("personal");
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setIsSubmittingProfile(true);

    const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    const requestUrl = `${baseURL}/api/updateProfileSetting`;
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    const payload = {
      matricNumber: profile.matricNumber,
      email: profile.email,
      fullName: editFormData.fullName.trim(),
      department: editFormData.department.trim(),
      level: editFormData.level.trim(),
      phoneNumber: editFormData.phoneNumber.trim(),
    };

    try {
      const response = await axios.put<{
        message?: string;
        user?: Partial<StudentProfile>;
      }>(baseURL ? requestUrl : "/api/updateProfileSetting", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const updatedProfile: StudentProfile = {
        ...profile,
        fullName: editFormData.fullName,
        department: editFormData.department,
        level: editFormData.level,
        phoneNumber: editFormData.phoneNumber,
        ...(response.data.user || {}),
      };

      setProfile(updatedProfile);

      // Persist updated profile in sessionStorage
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("Student");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            sessionStorage.setItem(
              "Student",
              JSON.stringify({ ...parsed, ...updatedProfile }),
            );
          } catch {
            sessionStorage.setItem("Student", JSON.stringify(updatedProfile));
          }
        } else {
          sessionStorage.setItem("Student", JSON.stringify(updatedProfile));
        }
      }

      setProfileMessage(
        response.data.message || "Profile updated successfully.",
      );
      setIsEditingProfile(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setProfileError(
          (err.response?.data as { message?: string })?.message ||
            err.message ||
            "Failed to update profile. Sending payload to backend failed.",
        );
      } else {
        setProfileError(
          err instanceof Error ? err.message : "Failed to update profile.",
        );
      }
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    setPasswordError(null);

    if (!currentPin || !newPin || !confirmNewPin) {
      setPasswordError("Please fill all PIN fields.");
      return;
    }
    if (newPin.length !== 4) {
      setPasswordError("PIN must be exactly 4 digits.");
      return;
    }
    if (newPin !== confirmNewPin) {
      setPasswordError("New PINs do not match.");
      return;
    }

    setIsSubmittingPassword(true);
    const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
    const requestUrl = `${baseURL}/api/updatePinSetting`;
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

    const payload = {
      currentPin,
      newPin,
      confirmNewPin,
    };

    console.log("Sending change password payload request to backend:", payload);

    try {
      const response = await axios.put<{ message?: string }>(
        baseURL ? requestUrl : "/api/updatePinSetting",
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      setCurrentPin("");
      setNewPin("");
      setConfirmNewPin("");
      setPasswordMessage(response.data.message || "PIN updated successfully.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPasswordError(
          (err.response?.data as { message?: string })?.message ||
            err.message ||
            "Failed to change PIN. Sending payload to backend failed.",
        );
      } else {
        setPasswordError(
          err instanceof Error ? err.message : "Failed to change PIN.",
        );
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  function revokeSession(id: string) {
    setSessions((s) => s.filter((x) => x.id !== id));
  }

  const Logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("Student");
    window.location.href = "/signin";
  };

  if (isLoading) {
    return <ProfileSettingsSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header card */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-linear-to-r from-slate-900 via-slate-700 to-pink-50 pt-6 text-white shadow-md">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(ellipse_at_top_left,#0b1220_0,transparent_40%)] opacity-40 pointer-events-none" />

          <div className="flex items-start justify-between gap-6 px-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-rose-600 text-white flex items-center justify-center text-2xl font-bold ring-4 ring-white">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-white" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-white">
                    {profile.fullName || "Student Name"}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-emerald-50/30 px-2 py-1 text-sm font-medium text-emerald-300 ring-1 ring-white/20">
                    Active
                  </span>
                </div>

                <div className="mt-2 text-sm text-white/80">
                  <span className="font-medium">
                    {profile.matricNumber || "2021/0451"}
                  </span>
                  <span className="mx-2">·</span>
                  <span>{profile.department || "Computer Science"}</span>
                  <span className="mx-2">·</span>
                  <span>{profile.level || "500L"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-bl-lg rounded-br-lg bg-white px-4 py-4 text-black sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
              <div className="flex items-start justify-center sm:justify-start">
                <button
                  onClick={startEditingProfile}
                  className="w-full rounded-lg border border-rose-300 bg-white/5 px-4 py-2 text-sm font-semibold text-rose-600 transition-all hover:cursor-pointer hover:border-transparent hover:bg-[#10192D] hover:text-white sm:w-auto"
                >
                  Edit Profile
                </button>
              </div>

              <div className="rounded-lg border border-slate-100 py-3 text-center text-black sm:py-4">
                <div className="text-2xl font-extrabold sm:text-3xl">
                  {manualsPurchased}
                </div>
                <div className="text-sm text-black">Manuals Purchased</div>
              </div>
              <div className="rounded-lg border border-slate-100 py-3 text-center text-black sm:py-4">
                <div className="text-2xl font-extrabold sm:text-3xl">
                  {totalSpent}
                </div>
                <div className="text-sm text-black">Total Spent</div>
              </div>
              <div className="rounded-lg border border-slate-100 py-3 text-center text-black sm:py-4">
                <div className="text-2xl font-extrabold sm:text-3xl">
                  {keycodesIssued}
                </div>
                <div className="text-sm text-black">Keycodes Issued</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        {/* Left nav */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeTab === "personal"
                    ? "bg-rose-50 font-semibold text-rose-600"
                    : "text-slate-700"
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeTab === "security"
                    ? "bg-rose-50 font-semibold text-rose-600"
                    : "text-slate-700"
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeTab === "notifications"
                    ? "bg-rose-50 font-semibold text-rose-600"
                    : "text-slate-700"
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  activeTab === "activity"
                    ? "bg-rose-50 font-semibold text-rose-600"
                    : "text-slate-700"
                }`}
              >
                Activity
              </button>
            </nav>
            <hr className="my-3" />
            <button className="w-full rounded-lg px-3 py-2 text-left font-semibold text-sm cursor-pointer text-rose-600" onClick = { Logout} >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main>
          {activeTab === "personal" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>
                  <p className="text-sm text-slate-400">
                    Your academic identity and contact details.
                  </p>
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={startEditingProfile}
                    className="text-sm font-medium text-rose-600 hover:underline"
                  >
                    Edit
                  </button>
                ) : null}
              </div>

              {profileMessage && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 font-medium">
                  {profileMessage}
                </div>
              )}

              {profileError && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 font-medium">
                  {profileError}
                </div>
              )}

              {isEditingProfile ? (
                <form
                  onSubmit={handleSaveProfile}
                  className="mt-6 space-y-4 max-w-xl"
                >
                  <label className="block">
                    <div className="text-sm text-slate-600 mb-1 font-medium">
                      Full Name
                    </div>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Enter full name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-rose-500"
                      required
                    />
                  </label>

                  <label className="block">
                    <div className="text-sm text-slate-600 mb-1 font-medium">
                      Department
                    </div>
                    <select
                      value={editFormData.department}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          department: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-rose-500 bg-white"
                    >
                      <option value="">Select Department</option>
                      {departmentsList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <div className="text-sm text-slate-600 mb-1 font-medium">
                      Level
                    </div>
                    <select
                      value={editFormData.level}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          level: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-rose-500 bg-white"
                    >
                      <option value="">Select Level</option>
                      {levelsList.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <div className="text-sm text-slate-600 mb-1 font-medium">
                      Phone Number / WhatsApp
                    </div>
                    <input
                      type="text"
                      value={editFormData.phoneNumber}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-rose-500"
                    />
                  </label>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingProfile}
                      className="rounded-xl bg-rose-600 text-white px-6 py-2.5 text-sm font-semibold hover:bg-rose-700 transition disabled:opacity-50"
                    >
                      {isSubmittingProfile
                        ? "Updating Payload..."
                        : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="rounded-xl border border-slate-300 bg-white text-slate-700 px-5 py-2.5 text-sm font-medium hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="mt-6 sm:grid-cols-2">
                  <div className="space-y-1 border-b border-slate-300 pb-4">
                    <dt className="text-sm text-slate-400 font-medium">
                      FULL NAME
                    </dt>
                    <dd className="font-medium text-slate-900">
                      {profile.fullName || "Nill"}
                    </dd>
                  </div>

                  <div className="space-y-1 border-b pb-4 border-slate-300 pt-4">
                    <dt className="text-sm text-slate-400 uppercase font-medium">
                      Matric Number
                    </dt>
                    <dd className="font-medium text-slate-900">
                      {profile.matricNumber || "—"}
                    </dd>
                  </div>

                  <div className="space-y-1 border-b pb-4 border-slate-300 pt-4">
                    <dt className="text-sm text-slate-400 uppercase font-medium">
                      Department
                    </dt>
                    <dd className="font-medium text-slate-900">
                      {profile.department || "—"}
                    </dd>
                  </div>

                  <div className="space-y-1 border-b pb-4 border-slate-300 pt-4">
                    <dt className="text-sm text-slate-400 uppercase font-medium">
                      Level
                    </dt>
                    <dd className="font-medium text-slate-900">
                      {profile.level || "—"}
                    </dd>
                  </div>

                  <div className="space-y-1 border-b pb-4 border-slate-300 pt-4">
                    <dt className="text-sm text-slate-400 uppercase font-medium">
                      Email Address
                    </dt>
                    <dd className="font-medium text-slate-900">
                      {profile.email || "—"}
                    </dd>
                  </div>

                  <div className="space-y-1 border-b pb-4 border-slate-300 pt-4">
                    <dt className="text-sm text-slate-400 uppercase font-medium">
                      Phone Number
                    </dt>
                    <dd className="font-medium text-slate-900">
                      {profile.phoneNumber || "—"}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold">Change PIN</h3>
                <p className="text-sm text-slate-400">
                  Update your 4-digit security PIN.
                </p>

                <div className="mt-4 space-y-4 max-w-xl">
                  <label className="block">
                    <div className="text-sm text-slate-600 mb-1 font-medium">
                      Current PIN
                    </div>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={currentPin}
                      onChange={(e) =>
                        setCurrentPin(
                          e.target.value.replace(/\D/g, "").slice(0, 4),
                        )
                      }
                      placeholder="Enter 4-digit current PIN"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-rose-500"
                    />
                  </label>

                  <label className="block">
                    <div className="text-sm text-slate-600 mb-1 font-medium">
                      New PIN
                    </div>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) =>
                        setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      placeholder="Enter 4-digit new PIN"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-rose-500"
                    />
                  </label>

                  <label className="block">
                    <div className="text-sm text-slate-600 mb-1 font-medium">
                      Confirm New PIN
                    </div>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={confirmNewPin}
                      onChange={(e) =>
                        setConfirmNewPin(
                          e.target.value.replace(/\D/g, "").slice(0, 4),
                        )
                      }
                      placeholder="Re-enter 4-digit new PIN"
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-rose-500"
                    />
                  </label>

                  {passwordMessage && (
                    <div className="text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                      {passwordMessage}
                    </div>
                  )}

                  {passwordError && (
                    <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg">
                      {passwordError}
                    </div>
                  )}

                  <div>
                    <button
                      onClick={handleChangePassword}
                      disabled={isSubmittingPassword}
                      className="rounded-md bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 font-semibold transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingPassword ? "Updating..." : "Update PIN"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-semibold">Active Sessions</h3>
                <p className="text-sm text-slate-400">
                  Devices currently signed in to your account.
                </p>

                <ul className="mt-4 space-y-3">
                  {sessions.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between rounded-md border px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold">
                          {s.title}{" "}
                          {s.isCurrent ? (
                            <span className="inline-block ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              THIS DEVICE
                            </span>
                          ) : null}
                        </div>
                        <div className="text-sm text-slate-500">{s.meta}</div>
                      </div>
                      {!s.isCurrent ? (
                        <button
                          onClick={() => revokeSession(s.id)}
                          className="rounded-md bg-rose-600 text-white px-3 py-1 text-sm cursor-pointer hover:bg-rose-700 transition"
                        >
                          Revoke
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
                <h3 className="text-lg font-semibold text-rose-700">
                  Danger Zone
                </h3>
                <p className="text-sm text-slate-600 mt-2">
                  Permanently remove your account and all purchase history. This
                  cannot be undone.
                </p>
                <div className="mt-4">
                  <button className="rounded-md bg-rose-600 text-white px-4 py-2 font-semibold hover:bg-rose-700 transition cursor-pointer">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-sm text-slate-400">
                    Updates about your account, purchases, and manual pickup.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = notifications.map((notification) => ({
                      ...notification,
                      read: true,
                    }));
                    setNotifications(updated);
                    void markStudentNotificationsRead(
                      sessionStorage.getItem("token"),
                    );
                  }}
                  className="text-sm font-medium text-rose-600 hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              <div className="mt-6 divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div key={notification.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-800">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                        <p className="mt-2 text-xs text-slate-400">{notification.createdAt}</p>
                      </div>
                      {!notification.read && (
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />
                      )}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-500">
                    You have no notifications.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              Activity log placeholder
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
