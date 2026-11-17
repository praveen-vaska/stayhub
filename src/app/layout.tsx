import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { AuthProvider } from "@/lib/auth/context";
import CompareGlobalProvider from "@/components/compare/CompareGlobalProvider";
import { ThemeProvider, themeInitScript } from "@/components/theme/ThemeProvider";
import CursorFollower from "@/components/motion/CursorFollower";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "StayHub | Find PGs, Hotels, Lodges, Hostels & Rooms Anywhere in India",
  description:
    "India's premier accommodation discovery platform. Find verified PGs, coliving spaces, boutique hotels, budget lodges, hostels, and rental apartments across Hyderabad, Bengaluru, Mumbai, Pune, Chennai, and other major cities.",
  keywords: [
    "PG in Hyderabad",
    "Gachibowli PG",
    "Madhapur coliving",
    "Hotels in Hyderabad",
    "Hostels in Jubilee Hills",
    "Rental rooms",
    "Apartments in Hitech City",
  ],
  authors: [{ name: "StayHub Platform Inc." }],
  openGraph: {
    title: "StayHub | Find PGs, Hotels, Lodges & Rooms Anywhere",
    description: "Centralized accommodation discovery with Google Maps accuracy, verified amenities, and transparent pricing.",
    siteName: "StayHub",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#142D4E" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1424" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-surface text-primary dark:bg-[#0A1424] dark:text-slate-100 flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CompareGlobalProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CursorFollower />
            </CompareGlobalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
