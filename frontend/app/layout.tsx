import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Sistem Informasi Klinik Sentosa",
  description: "Workflow management for Klinik Sentosa"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-muted min-h-screen">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
