import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PowerWise — Know. Plan. Save.",
  description:
    "Estimate how much your appliances cost to run on Nigerian electricity tariffs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
