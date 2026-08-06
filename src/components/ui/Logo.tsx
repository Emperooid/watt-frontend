import Image from "next/image";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <Image
      src="/1-removebg-preview.png"
      alt="WattAmIUsing"
      width={64}
      height={64}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
