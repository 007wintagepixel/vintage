import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/admin/Sidebar";
import { AdminProviders } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ludo Nexus Admin",
  description: "Admin dashboard for Ludo Nexus",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AdminProviders>
          <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6 lg:p-8 ml-64">
              {children}
            </main>
          </div>
        </AdminProviders>
      </body>
    </html>
  );
}
