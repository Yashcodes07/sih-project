// app/layout.tsx - SERVER COMPONENT
import Navbar from "@/components/Navbar";
import "./globals.css";
import "leaflet/dist/leaflet.css"; // ✅ Leaflet styles for maps
import SessionWrapper from "@/components/Sessionwrapper";
import { ReactNode } from "react";

export const metadata = {
  title: "Civic-Hub",
  description: "Crowdsourced Civic Issue Reporting",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <SessionWrapper>
          <Navbar />
          <main className="min-h-screen px-6 py-4">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
