import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./home/provider";
import getSession from "./lib/getSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Think Twice Code Once",
  description: "A place to share your code",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <html lang="en">
      <head></head>
      <body
        className={inter.className + " antialiased bg-gray-50"}
      >
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  );
}
