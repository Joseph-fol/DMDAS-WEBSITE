"use client";

import axios from "axios";
import { useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiUrl } from "../lib/apiUrl";

type RegistrationValues = {
  fullName: string;
  email: string;
  matricNumber: string;
  department: string;
  phoneNumber: string;
  level: string;
  role: "student" | "rep";
  pin: string;
};

const departments = [
  "Computer Engineering",
  "Electrical & Electronics Engineering",
  "Civil Engineering",
  "Agricultural Engineering",
  "Mechanical Engineering",
  "Food Engineering"
];

const levels = ["100", "200", "300", "400", "500"];

const initialValues: RegistrationValues = {
  fullName: "",
  email: "",
  matricNumber: "",
  department: "",
  phoneNumber: "",
  level: "",
  role: "student",
  pin: "",
};


const validationSchema = Yup.object({
  fullName: Yup.string().trim().min(3, "Enter your full name").required("Full name is required"),
  email: Yup.string().trim().email("Enter a valid email").required("Email is required"),
  matricNumber: Yup.string().trim().matches(/^[A-Za-z0-9_-]+$/, "Use letters, numbers, hyphen or underscore only").required("Matric number is required"),
  department: Yup.string().required("Department is required"),
  phoneNumber: Yup.string().trim().matches(/^[0-9+\s-]{8,20}$/, "Enter a valid WhatsApp number").required("WhatsApp number is required"),
  level: Yup.string().required("Level is required"),
  role: Yup.mixed<RegistrationValues["role"]>().oneOf(["student", "rep"]).required(),
  pin: Yup.string().matches(/^\d{4}$/, "PIN must be exactly 4 digits").required("PIN is required"),
});

function InputError({ name }: { name: keyof RegistrationValues }) {
  return <ErrorMessage name={name} component="p" className="mt-1 text-xs font-medium text-rose-500" />;
}

export default function Signup() {
  const router = useRouter();
  const pinInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async ( values: RegistrationValues, actions: FormikHelpers<RegistrationValues>,) =>{
    setSuccessMessage(null);
    setErrorMessage(null);

    const payload = {...values, whatsapp: values.phoneNumber,};
    console.log("Registration payload:", payload);
    try {
      const response = await axios.post<{ message?: string }>(apiUrl("/api/signup"), payload);
      const data = response.data;

      setSuccessMessage(data.message ?? "Registration request received successfully.");
      setTimeout(() => router.push("/signin"), 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? "Unable to submit registration.",
        );
      } else {
        setErrorMessage(error instanceof Error ? error.message : "Unable to submit registration.");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdf8f9] font-sans text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-375 lg:grid-cols-[1.05fr_0.95fr]">
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
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.8]" aria-hidden="true">
                  <path d="M3 8.5L12 4l9 4.5-9 4.5-9-4.5Z" />
                  <path d="M6.5 10.25v4.5c0 .9 2.46 2.25 5.5 2.25s5.5-1.35 5.5-2.25v-4.5" />
                </svg>
              </div>
              <span className="text-3xl font-black tracking-tight text-[#381E25]">DMDAS</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-[#381E25] lg:text-5xl">
              Get Started with DMDAS
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-slate-900">
              Join the ecosystem to purchase or distribute academic resources safely.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-140 rounded-xl bg-white/90 p-6 ring-1 ring-slate-200/70 backdrop-blur md:p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Create DMDAS Account</h2>
              <p className="mt-2 text-sm text-[#F43F5E]">
                Already registered? <Link href="/signin" className="font-semibold hover:underline">Login</Link>
              </p>
            </div>

            {successMessage ? (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                {successMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                {errorMessage}
              </div>
            ) : null}

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, setFieldValue, isSubmitting, touched, errors }) => (
                <Form className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="fullName">
                        Full Name
                      </label>
                      <Field
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your fullname"
                        className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          touched.fullName && errors.fullName ? "border-rose-400" : "border-slate-200"
                        }`}
                      />
                      <InputError name="fullName" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="email">
                        Email Address
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="student@edu.ng"
                        className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          touched.email && errors.email ? "border-rose-400" : "border-slate-200"
                        }`}
                      />
                      <InputError name="email" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="matricNumber">
                        Matric Number
                      </label>
                      <Field
                        id="matricNumber"
                        name="matricNumber"
                        type="text"
                        placeholder="e.g., 2021_0451"
                        className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          touched.matricNumber && errors.matricNumber ? "border-rose-400" : "border-slate-200"
                        }`}
                      />
                      <InputError name="matricNumber" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="department">
                        Department
                      </label>
                      <Field
                        as="select"
                        id="department"
                        name="department"
                        className={`h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          touched.department && errors.department ? "border-rose-400" : "border-slate-200"
                        }`}
                      >
                        <option value="" disabled hidden>Select Option</option>
                        {departments.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </Field>
                      <InputError name="department" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="whatsapp">
                        WhatsApp Phone Number
                      </label>
                      <Field
                        id="whatsapp"
                        name="phoneNumber"
                        type="tel"
                        placeholder="e.g., 234803..."
                        className={`h-11 w-full rounded-xl border px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          touched.phoneNumber && errors.phoneNumber ? "border-rose-400" : "border-slate-200"
                        }`}
                      />
                      <InputError name="phoneNumber" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-900" htmlFor="level">
                        Level
                      </label>
                      <Field
                        as="select"
                        id="level"
                        name="level"
                        className={`h-11 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                          touched.level && errors.level ? "border-rose-400" : "border-slate-200"
                        }`}
                      >
                        <option value="" disabled hidden>Select Option</option>
                        {levels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </Field>
                      <InputError name="level" />
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-900">Register Account As:</p>
                    <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                      {[
                        { label: "Student", value: "student" as const },
                        { label: "Course Representative", value: "rep" as const },
                      ].map((option) => {
                        const active = values.role === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFieldValue("role", option.value)}
                            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                              active
                                ? "bg-white text-slate-950 ring-1 ring-slate-200"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                    <InputError name="role" />
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-900">Create 4-Digit Security PIN</p>
                    <div className="flex gap-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <input
                          key={index}
                          ref={(node) => {
                            pinInputRefs.current[index] = node;
                          }}
                          inputMode="numeric"
                          type="password"
                          maxLength={1}
                          value={values.pin[index] ?? ""}
                          onChange={(event) => {
                            const nextDigit = event.target.value.replace(/\D/g, "").slice(-1);
                            const nextPin = values.pin.padEnd(4, "").split("");
                            nextPin[index] = nextDigit;
                            setFieldValue("pin", nextPin.join("").trim());

                            if (nextDigit && index < 3) {
                              pinInputRefs.current[index + 1]?.focus();
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Backspace" && !values.pin[index] && index > 0) {
                              pinInputRefs.current[index - 1]?.focus();
                            }
                          }}
                          className={`h-12 w-12 rounded-xl border text-center text-lg font-bold tracking-[0.25em] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${
                            touched.pin && errors.pin ? "border-rose-400" : "border-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <InputError name="pin" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-3 flex h-14 w-full items-center justify-center rounded-2xl bg-[#381E25] text-sm font-bold text-white transition hover:bg-[#F43F5E] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Authenticating..." : "Complete Registration"}
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
