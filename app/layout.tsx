import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Base Operations | Portfolio Analysis",
  description:
    "BaseScore portfolio analysis. Street-level crime intelligence for your branch footprint.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-surface-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
