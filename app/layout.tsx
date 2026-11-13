import "../globals.css";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "EpicPix Media - Professional Media Production Portfolio",
  description: "EpicPix Media - Corporate videos, commercials, brand films, photography, content creation, and drone cinematography",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
