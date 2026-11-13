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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground font-body antialiased min-h-screen flex flex-col relative" suppressHydrationWarning>
        <div className="ambient-glow-mesh" aria-hidden="true" />
        <Header />
        <div className="flex-1 relative z-10">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
