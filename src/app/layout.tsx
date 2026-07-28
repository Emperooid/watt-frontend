import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WattAmIUsing — Know your power. Control your costs.",
    template: "%s — WattAmIUsing",
  },
  description:
    "Find out how much any appliance costs to run on Nigerian electricity tariffs, in under 20 seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
