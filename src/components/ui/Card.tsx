import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-xl border border-card-border bg-card-bg p-4 sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}
