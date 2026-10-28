import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted", display: "swap" });

export const metadata: Metadata = {
  title: "PennyWise",
  description: "A money companion for young earners",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E0D0C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={schibsted.variable}>
      <body>
        <div className="stage">
          <div className="phone">
            <ToastProvider>{children}</ToastProvider>
            <div id="overlay-root" />
          </div>
        </div>
      </body>
    </html>
  );
}
