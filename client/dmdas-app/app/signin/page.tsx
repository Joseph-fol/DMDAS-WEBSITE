"use client";

import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiUrl } from "../lib/apiUrl";

type SigninValues = {
  matricNumber: string;
  pin: string;
};

type SigninResponse = {
  message?: string;
  token?: string;
  role?: string;
  [key: string]: unknown;
};

const initialValues: SigninValues = {
  matricNumber: "",
  pin: "",
};

const validationSchema = Yup.object({
  matricNumber: Yup.string().trim().required("Matric number is required"),
  pin: Yup.string()
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
    .required("PIN is required"),
});

function InputError({ name }: { name: keyof SigninValues }) {
  return (
    <ErrorMessage
      name={name}
      component="p"
      className="mt-1 text-xs font-medium text-[#ef4444]"
    />
  );
}

export default function Signin() {
  const router = useRouter();
  const pinInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (
    values: SigninValues,
    actions: FormikHelpers<SigninValues>,
  ) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setRemainingAttempts(null);

    const payload = {
      matricNumber: values.matricNumber.trim(),
      pin: values.pin,
    };

    try {
      const response = await axios.post<SigninResponse>(
        apiUrl("/api/signin"),
        payload,
      );
      
      const remainingHeader = response.headers["ratelimit-remaining"];
      const remaining = Number(remainingHeader);
      setRemainingAttempts(
        Number.isInteger(remaining) && remaining >= 0 ? remaining : null,
      );
      setSuccessMessage(
        response.data.message ?? "Access granted successfully.",
      );
      const userData = response.data;
      actions.resetForm();
      pinInputRefs.current[0]?.focus();

      if (userData.token) {
        sessionStorage.setItem("token", userData.token);
      }

      if (userData) {
        sessionStorage.setItem("Student", JSON.stringify(userData));
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const remainingHeader = error.response?.headers["ratelimit-remaining"];
        const remaining = Number(remainingHeader);
        setRemainingAttempts(
          Number.isInteger(remaining) && remaining >= 0 ? remaining : null,
        );
        setErrorMessage(
          (error.response?.data as { message?: string } | undefined)?.message ??
            error.message ??
            "Unable to verify account.",
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to verify account.",
        );
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdf8f9] text-[#081124]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative isolate hidden overflow-hidden border-r border-slate-200/70 bg-[#fde7ed] px-10 py-12 lg:flex lg:flex-col lg:justify-center">
          <div className="absolute inset-0">
            <div className="absolute left-[-10%] top-[8%] h-288 w-6xl rounded-full border border-[#381E25]" />
            <div className="absolute left-[6%] top-[18%] h-216 w-216 rounded-full border border-[#c5a7af]" />
            <div className="absolute right-[18%] top-[12%] h-16 w-16 rounded-full border border-[#F43F5E] bg-white " />
            <div className="absolute right-[22%] top-[16.4%] h-3 w-3 rounded-full bg-[#381E25]" />
          </div>

          <div className="relative mx-auto max-w-xl text-center">
            <div className="mx-auto mb-6 flex w-fit items-center gap-4 rounded-full bg-transparent px-6 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F43F5E] text-white ">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 fill-none stroke-current stroke-[1.8]"
                  aria-hidden="true"
                >
                  <path d="M3 8.5L12 4l9 4.5-9 4.5-9-4.5Z" />
                  <path d="M6.5 10.25v4.5c0 .9 2.46 2.25 5.5 2.25s5.5-1.35 5.5-2.25v-4.5" />
                </svg>
              </div>
              <span className="text-3xl font-black tracking-tight text-[#381E25]">
                DMDAS
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-[#381E25] lg:text-5xl">
              Signin to DMDAS
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-slate-900">
              Secure campus gateway for academic resources.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-140 rounded-xl bg-white/90 p-7 ring-1 ring-slate-200/70">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0b1324]">
                Access Portal
              </h2>
              <p className="mt-2 text-sm text-[#5d7597]">
                Enter your credentials to continue.
              </p>

              <p className="mt-2 text-sm text-[#F43F5E]">
                {" "}
                Do not have account yet?{" "}
                <Link href="/signup" className="font-semibold hover:underline">
                  Signup
                </Link>
              </p>
            </div>

            {successMessage ? (
              <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {successMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                {errorMessage}
              </div>
            ) : null}

            {remainingAttempts !== null ? (
              <div
                className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
                role="status"
              >
                Remaining login attempts: {remainingAttempts}
              </div>
            ) : null}

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, isSubmitting, touched, errors }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      className="mb-2 block text-sm font-semibold text-[#0b1324]"
                      htmlFor="matricNumber"
                    >
                      Matric Number
                    </label>
                    <Field
                      id="matricNumber"
                      name="matricNumber"
                      type="text"
                      placeholder="e.g., 2021_0451"
                      autoComplete="username"
                      className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#0b1324] outline-none transition placeholder:text-[#98a8bf] focus:border-[#2f68f6] focus:ring-4 focus:ring-[#dfeaff] ${
                        touched.matricNumber && errors.matricNumber
                          ? "border-rose-400"
                          : "border-[#d8e2f1]"
                      }`}
                    />
                    <InputError name="matricNumber" />
                  </div>

                  <div>
                    <label
                      className="mb-3 block text-sm font-semibold text-[#0b1324]"
                      htmlFor="pin-0"
                    >
                      4-Digit Account PIN
                    </label>
                    <div className="flex gap-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <input
                          key={index}
                          ref={(node) => {
                            pinInputRefs.current[index] = node;
                          }}
                          id={index === 0 ? "pin-0" : undefined}
                          type="password"
                          inputMode="numeric"
                          maxLength={1}
                          autoComplete={index === 0 ? "one-time-code" : "off"}
                          value={values.pin[index] ?? ""}
                          onChange={(event) => {
                            const nextDigit = event.target.value
                              .replace(/\D/g, "")
                              .slice(-1);
                              
                            const nextPin = values.pin.padEnd(4, " ").split("");
                            nextPin[index] = nextDigit;
                            setFieldValue(
                              "pin",
                              nextPin.join("").replace(/\s/g, "").slice(0, 4),
                            );

                            if (nextDigit && index < 3) {
                              pinInputRefs.current[index + 1]?.focus();
                            }
                          }}
                          onKeyDown={(event) => {
                            if (
                              event.key === "Backspace" &&
                              !values.pin[index] &&
                              index > 0
                            ) {
                              pinInputRefs.current[index - 1]?.focus();
                            }
                          }}
                          className={`h-11 w-11 rounded-xl border bg-white text-center text-base font-semibold text-[#0b1324] outline-none transition focus:border-[#2f68f6] focus:ring-4 focus:ring-[#dfeaff] sm:h-12 sm:w-12 ${
                            touched.pin && errors.pin
                              ? "border-rose-400"
                              : "border-[#d8e2f1]"
                          }`}
                        />
                      ))}
                    </div>
                    <InputError name="pin" />
                  </div>
                  <p className="mt-2 text-sm text-[#F43F5E]">
                    {" "}
                    Forgot password?{" "}
                    <Link
                      href="/forgotPassword"
                      className="font-semibold hover:underline"
                    >
                      Reset pin
                    </Link>
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#381E25] text-sm font-bold text-white transition hover:bg-[#F43F5E] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Signining..." : "Initialize Signin"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </div>
    </main>
  );
}
