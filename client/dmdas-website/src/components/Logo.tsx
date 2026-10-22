import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "default" | "white" | "compact";
}

export default function Logo({ className = "", variant = "default" }: LogoProps) {
  const isWhite = variant === "white";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Red Isometric / Book-Box Icon */}
      <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
        >
          {/* Isometric Box / Hexagonal Book Contour */}
          <path
            d="M20 3L36 12V28L20 37L4 28V12L20 3Z"
            stroke="#E1193E"
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill={isWhite ? "transparent" : "#FFF5F7"}
          />
          {/* Inner isometric folds / box flaps */}
          <path
            d="M20 3V20M36 12L20 20M4 12L20 20"
            stroke="#E1193E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Document / Manual sheets floating inside */}
          <path
            d="M13 14L20 18L27 14M13 19L20 23L27 19M13 24L20 28L27 24"
            stroke="#E1193E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {variant !== "compact" && (
        <div className="flex flex-col text-left">
          <span
            className={`font-black text-xl tracking-tight leading-none ${
              isWhite ? "text-white" : "text-[#E1193E]"
            }`}
          >
            DMDAS
          </span>
          <span
            className={`text-[10px] font-medium leading-tight mt-0.5 max-w-[140px] tracking-tight ${
              isWhite ? "text-gray-200" : "text-gray-600"
            }`}
          >
            Digital Manual Distribution and Accountability System
          </span>
        </div>
      )}
    </Link>
  );
}
