import "../globals.css";
import type { ReactNode } from "react";

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
    <html lang="en">
      <body className="bg-background font-body antialiased">
        {children}
      </body>
    </html>
  );
}
