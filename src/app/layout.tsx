import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nagham Jaza — Full-Stack Developer",
  description:
    "Thoughtful code. Remarkable experiences. A full-stack developer portfolio exploring scalable web architecture, beautiful interfaces, and the MERN stack.",
};

export const viewport: Viewport = { themeColor: "#101210" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
