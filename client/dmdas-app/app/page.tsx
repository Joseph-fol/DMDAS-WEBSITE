import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffafb] text-[#3d1a27]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-7rem] h-72 w-72 rounded-full bg-[#f6ebef] blur-2xl" />
        <div className="absolute right-[-4rem] top-[8rem] h-56 w-56 rounded-full bg-[#f5e6eb] blur-2xl" />
        <div className="absolute bottom-[-8rem] left-[-6rem] h-80 w-80 rounded-full bg-[#f9edf1] blur-2xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <div className="mx-auto mb-6 flex w-fit items-center gap-3 lg:mx-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b78f9d] bg-white/70">
                <svg
                  viewBox="0 0 64 64"
                  className="h-10 w-10 fill-none stroke-[#5e2337] stroke-[2.6]"
                  aria-hidden="true"
                >
                  <path d="M8 24c6-4 14-6 24-4 10-2 18 0 24 4v24c-6-4-14-6-24-4-10-2-18 0-24 4V24Z" />
                  <path d="M32 20v28" />
                  <circle cx="32" cy="12" r="5" />
                  <path d="M18 32h10m18 0h-8" />
                  <path d="m38 38 4 4 8-8" />
                </svg>
              </div>
            </div>

            <p className="mb-2 text-3xl font-black text-[#5e2337]">
              DMDAS
            </p>
            {/* <h1 className="mx-auto max-w-xl text-balance text-4xl font-black leading-tight sm:text-5xl lg:mx-0">
              Digital Manual Distribution and Accountability System
            </h1> */}
            <div className="mx-auto my-7 h-px w-24 bg-[#d6b8c3] lg:mx-0" />
            <p className="mx-auto max-w-xl text-pretty text-lg leading-8 text-[#6f5a63] lg:mx-0">
              Streamline manual distribution. Ensure accountability. Empower
              education.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/signup"
                className="group inline-flex h-12 min-w-52 items-center justify-center gap-3 rounded-xl bg-[#5e2337] px-6 text-base font-semibold text-white transition hover:bg-[#772d46]"
              >
                Get Started
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 10h11.5l-3.2-3.2 1.4-1.4L18.4 11l-5.7 5.6-1.4-1.4 3.2-3.2H3v-2Z" />
                </svg>
              </Link>

              <Link
                href="/signin"
                className="inline-flex h-12 min-w-52 items-center justify-center rounded-xl border border-[#b88f9d] bg-white/80 px-6 text-base font-semibold text-[#5e2337] transition hover:border-[#9d6b7c] hover:bg-white"
              >
                Log In
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-lg justify-center">
            <div className="absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 rounded-full border border-dashed border-[#e2c9d2]" />
            <div className="absolute bottom-8 left-2 h-16 w-16 rounded-full bg-[#efcdd8]/70" />
            <div className="absolute right-3 top-8 h-20 w-20 rounded-full bg-[#f3dde4]/70" />
            <div className="relative z-10 overflow-hidden rounded-3xl border border-[#e7d2d9] bg-white/85 p-4 shadow-[0_20px_50px_rgba(90,35,53,0.18)]">
              <Image
                src="/dmdas-logo.png"
                alt="DMDAS logo"
                width={430}
                height={430}
                priority
                className="h-auto w-[18rem] object-contain sm:w-[21rem]"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
