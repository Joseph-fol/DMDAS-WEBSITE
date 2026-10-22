"use client";

import { useEffect, useState } from "react";

export type RepProfile = {
  firstName: string;
};

const defaultProfile: RepProfile = {
  firstName: "Rep",
};

function readRepProfile(): RepProfile {
  if (typeof window === "undefined") return defaultProfile;

  const storedUser = sessionStorage.getItem("Student");
  if (!storedUser) return defaultProfile;

  try {
    const user = JSON.parse(storedUser) as {
      firstName?: string;
      fullName?: string;
      name?: string;
    };
    const fullName = (user.firstName || user.fullName || user.name || "").trim();
    return {
      firstName: fullName ? fullName.split(/\s+/)[0] : defaultProfile.firstName,
    };
  } catch {
    return defaultProfile;
  }
}

export function useRepProfile(): RepProfile {
  const [profile, setProfile] = useState<RepProfile>(defaultProfile);

  useEffect(() => {
    setProfile(readRepProfile());
  }, []);

  return profile;
}
