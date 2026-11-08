import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "../globals.css";

const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Alqudra dashboard" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" dir="ltr" className={almarai.variable}>
      <body className="bg-paper">{children}</body>
    </html>
  );
}
