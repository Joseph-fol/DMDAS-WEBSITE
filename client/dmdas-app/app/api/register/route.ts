import { NextResponse } from "next/server";

type RegistrationPayload = {
  fullName?: string;
  email?: string;
  matricNumber?: string;
  department?: string;
  whatsapp?: string;
  level?: string;
  role?: "student" | "representative";
  pin?: string;
};

const requiredFields: Array<keyof RegistrationPayload> = [
  "fullName",
  "email",
  "matricNumber",
  "department",
  "whatsapp",
  "level",
  "role",
  "pin",
];

export async function POST(request: Request) {
  let payload: RegistrationPayload;

  try {
    payload = (await request.json()) as RegistrationPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const missingField = requiredFields.find((field) => !String(payload[field] ?? "").trim());

  if (missingField) {
    return NextResponse.json(
      { message: `${String(missingField)} is required.` },
      { status: 400 },
    );
  }

  if (!/^\d{4}$/.test(String(payload.pin))) {
    return NextResponse.json({ message: "PIN must be exactly 4 digits." }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Registration request received successfully.",
      data: payload,
    },
    { status: 200 },
  );
}
