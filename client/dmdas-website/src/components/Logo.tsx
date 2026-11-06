import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "default" | "white" | "compact";
}

export default function Logo({ className = "", variant = "default" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 group select-none ${className}`}>
      <Image
        src="/dmdas-logo.png"
        alt="DMDAS"
        width={192}
        height={192}
        className="h-12 w-12 object-contain"
      />
      {variant !== "compact" && (
        <span className={`text-xl font-black tracking-tight ${variant === "white" ? "text-white" : "text-[#E1193E]"}`}>
          DMDAS
        </span>
      )}
    </Link>
  );
}
