import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/navbar";
import StoreProvider from "@/app/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ethermail SSO Test",
  description: "This was created to test SSO by EtherMail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <StoreProvider>
        <div>
          <NavBar />
          {children}
        </div>
      </StoreProvider>
      </body>
    </html>
  );
}
