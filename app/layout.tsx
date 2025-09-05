// app/layout.tsx - SERVER COMPONENT
import Navbar from "@/components/Navbar";
import "./globals.css";
import "leaflet/dist/leaflet.css"; // ✅ Leaflet styles for maps
import SessionWrapper from "@/components/Sessionwrapper";
import { ReactNode } from "react";

export const metadata = {
  title: "CrowdSync - Jharkhand",
  description: "Real-time Civic Issue Reporting and Management System",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Navbar />
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
