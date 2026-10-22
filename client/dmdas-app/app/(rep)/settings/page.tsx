"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, LockKeyhole, UserRound, Bell, LogOut } from "lucide-react";

type RepProfile = {
  fullName: string;
  email: string;
  matricNumber: string;
  department: string;
  level: string;
  phoneNumber: string;
  role: string;
};

type Tab = "personal" | "security" | "notifications";

const emptyProfile: RepProfile = {
  fullName: "",
  email: "",
  matricNumber: "",
  department: "",
  level: "",
  phoneNumber: "",
  role: "rep",
};

const departments = [
  "Computer Science",
  "Computer Engineering",
  "Electrical & Electronics Engineering",
  "Civil Engineering",
  "Agricultural Engineering",
  "Mechanical Engineering",
  "Food Engineering",
];

const levels = ["100", "200", "300", "400", "500"];

function readProfile(): RepProfile {
  if (typeof window === "undefined") return emptyProfile;

  try {
    const stored = JSON.parse(sessionStorage.getItem("Student") || "{}") as Partial<RepProfile> & {
      name?: string;
      matric?: string;
    };
    return {
      ...emptyProfile,
      ...stored,
      fullName: stored.fullName || stored.name || "",
      matricNumber: stored.matricNumber || stored.matric || "",
      phoneNumber: stored.phoneNumber || "",
    };
  } catch {
    return emptyProfile;
  }
}

function getApiUrl(path: string) {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

async function readError(response: Response, fallback: string) {
  const body = await response.json().catch(() => null);
  return body?.message || fallback;
}

export default function RepSettingsPage() {
  const [profile, setProfile] = useState<RepProfile>(readProfile);
  const [form, setForm] = useState<RepProfile>(readProfile);
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);

  const initials = useMemo(
    () =>
      (profile.fullName || "Rep")
        .split(/\s+/)
        .map((name) => name[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [profile.fullName],
  );

  const updateForm = (field: keyof RepProfile, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const startEditing = () => {
    setForm(profile);
    setProfileMessage("");
    setProfileError("");
    setIsEditing(true);
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setIsSaving(true);

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      matricNumber: form.matricNumber.trim(),
      department: form.department.trim(),
      level: form.level.trim(),
      phoneNumber: form.phoneNumber.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      setProfileError("Please complete all profile fields.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(getApiUrl("/api/updateProfileSetting"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(sessionStorage.getItem("token")
            ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Failed to update profile."));
      }

      const updatedProfile = { ...profile, ...payload };
      setProfile(updatedProfile);
      setForm(updatedProfile);
      sessionStorage.setItem("Student", JSON.stringify({
        ...JSON.parse(sessionStorage.getItem("Student") || "{}"),
        ...updatedProfile,
      }));
      setProfileMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const changePin = async (event: FormEvent) => {
    event.preventDefault();
    setSecurityMessage("");
    setSecurityError("");

    if (!/^\d{4}$/.test(newPin)) {
      setSecurityError("New PIN must be exactly 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setSecurityError("New PINs do not match.");
      return;
    }

    setIsChangingPin(true);
    try {
      const response = await fetch(getApiUrl("/api/updatePinSetting"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(sessionStorage.getItem("token")
            ? { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify({ currentPin, newPin, confirmNewPin: confirmPin }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Failed to update PIN."));
      }

      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setSecurityMessage("PIN updated successfully.");
    } catch (error) {
      setSecurityError(error instanceof Error ? error.message : "Failed to update PIN.");
    } finally {
      setIsChangingPin(false);
    }
  };

  const signOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("Student");
    window.location.href = "/signin";
  };

  const tabs: { id: Tab; label: string; icon: typeof UserRound }[] = [
    { id: "personal", label: "Personal information", icon: UserRound },
    { id: "security", label: "Security", icon: LockKeyhole },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl bg-linear-to-r from-[#10192D] to-[#E1193E] p-6 text-white shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#E1193E]">
            {initials}
          </div>
          <div>
            <p className="text-sm text-white/70">Course representative account</p>
            <h2 className="mt-1 text-2xl font-bold">{profile.fullName || "Your profile"}</h2>
            <p className="mt-1 text-sm text-white/80">{profile.email || "Add your email address"}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-3">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                  activeTab === id
                    ? "bg-[#FFF0F3] font-semibold text-[#E1193E]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={signOut}
            className="mt-4 flex w-full items-center gap-3 border-t border-slate-100 px-3 pt-4 text-left text-sm font-semibold text-slate-500 hover:text-[#E1193E]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {activeTab === "personal" && (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Personal information</h3>
                  <p className="mt-1 text-sm text-slate-500">Keep your representative details up to date.</p>
                </div>
                {!isEditing && (
                  <button type="button" onClick={startEditing} className="text-sm font-semibold text-[#E1193E] hover:underline">
                    Edit
                  </button>
                )}
              </div>
              {profileMessage && <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />{profileMessage}</p>}
              {profileError && <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{profileError}</p>}
              {isEditing ? (
                <form onSubmit={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
                  {([
                    ["fullName", "Full name"],
                    ["email", "Email address"],
                    ["matricNumber", "Matric number"],
                    ["phoneNumber", "Phone number"],
                  ] as const).map(([field, label]) => (
                    <label key={field} className="text-sm font-medium text-slate-700">
                      {label}
                      <input
                        required
                        type={field === "email" ? "email" : "text"}
                        value={form[field]}
                        onChange={(event) => updateForm(field, event.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#E1193E] focus:ring-2 focus:ring-red-100"
                      />
                    </label>
                  ))}
                  <label className="text-sm font-medium text-slate-700">
                    Department
                    <select value={form.department} onChange={(event) => updateForm("department", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#E1193E]">
                      <option value="">Select department</option>
                      {departments.map((department) => <option key={department}>{department}</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-slate-700">
                    Level
                    <select value={form.level} onChange={(event) => updateForm("level", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-[#E1193E]">
                      <option value="">Select level</option>
                      {levels.map((level) => <option key={level}>{level}</option>)}
                    </select>
                  </label>
                  <div className="flex gap-3 sm:col-span-2">
                    <button disabled={isSaving} className="rounded-xl bg-[#E1193E] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving..." : "Save changes"}</button>
                    <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600">Cancel</button>
                  </div>
                </form>
              ) : (
                <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {([
                    ["Full name", profile.fullName],
                    ["Email address", profile.email],
                    ["Matric number", profile.matricNumber],
                    ["Phone number", profile.phoneNumber],
                    ["Department", profile.department],
                    ["Level", profile.level],
                  ] as const).map(([label, value]) => (
                    <div key={label}><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm text-slate-800">{value || "Not provided"}</dd></div>
                  ))}
                </dl>
              )}
            </>
          )}

          {activeTab === "security" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Security</h3>
              <p className="mt-1 text-sm text-slate-500">Change the four-digit PIN used to access your account.</p>
              {securityMessage && <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />{securityMessage}</p>}
              {securityError && <p className="mt-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{securityError}</p>}
              <form onSubmit={changePin} className="mt-6 max-w-md space-y-4">
                {([
                  ["Current PIN", currentPin, setCurrentPin],
                  ["New PIN", newPin, setNewPin],
                  ["Confirm new PIN", confirmPin, setConfirmPin],
                ] as const).map(([label, value, setter]) => (
                  <label key={label} className="block text-sm font-medium text-slate-700">{label}<input required type="password" inputMode="numeric" maxLength={4} value={value} onChange={(event) => setter(event.target.value.replace(/\D/g, ""))} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-[#E1193E] focus:ring-2 focus:ring-red-100" /></label>
                ))}
                <button disabled={isChangingPin} className="rounded-xl bg-[#E1193E] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isChangingPin ? "Updating..." : "Update PIN"}</button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
              <p className="mt-1 text-sm text-slate-500">Choose which updates you want to receive.</p>
              <div className="mt-6 divide-y divide-slate-100">
                {([
                  ["Email notifications", "Receive updates about payouts and manual activity.", emailNotifications, setEmailNotifications],
                  ["Message notifications", "Receive alerts when students contact you.", messageNotifications, setMessageNotifications],
                ] as const).map(([label, description, enabled, setter]) => (
                  <label key={label} className="flex cursor-pointer items-center justify-between gap-4 py-4">
                    <span><span className="block text-sm font-semibold text-slate-800">{label}</span><span className="mt-1 block text-sm text-slate-500">{description}</span></span>
                    <input type="checkbox" checked={enabled} onChange={(event) => setter(event.target.checked)} className="h-4 w-4 accent-[#E1193E]" />
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
