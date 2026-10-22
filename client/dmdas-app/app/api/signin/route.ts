import { NextResponse } from "next/server";

type SigninPayload = {
  matricNumber?: string;
  pin?: string;
};

const requiredFields: Array<keyof SigninPayload> = ["matricNumber", "pin"];

export async function POST(request: Request) {
  let payload: SigninPayload;

  try {
    payload = (await request.json()) as SigninPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const missingField = requiredFields.find((field) => !String(payload[field] ?? "").trim());

  if (missingField) {
    return NextResponse.json({ message: `${String(missingField)} is required.` }, { status: 400 });
  }

  if (!/^\d{4}$/.test(String(payload.pin))) {
    return NextResponse.json({ message: "PIN must be exactly 4 digits." }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: "Sign-in payload received successfully.",
      data: {
        matricNumber: String(payload.matricNumber).trim(),
        pin: String(payload.pin),
      },
    },
    { status: 200 },
  );
}