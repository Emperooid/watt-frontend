import Image from "next/image";

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm ${className}`}>
      <Image src="/1.jpg" alt="WattAmIUsing" width={64} height={64} className="h-full w-full object-contain" />
    </span>
  );
}
